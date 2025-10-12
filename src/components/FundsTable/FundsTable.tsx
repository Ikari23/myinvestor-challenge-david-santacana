import React from 'react';
import type { TableColumn, Fund } from '../../types/funds';
import { useTableSort } from '../../hooks/useTableSort';
import { useFunds } from '../../hooks/useFunds';
import { useToast } from '../../hooks/useToast';
import { usePagination } from '../../hooks/usePagination';
import { useBuyFund } from '../../hooks/useBuyFund';
import { formatNumber } from '../../utils/numberUtils';
import { createFundsTableMenuOptions } from '../../utils/menuUtils';
import { SortIcon } from '../SortIcon/SortIcon';
import { Pagination } from '../Pagination/Pagination';
import { ActionMenu } from '../ActionMenu/ActionMenu';
import { Dialog } from '../Dialog/Dialog';
import { Toast } from '../Toast/Toast';
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
    const { toast, showSuccess, hideToast } = useToast();

    const { sortState, sortedData, handleSort } = useTableSort(funds);

    const {
        currentPage,
        itemsPerPage,
        totalPages,
        paginatedData,
        handlePageChange,
        handleItemsPerPageChange,
    } = usePagination({ data: sortedData });

    const {
        isBuyOpen,
        isSubmitting,
        formMethods,
        handleBuyFund,
        handleBuySubmit,
        handleCloseBuy,
        selectedFund,
    } = useBuyFund(funds);

    const { register, formState: { errors }, setValue, watch } = formMethods;

    const handleViewDetail = (fund: Fund) => {
        showSuccess(`Mostrando detalles de ${fund.name}`);
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
            <div className={styles.contentWrapper}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Listado de Fondos</h2>
                    <p className={styles.subtitle}>{totalFunds} fondos disponibles</p>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table} role="table" aria-label="Tabla de fondos de inversión">
                        <caption className={styles.tableCaption}>
                            Listado de {totalFunds} fondos de inversión con información de rentabilidad y características
                        </caption>
                        <thead>
                            <tr role="row">
                                {tableColumns.map((column, index) => (
                                    <th
                                        key={column.key}
                                        className={styles.headerCell}
                                        scope="col"
                                        role="columnheader"
                                        aria-sort={
                                            column.sortable && column.sortKey && sortState.column === column.sortKey
                                                ? sortState.direction === 'asc'
                                                    ? 'ascending'
                                                    : sortState.direction === 'desc'
                                                        ? 'descending'
                                                        : 'none'
                                                : column.sortable ? 'none' : undefined
                                        }
                                    >
                                        {column.sortable && column.sortKey ? (
                                            <button
                                                className={styles.sortableHeader}
                                                onClick={() => handleSort(column.sortKey!)}
                                                aria-label={`${column.title}${column.subtitle ? ` (${column.subtitle})` : ''}. ${sortState.column === column.sortKey
                                                    ? sortState.direction === 'asc'
                                                        ? 'Actualmente ordenado ascendente. Haz clic para ordenar descendente'
                                                        : sortState.direction === 'desc'
                                                            ? 'Actualmente ordenado descendente. Haz clic para quitar ordenación'
                                                            : 'Haz clic para ordenar ascendente'
                                                    : 'Haz clic para ordenar ascendente'
                                                    }`}
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
                        <tbody role="rowgroup">
                            {paginatedData.map((fund, rowIndex) => (
                                <tr key={fund.id} className={styles.row} role="row">
                                    <td className={styles.cell} role="gridcell">
                                        <div className={styles.nameCell}>
                                            <span className={styles.name}>{fund.name}</span>
                                            <span className={styles.isin} aria-label="ISIN no disponible">-</span>
                                        </div>
                                    </td>
                                    <td className={styles.cell} role="gridcell" aria-label="Tipo no disponible">-</td>
                                    <td className={styles.cell} role="gridcell">{fund.currency}</td>
                                    <td className={styles.cell} role="gridcell">{fund.category}</td>
                                    <td className={styles.cell} role="gridcell">
                                        <span aria-label={`Valor liquidativo: ${formatNumber(fund.value)}`}>
                                            {formatNumber(fund.value)}
                                        </span>
                                    </td>
                                    <td className={styles.cell} role="gridcell">
                                        <span aria-label={`Rentabilidad 2025: ${formatNumber(fund.profitability.YTD)}`}>
                                            {formatNumber(fund.profitability.YTD)}
                                        </span>
                                    </td>
                                    <td className={styles.cell} role="gridcell">
                                        <span aria-label={`Rentabilidad 1 año: ${formatNumber(fund.profitability.oneYear)}`}>
                                            {formatNumber(fund.profitability.oneYear)}
                                        </span>
                                    </td>
                                    <td className={styles.cell} role="gridcell">
                                        <span aria-label={`Rentabilidad 3 años: ${formatNumber(fund.profitability.threeYears)}`}>
                                            {formatNumber(fund.profitability.threeYears)}
                                        </span>
                                    </td>
                                    <td className={styles.cell} role="gridcell">
                                        <span aria-label={`Rentabilidad 5 años: ${formatNumber(fund.profitability.fiveYears)}`}>
                                            {formatNumber(fund.profitability.fiveYears)}
                                        </span>
                                    </td>
                                    <td className={styles.cell} role="gridcell" aria-label="TER no disponible">-</td>
                                    <td className={styles.cell} role="gridcell" aria-label="Nivel de riesgo no disponible">-</td>
                                    <td className={styles.cell} role="gridcell">
                                        <ActionMenu
                                            fund={fund}
                                            options={createFundsTableMenuOptions(fund, handleBuyFund, handleViewDetail)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />

                <Dialog
                    isOpen={isBuyOpen}
                    title="Comprar fondo"
                    onClose={handleCloseBuy}
                    onSubmit={formMethods.handleSubmit(handleBuySubmit)}
                    register={register}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    setValue={setValue}
                    watch={watch}
                    fundValue={selectedFund?.value || 0}
                />

                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.isVisible}
                    onClose={hideToast}
                />
            </div>
        </div>
    );
};
