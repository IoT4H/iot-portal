import _ from "lodash";
import { compact, concat, isArray } from "lodash/fp";

import utils, { validateYupSchema, yup } from '@strapi/utils';
import { contentTypes } from "@strapi/utils";
/* eslint-disable no-useless-escape */
import crypto from 'crypto';


const { getAbsoluteAdminUrl, getAbsoluteServerUrl, sanitize } = utils;
const { ApplicationError, ValidationError, ForbiddenError } = utils.errors;

const validateRegisterBody = validateYupSchema(yup.object({
  email: yup.string().email().required(),
  username: yup.string().required(),
  password: yup.string().required(),
}));

import Attribute from "@strapi/types/dist/types/core/index"


const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

export default (plugin) => {

// extend register controller
  plugin.controllers.auth.register = async (ctx) => {
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });

    const settings: any = await pluginStore.get({ key: 'advanced' });

    if (!settings.allow_register) {
      throw new ApplicationError('Register action is currently disabled');
    }

    const { register } = strapi.config.get<any>('plugin.users-permissions');
    const alwaysAllowedKeys = ['username', 'password', 'email'];
    const userModel: any = strapi.contentTypes['plugin::users-permissions.user'];
    const { attributes } = userModel;

    const nonWritable = contentTypes.getNonWritableAttributes(userModel);

    const allowedKeys = compact(
      concat(
        alwaysAllowedKeys,
        isArray(register?.allowedFields)
          ? // Note that we do not filter allowedFields in case a user explicitly chooses to allow a private or otherwise omitted field on registration
          register.allowedFields // if null or undefined, compact will remove it
          : // to prevent breaking changes, if allowedFields is not set in config, we only remove private and known dangerous user schema fields
            // TODO V5: allowedFields defaults to [] when undefined and remove this case
          Object.keys(attributes).filter(
            (key) =>
              !nonWritable.includes(key) &&
              !attributes[key].private &&
              ![
                // many of these are included in nonWritable, but we'll list them again to be safe and since we're removing this code in v5 anyway
                // Strapi user schema fields
                'confirmed',
                'blocked',
                'confirmationToken',
                'resetPasswordToken',
                'provider',
                'id',
                'role',
                // other Strapi fields that might be added
                'createdAt',
                'updatedAt',
                'createdBy',
                'updatedBy',
                'publishedAt', // d&p
                'strapi_reviewWorkflows_stage', // review workflows
              ].includes(key)
          )
      )
    );

    const params: any = {
      ..._.pick(ctx.request.body, allowedKeys),
      provider: 'local',
    };

    await validateRegisterBody(params);

    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError('Impossible to find the default role');
    }

    const { email, username, provider } = params;

    const identifierFilter = {
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() },
        { username },
        { email: username },
      ],
    };

    const conflictingUserCount = await strapi.query('plugin::users-permissions.user').count({
      where: { ...identifierFilter, provider },
    });

    if (conflictingUserCount > 0) {
      throw new ApplicationError('Email or Username are already taken');
    }

    if (settings.unique_email) {
      const conflictingUserCount = await strapi.query('plugin::users-permissions.user').count({
        where: { ...identifierFilter },
      });

      if (conflictingUserCount > 0) {
        throw new ApplicationError('Email or Username are already taken');
      }
    }

    const firm = await strapi.entityService.create("api::firm.firm", { data: { name: params.firstname + " " + params.lastname + " - " + email.toLowerCase() , verified: false, Address: { Country: "Germany"}}});

    const newUser = {
      ...params,
      role: role.id,
      email: email.toLowerCase(),
      username,
      confirmed: !settings.email_confirmation,
      firm: { connect: [firm]}
    };

    const user = await strapi.service('plugin::users-permissions.user').add(newUser);

    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        await strapi.service('plugin::users-permissions.user').sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        throw new ApplicationError(err.message);
      }

      return ctx.send({ user: sanitizedUser });
    }

    const jwt = strapi.service('plugin::users-permissions.jwt').issue(_.pick(user, ['id']));

    return ctx.send({
      jwt,
      user: sanitizedUser,
    });
  }

  return plugin;
};
