import { Navigate, Route, Routes } from 'react-router-dom'
// AULA 06:
// Vamos ativar esta página quando criarmos a rota dinâmica de detalhes.
import { EquipmentDetailsPage } from '../features/equipment/pages/EquipmentDetailsPage'
import { EquipmentPage } from '../features/equipment/pages/EquipmentPage'
import { LocationsPage } from '../features/locations/pages/LocationsPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* A rota raiz manda o usuário para a primeira tela que existe na aplicação. */}
      <Route path="/" element={<Navigate to="/equipment" replace />} />

      {/* Esta rota permite acessar a tela principal da feature */}
      <Route path="/equipment" element={<EquipmentPage />} />

      {/* AULA 06: rota dinâmica da tela de detalhes de um equipamento */}
      <Route path="/equipment/:equipmentId" element={<EquipmentDetailsPage />} />

      {/* Esta rota mostra que o layout pode ser compartilhado por mais de uma página */}
      <Route path="/locations" element={<LocationsPage />} />

      {/* Qualquer rota desconhecida volta para a tela principal para evitar tela em branco. */}
      <Route path="*" element={<Navigate to="/equipment" replace />} />
    </Routes>
  )
}
