import React from 'react';
import type { TableColumn, Fund } from '../../types';
import { useTableSort } from '../../hooks/useTableSort';
import { SortIcon } from '../SortIcon';
import styles from './FundsTable.module.scss';

// Mock data matching the real Fund structure
const mockData: Fund[] = [
    {
        id: '1',
        name: 'Global Equity Fund',
        currency: 'USD',
        symbol: 'GEF',
        value: 120.45,
        category: 'GLOBAL',
        profitability: {
            YTD: 0.05,
            oneYear: 0.12,
            threeYears: 0.35,
            fiveYears: 0.50,
        },
    },
    {
        id: '2',
        name: 'Tech Growth Fund',
        currency: 'EUR',
        symbol: 'TGF',
        value: 210.32,
        category: 'TECH',
        profitability: {
            YTD: 0.08,
            oneYear: 0.18,
            threeYears: 0.42,
            fiveYears: 0.65,
        },
    },
    {
        id: '3',
        name: 'Healthcare Opportunities',
        currency: 'USD',
        symbol: 'HCO',
        value: 145.9,
        category: 'HEALTH',
        profitability: {
            YTD: 0.03,
            oneYear: 0.09,
            threeYears: 0.28,
            fiveYears: 0.41,
        },
    },
];

const tableColumns: TableColumn[] = [
    { key: 'name', title: 'Nombre', subtitle: 'ISIN', sortable: true, sortKey: 'name' },
    { key: 'type', title: 'Tipo', sortable: false },
    { key: 'div', title: 'Div', sortable: true, sortKey: 'div' },
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
    const { sortState, sortedData, handleSort } = useTableSort(mockData);

    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.title}>Listado de Fondos</h2>
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
                        {sortedData.map((fund) => (
                            <tr key={fund.id} className={styles.row}>
                                <td className={styles.cell}>
                                    <div className={styles.nameCell}>
                                        <span className={styles.name}>{fund.name}</span>
                                        <span className={styles.isin}>-</span>
                                    </div>
                                </td>
                                <td className={styles.cell}>-</td>
                                <td className={styles.cell}>-</td>
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
        </div>
    );
};