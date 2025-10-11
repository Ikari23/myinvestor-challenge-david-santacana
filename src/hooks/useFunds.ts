import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Fund } from '../types/funds';

interface FundsApiResponse {
    pagination: {
        page: number;
        limit: number;
        totalFunds: number;
        totalPages: number;
    };
    data: Fund[];
}

interface BuyFundRequest {
    fundId: string;
    quantity: number;
}

interface BuyFundResponse {
    message: string;
    data: {
        portfolio: Array<{
            id: string;
            quantity: number;
        }>;
    };
}

interface PortfolioItem {
    id: string;
    name?: string;
    quantity: number;
    totalValue: number;
}

interface PortfolioResponse {
    data: PortfolioItem[];
}

interface ApiError {
    error?: string;
    message?: string;
}

export const usePortfolio = () => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['portfolio'],
        queryFn: async () => {
            const response = await axios.get<PortfolioResponse>(`/api/portfolio`);
            return response.data;
        },
        staleTime: 1000 * 30, // 30 segundos
    });

    const portfolio = data?.data ?? [];
    const totalPortfolioValue = portfolio.reduce((sum, item) => sum + item.totalValue, 0);
    const errorMessage = error ?
        (axios.isAxiosError(error) ?
            (error.response?.data as ApiError)?.error || error.message :
            (error as Error).message
        ) : null;

    return {
        portfolio,
        totalPortfolioValue,
        loading: isLoading,
        error: errorMessage,
        refetch,
    };
};

export const useFunds = () => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['funds'],
        queryFn: async () => {
            const response = await axios.get<FundsApiResponse>(`/api/funds?page=1&limit=1000`);
            return response.data;
        },
        staleTime: 1000 * 60, // 1 min
    });

    const funds = data?.data ?? [];
    const totalFunds = funds.length;
    const errorMessage = error ?
        (axios.isAxiosError(error) ?
            (error.response?.data as ApiError)?.error || error.message :
            (error as Error).message
        ) : null;

    return {
        funds,
        loading: isLoading,
        error: errorMessage,
        totalFunds,
        refetch,
    };
};

export const useBuyFund = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ fundId, quantity }: BuyFundRequest): Promise<BuyFundResponse> => {
            const response = await axios.post<BuyFundResponse>(`/api/funds/${fundId}/buy`, {
                quantity
            });
            return response.data;
        },
        onSuccess: () => {
            // Invalidar queries relacionadas para refrescar datos
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
        },
        onError: (error) => {
            console.error('Error al comprar fondo:', error);
        }
    });
};