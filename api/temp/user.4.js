const User = require( '../models/user');
const { removeEmptyKeysFromObject } = require( '../../libs/utils');
const { getSkip } = require('../../libs/utils');

class UsersControllers {
  async find(ctx) {
    const { page, limit, price_from, price_to } = ctx.request.query;
    const pageOptions = {
      page: parseInt(page,10) || 0,
      limit: parseInt(limit,10) || 10,
      skip: getSkip (pageOptions.page, pageOptions.limit),
      filter: {
        total: {
          $gte: parseInt(price_from,10) || '' ,
          $lte: parseInt(price_to,10) || ''
        }
      }
    }

    ctx.body = await User.aggregate([
      {"$lookup":{
        "from":"hats",
        "localField":"hats",
        "foreignField":"_id",
        "as":"hats"
      }},
      {"$addFields":{
        total:{
          "$sum":"$hats.price"
        },
        recommendedHats: "$$REMOVE",
        hats:"$$REMOVE",
        createdAt:"$$REMOVE",
        updatedAt:"$$REMOVE",
        __v:"$$REMOVE"
      }},
      {"$project":{"hats":0} },
      {"$match":  removeEmptyKeysFromObject(pageOptions.filter) },
      {"$sort": {total: -1} },
      {"$facet" : {
          meta: [ { $count: "count" } ], //{ $addFields: { "page": pageOptions.page } }
          rows: [ { $skip: pageOptions.skip }, { $limit:pageOptions.limit  } ]
        }
      },
    ]);
  }

  async findById(ctx) {
    try {
      const user = await User.findById(ctx.params.id);
      if (!user) {
        ctx.throw(404);
      }
      ctx.body = user;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }




}

module.exports =  new UsersControllers();
