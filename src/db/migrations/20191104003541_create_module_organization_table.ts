import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const tableName = "module_organization";
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await knex.schema.createTable(`${tableName}`, (table) => {
        table.uuid("id").unique().notNullable().primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.uuid("org_id").notNullable();
        table.uuid("module_id").notNullable();
        table.boolean("is_active").notNullable().defaultTo(knex.raw("false"));
        table.boolean("is_deleted").notNullable().defaultTo(knex.raw("false"));
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });
    await knex.raw(`CREATE POLICY "${tableName}_policy"
            ON public.${tableName}
            USING ("org_id"::text = CURRENT_USER);
            ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;`);
}

// tslint:disable-next-line:no-empty
export async function down(knex: Knex): Promise<any> {
}
