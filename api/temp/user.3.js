const User = require( '../models/user');
const { removeEmptyKeysFromObject } = require( '../../libs/utils');
const getSkip = require('../../libs/utils');

class UsersControllers {
  async find(ctx) {
    const { page, limit, email, price_from, price_to } = ctx.request.query;
    const pageOptions = {
      page: parseInt(page,10) || 0,
      limit: parseInt(limit,10) || 10,
      //priceFrom: price_from && parseInt(price_from,10) || '',
    }

    const filters = {
      email
    }
    const getSkipp = () => {
        const page=pageOptions.page;
        const limit=pageOptions.limit;
        const base = (page - 1) < 0 ? 0 : page - 1;
        return base * limit;
    };

    const skip = getSkip (pageOptions.page, pageOptions.limit);

    const priceRange = {total: {
        $gte: parseInt(price_from,10) || '' ,
        $lte: parseInt(price_to,10) || ''
    } };

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
        "__v":"$$REMOVE"
      }},
      {"$project":{"hats":0} },
      {"$match":  removeEmptyKeysFromObject(priceRange) },
      {"$sort": {total: -1} },
      {"$facet" : {
          meta: [ { $count: "count" } ], //{ $addFields: { "page": pageOptions.page } }
          rows: [ { $skip: getSkipp() }, { $limit:pageOptions.limit  } ]
        }
      },
    ]);//.sort({total: -1});



//     ctx.body = await User.find(removeEmptyKeysFromObject(filters))
//       .populate({
//           path:'hats',
// //          select: [ 'price', 'name'],
//           match: { price: { $gte: 200, $lte: 1000}},
//           options: { sort: {price: -1} }
//       })
//       .sort({ })
//       .skip(pageOptions.page*pageOptions.limit)
//       .limit(pageOptions.limit)
//       .catch((err)=> {
//         ctx.throw(500, JSON.stringify({ error: 'Encountered an error: '+err }));
//       });

      //ctx.body = await User.find();
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
