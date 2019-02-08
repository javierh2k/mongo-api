const UsersCustomRepository  = require('../repositories/user');

class UsersControllers {
  async find(ctx) {

(
function () {  var foo=2; bar=1}
)
      ctx.body = await UsersCustomRepository.findPaginate(ctx);
  }
}

module.exports =  new UsersControllers();
