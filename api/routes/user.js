const Router = require( 'koa-router');
const { baseApi } = require('../../config/env');
const UsersControllers = require( '../controllers/user');
const validate = require('koa2-validation');
const { queryUser } = require('./request/user');
const endPoint = 'users';


const router = new Router();
router.prefix(`/${baseApi}/${endPoint}`);

router.get('/', validate(queryUser), UsersControllers.find);

module.exports =   router;
