import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from './Pagination'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const defaultProps = {
  currentPage: 1,
  totalPages: 5,
  totalItems: 50,
  itemsPerPage: 10,
  onPageChange: vi.fn(),
  onItemsPerPageChange: vi.fn(),
}

describe('Pagination Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado básico', () => {
    it('debería renderizar todos los elementos principales', () => {
      render(<Pagination {...defaultProps} />)

      expect(screen.getByLabelText('Elementos por página:')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10')).toBeInTheDocument()

      expect(screen.getByText('1-10 de 50')).toBeInTheDocument()

      expect(screen.getByLabelText('Primera página')).toBeInTheDocument()
      expect(screen.getByLabelText('Página anterior')).toBeInTheDocument()
      expect(screen.getByLabelText('Página siguiente')).toBeInTheDocument()
      expect(screen.getByLabelText('Última página')).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Página 1', current: 'page' })).toBeInTheDocument()
    })

    it('debería mostrar el rango correcto de elementos para diferentes páginas', () => {
      render(<Pagination {...defaultProps} currentPage={1} />)
      expect(screen.getByText('1-10 de 50')).toBeInTheDocument()

      const { rerender } = render(<Pagination {...defaultProps} currentPage={3} />)
      rerender(<Pagination {...defaultProps} currentPage={3} />)
      expect(screen.getByText('21-30 de 50')).toBeInTheDocument()

      rerender(<Pagination {...defaultProps} currentPage={5} totalItems={45} />)
      expect(screen.getByText('41-45 de 45')).toBeInTheDocument()
    })
  })

  describe('Estados de botones de navegación', () => {
    it('debería deshabilitar botones de primera página y anterior cuando está en la primera página', () => {
      render(<Pagination {...defaultProps} currentPage={1} />)

      expect(screen.getByLabelText('Primera página')).toBeDisabled()
      expect(screen.getByLabelText('Página anterior')).toBeDisabled()
      expect(screen.getByLabelText('Página siguiente')).not.toBeDisabled()
      expect(screen.getByLabelText('Última página')).not.toBeDisabled()
    })

    it('debería deshabilitar botones de última página y siguiente cuando está en la última página', () => {
      render(<Pagination {...defaultProps} currentPage={5} />)

      expect(screen.getByLabelText('Primera página')).not.toBeDisabled()
      expect(screen.getByLabelText('Página anterior')).not.toBeDisabled()
      expect(screen.getByLabelText('Página siguiente')).toBeDisabled()
      expect(screen.getByLabelText('Última página')).toBeDisabled()
    })

    it('debería habilitar todos los botones cuando está en una página intermedia', () => {
      render(<Pagination {...defaultProps} currentPage={3} />)

      expect(screen.getByLabelText('Primera página')).not.toBeDisabled()
      expect(screen.getByLabelText('Página anterior')).not.toBeDisabled()
      expect(screen.getByLabelText('Página siguiente')).not.toBeDisabled()
      expect(screen.getByLabelText('Última página')).not.toBeDisabled()
    })
  })

  describe('Interacciones con botones', () => {
    it('debería llamar onPageChange cuando se hace clic en los botones de navegación', () => {
      const mockOnPageChange = vi.fn()
      render(<Pagination {...defaultProps} currentPage={3} onPageChange={mockOnPageChange} />)

      fireEvent.click(screen.getByLabelText('Primera página'))
      expect(mockOnPageChange).toHaveBeenCalledWith(1)

      fireEvent.click(screen.getByLabelText('Página anterior'))
      expect(mockOnPageChange).toHaveBeenCalledWith(2)

      fireEvent.click(screen.getByLabelText('Página siguiente'))
      expect(mockOnPageChange).toHaveBeenCalledWith(4)

      fireEvent.click(screen.getByLabelText('Última página'))
      expect(mockOnPageChange).toHaveBeenCalledWith(5)

      expect(mockOnPageChange).toHaveBeenCalledTimes(4)
    })

    it('debería llamar onPageChange cuando se hace clic en un número de página específico', () => {
      const mockOnPageChange = vi.fn()
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={mockOnPageChange} />)

      fireEvent.click(screen.getByRole('button', { name: 'Página 2' }))
      expect(mockOnPageChange).toHaveBeenCalledWith(2)

      fireEvent.click(screen.getByRole('button', { name: 'Página 3' }))
      expect(mockOnPageChange).toHaveBeenCalledWith(3)

      expect(mockOnPageChange).toHaveBeenCalledTimes(2)
    })

    it('debería llamar onItemsPerPageChange cuando se cambia el selector', () => {
      const mockOnItemsPerPageChange = vi.fn()
      render(<Pagination {...defaultProps} onItemsPerPageChange={mockOnItemsPerPageChange} />)

      const select = screen.getByLabelText('Elementos por página:')

      fireEvent.change(select, { target: { value: '20' } })
      expect(mockOnItemsPerPageChange).toHaveBeenCalledWith(20)

      fireEvent.change(select, { target: { value: '50' } })
      expect(mockOnItemsPerPageChange).toHaveBeenCalledWith(50)

      expect(mockOnItemsPerPageChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('Páginas visibles y ellipsis', () => {
    it('debería mostrar ellipsis cuando hay muchas páginas', () => {
      render(<Pagination {...defaultProps} currentPage={8} totalPages={15} totalItems={150} />)

      const ellipsis = screen.getAllByText('...')
      expect(ellipsis).toHaveLength(2)

      expect(screen.getByRole('button', { name: /^1$/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^15$/ })).toBeInTheDocument()
    })

    it('debería mostrar las páginas correctas alrededor de la página actual', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} totalItems={100} />)

      expect(screen.getByRole('button', { name: 'Página 3' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Página 4' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Página 5', current: 'page' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Página 6' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Página 7' })).toBeInTheDocument()
    })
  })
})