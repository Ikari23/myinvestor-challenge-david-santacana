import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navigation } from './Navigation'
import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockUseLocation = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  }
})

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Navigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado básico', () => {
    it('debería renderizar la marca MyInvestor', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' })

      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      )

      expect(screen.getByText('MyInvestor')).toBeInTheDocument()
    })

    it('debería renderizar todos los enlaces de navegación', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' })

      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      )

      expect(screen.getByRole('link', { name: 'Fondos' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Mi Cartera' })).toBeInTheDocument()

      expect(screen.getByRole('link', { name: 'Fondos' })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: 'Mi Cartera' })).toHaveAttribute('href', '/portfolio')
    })

    it('debería tener el elemento nav con rol de navegación', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' })

      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      )

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  describe('Estado activo de enlaces', () => {
    it('debería marcar como activo el enlace "Fondos" cuando está en la ruta "/"', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' })

      const { container } = render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      )

      const fondosLink = screen.getByRole('link', { name: 'Fondos' })
      const carteraLink = screen.getByRole('link', { name: 'Mi Cartera' })

      expect(fondosLink.className).toMatch(/active/)
      expect(carteraLink.className).not.toMatch(/active/)
    })

    it('debería marcar como activo el enlace "Mi Cartera" cuando está en la ruta "/portfolio"', () => {
      mockUseLocation.mockReturnValue({ pathname: '/portfolio' })

      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      )

      const fondosLink = screen.getByRole('link', { name: 'Fondos' })
      const carteraLink = screen.getByRole('link', { name: 'Mi Cartera' })

      expect(carteraLink.className).toMatch(/active/)
      expect(fondosLink.className).not.toMatch(/active/)
    })

    it('debería no marcar ningún enlace como activo en una ruta desconocida', () => {
      mockUseLocation.mockReturnValue({ pathname: '/unknown-route' })

      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      )

      const fondosLink = screen.getByRole('link', { name: 'Fondos' })
      const carteraLink = screen.getByRole('link', { name: 'Mi Cartera' })

      expect(fondosLink.className).not.toMatch(/active/)
      expect(carteraLink.className).not.toMatch(/active/)
    })
  })

  describe('Estructura y accesibilidad', () => {
    it('debería tener la estructura HTML correcta', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' })

      const { container } = render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      )

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()

      expect(container.querySelector('[class*="container"]')).toBeInTheDocument()
      expect(container.querySelector('[class*="brand"]')).toBeInTheDocument()
      expect(container.querySelector('[class*="links"]')).toBeInTheDocument()
    })

    it('debería ser accesible con lectores de pantalla', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' })

      render(
        <NavigationWrapper>
          <Navigation />
        </NavigationWrapper>
      )

      const fondosLink = screen.getByRole('link', { name: 'Fondos' })
      const carteraLink = screen.getByRole('link', { name: 'Mi Cartera' })

      expect(fondosLink).toHaveAccessibleName('Fondos')
      expect(carteraLink).toHaveAccessibleName('Mi Cartera')
    })
  })
})