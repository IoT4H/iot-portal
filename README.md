# Getting started

## Development

You can run the services with

```bash
docker compose -f docker-compose.local.yaml up --build
```

- `--build` to build the images locally
- Make sure you've create the Thingsboard volumes first: `docker volume create mytb-data && docker volume create mytb-logs`.
- Hint: add `-V` to renew volumes if you update node packages (e.g., in `frontend`, `stapi-backend`, or `strapi-backend/src/plugins/thingsboard-plugin`).
- Hint: manage env variables in the `.local.env`; `.env` files in e.g. `strapi-backend/.env` will override the docker variables.

To use images from GiHub's container registry (ghcr.io), run docker login with the proper access token. You'll need a [Classic Token](https://github.com/settings/tokens/new) with at least `read:packages`.

```bash
export CR_PAT=YOUR_TOKEN
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
```

## Setting things up

Default addresses for local development:

- Portal: http://localhost:3000
- Strapi: http://localhost:1337
- Platform (Thingsboard): http://localhost:9090

Strapi includes the Strapi CMS UI, plugins (`strapi-backend/src/plugins/thingsboard-plugin`), and, in our case, comes with a dedicated Postgres. The platform comes with default users user:password `sysadmin@thingsboard.org:sysadmin` for the default admin with admin UI access and `tenant@thingsboard.org:tenant` for the default tenant.

### Strapi

- Make sure to set all roles and permissions for `Authenticated` and `Public` users under http://localhost:1337/admin/settings/users-permissions/roles. This can include all `find` and `findOne` permissions across all routes and all permissions for the `Thingsboard-plugin` route.

### Portal Users

- New users can register by clicking `Jetzt registrieren` on the login page. Or directly navigate to http://localhost:3000/signup/.
- Each newly registered user receives a `Tenant` account in the Thingsboard platform.
- Portal users are able to test, i.e. deploy, `Anwendungsfälle`. Deployed Anwendungsfälle (use cases) then list, i.e. display, all connected Thingsboard dashboards and devices in the user's portal.

### Creating a Use Case

- Create and publish a Use Case in the [Strapi Admin Dashboard](http://localhost:1337/admin/content-manager/collectionType/api::use-case.use-case). You need to be logged in as admin.
- Select a `Device Profile` of the (Thingsboard) Tenant which should be the Use-Case owner. By default, you can use the tenant named `Tenant`. All Thingsboard assets in a use case must be owned by the same Thingboard Tenant.
- Fill out the mandatory fields.
- Add a `Device Profile` and all linked assets to this Device Profile -- for the chosen Use Case owner Tenant. That is, this can include a `Rule Chain`. If linked assets are missing, the deployment of the Use Case will fail for users.
- Under `setupSteps`, add the `setupInstruction`. Under `thingsboard_profile`, you must add the very same `Device Profile` which was selected earlier.

### Deploying Use Cases

- A Use Case is deployed if a user fulfills all `Anwendungsfall einrichten` steps in the Portal. Use Cases are deployed by creating a copy of all Use Case assets into the user's Thingsboard tenant account.

## Thingsboard database

Thingsboard uses a Postgres internally. To connect to it on localhost, run:

```bash
docker exec -it mytb bash -c "echo \"listen_addresses = '*'\" >> /data/db/postgresql.conf"
docker exec -it mytb bash -c "echo \"host    all    all    0.0.0.0/0    md5\" >> /data/db/pg_hba.conf"
docker exec mytb psql -U thingsboard -c "ALTER USER thingsboard WITH PASSWORD 'postgres';"
```

Where `thingsboard:postgres` is the default `user:password` (for some reason, it has to be re-applied manually).
