import { basename } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import vituum from 'vituum';
import nunjucks from '@vituum/vite-plugin-nunjucks';
import beautify from 'js-beautify';
import pxtorem from 'postcss-pxtorem';
import sharp from 'sharp';

import { breakpoints } from './src/assets/js/breakpoints.ts';

const VOID_TAG_SLASH =
	/<(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)(\b[^>]*?)\s*\/>/gi;
const HEAD_SCRIPT = /<script\b[^>]*\bsrc="[^"]+"[^>]*><\/script>/gi;

const moveScriptsToBodyEnd = (html: string) => {
	const headEnd = html.indexOf('</head>');
	if (headEnd === -1) return html;

	const head = html.slice(0, headEnd);
	const scripts = head.match(HEAD_SCRIPT) ?? [];
	if (scripts.length === 0) return html;

	return (head.replace(HEAD_SCRIPT, '') + html.slice(headEnd)).replace(
		'</body>',
		`${scripts.join('')}</body>`
	);
};

const RASTER_EXT = /\.(jpe?g|png)$/i;
// svg icons used via CSS `mask` (see button.njk); keep this list in sync
const MASK_ICON = /[\\/]icon-(cart|arrow-up-right)\.svg$/i;

// Build only: every bundled .jpg/.jpeg/.png asset is re-encoded as .webp
// and references in HTML, CSS and JS are rewritten to the new file name.
// Runs as a "post" plugin so the HTML files are already in the bundle.
const webpImages = (quality = 80): Plugin => {
	const renamed = new Map<string, string>();
	const escape = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const rewrite = (code: string) => {
		for (const [from, to] of renamed) {
			code = code.replace(new RegExp(`(?<![\\w.-])${escape(from)}(?![\\w.-])`, 'g'), to);
		}
		return code;
	};

	return {
		name: 'webp-images',
		apply: 'build',
		enforce: 'post',
		async generateBundle(_, bundle) {
			renamed.clear();

			for (const [fileName, output] of Object.entries(bundle)) {
				if (output.type !== 'asset' || !RASTER_EXT.test(fileName)) continue;

				const webpName = fileName.replace(RASTER_EXT, '.webp');
				const source = await sharp(output.source as Uint8Array)
					.webp({ quality })
					.toBuffer();

				delete bundle[fileName];
				this.emitFile({ type: 'asset', fileName: webpName, source });
				renamed.set(basename(fileName), basename(webpName));
			}

			if (renamed.size === 0) return;

			for (const output of Object.values(bundle)) {
				if (output.type === 'chunk') output.code = rewrite(output.code);
				else if (typeof output.source === 'string') output.source = rewrite(output.source);
			}
		},
	};
};

const prettifyHtml = (): Plugin => ({
	name: 'prettify-html',
	apply: 'build',
	transformIndexHtml: {
		order: 'post',
		handler: (html) =>
			beautify.html(moveScriptsToBodyEnd(html).replace(VOID_TAG_SLASH, '<$1$2>'), {
				indent_with_tabs: true,
				indent_inner_html: true,
				preserve_newlines: false,
				end_with_newline: true,
				extra_liners: [],
			}),
	},
});

export default defineConfig(({ command }) => ({
	base: './',
	css: {
		postcss: {
			plugins:
				command === 'build'
					? [
							pxtorem({
								rootValue: 16,
								unitPrecision: 4,
								propList: ['*'],
								minPixelValue: 3,
								mediaQuery: false,
							}),
						]
					: [],
		},
	},
	build: {
		// assetsInlineLimit: (filePath: string) => MASK_ICON.test(filePath),
		assetsInlineLimit: 0,
		rollupOptions: {
			output: {
				entryFileNames: 'assets/js/main.js',
				chunkFileNames: 'assets/js/[name].js',
				assetFileNames: (info: { names?: string[]; name?: string }) => {
					const name = info.names?.[0] ?? info.name ?? '';
					if (name.endsWith('.css')) return 'assets/css/main.css';
					if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) return 'assets/fonts/[name][extname]';
					return 'assets/images/[name][extname]';
				},
			},
		},
	},
	plugins: [
		vituum({ pages: { normalizeBasePath: true } }),
		nunjucks({ root: './src', globals: { breakpoints } }),
		webpImages(),
		prettifyHtml(),
	],
}));
