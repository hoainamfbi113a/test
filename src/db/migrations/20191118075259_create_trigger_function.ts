import * as Knex from "knex";

const tableName = "organization";
export async function up(knex: Knex): Promise<any> {
  await knex.raw(`CREATE FUNCTION public.manage_pg_user()
    RETURNS trigger
    LANGUAGE 'plpgsql'
     NOT LEAKPROOF
    AS $BODY$BEGIN
    IF (TG_OP = 'INSERT') THEN
    	IF (NOT EXISTS (SELECT 1 FROM pg_user WHERE usename = NEW.id::varchar(255))) THEN
    		EXECUTE format('CREATE USER "%s" WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1 PASSWORD ''%s'';', NEW.id, NEW.password);    
    	END IF;
    
    	EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "%s";', NEW.id);
    ELSIF (TG_OP = 'DELETE') THEN
    	EXECUTE format('REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM "%s";
    			   		DROP USER IF EXISTS "%s";', 
    			   		OLD.id, OLD.id);
    END IF;
    
    RETURN NULL;
    END;$BODY$;
    
    ALTER FUNCTION public.manage_pg_user() OWNER TO postgres;`)
  await knex.raw(`CREATE TRIGGER insert_delete_org
                  AFTER INSERT OR DELETE
                  ON public.${tableName}
                  FOR EACH ROW
                  EXECUTE PROCEDURE public.manage_pg_user();`);
}

// tslint:disable-next-line:no-empty
export async function down(knex: Knex): Promise<any> {
  await knex.raw(`DROP TRIGGER IF EXISTS insert_delete_org ON public.${tableName};`);
  await knex.raw('DROP FUNCTION IF EXISTS manage_pg_user;');
}
