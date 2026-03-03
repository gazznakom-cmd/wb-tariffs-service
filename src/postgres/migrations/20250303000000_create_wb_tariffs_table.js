/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("wb_tariffs", (table) => {
        table.increments("id").primary();
        table.string("warehouse_name").notNullable();
        table.string("geo_name").defaultTo("");
        table.decimal("box_delivery_base", 10, 2).notNullable();
        table.decimal("box_delivery_liter", 10, 2).notNullable();
        table.decimal("box_delivery_coef", 10, 2).notNullable();
        table.decimal("box_storage_base", 10, 2).notNullable();
        table.decimal("box_storage_liter", 10, 2).notNullable();
        table.decimal("box_storage_coef", 10, 2).notNullable();
        table.date("tariff_date").notNullable();
        table.timestamps(true, true);

        // Уникальный индекс: один склад - одна дата
        table.unique(["warehouse_name", "tariff_date"]);
        
        // Индекс для быстрого поиска по дате
        table.index("tariff_date");
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("wb_tariffs");
}
