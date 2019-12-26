import * as Knex from "knex";

const tableName = "organization";
export async function up(knex: Knex): Promise<any> {
  if (await knex.schema.hasTable(tableName)) {
    await knex.schema.alterTable(tableName, (table) => {
      table.dropColumns("created_at", "updated_at");
    })
    await knex.schema.alterTable(tableName, (table) => {
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    })
  }
}

export async function down(knex: Knex): Promise<any> {
}

