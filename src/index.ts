import * as path from 'node:path';
import fs from 'fs-extra';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import subsetFont from 'subset-font';
import type { Plugin } from 'vite';
import { normalizePath } from 'vite';

interface FontSubsetGeneratorOptions {
	targetBasePath: string;
}

export function getPathAndParam(id: string): { path: string; subset: string } | null {
	try {
		const url = new URL(id, 'relative://');
		if (url.pathname.endsWith('.css') && url.searchParams.has('subset')) {
			return { path: url.pathname, subset: url.searchParams.get('subset') || '' };
		}
		return null;
	} catch {
		return null;
	}
}

export function fontSubsetGenerator(options?: FontSubsetGeneratorOptions): Plugin {
	const plugin: Plugin = {
		name: 'vite-font-subset-generator',
		enforce: 'pre',
		async load(id) {
			const pathAndParam = getPathAndParam(id);
			if (!pathAndParam) return;

			const { path: importPath, subset: subsetParam } = pathAndParam;

			const importContent = await fs.readFile(importPath, 'utf-8');
			const importDir = path.dirname(importPath);

			const cssRoot = postcss.parse(importContent);

			const sources: string[] = [];

			for (const node of cssRoot.nodes) {
				if (node.type === 'atrule' && node.name === 'font-face' && node.nodes) {
					const fontFace = node;

					fontFace.nodes?.forEach((node) => {
						if (node.type === 'decl' && node.prop === 'src') {
							const parsed = valueParser(node.value);

							parsed.walk((node) => {
								if (node.type === 'function' && node.value === 'url' && node.nodes.length > 0) {
									const relativeSource = node.nodes[0].value;

									sources.push(relativeSource);
								}
							});
						}
					});
				}
			}

			const uniqueSources = new Set(sources).values();

			const targetBasePath = options?.targetBasePath || path.join('src', '.temp');

			await fs.mkdir(targetBasePath, { recursive: true });

			let newFileContent = importContent;

			const cwd = process.cwd();

			for await (const relativeSourcePath of uniqueSources) {
				const absoluteSourcePath = path.join(importDir, relativeSourcePath);

				const sourceFileName = path.basename(relativeSourcePath);
				const targetFileName = `reduced_${sourceFileName}`;

				const targetPath = path.join(cwd, targetBasePath, targetFileName);

				const fontBuffer = await fs.readFile(absoluteSourcePath);
				const subsetBuffer = await subsetFont(fontBuffer, subsetParam);

				await fs.writeFile(targetPath, subsetBuffer);

				newFileContent = newFileContent.replace(relativeSourcePath, normalizePath(targetPath));

				console.log(`Processed font: ${sourceFileName} -> ${targetFileName}`);
				console.log(`Replaced ${relativeSourcePath} with ${targetPath}`);
			}

			return newFileContent;
		}
	};

	return plugin;
}
