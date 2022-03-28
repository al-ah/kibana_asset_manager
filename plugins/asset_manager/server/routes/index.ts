import { IRouter } from '../../../../src/core/server';
import {PLUGIN_ID} from "../../common";
import { schema } from '@kbn/config-schema';

export function defineRoutes(router: IRouter) {

  // for search documents :
  router.post(      
    {
      path: `/api/${PLUGIN_ID}/elastic/search`,
      validate: {
          body: schema.any()
      },
    },
    async (context, request, response) => {
        let result = {};
        try{
          const payload = request.body;
          result = await context.core.elasticsearch.client.asCurrentUser.search({
              index: payload.index,
              q:payload.query,
              _source:payload._source,
              _source_excludes:payload._source_excludes,
              from:payload.from,
              size:payload.size,
              body:payload.body,
              sort:payload.sort,
          });
      }
      
      catch(err){
        return response.customError({
            statusCode: err.meta?.body?.error?.status || 417
            ,body: {
              //message: JSON.stringify(err.meta?.body?.error) || "reason not specified"
               message: err.meta?.body?.error?.reason || "reason not specified"
            }
        })
      }
      return response.ok({
        body: result,
      });
    }
  );

  // for saving data:
  router.post(      
    {
      path: `/api/${PLUGIN_ID}/elastic/index`,
      validate: {
          body: schema.any()
      },
    },
    async (context, request, response) => {
        let result = {};
        try{
          const payload = request.body;
          result = await context.core.elasticsearch.client.asCurrentUser.index({
            id: payload.id,
            index: payload.index,
            body:payload.body
          });
      }
      catch(err){
        return response.customError({
            statusCode: err.meta?.body?.error?.status || 417
            ,body: {
              message: err.meta?.body?.error?.reason || "reason not specified"
            }
        })
      }
      return response.ok({
        body: result,
      });
    }
  );
  // for delete data by query :
  router.post(      
    {
      path: `/api/${PLUGIN_ID}/elastic/delete_by_query`,
      validate: {
          body: schema.any()
      },
    },
    async (context, request, response) => {
        let result = {};
        const payload = request.body;         
          try{
            result = await context.core.elasticsearch.client.asCurrentUser.deleteByQuery({
              index: payload.index,
              q:payload.query,
              body:payload.body
            });
          }
                
        catch(err){
          return response.customError({
              statusCode: err.meta?.body?.error?.status || 417
              ,body: {
                message: err.meta?.body?.error?.reason || "reason not specified"
              }
          })
        }
        return response.ok({
          body: result,
        });
    }  
  );

}
