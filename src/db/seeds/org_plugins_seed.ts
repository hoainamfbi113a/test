import * as Knex from "knex";
exports.seed = (knex: Knex) => seed(knex);

async function seed(knex: Knex) {
    const orgArray = ['8a99bde0-d578-49a2-97eb-1a0958ca6409', '08bbb455-7e8c-4cf5-89af-d7345ed2a64f', '9393bff4-f957-41ec-b4a7-f7e8b6e4422b'];
    const pluginIds = ['13120f94-552d-458e-b768-2137384fef1d', '77438a2b-da14-47ba-a426-41a1c85bf1c8', 'ec9170ef-a14c-44d5-b4ef-249bbefb7f46'];
    // Deletes ALL existing entries
    await knex("org_plugins").del();
    let index = 0;
    for (var i in orgArray) {
        await knex("org_plugins").insert({
            org_id: orgArray[i],
            plugin_id: pluginIds[index % pluginIds.length],
        });
        index += 1;
    }

}
