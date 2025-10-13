import { render, screen, fireEvent } from '@testing-library/react'
import { Toast, type ToastType } from './Toast'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

const defaultProps = {
  message: 'Test notification',
  type: 'success' as ToastType,
  isVisible: true,
  onClose: vi.fn(),
}

describe('Toast Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Renderizado básico', () => {
    it('debería renderizar el toast cuando isVisible es true', () => {
      render(<Toast {...defaultProps} />)

      expect(screen.getByText('Test notification')).toBeInTheDocument()
      expect(screen.getByLabelText('Cerrar notificación')).toBeInTheDocument()
    })

    it('debería NO renderizar el toast cuando isVisible es false', () => {
      render(<Toast {...defaultProps} isVisible={false} />)

      expect(screen.queryByText('Test notification')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Cerrar notificación')).not.toBeInTheDocument()
    })

    it('debería mostrar el mensaje correcto', () => {
      const customMessage = 'Custom toast message'
      render(<Toast {...defaultProps} message={customMessage} />)

      expect(screen.getByText(customMessage)).toBeInTheDocument()
    })
  })

  describe('Tipos de toast', () => {
    it('debería mostrar icono de éxito para type="success"', () => {
      render(<Toast {...defaultProps} type="success" />)

      const icon = screen.getByText('✓')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('debería mostrar icono de error para type="error"', () => {
      const { container } = render(<Toast {...defaultProps} type="error" />)

      const icon = container.querySelector('span[aria-hidden="true"]')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveTextContent('✕')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('debería aplicar las clases CSS correctas según el tipo', () => {
      const { rerender, container } = render(<Toast {...defaultProps} type="success" />)
      let toastElement = container.querySelector('[class*="toast"]')
      expect(toastElement?.className).toMatch(/success/)

      rerender(<Toast {...defaultProps} type="error" />)
      toastElement = container.querySelector('[class*="toast"]')
      expect(toastElement?.className).toMatch(/error/)
    })
  })

  describe('Interacciones', () => {
    it('debería llamar onClose cuando se hace clic en el botón cerrar', () => {
      const mockOnClose = vi.fn()
      render(<Toast {...defaultProps} onClose={mockOnClose} />)

      const closeButton = screen.getByLabelText('Cerrar notificación')
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Auto-cierre', () => {
    it('debería auto-cerrarse después del tiempo por defecto (4000ms)', () => {
      const mockOnClose = vi.fn()
      render(<Toast {...defaultProps} onClose={mockOnClose} />)

      expect(mockOnClose).not.toHaveBeenCalled()

      vi.advanceTimersByTime(3999)
      expect(mockOnClose).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('debería auto-cerrarse después del tiempo personalizado', () => {
      const mockOnClose = vi.fn()
      const customDuration = 2000
      render(<Toast {...defaultProps} onClose={mockOnClose} duration={customDuration} />)

      vi.advanceTimersByTime(1999)
      expect(mockOnClose).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('debería NO auto-cerrarse cuando duration es 0', () => {
      const mockOnClose = vi.fn()
      render(<Toast {...defaultProps} onClose={mockOnClose} duration={0} />)

      vi.advanceTimersByTime(10000)

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('debería NO auto-cerrarse cuando isVisible es false', () => {
      const mockOnClose = vi.fn()
      render(<Toast {...defaultProps} onClose={mockOnClose} isVisible={false} />)

      vi.advanceTimersByTime(4000)

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('debería limpiar el timer cuando el componente se desmonta', () => {
      const mockOnClose = vi.fn()
      const { unmount } = render(<Toast {...defaultProps} onClose={mockOnClose} />)

      unmount()

      vi.advanceTimersByTime(4000)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Cambios de props', () => {
    it('debería reiniciar el timer cuando cambia isVisible de false a true', () => {
      const mockOnClose = vi.fn()
      const { rerender } = render(<Toast {...defaultProps} onClose={mockOnClose} isVisible={false} />)

      rerender(<Toast {...defaultProps} onClose={mockOnClose} isVisible={true} />)

      vi.advanceTimersByTime(4000)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })
})