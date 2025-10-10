import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
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
    const errorMessage = error ? (axios.isAxiosError(error) ? (error.response?.data as any)?.error || error.message : (error as Error).message) : null;

    return {
        funds,
        loading: isLoading,
        error: errorMessage,
        totalFunds,
        refetch,
    };
};