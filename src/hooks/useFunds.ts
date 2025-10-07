import { useEffect } from 'react';
import axios from 'axios';
import { useFundsStore } from '../stores/fundsStore';
import type { Fund } from '../types';

interface FundsApiResponse {
    pagination: {
        page: number;
        limit: number;
        totalFunds: number;
        totalPages: number;
    };
    data: Fund[];
}

export const useFunds = (page: number = 1, limit: number = 20) => {
    const {
        funds,
        loading,
        error,
        currentPage,
        totalPages,
        totalFunds,
        setFunds,
        setLoading,
        setError,
        setPagination,
    } = useFundsStore();

    const fetchFunds = async (pageNum: number, pageLimit: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get<FundsApiResponse>(
                `/api/funds?page=${pageNum}&limit=${pageLimit}`
            );

            setFunds(response.data.data);
            setPagination({
                page: response.data.pagination.page,
                totalPages: response.data.pagination.totalPages,
                totalFunds: response.data.pagination.totalFunds,
                limit: response.data.pagination.limit,
            });
        } catch (err) {
            let errorMessage = 'Error desconocido';

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.error || err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            console.error('Error fetching funds:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFunds(page, limit);
    }, [page, limit]);

    return {
        funds,
        loading,
        error,
        currentPage,
        totalPages,
        totalFunds,
        refetch: () => fetchFunds(page, limit),
    };
};