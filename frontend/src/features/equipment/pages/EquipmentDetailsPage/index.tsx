import { AppLayout } from '../../../../app/layout/AppLayout'
import { useNavigate, useParams } from 'react-router-dom'

import {
  findEquipmentDetailById,
  getEquipmentDetailSummary,
} from '../../mocks/equipment-details.mock'

import { DetailSummaryCards } from '../../components/DetailSummaryCards'
import { DetailsHeader } from '../../components/DetailsHeader'
import { EquipmentHistoryCard } from '../../components/EquipmentHistoryCard'
import { EquipmentInfoCard } from '../../components/EquipmentInfoCard'
import { EquipmentNotesCard } from '../../components/EquipmentNotesCard'

import { Container, ContentGrid, MainColumn, SideColumn, StarterBox } from './styles'

export function EquipmentDetailsPage() {
  const navigate = useNavigate()
  const { equipmentId } = useParams()

  const equipment = findEquipmentDetailById(equipmentId)

if (!equipment) {
  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        <StarterBox>Equipamento não encontrado.</StarterBox>
      </Container>
    </AppLayout>
  )
}

  const summaries = getEquipmentDetailSummary(equipment)

  return (
  <AppLayout currentPage="Detalhes">
    <Container>
      <DetailsHeader
        equipment={equipment}
        onBack={() => navigate('/equipment')}
        onEdit={() => undefined}
        onChangeStatus={() => undefined}
        onRemove={() => undefined}
      />

      <DetailSummaryCards summaries={summaries} />

      <ContentGrid>
        <MainColumn>
          <EquipmentInfoCard equipment={equipment} />
          <EquipmentNotesCard notes={equipment.notes} />
        </MainColumn>

        <SideColumn>
          <EquipmentHistoryCard history={equipment.history} />
        </SideColumn>
      </ContentGrid>
    </Container>
  </AppLayout>
)
}
