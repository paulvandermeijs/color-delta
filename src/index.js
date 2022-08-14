//@ts-check

import fs from 'fs';
import Color from 'color';

const data = fs.readFileSync(process.stdin.fd, 'utf-8').split('\n');

const colors = data.reduce(
    (acc, c) => {
        try {
            acc.push(Color(c));
        } catch {}

        return acc;
    },
    /** @type {Color[]} */ ([])
)

if (colors.length < 1) {
    process.exit();
}

const precision = parseInt(process.argv[2]) || null;

const maybeHexa = (/** @type {Color} */ color) => color.alpha() === 1 ? color.hex() : color.hexa();

const round = (/** @type {number} */ n, /** @type {number} */ precision) => +n.toPrecision(precision);

const maybeRound = (/** @type {number} */ n, /** @type {any} */ precision) => 'number' === typeof precision ? round(n, precision) : n;

colors.forEach(
    c => {
        const mod = {};

        if (colors[0].hue() != c.hue()) {
            mod.rotate = c.hue() - colors[0].hue();
        }

        if (colors[0].saturationl() != c.saturationl()) {
            mod.saturate = (c.saturationl() - colors[0].saturationl()) / colors[0].saturationl();
        }

        if (colors[0].lightness() != c.lightness()) {
            mod.lighten = (c.lightness() - colors[0].lightness()) / colors[0].lightness();
        }

        if (1 != c.alpha()) {
            mod.alpha = c.alpha();
        }

        const row = [
            c.hexa(),
            // `"${c.hsl().string()}"`,
            mod.rotate || 0,
            mod.saturate || 0,
            mod.lighten || 0,
            mod.alpha || 1,
            Object.keys(mod).reduce((s, m) => `${s}.${m}(${maybeRound(mod[m], precision)})`, `Color('${maybeHexa(colors[0])}')`),
            Object.keys(mod).reduce((n, m) => n[m](maybeRound(mod[m], precision)), colors[0]).hexa(),
            // `"${Object.keys(mod).reduce((n, m) => n[m](mod[m]), colors[0]).hsl().string()}"`,
        ];

        console.log(row.join(','));
    }
);

