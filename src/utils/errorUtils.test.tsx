import { extractErrorMessage } from './errorUtils'
import { describe, it, expect, vi } from 'vitest'
import axios, { AxiosError } from 'axios'

describe('errorUtils', () => {
  describe('extractErrorMessage', () => {
    it('debería extraer mensaje de error de respuesta Axios válida', () => {
      const mockAxiosError = {
        isAxiosError: true,
        response: {
          data: {
            error: 'Error específico del API'
          },
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {
            headers: {} as any
          } as any,
          request: {}
        },
        toJSON: vi.fn(),
        name: 'AxiosError',
        message: 'Error'
      } as AxiosError

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const result = extractErrorMessage(mockAxiosError)
      expect(result).toBe('Error específico del API')

      vi.restoreAllMocks()
    })

    it('debería devolver mensaje por defecto para error Axios sin mensaje específico', () => {
      const mockAxiosError = {
        isAxiosError: true,
        response: {
          data: {},
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {
            headers: {} as any
          } as any,
          request: {}
        },
        toJSON: vi.fn(),
        name: 'AxiosError',
        message: 'Error'
      } as AxiosError

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const result = extractErrorMessage(mockAxiosError)
      expect(result).toBe('Error inesperado')

      vi.restoreAllMocks()
    })

    it('debería usar mensaje por defecto personalizado', () => {
      const error = new Error('Network error')
      const customDefault = 'Error personalizado'

      const result = extractErrorMessage(error, customDefault)
      expect(result).toBe(customDefault)
    })

    it('debería manejar AxiosError sin response', () => {
      const mockAxiosError = {
        isAxiosError: true,
        response: undefined,
        toJSON: vi.fn(),
        name: 'AxiosError',
        message: 'Network Error'
      } as unknown as AxiosError

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const result = extractErrorMessage(mockAxiosError)
      expect(result).toBe('Error inesperado')

      vi.restoreAllMocks()
    })

    it('debería manejar valores null/undefined', () => {
      expect(extractErrorMessage(null)).toBe('Error inesperado')
      expect(extractErrorMessage(undefined)).toBe('Error inesperado')
    })

    it('debería manejar tipos primitivos', () => {
      expect(extractErrorMessage('string error')).toBe('Error inesperado')
      expect(extractErrorMessage(123)).toBe('Error inesperado')
      expect(extractErrorMessage(true)).toBe('Error inesperado')
    })

    it('debería manejar objetos sin propiedad response', () => {
      const mockObject = {
        someProperty: 'value',
        anotherProperty: 123
      }

      const result = extractErrorMessage(mockObject)
      expect(result).toBe('Error inesperado')
    })
  })
})