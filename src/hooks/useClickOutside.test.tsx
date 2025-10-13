import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
    let mockCallback: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockCallback = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('debería llamar callback cuando se hace click fuera del contenedor', () => {
        const containerRef = { current: document.createElement('div') };
        document.body.appendChild(containerRef.current);

        renderHook(() => useClickOutside(containerRef, mockCallback));

        const outsideElement = document.createElement('div');
        document.body.appendChild(outsideElement);

        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: outsideElement });

        document.dispatchEvent(event);

        expect(mockCallback).toHaveBeenCalledTimes(1);

        document.body.removeChild(containerRef.current);
        document.body.removeChild(outsideElement);
    });

    it('no debería llamar callback cuando se hace click dentro del contenedor', () => {
        const containerRef = { current: document.createElement('div') };
        document.body.appendChild(containerRef.current);

        renderHook(() => useClickOutside(containerRef, mockCallback));

        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: containerRef.current });

        document.dispatchEvent(event);

        expect(mockCallback).not.toHaveBeenCalled();

        document.body.removeChild(containerRef.current);
    });

    it('no debería llamar callback cuando enabled es false', () => {
        const containerRef = { current: document.createElement('div') };
        document.body.appendChild(containerRef.current);

        renderHook(() => useClickOutside(containerRef, mockCallback, { enabled: false }));

        const outsideElement = document.createElement('div');
        document.body.appendChild(outsideElement);

        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: outsideElement });

        document.dispatchEvent(event);

        expect(mockCallback).not.toHaveBeenCalled();

        document.body.removeChild(containerRef.current);
        document.body.removeChild(outsideElement);
    });

    it('no debería llamar callback cuando se hace click en extraRefs', () => {
        const containerRef = { current: document.createElement('div') };
        const extraRef = { current: document.createElement('div') };
        document.body.appendChild(containerRef.current);
        document.body.appendChild(extraRef.current);

        renderHook(() => useClickOutside(containerRef, mockCallback, {
            extraRefs: [extraRef]
        }));

        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: extraRef.current });

        document.dispatchEvent(event);

        expect(mockCallback).not.toHaveBeenCalled();

        document.body.removeChild(containerRef.current);
        document.body.removeChild(extraRef.current);
    });

    it('debería manejar target null', () => {
        const containerRef = { current: document.createElement('div') };
        document.body.appendChild(containerRef.current);

        renderHook(() => useClickOutside(containerRef, mockCallback));

        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: null });

        document.dispatchEvent(event);

        expect(mockCallback).not.toHaveBeenCalled();

        document.body.removeChild(containerRef.current);
    });

    it('debería manejar containerRef.current null', () => {
        const containerRef = { current: null };

        renderHook(() => useClickOutside(containerRef, mockCallback));

        const outsideElement = document.createElement('div');
        document.body.appendChild(outsideElement);

        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: outsideElement });

        document.dispatchEvent(event);

        expect(mockCallback).toHaveBeenCalledTimes(1);

        document.body.removeChild(outsideElement);
    });
});