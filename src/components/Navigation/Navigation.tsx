import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.scss';

export const Navigation: React.FC = () => {
    const location = useLocation();

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h1 className={styles.brandTitle}>MyInvestor</h1>
                </div>

                <div className={styles.links}>
                    <Link
                        to="/"
                        className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`}
                    >
                        Fondos
                    </Link>
                    <Link
                        to="/portfolio"
                        className={`${styles.link} ${location.pathname === '/portfolio' ? styles.active : ''}`}
                    >
                        Mi Cartera
                    </Link>
                </div>
            </div>
        </nav>
    );
};