// API Gateway
const stage = process.env.REACT_APP_STAGE;
const APIbaseURL =
  stage === 'production'
    ? 'https://tjhe8rann5.execute-api.eu-west-1.amazonaws.com/production'
    : 'https://3u2so4i6m0.execute-api.eu-west-1.amazonaws.com/dev';

export default {
  APIbaseURL
};
