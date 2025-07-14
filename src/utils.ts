import * as path from "node:path";

export function windowsToUnixPath(winPath: string) {
	return winPath.split(path.win32.sep).join(path.posix.sep);
}

export function splitImportPath(
	id: string,
): [importPath: string, importParams: string] {
	const postfixRE = /[?#].*$/s;
	const importPath = id.replace(postfixRE, "");
	const importParams = id.match(postfixRE)?.[0] || "";
	return [importPath, importParams];
}
