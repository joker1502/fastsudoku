import fs from 'node:fs';
import path from 'node:path';
import { evaluate } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';

const RUNTIME = { Fragment, jsx, jsxs, development: false, remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] };
const dir = path.join(process.cwd(), 'src', 'content', 'guides');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort();
let fail = 0;
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  // strip frontmatter for body scans
  const body = src.replace(/^---\n[\s\S]*?\n---\n/, '');
  const backticks = (body.match(/`/g) || []).length;
  const braces = (body.match(/[{}]/g) || []).length;
  const nakedLt = (body.match(/<(?![a-zA-Z/!])/g) || []).length;
  try {
    const res = await evaluate(src, RUNTIME);
    const meta = res.frontmatter ?? {};
    const title = String(meta.title ?? '');
    const desc = String(meta.description ?? '');
    const tags = Array.isArray(meta.tags) ? meta.tags : [];
    const ok = desc.length >= 120 && desc.length <= 160;
    const tagOk = tags.length >= 2 && tags.length <= 3;
    const bt = backticks % 2 === 0 ? 'bt-ok' : 'BT-ODD';
    console.log(`OK  ${f} | title=${title.length} desc=${desc.length}${ok ? '' : ' DESC-OUT'} tags=${tags.length}${tagOk ? '' : ' TAGS-OUT'} ${bt} braces=${braces} nakedLt=${nakedLt}`);
  } catch (e) {
    fail = 1;
    console.log(`FAIL ${f}: ${e.message.split('\n')[0]}`);
  }
}
process.exit(fail);