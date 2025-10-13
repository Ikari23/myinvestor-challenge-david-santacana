import { createFundsTableMenuOptions, createPortfolioMenuOptions } from './menuUtils'
import { describe, it, expect, vi } from 'vitest'
import type { Fund } from '../types/funds'

const mockFund: Fund = {
  id: '1',
  name: 'Test Fund',
  category: 'GLOBAL',
  currency: 'EUR',
  value: 100,
  profitability: {
    YTD: 5.2,
    oneYear: 12.8,
    threeYears: 8.5,
    fiveYears: 6.3
  }
}

const mockPortfolioFund = {
  id: '1',
  name: 'Portfolio Fund'
}

describe('menuUtils', () => {
  describe('createFundsTableMenuOptions', () => {
    it('debería crear opciones de menú correctas para tabla de fondos', () => {
      const onBuy = vi.fn()
      const onViewDetail = vi.fn()

      const options = createFundsTableMenuOptions(mockFund, onBuy, onViewDetail)

      expect(options).toHaveLength(2)
      expect(options[0]).toEqual({
        id: 'buy',
        label: 'Comprar',
        icon: '→',
        action: expect.any(Function)
      })
      expect(options[1]).toEqual({
        id: 'view-detail',
        label: 'Ver detalle',
        icon: '👁',
        action: expect.any(Function)
      })
    })

    it('debería ejecutar la acción de comprar correctamente', () => {
      const onBuy = vi.fn()
      const onViewDetail = vi.fn()

      const options = createFundsTableMenuOptions(mockFund, onBuy, onViewDetail)
      options[0].action()

      expect(onBuy).toHaveBeenCalledWith(mockFund)
      expect(onBuy).toHaveBeenCalledTimes(1)
    })

    it('debería ejecutar la acción de ver detalle correctamente', () => {
      const onBuy = vi.fn()
      const onViewDetail = vi.fn()

      const options = createFundsTableMenuOptions(mockFund, onBuy, onViewDetail)
      options[1].action()

      expect(onViewDetail).toHaveBeenCalledWith(mockFund)
      expect(onViewDetail).toHaveBeenCalledTimes(1)
    })
  })

  describe('createPortfolioMenuOptions', () => {
    it('debería crear opciones de menú correctas para portfolio', () => {
      const actions = {
        onBuy: vi.fn(),
        onSell: vi.fn(),
        onTransfer: vi.fn(),
        onViewDetail: vi.fn()
      }

      const options = createPortfolioMenuOptions(mockPortfolioFund, actions)

      expect(options).toHaveLength(4)
      expect(options[0]).toEqual({
        id: 'buy',
        label: 'Comprar',
        icon: '→',
        action: expect.any(Function)
      })
      expect(options[1]).toEqual({
        id: 'sell',
        label: 'Vender',
        icon: '←',
        action: expect.any(Function)
      })
      expect(options[2]).toEqual({
        id: 'transfer',
        label: 'Traspasar',
        icon: '⤴',
        action: expect.any(Function)
      })
      expect(options[3]).toEqual({
        id: 'view-detail',
        label: 'Ver detalle',
        icon: '◉',
        action: expect.any(Function)
      })
    })

    it('debería ejecutar todas las acciones correctamente', () => {
      const actions = {
        onBuy: vi.fn(),
        onSell: vi.fn(),
        onTransfer: vi.fn(),
        onViewDetail: vi.fn()
      }

      const options = createPortfolioMenuOptions(mockPortfolioFund, actions)

      options[0].action()
      expect(actions.onBuy).toHaveBeenCalledWith(mockPortfolioFund)

      options[1].action()
      expect(actions.onSell).toHaveBeenCalledWith(mockPortfolioFund)

      options[2].action()
      expect(actions.onTransfer).toHaveBeenCalledWith(mockPortfolioFund)

      options[3].action()
      expect(actions.onViewDetail).toHaveBeenCalledWith(mockPortfolioFund)

      expect(actions.onBuy).toHaveBeenCalledTimes(1)
      expect(actions.onSell).toHaveBeenCalledTimes(1)
      expect(actions.onTransfer).toHaveBeenCalledTimes(1)
      expect(actions.onViewDetail).toHaveBeenCalledTimes(1)
    })
  })
})