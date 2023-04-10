import {
    Box,
    Container
} from '@mui/material'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Head from 'next/head'
import TableData from 'src/components/Table'
import Toolbar from 'src/components/Toolbar'
import { getLocaleDateString } from 'src/helpers/presenter'
import { fetcher, paths } from 'src/utils/constants'
import useSWR from 'swr'
import { DashboardLayout } from '../components/dashboard-layout'

const Page = (props) => {
    const { data, isLoading } = useSWR(`${paths.api.donwloads}/all`, fetcher)

    const columns: GridColDef[] = [
        {
            field: 'resourceId',
            headerName: 'ID',
            width: 100
        },
        {
            field: 'name',
            headerName: 'Nombre',
            width: 300,
            valueGetter: (params: GridValueGetterParams) => params.row.resource.name
        },
        {
            field: 'createdAt',
            headerName: 'Fecha',
            width: 200,
            valueGetter: (params: GridValueGetterParams) => getLocaleDateString(params.row.createdAt)
        }
    ]

    return (
        <>
            <Head>
                <title>
                    Downloads | Panel Recurso Iglesia
                </title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth={false}>
                    <Toolbar title="Downloads" />
                    <Box sx={{ mt: 3 }}>
                        <TableData
                            data={data}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </Box>
                </Container>
            </Box>
        </>
    )
}

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
)

export default Page