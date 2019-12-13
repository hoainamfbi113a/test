import * as Knex from "knex";

const tableName = "mst_plugins";
export async function up(knex: Knex): Promise<any> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await knex.schema.createTable(`${tableName}`, (table) => {
        table.primary(["id"]);
        table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("name").notNullable();
        table.string("key").unique().notNullable();
        table.boolean("is_deleted").notNullable().defaultTo(knex.raw("false"));
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });
}

// tslint:disable-next-line:no-empty
export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTableIfExists(tableName);
}
