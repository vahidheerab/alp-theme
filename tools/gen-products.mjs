import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('assets/img/products');
fs.mkdirSync(OUT, { recursive: true });

const W = 420, H = 520;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function defs(uid, body, accent, band) {
  return `
  <defs>
    <linearGradient id="cyl${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.20"/>
      <stop offset="0.10" stop-color="#000" stop-opacity="0.06"/>
      <stop offset="0.30" stop-color="#fff" stop-opacity="0.34"/>
      <stop offset="0.46" stop-color="#fff" stop-opacity="0.10"/>
      <stop offset="0.70" stop-color="#000" stop-opacity="0.03"/>
      <stop offset="0.88" stop-color="#000" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.26"/>
    </linearGradient>
    <linearGradient id="cap${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.34"/>
      <stop offset="0.32" stop-color="#fff" stop-opacity="0.24"/>
      <stop offset="0.75" stop-color="#000" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.38"/>
    </linearGradient>
    <linearGradient id="band${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${band}" stop-opacity="0.92"/>
      <stop offset="1" stop-color="${band}" stop-opacity="1"/>
    </linearGradient>
    <radialGradient id="sh${uid}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#3a2c25" stop-opacity="0.34"/>
      <stop offset="0.6" stop-color="#3a2c25" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#3a2c25" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gl${uid}" x1="0" y1="0" x2="1" y2="0.2">
      <stop offset="0" stop-color="#fff" stop-opacity="0.5"/>
      <stop offset="0.5" stop-color="#fff" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>`;
}

function shadow(cx, cy, rx, ry = rx * 0.22) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#shS)"/>`;
}

function label(x, y, w, h, uid, brand, line, shade, accent, dark) {
  const fg = dark ? '#f6f1ea' : '#241c19';
  const sub = dark ? '#cbbfb4' : '#7a6c62';
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${dark ? '#211a18' : '#fbf7f1'}" rx="2"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#000" stroke-opacity="0.08"/>
    <rect x="${x}" y="${y}" width="${w}" height="3" fill="url(#band${uid})"/>
    <text x="${x + w / 2}" y="${y + h * 0.34}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${w > 150 ? 19 : 15}" letter-spacing="2.4" fill="${fg}">${esc(brand)}</text>
    <text x="${x + w / 2}" y="${y + h * 0.55}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="11.5" letter-spacing="0.6" fill="${sub}">${esc(line)}</text>
    ${shade ? `<text x="${x + w / 2}" y="${y + h * 0.84}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${w > 150 ? 26 : 20}" font-weight="700" letter-spacing="1" fill="${accent}">${esc(shade)}</text>` : ''}
  </g>`;
}

const shapes = {
  // Hair colour tube, cap down
  tube(uid, o) {
    const { body, accent, band, brand, line, shade, dark } = o;
    const x = 120, w = 180, top = 70, bottom = 400, capH = 54;
    return `
    ${shadow(210, 452, 118, 20)}
    <path d="M${x} ${top + 26} Q${x} ${top} ${x + 22} ${top} L${x + w - 22} ${top} Q${x + w} ${top} ${x + w} ${top + 26} L${x + w} ${bottom - capH} L${x} ${bottom - capH} Z" fill="${body}"/>
    <path d="M${x} ${top + 26} Q${x} ${top} ${x + 22} ${top} L${x + w - 22} ${top} Q${x + w} ${top} ${x + w} ${top + 26} L${x + w} ${bottom - capH} L${x} ${bottom - capH} Z" fill="url(#cyl${uid})"/>
    <rect x="${x - 6}" y="${top - 14}" width="${w + 12}" height="20" rx="3" fill="${body}" filter="none"/>
    <rect x="${x - 6}" y="${top - 14}" width="${w + 12}" height="20" rx="3" fill="url(#cyl${uid})"/>
    <g stroke="#000" stroke-opacity="0.10">
      <line x1="${x + 8}" y1="${top - 12}" x2="${x + 8}" y2="${top + 4}"/>
      <line x1="${x + 30}" y1="${top - 12}" x2="${x + 30}" y2="${top + 4}"/>
      <line x1="${x + 52}" y1="${top - 12}" x2="${x + 52}" y2="${top + 4}"/>
      <line x1="${x + 74}" y1="${top - 12}" x2="${x + 74}" y2="${top + 4}"/>
      <line x1="${x + 96}" y1="${top - 12}" x2="${x + 96}" y2="${top + 4}"/>
      <line x1="${x + 118}" y1="${top - 12}" x2="${x + 118}" y2="${top + 4}"/>
      <line x1="${x + 140}" y1="${top - 12}" x2="${x + 140}" y2="${top + 4}"/>
      <line x1="${x + 162}" y1="${top - 12}" x2="${x + 162}" y2="${top + 4}"/>
    </g>
    ${label(x + 16, top + 74, w - 32, 172, uid, brand, line, shade, accent, dark)}
    <rect x="${x}" y="${bottom - capH}" width="${w}" height="${capH}" rx="6" fill="#2b2422"/>
    <rect x="${x}" y="${bottom - capH}" width="${w}" height="${capH}" rx="6" fill="url(#cap${uid})"/>
    <rect x="${x + 14}" y="${bottom - capH + 8}" width="${w - 28}" height="4" rx="2" fill="#fff" opacity="0.12"/>
    <rect x="${x + 10}" y="${top + 34}" width="10" height="${bottom - capH - top - 52}" rx="5" fill="url(#gl${uid})" opacity="0.7"/>`;
  },
  // Developer / oxidant bottle
  bottle(uid, o) {
    const { body, accent, band, brand, line, shade, dark } = o;
    const x = 118, w = 184, top = 118, bottom = 432;
    return `
    ${shadow(210, 458, 122, 20)}
    <rect x="${x + 58}" y="46" width="68" height="64" rx="6" fill="#efe9e1"/>
    <rect x="${x + 58}" y="46" width="68" height="64" rx="6" fill="url(#cap${uid})"/>
    <g stroke="#000" stroke-opacity="0.14">
      <line x1="${x + 66}" y1="52" x2="${x + 66}" y2="104"/><line x1="${x + 80}" y1="52" x2="${x + 80}" y2="104"/>
      <line x1="${x + 94}" y1="52" x2="${x + 94}" y2="104"/><line x1="${x + 108}" y1="52" x2="${x + 108}" y2="104"/>
      <line x1="${x + 120}" y1="52" x2="${x + 120}" y2="104"/>
    </g>
    <path d="M${x + 40} 110 L${x + w - 40} 110 Q${x + w} 112 ${x + w} 152 L${x + w} ${bottom - 22} Q${x + w} ${bottom} ${x + w - 22} ${bottom} L${x + 22} ${bottom} Q${x} ${bottom} ${x} ${bottom - 22} L${x} 152 Q${x} 112 ${x + 40} 110 Z" fill="${body}"/>
    <path d="M${x + 40} 110 L${x + w - 40} 110 Q${x + w} 112 ${x + w} 152 L${x + w} ${bottom - 22} Q${x + w} ${bottom} ${x + w - 22} ${bottom} L${x + 22} ${bottom} Q${x} ${bottom} ${x} ${bottom - 22} L${x} 152 Q${x} 112 ${x + 40} 110 Z" fill="url(#cyl${uid})"/>
    ${label(x + 22, top + 46, w - 44, 176, uid, brand, line, shade, accent, dark)}
    <rect x="${x + 12}" y="${top + 34}" width="9" height="${bottom - top - 74}" rx="5" fill="url(#gl${uid})" opacity="0.65"/>`;
  },
  // Mask / butter jar
  jar(uid, o) {
    const { body, accent, band, brand, line, shade, dark } = o;
    const x = 96, w = 228, top = 158, bottom = 404;
    return `
    ${shadow(210, 432, 132, 22)}
    <rect x="${x + 6}" y="${top - 66}" width="${w - 12}" height="72" rx="10" fill="#efe9e1"/>
    <rect x="${x + 6}" y="${top - 66}" width="${w - 12}" height="72" rx="10" fill="url(#cap${uid})"/>
    <g stroke="#000" stroke-opacity="0.13">
      <line x1="${x + 24}" y1="${top - 60}" x2="${x + 24}" y2="${top - 2}"/>
      <line x1="${x + 58}" y1="${top - 60}" x2="${x + 58}" y2="${top - 2}"/>
      <line x1="${x + 92}" y1="${top - 60}" x2="${x + 92}" y2="${top - 2}"/>
      <line x1="${x + 126}" y1="${top - 60}" x2="${x + 126}" y2="${top - 2}"/>
      <line x1="${x + 160}" y1="${top - 60}" x2="${x + 160}" y2="${top - 2}"/>
      <line x1="${x + 194}" y1="${top - 60}" x2="${x + 194}" y2="${top - 2}"/>
    </g>
    <path d="M${x} ${top} L${x + w} ${top} L${x + w - 8} ${bottom - 26} Q${x + w - 12} ${bottom} ${x + w - 34} ${bottom} L${x + 34} ${bottom} Q${x + 12} ${bottom} ${x + 8} ${bottom - 26} Z" fill="${body}"/>
    <path d="M${x} ${top} L${x + w} ${top} L${x + w - 8} ${bottom - 26} Q${x + w - 12} ${bottom} ${x + w - 34} ${bottom} L${x + 34} ${bottom} Q${x + 12} ${bottom} ${x + 8} ${bottom - 26} Z" fill="url(#cyl${uid})"/>
    ${label(x + 30, top + 44, w - 60, 150, uid, brand, line, shade, accent, dark)}
    <rect x="${x + 14}" y="${top + 30}" width="10" height="${bottom - top - 76}" rx="5" fill="url(#gl${uid})" opacity="0.6"/>`;
  },
  // Serum dropper bottle
  dropper(uid, o) {
    const { body, accent, band, brand, line, shade, dark } = o;
    const x = 142, w = 136, top = 146, bottom = 424;
    return `
    ${shadow(210, 448, 96, 17)}
    <rect x="${x + 34}" y="48" width="68" height="66" rx="8" fill="#2a2320"/>
    <rect x="${x + 34}" y="48" width="68" height="66" rx="8" fill="url(#cap${uid})"/>
    <rect x="${x + 44}" y="${top - 34}" width="48" height="40" rx="4" fill="#2a2320" opacity="0.9"/>
    <path d="M${x} ${top} L${x + w} ${top} L${x + w} ${bottom - 30} Q${x + w} ${bottom} ${x + w - 26} ${bottom} L${x + 26} ${bottom} Q${x} ${bottom} ${x} ${bottom - 30} Z" fill="${body}"/>
    <path d="M${x} ${top} L${x + w} ${top} L${x + w} ${bottom - 30} Q${x + w} ${bottom} ${x + w - 26} ${bottom} L${x + 26} ${bottom} Q${x} ${bottom} ${x} ${bottom - 30} Z" fill="url(#cyl${uid})"/>
    ${label(x + 16, top + 54, w - 32, 148, uid, brand, line, shade, accent, dark)}
    <rect x="${x + 10}" y="${top + 30}" width="8" height="${bottom - top - 74}" rx="4" fill="url(#gl${uid})" opacity="0.7"/>`;
  },
  // Shampoo pump bottle
  pump(uid, o) {
    const { body, accent, band, brand, line, shade, dark } = o;
    const x = 126, w = 168, top = 130, bottom = 436;
    return `
    ${shadow(210, 460, 114, 19)}
    <path d="M186 44 h74 v14 h-24 v46 h-26 V58 h-24 z" fill="#2b2422"/>
    <path d="M186 44 h74 v14 h-24 v46 h-26 V58 h-24 z" fill="url(#cap${uid})"/>
    <rect x="${x + 54}" y="96" width="60" height="42" fill="#2b2422"/>
    <path d="M${x} ${top} L${x + w} ${top} L${x + w} ${bottom - 24} Q${x + w} ${bottom} ${x + w - 24} ${bottom} L${x + 24} ${bottom} Q${x} ${bottom} ${x} ${bottom - 24} Z" fill="${body}"/>
    <path d="M${x} ${top} L${x + w} ${top} L${x + w} ${bottom - 24} Q${x + w} ${bottom} ${x + w - 24} ${bottom} L${x + 24} ${bottom} Q${x} ${bottom} ${x} ${bottom - 24} Z" fill="url(#cyl${uid})"/>
    ${label(x + 20, top + 56, w - 40, 164, uid, brand, line, shade, accent, dark)}
    <rect x="${x + 12}" y="${top + 34}" width="9" height="${bottom - top - 72}" rx="5" fill="url(#gl${uid})" opacity="0.65"/>`;
  },
  // Bleach powder carton
  box(uid, o) {
    const { body, accent, band, brand, line, shade, dark } = o;
    const x = 116, w = 188, top = 96, bottom = 424;
    const skew = 34;
    return `
    ${shadow(214, 448, 124, 20)}
    <path d="M${x + w} ${top + 8} L${x + w + skew} ${top - 14} L${x + w + skew} ${bottom - 30} L${x + w} ${bottom} Z" fill="#000" opacity="0.16"/>
    <path d="M${x} ${top} L${x + w} ${top} L${x + w + skew} ${top - 22} L${x + skew} ${top - 22} Z" fill="#fff" opacity="0.5"/>
    <rect x="${x}" y="${top}" width="${w}" height="${bottom - top}" fill="${body}"/>
    <rect x="${x}" y="${top}" width="${w}" height="${bottom - top}" fill="url(#cyl${uid})" opacity="0.7"/>
    ${label(x + 18, top + 56, w - 36, 186, uid, brand, line, shade, accent, dark)}
    <rect x="${x}" y="${top}" width="${w}" height="6" fill="url(#band${uid})"/>
    <rect x="${x + 12}" y="${top + 34}" width="9" height="${bottom - top - 70}" rx="5" fill="url(#gl${uid})" opacity="0.55"/>`;
  },
  // Toner / small carton
  sachet(uid, o) {
    const { body, accent, band, brand, line, shade, dark } = o;
    const x = 134, w = 152, top = 140, bottom = 404;
    return `
    ${shadow(210, 428, 98, 17)}
    <path d="M${x} ${top} L${x + w} ${top} L${x + w + 22} ${top - 16} L${x + 22} ${top - 16} Z" fill="#fff" opacity="0.45"/>
    <rect x="${x}" y="${top}" width="${w}" height="${bottom - top}" fill="${body}"/>
    <rect x="${x}" y="${top}" width="${w}" height="${bottom - top}" fill="url(#cyl${uid})" opacity="0.75"/>
    <rect x="${x}" y="${top}" width="${w}" height="5" fill="url(#band${uid})"/>
    ${label(x + 14, top + 48, w - 28, 158, uid, brand, line, shade, accent, dark)}
    <rect x="${x + 10}" y="${top + 30}" width="8" height="${bottom - top - 64}" rx="4" fill="url(#gl${uid})" opacity="0.5"/>`;
  },
};

const products = [
  { id: 'color-61', shape: 'tube', body: '#f4eee6', accent: '#6f1d2f', band: '#6f1d2f', brand: 'L’ORÉAL', line: 'Majirel · 6.1', shade: '6.1', dark: false },
  { id: 'color-70', shape: 'tube', body: '#efe7dc', accent: '#4a342a', band: '#a98f6f', brand: 'WELLA', line: 'Koleston Perfect · 7/0', shade: '7/0', dark: false },
  { id: 'color-566', shape: 'tube', body: '#241d1b', accent: '#c99f97', band: '#8d4a3c', brand: 'SCHWARZKOPF', line: 'Igora Royal · 5-66', shade: '5-66', dark: true },
  { id: 'color-40', shape: 'tube', body: '#efe9e0', accent: '#4a342a', band: '#4a342a', brand: 'FRAMESI', line: 'Color Moon · 4.0', shade: '4.0', dark: false },
  { id: 'color-81', shape: 'tube', body: '#f2ece4', accent: '#5e5461', band: '#7d7386', brand: 'KEUNE', line: 'Tinta · 8.1', shade: '8.1', dark: false },
  { id: 'oxid-10', shape: 'bottle', body: '#f7f4ef', accent: '#6f1d2f', band: '#6f1d2f', brand: 'L’ORÉAL', line: 'Megafix · 10 Vol', shade: '10 vol', dark: false },
  { id: 'oxid-20', shape: 'bottle', body: '#f7f4ef', accent: '#4a342a', band: '#a98f6f', brand: 'WELLA', line: 'Welloxon · 20 Vol', shade: '20 vol', dark: false },
  { id: 'oxid-30', shape: 'bottle', body: '#efe9e2', accent: '#8d4a3c', band: '#8d4a3c', brand: 'SCHWARZKOPF', line: 'Combo · 30 Vol', shade: '30 vol', dark: false },
  { id: 'bleach-1', shape: 'box', body: '#f6f2ec', accent: '#2b2422', band: '#2b2422', brand: 'BLONDME', line: 'Bond Enforcing · Powder', shade: '', dark: false },
  { id: 'shampoo-1', shape: 'pump', body: '#e9e2d7', accent: '#6f1d2f', band: '#77584c', brand: 'DAVINES', line: 'Mellow Colour · Shampoo', shade: '', dark: false },
  { id: 'mask-1', shape: 'jar', body: '#efe7dd', accent: '#4a342a', band: '#77584c', brand: 'KERASTASE', line: 'Nutritive · Masquintense', shade: '', dark: false },
  { id: 'serum-1', shape: 'dropper', body: '#3a2a24', accent: '#e7d9c8', band: '#a98f6f', brand: 'OLAPLEX', line: 'No.7 · Bonding Oil', shade: '', dark: true },
  { id: 'toner-1', shape: 'sachet', body: '#f4efe8', accent: '#6f1d2f', band: '#6f1d2f', brand: 'WELLA', line: 'Color Touch · 9/16', shade: '9/16', dark: false },
  { id: 'mask-2', shape: 'jar', body: '#241d1c', accent: '#d8c4ad', band: '#6f4f45', brand: 'ALFAPARF', line: 'Semi di Lino · Reparative', shade: '', dark: true },
];

for (const p of products) {
  const uid = p.id.replace(/[^a-z0-9]/gi, '');
  const inner = shapes[p.shape](uid, p).replaceAll('url(#shS)', `url(#sh${uid})`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(p.brand)} ${esc(p.line)}">
${defs(uid, p.body, p.accent, p.band)}
  ${inner}
</svg>`;
  fs.writeFileSync(path.join(OUT, `${p.id}.svg`), svg);
}
console.log('generated', products.length, 'product renders ->', OUT);
