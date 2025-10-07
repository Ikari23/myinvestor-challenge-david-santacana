import React, { useState, useRef, useEffect } from 'react';
import type { Fund } from '../../types';
import styles from './ActionMenu.module.scss';

interface ActionMenuProps {
    fund: Fund;
    onBuy?: (fund: Fund) => void;
    onViewDetail?: (fund: Fund) => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
    fund,
    onBuy,
    onViewDetail
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleBuy = () => {
        setIsOpen(false);
        onBuy?.(fund);
    };

    const handleViewDetail = () => {
        setIsOpen(false);
        onViewDetail?.(fund);
    };

    return (
        <div className={styles.container} ref={menuRef}>
            <button
                ref={buttonRef}
                className={styles.triggerButton}
                onClick={handleToggle}
                aria-label={`Abrir menú de acciones para ${fund.name}`}
                aria-haspopup="menu"
                aria-expanded={isOpen}
            >
                ⋮
            </button>

            {isOpen && (
                <div
                    className={styles.menu}
                    role="menu"
                    aria-label={`Acciones para ${fund.name}`}
                >
                    <button
                        className={styles.menuItem}
                        onClick={handleBuy}
                        role="menuitem"
                    >
                        <span className={styles.icon} aria-hidden="true">→</span>
                        <span className={styles.text}>Comprar</span>
                    </button>

                    <button
                        className={styles.menuItem}
                        onClick={handleViewDetail}
                        role="menuitem"
                    >
                        <span className={styles.icon} aria-hidden="true">👁</span>
                        <span className={styles.text}>Ver detalle</span>
                    </button>
                </div>
            )}
        </div>
    );
};