// API Gateway
const stage = process.env.REACT_APP_STAGE;
const APIbaseURL =
  stage === 'production'
    ? 'https://uakubie5e8.execute-api.eu-west-1.amazonaws.com/production'
    : 'https://3u2so4i6m0.execute-api.eu-west-1.amazonaws.com/dev';

// Cognito
const cognitoConfig = {
  // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
  //identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

  // REQUIRED - Amazon Cognito Region
  region: 'eu-west-1',

  // OPTIONAL - Amazon Cognito User Pool ID
  userPoolId: 'eu-west-1_nSOhyhEe7',

  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  userPoolWebClientId: 'susb2de0hit9otq2h1aphbl4h',

  // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  mandatorySignIn: false

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
};

export default {
  APIbaseURL,
  cognitoConfig
};
