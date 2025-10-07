import { create } from 'zustand';
import type { Fund } from '../types';

interface FundsState {
    funds: Fund[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalFunds: number;
    limit: number;
    localCurrentPage: number;
    localItemsPerPage: number;

    setFunds: (funds: Fund[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPagination: (pagination: {
        page: number;
        totalPages: number;
        totalFunds: number;
        limit: number;
    }) => void;
    setLocalPagination: (page: number, itemsPerPage: number) => void;
    resetState: () => void;
}

export const useFundsStore = create<FundsState>((set) => ({
    funds: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalFunds: 0,
    limit: 20,
    localCurrentPage: 1,
    localItemsPerPage: 10,

    setFunds: (funds) => set({ funds }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setPagination: (pagination) => set({
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalFunds: pagination.totalFunds,
        limit: pagination.limit,
    }),
    setLocalPagination: (page, itemsPerPage) => set({
        localCurrentPage: page,
        localItemsPerPage: itemsPerPage,
    }),
    resetState: () => set({
        funds: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalFunds: 0,
        limit: 20,
        localCurrentPage: 1,
        localItemsPerPage: 10,
    }),
}));