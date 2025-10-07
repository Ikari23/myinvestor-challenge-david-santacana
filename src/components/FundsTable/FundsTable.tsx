import React from 'react';
import type { TableColumn } from '../../types';
import styles from './FundsTable.module.scss';

// Mock data for initial testing
const mockData = [
    {
        id: '1',
        name: 'Global Equity Fund',
        isin: '',
        type: '',
        div: '',
        category: 'GLOBAL',
        value: 120.45,
        currency: 'USD' as const,
        ytd: 5.0,
        oneYear: 12.0,
        threeYears: 35.0,
        fiveYears: 50.0,
        ter: '',
        riskLevel: '',
    },
    {
        id: '2',
        name: 'Tech Growth Fund',
        isin: '',
        type: '',
        div: '',
        category: 'TECH',
        value: 210.32,
        currency: 'EUR' as const,
        ytd: 8.0,
        oneYear: 18.0,
        threeYears: 42.0,
        fiveYears: 65.0,
        ter: '',
        riskLevel: '',
    },
    {
        id: '3',
        name: 'Healthcare Opportunities',
        isin: '',
        type: '',
        div: '',
        category: 'HEALTH',
        value: 145.9,
        currency: 'USD' as const,
        ytd: 3.0,
        oneYear: 9.0,
        threeYears: 28.0,
        fiveYears: 41.0,
        ter: '',
        riskLevel: '',
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
    return (
        <div className={styles.tableContainer}>
            <h2 className={styles.title}>Listado de Fondos</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {tableColumns.map((column) => (
                                <th key={column.key} className={styles.headerCell}>
                                    <div className={styles.headerContent}>
                                        <span className={styles.headerTitle}>{column.title}</span>
                                        {column.subtitle && (
                                            <span className={styles.headerSubtitle}>{column.subtitle}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockData.map((fund) => (
                            <tr key={fund.id} className={styles.row}>
                                <td className={styles.cell}>
                                    <div className={styles.nameCell}>
                                        <span className={styles.name}>{fund.name}</span>
                                        <span className={styles.isin}>{fund.isin || '-'}</span>
                                    </div>
                                </td>
                                <td className={styles.cell}>{fund.type || '-'}</td>
                                <td className={styles.cell}>{fund.div || '-'}</td>
                                <td className={styles.cell}>{fund.category}</td>
                                <td className={styles.cell}>
                                    {fund.value.toFixed(2)} {fund.currency}
                                </td>
                                <td className={styles.cell}>{fund.ytd.toFixed(1)}%</td>
                                <td className={styles.cell}>{fund.oneYear.toFixed(1)}%</td>
                                <td className={styles.cell}>{fund.threeYears.toFixed(1)}%</td>
                                <td className={styles.cell}>{fund.fiveYears.toFixed(1)}%</td>
                                <td className={styles.cell}>{fund.ter || '-'}</td>
                                <td className={styles.cell}>{fund.riskLevel || '-'}</td>
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