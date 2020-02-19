import * as Knex from "knex";

const tableName = "user";

export async function up(knex: Knex): Promise<any> {
  if (await knex.schema.hasTable(tableName)) {
    await knex.raw(`ALTER TABLE "public"."${tableName}"
    ALTER COLUMN "org_id" SET DEFAULT (CURRENT_USER)::uuid;`);
  }
}
export async function down(knex: Knex): Promise<any> {}
