export const getFileExtension = (filename) => {
    const arr = filename.split(".");
    return arr[arr.length - 1];
}