DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'course_admin') THEN
    CREATE ROLE course_admin WITH LOGIN SUPERUSER PASSWORD 'password';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'course_select') THEN
    CREATE DATABASE course_select OWNER course_admin;
  END IF;
END
$$;
