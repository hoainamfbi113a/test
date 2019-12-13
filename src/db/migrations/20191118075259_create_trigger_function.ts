import * as Knex from "knex";

const tableName = "organization";
const trigger_function_name = "manage_pg_user";
const trigger_name = "insert_delete_update_org";
export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
  CREATE FUNCTION public.${trigger_function_name} ()
  RETURNS TRIGGER
  LANGUAGE 'plpgsql'
  NOT LEAKPROOF
  AS $BODY$
DECLARE
  counter INTEGER;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NOT EXISTS (
      SELECT
        1
      FROM
        pg_user
      WHERE
        usename = NEW.id::varchar(255))) THEN
      EXECUTE format('CREATE USER "%s" WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1 PASSWORD ''%s'';', NEW.id, NEW.password);
    END IF;
    IF (NEW.is_active = TRUE) THEN
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "%s";', NEW.id);
    END IF;
  ELSIF (TG_OP = 'UPDATE'
      AND NEW.is_active <> OLD.is_active) THEN
    SELECT
      count(*) INTO counter
    FROM
      pg_roles
    WHERE
      rolname = NEW.id::varchar(255);
    IF (counter > 0) THEN
      IF (NEW.is_active = TRUE) THEN
        EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "%s";', OLD.id);
      ELSE
        EXECUTE format('REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM "%s";', OLD.id, OLD.id);
      END IF;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    SELECT
      count(*) INTO counter
    FROM
      pg_roles
    WHERE
      rolname = OLD.id::varchar(255);
    IF (counter > 0) THEN
      EXECUTE format('REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM "%s";DROP USER IF EXISTS "%s";', OLD.id, OLD.id);
    END IF;
  END IF;
  RETURN NULL;
END;
$BODY$;
ALTER FUNCTION public.${trigger_function_name} () OWNER TO postgres;
  `)
  await knex.raw(`CREATE TRIGGER ${trigger_name}
                  AFTER INSERT OR DELETE OR UPDATE
                  ON public.${tableName}
                  FOR EACH ROW
                  EXECUTE PROCEDURE public.${trigger_function_name}();`);
}

// tslint:disable-next-line:no-empty
export async function down(knex: Knex): Promise<any> {
  await knex.raw(`DROP TRIGGER IF EXISTS ${trigger_name} ON public.${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS ${trigger_function_name};`);
}
