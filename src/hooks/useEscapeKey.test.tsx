import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useEscapeKey } from './useEscapeKey';

describe('useEscapeKey', () => {
    let mockCallback: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockCallback = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('debería llamar callback cuando se presiona Escape', () => {
        renderHook(() => useEscapeKey(mockCallback));

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('no debería llamar callback cuando se presionan otras teclas', () => {
        renderHook(() => useEscapeKey(mockCallback));

        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        document.dispatchEvent(event);

        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('no debería llamar callback cuando enabled es false', () => {
        renderHook(() => useEscapeKey(mockCallback, false));

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);

        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('debería usar enabled=true por defecto', () => {
        renderHook(() => useEscapeKey(mockCallback));

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);

        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('debería actualizar cuando cambia enabled', () => {
        const { rerender } = renderHook(
            ({ enabled }) => useEscapeKey(mockCallback, enabled),
            { initialProps: { enabled: false } }
        );

        let event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
        expect(mockCallback).not.toHaveBeenCalled();

        rerender({ enabled: true });
        event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('debería remover event listener al desmontar', () => {
        const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

        const { unmount } = renderHook(() => useEscapeKey(mockCallback));

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

        removeEventListenerSpy.mockRestore();
    });
});