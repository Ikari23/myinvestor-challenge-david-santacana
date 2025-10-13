export type { Fund } from '../../server/data/funds';

export type SortDirection = 'asc' | 'desc' | null;

export type SortableColumn =
    | 'name'
    | 'currency'
    | 'div'
    | 'category'
    | 'value'
    | 'profitability.YTD'
    | 'profitability.oneYear'
    | 'profitability.threeYears'
    | 'profitability.fiveYears'
    | 'ter'
    | 'riskLevel';

export interface TableColumn {
    key: string;
    title: string;
    subtitle?: string;
    sortable: boolean;
    sortKey?: SortableColumn;
}

export interface SortState {
    column: SortableColumn | null;
    direction: SortDirection;
}

export interface FundTableData {
    id: string;
    name: string;
    isin: string;
    type: string;
    div: string;
    category: string;
    value: number;
    currency: 'USD' | 'EUR';
    ytd: number;
    oneYear: number;
    threeYears: number;
    fiveYears: number;
    ter: string;
    riskLevel: string;
}