import { useCallback, useEffect, useState } from 'react'
import { locationService } from '../services/locationService'
import type { LocationDetails } from '../types/location'
import type { RequestState } from '../../../shared/hooks/requestState'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

// Hook do detalhe: recebe o ID da rota e busca um único equipamento.
export function useLocationDetails(locationId?: string): RequestState<LocationDetails> {
  const [data, setData] = useState<LocationDetails>()
  const [isLoading, setIsLoading] = useState(Boolean(locationId))
  const [errorMessage, setErrorMessage] = useState('')

  // Se não houver ID, não existe o que buscar; se houver, chamamos o service.
  const loadLocationDetails = useCallback(async () => {
    if (!locationId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await locationService.getLocationById(locationId)
      setData(result)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [locationId])

  // Busca os dados de uma localização específica para a tela de detalhes.
  useEffect(() => {
    void Promise.resolve().then(loadLocationDetails)
  }, [loadLocationDetails])

  return {
    data,
    isLoading,
    errorMessage,
    reload: loadLocationDetails,
  }
}
