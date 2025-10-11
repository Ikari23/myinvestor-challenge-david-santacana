import React, { useState } from 'react';
import { usePortfolio } from '../../hooks/useFunds';
import { useToast } from '../../hooks/useToast';
import { ActionMenu } from '../ActionMenu/ActionMenu';
import { Toast } from '../Toast/Toast';
import styles from './Portfolio.module.scss';

interface PortfolioItem {
    id: string;
    name?: string;
    quantity: number;
    totalValue: number;
}

interface PortfolioFund {
    id: string;
    name: string; // Cambiar de opcional a requerido
}

export const Portfolio: React.FC = () => {
    const { portfolio, totalPortfolioValue, loading, error, refetch } = usePortfolio();
    const { toast, showSuccess, showError, hideToast } = useToast();

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    // Funciones para las acciones de cartera
    const handleBuy = (fund: PortfolioFund) => {
        showSuccess('Funcionalidad de compra');
    };

    const handleSell = (fund: PortfolioFund) => {
        showSuccess('Funcionalidad de venta');
    };

    const handleTransfer = (fund: PortfolioFund) => {
        showSuccess('Funcionalidad de traspaso');
    };

    const handleViewDetail = (fund: PortfolioFund) => {
        showSuccess('Funcionalidad de detalle');
    };

    // Opciones para el ActionMenu en la cartera
    const getPortfolioMenuOptions = (fund: PortfolioFund) => [
        {
            id: 'buy',
            label: 'Comprar',
            icon: '→',
            action: () => handleBuy(fund)
        },
        {
            id: 'sell',
            label: 'Vender',
            icon: '←',
            action: () => handleSell(fund)
        },
        {
            id: 'transfer',
            label: 'Traspasar',
            icon: '⤴',
            action: () => handleTransfer(fund)
        },
        {
            id: 'view-detail',
            label: 'Ver detalle',
            icon: '◉',
            action: () => handleViewDetail(fund)
        }
    ];

    if (loading) {
        return (
            <div className={styles.portfolioContainer}>
                <h2 className={styles.title}>Mi Cartera</h2>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner} />
                    <p className={styles.loadingText}>Cargando cartera...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.portfolioContainer}>
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
        );
    }

    if (!portfolio.length) {
        return (
            <div className={styles.portfolioContainer}>
                <h2 className={styles.title}>Mi Cartera</h2>
                <div className={styles.emptyContainer}>
                    <div className={styles.emptyContent}>
                        <span className={styles.emptyIcon}>📊</span>
                        <p className={styles.emptyText}>Tu cartera está vacía</p>
                        <p className={styles.emptySubtext}>Compra fondos para ver tus inversiones aquí</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.portfolioContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Mi Cartera</h2>
            </div>

            <div className={styles.portfolioWrapper}>
                <div className={styles.fundsGrid}>
                    {portfolio
                        .sort((a, b) => {
                            const nameA = a.name || `Fondo ${a.id}`;
                            const nameB = b.name || `Fondo ${b.id}`;
                            return nameA.localeCompare(nameB, 'es', {
                                numeric: true,
                                sensitivity: 'base'
                            });
                        })
                        .map((item: PortfolioItem) => (
                            <div key={item.id} className={styles.fundCard}>
                                <div className={styles.cardContent}>
                                    <div className={styles.fundInfo}>
                                        <h3 className={styles.fundName}>
                                            {item.name || `Fondo ${item.id}`}
                                        </h3>
                                    </div>

                                    <div className={styles.fundValue}>
                                        <span className={styles.valueAmount}>{formatCurrency(item.totalValue)}</span>
                                        <span className={styles.pricePerUnit}>{formatCurrency(item.totalValue / item.quantity)}</span>
                                    </div>

                                    <div className={styles.fundActions}>
                                        <ActionMenu
                                            fund={{
                                                id: item.id,
                                                name: item.name || `Fondo ${item.id}`
                                            }}
                                            options={getPortfolioMenuOptions({
                                                id: item.id,
                                                name: item.name || `Fondo ${item.id}`
                                            })}
                                            ariaLabel={`Opciones para ${item.name || `Fondo ${item.id}`}`}
                                        />
                                    </div>
                                </div>
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
    );
};