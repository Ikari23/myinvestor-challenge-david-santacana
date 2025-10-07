import React, { useMemo } from 'react';
import type { TableColumn } from '../../types';
import { useTableSort } from '../../hooks/useTableSort';
import { useFunds } from '../../hooks/useFunds';
import { useFundsStore } from '../../stores/fundsStore';
import { SortIcon } from '../SortIcon';
import { Pagination } from '../Pagination';
import styles from './FundsTable.module.scss';

const tableColumns: TableColumn[] = [
    { key: 'name', title: 'Nombre', subtitle: 'ISIN', sortable: true, sortKey: 'name' },
    { key: 'type', title: 'Tipo', sortable: false },
    { key: 'div', title: 'Div', sortable: true, sortKey: 'currency' },
    { key: 'category', title: 'Categoria', sortable: true, sortKey: 'category' },
    { key: 'value', title: 'Valor liquidativo', sortable: true, sortKey: 'value' },
    { key: 'ytd', title: '2025', sortable: true, sortKey: 'profitability.YTD' },
    { key: 'oneYear', title: '1A', sortable: true, sortKey: 'profitability.oneYear' },
    { key: 'threeYears', title: '3A', sortable: true, sortKey: 'profitability.threeYears' },
    { key: 'fiveYears', title: '5A', sortable: true, sortKey: 'profitability.fiveYears' },
    { key: 'ter', title: 'TER %', sortable: true, sortKey: 'ter' },
    { key: 'riskLevel', title: 'Nivel de Riesgo', sortable: true, sortKey: 'riskLevel' },
    { key: 'actions', title: '', sortable: false },
];

export const FundsTable: React.FC = () => {
    const { funds, loading, error, totalFunds } = useFunds();
    const {
        localCurrentPage,
        localItemsPerPage,
        setLocalPagination
    } = useFundsStore();

    const { sortState, sortedData, handleSort } = useTableSort(funds);

    // Calculate pagination data
    const paginatedData = useMemo(() => {
        const startIndex = (localCurrentPage - 1) * localItemsPerPage;
        const endIndex = startIndex + localItemsPerPage;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, localCurrentPage, localItemsPerPage]);

    const totalPages = Math.ceil(sortedData.length / localItemsPerPage);

    const handlePageChange = (page: number) => {
        setLocalPagination(page, localItemsPerPage);
    };

    const handleItemsPerPageChange = (itemsPerPage: number) => {
        setLocalPagination(1, itemsPerPage); // Reset to first page when changing items per page
    };

    if (loading) {
        return (
            <div className={styles.tableContainer}>
                <h2 className={styles.title}>Listado de Fondos</h2>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner} />
                    <p className={styles.loadingText}>Cargando fondos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.tableContainer}>
                <h2 className={styles.title}>Listado de Fondos</h2>
                <div className={styles.errorContainer}>
                    <p className={styles.errorText}>❌ {error}</p>
                    <button
                        className={styles.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!funds.length) {
        return (
            <div className={styles.tableContainer}>
                <h2 className={styles.title}>Listado de Fondos</h2>
                <div className={styles.emptyContainer}>
                    <p className={styles.emptyText}>No hay fondos disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Listado de Fondos</h2>
                <p className={styles.subtitle}>{totalFunds} fondos disponibles</p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {tableColumns.map((column) => (
                                <th key={column.key} className={styles.headerCell}>
                                    {column.sortable && column.sortKey ? (
                                        <button
                                            className={styles.sortableHeader}
                                            onClick={() => handleSort(column.sortKey!)}
                                            aria-label={`Ordenar por ${column.title}`}
                                        >
                                            <div className={styles.headerContent}>
                                                <span className={styles.headerTitle}>{column.title}</span>
                                                {column.subtitle && (
                                                    <span className={styles.headerSubtitle}>{column.subtitle}</span>
                                                )}
                                            </div>
                                            <SortIcon
                                                direction={sortState.column === column.sortKey ? sortState.direction : null}
                                            />
                                        </button>
                                    ) : (
                                        <div className={styles.headerContent}>
                                            <span className={styles.headerTitle}>{column.title}</span>
                                            {column.subtitle && (
                                                <span className={styles.headerSubtitle}>{column.subtitle}</span>
                                            )}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((fund) => (
                            <tr key={fund.id} className={styles.row}>
                                <td className={styles.cell}>
                                    <div className={styles.nameCell}>
                                        <span className={styles.name}>{fund.name}</span>
                                        <span className={styles.isin}>-</span>
                                    </div>
                                </td>
                                <td className={styles.cell}>-</td>
                                <td className={styles.cell}>{fund.currency}</td>
                                <td className={styles.cell}>{fund.category}</td>
                                <td className={styles.cell}>
                                    {fund.value.toFixed(2)} {fund.currency}
                                </td>
                                <td className={styles.cell}>{(fund.profitability.YTD * 100).toFixed(1)}%</td>
                                <td className={styles.cell}>{(fund.profitability.oneYear * 100).toFixed(1)}%</td>
                                <td className={styles.cell}>{(fund.profitability.threeYears * 100).toFixed(1)}%</td>
                                <td className={styles.cell}>{(fund.profitability.fiveYears * 100).toFixed(1)}%</td>
                                <td className={styles.cell}>-</td>
                                <td className={styles.cell}>-</td>
                                <td className={styles.cell}>
                                    <button className={styles.actionButton} aria-label="Acciones">
                                        ⋯
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={localCurrentPage}
                totalPages={totalPages}
                totalItems={sortedData.length}
                itemsPerPage={localItemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
            />
        </div>
    );
};