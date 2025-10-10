import React, { useState, useRef, useCallback } from 'react';
import type { Fund } from '../../types/funds';
import styles from './ActionMenu.module.scss';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useEscapeKey } from '../../hooks/useEscapeKey';

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

    const closeMenu = useCallback(() => setIsOpen(false), []);

    useClickOutside(menuRef, closeMenu, { enabled: isOpen, extraRefs: [buttonRef] });
    useEscapeKey(() => {
        setIsOpen(false);
        buttonRef.current?.focus();
    }, isOpen);

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


