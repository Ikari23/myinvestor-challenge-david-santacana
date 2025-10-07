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

export const useFunds = () => {
    const {
        funds,
        loading,
        error,
        totalFunds,
        setFunds,
        setLoading,
        setError,
        setPagination,
    } = useFundsStore();

    const fetchAllFunds = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get<FundsApiResponse>(
                `/api/funds?page=1&limit=1000`
            );

            setFunds(response.data.data);
            setPagination({
                page: 1,
                totalPages: 1,
                totalFunds: response.data.data.length,
                limit: response.data.data.length,
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
        fetchAllFunds();
    }, []);

    return {
        funds,
        loading,
        error,
        totalFunds,
        refetch: fetchAllFunds,
    };
};