require('dotenv').config()
const bodyParser = require( 'koa-bodyparser');
const Koa = require( 'koa');
const logger = require( 'koa-logger');
const helmet = require( 'koa-helmet');
const routing = require( '../libs/routesLoader');
const { host, port } = require( '../config/env');
const connectDatabase = require('../config/database')


const app = new Koa();
connectDatabase();
app.use(logger())
   .use(bodyParser())
   .use(helmet())
   .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || err.code;
      ctx.body = {
        success: false,
        message: err.message,
      };
    }
  });

routing(app);

app.listen(port, () =>
  console.log(`The server is running at http://${host}:${port}/`)
);

module.exports = app;
