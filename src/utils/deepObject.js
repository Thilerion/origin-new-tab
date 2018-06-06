export const deepClone = obj => JSON.parse(JSON.stringify(obj));
export const deepEqual = (objA, objB) => JSON.stringify(objA) === JSON.stringify(objB);
export const deepUnequal = (objA, objB) => !deepEqual(objA, objB);