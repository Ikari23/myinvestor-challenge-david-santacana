import { formatCurrency, formatNumber } from './numberUtils'
import { describe, it, expect } from 'vitest'

describe('numberUtils', () => {
  describe('formatCurrency', () => {
    it('debería manejar valores inválidos', () => {
      expect(formatCurrency(NaN, 'EUR')).toBe('-')
      expect(formatCurrency('invalid' as any, 'EUR')).toBe('-')
    })

    it('debería devolver una string válida para valores numéricos', () => {
      const result = formatCurrency(100, 'EUR')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('formatNumber', () => {
    it('debería manejar cero', () => {
      expect(formatNumber(0)).toBe('0,00')
    })

    it('debería respetar decimales especificados', () => {
      expect(formatNumber(10.5, 1)).toBe('10,5')
      expect(formatNumber(10.123, 3)).toBe('10,123')
      expect(formatNumber(10, 0)).toBe('10')
    })

    it('debería usar 2 decimales por defecto', () => {
      expect(formatNumber(10.5)).toBe('10,50')
    })

    it('debería manejar valores inválidos', () => {
      expect(formatNumber(NaN)).toBe('-')
      expect(formatNumber('invalid' as any)).toBe('-')
    })

    it('debería devolver una string válida para valores numéricos', () => {
      const result = formatNumber(1234.56)
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })
})