import {
  getFundName,
  getFundCurrency,
  groupPortfolioByCategory,
  getCategoryDisplayName,
  calculateFundQuantity,
  findFundById,
  calculateCategoryTotal
} from './fundUtils'
import { describe, it, expect } from 'vitest'
import type { Fund } from '../types/funds'

const mockFunds: Fund[] = [
  {
    id: '1',
    name: 'Fondo Global Sostenible',
    category: 'GLOBAL',
    symbol: 'FGS',
    currency: 'EUR',
    value: 125.45,
    profitability: {
      YTD: 5.2,
      oneYear: 12.8,
      threeYears: 8.5,
      fiveYears: 6.3
    }
  },
  {
    id: '2',
    name: 'Fondo Tech USA',
    category: 'TECH',
    symbol: 'FTU',
    currency: 'USD',
    value: 89.30,
    profitability: {
      YTD: 2.1,
      oneYear: 3.4,
      threeYears: 2.8,
      fiveYears: 3.1
    }
  }
]

describe('fundUtils', () => {
  describe('getFundName', () => {
    it('debería devolver el nombre del fondo si existe', () => {
      const fund = { id: '1', name: 'Mi Fondo' }
      expect(getFundName(fund)).toBe('Mi Fondo')
    })

    it('debería devolver fallback si no hay nombre', () => {
      const fund = { id: '1' }
      expect(getFundName(fund, 'Fallback')).toBe('Fallback')
    })

    it('debería devolver nombre por defecto si no hay nombre ni fallback', () => {
      const fund = { id: '1' }
      expect(getFundName(fund)).toBe('Fondo 1')
    })
  })

  describe('calculateFundQuantity', () => {
    it('debería calcular correctamente la cantidad de fondos', () => {
      expect(calculateFundQuantity(1000, 100)).toBe(10)
      expect(calculateFundQuantity(500, 50)).toBe(10)
      expect(calculateFundQuantity(100, 200)).toBe(0.5)
    })

    it('debería manejar división por cero', () => {
      expect(calculateFundQuantity(100, 0)).toBe(Infinity)
    })
  })

  describe('findFundById', () => {
    it('debería encontrar un fondo por ID', () => {
      const result = findFundById(mockFunds, '1')
      expect(result).toEqual(mockFunds[0])
    })

    it('debería devolver undefined si no encuentra el fondo', () => {
      const result = findFundById(mockFunds, '999')
      expect(result).toBeUndefined()
    })

    it('debería manejar array vacío', () => {
      const result = findFundById([], '1')
      expect(result).toBeUndefined()
    })
  })

  describe('getFundCurrency', () => {
    it('debería devolver la moneda del fondo', () => {
      expect(getFundCurrency(mockFunds, '1')).toBe('EUR')
      expect(getFundCurrency(mockFunds, '2')).toBe('USD')
    })

    it('debería devolver moneda por defecto si no encuentra el fondo', () => {
      expect(getFundCurrency(mockFunds, '999')).toBe('EUR')
    })

    it('debería devolver moneda personalizada por defecto', () => {
      expect(getFundCurrency(mockFunds, '999', 'USD')).toBe('USD')
    })
  })

  describe('getCategoryDisplayName', () => {
    it('debería mapear categorías conocidas', () => {
      expect(getCategoryDisplayName('GLOBAL')).toBe('Global')
      expect(getCategoryDisplayName('TECH')).toBe('Tecnología')
      expect(getCategoryDisplayName('HEALTH')).toBe('Salud')
      expect(getCategoryDisplayName('MONEY_MARKET')).toBe('Mercado Monetario')
    })

    it('debería devolver la categoría original para categorías desconocidas', () => {
      expect(getCategoryDisplayName('UNKNOWN')).toBe('UNKNOWN')
      expect(getCategoryDisplayName('CUSTOM_CATEGORY')).toBe('CUSTOM_CATEGORY')
    })
  })

  describe('groupPortfolioByCategory', () => {
    it('debería agrupar items por categoría', () => {
      const portfolioItems = [
        { id: '1', totalValue: 1000 },
        { id: '2', totalValue: 500 },
        { id: '999', totalValue: 200 }
      ]

      const result = groupPortfolioByCategory(portfolioItems, mockFunds)

      expect(result).toEqual({
        'GLOBAL': [{ id: '1', totalValue: 1000 }],
        'TECH': [{ id: '2', totalValue: 500 }],
        'OTHER': [{ id: '999', totalValue: 200 }]
      })
    })

    it('debería manejar array vacío', () => {
      const result = groupPortfolioByCategory([], mockFunds)
      expect(result).toEqual({})
    })
  })

  describe('calculateCategoryTotal', () => {
    it('debería calcular el total de una categoría', () => {
      const items = [
        { totalValue: 1000 },
        { totalValue: 500 },
        { totalValue: 300 }
      ]

      expect(calculateCategoryTotal(items)).toBe(1800)
    })

    it('debería manejar array vacío', () => {
      expect(calculateCategoryTotal([])).toBe(0)
    })

    it('debería manejar valores negativos', () => {
      const items = [
        { totalValue: 1000 },
        { totalValue: -200 }
      ]

      expect(calculateCategoryTotal(items)).toBe(800)
    })
  })
})