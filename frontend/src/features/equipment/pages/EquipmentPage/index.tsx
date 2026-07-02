import { message } from 'antd'
import { useState } from 'react'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { EquipmentFilters } from '../../components/EquipmentFilters'
import { EquipmentFormModal } from '../../components/EquipmentFormModal'
import type { EquipmentFormMode } from '../../components/EquipmentFormModal'
import { EquipmentRemoveModal } from '../../components/EquipmentRemoveModal'
import { EquipmentStatusModal } from '../../components/EquipmentStatusModal'
import { EquipmentTable } from '../../components/EquipmentTable'
import { PageHeader } from '../../components/PageHeader'
import { SummaryCards } from '../../components/SummaryCards'
import {
  equipmentMock,
  equipmentSummaryMock,
  statusOptions,
  typeOptions,
} from '../../mocks/equipment.mock'
import type { Equipment, EquipmentStatus, EquipmentType } from '../../types/equipment'
import { Container } from './styles'
import { useNavigate } from 'react-router-dom'

export function EquipmentPage() {
  const [messageApi, contextHolder] = message.useMessage()

  // Estados dos filtros. Cada campo da área de filtros controla um estado aqui.
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus>()
  const [selectedType, setSelectedType] = useState<EquipmentType>()
  const [formMode, setFormMode] = useState<EquipmentFormMode>('create')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [equipmentInForm, setEquipmentInForm] = useState<Equipment>()
  const [equipmentInStatus, setEquipmentInStatus] = useState<Equipment>()
  const [equipmentToRemove, setEquipmentToRemove] = useState<Equipment>()

  const navigate = useNavigate()

  function handleViewEquipment(equipment: Equipment) {
    navigate(`/equipment/${equipment.id}`)
  }

  function handleCreateEquipment() {
    setFormMode('create')
    setEquipmentInForm(undefined)
    setIsFormModalOpen(true)
  }

  function handleEditEquipment(equipment: Equipment) {
    setFormMode('edit')
    setEquipmentInForm(equipment)
    setIsFormModalOpen(true)
  }

  function handleCloseFormModal() {
    setIsFormModalOpen(false)
    setEquipmentInForm(undefined)
  }

  function handleSubmitFormModal() {
    const feedback =
      formMode === 'edit'
        ? 'Alterações simuladas com sucesso.'
        : 'Cadastro simulado com sucesso.'

    messageApi.success(feedback)
    handleCloseFormModal()
  }

  function handleConfirmRemoveEquipment() {
    messageApi.success('Exclusão simulada com sucesso.')
    setEquipmentToRemove(undefined)
  }

  function handleSubmitStatusModal() {
    messageApi.success('Status atualizado visualmente.')
    setEquipmentInStatus(undefined)
  }

  function handleClearFilters() {
    // Limpa todos os filtros e volta a tabela para o estado inicial.
    setSearchText('')
    setSelectedStatus(undefined)
    setSelectedType(undefined)
  }

  // AULA 05 - parte prática:
  // Primeiro deixamos a lista sem filtro para a tela aparecer.
  const visibleEquipment = equipmentMock
  const locationOptions = Array.from(new Set(equipmentMock.map((equipment) => equipment.location)))

  return (
    <AppLayout currentPage="Equipamentos">
      {contextHolder}
      <Container>
        {/* Cabeçalho da feature: título, descrição e botão principal. */}
        <PageHeader onCreateEquipment={handleCreateEquipment} />

        {/* Cards de resumo: usam dados mockados para simular indicadores do sistema. */}
        <SummaryCards summaries={equipmentSummaryMock} />

        {/* Filtros controlados: os valores ficam nesta página e são enviados por props. */}
        <EquipmentFilters
          searchText={searchText}
          selectedStatus={selectedStatus}
          selectedType={selectedType}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          onSearchChange={setSearchText}
          onStatusChange={setSelectedStatus}
          onTypeChange={setSelectedType}
          onClear={handleClearFilters}
        />

        {/* Tabela principal: recebe a lista que, depois, será filtrada. */}
        <EquipmentTable
          equipments={visibleEquipment}
          onChangeStatusEquipment={setEquipmentInStatus}
          onEditEquipment={handleEditEquipment}
          onRemoveEquipment={setEquipmentToRemove}
          onViewEquipment={handleViewEquipment}
        />

        <EquipmentFormModal
          equipment={equipmentInForm}
          locationOptions={locationOptions}
          mode={formMode}
          open={isFormModalOpen}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          onCancel={handleCloseFormModal}
          onSubmit={handleSubmitFormModal}
        />

        <EquipmentStatusModal
          equipment={equipmentInStatus}
          open={Boolean(equipmentInStatus)}
          statusOptions={statusOptions}
          onCancel={() => setEquipmentInStatus(undefined)}
          onSubmit={handleSubmitStatusModal}
        />

        <EquipmentRemoveModal
          equipment={equipmentToRemove}
          open={Boolean(equipmentToRemove)}
          onCancel={() => setEquipmentToRemove(undefined)}
          onConfirm={handleConfirmRemoveEquipment}
        />
      </Container>
    </AppLayout>
  )
}
