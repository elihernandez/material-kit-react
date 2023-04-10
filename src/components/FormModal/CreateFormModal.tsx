import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { FormEventHandler } from 'react'

export type FormModalProps = {
    dialogTitle: string
    dialogContentText: string
    isOpen: boolean
    data?: object
    onCloseDialog: Function
    handleSubmit: FormEventHandler<HTMLFormElement>
    children: JSX.Element
}

export default function CreateFormModal({
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