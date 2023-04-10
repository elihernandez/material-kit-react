import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import {
    Box,
    Button,
    Chip, Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField
} from '@mui/material'
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import TableData from 'src/components/Table'
import Toolbar from 'src/components/Toolbar'
import useModalStore, { MODAL_OPTIONS } from 'src/store/useModalStore'
import useToastStore, { TOAST_TYPE } from 'src/store/useToastStore'
import { API_URL, fetcher, paths } from 'src/utils/constants'
import useSWR from 'swr'
import { Multitrack } from '../../../recursoiglesia/api/models/Multitrack'
import { DashboardLayout } from '../components/dashboard-layout'
import { getLocaleDateString } from 'src/helpers/presenter'
import LinkOffIcon from '@mui/icons-material/LinkOff'

const Page = (props) => {
    const { data, isLoading, mutate } = useSWR(`${paths.api.multitracks}/all`, fetcher)
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
            width: 200
        },
        {
            field: 'album',
            headerName: 'Álbum',
            width: 200,
            valueGetter: (params: GridRenderCellParams) => params.row.album.name
        },
        {
            field: 'artist',
            headerName: 'Artista',
            width: 200,
            valueGetter: (params: GridRenderCellParams) => params.row.artist.name
        },
        {
            field: 'isAvailable',
            headerName: 'Secuencia',
            width: 150,
            renderCell: (params: GridRenderCellParams) => <Chip label={`${params.row.link === null ? 'Pendiente' : 'Disponible'}`} color={`${params.row.link === null ? 'warning' : 'primary'}`} />,
            valueGetter: (params: GridValueGetterParams) => params.row.link === null ? 'pendiente' : 'disponible'
        },
        {
            field: 'urlDate',
            headerName: 'Fecha Url',
            width: 150,
            valueGetter: (params: GridValueGetterParams) => params.row.urlDate != null ? getLocaleDateString(params.row.urlDate) : ''
        },
        {
            field: 'actions',
            headerName: '',
            width: 150,
            renderCell: (params: GridRenderCellParams) => <Stack direction="row">
                <IconButton aria-label="link" onClick={() => handleClick(params.row, MODAL_OPTIONS.LINK)}>
                    <LinkIcon />
                </IconButton>
                {params.row.link != null &&
                    <IconButton aria-label="delete_link" onClick={() => handleClick(params.row, MODAL_OPTIONS.DELETE_LINK)}>
                        <LinkOffIcon />
                    </IconButton>
                }
            </Stack>
        }
    ]

    return (
        <>
            <Head>
                <title>
                    Multitracks | Panel Recurso Iglesia
                </title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth={false}>
                    <Toolbar title="Multitracks" />
                    <Box sx={{ mt: 3 }}>
                        <TableData
                            data={data}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </Box>
                </Container>
                <LinkFormModal />
                <DeleteLinkFormModal />
            </Box>
        </>
    )
}

const LinkFormModal = () => {
    const modalOption = useModalStore(state => state.modalOption)
    const modalData: Multitrack = useModalStore(state => state.modalData)
    const isShowModal = useModalStore(state => state.isShowModal)
    const handleCloseModal = useModalStore(state => state.handleCloseModal)
    const [link, setLink] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const handleShowToast = useToastStore(state => state.handleShowToast)

    useEffect(() => {
        setLink(modalData?.link ? modalData?.link : '')
        setUrl(modalData?.url ? modalData?.url : '')
    }, [modalData])

    if (modalOption !== MODAL_OPTIONS.LINK) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.put(`${API_URL}/multitrack/link`, {
                id: modalData.multitrackId,
                url: url,
                link: link,
                urlDate: new Date()
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
                <DialogTitle>Información de secuencia</DialogTitle>
                <DialogContent>
                    <Stack my={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="url"
                            name="url"
                            label="Url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="link"
                            name="link"
                            label="Link"
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                            fullWidth
                        />
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

const DeleteLinkFormModal = () => {
    const modalOption = useModalStore(state => state.modalOption)
    const modalData: Multitrack = useModalStore(state => state.modalData)
    const isShowModal = useModalStore(state => state.isShowModal)
    const handleCloseModal = useModalStore(state => state.handleCloseModal)
    const [link, setLink] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const handleShowToast = useToastStore(state => state.handleShowToast)

    useEffect(() => {
        setLink(modalData?.link ? modalData?.link : '')
        setUrl(modalData?.url ? modalData?.url : '')
    }, [modalData])

    if (modalOption !== MODAL_OPTIONS.DELETE_LINK) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.delete(`${API_URL}/multitrack/link`, {
                data: {
                    id: modalData.multitrackId
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
                <DialogTitle>Eliminar link de secuencia</DialogTitle>
                <DialogContent>
                    <Stack my={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="url"
                            name="url"
                            label="Url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            fullWidth
                            disabled
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="link"
                            name="link"
                            label="Link"
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                            fullWidth
                            disabled
                        />
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
