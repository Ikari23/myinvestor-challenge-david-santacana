import { useEffect } from 'react';

export const useEscapeKey = (onEscape: () => void, enabled: boolean = true) => {
    useEffect(() => {
        if (!enabled) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onEscape();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [enabled, onEscape]);
};


