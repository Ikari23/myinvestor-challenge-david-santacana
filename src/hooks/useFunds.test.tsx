import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFunds } from './useFunds'
import axios from 'axios'
import { vi } from 'vitest'
import React from 'react'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  return Wrapper
}

describe('useFunds Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estados básicos del hook', () => {
    it('debería devolver estado inicial de loading', () => {
      mockedAxios.get.mockImplementation(() => new Promise(() => { }))

      const { result } = renderHook(() => useFunds(), {
        wrapper: createWrapper(),
      })

      expect(result.current.loading).toBe(true)
      expect(result.current.funds).toEqual([])
      expect(result.current.totalFunds).toBe(0)
      expect(result.current.error).toBeNull()
      expect(typeof result.current.refetch).toBe('function')
    })

    it('debería devolver fondos correctamente cuando la petición es exitosa', async () => {
      const mockResponse = {
        data: {
          pagination: {
            page: 1,
            limit: 1000,
            totalFunds: 2,
            totalPages: 1
          },
          data: [
            {
              id: '1',
              name: 'Fondo Test 1',
              category: 'Renta Variable',
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
              name: 'Fondo Test 2',
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
        }
      }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFunds(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.funds).toEqual(mockResponse.data.data)
      expect(result.current.totalFunds).toBe(2)
      expect(result.current.error).toBeNull()
    })

    it('debería manejar errores correctamente cuando la petición falla', async () => {
      const mockError = new Error('Error de conexión')
      mockedAxios.get.mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useFunds(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBeTruthy()
      expect(result.current.funds).toEqual([])
      expect(result.current.totalFunds).toBe(0)
    })

    it('debería manejar respuesta vacía correctamente', async () => {
      const mockResponse = {
        data: {
          pagination: {
            page: 1,
            limit: 1000,
            totalFunds: 0,
            totalPages: 0
          },
          data: []
        }
      }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFunds(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.funds).toEqual([])
      expect(result.current.totalFunds).toBe(0)
      expect(result.current.error).toBeNull()
    })

    it('debería manejar respuesta malformada', async () => {
      const mockResponse = {
        data: {}
      }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFunds(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.funds).toEqual([])
      expect(result.current.totalFunds).toBe(0)
    })

    it('debería poder refetch los datos', async () => {
      const mockResponse = {
        data: {
          pagination: { page: 1, limit: 1000, totalFunds: 1, totalPages: 1 },
          data: [{ id: '1', name: 'Test Fund' }]
        }
      }

      mockedAxios.get.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useFunds(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      vi.clearAllMocks()
      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      await result.current.refetch()

      expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})