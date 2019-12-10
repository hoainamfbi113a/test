import * as Knex from "knex";

const tableName = "org_plugins";
export async function up(knex: Knex): Promise<any> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await knex.schema.createTable(`${tableName}`, (table) => {
        table.primary(["id"]);
        table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()"));
        table.uuid("org_id").notNullable();
        table.uuid("plugin_id").notNullable();
        table.boolean("is_active").notNullable().defaultTo(knex.raw("true"));
        table.boolean("is_deleted").notNullable().defaultTo(knex.raw("false"));
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        table.unique(['org_id', 'plugin_id']);
    });
    await knex.raw(`CREATE POLICY "${tableName}_policy"
            ON public.${tableName}
            USING ("org_id"::text = CURRENT_USER)`);
    await knex.raw(`ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY`);
}

// tslint:disable-next-line:no-empty
export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTableIfExists(tableName);
}
