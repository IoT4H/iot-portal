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

## Thingsboard database

Thingsboard uses a Postgres internally. To connect to it on localhost, run:

```bash
docker exec -it mytb bash -c "echo \"listen_addresses = '*'\" >> /data/db/postgresql.conf"
docker exec -it mytb bash -c "echo \"host    all    all    0.0.0.0/0    md5\" >> /data/db/pg_hba.conf"
docker exec mytb psql -U thingsboard -c "ALTER USER thingsboard WITH PASSWORD 'postgres';"
```

Where thingsboard is the default user.
