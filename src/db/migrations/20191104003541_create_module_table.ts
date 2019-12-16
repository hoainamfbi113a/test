import * as Knex from "knex";

const tableName = "module";
export async function up(knex: Knex): Promise<any> {
    if (!await knex.schema.hasTable(tableName)) {
        await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await knex.schema.createTable(`${tableName}`, (table) => {
            table.uuid("id").unique().notNullable().primary().defaultTo(knex.raw("uuid_generate_v4()"));
            table.string("name");
            table.boolean("is_deleted").notNullable().defaultTo(knex.raw("false"));
            table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
            table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        });
    }
}

// tslint:disable-next-line:no-empty
export async function down(knex: Knex): Promise<any> {
}
