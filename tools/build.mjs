import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const src = path.join(root, 'src');
const partialsDir = path.join(src, 'partials');
const pagesDir = path.join(src, 'pages');

const partials = {};
for (const f of fs.readdirSync(partialsDir)) {
  partials[path.basename(f, '.html')] = fs.readFileSync(path.join(partialsDir, f), 'utf8');
}

const pages = [
  { file: 'home.html', out: 'index.html' },
  { file: 'category.html', out: 'category.html' },
  { file: 'product.html', out: 'product.html' },
];

function expand(tpl, vars) {
  let out = tpl.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => {
    if (!partials[name]) throw new Error(`missing partial: ${name}`);
    return expand(partials[name], vars);
  });
  out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) => (key in vars ? vars[key] : m));
  return out;
}

for (const p of pages) {
  const raw = fs.readFileSync(path.join(pagesDir, p.file), 'utf8');
  const fm = raw.match(/^<!--\s*([\s\S]*?)-->/);
  const vars = { page: '' };
  if (fm) {
    for (const line of fm[1].split('\n')) {
      const m = line.match(/^\s*(\w+)\s*:\s*(.+?)\s*$/);
      if (m) vars[m[1]] = m[2];
    }
  }
  const body = raw.replace(/^<!--\s*[\s\S]*?-->\s*/, '');
  const html = expand(body, vars);
  fs.writeFileSync(path.join(root, p.out), html, 'utf8');
  console.log(`${p.out}  (${(html.length / 1024).toFixed(1)} KB)`);
}
console.log('build ok');
