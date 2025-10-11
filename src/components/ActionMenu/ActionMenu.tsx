import React, { useState, useRef, useCallback } from 'react';
import type { Fund } from '../../types/funds';
import styles from './ActionMenu.module.scss';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface ActionOption {
    id: string;
    label: string;
    icon: string;
    action: () => void;
}

interface BaseFund {
    id: string;
    name?: string;
}

interface ActionMenuProps {
    fund: Fund | BaseFund;
    options: ActionOption[];
    ariaLabel?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
    fund,
    options,
    ariaLabel
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

    const handleOptionClick = (action: () => void) => {
        setIsOpen(false);
        action();
    };

    return (
        <div className={styles.container} ref={menuRef}>
            <button
                ref={buttonRef}
                className={styles.triggerButton}
                onClick={handleToggle}
                aria-label={ariaLabel || `Abrir menú de acciones para ${fund.name}`}
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
                    {options.map((option) => (
                        <button
                            key={option.id}
                            className={styles.menuItem}
                            onClick={() => handleOptionClick(option.action)}
                            role="menuitem"
                        >
                            <span className={styles.icon} aria-hidden="true">{option.icon}</span>
                            <span className={styles.text}>{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
