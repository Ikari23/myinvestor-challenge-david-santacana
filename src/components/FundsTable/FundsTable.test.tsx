import { render, screen, fireEvent } from '@testing-library/react'
import { FundsTable } from './FundsTable'
import { vi } from 'vitest'

vi.mock('../../hooks/useFunds', () => ({
  useFunds: vi.fn()
}))

vi.mock('../../hooks/useToast', () => ({
  useToast: vi.fn()
}))

vi.mock('../../hooks/useTableSort', () => ({
  useTableSort: vi.fn()
}))

vi.mock('../../hooks/usePagination', () => ({
  usePagination: vi.fn()
}))

vi.mock('../../hooks/useBuyFund', () => ({
  useBuyFund: vi.fn()
}))

import { useFunds } from '../../hooks/useFunds'
import { useToast } from '../../hooks/useToast'
import { useTableSort } from '../../hooks/useTableSort'
import { usePagination } from '../../hooks/usePagination'
import { useBuyFund } from '../../hooks/useBuyFund'

const mockUseFunds = vi.mocked(useFunds)
const mockUseToast = vi.mocked(useToast)
const mockUseTableSort = vi.mocked(useTableSort)
const mockUsePagination = vi.mocked(usePagination)
const mockUseBuyFund = vi.mocked(useBuyFund)

const defaultMocks = {
  useFunds: {
    funds: [],
    loading: false,
    error: null,
    totalFunds: 0
  },
  useToast: {
    toast: { message: '', type: 'success', isVisible: false },
    showSuccess: vi.fn(),
    hideToast: vi.fn()
  },
  useTableSort: {
    sortState: { column: null, direction: null },
    sortedData: [],
    handleSort: vi.fn()
  },
  usePagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
    paginatedData: [],
    handlePageChange: vi.fn(),
    handleItemsPerPageChange: vi.fn()
  },
  useBuyFund: {
    isBuyOpen: false,
    isSubmitting: false,
    formMethods: {
      register: vi.fn(),
      formState: { errors: {} },
      setValue: vi.fn(),
      watch: vi.fn(),
      handleSubmit: vi.fn()
    },
    handleBuyFund: vi.fn(),
    handleBuySubmit: vi.fn(),
    handleCloseBuy: vi.fn(),
    selectedFund: null
  }
}

describe('FundsTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseFunds.mockReturnValue(defaultMocks.useFunds)
    mockUseToast.mockReturnValue(defaultMocks.useToast)
    mockUseTableSort.mockReturnValue(defaultMocks.useTableSort)
    mockUsePagination.mockReturnValue(defaultMocks.usePagination)
    mockUseBuyFund.mockReturnValue(defaultMocks.useBuyFund)
  })

  describe('Estados de carga y error', () => {
    it('debería mostrar el estado de carga correctamente', () => {
      mockUseFunds.mockReturnValue({
        funds: [],
        loading: true,
        error: null,
        totalFunds: 0
      })

      render(<FundsTable />)

      expect(screen.getByText('Listado de Fondos')).toBeInTheDocument()
      expect(screen.getByText('Cargando fondos...')).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    it('debería mostrar el estado de error correctamente', () => {
      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: 'Error al cargar los fondos',
        totalFunds: 0
      })

      render(<FundsTable />)

      expect(screen.getByText('Listado de Fondos')).toBeInTheDocument()
      expect(screen.getByText('❌ Error al cargar los fondos')).toBeInTheDocument()
      expect(screen.getByText('Reintentar')).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    it('debería mostrar el estado vacío cuando no hay fondos', () => {
      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: null,
        totalFunds: 0
      })

      render(<FundsTable />)

      expect(screen.getByText('Listado de Fondos')).toBeInTheDocument()
      expect(screen.getByText('No hay fondos disponibles')).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })

  describe('Renderizado con datos', () => {
    it('debería renderizar la tabla correctamente cuando hay fondos', () => {
      const mockFunds = [
        {
          id: '1',
          name: 'Fondo Ejemplo 1',
          category: 'Renta Variable',
          currency: 'EUR',
          value: 125.50,
          profitability: {
            YTD: 5.2,
            oneYear: 12.8,
            threeYears: 8.5,
            fiveYears: 6.3
          }
        },
        {
          id: '2',
          name: 'Fondo Ejemplo 2',
          category: 'Renta Fija',
          currency: 'USD',
          value: 98.75,
          profitability: {
            YTD: 2.1,
            oneYear: 3.4,
            threeYears: 2.8,
            fiveYears: 3.1
          }
        }
      ]

      mockUseFunds.mockReturnValue({
        funds: mockFunds,
        loading: false,
        error: null,
        totalFunds: 2
      })

      mockUseTableSort.mockReturnValue({
        sortState: { column: null, direction: null },
        sortedData: mockFunds,
        handleSort: vi.fn()
      })

      mockUsePagination.mockReturnValue({
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
        paginatedData: mockFunds,
        handlePageChange: vi.fn(),
        handleItemsPerPageChange: vi.fn()
      })

      render(<FundsTable />)

      expect(screen.getByText('Listado de Fondos')).toBeInTheDocument()
      expect(screen.getByText('2 fondos disponibles')).toBeInTheDocument()
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('Fondo Ejemplo 1')).toBeInTheDocument()
      expect(screen.getByText('Fondo Ejemplo 2')).toBeInTheDocument()
      expect(screen.getByText('Renta Variable')).toBeInTheDocument()
      expect(screen.getByText('Renta Fija')).toBeInTheDocument()
    })
  })

  describe('Interacciones', () => {
    it('debería llamar a window.location.reload cuando se hace click en Reintentar', () => {
      const mockReload = vi.fn()
      Object.defineProperty(window, 'location', {
        value: {
          reload: mockReload
        },
        writable: true
      })

      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: 'Error al cargar los fondos',
        totalFunds: 0
      })

      render(<FundsTable />)

      const retryButton = screen.getByText('Reintentar')
      fireEvent.click(retryButton)

      expect(mockReload).toHaveBeenCalled()
    })

    it('debería llamar a showSuccess cuando se ejecuta handleViewDetail', () => {
      const mockShowSuccess = vi.fn()

      const mockFunds = [
        {
          id: '1',
          name: 'Fondo Test',
          category: 'Renta Variable',
          currency: 'EUR',
          value: 125.50,
          profitability: {
            YTD: 5.2,
            oneYear: 12.8,
            threeYears: 8.5,
            fiveYears: 6.3
          }
        }
      ]

      mockUseFunds.mockReturnValue({
        funds: mockFunds,
        loading: false,
        error: null,
        totalFunds: 1
      })

      mockUseToast.mockReturnValue({
        toast: { message: '', type: 'success', isVisible: false },
        showSuccess: mockShowSuccess,
        hideToast: vi.fn()
      })

      mockUseTableSort.mockReturnValue({
        sortState: { column: null, direction: null },
        sortedData: mockFunds,
        handleSort: vi.fn()
      })

      mockUsePagination.mockReturnValue({
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
        paginatedData: mockFunds,
        handlePageChange: vi.fn(),
        handleItemsPerPageChange: vi.fn()
      })

      vi.mock('../../utils/menuUtils', () => ({
        createFundsTableMenuOptions: vi.fn((fund, handleBuyFund, handleViewDetail) => {
          handleViewDetail(fund)
          return []
        })
      }))

      render(<FundsTable />)

      expect(mockShowSuccess).toHaveBeenCalledWith('Mostrando detalles de Fondo Test')
    })

    it('debería llamar a handleSort cuando se hace click en un header ordenable', () => {
      const mockHandleSort = vi.fn()

      const mockFunds = [
        {
          id: '1',
          name: 'Fondo Test',
          category: 'Renta Variable',
          currency: 'EUR',
          value: 125.50,
          profitability: {
            YTD: 5.2,
            oneYear: 12.8,
            threeYears: 8.5,
            fiveYears: 6.3
          }
        }
      ]

      mockUseFunds.mockReturnValue({
        funds: mockFunds,
        loading: false,
        error: null,
        totalFunds: 1
      })

      mockUseTableSort.mockReturnValue({
        sortState: { column: null, direction: null },
        sortedData: mockFunds,
        handleSort: mockHandleSort
      })

      mockUsePagination.mockReturnValue({
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
        paginatedData: mockFunds,
        handlePageChange: vi.fn(),
        handleItemsPerPageChange: vi.fn()
      })

      render(<FundsTable />)

      const nameHeader = screen.getByText('Nombre').closest('button')
      if (nameHeader) {
        fireEvent.click(nameHeader)
        expect(mockHandleSort).toHaveBeenCalledWith('name')
      }
    })
  })
})