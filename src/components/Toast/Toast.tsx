import React, { useEffect } from 'react';
import styles from './Toast.module.scss';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
    message, 
    type, 
    isVisible, 
    onClose, 
    duration = 4000 
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            default:
                return '';
        }
    };

    return (
        <div className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.content}>
                <span className={styles.icon} aria-hidden="true">
                    {getIcon()}
                </span>
                <span className={styles.message}>{message}</span>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Cerrar notificación"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};