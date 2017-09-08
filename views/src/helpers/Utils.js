export function URLisValid(URL) {
	return URL? true : false;
}

export function immutableDelete(arr, index) {
	return arr.slice(0, index).concat(arr.slice(index+1));
}

export function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}



export function formatDate(date, showYear) {
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	let day = date.getDate();
	let dayStr = day < 10 ? '0' + day : day;
	let month = date.getMonth();
	let monthStr = monthNames[month];
	let year = date.getFullYear();
	return showYear ? dayStr + ' ' + monthStr + ' ' + year : dayStr + ' ' + monthStr;
}

export function showYear(date) {
	// Shows the year if it is the current on
	// Question: show year always in search and tags views?
	let currentDate = new Date();
	return currentDate.getFullYear() !== date.getFullYear();
}