/**
 * Formatea un precio para mostrar
 * @param {number} price - Precio en la unidad completa (pesos, no centavos)
 * @param {string} currency - Código de moneda (por defecto 'ARS')
 * @returns {string} Precio formateado
 */
export const formatPrice = (price, currency = 'ARS') => {
    const locale = currency === 'USD' ? 'en-US' : 'es-AR';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(price);
};

/**
 * Convierte un precio a centavos para Stripe
 * @param {number} price - Precio en unidad completa
 * @returns {number} Precio en centavos
 */
export const toCents = (price) => {
    return Math.round(price * 100);
};

/**
 * Convierte centavos a unidad completa
 * @param {number} cents - Precio en centavos
 * @returns {number} Precio en unidad completa
 */
export const fromCents = (cents) => {
    return cents / 100;
};
