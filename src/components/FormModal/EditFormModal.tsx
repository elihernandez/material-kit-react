import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { FormModalProps } from './CreateFormModal'

export default function EditFormModal({
    dialogTitle,
    dialogContentText,
    isOpen,
    onCloseDialog,
    handleSubmit,
    children
}: FormModalProps) {
    return (
        <Dialog open={isOpen} onClose={() => onCloseDialog()} fullWidth maxWidth='sm'>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContentText}
                    </DialogContentText>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onCloseDialog()}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
