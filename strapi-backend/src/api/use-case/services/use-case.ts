'use strict';

/**
 * use-case service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::use-case.use-case", ({ strapi }) => ({
    async find(...args) {
      // Calling the default core controller
      let { results, pagination } = await super.find(...args);

      // some custom logic
      results = results.map(result => {
        try {
          JSON.parse(result.description);
        } catch (e) {
          result.description = [{ type: "paragraph", children: [{ text: result.description || "" }] }];
        }
      });
      console.log("results find", results);

      return { results, pagination };
    }, async findOne(...args) {
      // Calling the default core controller
      let entity = await super.find(...args);

      try {
        JSON.parse(entity.description);
      } catch (e) {
        entity.description = [{ type: "paragraph", children: [{ text: entity.description || "" }] }];
      }

      console.log("ENTITY find one", entity);

      return entity;
    },
    async findMany(...args) {
      // Calling the default core controller
      let { results, pagination } = await super.find(...args);

      // some custom logic
      results = results.map(result => {
        try {
          JSON.parse(result.description);
        } catch (e) {
          result.description = [{ type: "paragraph", children: [{ text: result.description || "" }] }];
        }
      });
      console.log("results find many", results);

      return { results, pagination };
    }
  })
);
