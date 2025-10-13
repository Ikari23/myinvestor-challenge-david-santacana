import { renderHook, act } from '@testing-library/react'
import { usePagination } from './usePagination'
import { describe, it, expect } from 'vitest'

const mockData = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
  { id: 6, name: 'Item 6' },
  { id: 7, name: 'Item 7' },
  { id: 8, name: 'Item 8' },
  { id: 9, name: 'Item 9' },
  { id: 10, name: 'Item 10' },
  { id: 11, name: 'Item 11' },
  { id: 12, name: 'Item 12' }
]

describe('usePagination Hook', () => {
  describe('Estado inicial', () => {
    it('debería inicializar con valores por defecto', () => {
      const { result } = renderHook(() => usePagination({ data: mockData }))

      expect(result.current.currentPage).toBe(1)
      expect(result.current.itemsPerPage).toBe(10)
      expect(result.current.totalPages).toBe(2)
      expect(result.current.paginatedData).toEqual(mockData.slice(0, 10))
    })

    it('debería aceptar itemsPerPage inicial personalizado', () => {
      const { result } = renderHook(() => usePagination({ data: mockData, initialItemsPerPage: 5 }))

      expect(result.current.itemsPerPage).toBe(5)
      expect(result.current.totalPages).toBe(3)
      expect(result.current.paginatedData).toEqual(mockData.slice(0, 5))
    })
  })

  describe('Cálculos de paginación', () => {
    it('debería calcular correctamente el total de páginas', () => {
      const { result } = renderHook(() => usePagination({ data: mockData, initialItemsPerPage: 5 }))
      expect(result.current.totalPages).toBe(3)

      const { result: result2 } = renderHook(() => usePagination({ data: mockData, initialItemsPerPage: 3 }))
      expect(result2.current.totalPages).toBe(4)
    })

    it('debería manejar datos vacíos', () => {
      const { result } = renderHook(() => usePagination({ data: [] }))

      expect(result.current.totalPages).toBe(0)
      expect(result.current.paginatedData).toEqual([])
    })

    it('debería manejar datos que caben en una sola página', () => {
      const smallData = [{ id: 1, name: 'Item 1' }]
      const { result } = renderHook(() => usePagination({ data: smallData, initialItemsPerPage: 10 }))

      expect(result.current.totalPages).toBe(1)
      expect(result.current.paginatedData).toEqual(smallData)
    })
  })

  describe('Navegación de páginas', () => {
    it('debería cambiar a la página especificada', () => {
      const { result } = renderHook(() => usePagination({ data: mockData, initialItemsPerPage: 5 }))

      act(() => {
        result.current.handlePageChange(2)
      })

      expect(result.current.currentPage).toBe(2)
      expect(result.current.paginatedData).toEqual(mockData.slice(5, 10))
    })

    it('debería cambiar a la página 3', () => {
      const { result } = renderHook(() => usePagination({ data: mockData, initialItemsPerPage: 4 }))

      act(() => {
        result.current.handlePageChange(3)
      })

      expect(result.current.currentPage).toBe(3)
      expect(result.current.paginatedData).toEqual(mockData.slice(8, 12))
    })
  })

  describe('Cambio de items por página', () => {
    it('debería cambiar el número de items por página', () => {
      const { result } = renderHook(() => usePagination({ data: mockData, initialItemsPerPage: 10 }))

      act(() => {
        result.current.handleItemsPerPageChange(5)
      })

      expect(result.current.itemsPerPage).toBe(5)
      expect(result.current.totalPages).toBe(3)
      expect(result.current.currentPage).toBe(1)
      expect(result.current.paginatedData).toEqual(mockData.slice(0, 5))
    })

    it('debería resetear a la página 1 cuando cambia itemsPerPage', () => {
      const { result } = renderHook(() => usePagination({ data: mockData, initialItemsPerPage: 5 }))

      act(() => {
        result.current.handlePageChange(2)
      })

      expect(result.current.currentPage).toBe(2)

      act(() => {
        result.current.handleItemsPerPageChange(3)
      })

      expect(result.current.currentPage).toBe(1)
      expect(result.current.itemsPerPage).toBe(3)
    })
  })

  describe('Casos extremos', () => {
    it('debería manejar itemsPerPage mayor que el total de datos', () => {
      const smallData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]
      const { result } = renderHook(() => usePagination({ data: smallData, initialItemsPerPage: 10 }))

      expect(result.current.totalPages).toBe(1)
      expect(result.current.paginatedData).toEqual(smallData)
    })
  })
})