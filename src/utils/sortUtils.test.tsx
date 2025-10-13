import { sortByName } from './sortUtils'
import { describe, it, expect } from 'vitest'

describe('sortUtils', () => {
  describe('sortByName', () => {
    it('debería ordenar items por nombre', () => {
      const items = [
        { id: '2', name: 'Zebra Fund' },
        { id: '1', name: 'Alpha Fund' },
        { id: '3', name: 'Beta Fund' }
      ]

      const sorted = sortByName(items)

      expect(sorted).toEqual([
        { id: '1', name: 'Alpha Fund' },
        { id: '3', name: 'Beta Fund' },
        { id: '2', name: 'Zebra Fund' }
      ])
    })

    it('debería usar nombre por defecto cuando no hay nombre', () => {
      const items = [
        { id: '2' },
        { id: '1', name: 'Alpha Fund' },
        { id: '3' }
      ]

      const sorted = sortByName(items)

      expect(sorted[0]).toEqual({ id: '1', name: 'Alpha Fund' })
      expect(sorted[1]).toEqual({ id: '2' })
      expect(sorted[2]).toEqual({ id: '3' })
    })

    it('debería usar función personalizada para obtener nombre', () => {
      const items = [
        { id: '2', customName: 'Zebra' },
        { id: '1', customName: 'Alpha' },
        { id: '3', customName: 'Beta' }
      ]

      const getDisplayName = (item: any) => item.customName
      const sorted = sortByName(items, getDisplayName)

      expect(sorted).toEqual([
        { id: '1', customName: 'Alpha' },
        { id: '3', customName: 'Beta' },
        { id: '2', customName: 'Zebra' }
      ])
    })

    it('debería manejar ordenación numérica en nombres', () => {
      const items = [
        { id: '1', name: 'Fund 10' },
        { id: '2', name: 'Fund 2' },
        { id: '3', name: 'Fund 1' }
      ]

      const sorted = sortByName(items)

      expect(sorted).toEqual([
        { id: '3', name: 'Fund 1' },
        { id: '2', name: 'Fund 2' },
        { id: '1', name: 'Fund 10' }
      ])
    })

    it('debería ser case insensitive', () => {
      const items = [
        { id: '1', name: 'zebra' },
        { id: '2', name: 'Alpha' },
        { id: '3', name: 'beta' }
      ]

      const sorted = sortByName(items)

      expect(sorted[0].name).toBe('Alpha')
      expect(sorted[1].name).toBe('beta')
      expect(sorted[2].name).toBe('zebra')
    })

    it('debería no mutar el array original', () => {
      const items = [
        { id: '2', name: 'Second' },
        { id: '1', name: 'First' }
      ]
      const originalItems = [...items]

      const sorted = sortByName(items)

      expect(items).toEqual(originalItems)
      expect(sorted).not.toBe(items)
    })

    it('debería manejar array vacío', () => {
      const sorted = sortByName([])
      expect(sorted).toEqual([])
    })
  })
})