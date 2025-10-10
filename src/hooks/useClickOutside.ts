import { useEffect } from 'react';

interface UseClickOutsideOptions {
    enabled?: boolean;
    extraRefs?: Array<React.RefObject<HTMLElement>>;
}

export const useClickOutside = (
    containerRef: React.RefObject<HTMLElement>,
    onOutsideClick: () => void,
    options?: UseClickOutsideOptions
) => {
    const { enabled = true, extraRefs = [] } = options ?? {};

    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;
            const container = containerRef.current;
            if (!target) return;

            const isInsideContainer = container?.contains(target);
            const isInsideAnyExtra = extraRefs.some((ref) => ref.current?.contains(target));

            if (!isInsideContainer && !isInsideAnyExtra) {
                onOutsideClick();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [enabled, containerRef, extraRefs, onOutsideClick]);
};


