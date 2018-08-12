
// API Gateway
const env = 'development';
const APIbaseURL = 'https://335wff2636.execute-api.eu-west-1.amazonaws.com/' + env;

// Cognito
const cognitoConfig = {
	// REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
	//identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

	// REQUIRED - Amazon Cognito Region
	region: 'eu-west-1',

	// OPTIONAL - Amazon Cognito User Pool ID
	userPoolId: 'eu-west-1_grZjgNjcO',

	// OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
	userPoolWebClientId: '20ave2ad7is4shanu4l5icb62m',

	// OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
	mandatorySignIn: false,

	// OPTIONAL - Configuration for cookie storage
	// cookieStorage: {
	// 	// REQUIRED - Cookie domain (only required if cookieStorage is provided)
	// 	domain: '.barelinks.in',
	// 	// OPTIONAL - Cookie path
	// 	path: '/',
	// 	// OPTIONAL - Cookie expiration in days
	// 	expires: 365,
	// 	// OPTIONAL - Cookie secure flag
	// 	secure: true
}

export default {
	APIbaseURL,
	cognitoConfig
};