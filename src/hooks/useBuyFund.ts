import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBuyFund as useBuyFundMutation } from './useFunds';
import { useToast } from './useToast';
import { extractErrorMessage } from '../utils/errorUtils';
import { findFundById, calculateFundQuantity, getFundName } from '../utils/fundUtils';
import { formatCurrency, formatNumber } from '../utils/numberUtils';
import type { Fund } from '../types/funds';

type BuyFormValues = { amount: number };

interface UseBuyFundReturn {
    selectedFundId: string | null;
    isBuyOpen: boolean;
    isSubmitting: boolean;
    formMethods: ReturnType<typeof useForm<BuyFormValues>>;
    handleBuyFund: (fund: Fund) => void;
    handleBuySubmit: (values: BuyFormValues) => Promise<void>;
    handleCloseBuy: () => void;
    selectedFund: Fund | null;
}

export const useBuyFund = (funds: Fund[]): UseBuyFundReturn => {
    const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
    const [isBuyOpen, setIsBuyOpen] = useState(false);

    const buyFundMutation = useBuyFundMutation();
    const { showSuccess, showError } = useToast();

    const formMethods = useForm<BuyFormValues>({
        defaultValues: { amount: 0 },
        mode: 'onChange',
    });

    const { reset, handleSubmit } = formMethods;

    const selectedFund = selectedFundId ? findFundById(funds, selectedFundId) : null;

    const handleBuyFund = (fund: Fund) => {
        setSelectedFundId(fund.id);
        reset({ amount: 0 });
        setIsBuyOpen(true);
    };

    const handleBuySubmit = async (values: BuyFormValues) => {
        if (!selectedFundId || !selectedFund) {
            showError('Error: No se pudo encontrar el fondo seleccionado');
            return;
        }

        const quantity = calculateFundQuantity(values.amount, selectedFund.value);
        const fundName = getFundName(selectedFund);

        try {
            await buyFundMutation.mutateAsync({
                fundId: selectedFundId,
                quantity: quantity
            });

            showSuccess(
                `Compra realizada con éxito: ${formatCurrency(values.amount, selectedFund.currency)} en ${fundName} (${formatNumber(quantity, 4)} unidades)`
            );

            handleCloseBuy();
        } catch (error) {
            console.error('Error al realizar la compra:', error);
            const errorMessage = extractErrorMessage(error, 'Error al realizar la compra. Inténtalo de nuevo.');
            showError(errorMessage);
        }
    };

    const handleCloseBuy = () => {
        setIsBuyOpen(false);
        setSelectedFundId(null);
        reset({ amount: 0 });
    };

    return {
        selectedFundId,
        isBuyOpen,
        isSubmitting: buyFundMutation.isPending,
        formMethods,
        handleBuyFund,
        handleBuySubmit,
        handleCloseBuy,
        selectedFund: selectedFund || null,
    };
};