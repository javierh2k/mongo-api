const User = require( '../models/user');
const { removeEmptyKeysFromObject } = require( '../../libs/utils');
const { getSkip } = require('../../libs/utils');

const { ObjectID } = require('mongodb');
//import { ObjectID } from 'mongodb';
const mongoose = require ('mongoose');

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


  findPaginateRecommended(ctx) {
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
    // return User.aggregate([
    //   { "$project": { "_strId": { "$toString": ("$_id") }}},
    //   //{ "$project": { "_strId": { "$toString": "$_id" }}},
    //   {
    //     "$lookup":{
    //     //"let": { "_strId": { "$toString": "$_id" } },
    //     "from":"hats",
    //     "localField":"recommendedHats",
    //     "foreignField":"_strId",
    //     "as":"hats"
    //   }},
    //   {
    //     "$addFields":{
    //     // recommendedHats: "$$REMOVE",
    //     hats:"$$REMOVE",
    //     createdAt:"$$REMOVE",
    //     updatedAt:"$$REMOVE",
    //     __v:"$$REMOVE"
    //   }},
    //   {"$match":  removeEmptyKeysFromObject(pageOptions.filter) },
    //   {"$sort": {total: -1} },
    //   {"$facet" : {
    //       meta: [ { $count: "count" } ], //{ $addFields: { "page": pageOptions.page } }
    //       rows: [ { $skip: pageOptions.skip }, { $limit:pageOptions.limit  } ]
    //     }
    //   },
    // ]);


    const f= User.find()
          .select([ 'email', 'recommendedHats'])
          .populate({
              path:'hat',
              select: [ 'email', 'recommendedHats'],
              //match: { price: { $gte: 200, $lte: 1000}},
              options: { sort: {price: -1} }
          }).map( (e)=> {
            //console.log(e.email);
            const u = e.map( f => {
              //console.log(f.email);
              const conv = f.recommendedHats.map( q => {
                //const obj = new ObjectId(q);
                const query = new ObjectID('569ed8269353e9f4c51617aa');
                console.log(query);
              });

              return { hats: f.recommendedHats , email: f.email };
            });
            return u;
          })

          //.skip(pageOptions.page*pageOptions.limit)
          //.limit(pageOptions.limit)
          // .catch((err)=> {
          //   ctx.throw(500, JSON.stringify({ error: 'Encountered an error: '+err }));
          // });
          // f.map( (value, i ) => {

          //   console.log(i);
          //   //console.log(value[i].recommendedHats);
          //   return value
          // });
          //hat.find( { _id : { $in : [1,2,3,4] } } );
          return f;
  }

}

module.exports =  new UsersCustomRepository();
