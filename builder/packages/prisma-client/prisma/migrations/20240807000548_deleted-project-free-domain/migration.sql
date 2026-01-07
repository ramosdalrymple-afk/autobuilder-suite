-- to avoid some issues with backups we are using explicit schemas for "extensions" functions

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
UPDATE "Project" SET "domain"=uuid_generate_v4() WHERE "isDeleted" = true;