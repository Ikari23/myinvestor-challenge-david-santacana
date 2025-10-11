import { useState, useMemo } from 'react';
import type { Fund, SortableColumn, SortDirection, SortState } from '../types/funds';

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
        if (sortState.column && sortState.direction) {
            return [...data].sort((a, b) => {
                let aValue: unknown;
                let bValue: unknown;

                if (sortState.column!.includes('.')) {
                    const keys = sortState.column!.split('.');
                    aValue = keys.reduce((obj: unknown, key) => {
                        if (obj && typeof obj === 'object' && obj !== null) {
                            return (obj as Record<string, unknown>)[key];
                        }
                        return undefined;
                    }, a as Record<string, unknown>);
                    bValue = keys.reduce((obj: unknown, key) => {
                        if (obj && typeof obj === 'object' && obj !== null) {
                            return (obj as Record<string, unknown>)[key];
                        }
                        return undefined;
                    }, b as Record<string, unknown>);
                } else {
                    aValue = (a as Record<string, unknown>)[sortState.column!];
                    bValue = (b as Record<string, unknown>)[sortState.column!];
                }

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    const result = aValue.localeCompare(bValue);
                    return sortState.direction === 'asc' ? result : -result;
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    const result = aValue - bValue;
                    return sortState.direction === 'asc' ? result : -result;
                }

                return 0;
            });
        }
        return data;
    }, [data, sortState]);

    return {
        sortState,
        sortedData,
        handleSort,
    };
};