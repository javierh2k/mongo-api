const UsersCustomRepository  = require('../repositories/user');

class UsersControllers {
  async find(ctx) {
      ctx.body = await UsersCustomRepository.findPaginate(ctx);
  }
}

module.exports =  new UsersControllers();
