module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'c3aeaa71045f37bf7f1e2db66bc1294b'),
  },  
  apiToken: {
    salt: env('API_TOKEN_SALT', 'wruCdFcj6cSgKgvWVqgXww=='),
  },
});
