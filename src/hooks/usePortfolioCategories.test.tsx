import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePortfolioCategories } from './usePortfolioCategories';
import type { Fund } from '../types/funds';

describe('usePortfolioCategories', () => {
    const mockFunds: Fund[] = [
        {
            id: '1',
            name: 'Fondo Renta Fija',
            category: 'renta-fija',
            subcategory: 'corporativo',
            price: 100,
            minimumAmount: 100,
            currency: 'EUR'
        },
        {
            id: '2',
            name: 'Fondo Renta Variable',
            category: 'renta-variable',
            subcategory: 'nacional',
            price: 150,
            minimumAmount: 100,
            currency: 'EUR'
        },
        {
            id: '3',
            name: 'Fondo Mixto',
            category: 'mixto',
            subcategory: 'conservador',
            price: 120,
            minimumAmount: 100,
            currency: 'EUR'
        }
    ];

    const mockPortfolio = [
        { id: '1', name: 'Fondo Renta Fija', quantity: 10, totalValue: 1000 },
        { id: '2', name: 'Fondo Renta Variable', quantity: 5, totalValue: 750 },
        { id: '3', name: 'Fondo Mixto', quantity: 8, totalValue: 960 }
    ];

    it('debería retornar portfolio categorizado y categorías ordenadas', () => {
        const { result } = renderHook(() =>
            usePortfolioCategories(mockPortfolio, mockFunds)
        );

        expect(result.current).toHaveProperty('categorizedPortfolio');
        expect(result.current).toHaveProperty('sortedCategories');
        expect(typeof result.current.categorizedPortfolio).toBe('object');
        expect(Array.isArray(result.current.sortedCategories)).toBe(true);
    });

    it('debería agrupar portfolio por categorías correctamente', () => {
        const { result } = renderHook(() =>
            usePortfolioCategories(mockPortfolio, mockFunds)
        );

        const { categorizedPortfolio } = result.current;

        expect(categorizedPortfolio).toHaveProperty('renta-fija');
        expect(categorizedPortfolio).toHaveProperty('renta-variable');
        expect(categorizedPortfolio).toHaveProperty('mixto');
    });

    it('debería manejar portfolio vacío', () => {
        const { result } = renderHook(() =>
            usePortfolioCategories([], mockFunds)
        );

        expect(result.current.categorizedPortfolio).toEqual({});
        expect(result.current.sortedCategories).toEqual([]);
    });

    it('debería manejar fondos vacíos', () => {
        const { result } = renderHook(() =>
            usePortfolioCategories(mockPortfolio, [])
        );

        expect(result.current.categorizedPortfolio).toHaveProperty('OTHER');
        expect(result.current.categorizedPortfolio.OTHER).toHaveLength(3);
        expect(result.current.sortedCategories).toEqual(['OTHER']);
    });

    it('debería recalcular cuando cambian las dependencias', () => {
        const { result, rerender } = renderHook(
            ({ portfolio, funds }) => usePortfolioCategories(portfolio, funds),
            {
                initialProps: {
                    portfolio: mockPortfolio.slice(0, 1),
                    funds: mockFunds.slice(0, 1)
                }
            }
        );

        const initialCategories = result.current.sortedCategories.length;

        rerender({
            portfolio: mockPortfolio,
            funds: mockFunds
        });

        expect(result.current.sortedCategories.length).toBeGreaterThan(initialCategories);
    });
});