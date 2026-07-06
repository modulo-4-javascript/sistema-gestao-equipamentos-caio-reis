import { useCallback, useEffect, useState } from 'react'
import {
  locationService,
} from '../services/locationService'
import type {
  GetLocationEquipmentParams,
  LocationEquipment,
  PaginatedResult,
} from '../types/location'
import type { RequestState } from '../../../shared/hooks/requestState'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

// Hook da listagem: guarda dados, loading e erro, e recarrega quando os filtros mudam.
export function useLocationEquipment(
  locationId: string | undefined,
  params: GetLocationEquipmentParams,
): RequestState<PaginatedResult<LocationEquipment>> {
  const { page, pageSize, status } = params
  const [data, setData] = useState<PaginatedResult<LocationEquipment>>()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Função que chama o service e atualiza o estado usado pela tabela.
  const loadLocationEquipment = useCallback(async () => {
    // Se não tem locationId, não há o que buscar; encerra o loading e sai.
    if (!locationId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await locationService.getLocationEquipment(locationId, {
        page,
        pageSize,
        status,
      })
      setData(result)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [locationId, page, pageSize, status])

  // Quando filtros ou paginação mudam, buscamos a lista novamente.
  useEffect(() => {
    void Promise.resolve().then(loadLocationEquipment)
  }, [loadLocationEquipment])

  return {
    data,
    isLoading,
    errorMessage,
    reload: loadLocationEquipment,
  }
}