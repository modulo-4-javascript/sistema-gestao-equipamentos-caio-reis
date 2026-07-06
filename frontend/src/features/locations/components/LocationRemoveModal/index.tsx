import type { LocationDetails } from '../../types/location'
import { Hint, Message, RemoveModal } from './styles'

interface LocationRemoveModalProps {
  location?: LocationDetails
  open: boolean
  confirmLoading?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function LocationRemoveModal({
  location,
  open,
  confirmLoading,
  onCancel,
  onConfirm,
}: LocationRemoveModalProps) {
  const locationLabel = location ? `${location.name} (${location.code})` : 'esta localização'

  return (
    <RemoveModal
      centered
      open={open}
      title="Excluir localização"
      okText="Excluir"
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
      okButtonProps={{ danger: true }}
      width={440}
      maskStyle={{
        backdropFilter: 'blur(2px)',
        background: 'rgb(0 0 0 / 45%)',
      }}
      onCancel={onCancel}
      onOk={onConfirm}
    >
      <Message>Deseja excluir "{locationLabel}"?</Message>
      <Hint>Essa ação não poderá ser desfeita.</Hint>
    </RemoveModal>
  )
}