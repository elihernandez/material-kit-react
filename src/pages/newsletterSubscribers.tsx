import {
    Box,
    Container
} from '@mui/material'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Head from 'next/head'
import TableData from 'src/components/Table'
import Toolbar from 'src/components/Toolbar'
import { fetcher, paths } from 'src/utils/constants'
import useSWR from 'swr'
import { DashboardLayout } from '../components/dashboard-layout'
import { getLocaleDateString } from 'src/helpers/presenter'

const Page = (props) => {
    const { data, isLoading } = useSWR(`${paths.api.newsletterSubscriber}/all`, fetcher)

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 300
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 300
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
                    Newsletter Subscribers | Panel Recurso Iglesia
                </title>
            </Head>
            <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth={false}>
                    <Toolbar title="Newsletter" />
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