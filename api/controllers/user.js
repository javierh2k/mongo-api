const UsersCustomRepository  = require('../repositories/user');

class UsersControllers {
  async find(ctx) {

var foo=10;
var bar=3;
(
function () {  var foo=2; bar=1}
)
bar= bar+foo;

    console.log(bar)
      ctx.body = await UsersCustomRepository.findPaginate(ctx);
  }
}

module.exports =  new UsersControllers();
