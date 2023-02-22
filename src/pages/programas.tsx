import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox, Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    Snackbar,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Download as DownloadIcon } from 'src/icons/download'
import { Search as SearchIcon } from 'src/icons/search'
import { Upload as UploadIcon } from 'src/icons/upload'
import { API_URL } from 'src/utils/constants'
import { Software } from '../../../recursoiglesia/api/models/Software'
import { DashboardLayout } from '../components/dashboard-layout'

const Page = () => {
    const [data, setData] = useState(null)
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [selectedData, setSelectedData] = useState<Software>()
    const [software, setSoftware] = useState<Array<Software>>([])
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [message, setMessage] = useState({
        type: 'success', message: ''
    })

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await axios.get(`${API_URL}/programas/all`)

        setSoftware(response.data)
        setData({
            headers: [
                { name: 'nombre' }, { name: 'img' }, { name: 'url' }, { name: 'link' }
            ],
            data: response.data
        })
    }

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = (e.target.value).toLocaleLowerCase()
        const newData = { ...data }

        newData.data = search === ''
            ? software
            : newData.data = data.data.filter((software: Software) =>
                software.name.toLowerCase().includes(search.toLowerCase()) ||
                software.link.toLocaleLowerCase().includes(search.toLowerCase())
            )

        setData(newData)
    }

    const handleOpenModal = (d: Software, type: string) => {
        setSelectedData(d)
        type === 'edit' ? setOpenEditModal(true) : setOpenDeleteModal(true)
    }

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true)
    }

    const handleCloseCreateModal = () => {
        setOpenCreateModal(false)
    }

    const handleCloseEditModal = () => {
        setOpenEditModal(false)
    }

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false)
    }

    const handleOpenSnackbar = (e) => {
        setMessage({
            type: e.type,
            message: e.message
        })
        setOpenSnackbar(true)
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackbar(false)
    }

    return (
        <>
            <Head>
                <title>
                    Programas | Panel Recurso Iglesia
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={false}>
                    <Toolbar title="Programas" handleChange={handleChangeSearch} handleOpenCreateModal={handleOpenCreateModal} />
                    <Box sx={{ mt: 3 }}>
                        {data &&
                            <TableData data={data} handleOpenModal={handleOpenModal} />
                        }
                    </Box>
                    <CreateFormModal open={openCreateModal} handleClose={handleCloseCreateModal} getData={getData} handleOpenSnackbar={handleOpenSnackbar} />
                    <EditFormModal open={openEditModal} handleClose={handleCloseEditModal} data={selectedData} getData={getData} handleOpenSnackbar={handleOpenSnackbar} />
                    <DeleteFormModal open={openDeleteModal} handleClose={handleCloseDeleteModal} data={selectedData} getData={getData} handleOpenSnackbar={handleOpenSnackbar} />
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        key={'top' + 'right'}
                    >
                        <Alert onClose={handleClose} severity={message.type === 'success' ? 'success' : 'error'} sx={{ width: '100%' }}>
                            {message.message}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </>
    )
}

const Toolbar = ({ title, handleChange, handleOpenCreateModal }) => (
    <Box>
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                m: -1
            }}
        >
            <Typography
                sx={{ m: 1 }}
                variant="h4"
            >
                {title}
            </Typography>
            <Box sx={{ m: 1 }}>
                <Button
                    startIcon={(<UploadIcon fontSize="small" />)}
                    sx={{ mr: 1 }}
                >
                    Importar
                </Button>
                <Button
                    startIcon={(<DownloadIcon fontSize="small" />)}
                    sx={{ mr: 1 }}
                >
                    Exportar
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleOpenCreateModal}
                >
                    Agregar
                </Button>
            </Box>
        </Box>
        <Box sx={{ mt: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ maxWidth: 500 }}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgIcon
                                            color="action"
                                            fontSize="small"
                                        >
                                            <SearchIcon />
                                        </SvgIcon>
                                    </InputAdornment>
                                )
                            }}
                            size='medium'
                            placeholder="Buscar"
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    </Box>
)

const TableData = ({ data, handleOpenModal, ...rest }) => {
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([])
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)

    const handleSelectAll = (event) => {
        let newSelectedCustomerIds

        if (event.target.checked) {
            newSelectedCustomerIds = data.data.map((d) => d.id)
        } else {
            newSelectedCustomerIds = []
        }

        setSelectedCustomerIds(newSelectedCustomerIds)
    }

    const handleSelectOne = (event, id) => {
        const selectedIndex = selectedCustomerIds.indexOf(id)
        let newSelectedCustomerIds = []

        if (selectedIndex === -1) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id)
        } else if (selectedIndex === 0) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1))
        } else if (selectedIndex === selectedCustomerIds.length - 1) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(
                selectedCustomerIds.slice(0, selectedIndex),
                selectedCustomerIds.slice(selectedIndex + 1)
            )
        }

        setSelectedCustomerIds(newSelectedCustomerIds)
    }

    const handleLimitChange = (event) => {
        setLimit(event.target.value)
    }

    const handlePageChange = (event, newPage) => {
        setPage(newPage)
    }

    return (
        <Card {...rest}>
            <PerfectScrollbar>
                <Box style={{ overflow: 'scroll' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedCustomerIds.length === data.data.length}
                                        color="primary"
                                        indeterminate={
                                            selectedCustomerIds.length > 0
                                            && selectedCustomerIds.length < data.data.length
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                {data.headers.map((header) =>
                                    <TableCell key={header.name}>
                                        {header.name}
                                    </TableCell>
                                )}
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.data.slice(page * limit, page * limit + limit).map((d) => (
                                <TableRow hover key={d.id} selected={selectedCustomerIds.indexOf(d.id) !== -1}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedCustomerIds.indexOf(d.id) !== -1}
                                            onChange={(event) => handleSelectOne(event, d.id)}
                                            value="true"
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {d.name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <p style={{ overflowWrap: 'break-word', inlineSize: 'min-content' }}>{d.imgUrl}</p>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <p style={{ overflowWrap: 'break-word', inlineSize: 'min-content' }}>{d.url}</p>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <p style={{ overflowWrap: 'break-word', inlineSize: 'min-content' }}>{d.link}</p>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Stack direction="row">
                                            <IconButton aria-label="edit" onClick={() => handleOpenModal(d, 'edit')}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={() => handleOpenModal(d, 'delete')}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <TablePagination
                component="div"
                count={data.data.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `more than ${to}`}`}
            />
        </Card>
    )
}

const CreateFormModal = ({ open, handleClose, getData, handleOpenSnackbar }) => {
    const [name, setName] = useState<string>('')
    const [imgUrl, setImgUrl] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const [link, setLink] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.post(`${API_URL}/programas`, {
                name: name,
                imgUrl: imgUrl,
                url: url,
                link: link
            })

            handleClose()
            getData()
            handleOpenSnackbar({
                type: 'success',
                message: 'La información se guardó correctamente.'
            })
        } catch (e) {
            handleOpenSnackbar({
                type: 'error',
                message: 'Ocurrió un problema, no se guardó la información.'
            })
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Información de programa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Crear información de programa
                    </DialogContentText>
                    <Stack my={2}>
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
                            id="imgUrl"
                            name="imgUrl"
                            label="Img Url"
                            type="text"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            required
                            fullWidth
                        />
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
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

const EditFormModal = ({ open, handleClose, data, getData, handleOpenSnackbar }) => {
    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [imgUrl, setImgUrl] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    const [link, setLink] = useState<string>('')

    useEffect(() => {
        setId(data?.id)
        setName(data?.name)
        setImgUrl(data?.imgUrl)
        setUrl(data?.url)
        setLink(data?.link)
    }, [data])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.put(`${API_URL}/programas`, {
                id: id,
                name: name,
                imgUrl: imgUrl,
                url: url,
                link: link
            })

            handleClose()
            getData()
            handleOpenSnackbar({
                type: 'success',
                message: 'La información se guardó correctamente.'
            })
        } catch (e) {
            handleOpenSnackbar({
                type: 'error',
                message: 'Ocurrió un problema, no se guardó la información.'
            })
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Información de programa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Editar información de programa
                    </DialogContentText>
                    <Stack my={4} spacing={4}>
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
                            id="imgUrl"
                            name="imgUrl"
                            label="Img Url"
                            type="text"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            required
                            fullWidth
                        />
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
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

const DeleteFormModal = ({ open, handleClose, data, getData, handleOpenSnackbar }) => {

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.delete(`${API_URL}/programas`, {
                data: {
                    id: data.id
                }
            })

            handleClose()
            getData()
            handleOpenSnackbar({
                type: 'success',
                message: 'La información se guardó correctamente.'
            })
        } catch (e) {
            handleOpenSnackbar({
                type: 'error',
                message: 'Ocurrió un problema, no se guardó la información.'
            })
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <form onSubmit={handleSubmit}>
                <DialogTitle>Eliminar plantilla</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Se va a eliminar la información de: <br /><br />
                        Nombre: {data?.name} <br />
                        Link: {data?.link} <br />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
)

export default Page
