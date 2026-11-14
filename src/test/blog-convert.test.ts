import {describe, expect, it} from 'vitest';
import {browserHeadingLevels, mdxHeadingLevels} from '../../scripts/compare-headings.mjs';
import {sourceHasEmptyHeading} from '../../scripts/review-blog.mjs';
import {
  buildPostMdx,
  buildTagRegistry,
  buildTagsYaml,
  decodeEntities,
  DEAD_POST_FILES,
  escapeMdxText,
  extractBody,
  extractFooterLinks,
  htmlToMdx,
  parseBlogIndex,
  parseSourceDate,
  relatedToolsFor,
  repairInlineTags,
  rewriteLink,
  SPORTS,
  tagKey,
  withTruncateMarker,
} from '../../scripts/convert-blog.mjs';
import blogRelatedTools from '../data/blog-related-tools.json';
import {tools} from '../data/tools';

const sourceRoot = new Set([
  'swimming/swimming-strokes-guide.html',
  'swimming/swimming-drills-mastery.html',
  'swimming/swimming-fundamentals-101.html',
]);

describe('source date parsing', () => {
  it('accepts full and abbreviated month names', () => {
    expect(parseSourceDate('April 21, 2026')).toBe('2026-04-21');
    expect(parseSourceDate('Jan 20, 2026')).toBe('2026-01-20');
    expect(parseSourceDate('Feb 5, 2026')).toBe('2026-02-05');
    expect(parseSourceDate('December 1, 2026')).toBe('2026-12-01');
  });

  it('rejects dates it cannot read', () => {
    expect(() => parseSourceDate('21/04/2026')).toThrow(/Unrecognized source date/);
    expect(() => parseSourceDate('Smarch 4, 2026')).toThrow(
      /Unrecognized month/,
    );
  });
});

describe('blog index parsing', () => {
  const index = `
    <article class="post-card" data-category="swimming">
      <div class="post-header">
        <span class="post-category swimming">Swimming</span>
        <span class="post-date">February 5, 2026</span>
      </div>
      <h3><a href="swimming/swimming-strokes-guide.html">Swimming Strokes Guide</a></h3>
      <p>Complete guide to all four competitive swimming strokes.</p>
      <div class="post-meta">
        <span class="read-time">14 min read</span>
        <div class="post-tags">
          <span class="tag">swimming</span>
          <span class="tag">technique</span>
        </div>
      </div>
    </article>`;

  it('extracts title, description, date, sport, and tags', () => {
    const [card] = parseBlogIndex(index);

    expect(card?.title).toBe('Swimming Strokes Guide');
    expect(card?.description).toBe(
      'Complete guide to all four competitive swimming strokes.',
    );
    expect(card?.date).toBe('2026-02-05');
    expect(card?.sport).toBe('swimming');
    expect(card?.tags).toEqual(['swimming', 'technique']);
    expect(card?.readTime).toBe('14 min read');
    expect(card?.href).toBe('swimming/swimming-strokes-guide.html');
  });
});

describe('link rewriting', () => {
  it('rewrites absolute tool links to internal routes', () => {
    expect(
      rewriteLink('https://sportstoolshub.com/tools/bmi-calculator.html'),
    ).toBe('/tools/bmi-calculator');
    expect(
      rewriteLink('https://sportstoolshub.com/tools/bmi-calculator'),
    ).toBe('/tools/bmi-calculator');
    expect(
      rewriteLink('https://sportstoolshub.com/index.html#tools'),
    ).toBe('/#tools');
    expect(rewriteLink('https://sportstoolshub.com/blog/blog.html')).toBe(
      '/blog',
    );
  });

  it('rewrites relative sibling links to blog routes', () => {
    expect(
      rewriteLink('swimming-drills-mastery.html', {
        sport: 'swimming',
        sourceRoot,
      }),
    ).toBe('/blog/swimming/swimming-drills-mastery');
  });

  it('drops links whose target does not exist in the source', () => {
    expect(
      rewriteLink('swimming-missing-guide.html', {
        sport: 'swimming',
        sourceRoot,
      }),
    ).toBeNull();
    expect(
      rewriteLink('https://sportstoolshub.com/tools/not-a-tool.html'),
    ).toBe('/tools/not-a-tool');
  });

  it('leaves external, mail, and anchor links alone', () => {
    expect(rewriteLink('https://example.com/post')).toBeNull();
    expect(rewriteLink('mailto:hello@example.com')).toBe(
      'mailto:hello@example.com',
    );
    expect(rewriteLink('#section')).toBeNull();
  });
});

describe('MDX text escaping', () => {
  it('escapes characters MDX would treat as syntax', () => {
    expect(escapeMdxText('<55% of FTP')).toBe('&lt;55% of FTP');
    expect(escapeMdxText('a { b } c')).toBe('a &#123; b &#125; c');
    expect(escapeMdxText('100% & rising')).toBe('100% &amp; rising');
  });

  it('decodes the named entities the source uses', () => {
    expect(decodeEntities('Rock &amp; Roll')).toBe('Rock & Roll');
    expect(decodeEntities('&ldquo;quoted&rdquo;')).toBe('“quoted”');
  });
});

describe('tag keys', () => {
  it('normalizes labels into Docusaurus tag keys', () => {
    expect(tagKey('Table Tennis')).toBe('table-tennis');
    expect(tagKey('age group swimming')).toBe('age-group-swimming');
  });
});

describe('body extraction', () => {
  it('reads both source body wrappers', () => {
    const div = '<div class="blog-content"><p>Div body</p></div>';
    const article = '<article class="blog-content"><p>Article body</p></article>';

    expect(extractBody(div)).toBe('<p>Div body</p>');
    expect(extractBody(article)).toBe('<p>Article body</p>');
  });

  it('throws when the wrapper is missing', () => {
    expect(() => extractBody('<div class="other">x</div>')).toThrow(
      /No blog-content wrapper/,
    );
  });
});

describe('footer link extraction', () => {
  it('reads the read-next links from the post footer', () => {
    const html = `
      <footer class="blog-footer">
        <p>Check out our <a href="swimming-drills-mastery.html">drills guide</a>.</p>
      </footer>`;

    expect(extractFooterLinks(html)).toEqual([
      {href: 'swimming-drills-mastery.html', label: 'drills guide'},
    ]);
  });

  it('returns nothing when the post has no link footer', () => {
    expect(extractFooterLinks('<div class="blog-footer"></div>')).toEqual([]);
  });
});

describe('HTML to MDX conversion', () => {
  it('converts headings, paragraphs, and lists', () => {
    const mdx = htmlToMdx(`
      <h2>Freestyle</h2>
      <p>Freestyle is the fastest stroke.</p>
      <h3>Key Characteristics</h3>
      <ul>
        <li><strong>Arm Movement:</strong> Alternating recovery</li>
        <li>Continuous flutter kick</li>
      </ul>`);

    expect(mdx).toBe(
      [
        '## Freestyle',
        'Freestyle is the fastest stroke.',
        '### Key Characteristics',
        '- **Arm Movement:** Alternating recovery\n- Continuous flutter kick',
      ].join('\n\n'),
    );
  });

  it('converts ordered lists with numbering', () => {
    const mdx = htmlToMdx(
      '<ol><li>First</li><li>Second</li></ol>',
    );

    expect(mdx).toBe('1. First\n2. Second');
  });

  it('converts tables to GFM tables', () => {
    const mdx = htmlToMdx(`
      <table>
        <tr><th>Stroke</th><th>Speed</th></tr>
        <tr><td>Freestyle</td><td>Fastest</td></tr>
        <tr><td>Breaststroke</td><td>Slow</td></tr>
      </table>`);

    expect(mdx).toBe(
      [
        '| Stroke | Speed |',
        '| --- | --- |',
        '| Freestyle | Fastest |',
        '| Breaststroke | Slow |',
      ].join('\n'),
    );
  });

  it('turns a line break into a markdown hard break', () => {
    const mdx = htmlToMdx(
      '<p><strong>Mistake:</strong> Rushing it.<br><strong>Correction:</strong> Slow down.</p>',
    );

    expect(mdx).toBe(
      '**Mistake:** Rushing it.  \n**Correction:** Slow down.',
    );
  });

  it('recovers the source malformed strong tag', () => {
    const mdx = htmlToMdx(
      '<ul><li><stron>Recovery Position:</strong> Find shelter</li></ul>',
    );

    expect(mdx).toBe('- **Recovery Position:** Find shelter');
  });

  it('escapes literal angle brackets so MDX does not read a tag', () => {
    const mdx = htmlToMdx(
      '<ul><li><strong>Power:</strong> <55% of FTP</li></ul>',
    );

    expect(mdx).toBe('- **Power:** &lt;55% of FTP');
  });

  it('keeps list items when the source heading was closed with a list tag', () => {
    // The source closes `<h4>When to Use:</h4>` with `</li>` and leaves the
    // items with no open `<ul>`. A browser still renders them as a list, so
    // the converter keeps them as one instead of folding them into the
    // heading.
    const mdx = htmlToMdx(
      '<h4>When to Use:</li><li>Shots from angle</li><li>Rebound control</li></ul>',
    );

    expect(mdx).toBe(
      '#### When to Use:\n\n- Shots from angle\n- Rebound control',
    );
  });

  it('keeps a heading that the source left unclosed out of the previous one', () => {
    const mdx = htmlToMdx(
      '<h3>First</h3><h3>Second</h3><p>Body</p>',
    );

    expect(mdx).toBe('### First\n\n### Second\n\nBody');
  });

  it('closes a heading whose close tag has the wrong level', () => {
    // The source closes some `<h2>` elements with `</h3>`. A browser closes
    // the heading there; if the parser did not, the rest of the document
    // would nest inside the heading and render as one long heading.
    const mdx = htmlToMdx(
      '<h2>Fast Break</h3><p>Transition offense.</p><h3>Primary Break</h3>',
    );

    expect(mdx).toBe(
      '## Fast Break\n\nTransition offense.\n\n### Primary Break',
    );
  });

  it('rewrites links inside the body to internal routes', () => {
    const mdx = htmlToMdx(
      '<p>See the <a href="swimming-drills-mastery.html">drills guide</a>.</p>',
      {sport: 'swimming', sourceRoot},
    );

    expect(mdx).toBe(
      'See the [drills guide](/blog/swimming/swimming-drills-mastery).',
    );
  });
});

describe('related tools', () => {
  const catalogSlugs = new Set<string>(tools.map((tool) => tool.slug));
  const catalogTitles = new Map<string, string>(
    tools.map((tool) => [tool.slug, tool.title] as const),
  );

  it('only references tools that exist in the catalog', () => {
    for (const [sport, entries] of Object.entries(blogRelatedTools)) {
      for (const entry of entries) {
        expect(
          catalogSlugs.has(entry.slug),
          `${sport} references unknown tool ${entry.slug}`,
        ).toBe(true);
      }
    }
  });
  it('uses the catalog title for every referenced tool', () => {
    for (const entries of Object.values(blogRelatedTools)) {
      for (const entry of entries) {
        expect(entry.title).toBe(catalogTitles.get(entry.slug));
      }
    }
  });

  it('points the combat sports at the weight-class and training-load tools', () => {
    for (const sport of ['boxing', 'karate'] as const) {
      const slugs = blogRelatedTools[sport].map((tool) => tool.slug);

      expect(slugs).toContain('combat-sports-weight-class-optimizer');
      expect(slugs).toContain('training-load-calculator');
    }
  });

  it('covers every sport in the catalog', () => {
    expect(Object.keys(blogRelatedTools).sort()).toEqual([...SPORTS].sort());
  });

  it('returns the tools for a sport and nothing for an unknown one', () => {
    expect(relatedToolsFor('boxing', blogRelatedTools)).toHaveLength(2);
    expect(relatedToolsFor('curling', blogRelatedTools)).toEqual([]);
  });
});

describe('inline tag repair', () => {
  it('restores the bracket on a closing tag that lost its "<"', () => {
    // The source writes `<strong>Label:</strong>` as `<strong>Label:strong>` in
    // a few places, which leaves the closing tag as text and makes the
    // browser bold everything that follows.
    const repaired = repairInlineTags(
      '<li><strong>Lew Alcindor:</strong> Dominant center</li>',
    );

    expect(repaired).toBe(
      '<li><strong>Lew Alcindor:</strong> Dominant center</li>',
    );
  });

  it('leaves well-formed tags alone', () => {
    const html = '<li><strong>Label:</strong> Text</li><p>Plain</p>';

    expect(repairInlineTags(html)).toBe(html);
  });
});

describe('empty heading detection', () => {
  it('matches a heading that is empty in the source too', () => {
    const source =
      '<h4>Types of Breakouts:</h4>\n\n<h4>Three-Up/Two-Back:</h4>\n<ul><li>Three forwards deep</li></ul>';

    expect(sourceHasEmptyHeading(source, 'Types of Breakouts:')).toBe(true);
    expect(sourceHasEmptyHeading(source, 'Three-Up/Two-Back:')).toBe(false);
  });

  it('returns false without a source', () => {
    expect(sourceHasEmptyHeading(null, 'Anything:')).toBe(false);
  });
});

describe('heading structure parity', () => {
  it('reports the heading levels a browser produces from the source', () => {
    const source = browserHeadingLevels(
      '<h2>One</h2><p>Body</p><h3>Two</h3><p>Body</p>',
    );

    expect(source).toEqual(['h2', 'h3']);
  });

  it('closes a heading whose close tag names the wrong level', () => {
    const source = browserHeadingLevels(
      '<h2>Sample Day</h3><p>Body</p><h4>Early Tee Time</h4>',
    );

    expect(source).toEqual(['h2', 'h4']);
  });

  it('reads the heading levels of a converted body', () => {
    const levels = mdxHeadingLevels(
      '## One\n\nBody\n\n### Two\n\n## Read Next\n\n- item',
    );

    expect(levels).toEqual(['h2', 'h3']);
  });
});

describe('truncate marker', () => {  it('adds the marker after the opening paragraph', () => {
    const mdx = withTruncateMarker('Intro paragraph.\n\n## Section\n\nBody.');

    expect(mdx).toBe(
      'Intro paragraph.\n\n{/* truncate */}\n\n## Section\n\nBody.',
    );
  });

  it('leaves a post that opens with a heading alone', () => {
    const mdx = '## Section\n\nBody.';

    expect(withTruncateMarker(mdx)).toBe(mdx);
  });
});

describe('post document assembly', () => {
  const registry = buildTagRegistry(['technique', 'warm up']);

  it('writes frontmatter and body with the sport-scoped slug', () => {
    const mdx = buildPostMdx({
      meta: {
        title: 'Swimming Strokes Guide',
        description: 'All four competitive strokes.',
        date: '2026-02-05',
        sport: 'swimming',
        slug: 'swimming-strokes-guide',
        topicTags: ['technique'],
      },
      bodyHtml: '<p>Body text.</p>',
      footerLinks: [
        {href: 'swimming-drills-mastery.html', label: 'drills guide'},
      ],
      sourceRoot,
      availablePosts: sourceRoot,
      registry,
      relatedToolsBySport: blogRelatedTools,
    });

    expect(mdx).toContain('title: "Swimming Strokes Guide"');
    expect(mdx).toContain('date: 2026-02-05');
    expect(mdx).toContain('slug: "swimming/swimming-strokes-guide"');
    expect(mdx).toContain('tags: ["swimming", "technique"]');
    expect(mdx).toContain('authors: ["sports-tools-hub"]');
    expect(mdx).toContain('Body text.');
    expect(mdx).toContain(
      '- [drills guide](/blog/swimming/swimming-drills-mastery)',
    );
  });
});

describe('tag registry', () => {
  it('maps a source label to the key used in frontmatter and tags.yml', () => {
    const registry = buildTagRegistry(['Swimming Technique', 'age group']);

    expect(registry.keyByLabel.get('Swimming Technique')).toBe(
      'swimming-technique',
    );
    expect(registry.keyByLabel.get('age group')).toBe('age-group');
    expect(registry.topics.map((topic) => topic.key)).toEqual([
      'age-group',
      'swimming-technique',
    ]);
  });

  it('maps a topic that repeats the sport name onto the sport key', () => {
    const registry = buildTagRegistry(['table tennis']);

    expect(registry.keyByLabel.get('table tennis')).toBe('table-tennis');
    expect(
      registry.topics.some((topic) => topic.key === 'table-tennis'),
    ).toBe(false);
  });

  it('merges two spellings of the same topic onto one key', () => {
    const registry = buildTagRegistry(['warm up', 'warm-up']);

    expect(registry.keyByLabel.get('warm up')).toBe('warm-up');
    expect(registry.keyByLabel.get('warm-up')).toBe('warm-up');
    expect(
      registry.topics.filter((topic) => topic.key === 'warm-up'),
    ).toHaveLength(1);
  });

  it('gives every sport a tag entry', () => {
    const registry = buildTagRegistry([]);

    expect(registry.sports).toHaveLength(14);
    expect(registry.sports.map((sport) => sport.key)).toEqual(SPORTS);
  });
});

describe('tags file', () => {
  it('lists every sport tag first, then the topic tags', () => {
    const yaml = buildTagsYaml(buildTagRegistry(['technique', 'warm up']));

    expect(yaml).toContain('swimming:\n  label: "Swimming"');
    expect(yaml).toContain('table-tennis:\n  label: "Table Tennis"');
    expect(yaml).toContain('technique:\n  label: "technique"');
    expect(yaml).toContain('warm-up:\n  label: "warm up"');
  });

  it('never writes a duplicate tag key', () => {
    const yaml = buildTagsYaml(
      buildTagRegistry(['table tennis', 'warm up', 'warm-up', 'technique']),
    );
    const keys = yaml
      .split('\n')
      .filter((line) => line.endsWith(':') && !line.startsWith(' '))
      .map((line) => line.slice(0, -1));

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('covers all 14 sports', () => {
    expect(SPORTS).toHaveLength(14);
    expect(new Set(SPORTS).size).toBe(14);
  });
});

describe('dead source links', () => {
  it('lists the five index cards that have no source page', () => {
    expect(DEAD_POST_FILES).toHaveLength(5);
    expect(DEAD_POST_FILES).toContain(
      'golf/golf-equipment-guide.html',
    );
    expect(DEAD_POST_FILES).toContain(
      'basketball/basketball-shooting-mastery.html',
    );
  });
});
