import { describe, expect, it } from "vitest";
import { splitImportPath, windowsToUnixPath } from "../src/utils";

describe("splitImportPath", () => {
	it("should split import path and parameters", () => {
		const id = "src/styles/main.css?subset=latin";
		const [importPath, importParams] = splitImportPath(id);
		expect(importPath).toBe("src/styles/main.css");
		expect(importParams).toBe("?subset=latin");
	});

	it("should handle paths with multiple parameters", () => {
		const id = "src/styles/main.css?subset=latin&display=swap";
		const [importPath, importParams] = splitImportPath(id);
		expect(importPath).toBe("src/styles/main.css");
		expect(importParams).toBe("?subset=latin&display=swap");
	});

	it("should handle paths without parameters", () => {
		const id = "src/styles/main.css";
		const [importPath, importParams] = splitImportPath(id);
		expect(importPath).toBe("src/styles/main.css");
		expect(importParams).toBe("");
	});
});

describe("windowsToUnixPath", () => {
	it("should convert Windows paths to Unix paths", () => {
		const winPath = "C:\\Users\\User\\Documents\\file.txt";
		const unixPath = windowsToUnixPath(winPath);
		expect(unixPath).toBe("C:/Users/User/Documents/file.txt");
	});

	it("should handle paths with mixed separators", () => {
		const mixedPath = "C:\\Users/User\\Documents\\file.txt";
		const unixPath = windowsToUnixPath(mixedPath);
		expect(unixPath).toBe("C:/Users/User/Documents/file.txt");
	});
});
