import { render, screen, fireEvent } from '@testing-library/react'
import { ActionMenu } from './ActionMenu'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('../../hooks/useClickOutside', () => ({
  useClickOutside: vi.fn()
}))

vi.mock('../../hooks/useEscapeKey', () => ({
  useEscapeKey: vi.fn()
}))

const mockFund = {
  id: '1',
  name: 'Fondo Test',
  category: 'Renta Variable',
  currency: 'EUR',
  value: 100.50,
  profitability: {
    YTD: 5.2,
    oneYear: 12.8,
    threeYears: 8.5,
    fiveYears: 6.3
  }
}

const mockOptions = [
  {
    id: 'buy',
    label: 'Comprar',
    icon: '💰',
    action: vi.fn()
  },
  {
    id: 'details',
    label: 'Ver detalles',
    icon: '👁️',
    action: vi.fn()
  },
  {
    id: 'favorite',
    label: 'Añadir a favoritos',
    icon: '⭐',
    action: vi.fn()
  }
]

describe('ActionMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado básico', () => {
    it('debería renderizar el botón trigger cuando está cerrado', () => {
      render(<ActionMenu fund={mockFund} options={mockOptions} />)

      const triggerButton = screen.getByRole('button', { name: /Abrir menú de acciones para Fondo Test/ })
      expect(triggerButton).toBeInTheDocument()
      expect(triggerButton).toHaveTextContent('⋮')

      expect(triggerButton).toHaveAttribute('aria-haspopup', 'menu')
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false')

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('debería usar aria-label personalizado cuando se proporciona', () => {
      render(<ActionMenu fund={mockFund} options={mockOptions} ariaLabel="Menú personalizado" />)

      const triggerButton = screen.getByRole('button', { name: 'Menú personalizado' })
      expect(triggerButton).toBeInTheDocument()
    })

    it('debería manejar fondos sin nombre', () => {
      const fundWithoutName = { id: '1' }
      render(<ActionMenu fund={fundWithoutName} options={mockOptions} />)

      const triggerButton = screen.getByRole('button')
      expect(triggerButton).toHaveAttribute('aria-label', 'Abrir menú de acciones para undefined')
    })
  })

  describe('Apertura y cierre del menú', () => {
    it('debería abrir el menú cuando se hace clic en el trigger', () => {
      render(<ActionMenu fund={mockFund} options={mockOptions} />)

      const triggerButton = screen.getByRole('button', { name: /Abrir menú de acciones/ })

      fireEvent.click(triggerButton)

      expect(triggerButton).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('menu')).toBeInTheDocument()
      expect(screen.getByRole('menu')).toHaveAttribute('aria-label', 'Acciones para Fondo Test')
    })

    it('debería cerrar el menú cuando se hace clic en el trigger nuevamente', () => {
      render(<ActionMenu fund={mockFund} options={mockOptions} />)

      const triggerButton = screen.getByRole('button', { name: /Abrir menú de acciones/ })

      fireEvent.click(triggerButton)
      expect(screen.getByRole('menu')).toBeInTheDocument()

      fireEvent.click(triggerButton)
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  describe('Opciones del menú', () => {
    it('debería renderizar todas las opciones cuando el menú está abierto', () => {
      render(<ActionMenu fund={mockFund} options={mockOptions} />)

      fireEvent.click(screen.getByRole('button', { name: /Abrir menú de acciones/ }))

      expect(screen.getByRole('menuitem', { name: /Comprar/ })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: /Ver detalles/ })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: /Añadir a favoritos/ })).toBeInTheDocument()

      expect(screen.getByText('💰')).toBeInTheDocument()
      expect(screen.getByText('👁️')).toBeInTheDocument()
      expect(screen.getByText('⭐')).toBeInTheDocument()
    })

    it('debería llamar la acción correcta y cerrar el menú al hacer clic en una opción', () => {
      render(<ActionMenu fund={mockFund} options={mockOptions} />)

      fireEvent.click(screen.getByRole('button', { name: /Abrir menú de acciones/ }))

      fireEvent.click(screen.getByRole('menuitem', { name: /Comprar/ }))

      expect(mockOptions[0]?.action).toHaveBeenCalledTimes(1)

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('debería manejar múltiples clics en diferentes opciones', () => {
      render(<ActionMenu fund={mockFund} options={mockOptions} />)

      fireEvent.click(screen.getByRole('button', { name: /Abrir menú de acciones/ }))
      fireEvent.click(screen.getByRole('menuitem', { name: /Comprar/ }))
      expect(mockOptions[0]?.action).toHaveBeenCalledTimes(1)

      fireEvent.click(screen.getByRole('button', { name: /Abrir menú de acciones/ }))
      fireEvent.click(screen.getByRole('menuitem', { name: /Ver detalles/ }))
      expect(mockOptions[1]?.action).toHaveBeenCalledTimes(1)

      expect(mockOptions[0]?.action).toHaveBeenCalledTimes(1)
      expect(mockOptions[2]?.action).not.toHaveBeenCalled()
    })
  })

  describe('Casos edge y accesibilidad', () => {
    it('debería manejar lista vacía de opciones', () => {
      render(<ActionMenu fund={mockFund} options={[]} />)

      const triggerButton = screen.getByRole('button', { name: /Abrir menú de acciones/ })

      fireEvent.click(triggerButton)

      expect(screen.getByRole('menu')).toBeInTheDocument()
      expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()
    })

    it('debería tener iconos marcados como aria-hidden', () => {
      const { container } = render(<ActionMenu fund={mockFund} options={mockOptions} />)

      const triggerButton = container.querySelector('button[aria-haspopup="menu"]')
      fireEvent.click(triggerButton!)

      const icons = container.querySelectorAll('[aria-hidden="true"]')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('debería mantener el foco en el trigger después de ejecutar una acción', () => {
      render(<ActionMenu fund={mockFund} options={mockOptions} />)

      const triggerButton = screen.getByRole('button', { name: /Abrir menú de acciones/ })

      fireEvent.click(triggerButton)
      fireEvent.click(screen.getByRole('menuitem', { name: /Comprar/ }))

      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      expect(triggerButton).toHaveAttribute('aria-expanded', 'false')
    })
  })
})