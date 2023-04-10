import Head from 'next/head'
import { Box, Button, CircularProgress, Container, Grid, Typography } from '@mui/material'
import { Budget } from '../components/dashboard/budget'
import { LatestOrders } from '../components/dashboard/latest-orders'
import { LatestProducts } from '../components/dashboard/latest-products'
import { Sales } from '../components/dashboard/sales'
import { TasksProgress } from '../components/dashboard/tasks-progress'
import { TotalCustomers } from '../components/dashboard/total-customers'
import { TotalProfit } from '../components/dashboard/total-profit'
import { TrafficByDevice } from '../components/dashboard/traffic-by-device'
import { DashboardLayout } from '../components/dashboard-layout'
import { Upload as UploadIcon } from 'src/icons/upload'
import { paths } from 'src/utils/constants'
import useToastStore, { TOAST_TYPE } from 'src/store/useToastStore'
import axios from 'axios'
import { useState } from 'react'
import Stack from '@mui/material/Stack'

const Page = (props) => {
    return (
        <>
            <Head>
                <title>
                    Dashboard | Recurso Iglesia
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
                                Dashboard
                            </Typography>
                            <Stack direction="row">
                                <ImportMultitracksButton />
                                <ImportTemplatesButton />
                                <ImportDataButton />
                            </Stack>
                        </Box>
                    </Box>
                    <Grid
                        container
                        spacing={3}
                    >
                        {/* <Grid
                        item
                        lg={3}
                        sm={6}
                        xl={3}
                        xs={12}
                    >
                        <Budget />
                    </Grid>
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={6}
                        xs={12}
                    >
                        <TotalCustomers />
                    </Grid>
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={6}
                        xs={12}
                    >
                        <TasksProgress />
                    </Grid>
                    <Grid
                        item
                        xl={3}
                        lg={3}
                        sm={6}
                        xs={12}
                    >
                        <TotalProfit sx={{ height: '100%' }} />
                    </Grid>
                    <Grid
                        item
                        lg={8}
                        md={12}
                        xl={9}
                        xs={12}
                    >
                        <Sales />
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={6}
                        xl={3}
                        xs={12}
                    >
                        <TrafficByDevice sx={{ height: '100%' }} />
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={6}
                        xl={3}
                        xs={12}
                    >
                        <LatestProducts sx={{ height: '100%' }} />
                    </Grid>
                    <Grid
                        item
                        lg={8}
                        md={12}
                        xl={9}
                        xs={12}
                    >
                        <LatestOrders />
                    </Grid> */}
                    </Grid>
                </Container>
            </Box>
        </>
    )
}

const ImportDataButton = () => {
    const handleShowToast = useToastStore(state => state.handleShowToast)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        try {
            setIsLoading(true)
            await axios.get(paths.api.importDbData)
            setIsLoading(false)
            handleShowToast(TOAST_TYPE.SUCCESS, true, 'La información se cargó en la base de datos correctamente.')
        } catch (e) {
            setIsLoading(false)
            handleShowToast(TOAST_TYPE.ERROR, true, 'Ocurrió un problema al cargar la información en la base de datos.')
        }
    }

    return (
        <Box sx={{ m: 1 }}>
            <Button
                startIcon={!isLoading ? (<UploadIcon fontSize="small" />) : null}
                variant="contained"
                disabled={isLoading}
                sx={{ mr: 1, minWidth: '200px' }}
                onClick={handleClick}
            >
                {!isLoading ? 'Importar data' : <CircularProgress sx={{ width: '24px !important', height: '24px !important' }} />}
            </Button>
        </Box>
    )
}

const ImportTemplatesButton = () => {
    const handleShowToast = useToastStore(state => state.handleShowToast)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        try {
            setIsLoading(true)
            await axios.get(paths.api.importTemplatesData)
            setIsLoading(false)
            handleShowToast(TOAST_TYPE.SUCCESS, true, 'La información se cargó en la base de datos correctamente.')
        } catch (e) {
            setIsLoading(false)
            handleShowToast(TOAST_TYPE.ERROR, true, 'Ocurrió un problema al cargar la información en la base de datos.')
        }
    }

    return (
        <Box sx={{ m: 1 }}>
            <Button
                startIcon={!isLoading ? (<UploadIcon fontSize="small" />) : null}
                variant="contained"
                disabled={isLoading}
                sx={{ mr: 1, minWidth: '200px' }}
                onClick={handleClick}
            >
                {!isLoading ? 'Buscar templates' : <CircularProgress sx={{ width: '24px !important', height: '24px !important' }} />}
            </Button>
        </Box>
    )
}

const ImportMultitracksButton = () => {
    const handleShowToast = useToastStore(state => state.handleShowToast)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        try {
            setIsLoading(true)
            await axios.get(paths.api.importMultitracksData)
            setIsLoading(false)
            handleShowToast(TOAST_TYPE.SUCCESS, true, 'La información se cargó en la base de datos correctamente.')
        } catch (e) {
            setIsLoading(false)
            handleShowToast(TOAST_TYPE.ERROR, true, 'Ocurrió un problema al cargar la información en la base de datos.')
        }
    }

    return (
        <Box sx={{ m: 1 }}>
            <Button
                startIcon={!isLoading ? (<UploadIcon fontSize="small" />) : null}
                variant="contained"
                disabled={isLoading}
                sx={{ mr: 1, minWidth: '200px' }}
                onClick={handleClick}
            >
                {!isLoading ? 'Buscar multitracks' : <CircularProgress sx={{ width: '24px !important', height: '24px !important' }} />}
            </Button>
        </Box>
    )
}

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
)

export default Page
