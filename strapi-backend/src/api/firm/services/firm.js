'use strict';

/**
 * firm service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::firm.firm');
