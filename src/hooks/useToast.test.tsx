import { renderHook, act } from '@testing-library/react'
import { useToast } from './useToast'
import { describe, it, expect } from 'vitest'

describe('useToast Hook', () => {
  describe('Estado inicial', () => {
    it('debería tener el estado inicial correcto', () => {
      const { result } = renderHook(() => useToast())

      expect(result.current.toast).toEqual({
        message: '',
        type: 'success',
        isVisible: false
      })
      expect(typeof result.current.showSuccess).toBe('function')
      expect(typeof result.current.showError).toBe('function')
      expect(typeof result.current.hideToast).toBe('function')
    })
  })

  describe('showSuccess', () => {
    it('debería mostrar un toast de éxito', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showSuccess('Operación exitosa')
      })

      expect(result.current.toast).toEqual({
        message: 'Operación exitosa',
        type: 'success',
        isVisible: true
      })
    })
  })

  describe('showError', () => {
    it('debería mostrar un toast de error', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showError('Error en la operación')
      })

      expect(result.current.toast).toEqual({
        message: 'Error en la operación',
        type: 'error',
        isVisible: true
      })
    })
  })

  describe('hideToast', () => {
    it('debería ocultar el toast manualmente', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showSuccess('Test message')
      })

      expect(result.current.toast.isVisible).toBe(true)

      act(() => {
        result.current.hideToast()
      })

      expect(result.current.toast.isVisible).toBe(false)
    })
  })

  describe('Múltiples toasts consecutivos', () => {
    it('debería reemplazar el toast anterior con uno nuevo', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.showSuccess('Primer mensaje')
      })

      expect(result.current.toast.message).toBe('Primer mensaje')

      act(() => {
        result.current.showError('Segundo mensaje')
      })

      expect(result.current.toast).toEqual({
        message: 'Segundo mensaje',
        type: 'error',
        isVisible: true
      })
    })
  })
})