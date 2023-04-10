import { Alert, Snackbar } from '@mui/material'
import useToastStore, { TOAST_TYPE } from 'src/store/useToastStore'

export default function SnackbarApp() {
    const type = useToastStore(state => state.type)
    const isShowToast = useToastStore(state => state.isShowToast)
    const handleCloseToast = useToastStore(state => state.handleCloseToast)
    const toastMessage = useToastStore(state => state.toastMessage)

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isShowToast}
            autoHideDuration={6000}
            onClose={handleCloseToast}
            key={'top' + 'right'}
        >
            <Alert onClose={handleCloseToast} severity={type === TOAST_TYPE.SUCCESS ? 'success' : 'error'} sx={{ width: '100%' }}>
                {toastMessage}
            </Alert>
        </Snackbar>
    )
}