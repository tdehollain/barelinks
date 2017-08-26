export function URLisValid(URL) {
	return URL? true : false;
}

export function immutableDelete(arr, index) {
	return arr.slice(0, index).concat(arr.slice(index+1));
}