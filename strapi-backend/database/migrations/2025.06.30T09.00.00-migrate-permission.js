"use strict";

function whereLikeIn(queryBuilder, column, patterns) {
  queryBuilder.where(function() {
    for (const pattern of patterns) {
      this.orWhere(column, "like", pattern);
    }
  });
}

module.exports = {
  async up(knex) {

    //plugin::thingsboard-plugin.deployment

    const exists = await knex.schema.hasTable("up_permissions");
    const exists2 = await knex.schema.hasTable("up_roles");
    const exists3 = await knex.schema.hasTable("up_permissions_role_links");

    if (exists && exists2 && exists3) {


      const permissions = [
        "plugin::thingsboard-plugin.deployment.create",
        "plugin::thingsboard-plugin.deployment.findAll",
        "plugin::thingsboard-plugin.deployment.status",
        "plugin::thingsboard-plugin.deployment.findOne",
        "plugin::thingsboard-plugin.deployment.getDashboards",
        "plugin::thingsboard-plugin.thingsboard.token",
        "plugin::thingsboard-plugin.deployment.getDashboardInfo",
        "plugin::thingsboard-plugin.thingsboard.url",
        "plugin::thingsboard-plugin.deployment.getDevices",
        "plugin::thingsboard-plugin.deployment.getStepsFromDeployment",
        "plugin::thingsboard-plugin.deployment.getStepsProgressFromDeployment",
        "plugin::thingsboard-plugin.deployment.updateStepsProgressFromDeployment",
        "plugin::thingsboard-plugin.deployment.stepAction",
        "plugin::thingsboard-plugin.deployment.getStepsProgressCompleteFromDeployment",
        "plugin::thingsboard-plugin.deployment.getComponentsForDeploymentByProfile",
        "plugin::thingsboard-plugin.deployment.createComponentsRelation",
        "plugin::thingsboard-plugin.deployment.getSetupStepsProfiles",
        "plugin::thingsboard-plugin.deployment.getDeviceCredentialsForDeploymentByUUID",
        "plugin::thingsboard-plugin.deployment.deleteComponent",
        "plugin::thingsboard-plugin.deployment.nameAlreadyExist",
        "plugin::thingsboard-plugin.telemetry.exportTelemetry",
        "plugin::thingsboard-plugin.telemetry.getTelemetryKeys",
        "api::firm.firm.find",
        "api::firm.firm.findOne",
        "api::device.device.find",
        "api::device.device.findOne",
        "api::startpage.startpage.find",
        "api::startpage.startpage.findOne",
        "api::tag.tag.find",
        "api::tag.tag.findOne",
        "api::page.page.find",
        "api::page.page.findOne",
        "api::glossar.glossar.find",
        "api::glossar.glossar.findOne",
        "plugin::menus.menus.find",
        "plugin::menus.menus.findOne",
        "plugin::menus.menu-items.find",
        "plugin::menus.menu-items.findOne"
      ];

      const existing = await knex("up_permissions")
        .whereIn("action", permissions)
        .select("action");

      const existingActions = new Set(existing.map(row => row.action));

      // Step 2: Filter new actions
      const newActions = permissions.filter(action => !existingActions.has(action));

      // Step 3: Insert only new actions
      if (newActions.length > 0) {
        const now = new Date(); // Current UTC time
        const insertData = newActions.map(action => ({
          action,
          created_at: now,
          updated_at: now
        }));
        await knex("up_permissions").insert(insertData);
      }


      const crossJoinedData = await knex("up_permissions")
        .crossJoin("up_roles")
        .select("up_permissions.id as permission_id", "up_roles.id as role_id")
        .modify(qb => whereLikeIn(qb, "up_permissions.action", permissions)).where("up_roles.name", "Authenticated");


      const crossJoinedData2 = await knex("up_permissions")
        .crossJoin("up_roles")
        .select("up_permissions.id as permission_id", "up_roles.id as role_id")
        .modify(qb => whereLikeIn(qb, "up_permissions.action", permissions.filter(action => action.startsWith("plugin::thingsboard-plugin")))).where("up_roles.name", "Public");


      await knex("up_permissions_role_links").insert(crossJoinedData)
        .onConflict(["role_id", "permission_id"]) // Unique constraint columns
        .ignore();

      await knex("up_permissions_role_links").insert(crossJoinedData2)
        .onConflict(["role_id", "permission_id"]) // Unique constraint columns
        .ignore();


    } else {
      console.log(`Table ${!exists ? "up_permissions" : ""}${!exists2 || !exists3 ? ", " : ""}` +
        `${!exists2 ? "up_roles" : ""}${!exists3 ? ", " : ""}` +
        `${!exists3 ? "up_permissions_role_links" : ""} does not exist`);
    }


  }
};
