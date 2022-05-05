'use strict';

/**
 * bailleur service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bailleur.bailleur');
