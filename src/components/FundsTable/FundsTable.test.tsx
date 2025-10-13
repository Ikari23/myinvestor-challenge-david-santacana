import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FundsTable } from './FundsTable'
import { useFunds } from '../../hooks/useFunds'
import { useToast } from '../../hooks/useToast'
import { useBuyFund } from '../../hooks/useBuyFund'
import { useTableSort } from '../../hooks/useTableSort'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { Fund } from '../../types/funds'

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

import { usePagination } from '../../hooks/usePagination'

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
    totalFunds: 0,
    refetch: vi.fn()
  },
  useToast: {
    toast: { message: '', type: 'success' as const, isVisible: false },
    showToast: vi.fn(),
    showSuccess: vi.fn(),
    showError: vi.fn(),
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
    selectedFundId: null,
    formMethods: {
      register: vi.fn(),
      formState: {
        errors: {},
        isDirty: false,
        isLoading: false,
        isSubmitted: false,
        isSubmitSuccessful: false,
        isValidating: false,
        isValid: false,
        submitCount: 0,
        dirtyFields: {},
        touchedFields: {},
        defaultValues: undefined,
        isSubmitting: false,
        disabled: false,
        validatingFields: {},
        isReady: true
      },
      setValue: vi.fn(),
      watch: vi.fn(),
      handleSubmit: vi.fn(),
      reset: vi.fn(),
      getValues: vi.fn(),
      getFieldState: vi.fn(),
      setError: vi.fn(),
      clearErrors: vi.fn(),
      setFocus: vi.fn(),
      trigger: vi.fn(),
      unregister: vi.fn(),
      control: {} as any,
      resetField: vi.fn(),
      subscribe: vi.fn()
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
        totalFunds: 0,
        refetch: vi.fn()
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
        error: 'Error de conexión',
        totalFunds: 0,
        refetch: vi.fn()
      })

      render(<FundsTable />)

      expect(screen.getByText('Listado de Fondos')).toBeInTheDocument()
      expect(screen.getByText((content, element) => {
        return element?.tagName === 'P' &&
          element?.className?.includes('errorText') &&
          element?.textContent?.includes('Error de conexión') || false
      })).toBeInTheDocument()
      expect(screen.getByText('Reintentar')).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    it('debería mostrar el estado vacío cuando no hay fondos', () => {
      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: null,
        totalFunds: 0,
        refetch: vi.fn()
      })

      render(<FundsTable />)

      expect(screen.getByText('Listado de Fondos')).toBeInTheDocument()
      expect(screen.getByText('No hay fondos disponibles')).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })

  describe('Renderizado con datos', () => {
    it('debería renderizar la tabla correctamente cuando hay fondos', () => {
      const mockFunds: Fund[] = [
        {
          id: '1',
          name: 'Fondo Ejemplo 1',
          category: 'GLOBAL',
          symbol: 'FE1',
          currency: 'EUR',
          value: 100.50,
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
          category: 'TECH',
          symbol: 'FE2',
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
        totalFunds: 2,
        refetch: vi.fn()
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
      expect(screen.getByText('GLOBAL')).toBeInTheDocument()
      expect(screen.getByText('TECH')).toBeInTheDocument()
    })
  })

  describe('Interacciones', () => {
    it('debería llamar a window.location.reload cuando se hace click en Reintentar', () => {
      Object.defineProperty(window, 'location', {
        value: { reload: vi.fn() },
        writable: true
      })

      const mockReload = window.location.reload as any

      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: 'Error de conexión',
        totalFunds: 0,
        refetch: vi.fn()
      })

      render(<FundsTable />)

      fireEvent.click(screen.getByText('Reintentar'))

      expect(mockReload).toHaveBeenCalled()
    })

    it('debería llamar a showSuccess cuando se ejecuta handleViewDetail', () => {
      const mockFunds: Fund[] = [{
        id: '1',
        name: 'Fondo Test',
        category: 'GLOBAL',
        symbol: 'FT',
        currency: 'EUR',
        value: 100,
        profitability: {
          YTD: 5.2,
          oneYear: 12.8,
          threeYears: 8.5,
          fiveYears: 6.3
        }
      }]

      const mockShowSuccess = vi.fn()

      mockUseFunds.mockReturnValue({
        funds: mockFunds,
        loading: false,
        error: null,
        totalFunds: 1,
        refetch: vi.fn()
      })

      mockUseToast.mockReturnValue({
        toast: { message: '', type: 'success', isVisible: false },
        showToast: vi.fn(),
        showSuccess: mockShowSuccess,
        showError: vi.fn(),
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

      render(<FundsTable />)

      const menuButton = screen.getByRole('button', { name: /Abrir menú de acciones/ })
      fireEvent.click(menuButton)

      const viewDetailOption = screen.getByRole('menuitem', { name: /Ver detalle/ })
      fireEvent.click(viewDetailOption)

      expect(mockShowSuccess).toHaveBeenCalledWith('Mostrando detalles de Fondo Test')
    })

    it('debería llamar a handleSort cuando se hace click en un header ordenable', () => {
      const mockFunds: Fund[] = [{
        id: '1',
        name: 'Fondo Test',
        category: 'GLOBAL',
        symbol: 'FT',
        currency: 'EUR',
        value: 100,
        profitability: {
          YTD: 5.2,
          oneYear: 12.8,
          threeYears: 8.5,
          fiveYears: 6.3
        }
      }]

      const mockHandleSort = vi.fn()

      mockUseFunds.mockReturnValue({
        funds: mockFunds,
        loading: false,
        error: null,
        totalFunds: 1,
        refetch: vi.fn()
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

      const nameHeaderButton = screen.getByRole('button', { name: /Nombre \(ISIN\)/ })
      fireEvent.click(nameHeaderButton)

      expect(mockHandleSort).toHaveBeenCalledWith('name')
    })
  })
})