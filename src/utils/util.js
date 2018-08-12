
const validatePassword = (password) => {
	if (password.length < 6) {
		return {
			success: false,
			message: 'The password must contain at least 6 characters'
		};
	}
	let allowedCharacters = '!#$%&()*+,-./23456789:;<=>?@ABCDEFGHJKLMNOPRSTUVWXYZ[\\]^_abcdefghijkmnopqrstuvwxyz{|}~';
	for (let character of password) {
		if (allowedCharacters.indexOf(character) === -1) {
			return {
				success: false,
				message: 'the character ' + character + ' is not allowed in the password'
			};
		}
	}
	return { success: true, message: '' };
}

export {
	validatePassword
};