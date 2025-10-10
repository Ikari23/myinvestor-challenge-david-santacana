import React, { useMemo, useRef, useState } from 'react';
import type { TableColumn, Fund } from '../../types/funds';
import { useTableSort } from '../../hooks/useTableSort';
import { useFunds, useBuyFund } from '../../hooks/useFunds';
import { useToast } from '../../hooks/useToast';
import { SortIcon } from '../SortIcon/SortIcon';
import { Pagination } from '../Pagination/Pagination';
import { ActionMenu } from '../ActionMenu/ActionMenu';
import { useForm } from 'react-hook-form';
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

type BuyFormValues = { quantity: number };

export const FundsTable: React.FC = () => {
    const { funds, loading, error, totalFunds } = useFunds();
    const buyFundMutation = useBuyFund();
    const { toast, showSuccess, showError, hideToast } = useToast();
    const [localCurrentPage, setLocalCurrentPage] = useState(1);
    const [localItemsPerPage, setLocalItemsPerPage] = useState(10);
    const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BuyFormValues>({
        defaultValues: { quantity: 1 },
        mode: 'onChange',
    });

    const { sortState, sortedData, handleSort } = useTableSort(funds);

    const handleBuyFund = (fund: Fund) => {
        setSelectedFundId(fund.id);
        reset({ quantity: 1 });
        setIsBuyOpen(true);
    };

    const handleBuySubmit = async (values: BuyFormValues) => {
        if (!selectedFundId) return;

        try {
            await buyFundMutation.mutateAsync({
                fundId: selectedFundId,
                quantity: values.quantity
            });
            
            // Encontrar el nombre del fondo para el mensaje
            const selectedFund = funds.find(fund => fund.id === selectedFundId);
            const fundName = selectedFund?.name || 'fondo';
            
            // Mostrar toast de éxito
            showSuccess(`Compra realizada con éxito: ${values.quantity} unidades de ${fundName}`);
            
            // Cerrar el dialog
            setIsBuyOpen(false);
            setSelectedFundId(null);
            reset({ quantity: 1 });
            
        } catch (error) {
            console.error('Error al realizar la compra:', error);
            
            // Mostrar toast de error
            let errorMessage = 'Error al realizar la compra. Inténtalo de nuevo.';
            
            // Personalizar mensaje de error si es posible
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                if (axiosError.response?.data?.error) {
                    errorMessage = axiosError.response.data.error;
                }
            }
            
            showError(errorMessage);
        }
    };

    const handleViewDetail = (fund: Fund) => {
        console.log('Ver detalle del fondo:', fund.name);
    };

    const paginatedData = useMemo(() => {
        const startIndex = (localCurrentPage - 1) * localItemsPerPage;
        const endIndex = startIndex + localItemsPerPage;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, localCurrentPage, localItemsPerPage]);

    const totalPages = Math.ceil(sortedData.length / localItemsPerPage);

    const handlePageChange = (page: number) => {
        setLocalCurrentPage(page);
    };

    const handleItemsPerPageChange = (itemsPerPage: number) => {
        setLocalCurrentPage(1);
        setLocalItemsPerPage(itemsPerPage);
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
                                    <span aria-label={`Valor liquidativo: ${fund.value.toFixed(2)}`}>
                                        {fund.value.toFixed(2)}
                                    </span>
                                </td>
                                <td className={styles.cell} role="gridcell">
                                    <span aria-label={`Rentabilidad 2025: ${fund.profitability.YTD.toFixed(2)}`}>
                                        {fund.profitability.YTD.toFixed(2)}
                                    </span>
                                </td>
                                <td className={styles.cell} role="gridcell">
                                    <span aria-label={`Rentabilidad 1 año: ${fund.profitability.oneYear.toFixed(2)}`}>
                                        {fund.profitability.oneYear.toFixed(2)}
                                    </span>
                                </td>
                                <td className={styles.cell} role="gridcell">
                                    <span aria-label={`Rentabilidad 3 años: ${fund.profitability.threeYears.toFixed(2)}`}>
                                        {fund.profitability.threeYears.toFixed(2)}
                                    </span>
                                </td>
                                <td className={styles.cell} role="gridcell">
                                    <span aria-label={`Rentabilidad 5 años: ${fund.profitability.fiveYears.toFixed(2)}`}>
                                        {fund.profitability.fiveYears.toFixed(2)}
                                    </span>
                                </td>
                                <td className={styles.cell} role="gridcell" aria-label="TER no disponible">-</td>
                                <td className={styles.cell} role="gridcell" aria-label="Nivel de riesgo no disponible">-</td>
                                <td className={styles.cell} role="gridcell">
                                    <ActionMenu
                                        fund={fund}
                                        onBuy={handleBuyFund}
                                        onViewDetail={handleViewDetail}
                                    />
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

            <Dialog
                isOpen={isBuyOpen}
                title="Comprar fondo"
                onClose={() => {
                    setIsBuyOpen(false);
                    setSelectedFundId(null);
                }}
                onSubmit={handleSubmit(handleBuySubmit)}
                register={register}
                errors={errors}
                isSubmitting={buyFundMutation.isPending}
                setValue={setValue}
                watch={watch}
            />

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
};


