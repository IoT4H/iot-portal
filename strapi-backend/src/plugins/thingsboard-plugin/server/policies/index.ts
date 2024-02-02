export default {
  'generalPolicy': (policyContext, config, { strapi }) => {
    if (policyContext.state.isAuthenticated) {
      return true;
    }

    return false;
  }
};
