import type { Fund } from '../types/funds';

export interface MenuOption {
    id: string;
    label: string;
    icon: string;
    action: () => void;
}

export const createFundsTableMenuOptions = (
    fund: Fund,
    onBuy: (fund: Fund) => void,
    onViewDetail: (fund: Fund) => void
): MenuOption[] => [
        {
            id: 'buy',
            label: 'Comprar',
            icon: '→',
            action: () => onBuy(fund)
        },
        {
            id: 'view-detail',
            label: 'Ver detalle',
            icon: '👁',
            action: () => onViewDetail(fund)
        }
    ];

export const createPortfolioMenuOptions = (
    fund: { id: string; name: string },
    actions: {
        onBuy: (fund: { id: string; name: string }) => void;
        onSell: (fund: { id: string; name: string }) => void;
        onTransfer: (fund: { id: string; name: string }) => void;
        onViewDetail: (fund: { id: string; name: string }) => void;
    }
): MenuOption[] => [
        {
            id: 'buy',
            label: 'Comprar',
            icon: '→',
            action: () => actions.onBuy(fund)
        },
        {
            id: 'sell',
            label: 'Vender',
            icon: '←',
            action: () => actions.onSell(fund)
        },
        {
            id: 'transfer',
            label: 'Traspasar',
            icon: '⤴',
            action: () => actions.onTransfer(fund)
        },
        {
            id: 'view-detail',
            label: 'Ver detalle',
            icon: '◉',
            action: () => actions.onViewDetail(fund)
        }
    ];