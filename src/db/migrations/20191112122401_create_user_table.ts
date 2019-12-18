import * as Knex from "knex";

const tableName = "user";
export async function up(knex: Knex): Promise<any> {
    if (!await knex.schema.hasTable(tableName)) {
        await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await knex.schema.createTable(`${tableName}`, (table) => {
            table.uuid("id").unique().notNullable().primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.uuid("org_id").notNullable();
            table.string("email").notNullable();
            table.string("first_name");
            table.string("last_name");
            table.string("password").notNullable();
            table.string("phone_number");
            table.string("verify_code");
            table.uuid("team_id");
            table.jsonb("permission");
            table.boolean("activated").notNullable().defaultTo(knex.raw("false"));
            table.boolean("is_super").notNullable().defaultTo(knex.raw("false"));
            table.boolean("is_deleted").notNullable().defaultTo(knex.raw("false"));
            table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
            table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        });
        await knex.raw(`CREATE POLICY "${tableName}_policy"
                ON public.${tableName}
                USING ("org_id"::text = CURRENT_USER)`);
        await knex.raw(`ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY`);
    }
}

// tslint:disable-next-line:no-empty
export async function down(knex: Knex): Promise<any> {
}
