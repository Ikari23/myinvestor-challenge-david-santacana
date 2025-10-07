import React from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}) => {
    const getVisiblePages = () => {
        const pagesToShowAroundCurrent = 2;
        const range = [];
        const start = Math.max(1, currentPage - pagesToShowAroundCurrent);
        const end = Math.min(totalPages, currentPage + pagesToShowAroundCurrent);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return range;
    };

    const visiblePages = getVisiblePages();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={styles.paginationContainer}>
            {/* Items per page selector */}
            <div className={styles.itemsPerPage}>
                <label htmlFor="itemsPerPage" className={styles.label}>
                    Elementos por página:
                </label>
                <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className={styles.select}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className={styles.pageInfo}>
                <span className={styles.pageText}>
                    {startItem}-{endItem} de {totalItems}
                </span>
            </div>

            <div className={styles.navigation}>
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className={styles.navButton}
                    aria-label="Primera página"
                >
                    ««
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.navButton}
                    aria-label="Página anterior"
                >
                    ‹
                </button>

                {visiblePages.length > 0 && visiblePages[0]! > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className={styles.pageButton}
                        >
                            1
                        </button>
                        {visiblePages[0]! > 2 && <span className={styles.ellipsis}>...</span>}
                    </>
                )}

                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`${styles.pageButton} ${page === currentPage ? styles.active : ''
                            }`}
                        aria-label={`Página ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}

                {visiblePages.length > 0 && visiblePages[visiblePages.length - 1]! < totalPages && (
                    <>
                        {visiblePages[visiblePages.length - 1]! < totalPages - 1 && (
                            <span className={styles.ellipsis}>...</span>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className={styles.pageButton}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.navButton}
                    aria-label="Página siguiente"
                >
                    ›
                </button>

                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={styles.navButton}
                    aria-label="Última página"
                >
                    »»
                </button>
            </div>
        </div>
    );
};