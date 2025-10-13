import { render, screen } from '@testing-library/react'
import { SortIcon } from './SortIcon'
import type { SortDirection } from '../../types/funds'

describe('SortIcon Component', () => {
  describe('Renderizado básico', () => {
    it('debería renderizar el SVG con las dos flechas', () => {
      const { container } = render(<SortIcon direction={null} />)

      const sortIcon = screen.getByRole('img', { hidden: true })
      expect(sortIcon).toBeInTheDocument()
      expect(sortIcon).toHaveAttribute('aria-hidden', 'true')

      const svg = sortIcon.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('focusable', 'false')
      expect(svg).toHaveAttribute('width', '8')
      expect(svg).toHaveAttribute('height', '12')
      expect(svg).toHaveAttribute('viewBox', '0 0 8 12')

      const paths = svg?.querySelectorAll('path')
      expect(paths).toHaveLength(2)
    })

    it('debería tener los atributos de accesibilidad correctos', () => {
      render(<SortIcon direction={null} />)

      const sortIcon = screen.getByRole('img', { hidden: true })
      expect(sortIcon).toHaveAttribute('role', 'img')
      expect(sortIcon).toHaveAttribute('aria-hidden', 'true')

      const svg = sortIcon.querySelector('svg')
      expect(svg).toHaveAttribute('focusable', 'false')
    })
  })

  describe('Estados de ordenamiento', () => {
    it('debería mostrar flecha ascendente activa cuando direction es "asc"', () => {
      const { container } = render(<SortIcon direction="asc" />)

      const arrowUp = container.querySelector('path[d="M4 1L6.5 4H1.5L4 1Z"]')
      const arrowDown = container.querySelector('path[d="M4 11L1.5 8H6.5L4 11Z"]')

      expect(arrowUp?.getAttribute('class')).toMatch(/arrowUp/)
      expect(arrowUp?.getAttribute('class')).toMatch(/active/)
      expect(arrowDown?.getAttribute('class')).toMatch(/arrowDown/)
      expect(arrowDown?.getAttribute('class')).not.toMatch(/active/)
    })

    it('debería mostrar flecha descendente activa cuando direction es "desc"', () => {
      const { container } = render(<SortIcon direction="desc" />)

      const arrowDown = container.querySelector('path[d="M4 11L1.5 8H6.5L4 11Z"]')
      const arrowUp = container.querySelector('path[d="M4 1L6.5 4H1.5L4 1Z"]')

      expect(arrowDown?.getAttribute('class')).toMatch(/arrowDown/)
      expect(arrowDown?.getAttribute('class')).toMatch(/active/)
      expect(arrowUp?.getAttribute('class')).toMatch(/arrowUp/)
      expect(arrowUp?.getAttribute('class')).not.toMatch(/active/)
    })

    it('debería no mostrar ninguna flecha activa cuando direction es null', () => {
      const { container } = render(<SortIcon direction={null} />)

      const arrowUp = container.querySelector('path[d="M4 1L6.5 4H1.5L4 1Z"]')
      const arrowDown = container.querySelector('path[d="M4 11L1.5 8H6.5L4 11Z"]')

      expect(arrowUp?.getAttribute('class')).toMatch(/arrowUp/)
      expect(arrowUp?.getAttribute('class')).not.toMatch(/active/)
      expect(arrowDown?.getAttribute('class')).toMatch(/arrowDown/)
      expect(arrowDown?.getAttribute('class')).not.toMatch(/active/)
    })
  })

  describe('Cambios de estado', () => {
    it('debería actualizar correctamente cuando cambia la dirección', () => {
      const { container, rerender } = render(<SortIcon direction={null} />)

      let arrowUp = container.querySelector('path[d="M4 1L6.5 4H1.5L4 1Z"]')
      let arrowDown = container.querySelector('path[d="M4 11L1.5 8H6.5L4 11Z"]')
      expect(arrowUp?.getAttribute('class')).not.toMatch(/active/)
      expect(arrowDown?.getAttribute('class')).not.toMatch(/active/)

      rerender(<SortIcon direction="asc" />)
      arrowUp = container.querySelector('path[d="M4 1L6.5 4H1.5L4 1Z"]')
      arrowDown = container.querySelector('path[d="M4 11L1.5 8H6.5L4 11Z"]')
      expect(arrowUp?.getAttribute('class')).toMatch(/active/)
      expect(arrowDown?.getAttribute('class')).not.toMatch(/active/)

      rerender(<SortIcon direction="desc" />)
      arrowUp = container.querySelector('path[d="M4 1L6.5 4H1.5L4 1Z"]')
      arrowDown = container.querySelector('path[d="M4 11L1.5 8H6.5L4 11Z"]')
      expect(arrowUp?.getAttribute('class')).not.toMatch(/active/)
      expect(arrowDown?.getAttribute('class')).toMatch(/active/)
    })
  })
})