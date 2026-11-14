#!/usr/bin/env node
/**
 * Blog conversion pipeline for the legacy Sports Tools Hub site.
 *
 * Reads the read-only source site, extracts post metadata from the blog
 * index, converts each post body from HTML to MDX, and writes MDX files
 * into the repository's `blog/` directory alongside `authors.yml` and
 * `tags.yml`.
 *
 * Usage:
 *   node scripts/convert-blog.mjs --source=<sport_tools path> [options]
 *
 * Options:
 *   --source=<path>   Path to the read-only source site (required).
 *   --sports=a,b      Only convert these sports (default: all).
 *   --posts=a.html,b  Only convert these source post file names.
 *   --dry-run         Report what would be written without writing.
 *   --check           Exit non-zero if a post could not be converted.
 *
 * The script is idempotent: running it twice produces identical output.
 */

import {existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, join, posix} from 'node:path';

/** Sports that get their own tag page, in the order the plan lists them. */
export const SPORTS = [
  'basketball',
  'boxing',
  'cricket',
  'cycling',
  'golf',
  'hockey',
  'karate',
  'pickleball',
  'soccer',
  'squash',
  'swimming',
  'table-tennis',
  'tennis',
  'wrestling',
];

/** Display labels for the sport tags, read from the source index cards. */
const SPORT_LABELS = {
  basketball: 'Basketball',
  boxing: 'Boxing',
  cricket: 'Cricket',
  cycling: 'Cycling',
  golf: 'Golf',
  hockey: 'Hockey',
  karate: 'Karate',
  pickleball: 'Pickleball',
  soccer: 'Soccer',
  squash: 'Squash',
  swimming: 'Swimming',
  'table-tennis': 'Table Tennis',
  tennis: 'Tennis',
  wrestling: 'Wrestling',
};

/**
 * Blog cards whose target file does not exist in the source tree. The
 * architecture records these as the D1 integrity gap: the index links to
 * five articles that were never written. They are dropped from the index and
 * the legacy URL contract rather than invented.
 */
export const DEAD_POST_FILES = [
  'basketball/basketball-shooting-mastery.html',
  'basketball/basketball-defense-guide.html',
  'soccer/soccer-warm-up-guide.html',
  'soccer/soccer-cooling-down-guide.html',
  'golf/golf-equipment-guide.html',
];

const MONTHS = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
};

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const BLOCK_ELEMENTS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'div',
  'dl',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'ul',
]);

/** Tags that close a previous sibling of the same kind when opened. */
const IMPLIED_CLOSERS = {
  li: ['li'],
  p: ['p'],
  dt: ['dt', 'dd'],
  dd: ['dt', 'dd'],
  td: ['td', 'th'],
  th: ['td', 'th'],
  tr: ['tr', 'td', 'th'],
  thead: ['tr', 'td', 'th', 'thead', 'tbody'],
  tbody: ['tr', 'td', 'th', 'thead', 'tbody'],
  tfoot: ['tr', 'td', 'th', 'thead', 'tbody'],
  option: ['option'],
  // A heading closes an open heading or paragraph, and a new heading closes
  // the previous one. The source has an unclosed `<h3>`, so this rule is what
  // keeps the following headings out of the previous heading's subtree.
  h1: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
  h2: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
  h3: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
  h4: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
  h5: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
  h6: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
};

/**
 * Tags that stop the implied-close search. An open list item or list means
 * the new element belongs to that list, not to the list's parent.
 */
const CLOSE_BARRIERS = new Set(['li', 'ul', 'ol', 'table', 'tr', 'td', 'th']);

export function decodeEntities(value) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
    if (code.startsWith('#')) {
      const hex = code[1]?.toLowerCase() === 'x';
      const numeric = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isNaN(numeric) ? match : String.fromCodePoint(numeric);
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

/**
 * Escapes text for MDX. MDX parses `{` and `}` as JSX expressions and a
 * leading `<` as a JSX tag, so the source's literal angle brackets and
 * braces have to be entity-encoded or the build fails.
 */
export function escapeMdxText(value) {
  return value
    .replace(/&(?![a-zA-Z#][a-zA-Z0-9]*;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

/**
 * Normalizes a tag label into a Docusaurus tag key. Keys must be unique and
 * their kebab-case permalink must not collide with another tag.
 */
export function tagKey(label) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Sorts labels case-insensitively with the raw label as a tie-breaker, so
 * the generated files have a stable order on every machine.
 */
function sortLabels(labels) {
  return [...labels].sort((left, right) => {
    const a = left.toLowerCase();
    const b = right.toLowerCase();

    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }

    if (left < right) {
      return -1;
    }

    if (left > right) {
      return 1;
    }

    return 0;
  });
}

/**
 * Builds the shared tag registry.
 *
 * Every tag used in frontmatter must exist in `blog/tags.yml` under the exact
 * same key, otherwise Docusaurus treats it as an inline tag and warns. The
 * registry therefore maps each source label to the key that will appear in
 * both places.
 *
 * Two collisions need resolving:
 * - A topic label that is really the sport name (`table tennis` for
 *   `table-tennis`) would duplicate the sport tag key. It maps to the sport
 *   key and is dropped from the topic list, because the sport tag already
 *   carries that meaning.
 * - Two spellings of the same topic (`warm up` and `warm-up`) share a
 *   kebab-case key. The first label wins and the second maps to the same
 *   key, so the two posts share one tag page instead of colliding.
 */
export function buildTagRegistry(topicLabels) {
  const sports = SPORTS.map((sport) => ({
    key: sport,
    label: SPORT_LABELS[sport],
    description: `${SPORT_LABELS[sport]} guides, training, and technique articles.`,
    permalink: `/${sport}`,
  }));
  const sportKeys = new Set(sports.map((sport) => sport.key));
  const topics = [];
  const keyByLabel = new Map();

  for (const label of sortLabels(topicLabels)) {
    const candidate = tagKey(label);

    if (!candidate) {
      continue;
    }

    if (sportKeys.has(candidate)) {
      keyByLabel.set(label, candidate);
      continue;
    }

    const existing = topics.find((topic) => topic.key === candidate);

    if (existing) {
      keyByLabel.set(label, existing.key);
      continue;
    }

    topics.push({
      key: candidate,
      label,
      description: undefined,
      permalink: `/${candidate}`,
    });
    keyByLabel.set(label, candidate);
  }

  return {sports, topics, keyByLabel};
}

/**
 * Parses the source date strings ("April 21, 2026", "Jan 20, 2026") into an
 * ISO calendar date. The source mixes full and abbreviated month names, so
 * both forms are accepted.
 */
export function parseSourceDate(value) {
  const match = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/.exec(value.trim());

  if (!match) {
    throw new Error(`Unrecognized source date: ${value}`);
  }

  const month = MONTHS[match[1].toLowerCase()];

  if (!month) {
    throw new Error(`Unrecognized month in source date: ${value}`);
  }

  const day = Number(match[2]);
  const year = Number(match[3]);
  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const parsed = new Date(`${iso}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid source date: ${value}`);
  }

  return iso;
}

/**
 * Extracts the post cards from the source blog index. Each card carries the
 * title, description, date, sport and topic tags for one post.
 */
export function parseBlogIndex(html) {
  const cards = [];
  const pattern =
    /<article class="post-card" data-category="([^"]+)">([\s\S]*?)<\/article>/g;

  for (const match of html.matchAll(pattern)) {
    const sport = match[1];
    const body = match[2];
    const href = /<h3><a href="([^"]+)">/.exec(body)?.[1];

    if (!href) {
      continue;
    }

    const title = decodeEntities(
      /<h3><a href="[^"]+">([\s\S]*?)<\/a><\/h3>/.exec(body)?.[1] ?? '',
    ).trim();
    const description = decodeEntities(
      /<\/h3>\s*<p>([\s\S]*?)<\/p>/.exec(body)?.[1] ?? '',
    ).trim();
    const dateText = /<span class="post-date">([^<]*)<\/span>/.exec(body)?.[1];
    const tags = [...body.matchAll(/<span class="tag">([^<]*)<\/span>/g)].map(
      (tagMatch) => decodeEntities(tagMatch[1]).trim(),
    );
    const readTime = /<span class="read-time">([^<]*)<\/span>/.exec(body)?.[1];

    cards.push({
      href,
      sport,
      title,
      description,
      date: dateText ? parseSourceDate(dateText) : null,
      dateText: dateText?.trim() ?? null,
      tags,
      readTime: readTime?.trim() ?? null,
    });
  }

  return cards;
}

/**
 * Rewrites a source link to the matching internal route.
 *
 * Absolute `sportstoolshub.com` URLs point at tool pages, the blog index, or
 * the home page. Relative links point at sibling posts in the same sport.
 *
 * A relative link is only rewritten when its target exists in the source
 * (`sourceRoot`, which excludes the D1 dead links) and will exist on the
 * built site (`availablePosts`). Posts are converted in batches, so linking
 * to a post that a later ticket has not converted yet would break the
 * build's `onBrokenLinks: 'throw'` check.
 */
export function rewriteLink(href, {sport, sourceRoot, availablePosts} = {}) {
  if (!href) {
    return null;
  }

  const trimmed = href.trim();

  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    let url;

    try {
      url = new URL(trimmed);
    } catch {
      return null;
    }

    if (!/(^|\.)sportstoolshub\.com$/i.test(url.hostname)) {
      return null;
    }

    const path = url.pathname.replace(/\/index\.html$/, '/');
    const hash = url.hash;

    if (path.startsWith('/tools/')) {
      const slug = path.slice('/tools/'.length).replace(/\.html$/, '');
      return slug ? `/tools/${slug}${hash}` : null;
    }

    if (path === '/blog/blog.html' || path === '/blog/') {
      return `/blog${hash}`;
    }

    if (path === '/' || path === '/index.html') {
      return `/${hash}`;
    }

    if (path.startsWith('/blog/')) {
      const slug = path.slice('/blog/'.length).replace(/\.html$/, '');
      return slug ? `/blog/${slug}${hash}` : null;
    }

    return null;
  }

  if (!sport) {
    return null;
  }

  const fileName = trimmed.split('#')[0].split('/').pop();

  if (!fileName) {
    return null;
  }

  const target = posix.join(sport, fileName);

  if (sourceRoot && !sourceRoot.has(target)) {
    return null;
  }

  if (availablePosts && !availablePosts.has(target)) {
    return null;
  }

  const slug = fileName.replace(/\.html$/, '');
  const hash = trimmed.includes('#') ? `#${trimmed.split('#')[1]}` : '';

  return `/blog/${sport}/${slug}${hash}`;
}

/**
 * Repairs inline tags whose closing bracket lost its `<`.
 *
 * The source writes `<strong>Label:</strong>` in a few places as
 * `<strong>Label:strong>`, which leaves the closing tag as text and makes
 * the browser bold everything that follows. The `<` is restored so the
 * strong run closes where the author meant it to.
 */
export function repairInlineTags(html) {
  return html.replace(
    /(?<![/<])(strong|b|em|code|mark|sup|sub)>/g,
    '</$1>',
  );
}

/**
 * Extracts the post body HTML. The source uses two interchangeable
 * wrappers - `<div class="blog-content">` and `<article class="blog-content">`
 * - so the body is read by matching the wrapper's own closing tag.
 */
export function extractBody(html) {
  const openMatch = /<(\w+)[^>]*class="blog-content">/.exec(html);

  if (!openMatch) {
    throw new Error('No blog-content wrapper found.');
  }

  const tag = openMatch[1];
  const start = html.indexOf(openMatch[0]) + openMatch[0].length;
  const closeTag = `</${tag}>`;

  let depth = 1;
  let index = start;

  while (index < html.length && depth > 0) {
    const nextOpen = html.indexOf(`<${tag}`, index);
    const nextClose = html.indexOf(closeTag, index);

    if (nextClose === -1) {
      break;
    }

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + tag.length + 1;
    } else {
      depth -= 1;
      index = nextClose + closeTag.length;
    }
  }

  return html.slice(start, index - closeTag.length);
}

/**
 * Extracts the "read next" links from the post footer. The footer is
 * duplicated chrome, but its links are the only cross-post navigation the
 * source offers, so they are kept and rewritten as internal routes.
 */
export function extractFooterLinks(html) {
  const footer = /<footer class="blog-footer">([\s\S]*?)<\/footer>/.exec(html);

  if (!footer) {
    return [];
  }

  return [...footer[1].matchAll(/<a href="([^"]+)">([\s\S]*?)<\/a>/g)].map(
    (match) => ({
      href: match[1],
      label: decodeEntities(match[2]).replace(/<[^>]*>/g, '').trim(),
    }),
  );
}

/**
 * Parses a fragment of HTML into a small tree. The source bodies use a
 * narrow, predictable subset of HTML, so a focused parser is enough and
 * keeps the converter dependency-free.
 */
export function parseHtml(html) {
  const root = {type: 'element', tag: '#root', attrs: {}, children: []};
  const stack = [root];
  const tagPattern =
    /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^"'>])*?)(\/?)>/g;

  let lastIndex = 0;

  function appendText(value) {
    if (!value) {
      return;
    }

    const parent = stack[stack.length - 1];
    parent.children.push({type: 'text', value});
  }

  function closeTag(tag) {
    // HTML5 rule for a heading end tag: an `</h3>` closes the currently open
    // heading even when the levels do not match. The source has ~30
    // mismatched heading close tags - an `<h2>` closed with `</h3>` - and a
    // browser closes the heading there rather than nesting the rest of the
    // document inside it. Reproducing that keeps the headings and the text
    // after them separate.
    if (/^h[1-6]$/.test(tag)) {
      const current = stack[stack.length - 1];

      if (current && /^h[1-6]$/.test(current.tag)) {
        stack.pop();
        return true;
      }

      return false;
    }

    // An exact match always wins, so a real `</li>` still closes its item.
    for (let index = stack.length - 1; index > 0; index -= 1) {
      if (stack[index].tag === tag) {
        stack.length = index;
        return true;
      }
    }

    // The source has one heading closed with a list end tag
    // (`<h4>When to Use:</li>`). A browser ignores the mismatched tag and
    // leaves the heading open, so the list items end up nested inside it and
    // lose their list structure. The heading is closed here instead, so the
    // items stay a list.
    if (/^(li|ul|ol|p|div|span|td|th|tr)$/.test(tag)) {
      for (let index = stack.length - 1; index > 0; index -= 1) {
        if (/^h[1-6]$/.test(stack[index].tag)) {
          stack.length = index;
          return true;
        }
      }
    }

    return false;
  }

  function closeImplied(tags) {
    for (let index = stack.length - 1; index > 0; index -= 1) {
      const tag = stack[index].tag;

      if (tags.includes(tag)) {
        stack.length = index;
        return;
      }

      if (CLOSE_BARRIERS.has(tag) || BLOCK_ELEMENTS.has(tag)) {
        return;
      }
    }
  }

  for (const match of html.matchAll(tagPattern)) {
    appendText(html.slice(lastIndex, match.index));
    lastIndex = match.index + match[0].length;

    const [, closing, rawName, rawAttrs, selfClosing] = match;
    // The source has a malformed `<stron>` open tag in two list items.
    // Normalize it to `<strong>` so the text keeps its emphasis.
    const tag = rawName.toLowerCase() === 'stron' ? 'strong' : rawName.toLowerCase();

    if (closing) {
      closeTag(tag);
      continue;
    }

    const attrs = {};

    for (const attr of rawAttrs.matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) {
      attrs[attr[1].toLowerCase()] = attr[2];
    }

    const element = {type: 'element', tag, attrs, children: []};

    if (IMPLIED_CLOSERS[tag]) {
      closeImplied(IMPLIED_CLOSERS[tag]);
    }

    const parent = stack[stack.length - 1];
    parent.children.push(element);

    if (selfClosing || VOID_ELEMENTS.has(tag)) {
      continue;
    }

    stack.push(element);
  }

  appendText(html.slice(lastIndex));

  return root.children;
}

function collapseWhitespace(value) {
  return value.replace(/\s+/g, ' ');
}

/**
 * Renders inline nodes as MDX text.
 */
function renderInline(nodes, context) {
  let output = '';

  for (const node of nodes) {
    if (node.type === 'text') {
      let text = collapseWhitespace(escapeMdxText(decodeEntities(node.value)));

      // A hard break already ends the line, so the whitespace that follows
      // it in the source HTML is dropped rather than left to indent the
      // next line into a code block.
      if (output.endsWith('  \n')) {
        text = text.replace(/^\s+/, '');
      }

      output += text;
      continue;
    }

    switch (node.tag) {
      case 'strong':
      case 'b': {
        const inner = renderInline(node.children, context).trim();

        output += inner ? `**${inner}**` : '';
        break;
      }
      case 'em':
      case 'i': {
        const inner = renderInline(node.children, context).trim();

        output += inner ? `*${inner}*` : '';
        break;
      }
      case 'a': {
        const label = renderInline(node.children, context).trim();
        const target = rewriteLink(node.attrs.href ?? '', context);

        output += target && label ? `[${label}](${target})` : label;
        break;
      }
      case 'br': {
        output += '  \n';
        break;
      }
      case 'code': {
        output += `\`${renderInline(node.children, context).trim()}\``;
        break;
      }
      default: {
        output += renderInline(node.children, context);
      }
    }
  }

  return output;
}

/**
 * Renders table rows collected from the parsed tree into a GFM table.
 */
function renderTable(table, context) {
  const rows = [];

  function collect(node) {
    if (node.type !== 'element') {
      return;
    }

    if (node.tag === 'tr') {
      const cells = node.children.filter(
        (child) => child.type === 'element' && (child.tag === 'td' || child.tag === 'th'),
      );

      rows.push(
        cells.map((cell) => renderInline(cell.children, context).trim()),
      );
      return;
    }

    for (const child of node.children) {
      collect(child);
    }
  }

  collect(table);

  if (rows.length === 0) {
    return '';
  }

  const columnCount = rows[0].length;
  const formatRow = (cells) => {
    const padded = [...cells];

    while (padded.length < columnCount) {
      padded.push('');
    }

    return `| ${padded.map((cell) => cell.replace(/\|/g, '\\|')).join(' | ')} |`;
  };

  const separator = `| ${Array.from({length: columnCount}, () => '---').join(' | ')} |`;

  return [
    formatRow(rows[0]),
    separator,
    ...rows.slice(1).map((row) => formatRow(row)),
  ].join('\n');
}

/**
 * Renders a list element and its items as MDX.
 */
function renderList(list, context, ordered) {
  const items = [];
  let index = 0;

  for (const child of list.children) {
    if (child.type !== 'element' || child.tag !== 'li') {
      continue;
    }

    index += 1;

    const {inline, blocks} = partitionListItem(child, context);
    const marker = ordered ? `${index}. ` : '- ';
    const text = inline.trim();
    const nested = blocks.map((block) =>
      block
        .split('\n')
        .map((line) => (line.trim() ? `  ${line}` : line))
        .join('\n'),
    );

    if (!text && nested.length === 0) {
      items.push(marker.trimEnd());
      continue;
    }

    items.push([`${marker}${text}`, ...nested].join('\n'));
  }

  return items.join('\n');
}

/**
 * Splits a list item into its inline run and any nested block content, so a
 * bold label and its text stay on one line while nested lists keep their
 * own indentation.
 */
function partitionListItem(item, context) {
  const inlineNodes = [];
  const blockNodes = [];

  for (const child of item.children) {
    if (child.type === 'text') {
      inlineNodes.push(child);
      continue;
    }

    if (child.tag === 'p') {
      inlineNodes.push(...child.children);
      continue;
    }

    if (BLOCK_ELEMENTS.has(child.tag)) {
      blockNodes.push(child);
      continue;
    }

    inlineNodes.push(child);
  }

  return {
    inline: renderInline(inlineNodes, context),
    blocks: renderBlocks(blockNodes, context),
  };
}

/**
 * Renders parsed nodes into MDX blocks separated by blank lines.
 */
function renderBlocks(nodes, context) {
  const blocks = [];

  for (const node of nodes) {
    if (node.type === 'text') {
      const text = collapseWhitespace(escapeMdxText(decodeEntities(node.value))).trim();

      if (text) {
        blocks.push(text);
      }

      continue;
    }

    switch (node.tag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const level = Number(node.tag.slice(1));
        const text = renderInline(node.children, context).trim();

        if (text) {
          blocks.push(`${'#'.repeat(level)} ${text}`);
        }

        break;
      }
      case 'p': {
        const text = renderInline(node.children, context).trim();

        if (text) {
          blocks.push(text);
        }

        break;
      }
      case 'ul': {
        const list = renderList(node, context, false);

        if (list) {
          blocks.push(list);
        }

        break;
      }
      case 'ol': {
        const list = renderList(node, context, true);

        if (list) {
          blocks.push(list);
        }

        break;
      }
      case 'li': {
        // The source has one list whose items follow a heading that was
        // closed with `</li>`, leaving no open `<ul>`. A browser still renders
        // those items as list items, so consecutive siblings are kept as one
        // list.
        const item = renderInline(node.children, context).trim();

        if (item) {
          blocks.push(`- ${item}`);
        }

        break;
      }
      case 'table': {
        const table = renderTable(node, context);

        if (table) {
          blocks.push(table);
        }

        break;
      }
      case 'blockquote': {
        const inner = renderBlocks(node.children, context)
          .filter((block) => block.trim())
          .map((block) => block.split('\n').map((line) => `> ${line}`).join('\n'))
          .join('\n\n');

        if (inner) {
          blocks.push(inner);
        }

        break;
      }
      case 'hr': {
        blocks.push('---');
        break;
      }
      case 'br': {
        break;
      }
      default: {
        if (BLOCK_ELEMENTS.has(node.tag)) {
          const inner = renderBlocks(node.children, context);

          for (const block of inner) {
            if (block.trim()) {
              blocks.push(block);
            }
          }

          break;
        }

        const text = renderInline(node.children, context).trim();

        if (text) {
          blocks.push(text);
        }
      }
    }
  }

  return blocks;
}

/**
 * Converts a source post body from HTML to MDX.
 */
export function htmlToMdx(html, context = {}) {
  const nodes = parseHtml(html);
  const blocks = renderBlocks(nodes, context)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  // Consecutive list-item blocks are one list, not separate paragraphs.
  const merged = [];

  for (const block of blocks) {
    const previous = merged[merged.length - 1];

    if (previous && /^- /.test(block) && /^- /.test(previous)) {
      merged[merged.length - 1] = `${previous}\n${block}`;
      continue;
    }

    merged.push(block);
  }

  return merged.join('\n\n');
}

/**
 * Adds a truncate marker after the opening paragraph.
 *
 * The source blog index shows a short card excerpt per post. Without a
 * truncate marker Docusaurus renders each post's full body on the blog list
 * page, so the marker is what preserves the source's card-style index.
 *
 * MDX does not accept HTML comments, so the marker uses the JSX comment
 * form the plugin also supports.
 */
export function withTruncateMarker(mdx) {
  const blocks = mdx.split('\n\n');
  const first = blocks[0];

  if (!first || first.startsWith('#')) {
    return mdx;
  }

  blocks.splice(1, 0, '{/* truncate */}');
  return blocks.join('\n\n');
}

function yamlString(value) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function yamlList(values) {
  return `[${values.map((value) => yamlString(value)).join(', ')}]`;
}

/**
 * Builds the MDX document for one post.
 *
 * The tag list uses the registry keys rather than the source labels, so the
 * frontmatter resolves against `blog/tags.yml` instead of falling back to
 * inline tags.
 */
export function buildPostMdx({
  meta,
  bodyHtml,
  footerLinks,
  sourceRoot,
  availablePosts,
  registry,
  relatedToolsBySport,
}) {
  const context = {sport: meta.sport, sourceRoot, availablePosts};
  const tagKeys = [meta.sport];

  for (const label of meta.topicTags) {
    const key = registry?.keyByLabel.get(label) ?? tagKey(label);

    if (!tagKeys.includes(key)) {
      tagKeys.push(key);
    }
  }

  const frontMatter = [
    '---',
    `title: ${yamlString(meta.title)}`,
    `description: ${yamlString(meta.description)}`,
    `date: ${meta.date}`,
    `slug: ${yamlString(`${meta.sport}/${meta.slug}`)}`,
    `tags: ${yamlList(tagKeys)}`,
    `authors: ${yamlList(['sports-tools-hub'])}`,
    '---',
    '',
  ].join('\n');

  const body = withTruncateMarker(htmlToMdx(bodyHtml, context));
  const sections = [body];

  if (footerLinks.length > 0) {
    const items = footerLinks
      .map((link) => {
        const target = rewriteLink(link.href, context);
        const label = escapeMdxText(link.label);

        return target ? `- [${label}](${target})` : `- ${label}`;
      })
      .join('\n');

    sections.push(`## Read Next\n\n${items}`);
  }

  const relatedTools = relatedToolsFor(meta.sport, relatedToolsBySport);

  if (relatedTools.length > 0) {
    const items = relatedTools
      .map(
        (tool) =>
          `- [${escapeMdxText(tool.title)}](/tools/${tool.slug})`,
      )
      .join('\n');

    sections.push(`## Related Tools\n\n${items}`);
  }

  return `${frontMatter}${sections.filter(Boolean).join('\n\n')}\n`;
}

/**
 * Loads the per-sport related-tool map. It lives in `src/data` so the same
 * file can be read by the converter and validated by the test suite.
 */
export function loadRelatedTools(cwd = process.cwd()) {
  const file = join(cwd, 'src', 'data', 'blog-related-tools.json');

  if (!existsSync(file)) {
    return {};
  }

  return JSON.parse(readFileSync(file, 'utf8'));
}

/**
 * Returns the tools related to a sport, for the "Related Tools" section.
 *
 * The source blog posts never link to the calculators, so the related-tool
 * links are a new cross-linking layer driven by `src/data/blog-related-tools.json`.
 */
export function relatedToolsFor(sport, relatedToolsBySport) {
  return relatedToolsBySport?.[sport] ?? [];
}

/**
 * Writes the shared `blog/authors.yml` file.
 */
export function buildAuthorsYaml() {  return [
    'sports-tools-hub:',
    '  name: Sports Tools Hub',
    '  title: Sports Tools Hub',
    '  url: https://sportstoolshub.com',
    '  socials:',
    '    twitter: sportstoolshub',
    '',
  ].join('\n');
}

/**
 * Writes the shared `blog/tags.yml` file from the tag registry. Sport tags
 * come first so the 14 sport tag pages are obvious, followed by the topic
 * tags used by the posts.
 */
export function buildTagsYaml(registry) {
  const lines = [];

  for (const sport of registry.sports) {
    lines.push(`${sport.key}:`);
    lines.push(`  label: ${yamlString(sport.label)}`);
    lines.push(`  description: ${yamlString(sport.description)}`);
    lines.push('');
  }

  for (const topic of registry.topics) {
    lines.push(`${topic.key}:`);
    lines.push(`  label: ${yamlString(topic.label)}`);

    if (topic.description) {
      lines.push(`  description: ${yamlString(topic.description)}`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

function listSourcePosts(blogRoot) {
  const posts = [];

  for (const sport of readdirSync(blogRoot)) {
    const sportDir = join(blogRoot, sport);

    if (!statSync(sportDir).isDirectory()) {
      continue;
    }

    for (const file of readdirSync(sportDir)) {
      if (!file.endsWith('.html')) {
        continue;
      }

      posts.push(`${sport}/${file}`);
    }
  }

  return posts;
}

/**
 * Lists the posts already converted into the repository's `blog/` directory.
 * These are the posts that exist on the built site, so their cross-links
 * can be kept even when a later batch has not converted the target yet.
 */
function listConvertedPosts(blogDir) {
  const posts = new Set();

  if (!existsSync(blogDir)) {
    return posts;
  }

  for (const sport of readdirSync(blogDir)) {
    const sportDir = join(blogDir, sport);

    if (!statSync(sportDir).isDirectory()) {
      continue;
    }

    for (const file of readdirSync(sportDir)) {
      if (file.endsWith('.mdx')) {
        posts.add(`${sport}/${file.replace(/\.mdx$/, '.html')}`);
      }
    }
  }

  return posts;
}

export function parseArgs(argv) {
  const args = {
    source: null,
    sports: [],
    posts: [],
    dryRun: false,
    check: false,
  };

  for (const arg of argv) {
    if (arg.startsWith('--source=')) {
      args.source = arg.slice('--source='.length);
    } else if (arg.startsWith('--sports=')) {
      args.sports = arg
        .slice('--sports='.length)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    } else if (arg.startsWith('--posts=')) {
      args.posts = arg
        .slice('--posts='.length)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--check') {
      args.check = true;
    }
  }

  return args;
}

export function convertBlog({source, sports = [], posts = [], dryRun = false, check = false, cwd = process.cwd()}) {
  const blogRoot = join(source, 'blog');
  const indexHtml = readFileSync(join(blogRoot, 'blog.html'), 'utf8');
  const cards = parseBlogIndex(indexHtml);
  const sourceRoot = new Set(listSourcePosts(blogRoot));
  const dead = new Set(DEAD_POST_FILES);
  const relatedToolsBySport = loadRelatedTools(cwd);

  const wanted = new Set();

  for (const post of sourceRoot) {
    const sport = post.split('/')[0];
    const file = post.split('/').pop();

    if (sports.length > 0 && !sports.includes(sport)) {
      continue;
    }

    if (posts.length > 0 && !posts.includes(file)) {
      continue;
    }

    wanted.add(post);
  }

  const converted = [];
  const skipped = [];
  const allTopicLabels = new Set();

  // The tag registry covers every post in the source, not only the posts
  // converted in this run, so the shared `tags.yml` stays complete as later
  // batch tickets convert the remaining sports.
  for (const card of cards) {
    if (dead.has(card.href)) {
      continue;
    }

    for (const tag of card.tags) {
      if (tag.toLowerCase() !== card.sport) {
        allTopicLabels.add(tag);
      }
    }
  }

  const registry = buildTagRegistry(allTopicLabels);
  const availablePosts = listConvertedPosts(join(cwd, 'blog'));

  // Posts converted by this run are on the site too, so their mutual
  // cross-links survive.
  for (const post of wanted) {
    availablePosts.add(post);
  }

  for (const card of cards) {
    if (dead.has(card.href)) {
      skipped.push({href: card.href, reason: 'source file missing (D1)'});
      continue;
    }

    if (!wanted.has(card.href)) {
      continue;
    }

    const html = readFileSync(join(blogRoot, card.href), 'utf8');
    const bodyHtml = repairInlineTags(extractBody(html));
    const footerLinks = extractFooterLinks(html);
    const slug = card.href.split('/').pop().replace(/\.html$/, '');
    const cardTopicTags = card.tags.filter(
      (tag) => tag.toLowerCase() !== card.sport,
    );

    converted.push({
      href: card.href,
      outPath: posix.join('blog', card.sport, `${slug}.mdx`),
      mdx: buildPostMdx({
        meta: {
          title: card.title,
          description: card.description,
          date: card.date,
          sport: card.sport,
          slug,
          topicTags: cardTopicTags,
        },
        bodyHtml,
        footerLinks,
        sourceRoot,
        availablePosts,
        registry,
        relatedToolsBySport,
      }),
    });
  }

  for (const post of wanted) {
    if (!converted.some((entry) => entry.href === post)) {
      skipped.push({href: post, reason: 'no index card'});
    }
  }

  if (!dryRun) {
    for (const entry of converted) {
      const target = join(cwd, entry.outPath);
      mkdirSync(dirname(target), {recursive: true});
      writeFileSync(target, entry.mdx);
    }

    mkdirSync(join(cwd, 'blog'), {recursive: true});
    writeFileSync(join(cwd, 'blog', 'authors.yml'), buildAuthorsYaml());
    writeFileSync(
      join(cwd, 'blog', 'tags.yml'),
      buildTagsYaml(registry),
    );
  }

  return {converted, skipped};
}

function main(argv) {
  const args = parseArgs(argv);

  if (!args.source) {
    console.error(
      'Usage: node scripts/convert-blog.mjs --source=<sport_tools path>',
    );
    process.exit(1);
  }

  const {converted, skipped} = convertBlog(args);

  console.log(`Converted ${converted.length} post(s).`);

  for (const entry of converted) {
    console.log(`  ${entry.href} -> ${entry.outPath}`);
  }

  if (skipped.length > 0) {
    console.log(`Skipped ${skipped.length} post(s):`);

    for (const entry of skipped) {
      console.log(`  ${entry.href} (${entry.reason})`);
    }
  }

  if (args.check && converted.length === 0) {
    process.exit(1);
  }
}

if (
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))
) {
  main(process.argv.slice(2));
}
