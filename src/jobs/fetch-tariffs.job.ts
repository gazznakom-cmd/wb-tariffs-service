import wbApiService from "#services/wb-api.service.js";
import tariffsRepository from "#repositories/tariffs.repository.js";

/**
 * Парсит строковое значение коэффициента в число
 * @param {string} value - Значение типа "115" или "11,2"
 * @returns {number}
 */
function parseCoefficient(value: string): number {
    return parseFloat(value.replace(",", "."));
}

/**
 * Задача: получение и сохранение тарифов WB
 */
export async function fetchAndSaveTariffs() {
    try {
        console.log("[Fetch Tariffs] Starting...");

        const response = await wbApiService.getCurrentBoxTariffs();
        const warehouseList = response.response.data.warehouseList;

        const today = new Date().toISOString().split("T")[0];

        const tariffs = warehouseList.map((warehouse) => ({
            warehouse_name: warehouse.warehouseName,
            geo_name: warehouse.geoName || "",
            box_delivery_base: parseCoefficient(warehouse.boxDeliveryBase),
            box_delivery_liter: parseCoefficient(warehouse.boxDeliveryLiter),
            box_delivery_coef: parseCoefficient(warehouse.boxDeliveryCoefExpr),
            box_storage_base: parseCoefficient(warehouse.boxStorageBase),
            box_storage_liter: parseCoefficient(warehouse.boxStorageLiter),
            box_storage_coef: parseCoefficient(warehouse.boxStorageCoefExpr),
            tariff_date: today,
        }));

        await tariffsRepository.upsertDailyTariffs(tariffs);

        console.log(`[Fetch Tariffs] ✓ Saved ${tariffs.length} tariffs for ${today}`);
    } catch (error) {
        console.error("[Fetch Tariffs] ✗ Error:", error instanceof Error ? error.message : String(error));
        throw error;
    }
}
