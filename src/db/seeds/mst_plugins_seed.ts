import * as Knex from "knex";
exports.seed = (knex: Knex) => seed(knex);

async function seed(knex: Knex) {
  const pluginIds = [
    "13120f94-552d-458e-b768-2137384fef1d",
    "77438a2b-da14-47ba-a426-41a1c85bf1c8",
    "ec9170ef-a14c-44d5-b4ef-249bbefb7f46",
  ];
  // Deletes ALL existing entries
  await knex("mst_plugins").del();
  // tslint:disable-next-line: forin
  for (var i in pluginIds) {
    await knex("mst_plugins").insert({
      id: pluginIds[i],
      key: `PluginDemo${i}`,
      name: `Plugin ${i}`,
    });
  }
}
