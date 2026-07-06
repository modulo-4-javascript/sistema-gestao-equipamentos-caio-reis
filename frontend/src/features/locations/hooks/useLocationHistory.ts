import { useCallback, useEffect, useState } from 'react'
import {
  locationService,
} from '../services/locationService'
import type {
  LocationHistoryItem,
  PaginatedResult,
} from '../types/location'
import type { RequestState } from '../../../shared/hooks/requestState'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

// Hook da listagem: guarda dados, loading e erro, e recarrega quando os filtros mudam.
interface UseLocationHistoryParams {
  page?: number
  pageSize?: number
}

// Hook do histórico de movimentações de uma localização específica.
export function useLocationHistory(
  locationId: string | undefined,
  params: UseLocationHistoryParams,
): RequestState<PaginatedResult<LocationHistoryItem>> {
  const { page, pageSize } = params
  const [data, setData] = useState<PaginatedResult<LocationHistoryItem>>()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadLocationHistory = useCallback(async () => {
    if (!locationId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await locationService.getLocationHistory(locationId, {
        page,
        pageSize,
      })
      setData(result)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [locationId, page, pageSize])

  useEffect(() => {
    void Promise.resolve().then(loadLocationHistory)
  }, [loadLocationHistory])

  return {
    data,
    isLoading,
    errorMessage,
    reload: loadLocationHistory,
  }
}