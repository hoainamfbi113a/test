import * as Knex from "knex";
import { seed } from "../seeds/mail_templates_seed";
const tableName = "mail_templates";
export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable(`${tableName}`, (table) => {
    table.string("type").primary();
    table.string("subject").notNullable();
    table.text("body").notNullable();
    table.boolean("is_deleted").notNullable().defaultTo(knex.raw("false"));
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
  await seed(knex);
}


export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists(tableName);
}

