import { migrate } from "#postgres/knex.js";
import cron from "node-cron";
import { fetchAndSaveTariffs } from "#jobs/fetch-tariffs.job.js";
import { updateGoogleSheets } from "#jobs/update-sheets.job.js";

console.log("🚀 Starting WB Tariffs Service...");

// Запуск миграций
await migrate.latest();
console.log("✓ Database migrations completed");

// Первоначальная загрузка данных
try {
    await fetchAndSaveTariffs();
    await updateGoogleSheets();
    console.log("✓ Initial data fetch completed");
} catch (error) {
    console.error("✗ Initial data fetch failed:", error instanceof Error ? error.message : String(error));
}

// Планировщик: каждый час получаем тарифы WB
cron.schedule("0 * * * *", async () => {
    console.log("\n⏰ Running hourly tariff fetch...");
    try {
        await fetchAndSaveTariffs();
    } catch (error) {
        console.error("Hourly fetch failed:", error);
    }
});

// Планировщик: каждые 30 минут обновляем Google таблицы
cron.schedule("*/30 * * * *", async () => {
    console.log("\n⏰ Running Google Sheets update...");
    try {
        await updateGoogleSheets();
    } catch (error) {
        console.error("Sheets update failed:", error);
    }
});

console.log("✓ Schedulers started:");
console.log("  - Fetch WB tariffs: every hour");
console.log("  - Update Google Sheets: every 30 minutes");
console.log("\n📊 Service is running...\n");