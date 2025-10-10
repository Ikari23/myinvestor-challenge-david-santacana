import { useState, useCallback } from 'react';
import type { ToastType } from '../components/Toast/Toast';

interface ToastState {
    message: string;
    type: ToastType;
    isVisible: boolean;
}

export const useToast = () => {
    const [toast, setToast] = useState<ToastState>({
        message: '',
        type: 'success',
        isVisible: false,
    });

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({
            message,
            type,
            isVisible: true,
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({
            ...prev,
            isVisible: false,
        }));
    }, []);

    const showSuccess = useCallback((message: string) => {
        showToast(message, 'success');
    }, [showToast]);

    const showError = useCallback((message: string) => {
        showToast(message, 'error');
    }, [showToast]);

    return {
        toast,
        showToast,
        hideToast,
        showSuccess,
        showError,
    };
};