import { TriangleAlert } from 'lucide-react'
import Modal from './Modal.jsx'
import Button from './Button.jsx'

function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Please wait...' : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-danger-soft text-red-600">
          <TriangleAlert size={20} />
        </div>
        <p className="pt-2 text-sm leading-relaxed text-gray-600">{message}</p>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
