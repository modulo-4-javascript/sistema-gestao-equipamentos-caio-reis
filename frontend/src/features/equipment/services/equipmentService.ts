// AULA 07: descomente este import quando o service passar a chamar a API real.
import { axiosApi } from '../../../services/api'
import type {
  CreateEquipmentPayload,
  Equipment,
  EquipmentDetail,
  EquipmentLocationOption,
  EquipmentStatus,
  EquipmentSummaryResponse,
  EquipmentType,
  PaginatedResult,
  UpdateEquipmentPayload,
  UpdateEquipmentStatusPayload,
} from '../types/equipment'

export interface GetEquipmentListParams {
  search?: string
  status?: EquipmentStatus
  type?: EquipmentType
  page?: number
  pageSize?: number
}

// AULA 07: descomente este tipo auxiliar junto com a chamada GET /locations.
interface ApiLocation {
  id: string
  code: string
  name: string
}

// AULA 07: descomente este bloco para trocar a tela sem dados por chamadas reais ao backend.
export const equipmentService = {
  // Lista equipamentos com filtros e paginação; a API responde com { data, meta }.
  async getEquipmentList(params: GetEquipmentListParams = {}) {
    const response = await axiosApi.get<PaginatedResult<Equipment>>('/equipment', {
      params: {
        page: 1,
        pageSize: 10,
        ...params,
      },
    })

    return response.data
  },

  // Busca os totais usados nos cards do topo da página.
  async getEquipmentSummary() {
    const response = await axiosApi.get<EquipmentSummaryResponse>(
      '/equipment/summary',
    )

    return response.data
  },

  // Busca apenas um equipamento pelo ID para preencher a tela de detalhes.
  async getEquipmentById(equipmentId: string) {
    const response = await axiosApi.get<EquipmentDetail>(
      `/equipment/${equipmentId}`,
    )

    return response.data
  },

  // Cria um novo equipamento no backend usando POST.
  async createEquipment(payload: CreateEquipmentPayload) {
    const response = await axiosApi.post<EquipmentDetail>('/equipment', payload)

    return response.data
  },

  // Atualiza os dados principais de um equipamento usando PUT.
  async updateEquipment(equipmentId: string, payload: UpdateEquipmentPayload) {
    const response = await axiosApi.put<EquipmentDetail>(
      `/equipment/${equipmentId}`,
      payload,
    )

    return response.data
  },

  // Altera apenas o status do equipamento usando PATCH.
  async updateEquipmentStatus(
    equipmentId: string,
    payload: UpdateEquipmentStatusPayload,
  ) {
    const response = await axiosApi.patch<EquipmentDetail>(
      `/equipment/${equipmentId}/status`,
      payload,
    )

    return response.data
  },

  // Busca localizações para preencher o select usado nos formulários de equipamento.
  async getEquipmentLocationOptions() {
    const response = await axiosApi.get<PaginatedResult<ApiLocation>>(
      '/locations',
      {
        params: {
          page: 1,
          pageSize: 100,
        },
      },
    )

    return response.data.data.map<EquipmentLocationOption>((location) => ({
      id: location.id,
      label: `${location.code} - ${location.name}`,
    }))
  },
}
