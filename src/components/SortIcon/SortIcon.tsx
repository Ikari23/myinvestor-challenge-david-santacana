import React from 'react';
import type { SortDirection } from '../../types/funds';
import styles from './SortIcon.module.scss';

interface SortIconProps {
    direction: SortDirection;
}

export const SortIcon: React.FC<SortIconProps> = ({ direction }) => {
    return (
        <span
            className={styles.sortIcon}
            role="img"
            aria-hidden="true"
        >
            <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                className={styles.sortSvg}
                focusable="false"
            >
                <path
                    d="M4 1L6.5 4H1.5L4 1Z"
                    className={`${styles.arrowUp} ${direction === 'asc' ? styles.active : ''}`}
                />
                <path
                    d="M4 11L1.5 8H6.5L4 11Z"
                    className={`${styles.arrowDown} ${direction === 'desc' ? styles.active : ''}`}
                />
            </svg>
        </span>
    );
};


