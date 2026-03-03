import knex from "#postgres/knex.js";
import type { TariffData } from "#types/tariffs.types.js";

export class TariffsRepository {
    /**
     * Сохранить или обновить тарифы за день
     * @param {TariffData[]} tariffs
     */
    async upsertDailyTariffs(tariffs: TariffData[]) {
        if (tariffs.length === 0) return;

        await knex("wb_tariffs")
            .insert(tariffs)
            .onConflict(["warehouse_name", "tariff_date"])
            .merge();
    }

    /**
     * Получить актуальные тарифы (последние по дате)
     * @returns {Promise<Array>}
     */
    async getLatestTariffs() {
        const latestDate = await knex("wb_tariffs").max("tariff_date as max_date").first();

        if (!latestDate?.max_date) {
            return [];
        }

        return knex("wb_tariffs")
            .where("tariff_date", latestDate.max_date)
            .orderBy("box_storage_coef", "asc")
            .select("warehouse_name", "box_storage_coef as coefficient", "tariff_date as date");
    }

    /**
     * Получить тарифы за определенную дату
     * @param {string} date - Дата в формате YYYY-MM-DD
     */
    async getTariffsByDate(date: string) {
        return knex("wb_tariffs")
            .where("tariff_date", date)
            .orderBy("box_storage_coef", "asc")
            .select();
    }
}

export default new TariffsRepository();
