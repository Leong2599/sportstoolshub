import {describe, expect, it} from 'vitest';
import {
  classifyDelta,
  compareTitle,
  compareWithBaseline,
  decodeEntities,
  extractCanonical,
  extractH1s,
  extractHrefs,
  extractRefreshUrl,
  extractTitle,
  normalizeRoute,
  normalizeText,
  parseArgs,
  parseRssLinks,
  parseRobotsGroups,
  parseSitemapUrls,
  parseTagSlugs,
  robotsAllowsEverything,
} from '../../scripts/parity-check.mjs';

describe('text helpers', () => {
  it('decodes named and numeric entities', () => {
    expect(decodeEntities('Tom &amp; Jerry &mdash; &#8217;til &#x2014; ok')).toBe(
      'Tom & Jerry \u2014 \u2019til \u2014 ok',
    );
  });

  it('keeps unknown entities untouched', () => {
    expect(decodeEntities('&unknown;')).toBe('&unknown;');
  });

  it('normalizes markup, entities and whitespace', () => {
    expect(normalizeText('  <span>Basketball</span>\n&nbsp;  Drills  ')).toBe(
      'Basketball Drills',
    );
  });
});

describe('HTML extraction', () => {
  const page = [
    '<html><head>',
    '<title data-rh=true>BMI Calculator | Sports Tools Hub</title>',
    '<link href="https://sportstoolshub.com/tools/bmi-calculator" rel="canonical">',
    '</head><body>',
    '<h1 id=tool-title>BMI Calculator</h1>',
    '<h2>Your result</h2>',
    '<a href=/tools/pace-calculator>Pace</a>',
    '<a href="https://example.com/">External</a>',
    '</body></html>',
  ].join('');

  it('reads the title of an SSR page with unquoted attributes', () => {
    expect(extractTitle(page)).toBe('BMI Calculator | Sports Tools Hub');
  });

  it('reads the h1s', () => {
    expect(extractH1s(page)).toEqual(['BMI Calculator']);
    expect(extractH1s('<h1>One</h1><h1>Two</h1>')).toEqual(['One', 'Two']);
    expect(extractH1s('<p>No headings</p>')).toEqual([]);
  });

  it('reads the canonical link whatever the attribute order or quoting', () => {
    expect(extractCanonical(page)).toBe('https://sportstoolshub.com/tools/bmi-calculator');
    expect(extractCanonical('<link rel="canonical" href="/about">')).toBe('/about');
    expect(extractCanonical('<meta name="description" content="x">')).toBe('');
  });

  it('reads the meta refresh target', () => {
    expect(
      extractRefreshUrl(
        '<meta http-equiv="refresh" content="0; url=https://sportstoolshub.com/about">',
      ),
    ).toBe('https://sportstoolshub.com/about');
    expect(extractRefreshUrl('<meta http-equiv="refresh" content="0;url=/blog">')).toBe('/blog');
    expect(extractRefreshUrl('<meta charset="utf-8">')).toBe('');
  });

  it('collects anchor hrefs', () => {
    expect(extractHrefs(page)).toEqual(['/tools/pace-calculator', 'https://example.com/']);
  });
});

describe('normalizeRoute', () => {
  it('turns absolute URLs into root-relative routes', () => {
    expect(normalizeRoute('https://sportstoolshub.com/tools/bmi-calculator')).toBe(
      '/tools/bmi-calculator',
    );
    expect(normalizeRoute('https://sportstoolshub.com/')).toBe('/');
    expect(normalizeRoute('https://sportstoolshub.com/blog/post/')).toBe('/blog/post');
  });

  it('strips a base path', () => {
    expect(normalizeRoute('https://example.com/sportstools/about', {
      origin: 'https://example.com',
      basePath: '/sportstools/',
    })).toBe('/about');
  });

  it('keeps the query string and fragment out of the route', () => {
    expect(normalizeRoute('/about?x=1#top')).toBe('/about');
  });

  it('returns an empty route for empty input', () => {
    expect(normalizeRoute('')).toBe('');
  });
});

describe('sitemap, feeds and tags', () => {
  it('parses sitemap locs', () => {
    const xml = '<urlset><url><loc>https://a.test/</loc></url><url><loc> https://a.test/about </loc></url></urlset>';
    expect(parseSitemapUrls(xml)).toEqual(['https://a.test/', 'https://a.test/about']);
  });

  it('parses RSS item links', () => {
    const xml =
      '<rss><channel><item><title><![CDATA[x]]></title><link>https://a.test/blog/x</link></item>' +
      '<item><link>https://a.test/blog/y</link></item></channel></rss>';
    expect(parseRssLinks(xml)).toEqual(['https://a.test/blog/x', 'https://a.test/blog/y']);
  });

  it('parses the top-level tag slugs of blog/tags.yml', () => {
    const yaml = [
      '# comment',
      'basketball:',
      '  label: "Basketball"',
      '  description: "Hoops"',
      'table-tennis:',
      '  label: "Table Tennis"',
    ].join('\n');
    expect(parseTagSlugs(yaml)).toEqual(['basketball', 'table-tennis']);
  });
});

describe('robots.txt', () => {
  const wildcard = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /tmp/',
    '',
    'User-agent: AhrefsBot',
    'Disallow: /',
    '',
    'Sitemap: https://sportstoolshub.com/sitemap.xml',
  ].join('\n');

  it('groups rules by user agent', () => {
    const groups = parseRobotsGroups(wildcard);
    expect(groups.map((group) => group.agents)).toEqual([['*'], ['ahrefsbot']]);
    expect(groups[0].rules).toEqual([
      {key: 'allow', value: '/'},
      {key: 'disallow', value: '/tmp/'},
    ]);
  });

  it('accepts bot-specific disallows when all agents may crawl', () => {
    expect(robotsAllowsEverything(wildcard)).toBe(true);
  });

  it('rejects a global disallow', () => {
    expect(robotsAllowsEverything('User-agent: *\nDisallow: /')).toBe(false);
  });

  it('rejects a robots.txt without an all-agents block', () => {
    expect(robotsAllowsEverything('User-agent: Googlebot\nAllow: /')).toBe(false);
  });
});

describe('compareTitle', () => {
  it('accepts identical titles', () => {
    expect(compareTitle('About | Sports Tools Hub', 'About | Sports Tools Hub')).toBe('exact');
  });

  it('accepts the site-wide suffix replacing a legacy per-page suffix', () => {
    expect(
      compareTitle(
        'BMI Calculator - Free Body Mass Index Calculator | Sports Tools Hub',
        'BMI Calculator | Sports Tools Hub',
      ),
    ).toBe('site-suffix');
    expect(
      compareTitle(
        '10 Essential Drills | Basketball Training Guide',
        '10 Essential Drills',
      ),
    ).toBe('site-suffix');
  });

  it('flags a different leading phrase', () => {
    expect(
      compareTitle(
        'Cycling Endurance Training: Building Stamina for Long Rides | Cycling Guide',
        'Cycling Endurance Training: Building Stamina for Long-Distance Riding | Sports Tools Hub',
      ),
    ).toBe('delta');
  });
});

describe('classifyDelta', () => {
  it('marks headings whose emoji the legacy markup garbled', () => {
    expect(classifyDelta('/tools/pace-calculator.html', 'h1', '\u26A1 Pace Calculator', 'Pace Calculator')).toBe(
      'emoji-stripped',
    );
  });

  it('attributes blog and catalog pages to their frontmatter', () => {
    expect(classifyDelta('/blog/golf/x.html', 'title', 'A', 'B')).toBe('blog-frontmatter');
    expect(classifyDelta('/tools/x.html', 'h1', 'A', 'B')).toBe('catalog-frontmatter');
    expect(classifyDelta('/about.html', 'title', 'A', 'B')).toBe('static-page-frontmatter');
  });

  it('marks pages the legacy site shipped without a heading', () => {
    expect(classifyDelta('/tools/x.html', 'h1', '', 'X Tool')).toBe('source-missing');
  });
});

describe('compareWithBaseline', () => {
  const delta = {path: '/a.html', field: 'h1', source: 'Old', built: 'New', category: 'x'};

  it('accepts a reviewed delta that did not change', () => {
    const result = compareWithBaseline([delta], {deltas: [delta]});
    expect(result).toMatchObject({unreviewed: [], changed: [], stale: [], reviewed: 1});
  });

  it('reports an unreviewed delta', () => {
    const result = compareWithBaseline([delta], {deltas: []});
    expect(result.unreviewed).toHaveLength(1);
    expect(result.reviewed).toBe(0);
  });

  it('reports a delta that changed since review', () => {
    const result = compareWithBaseline(
      [{...delta, built: 'Newest'}],
      {deltas: [delta]},
    );
    expect(result.changed).toHaveLength(1);
  });

  it('reports a stale baseline entry', () => {
    const result = compareWithBaseline([], {deltas: [delta]});
    expect(result.stale).toHaveLength(1);
  });
});

describe('parseArgs', () => {
  it('defaults to the directory mode over build/', () => {
    const options = parseArgs([]);
    expect(options).toMatchObject({dir: 'build', baseUrl: '', basePath: '/', updateBaseline: false});
  });

  it('strips the trailing slash of a base URL', () => {
    expect(parseArgs(['--base-url=http://localhost:3100/']).baseUrl).toBe(
      'http://localhost:3100',
    );
  });

  it('rejects unknown flags', () => {
    expect(() => parseArgs(['--nope=1'])).toThrow(/Unknown argument/);
  });
});
