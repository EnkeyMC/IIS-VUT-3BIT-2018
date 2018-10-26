export function copyMerge(obj1, obj2 = null) {
    return Object.assign({}, obj1, obj2);
}