import { Alert, App as AntDesignApp, Spin } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { DetailSummaryCards } from '../../../equipment/components/DetailSummaryCards'
import { LocationFormModal } from '../../components/LocationFormModal'
import type { LocationFormValues } from '../../components/LocationFormModal'
import { LocationRemoveModal } from '../../components/LocationRemoveModal'
import { LocationStatusModal } from '../../components/LocationStatusModal'
import type { LocationStatusFormValues } from '../../components/LocationStatusModal'
import { getRequestErrorMessage } from '../../../../shared/http/getRequestErrorMessage'
import { useDeleteLocation } from '../../hooks/useDeleteLocation'
import { useLocationDetails } from '../../hooks/useLocationDetails'
import { useUpdateLocation } from '../../hooks/useUpdateLocation'
import { useUpdateLocationStatus } from '../../hooks/useUpdateLocationStatus'
import {
  getLocationStatusLabel,
  locationStatusOptions,
  locationTypeOptions,
  type CreateLocationPayload,
  type LocationDetails,
} from '../../types/location'

import {
  Container,
  ContentGrid,
  MainColumn,
  SideColumn,
  StarterBox,
} from './styles'

// Antes de enviar para a API, limpamos espaços e transformamos campos vazios em undefined/null.
function buildLocationPayload(values: LocationFormValues): CreateLocationPayload {
  return {
    code: values.code.trim(),
    name: values.name.trim(),
    type: values.type,
    building: values.building?.trim() || null,
    floor: values.floor?.trim() || null,
    room: values.room?.trim() || null,
    description: values.description?.trim() || null,
    status: values.status,
  }
}

// A API devolve os dados completos; esta função escolhe o que vira card de resumo.
function buildDetailSummary(location: LocationDetails) {
  return [
    {
      id: 'status',
      title: 'Status',
      value: getLocationStatusLabel(location.status),
      description: location.status === 'ACTIVE' ? 'Localização ativa' : 'Localização inativa',
    },
    {
      id: 'building',
      title: 'Prédio',
      value: location.building ?? 'Não informado',
      description: 'Estrutura física',
    },
    {
      id: 'floor',
      title: 'Andar',
      value: location.floor ?? 'Não informado',
      description: 'Nível',
    },
    {
      id: 'room',
      title: 'Sala',
      value: location.room ?? 'Não informado',
      description: 'Espaço físico',
    },
  ]
}

export function LocationDetailsPage() {
  const { message: messageApi } = AntDesignApp.useApp()
  const navigate = useNavigate()

  // O ID vem da URL /locations/:locationId e decide qual localização buscar.
  const { locationId } = useParams()

  // Estes estados controlam apenas os modais da página de detalhes.
  const [locationInForm, setLocationInForm] = useState<LocationDetails>()
  const [locationInStatus, setLocationInStatus] = useState<LocationDetails>()
  const [locationToRemove, setLocationToRemove] = useState<LocationDetails>()

  // Hooks que usam useEffect + axios para buscar e salvar dados na API.
  const locationQuery = useLocationDetails(locationId)
  const updateLocation = useUpdateLocation()
  const updateLocationStatus = useUpdateLocationStatus()
  const deleteLocation = useDeleteLocation()

  const location = locationQuery.data

  // Loading e erro para exibir estados de tela.
  const isLoading = locationQuery.isLoading
  const loadError =
    (!locationId ? 'ID da localização não encontrado na rota.' : '') ||
    locationQuery.errorMessage
  const isSavingForm = updateLocation.isLoading
  const isSavingStatus = updateLocationStatus.isLoading
  const isRemovingLocation = deleteLocation.isLoading

  // Cards de resumo são derivados da localização carregada.
  const summaries = useMemo(
    () => (location ? buildDetailSummary(location) : []),
    [location],
  )

  // Abre o modal de edição usando a localização já carregada.
  function handleEditLocation() {
    if (location) {
      setLocationInForm(location)
    }
  }

  // Abre o modal de alteração de status usando a localização já carregada.
  function handleChangeStatus() {
    if (location) {
      setLocationInStatus(location)
    }
  }

  // Salva a edição e depois recarrega o detalhe para mostrar os dados atualizados.
  async function handleSubmitFormModal(values: LocationFormValues) {
    if (!locationInForm) {
      return
    }

    try {
      await updateLocation.update({
        locationId: locationInForm.id,
        payload: buildLocationPayload(values),
      })
      await locationQuery.reload()
      messageApi.success('Localização atualizada com sucesso.')
      setLocationInForm(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  // Salva o novo status e depois recarrega o detalhe para atualizar cards.
  async function handleSubmitStatusModal(values: LocationStatusFormValues) {
    if (!locationInStatus) {
      return
    }

    try {
      await updateLocationStatus.updateStatus({
        locationId: locationInStatus.id,
        payload: {
          status: values.status,
          note: values.note?.trim() || null,
        },
      })
      await locationQuery.reload()
      messageApi.success('Status atualizado com sucesso.')
      setLocationInStatus(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  async function handleConfirmRemoveLocation() {
    if (!locationToRemove) {
      return
    }

    try {
      await deleteLocation.remove(locationToRemove.id)
      messageApi.success('Localização excluída com sucesso.')
      setLocationToRemove(undefined)
      navigate('/locations')
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  // Enquanto o detalhe carrega, mostramos um estado simples de espera.
  if (isLoading) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <StarterBox>
            <Spin /> Carregando localização...
          </StarterBox>
        </Container>
      </AppLayout>
    )
  }

  // Se a API falhar ou a localização não existir, mostramos uma mensagem de erro didática.
  if (loadError || !location) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <Alert
            showIcon
            message="Localização não encontrada"
            description={loadError || 'Não foi possível exibir esta localização.'}
            type="error"
          />
        </Container>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        {/* Cabeçalho simples com nome, código e ações principais.
            TODO: extrair para um LocationDetailsHeader dedicado quando necessário. */}
        <div>
          <h1>{location.name}</h1>
          <p>Código: {location.code}</p>
          <p>Status: {getLocationStatusLabel(location.status)}</p>
          <button onClick={() => navigate('/locations')}>Voltar</button>
          <button onClick={handleEditLocation}>Editar</button>
          <button onClick={handleChangeStatus}>Alterar status</button>
          <button onClick={() => setLocationToRemove(location)}>Excluir</button>
        </div>

        {/* Cards calculados a partir da localização carregada pela API. */}
        <DetailSummaryCards summaries={summaries} />

        {/* Conteúdo principal.
            TODO: adicionar equipamentos vinculados (useLocationEquipment)
            e histórico (useLocationHistory) numa próxima iteração. */}
        <ContentGrid>
          <MainColumn>
            <div>
              <h3>Informações gerais</h3>
              <p>Tipo: {location.type}</p>
              <p>Descrição: {location.description ?? 'Sem descrição'}</p>
            </div>
          </MainColumn>

          <SideColumn>
            <div>
              <h3>Equipamentos vinculados</h3>
              <p>Em breve.</p>
            </div>
            <div>
              <h3>Histórico</h3>
              <p>Em breve.</p>
            </div>
          </SideColumn>
        </ContentGrid>

        {/* Modal de edição da localização atual. */}
        <LocationFormModal
          confirmLoading={isSavingForm}
          location={locationInForm}
          mode="edit"
          open={Boolean(locationInForm)}
          statusOptions={locationStatusOptions}
          typeOptions={locationTypeOptions}
          onCancel={() => setLocationInForm(undefined)}
          onSubmit={handleSubmitFormModal}
        />

        {/* Modal específico para mudança rápida de status. */}
        <LocationStatusModal
          confirmLoading={isSavingStatus}
          location={locationInStatus}
          open={Boolean(locationInStatus)}
          statusOptions={locationStatusOptions}
          onCancel={() => setLocationInStatus(undefined)}
          onSubmit={handleSubmitStatusModal}
        />

        {/* Modal de confirmação que chama DELETE /locations/:locationId. */}
        <LocationRemoveModal
          confirmLoading={isRemovingLocation}
          location={locationToRemove}
          open={Boolean(locationToRemove)}
          onCancel={() => setLocationToRemove(undefined)}
          onConfirm={handleConfirmRemoveLocation}
        />
      </Container>
    </AppLayout>
  )
}