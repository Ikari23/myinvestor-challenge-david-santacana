import { useMemo } from 'react';
import { groupPortfolioByCategory, getCategoryDisplayName } from '../utils/fundUtils';
import { sortByName } from '../utils/sortUtils';
import type { Fund } from '../types/funds';

interface PortfolioItem {
    id: string;
    name?: string;
    quantity: number;
    totalValue: number;
}

/**
 * Custom hook para manejar la categorización y ordenamiento del portfolio
 * @param portfolio - Lista de elementos del portfolio
 * @param funds - Lista de fondos disponibles
 * @returns Portfolio agrupado y ordenado por categorías
 */
export const usePortfolioCategories = (portfolio: PortfolioItem[], funds: Fund[]) => {
    const categorizedPortfolio = useMemo(() => {
        const grouped = groupPortfolioByCategory(portfolio, funds);

        // Ordenar elementos dentro de cada categoría
        Object.keys(grouped).forEach(category => {
            if (grouped[category]) {
                grouped[category] = sortByName(grouped[category], (item) => item.name || `Fondo ${item.id}`);
            }
        });

        return grouped;
    }, [portfolio, funds]);

    const sortedCategories = useMemo(() => {
        return Object.entries(categorizedPortfolio)
            .sort(([categoryA], [categoryB]) =>
                getCategoryDisplayName(categoryA).localeCompare(getCategoryDisplayName(categoryB), 'es')
            )
            .map(([category]) => category);
    }, [categorizedPortfolio]);

    return {
        categorizedPortfolio,
        sortedCategories
    };
};