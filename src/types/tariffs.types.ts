/**
 * Данные о тарифах склада из WB API
 */
export interface WarehouseData {
    warehouseName: string;
    geoName?: string;
    boxDeliveryBase: string;
    boxDeliveryLiter: string;
    boxDeliveryCoefExpr: string;
    boxDeliveryMarketplaceBase?: string;
    boxDeliveryMarketplaceLiter?: string;
    boxDeliveryMarketplaceCoefExpr?: string;
    boxStorageBase: string;
    boxStorageLiter: string;
    boxStorageCoefExpr: string;
}

/**
 * Ответ API WB на запрос тарифов для коробов
 */
export interface BoxTariffsResponse {
    response: {
        data: {
            dtNextBox: string;
            dtTillMax: string;
            warehouseList: WarehouseData[];
        };
    };
}

/**
 * Данные тарифа для сохранения в БД
 */
export interface TariffData {
    warehouse_name: string;
    geo_name: string;
    box_delivery_base: number;
    box_delivery_liter: number;
    box_delivery_coef: number;
    box_storage_base: number;
    box_storage_liter: number;
    box_storage_coef: number;
    tariff_date: string;
}

/**
 * Строка данных для Google Sheets
 */
export interface TariffRow {
    warehouse_name: string;
    coefficient: number;
    date: string;
}
