import {
    Box,
    Card,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow
} from '@mui/material'
import { useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export const CustomerListResults = ({ data, ...rest }) => {
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
                <Box sx={{ minWidth: 1050 }}>
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
                                    <TableCell style={{ width: 50 }} component="th" scope="row">
                                        {d.id}
                                    </TableCell>
                                    <TableCell style={{ width: 300 }} component="th" scope="row">
                                        {d.name}
                                    </TableCell>
                                    <TableCell style={{ width: 100 }} component="th" scope="row">
                                        {d.link}
                                    </TableCell>
                                    <TableCell style={{ width: 150 }} component="th" scope="row">
                                        <Stack direction="row">
                                            <IconButton aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete">
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