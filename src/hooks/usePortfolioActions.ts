import { useCallback } from 'react';
import { useToast } from './useToast';

interface PortfolioActions {
    onBuy: (fund: { id: string; name: string }) => void;
    onSell: (fund: { id: string; name: string }) => void;
    onTransfer: (fund: { id: string; name: string }) => void;
    onViewDetail: (fund: { id: string; name: string }) => void;
}

/**
 * Custom hook para manejar las acciones del portfolio
 * @returns Objeto con todas las acciones disponibles
 */
export const usePortfolioActions = (): PortfolioActions => {
    const { showSuccess } = useToast();

    const handleBuy = useCallback((fund: { id: string; name: string }) => {
        showSuccess('Funcionalidad de compra');
    }, [showSuccess]);

    const handleSell = useCallback((fund: { id: string; name: string }) => {
        showSuccess('Funcionalidad de venta');
    }, [showSuccess]);

    const handleTransfer = useCallback((fund: { id: string; name: string }) => {
        showSuccess('Funcionalidad de traspaso');
    }, [showSuccess]);

    const handleViewDetail = useCallback((fund: { id: string; name: string }) => {
        showSuccess('Funcionalidad de detalle');
    }, [showSuccess]);

    return {
        onBuy: handleBuy,
        onSell: handleSell,
        onTransfer: handleTransfer,
        onViewDetail: handleViewDetail,
    };
};