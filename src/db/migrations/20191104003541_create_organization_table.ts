import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    return knex.schema.createTable("organization", (table) => {
        table.uuid("id").unique().notNullable().primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("password").notNullable();
        table.string("company_name");
        table.boolean("is_active").notNullable().defaultTo(knex.raw("false"));
        table.boolean("is_deleted").notNullable().defaultTo(knex.raw("false"));
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });
}

// tslint:disable-next-line:no-empty
export async function down(knex: Knex): Promise<any> {
}
