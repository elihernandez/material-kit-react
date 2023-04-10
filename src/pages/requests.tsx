import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import {
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField
} from '@mui/material'
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import TableData from 'src/components/Table'
import Toolbar from 'src/components/Toolbar'
import { getLocaleDateString } from 'src/helpers/presenter'
import useModalStore, { MODAL_OPTIONS } from 'src/store/useModalStore'
import useToastStore, { TOAST_TYPE } from 'src/store/useToastStore'
import { fetcher, paths } from 'src/utils/constants'
import useSWR from 'swr'
import { MultitrackRequest } from '../../../recursoiglesia/api/models/MultitrackRequest'
import { DashboardLayout } from '../components/dashboard-layout'
import axios from 'axios'

const Page = (props) => {
    const { data, isLoading } = useSWR(`${paths.api.requests}/all`, fetcher)
    const setModalOpen = useModalStore(state => state.setModalOpen)

    const handleClick = (row, option) => {
        setModalOpen(row, option)
    }

    const columns: GridColDef[] = [
        {
            field: 'multitrackId',
            headerName: 'ID',
            width: 100
        },
        {
            field: 'name',
            headerName: 'Nombre',
            width: 150,
            valueGetter: (params: GridValueGetterParams) => params.row?.multitrack?.name
        },
        {
            field: 'album',
            headerName: 'Álbum',
            width: 150,
            valueGetter: (params: GridValueGetterParams) => params.row?.multitrack?.album.name
        },
        {
            field: 'artist',
            headerName: 'Artista',
            width: 150,
            valueGetter: (params: GridValueGetterParams) => params.row?.multitrack?.album.artist.name
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250
        },
        {
            field: 'createdAt',
            headerName: 'Fecha',
            width: 150,
            valueGetter: (params: GridValueGetterParams) => getLocaleDateString(params.row.createdAt)
        },
        {
            field: 'isSent',
            headerName: 'Envíado',
            width: 120,
            renderCell: (params: GridRenderCellParams) => <Chip label={`${params.row.isSent ? 'Envíado' : 'Pendiente'}`} color={`${params.row.isSent ? 'primary' : 'warning'}`} />,
            valueGetter: (params: GridValueGetterParams) => params.row.isSent ? 'enviado' : 'pendiente'
        },
        {
            field: 'actions',
            headerName: '',
            width: 50,
            renderCell: (params: GridRenderCellParams) => <Stack direction="row">
                <IconButton aria-label="link" onClick={() => handleClick(params.row, MODAL_OPTIONS.EMAIL)}>
                    <ForwardToInboxIcon />
                </IconButton>
            </Stack>
        }
    ]

    return (
        <>
            <Head>
                <title>
                    Requests | Panel Recurso Iglesia
                </title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth={false}>
                    <Toolbar title="Requests" />
                    <Box sx={{ mt: 3 }}>
                        <TableData
                            data={data}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </Box>
                </Container>
                <EmailFormModal />
            </Box>
        </>
    )
}

const EmailFormModal = () => {
    const modalOption = useModalStore(state => state.modalOption)
    const modalData: MultitrackRequest = useModalStore(state => state.modalData)
    const isShowModal = useModalStore(state => state.isShowModal)
    const handleCloseModal = useModalStore(state => state.handleCloseModal)
    const handleShowToast = useToastStore(state => state.handleShowToast)

    if (modalOption !== MODAL_OPTIONS.EMAIL) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.post(`${paths.api.requests}/email`, {
                data: {
                    ...modalData
                }
            })

            handleCloseModal()
            handleShowToast(TOAST_TYPE.SUCCESS, true, 'La información se guardó correctamente.')
        } catch (e) {
            handleShowToast(TOAST_TYPE.ERROR, true, 'Ocurrió un problema, no se guardó la información.')
        }
    }

    return (
        <Dialog open={isShowModal} onClose={handleCloseModal} fullWidth maxWidth='sm'>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Información de solicitud</DialogTitle>
                <DialogContent>
                    <Stack my={2}>
                        <p>Se envíara un correo electrónico a {modalData.email} para notificar que el recurso que solicitó ya está disponible en la plataforma.</p>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </DialogActions>
            </form>
        </Dialog >
    )
}

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
)

export default Page
