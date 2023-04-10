import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import { GridColDef, GridToolbar } from '@mui/x-data-grid-premium'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { esES } from '@mui/x-data-grid'
import { useState } from 'react'

type TableDataProps = {
    data: any[]
    columns: GridColDef[]
    isLoading: boolean
}

export const TableData = ({ data, columns, isLoading }: TableDataProps) => {
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    })

    if (isLoading) {
        return <Box sx={{ py: 20, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    }

    return <Card>
        <DataGrid
            rows={data}
            columns={columns}
            autoHeight={true}
            rowHeight={75}
            pageSizeOptions={[10, 25, 50]}
            slots={{ toolbar: GridToolbar }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        />
    </Card>
}

export default TableData