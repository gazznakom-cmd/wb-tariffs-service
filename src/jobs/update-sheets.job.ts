import googleSheetsService from "#services/google-sheets.service.js";
import tariffsRepository from "#repositories/tariffs.repository.js";

/**
 * Задача: обновление данных в Google таблицах
 */
export async function updateGoogleSheets() {
    try {
        console.log("[Update Sheets] Starting...");

        const latestTariffs = await tariffsRepository.getLatestTariffs();

        if (latestTariffs.length === 0) {
            console.log("[Update Sheets] No tariffs found in database");
            return;
        }

        await googleSheetsService.updateAllSheets(latestTariffs);

        console.log(`[Update Sheets] ✓ Updated ${latestTariffs.length} rows in all sheets`);
    } catch (error) {
        console.error("[Update Sheets] ✗ Error:", error instanceof Error ? error.message : String(error));
        throw error;
    }
}
