import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
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
      value: 125.45,
      currency: 'EUR',
      risk: 3
    },
    {
      id: 'FUND_002',
      name: 'Fondo Tech USA',
      category: 'USA',
      value: 89.30,
      currency: 'USD',
      risk: 4
    }
  ]

  const mockMutateAsync = vi.fn()
  const mockShowSuccess = vi.fn()
  const mockShowError = vi.fn()
  const mockReset = vi.fn()
  const mockHandleSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useBuyFundMutation).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
      data: undefined,
      isSuccess: false,
      isIdle: true,
      mutate: vi.fn(),
      reset: vi.fn()
    } as any)

    vi.mocked(useToast).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showInfo: vi.fn(),
      showWarning: vi.fn()
    })

    vi.mocked(useForm).mockReturnValue({
      reset: mockReset,
      handleSubmit: mockHandleSubmit,
      formState: { errors: {} },
      register: vi.fn(),
      watch: vi.fn(),
      setValue: vi.fn(),
      getValues: vi.fn(),
      control: {} as any,
      trigger: vi.fn(),
      setError: vi.fn(),
      clearErrors: vi.fn(),
      setFocus: vi.fn(),
      getFieldState: vi.fn(),
      resetField: vi.fn(),
      unregister: vi.fn()
    })
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
        result.current.handleBuyFund(mockFunds[0])
      })

      expect(result.current.selectedFundId).toBe('FUND_001')
      expect(result.current.isBuyOpen).toBe(true)
      expect(result.current.selectedFund).toEqual(mockFunds[0])
      expect(mockReset).toHaveBeenCalledWith({ amount: 0 })
    })

    it('debería manejar diferentes fondos correctamente', () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[0])
      })

      expect(result.current.selectedFundId).toBe('FUND_001')

      act(() => {
        result.current.handleBuyFund(mockFunds[1])
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
        result.current.handleBuyFund(mockFunds[0])
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
      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[0])
      })

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 1000 })
      })

      expect(mockMutateAsync).toHaveBeenCalledWith({
        fundId: 'FUND_001',
        quantity: expect.any(Number)
      })

      expect(mockShowSuccess).toHaveBeenCalledWith(
        expect.stringContaining('Compra realizada con éxito')
      )

      expect(result.current.isBuyOpen).toBe(false)
      expect(result.current.selectedFundId).toBeNull()
    })

    it('debería manejar error cuando no hay fondo seleccionado', async () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

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
        result.current.handleBuyFund(mockFunds[0])
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
      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[1])
      })

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 500 })
      })

      expect(mockMutateAsync).toHaveBeenCalledWith({
        fundId: 'FUND_002',
        quantity: expect.any(Number)
      })

      const callArgs = mockMutateAsync.mock.calls[0][0]
      expect(callArgs.quantity).toBeCloseTo(5.5988, 3)
    })

    it('debería formatear correctamente el mensaje de éxito', async () => {
      const { result } = renderHook(() => useBuyFund(mockFunds))

      act(() => {
        result.current.handleBuyFund(mockFunds[0])
      })

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 1254.5 })
      })

      const successMessage = mockShowSuccess.mock.calls[0][0]

      expect(successMessage).toContain('Compra realizada con éxito')
      expect(successMessage).toContain('Fondo Global Sostenible')
      expect(successMessage).toContain('10,0000 unidades')
      expect(successMessage).toMatch(/1254,50\s*€/)
    })

    it('debería manejar fondos sin nombre usando getFundName', async () => {
      const fundWithoutName = {
        id: 'FUND_999',
        category: 'OTHER' as const,
        value: 100,
        currency: 'EUR' as const,
        risk: 1
      }

      const { result } = renderHook(() => useBuyFund([...mockFunds, fundWithoutName]))

      act(() => {
        result.current.handleBuyFund(fundWithoutName)
      })

      await act(async () => {
        await result.current.handleBuySubmit({ amount: 100 })
      })

      expect(mockShowSuccess).toHaveBeenCalledWith(
        expect.stringContaining('Fondo FUND_999')
      )
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
        result.current.handleBuyFund({ id: 'NONEXISTENT', name: 'Test', category: 'OTHER', value: 100, currency: 'EUR', risk: 1 })
      })

      expect(result.current.selectedFund).toBeNull()
    })

    it('debería manejar lista de fondos vacía', () => {
      const { result } = renderHook(() => useBuyFund([]))

      expect(result.current.selectedFund).toBeNull()

      act(() => {
        result.current.handleBuyFund(mockFunds[0])
      })

      expect(result.current.selectedFund).toBeNull()
    })
  })
})