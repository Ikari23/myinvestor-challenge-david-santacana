import type { Fund } from '../types/funds';


export const getFundName = (fund: { id: string; name?: string }, fallback?: string): string => {
    return fund.name || fallback || `Fondo ${fund.id}`;
};

export const calculateFundQuantity = (amount: number, fundValue: number): number => {
    return amount / fundValue;
};

export const findFundById = (funds: Fund[], fundId: string): Fund | undefined => {
    return funds.find(fund => fund.id === fundId);
};

export const getFundCurrency = (funds: Fund[], fundId: string, defaultCurrency: string = 'EUR'): string => {
    const fund = findFundById(funds, fundId);
    return fund?.currency || defaultCurrency;
};

export const getCategoryDisplayName = (category: string): string => {
    const categoryMap: Record<string, string> = {
        'GLOBAL': 'Global',
        'TECH': 'Tecnología',
        'HEALTH': 'Salud',
        'MONEY_MARKET': 'Mercado Monetario'
    };

    return categoryMap[category] || category;
};

export const groupPortfolioByCategory = <T extends { id: string }>(
    portfolioItems: T[],
    funds: Fund[]
): Record<string, T[]> => {
    return portfolioItems.reduce((groups, item) => {
        const fund = findFundById(funds, item.id);
        const category = fund?.category || 'OTHER';

        if (!groups[category]) {
            groups[category] = [];
        }

        groups[category].push(item);
        return groups;
    }, {} as Record<string, T[]>);
};

export const calculateCategoryTotal = (portfolioItems: { totalValue: number }[]): number => {
    return portfolioItems.reduce((total, item) => total + item.totalValue, 0);
};