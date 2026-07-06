import { useState } from 'react'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'
import { locationService } from '../services/locationService'
import type { CreateLocationPayload, LocationDetails } from '../types/location'

interface CreateLocationState {
  isLoading: boolean
  errorMessage: string
  create: (payload: CreateLocationPayload) => Promise<LocationDetails>
}

// Hook de criação: expõe uma função create e controla loading/erro do botão de salvar.
export function useCreateLocation(): CreateLocationState {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Envia o payload para o backend; quem chama decide quando recarregar a tela.
  async function create(payload: CreateLocationPayload) {
    setIsLoading(true)
    setErrorMessage('')

    try {
      return await locationService.createLocation(payload)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    errorMessage,
    create,
  }
}
