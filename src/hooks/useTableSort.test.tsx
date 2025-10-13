import { renderHook, act } from '@testing-library/react'
import { useTableSort } from './useTableSort'
import { describe, it, expect, vi } from 'vitest'

const mockData = [
  { id: '1', name: 'Charlie', value: 100, category: 'A' },
  { id: '2', name: 'Alpha', value: 200, category: 'B' },
  { id: '3', name: 'Beta', value: 150, category: 'A' },
  { id: '4', name: 'Delta', value: 50, category: 'C' }
]

describe('useTableSort Hook', () => {
  describe('Estado inicial', () => {
    it('debería tener estado inicial correcto', () => {
      const { result } = renderHook(() => useTableSort(mockData as any))

      expect(result.current.sortState).toEqual({
        column: null,
        direction: null
      })
      expect(result.current.sortedData).toEqual(mockData)
      expect(typeof result.current.handleSort).toBe('function')
    })

    it('debería manejar datos vacíos', () => {
      const { result } = renderHook(() => useTableSort([]))

      expect(result.current.sortedData).toEqual([])
    })
  })

  describe('Ordenamiento por string', () => {
    it('debería ordenar por nombre ascendente', () => {
      const { result } = renderHook(() => useTableSort(mockData as any))

      act(() => {
        result.current.handleSort('name')
      })

      expect(result.current.sortState.column).toBe('name')
      expect(result.current.sortState.direction).toBe('asc')
      expect(result.current.sortedData[0]?.name).toBe('Alpha')
      expect(result.current.sortedData[1]?.name).toBe('Beta')
      expect(result.current.sortedData[2]?.name).toBe('Charlie')
      expect(result.current.sortedData[3]?.name).toBe('Delta')
    })

    it('debería cambiar a descendente en segunda invocación', () => {
      const { result } = renderHook(() => useTableSort(mockData as any))

      act(() => {
        result.current.handleSort('name')
      })

      act(() => {
        result.current.handleSort('name')
      })

      expect(result.current.sortState.direction).toBe('desc')
      expect(result.current.sortedData[0]?.name).toBe('Delta')
      expect(result.current.sortedData[1]?.name).toBe('Charlie')
      expect(result.current.sortedData[2]?.name).toBe('Beta')
      expect(result.current.sortedData[3]?.name).toBe('Alpha')
    })

    it('debería resetear a null en tercera invocación', () => {
      const { result } = renderHook(() => useTableSort(mockData as any))

      act(() => {
        result.current.handleSort('name')
      })

      act(() => {
        result.current.handleSort('name')
      })

      act(() => {
        result.current.handleSort('name')
      })

      expect(result.current.sortState.column).toBe(null)
      expect(result.current.sortState.direction).toBe(null)
      expect(result.current.sortedData).toEqual(mockData)
    })
  })

  describe('Ordenamiento por número', () => {
    it('debería ordenar valores numéricos correctamente', () => {
      const { result } = renderHook(() => useTableSort(mockData as any))

      act(() => {
        result.current.handleSort('value')
      })

      expect(result.current.sortedData[0]?.value).toBe(50)
      expect(result.current.sortedData[1]?.value).toBe(100)
      expect(result.current.sortedData[2]?.value).toBe(150)
      expect(result.current.sortedData[3]?.value).toBe(200)
    })

    it('debería ordenar valores numéricos descendente', () => {
      const { result } = renderHook(() => useTableSort(mockData as any))

      act(() => {
        result.current.handleSort('value')
      })

      act(() => {
        result.current.handleSort('value')
      })

      expect(result.current.sortedData[0]?.value).toBe(200)
      expect(result.current.sortedData[1]?.value).toBe(150)
      expect(result.current.sortedData[2]?.value).toBe(100)
      expect(result.current.sortedData[3]?.value).toBe(50)
    })
  })

  describe('Múltiples columnas', () => {
    it('debería cambiar de columna correctamente', () => {
      const { result } = renderHook(() => useTableSort(mockData as any))

      act(() => {
        result.current.handleSort('name')
      })

      expect(result.current.sortState.column).toBe('name')

      act(() => {
        result.current.handleSort('value')
      })

      expect(result.current.sortState.column).toBe('value')
      expect(result.current.sortState.direction).toBe('asc')
    })

    it('debería mantener el orden cuando cambian los datos', () => {
      const { result, rerender } = renderHook(
        ({ data }) => useTableSort(data as any),
        { initialProps: { data: mockData } }
      )

      act(() => {
        result.current.handleSort('name')
      })

      const newData = [...mockData, { id: '5', name: 'Echo', value: 300, category: 'D' }]

      rerender({ data: newData })

      expect(result.current.sortState.column).toBe('name')
      expect(result.current.sortState.direction).toBe('asc')
      expect(result.current.sortedData[0]?.name).toBe('Alpha')
      expect(result.current.sortedData[4]?.name).toBe('Echo')
    })
  })

  describe('Valores edge cases', () => {
    it('debería manejar valores null/undefined', () => {
      const dataWithNulls = [
        { id: '1', name: 'Alpha', value: null },
        { id: '2', name: null, value: 100 },
        { id: '3', name: 'Beta', value: 50 }
      ]

      const { result } = renderHook(() => useTableSort(dataWithNulls as any))

      act(() => {
        result.current.handleSort('name')
      })

      expect(result.current.sortedData).toHaveLength(3)
    })

    it('debería manejar strings con números', () => {
      const mixedData = [
        { id: '1', code: '10' },
        { id: '2', code: '2' },
        { id: '3', code: '1' }
      ]

      const { result } = renderHook(() => useTableSort(mixedData as any))

      act(() => {
        result.current.handleSort('code' as any)
      })

      expect((result.current.sortedData[0] as any)?.code).toBe('1')
      expect((result.current.sortedData[1] as any)?.code).toBe('10')
      expect((result.current.sortedData[2] as any)?.code).toBe('2')
    })
  })
})