import React, { useMemo } from 'react';
import { usePortfolio, useFunds } from '../../hooks/useFunds';
import { useToast } from '../../hooks/useToast';
import { ActionMenu } from '../ActionMenu/ActionMenu';
import { Toast } from '../Toast/Toast';
import { formatCurrency } from '../../utils/numberUtils';
import {
    getFundCurrency,
    getFundName,
    groupPortfolioByCategory,
    getCategoryDisplayName
} from '../../utils/fundUtils';
import { sortByName } from '../../utils/sortUtils';
import { createPortfolioMenuOptions } from '../../utils/menuUtils';
import styles from './Portfolio.module.scss';

interface PortfolioItem {
    id: string;
    name?: string;
    quantity: number;
    totalValue: number;
}

export const Portfolio: React.FC = () => {
    const { portfolio, totalPortfolioValue, loading: portfolioLoading, error: portfolioError, refetch } = usePortfolio();
    const { funds, loading: fundsLoading, error: fundsError } = useFunds();
    const { toast, showSuccess, showError, hideToast } = useToast();

    const loading = portfolioLoading || fundsLoading;
    const error = portfolioError || fundsError;

    const handleBuy = (fund: { id: string; name: string }) => {
        showSuccess('Funcionalidad de compra');
    };

    const handleSell = (fund: { id: string; name: string }) => {
        showSuccess('Funcionalidad de venta');
    };

    const handleTransfer = (fund: { id: string; name: string }) => {
        showSuccess('Funcionalidad de traspaso');
    };

    const handleViewDetail = (fund: { id: string; name: string }) => {
        showSuccess('Funcionalidad de detalle');
    };

    const portfolioActions = {
        onBuy: handleBuy,
        onSell: handleSell,
        onTransfer: handleTransfer,
        onViewDetail: handleViewDetail,
    };

    const portfolioByCategory = useMemo(() => {
        const grouped = groupPortfolioByCategory(portfolio, funds);

        Object.keys(grouped).forEach(category => {
            if (grouped[category]) {
                grouped[category] = sortByName(grouped[category], (item) => getFundName(item));
            }
        });

        return grouped;
    }, [portfolio, funds]);

    if (loading) {
        return (
            <div className={styles.portfolioContainer}>
                <div className={styles.contentWrapper}>
                    <h2 className={styles.title}>Mi Cartera</h2>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner} />
                        <p className={styles.loadingText}>Cargando cartera...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.portfolioContainer}>
                <div className={styles.contentWrapper}>
                    <h2 className={styles.title}>Mi Cartera</h2>
                    <div className={styles.errorContainer}>
                        <p className={styles.errorText}>❌ {error}</p>
                        <button
                            className={styles.retryButton}
                            onClick={() => refetch()}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!portfolio.length) {
        return (
            <div className={styles.portfolioContainer}>
                <div className={styles.contentWrapper}>
                    <h2 className={styles.title}>Mi Cartera</h2>
                    <div className={styles.emptyContainer}>
                        <div className={styles.emptyContent}>
                            <span className={styles.emptyIcon}>📊</span>
                            <p className={styles.emptyText}>Tu cartera está vacía</p>
                            <p className={styles.emptySubtext}>Compra fondos para ver tus inversiones aquí</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.portfolioContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Mi Cartera</h2>
                </div>

                <div className={styles.portfolioWrapper}>
                    <div className={styles.fundsGrid}>
                        {Object.entries(portfolioByCategory)
                            .sort(([categoryA], [categoryB]) =>
                                getCategoryDisplayName(categoryA).localeCompare(getCategoryDisplayName(categoryB), 'es')
                            )
                            .map(([category, items]) => (
                                <div key={category} className={styles.categorySection}>
                                    <h3 className={styles.categoryTitle}>{getCategoryDisplayName(category)}</h3>
                                    {items.map((item: PortfolioItem) => (
                                        <div key={item.id} className={styles.fundCard}>
                                            <div className={styles.cardContent}>
                                                <div className={styles.fundInfo}>
                                                    <h3 className={styles.fundName}>
                                                        {getFundName(item)}
                                                    </h3>
                                                </div>

                                                <div className={styles.fundValue}>
                                                    <span className={styles.valueAmount}>{formatCurrency(item.totalValue, getFundCurrency(funds, item.id))}</span>
                                                    <span className={styles.pricePerUnit}>{formatCurrency(item.totalValue / item.quantity, getFundCurrency(funds, item.id))}</span>
                                                </div>

                                                <div className={styles.fundActions}>
                                                    <ActionMenu
                                                        fund={{
                                                            id: item.id,
                                                            name: getFundName(item)
                                                        }}
                                                        options={createPortfolioMenuOptions({
                                                            id: item.id,
                                                            name: getFundName(item)
                                                        }, portfolioActions)}
                                                        ariaLabel={`Opciones para ${getFundName(item)}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                    </div>
                </div>

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