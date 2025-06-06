export const getFileExtension = (filename) => {
    const arr = filename.split(".");
    return arr[arr.length - 1];
}

export const getFileNameWithExtension = (path) => {
    if (!path) return "";
    const arr = path.split("/");
    return arr[arr.length - 1];
}