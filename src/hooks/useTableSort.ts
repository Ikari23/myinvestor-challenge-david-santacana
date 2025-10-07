import { useState, useMemo } from 'react';
import type { Fund, SortableColumn, SortDirection, SortState } from '../types';

export const useTableSort = (data: Fund[]) => {
    const [sortState, setSortState] = useState<SortState>({
        column: null,
        direction: null,
    });

    const handleSort = (column: SortableColumn) => {
        setSortState((prev) => {
            if (prev.column === column) {
                const nextDirection: SortDirection =
                    prev.direction === null ? 'asc'
                        : prev.direction === 'asc' ? 'desc'
                            : null;

                return {
                    column: nextDirection ? column : null,
                    direction: nextDirection,
                };
            } else {
                return {
                    column,
                    direction: 'asc',
                };
            }
        });
    };

    const sortedData = useMemo(() => {
        if (!sortState.column || !sortState.direction) {
            return data;
        }

        const sortColumn = sortState.column;
        const sortDirection = sortState.direction;

        return [...data].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortColumn.includes('.')) {
                const keys = sortColumn.split('.');
                aValue = keys.reduce((obj: any, key) => obj?.[key], a);
                bValue = keys.reduce((obj: any, key) => obj?.[key], b);
            } else {
                aValue = (a as any)[sortColumn];
                bValue = (b as any)[sortColumn];
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const result = aValue.localeCompare(bValue);
                return sortDirection === 'asc' ? result : -result;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                const result = aValue - bValue;
                return sortDirection === 'asc' ? result : -result;
            }

            return 0;
        });
    }, [data, sortState]);

    return {
        sortState,
        sortedData,
        handleSort,
    };
};