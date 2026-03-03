import { google } from "googleapis";
import env from "#config/env/env.js";
import { readFile } from "fs/promises";
import type { TariffRow } from "#types/tariffs.types.js";

export class GoogleSheetsService {
    private sheets: any;
    private auth: any;

    constructor() {
        this.initAuth();
    }

    private async initAuth() {
        const credentials = JSON.parse(await readFile(env.GOOGLE_CREDENTIALS_PATH, "utf-8"));

        this.auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        this.sheets = google.sheets({ version: "v4", auth: this.auth });
    }

    /**
     * Обновить данные в Google таблице
     * @param {string} spreadsheetId - ID таблицы
     * @param {TariffRow[]} data - Данные для записи
     */
    async updateTariffs(spreadsheetId: string, data: TariffRow[]) {
        if (!this.sheets) {
            await this.initAuth();
        }

        const sheetName = "stocks_coefs";

        // Подготовка данных для записи
        const headers = ["Склад", "Коэффициент", "Дата"];
        const rows = data.map((row) => [row.warehouse_name, row.coefficient, row.date]);

        const values = [headers, ...rows];

        // Очистка листа
        await this.sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: `${sheetName}!A:Z`,
        });

        // Запись данных
        await this.sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: "RAW",
            requestBody: {
                values,
            },
        });
    }

    /**
     * Обновить все таблицы из списка
     * @param {TariffRow[]} data - Данные для записи
     */
    async updateAllSheets(data: TariffRow[]) {
        const sheetIds = env.GOOGLE_SHEET_IDS;

        for (const sheetId of sheetIds) {
            try {
                await this.updateTariffs(sheetId, data);
                console.log(`✓ Updated sheet: ${sheetId}`);
            } catch (error) {
                console.error(`✗ Failed to update sheet ${sheetId}:`, error instanceof Error ? error.message : String(error));
            }
        }
    }
}

export default new GoogleSheetsService();
