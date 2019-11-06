import * as Knex from "knex";
exports.seed = (knex: Knex) => seed(knex);

async function seed(knex: Knex) {
    // Deletes ALL existing entries
    await knex("organization").del();
    const orgId = await knex("organization").insert({
        company_name: "DEV SOLAZU",
        created_at: "2019-06-23T18:11:15.991Z",
        updated_at: "2019-06-23T18:11:15.991Z",
        // tslint:disable-next-line:object-literal-sort-keys
        password: "12345678",
    }).returning("id");
    await knex.raw(`
                    CREATE USER "${orgId}" WITH
                        LOGIN
                        NOSUPERUSER
                        NOCREATEDB
                        NOCREATEROLE
                        INHERIT
                        NOREPLICATION
                        CONNECTION LIMIT -1
                        PASSWORD '${orgId}';
                    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${orgId}";
                `);
}
