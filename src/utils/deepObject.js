export const deepClone = obj => JSON.parse(JSON.stringify(obj));
export const deepEqual = (objA, objB) => JSON.stringify(objA) === JSON.stringify(objB);
export const deepUnequal = (objA, objB) => !deepEqual(objA, objB);
export const uniqueBy = (arr, prop) => {
	return arr.filter((elem, pos, curArr) => {
		return pos === curArr.findIndex(el => {
			return el[prop] === elem[prop]
		});
	});
}

import lodashMerge from 'lodash.merge';
export const deepMergeArray = (arrA, arrB) => {
	const objA = { obj: arrA };
	const objB = { obj: arrB };
	const merged = lodashMerge(objA, objB);
	return merged.obj;
}