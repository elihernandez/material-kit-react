import EditIcon from '@mui/icons-material/Edit'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import {
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
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
import { fetcher, paths } from 'src/utils/constants'
import useSWR from 'swr'
import { DashboardLayout } from '../components/dashboard-layout'

const Page = (props) => {
    const { data, isLoading } = useSWR(`${paths.api.categories}/all`, fetcher)
    const setModalOpen = useModalStore(state => state.setModalOpen)

    const handleClick = (row, option) => {
        setModalOpen(row, option)
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100
        },
        {
            field: 'name',
            headerName: 'Nombre',
            width: 300
        },
        {
            field: 'description',
            headerName: 'Descripción',
            width: 500
        },
        {
            field: 'isActive',
            headerName: 'Estado',
            width: 150,
            renderCell: (params: GridRenderCellParams) => <Chip label={`${params.row.isActive ? 'Activado' : 'Desactivado'}`} color={`${params.row.isActive ? 'primary' : 'warning'}`} />,
            valueGetter: (params: GridValueGetterParams) => params.row.isActive ? 'activado' : 'desactivado'
        },
        {
            field: 'actions',
            headerName: '',
            width: 100,
            renderCell: (params: GridRenderCellParams) => <Stack direction="row">
                <IconButton aria-label="edit" onClick={() => handleClick(params.row, MODAL_OPTIONS.EDIT)}>
                    <EditIcon />
                </IconButton>
            </Stack>
        }
    ]

    return (
        <>
            <Head>
                <title>
                    Categories | Panel Recurso Iglesia
                </title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth={false}>
                    <Toolbar title="Categories" handleCreate={() => handleClick([], MODAL_OPTIONS.CREATE)} />
                    <Box sx={{ mt: 3 }}>
                        <TableData
                            data={data}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </Box>
                </Container>
                <CreateFormModal />
                <EditFormModal />
            </Box>
        </>
    )
}

const CreateFormModal = () => {
    const modalOption = useModalStore(state => state.modalOption)
    const isShowModal = useModalStore(state => state.isShowModal)
    const handleCloseModal = useModalStore(state => state.handleCloseModal)
    const [path, setPath] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [isActive, setIsActive] = useState<string>('1')
    const handleShowToast = useToastStore(state => state.handleShowToast)

    if (modalOption !== MODAL_OPTIONS.CREATE) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.post(`${paths.api.categories}`, {
                path: path,
                name: name,
                description: description,
                isActive: isActive ? true : false
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
                <DialogTitle>Información de categoria</DialogTitle>
                <DialogContent>
                    <Stack my={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="path"
                            name="path"
                            label="Path"
                            type="text"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            label="Nombre"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="description"
                            name="description"
                            label="Descripción"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            fullWidth
                        />
                        <Box mt={1}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    labelId="select-label-active"
                                    id="select-active"
                                    label="Estado"
                                    value={isActive}
                                    onChange={(event: SelectChangeEvent) => {
                                        setIsActive(event.target.value)
                                    }}
                                >
                                    <MenuItem value='1'>Activado</MenuItem>
                                    <MenuItem value='0'>Desactivado</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
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

const EditFormModal = () => {
    const modalOption = useModalStore(state => state.modalOption)
    const modalData = useModalStore(state => state.modalData)
    const isShowModal = useModalStore(state => state.isShowModal)
    const handleCloseModal = useModalStore(state => state.handleCloseModal)
    const [path, setPath] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [isActive, setIsActive] = useState<string>('1')
    const handleShowToast = useToastStore(state => state.handleShowToast)

    useEffect(() => {
        setPath(modalData?.path ? modalData?.path : '')
        setName(modalData?.name ? modalData?.name : '')
        setDescription(modalData?.description ? modalData?.description : '')
        setIsActive(modalData?.isActive ? '1' : '0')
    }, [modalData])

    if (modalOption !== MODAL_OPTIONS.EDIT) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.put(`${paths.api.categories}`, {
                id: modalData.id,
                path: path,
                name: name,
                description: description,
                isActive: isActive === '1' ? true : false
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
                <DialogTitle>Información de categoria</DialogTitle>
                <DialogContent>
                    <Stack my={2}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="path"
                            name="path"
                            label="Path"
                            type="text"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            label="Nombre"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="description"
                            name="description"
                            label="Descripción"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            fullWidth
                        />
                        <Box mt={1}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    labelId="select-label-active"
                                    id="select-active"
                                    label="Estado"
                                    value={isActive}
                                    onChange={(event: SelectChangeEvent) => {
                                        setIsActive(event.target.value)
                                    }}
                                >
                                    <MenuItem value='1'>Activado</MenuItem>
                                    <MenuItem value='0'>Desactivado</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
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