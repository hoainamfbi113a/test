import * as Knex from "knex";
exports.seed = (knex: Knex) => seed(knex);

async function seed(knex: Knex) {
    const orgArray = ['8a99bde0-d578-49a2-97eb-1a0958ca6409', '08bbb455-7e8c-4cf5-89af-d7345ed2a64f', '9393bff4-f957-41ec-b4a7-f7e8b6e4422b'];
    // Deletes ALL existing entries
    await knex("organization").del();
    for (var i in orgArray) {
        const orgId = await knex("organization").insert({
            id: orgArray[i],
            company_name: "DEV SOLAZU",
            created_at: new Date(),
            updated_at: new Date(),
            is_active: true,
            // tslint:disable-next-line:object-literal-sort-keys
            password: '12345678',
        }).returning("id");
    }
}
