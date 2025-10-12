
export const formatNumber = (value: number, decimals: number = 2): string => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '-';
    }

    return value.toLocaleString('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

export const formatCurrency = (value: number, currency: string = 'EUR'): string => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '-';
    }

    const formatted = value.toLocaleString('es-ES', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatted.replace('US$', '$');
};