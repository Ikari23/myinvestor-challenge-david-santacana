import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { usePortfolioActions } from './usePortfolioActions';
import { useToast } from './useToast';

vi.mock('./useToast');

describe('usePortfolioActions', () => {
    const mockShowSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useToast as any).mockReturnValue({
            showSuccess: mockShowSuccess,
        });
    });

    it('debería retornar todas las funciones de acción', () => {
        const { result } = renderHook(() => usePortfolioActions());

        expect(result.current).toHaveProperty('onBuy');
        expect(result.current).toHaveProperty('onSell');
        expect(result.current).toHaveProperty('onTransfer');
        expect(result.current).toHaveProperty('onViewDetail');
        expect(typeof result.current.onBuy).toBe('function');
        expect(typeof result.current.onSell).toBe('function');
        expect(typeof result.current.onTransfer).toBe('function');
        expect(typeof result.current.onViewDetail).toBe('function');
    });

    it('debería llamar showSuccess con mensaje correcto para onBuy', () => {
        const { result } = renderHook(() => usePortfolioActions());
        const testFund = { id: '1', name: 'Test Fund' };

        act(() => {
            result.current.onBuy(testFund);
        });

        expect(mockShowSuccess).toHaveBeenCalledWith('Funcionalidad de compra');
    });

    it('debería llamar showSuccess con mensaje correcto para onSell', () => {
        const { result } = renderHook(() => usePortfolioActions());
        const testFund = { id: '1', name: 'Test Fund' };

        act(() => {
            result.current.onSell(testFund);
        });

        expect(mockShowSuccess).toHaveBeenCalledWith('Funcionalidad de venta');
    });

    it('debería llamar showSuccess con mensaje correcto para onTransfer', () => {
        const { result } = renderHook(() => usePortfolioActions());
        const testFund = { id: '1', name: 'Test Fund' };

        act(() => {
            result.current.onTransfer(testFund);
        });

        expect(mockShowSuccess).toHaveBeenCalledWith('Funcionalidad de traspaso');
    });

    it('debería llamar showSuccess con mensaje correcto para onViewDetail', () => {
        const { result } = renderHook(() => usePortfolioActions());
        const testFund = { id: '1', name: 'Test Fund' };

        act(() => {
            result.current.onViewDetail(testFund);
        });

        expect(mockShowSuccess).toHaveBeenCalledWith('Funcionalidad de detalle');
    });
});