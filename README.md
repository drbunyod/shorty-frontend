# Shorty frontend

Vue 3 and Vite frontend for Shorty. The API and PostgreSQL database live in the separate `shorty-api` repository. Public short links use the origin of the page being viewed: `http://localhost:5173` locally and `https://shorty.uz` on the VPS.

## Local setup

Use Node.js 24 LTS and npm. Set up PostgreSQL and the API using the API repository's README first.

```sh
cp .env.example .env
npm ci
npm run dev
```

Open `http://localhost:5173`. `VITE_API_URL` in `.env` should point to the local API, normally `http://localhost:3000/v1`. Run `npm run build` to check the production build. Vite embeds `VITE_` values at build time, so rebuild after changing them.

## Ubuntu VPS deployment

This setup keeps Shorty separate from other sites on the VPS:

- Nginx serves the built frontend at `shorty.uz` and proxies `/v1/` to the API. Its SPA fallback also serves `/login`, `/links`, and public short-code paths.
- systemd runs the API on `127.0.0.1:3100`; the API port is not opened to the internet.
- PostgreSQL runs locally (or at another address in `DATABASE_URL`).
- Certbot adds HTTPS to Shorty's own Nginx server block. There is no Docker dependency.

The example paths below are `/srv/shorty/frontend` and `/srv/shorty/api`. Replace them consistently if you use other paths. Both repositories must be committed and pushed before `git clone` or `git pull` can deploy their current code.

### 1. Prepare the server

Install Node.js 24 LTS, PostgreSQL, and Nginx. Use a regular deployment user that can read both repositories and run the API. Confirm `shorty.uz` points at the VPS and ports 80 and 443 are open. Check that no existing Nginx server block claims `shorty.uz`. Check that port 3100 is unused; if it is taken, choose another port in both the API `.env` and Nginx config.

Clone both repositories under `/srv/shorty/` using your existing Git access. Replace the two `YOUR_*_GIT_URL` placeholders before running these commands. The directories should be owned by the deployment user:

```sh
sudo mkdir -p /srv/shorty
sudo chown "$USER":"$USER" /srv/shorty
git clone YOUR_FRONTEND_GIT_URL /srv/shorty/frontend
git clone YOUR_API_GIT_URL /srv/shorty/api
```

Do not put `.env` files in Git. The API README covers creation of the PostgreSQL role and database, required environment variables, and migrations.

### 2. Install and start the API

In `/srv/shorty/api`, copy `.env.sample` to `.env` and set at least:

```dotenv
NODE_ENV=production
HOST=127.0.0.1
PORT=3100
CORS_ORIGINS=https://shorty.uz
PUBLIC_BASE_URL=https://shorty.uz
DATABASE_URL=postgresql://shorty:YOUR_URL_ENCODED_PASSWORD@127.0.0.1:5432/shorty?schema=public
ACCESS_TOKEN_SECRET=YOUR_RANDOM_SECRET
ACCESS_TOKEN_EXP=1h
REFRESH_TOKEN_SECRET=ANOTHER_RANDOM_SECRET
REFRESH_TOKEN_EXP=7d
```

Generate each secret independently, for example with `openssl rand -hex 32`. Keep the file readable only by the deployment user (`chmod 600 .env`). Then:

```sh
cd /srv/shorty/api
npm ci
npx prisma generate --config prisma.config.js
npx prisma migrate deploy --config prisma.config.js
```

Copy `deploy/shorty-api.service` from the API repository to `/etc/systemd/system/shorty-api.service`. Replace `REPLACE_WITH_DEPLOY_USER` and check the `node` path with `command -v node`. Then run:

```sh
sudo cp deploy/shorty-api.service /etc/systemd/system/shorty-api.service
sudoedit /etc/systemd/system/shorty-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now shorty-api
sudo systemctl status shorty-api
curl http://127.0.0.1:3100/v1/links/count
```

If startup fails, inspect `sudo journalctl -u shorty-api -n 100 --no-pager`.

### 3. Build the frontend and enable Nginx

```sh
cd /srv/shorty/frontend
cp .env.production.example .env.production
npm ci
npm run build
```

The production build must use `VITE_API_URL=/v1`. The included `.env.production.example` sets that value, so requests and authentication cookies stay on `shorty.uz`.

Copy `deploy/shorty.nginx.conf` to a new `/etc/nginx/sites-available/shorty` file. Enable only that site, then check and reload:

```sh
sudo cp deploy/shorty.nginx.conf /etc/nginx/sites-available/shorty
sudo ln -s /etc/nginx/sites-available/shorty /etc/nginx/sites-enabled/shorty
sudo nginx -t
sudo systemctl reload nginx
curl http://shorty.uz/v1/links/count
```

The Nginx `proxy_pass` deliberately has no trailing URI, so Express receives the full `/v1/...` path. Nginx replaces client-supplied forwarded IP headers with its observed client address for country analytics.

### 4. Add HTTPS

Once the HTTP site answers on port 80, install Certbot if the VPS does not already have it (see the official instructions below). Use its Nginx integration for **this domain only**:

```sh
sudo certbot --nginx -d shorty.uz
sudo certbot renew --dry-run
```

Certbot edits the installed Nginx file. Do not recopy the HTTP template over that file during later deploys. Confirm `https://shorty.uz` and `https://shorty.uz/v1/links/count` work before using the app. If you later add `www.shorty.uz`, configure its DNS and certificate separately.

### 5. Deploy later changes

Push changes from your workstation, then on the VPS:

```sh
cd /srv/shorty/api
git pull --ff-only
npm ci
npx prisma generate --config prisma.config.js
npx prisma migrate deploy --config prisma.config.js
sudo systemctl restart shorty-api

cd /srv/shorty/frontend
git pull --ff-only
npm ci
npm run build
```

Back up the production database before applying new migrations. Reload Nginx only when its installed configuration changes. After each deploy, check the API count endpoint, log in, create a disposable link, open it, and remove it.

## References

- [Node.js downloads](https://nodejs.org/en/download)
- [Prisma production migrations](https://docs.prisma.io/docs/cli/migrate/deploy)
- [Nginx proxy module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) and [try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)
- [Certbot Nginx instructions](https://certbot.eff.org/instructions?os=snap&tab=standard&ws=nginx)
