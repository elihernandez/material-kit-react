import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
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
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Theme,
    useTheme
} from '@mui/material'
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import TableData from 'src/components/Table'
import Toolbar from 'src/components/Toolbar'
import { getCategoriesNames } from 'src/helpers/presenter'
import useModalStore, { MODAL_OPTIONS } from 'src/store/useModalStore'
import useToastStore, { TOAST_TYPE } from 'src/store/useToastStore'
import { fetcher, paths } from 'src/utils/constants'
import useSWR from 'swr'
import { Category } from '../../../recursoiglesia/api/models/Category'
import { DashboardLayout } from '../components/dashboard-layout'
import { Product } from '../../../recursoiglesia/api/models/Product'

const Page = (props) => {
    const { data, isLoading } = useSWR(`${paths.api.products}/all`, fetcher)
    const setModalOpen = useModalStore(state => state.setModalOpen)

    const handleClick = (row, option) => {
        setModalOpen(row, option)
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 50
        },
        {
            field: 'name',
            headerName: 'Nombre',
            width: 250
        },
        {
            field: 'description',
            headerName: 'Descripción',
            width: 300
        },
        {
            field: 'categories',
            headerName: 'Categorias',
            width: 300,
            valueGetter: (params: GridValueGetterParams) => getCategoriesNames(params.row.categories)
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
                <IconButton aria-label="delete" onClick={() => handleClick(params.row, MODAL_OPTIONS.DELETE)}>
                    <DeleteIcon />
                </IconButton>
            </Stack>
        }
    ]

    return (
        <>
            <Head>
                <title>
                    Products | Panel Recurso Iglesia
                </title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth={false}>
                    <Toolbar title="Products" handleCreate={() => handleClick([], MODAL_OPTIONS.CREATE)} />
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
                <DeleteFormModal />
            </Box>
        </>
    )
}

const CreateFormModal = () => {
    const theme = useTheme()
    const { data: categories } = useSWR(`${paths.api.categories}/all`, fetcher)
    const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([])
    const modalOption = useModalStore(state => state.modalOption)
    const isShowModal = useModalStore(state => state.isShowModal)
    const handleCloseModal = useModalStore(state => state.handleCloseModal)
    const [path, setPath] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [link, setLink] = useState<string>('')
    const [image1, setImage1] = useState<string>('')
    const [image2, setImage2] = useState<string>('')
    const [image3, setImage3] = useState<string>('')
    const [image4, setImage4] = useState<string>('')
    const [image5, setImage5] = useState<string>('')
    const [isActive, setIsActive] = useState<string>('1')
    const handleShowToast = useToastStore(state => state.handleShowToast)

    if (modalOption !== MODAL_OPTIONS.CREATE) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const images = []
            images.push(image1, image2, image3, image4, image5)

            await axios.post(`${paths.api.products}`, {
                name: name,
                description: description,
                price: parseFloat(price),
                link: link,
                categories: categoriesSelected,
                images: images,
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
                <DialogTitle>Información de producto</DialogTitle>
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
                        <TextField
                            autoFocus
                            margin="dense"
                            id="price"
                            name="price"
                            label="Precio"
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
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
                        <FormControl sx={{ marginTop: '8px' }}>
                            <InputLabel id="multiple-categories-label">Categorías</InputLabel>
                            <Select
                                fullWidth
                                labelId="multiple-categories-label"
                                id="multiple-categories"
                                multiple
                                value={categoriesSelected}
                                onChange={(event: any) => setCategoriesSelected(event.target.value)}
                                input={<OutlinedInput id="select-multiple-categorie" label="Categories" />}
                                renderValue={(selected: any[]) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value.id} label={getValue(categories, value)} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {categories?.map((category) => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.id}
                                        style={getStyles(category, categoriesSelected, theme)}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image1"
                            name="image1"
                            label="Imagen #1"
                            type="text"
                            value={image1}
                            onChange={(e) => setImage1(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image2"
                            name="image2"
                            label="Imagen #2"
                            type="text"
                            value={image2}
                            onChange={(e) => setImage2(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image3"
                            name="image3"
                            label="Imagen #3"
                            type="text"
                            value={image3}
                            onChange={(e) => setImage3(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image4"
                            name="image4"
                            label="Imagen #4"
                            type="text"
                            value={image4}
                            onChange={(e) => setImage4(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image5"
                            name="image5"
                            label="Imagen #5"
                            type="text"
                            value={image5}
                            onChange={(e) => setImage5(e.target.value)}
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
    const theme = useTheme()
    const { data: categories } = useSWR(`${paths.api.categories}/all`, fetcher)
    const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([])
    const modalOption = useModalStore(state => state.modalOption)
    const modalData = useModalStore(state => state.modalData)
    const isShowModal = useModalStore(state => state.isShowModal)
    const handleCloseModal = useModalStore(state => state.handleCloseModal)
    const [path, setPath] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [link, setLink] = useState<string>('')
    const [image1, setImage1] = useState<string>('')
    const [image2, setImage2] = useState<string>('')
    const [image3, setImage3] = useState<string>('')
    const [image4, setImage4] = useState<string>('')
    const [image5, setImage5] = useState<string>('')
    const [isActive, setIsActive] = useState<string>('1')
    const handleShowToast = useToastStore(state => state.handleShowToast)

    useEffect(() => {
        setPath(modalData?.path ? modalData?.path : '')
        setName(modalData?.name ? modalData?.name : '')
        setDescription(modalData?.description ? modalData?.description : '')
        setPrice(modalData?.price ? modalData?.price : '')
        setLink(modalData?.link ? modalData?.link : '')
        setCategoriesSelected(modalData?.categories ? modalData?.categories.map((category) => category.category.id) : [])
        const images = modalData?.images ? JSON.parse(modalData.images) : ''
        setImage1(images[0])
        setImage2(images[1])
        setImage3(images[2])
        setImage4(images[3])
        setImage5(images[4])
        setDescription(modalData?.description ? modalData?.description : '')
        setIsActive(modalData?.isActive ? '1' : '0')
    }, [modalData])

    if (modalOption !== MODAL_OPTIONS.EDIT) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const images = []
            images.push(image1, image2, image3, image4, image5)

            await axios.put(`${paths.api.products}`, {
                id: modalData.id,
                name: name,
                description: description,
                price: parseFloat(price),
                link: link,
                categories: categoriesSelected,
                images: images,
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
                <DialogTitle>Información de producto</DialogTitle>
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
                        <TextField
                            autoFocus
                            margin="dense"
                            id="price"
                            name="price"
                            label="Precio"
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
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
                        <FormControl sx={{ marginTop: '8px' }}>
                            <InputLabel id="multiple-categories-label">Categorías</InputLabel>
                            <Select
                                fullWidth
                                labelId="multiple-categories-label"
                                id="multiple-categories"
                                multiple
                                value={categoriesSelected}
                                onChange={(event: any) => setCategoriesSelected(event.target.value)}
                                input={<OutlinedInput id="select-multiple-categorie" label="Categories" />}
                                renderValue={(selected: any[]) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value.id} label={getValue(categories, value)} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                            width: 250,
                                        },
                                    },
                                }}
                            >
                                {categories.map((category) => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.id}
                                        style={getStyles(category, categoriesSelected, theme)}
                                    >
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image1"
                            name="image1"
                            label="Imagen #1"
                            type="text"
                            value={image1}
                            onChange={(e) => setImage1(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image2"
                            name="image2"
                            label="Imagen #2"
                            type="text"
                            value={image2}
                            onChange={(e) => setImage2(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image3"
                            name="image3"
                            label="Imagen #3"
                            type="text"
                            value={image3}
                            onChange={(e) => setImage3(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image4"
                            name="image4"
                            label="Imagen #4"
                            type="text"
                            value={image4}
                            onChange={(e) => setImage4(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="image5"
                            name="image5"
                            label="Imagen #5"
                            type="text"
                            value={image5}
                            onChange={(e) => setImage5(e.target.value)}
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

const DeleteFormModal = () => {
    const modalOption = useModalStore(state => state.modalOption)
    const modalData: Product = useModalStore(state => state.modalData)
    const isShowModal = useModalStore(state => state.isShowModal)
    const handleCloseModal = useModalStore(state => state.handleCloseModal)
    const handleShowToast = useToastStore(state => state.handleShowToast)

    if (modalOption !== MODAL_OPTIONS.DELETE) {
        return null
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.delete(`${paths.api.products}`, {
                data: {
                    id: modalData.id
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
                <DialogTitle>Eliminar producto</DialogTitle>
                <DialogContent>
                    <Stack my={2}>
                        <p>El producto {modalData.name} se va a eliminar de la plataforma.</p>
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

const getValue = (categories, value) => {
    const category = categories.find((category) => category.id === value)
    return category.name
}

function getStyles(name: any, personName: readonly any[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    }
}

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
)

export default Page