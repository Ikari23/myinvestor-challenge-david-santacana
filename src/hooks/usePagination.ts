import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
    data: T[];
    initialItemsPerPage?: number;
}

interface UsePaginationReturn<T> {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    paginatedData: T[];
    handlePageChange: (page: number) => void;
    handleItemsPerPageChange: (itemsPerPage: number) => void;
}

export const usePagination = <T>({
    data,
    initialItemsPerPage = 10
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setCurrentPage(1);
        setItemsPerPage(newItemsPerPage);
    };

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        paginatedData,
        handlePageChange,
        handleItemsPerPageChange,
    };
};