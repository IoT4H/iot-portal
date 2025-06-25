"use strict";


module.exports = {
  async up(knex) {
    // You have full access to the Knex.js API with an already initialized connection to the database

    const exists = await knex.schema.hasTable("use_cases");
    if (exists) {
      const hasColumn = await knex.schema.hasColumn("use_cases", "description");
      if (hasColumn) {
        const rows = await knex("use_cases").select("id", "description");

        for (const row of rows) {
          try {
            JSON.parse(row.description); // it's valid JSON
          } catch (e) {
            const jsonValue = [
              {
                type: "paragraph",
                children: [
                  { text: row.description || "" }
                ]
              }
            ];

            await knex("use_cases")
              .where({ id: row.id })
              .update({
                description: JSON.stringify(jsonValue)
              });
          }
        }
      } else {
        console.log("Column description in use_cases does not exist");
      }

    } else {
      console.log("Table use_cases does not exist");
    }


  }
};
