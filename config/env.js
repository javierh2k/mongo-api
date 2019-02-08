const { DATABASE_URI, PORT, HOST, BASE_API } = process.env;

const port = PORT || 3000;
const databaseUri = DATABASE_URI;
const baseApi = BASE_API || 'api';
const host = HOST || 'localhost';

module.exports = {
  port, databaseUri, baseApi, host
}
