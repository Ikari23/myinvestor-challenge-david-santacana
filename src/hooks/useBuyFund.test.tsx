import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useBuyFund } from './useBuyFund'
import { useBuyFund as useBuyFundMutation } from './useFunds'
import { useToast } from './useToast'
import { useForm } from 'react-hook-form'
import type { Fund } from '../types/funds'

vi.mock('./useFunds', () => ({
  useBuyFund: vi.fn()
}))

vi.mock('./useToast', () => ({
  useToast: vi.fn()
}))

vi.mock('react-hook-form', () => ({
  useForm: vi.fn()
}))

describe('useBuyFund', () => {
  const mockFunds: Fund[] = [
    {
      id: 'FUND_001',
      name: 'Fondo Global Sostenible',
      category: 'GLOBAL',
      currency: 'EUR',
      symbol: 'FGS',
      value: 125.45,
      profitability: {
        YTD: 5.2,
        oneYear: 12.8,
        threeYears: 8.5,
        fiveYears: 6.3
      }
    },
    {
      id: 'FUND_002',
      name: 'Fondo Tech USA',
      category: 'TECH',
      currency: 'USD',
      symbol: 'FTU',
      value: 89.30,
      profitability: {
        YTD: 2.1,
        oneYear: 3.4,
        threeYears: 2.8,
        fiveYears: 3.1
      }
    }
  ]

  const mockMutateAsync = vi.fn()
  const mockShowSuccess = vi.fn()
  const mockShowError = vi.fn()
  const mockReset = vi.fn()
  const mockHandleSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useToast).mockReturnValue({
      toast: { message: '', type: 'success', isVisible: false },
      showToast: vi.fn(),
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      hideToast: vi.fn()
    })

    vi.mocked(useBuyFundMutation).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
      reset: vi.fn()
    } as any)

    vi.mocked(useForm).mockReturnValue({
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
        defaultValues: undefined
      },
      setValue: vi.fn(),
      watch: vi.fn(),
      handleSubmit: mockHandleSubmit,
      reset: mockReset
    } as any)
  })

  describe('Estado inicial', () => {
    it('debería tener el estado inicial correcto', () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

      expect(result.current.selectedFundId).toBeNull()
      expect(result.current.isBuyOpen).toBe(false)
      expect(result.current.isSubmitting).toBe(false)
      expect(result.current.selectedFund).toBeNull()
      expect(result.current.formMethods).toBeDefined()
      expect(result.current.handleBuyFund).toBeInstanceOf(Function)
      expect(result.current.handleBuySubmit).toBeInstanceOf(Function)
      expect(result.current.handleCloseBuy).toBeInstanceOf(Function)
    })

    it('debería configurar react-hook-form correctamente', () => {
      renderHook(() => useBuyFund(mockFunds))

      expect(useForm).toHaveBeenCalledWith({
        defaultValues: { amount: 0 },
        mode: 'onChange'
      })
    })
  })

  describe('handleBuyFund', () => {
    it('debería abrir el diálogo y seleccionar el fondo', () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[0]!)
      })

      expect(result.current.selectedFundId).toBe('FUND_001')
      expect(result.current.isBuyOpen).toBe(true)
      expect(result.current.selectedFund).toEqual(mockFunds[0])
      expect(mockReset).toHaveBeenCalledWith({ amount: 0 })
    })

    it('debería manejar diferentes fondos correctamente', () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[0]!)
      })

      expect(result.current.selectedFundId).toBe('FUND_001')

      act(() => {
        result.current.handleBuyFund(mockFunds[1]!)
      })

      expect(result.current.selectedFundId).toBe('FUND_002')
      expect(result.current.selectedFund).toEqual(mockFunds[1])
      expect(mockReset).toHaveBeenCalledTimes(2)
    })
  })

  describe('handleCloseBuy', () => {
    it('debería cerrar el diálogo y resetear el estado', () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[0]!)
      })

      expect(result.current.isBuyOpen).toBe(true)

      act(() => {
        result.current.handleCloseBuy()
      })

      expect(result.current.isBuyOpen).toBe(false)
      expect(result.current.selectedFundId).toBeNull()
      expect(result.current.selectedFund).toBeNull()
      expect(mockReset).toHaveBeenCalledWith({ amount: 0 })
    })
  })

  describe('handleBuySubmit', () => {
    beforeEach(() => {
      mockMutateAsync.mockResolvedValue({ success: true })
    })

    it('debería realizar la compra exitosamente', async () => {
      mockMutateAsync.mockResolvedValueOnce({ success: true })

      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[0]!)
      })

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 1000 })
      })

      expect(mockMutateAsync).toHaveBeenCalledWith({
        fundId: 'FUND_001',
        quantity: 7.971303308090873
      })

      const successMessage = mockShowSuccess.mock.calls[0]?.[0]
      expect(successMessage).toContain('Compra realizada con éxito:')
      expect(successMessage).toContain('1000,00')
      expect(successMessage).toContain('€')
      expect(successMessage).toContain('Fondo Global Sostenible')
      expect(successMessage).toContain('7,9713 unidades')
      expect(result.current.isBuyOpen).toBe(false)
    })

    it('debería manejar error cuando no hay fondo seleccionado', async () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

      expect(result.current.selectedFundId).toBeNull()
      expect(result.current.selectedFund).toBeNull()

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 1000 })
      })

      expect(mockShowError).toHaveBeenCalledWith(
        'Error: No se pudo encontrar el fondo seleccionado'
      )
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })

    it('debería manejar errores de la mutación', async () => {
      const mockError = new Error('Error de conexión')
      mockMutateAsync.mockRejectedValue(mockError)

      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[0]!)
      })

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 1000 })
      })

      expect(mockShowError).toHaveBeenCalledWith(
        'Error al realizar la compra. Inténtalo de nuevo.'
      )

      expect(result.current.isBuyOpen).toBe(true)
    })

    it('debería calcular correctamente la cantidad de unidades', async () => {
      mockMutateAsync.mockResolvedValueOnce({ success: true })

      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[1]!)
      })

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 500 })
      })

      const callArgs = mockMutateAsync.mock.calls[0]?.[0]
      expect(callArgs?.quantity).toBe(5.599104143337066)
    })

    it('debería formatear correctamente el mensaje de éxito', async () => {
      mockMutateAsync.mockResolvedValueOnce({ success: true })

      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[0]!)
      })

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 250 })
      })

      const successMessage = mockShowSuccess.mock.calls[0]?.[0]
      expect(successMessage).toContain('Compra realizada con éxito:')
      expect(successMessage).toContain('250,00')
      expect(successMessage).toContain('€')
      expect(successMessage).toContain('Fondo Global Sostenible')
      expect(successMessage).toContain('unidades')
    })

    it('debería manejar fondos sin nombre usando getFundName', async () => {
      const fundWithoutName: Fund = {
        id: 'FUND_NO_NAME',
        name: '',
        category: 'GLOBAL',
        symbol: 'FNN',
        currency: 'EUR',
        value: 100,
        profitability: {
          YTD: 0,
          oneYear: 0,
          threeYears: 0,
          fiveYears: 0
        }
      }

      const { result } = renderHook(() => useBuyFund([...mockFunds, fundWithoutName]))

      act(() => {
        result.current.handleBuyFund(fundWithoutName)
      })

      mockMutateAsync.mockResolvedValueOnce({ success: true })

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 100 })
      })

      const successMessage = mockShowSuccess.mock.calls[0]?.[0]
      expect(successMessage).toContain('FUND_NO_NAME')
    })
  })

  describe('isSubmitting state', () => {
    it('debería reflejar el estado isPending de la mutación', () => {
      vi.mocked(useBuyFundMutation).mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true,
        isError: false,
        error: null,
        data: undefined,
        isSuccess: false,
        isIdle: false,
        mutate: vi.fn(),
        reset: vi.fn()
      } as any)

      const { result } = renderHook(() => useBuyFund(mockFunds))

      expect(result.current.isSubmitting).toBe(true)
    })
  })

  describe('selectedFund derivado', () => {
    it('debería retornar null cuando no hay fondo seleccionado', () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

      expect(result.current.selectedFund).toBeNull()
    })

    it('debería retornar null cuando el ID seleccionado no existe en la lista', () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund({
          id: 'NONEXISTENT',
          name: 'Test',
          category: 'GLOBAL',
          symbol: 'TST',
          value: 100,
          currency: 'EUR',
          profitability: {
            YTD: 0,
            oneYear: 0,
            threeYears: 0,
            fiveYears: 0
          }
        } as Fund)
      })

      expect(result.current.selectedFund).toBeNull()
    })

    it('debería manejar lista de fondos vacía', () => {
      const { result } = renderHook(() => useBuyFund([]))

      expect(result.current.selectedFund).toBeNull()

      act(() => {
        result.current.handleBuyFund(mockFunds[0]!)
      })

      expect(result.current.selectedFund).toBeNull()
    })
  })
})