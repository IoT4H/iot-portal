'use strict';
import deployment from "./deployment";
import thingsboard from "./thingsboard";

export default {
  type: 'content-api',
  routes: [...deployment, ...thingsboard],
};
