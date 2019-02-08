const User = require( '../models/user');
const { removeEmptyKeysFromObject } = require( '../../libs/utils');
const { getSkip } = require('../../libs/utils');

class UsersCustomRepository {
  findPaginate(ctx) {
    const { page, limit, price_from, price_to } = ctx.request.query;
    const pageQuery=parseInt(page,10) || 0, limitQuery=parseInt(limit,10) || 50;
    const pageOptions = {
      page: pageQuery,
      limit: limitQuery,
      skip: getSkip (pageQuery, limitQuery),
      filter: {
        total: {
          $gte: parseInt(price_from,10) || '' ,
          $lte: parseInt(price_to,10) || ''
        }
      }
    }

    return User.aggregate([
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

}

module.exports =  new UsersCustomRepository();
