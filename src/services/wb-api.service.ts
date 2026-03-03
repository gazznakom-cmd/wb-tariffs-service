import env from "#config/env/env.js";
import type { BoxTariffsResponse } from "#types/tariffs.types.js";

export class WBApiService {
    private readonly apiToken: string;
    private readonly baseUrl = "https://common-api.wildberries.ru";

    constructor() {
        this.apiToken = env.WB_API_TOKEN;
    }

    /**
     * Получить тарифы для коробов на указанную дату
     * @param {string} date - Дата в формате YYYY-MM-DD
     * @returns {Promise<BoxTariffsResponse>}
     */
    async getBoxTariffs(date: string): Promise<BoxTariffsResponse> {
        const url = `${this.baseUrl}/api/v1/tariffs/box?date=${date}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: this.apiToken,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`WB API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Получить текущие тарифы (на сегодня)
     * @returns {Promise<BoxTariffsResponse>}
     */
    async getCurrentBoxTariffs(): Promise<BoxTariffsResponse> {
        const today = new Date().toISOString().split("T")[0];
        return this.getBoxTariffs(today);
    }
}

export default new WBApiService();
