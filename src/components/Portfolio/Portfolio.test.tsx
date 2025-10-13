import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Portfolio } from './Portfolio';
import type { Fund } from '../../types/funds';

vi.mock('../../hooks/useFunds', () => ({
  usePortfolio: vi.fn(),
  useFunds: vi.fn()
}));

vi.mock('../../hooks/useToast', () => ({
  useToast: vi.fn()
}));

vi.mock('../ActionMenu/ActionMenu', () => ({
  ActionMenu: ({ fund, ariaLabel }: { fund: any; ariaLabel: string }) => (
    <button data-testid={`action-menu-${fund.id}`} aria-label={ariaLabel}>
      Menu for {fund.name}
    </button>
  )
}));

vi.mock('../Toast/Toast', () => ({
  Toast: ({ message, isVisible }: { message: string; isVisible: boolean }) =>
    isVisible ? <div data-testid="toast">{message}</div> : null
}));

vi.mock('../../utils/numberUtils', () => ({
  formatCurrency: (value: number, currency: string) => {
    if (currency === 'EUR') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    }
    return `${value} ${currency}`;
  }
}));

vi.mock('../../utils/fundUtils', () => ({
  getFundCurrency: () => 'EUR',
  getFundName: (item: any) => item.name || `Fund ${item.id}`,
  groupPortfolioByCategory: (portfolio: any[], funds: any[]) => ({
    'Renta Variable': portfolio.filter(item => item.id === '1'),
    'Renta Fija': portfolio.filter(item => item.id === '2')
  }),
  getCategoryDisplayName: (category: string) => category
}));

vi.mock('../../utils/sortUtils', () => ({
  sortByName: (items: any[]) => items
}));

vi.mock('../../utils/menuUtils', () => ({
  createPortfolioMenuOptions: () => []
}));

import { usePortfolio, useFunds } from '../../hooks/useFunds';
import { useToast } from '../../hooks/useToast';

const mockUsePortfolio = vi.mocked(usePortfolio);
const mockUseFunds = vi.mocked(useFunds);
const mockUseToast = vi.mocked(useToast);

const mockPortfolioData = [
  {
    id: '1',
    name: 'Fondo Renta Variable',
    quantity: 10,
    totalValue: 1000
  },
  {
    id: '2',
    name: 'Fondo Renta Fija',
    quantity: 5,
    totalValue: 500
  }
];

const mockFundsData: Fund[] = [
  {
    id: '1',
    name: 'Fondo A',
    category: 'GLOBAL',
    symbol: 'FA',
    currency: 'EUR',
    value: 100,
    profitability: {
      YTD: 5.2,
      oneYear: 12.8,
      threeYears: 8.5,
      fiveYears: 6.3
    }
  },
  {
    id: '2',
    name: 'Fondo B',
    category: 'TECH',
    symbol: 'FB',
    currency: 'USD',
    value: 200,
    profitability: {
      YTD: 2.1,
      oneYear: 3.4,
      threeYears: 2.8,
      fiveYears: 3.1
    }
  }
];

describe('Portfolio Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseToast.mockReturnValue({
      toast: { message: '', type: 'success', isVisible: false },
      showToast: vi.fn(),
      showSuccess: vi.fn(),
      showError: vi.fn(),
      hideToast: vi.fn()
    });
  });

  describe('Estados de carga y error', () => {
    it('debería mostrar el estado de carga cuando portfolioLoading es true', () => {
      mockUsePortfolio.mockReturnValue({
        portfolio: [],
        totalPortfolioValue: 0,
        loading: true,
        error: null,
        refetch: vi.fn()
      });

      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: null,
        totalFunds: 0,
        refetch: vi.fn()
      });

      render(<Portfolio />);

      expect(screen.getByText('Mi Cartera')).toBeInTheDocument();
      expect(screen.getByText('Cargando cartera...')).toBeInTheDocument();
      expect(screen.queryByText('Tu cartera está vacía')).not.toBeInTheDocument();
    });

    it('debería mostrar el estado de carga cuando fundsLoading es true', () => {
      mockUsePortfolio.mockReturnValue({
        portfolio: [],
        totalPortfolioValue: 0,
        loading: false,
        error: null,
        refetch: vi.fn()
      });

      mockUseFunds.mockReturnValue({
        funds: [],
        loading: true,
        error: null,
        totalFunds: 0,
        refetch: vi.fn()
      });

      render(<Portfolio />);

      expect(screen.getByText('Cargando cartera...')).toBeInTheDocument();
    });

    it('debería mostrar el estado de error con botón reintentar', () => {
      const mockRefetch = vi.fn();

      mockUsePortfolio.mockReturnValue({
        portfolio: [],
        totalPortfolioValue: 0,
        loading: false,
        error: 'Error al cargar la cartera',
        refetch: mockRefetch
      });

      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: null,
        totalFunds: 0,
        refetch: vi.fn()
      });

      render(<Portfolio />);

      expect(screen.getByText('❌ Error al cargar la cartera')).toBeInTheDocument();

      const retryButton = screen.getByText('Reintentar');
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('debería mostrar el estado vacío cuando no hay fondos en cartera', () => {
      mockUsePortfolio.mockReturnValue({
        portfolio: [],
        totalPortfolioValue: 0,
        loading: false,
        error: null,
        refetch: vi.fn()
      });

      mockUseFunds.mockReturnValue({
        funds: mockFundsData,
        loading: false,
        error: null,
        totalFunds: 2,
        refetch: vi.fn()
      });

      render(<Portfolio />);

      expect(screen.getByText('Tu cartera está vacía')).toBeInTheDocument();
      expect(screen.getByText('Compra fondos para ver tus inversiones aquí')).toBeInTheDocument();
      expect(screen.getByText('📊')).toBeInTheDocument();
    });
  });

  describe('Renderizado con datos', () => {
    beforeEach(() => {
      mockUsePortfolio.mockReturnValue({
        portfolio: mockPortfolioData,
        totalPortfolioValue: 1500,
        loading: false,
        error: null,
        refetch: vi.fn()
      });

      mockUseFunds.mockReturnValue({
        funds: mockFundsData,
        loading: false,
        error: null,
        totalFunds: 2,
        refetch: vi.fn()
      });
    });

    it('debería renderizar la cartera con fondos agrupados por categoría', () => {
      render(<Portfolio />);

      expect(screen.getByText('Mi Cartera')).toBeInTheDocument();
      expect(screen.getByText('Renta Variable')).toBeInTheDocument();
      expect(screen.getByText('Renta Fija')).toBeInTheDocument();
      expect(screen.getByText('Fondo Renta Variable')).toBeInTheDocument();
      expect(screen.getByText('Fondo Renta Fija')).toBeInTheDocument();
    });

    it('debería mostrar valores formateados correctamente', () => {
      render(<Portfolio />);

      expect(screen.getByText('€1,000.00')).toBeInTheDocument();
      expect(screen.getByText('€500.00')).toBeInTheDocument();

      const priceElements = screen.getAllByText('€100.00');
      expect(priceElements).toHaveLength(2);
    });

    it('debería renderizar ActionMenu para cada fondo', () => {
      render(<Portfolio />);

      expect(screen.getByTestId('action-menu-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-menu-2')).toBeInTheDocument();
      expect(screen.getByLabelText('Opciones para Fondo Renta Variable')).toBeInTheDocument();
      expect(screen.getByLabelText('Opciones para Fondo Renta Fija')).toBeInTheDocument();
    });
  });

  describe('Integración con Toast', () => {
    it('debería mostrar Toast cuando isVisible es true', () => {
      mockUseToast.mockReturnValue({
        toast: { message: 'Operación exitosa', type: 'success', isVisible: true },
        showToast: vi.fn(),
        showSuccess: vi.fn(),
        showError: vi.fn(),
        hideToast: vi.fn()
      });

      mockUsePortfolio.mockReturnValue({
        portfolio: mockPortfolioData,
        totalPortfolioValue: 1500,
        loading: false,
        error: null,
        refetch: vi.fn()
      });

      mockUseFunds.mockReturnValue({
        funds: mockFundsData,
        loading: false,
        error: null,
        totalFunds: 2,
        refetch: vi.fn()
      });

      render(<Portfolio />);

      expect(screen.getByTestId('toast')).toBeInTheDocument();
      expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
    });

    it('debería NO mostrar Toast cuando isVisible es false', () => {
      mockUseToast.mockReturnValue({
        toast: { message: 'Mensaje oculto', type: 'success', isVisible: false },
        showToast: vi.fn(),
        showSuccess: vi.fn(),
        showError: vi.fn(),
        hideToast: vi.fn()
      });

      mockUsePortfolio.mockReturnValue({
        portfolio: [],
        totalPortfolioValue: 0,
        loading: false,
        error: null,
        refetch: vi.fn()
      });

      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: null,
        totalFunds: 0,
        refetch: vi.fn()
      });

      render(<Portfolio />);

      expect(screen.queryByTestId('toast')).not.toBeInTheDocument();
      expect(screen.queryByText('Mensaje oculto')).not.toBeInTheDocument();
    });
  });

  describe('Manejo de errores', () => {
    it('debería priorizar error de portfolio sobre error de funds', () => {
      mockUsePortfolio.mockReturnValue({
        portfolio: [],
        totalPortfolioValue: 0,
        loading: false,
        error: 'Error de portfolio',
        refetch: vi.fn()
      });

      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: 'Error de funds',
        totalFunds: 0,
        refetch: vi.fn()
      });

      render(<Portfolio />);

      expect(screen.getByText('❌ Error de portfolio')).toBeInTheDocument();
      expect(screen.queryByText('❌ Error de funds')).not.toBeInTheDocument();
    });

    it('debería mostrar error de funds cuando no hay error de portfolio', () => {
      mockUsePortfolio.mockReturnValue({
        portfolio: [],
        totalPortfolioValue: 0,
        loading: false,
        error: null,
        refetch: vi.fn()
      });

      mockUseFunds.mockReturnValue({
        funds: [],
        loading: false,
        error: 'Error de funds',
        totalFunds: 0,
        refetch: vi.fn()
      });

      render(<Portfolio />);

      expect(screen.getByText('❌ Error de funds')).toBeInTheDocument();
    });
  });
});