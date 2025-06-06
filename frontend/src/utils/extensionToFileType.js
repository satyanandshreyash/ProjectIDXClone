const extensionToFileTypeMap = {
    "js": "javascript",
    "ts": "typescript",
    "jsx": "javascript",
    "tsx": "typescript",
    "css": "css",
    "scss": "scss",
    "html": "html",
    "json": "json",
    "md": "markdown",
    "mdx": "markdown",
    "yaml": "yaml",
    "yml": "yaml",
    "svg": "svg",
    "txt": "text",
    "gitignore": "gitignore",
}

export const extensionToFileType = (extension) => {
    if (!extension) return undefined;
    return extensionToFileTypeMap[extension];
}