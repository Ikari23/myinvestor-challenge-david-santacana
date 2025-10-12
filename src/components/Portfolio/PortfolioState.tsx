import React from 'react';
import styles from './Portfolio.module.scss';

interface PortfolioStateProps {
    state: 'loading' | 'error' | 'empty';
    error?: string;
    onRetry?: () => void;
}

export const PortfolioState: React.FC<PortfolioStateProps> = ({ state, error, onRetry }) => {
    const renderContent = () => {
        switch (state) {
            case 'loading':
                return (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner} />
                        <p className={styles.loadingText}>Cargando cartera...</p>
                    </div>
                );
            case 'error':
                return (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorText}>❌ {error}</p>
                        {onRetry && (
                            <button
                                className={styles.retryButton}
                                onClick={onRetry}
                            >
                                Reintentar
                            </button>
                        )}
                    </div>
                );
            case 'empty':
                return (
                    <div className={styles.emptyContainer}>
                        <div className={styles.emptyContent}>
                            <span className={styles.emptyIcon}>📊</span>
                            <p className={styles.emptyText}>Tu cartera está vacía</p>
                            <p className={styles.emptySubtext}>Compra fondos para ver tus inversiones aquí</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.portfolioContainer}>
            <h2 className={styles.title}>Mi Cartera</h2>
            {renderContent()}
        </div>
    );
};