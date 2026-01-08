# Environment Variables

## CMS (Strapi)

**File:** `cms/.env`

```
HOST=0.0.0.0
PORT=1337
APP_KEYS=J3BCDjr2jepR9nXbQW1MLA==,h3KXWVhrpCto1eXFnsjdgw==,4bIYS0QVs0mNf6FUmUVYtA==,HuCZ9bYchFFBSD+WFuxW4Q==
API_TOKEN_SALT=8L9coT/3wERVKfW41sZYmA==
ADMIN_JWT_SECRET=u9a4xaBnVk4if3+Grmao4g==
TRANSFER_TOKEN_SALT=jYV0L8HqBLvB7P1YEROBNQ==
ENCRYPTION_KEY=TfLe37m6fQUtRnyUEJxnhg==
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
JWT_SECRET=tsStxJYcCOjxRkjq0/tCgw==
```

---

## Builder (Webstudio) - Base

**File:** `builder/apps/builder/.env`

```
DATABASE_URL=postgresql://webstudio:password@localhost:5435/webstudio?schema=public
DIRECT_URL=postgresql://webstudio:password@localhost:5435/webstudio?schema=public
AUTH_SECRET=secret
DEV_LOGIN=true
MAX_ASSETS_PER_PROJECT=50
POSTGREST_URL=http://localhost:3000
POSTGREST_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZHBpeHpvcWlpcmJtcGRpcHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYzMzY0MjgsImV4cCI6MTk4MTkxMjQyOH0.jjeYvTDrWP9pV7dfZr6fptualNQ3aR13kuPhvT25Sso
FEATURES=*
USER_PLAN=pro
```

---

## Builder (Webstudio) - Development

**File:** `builder/apps/builder/.env.development`

```
DEV_LOGIN=true
AUTH_SECRET=secret
SECURE_COOKIE=false
DATABASE_URL=postgresql://webstudio:password@localhost:5435/webstudio?schema=public
DIRECT_URL=postgresql://webstudio:password@localhost:5435/webstudio?schema=public
```

---

## Builder (Webstudio) - Production

**File:** `builder/apps/builder/.env.production`

```
USER_PLAN=
```

---

## Docker Compose

**File:** `builder/docker-compose.yaml`

```
PostgreSQL:
  POSTGRES_USER=webstudio
  POSTGRES_PASSWORD=password
  POSTGRES_DB=webstudio

PostgREST:
  PGRST_DB_URI=postgresql://webstudio:password@postgres:5432/webstudio
  PGRST_DB_SCHEMA=public
  PGRST_DB_ANON_ROLE=anon
  PGRST_JWT_SECRET=jwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecret
```
