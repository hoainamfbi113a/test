import jwtService from "@enterprise/saas-base-service/dist/services/jwt.service";
import * as Knex from "knex";
exports.seed = (knex: Knex) => seed(knex);

async function seed(knex: Knex) {
  const orgArray = [
    "8a99bde0-d578-49a2-97eb-1a0958ca6409",
    "08bbb455-7e8c-4cf5-89af-d7345ed2a64f",
    "9393bff4-f957-41ec-b4a7-f7e8b6e4422b",
  ];
  // Deletes ALL existing entries
  await knex("user").del();
  // tslint:disable-next-line: forin
  for (var i in orgArray) {
    await knex("user").insert({
      org_id: orgArray[i],
      email: "admin" + i + "@slz.net",
      verify_code: "abc",
      activated: true,
      created_at: new Date(),
      updated_at: new Date(),
      // tslint:disable-next-line:object-literal-sort-keys
      password: await jwtService.hash("12345678"),
    });
  }
}
