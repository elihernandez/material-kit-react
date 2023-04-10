import {
    Box,
    Button,
    Card,
    CardContent,
    InputAdornment,
    SvgIcon,
    TextField,
    Typography
} from '@mui/material'
import { ChangeEventHandler, MouseEventHandler } from 'react'
import { Download as DownloadIcon } from 'src/icons/download'
import { Search as SearchIcon } from 'src/icons/search'
import { Upload as UploadIcon } from 'src/icons/upload'

type ToolbarProps = {
    title: string
    handleImport?: Function | null
    handleExport?: Function | null
    handleCreate?: MouseEventHandler<HTMLAnchorElement> | null
    handleChangeSearch?: ChangeEventHandler<HTMLInputElement>
}

export default function Toolbar({
    title,
    handleChangeSearch = null,
    handleImport = null,
    handleExport = null,
    handleCreate = null
}: ToolbarProps) {
    return (
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
                    {handleImport &&
                        <Button
                            startIcon={(<UploadIcon fontSize="small" />)}
                            sx={{ mr: 1 }}
                        >
                            Importar
                        </Button>
                    }
                    {handleExport &&
                        <Button
                            startIcon={(<DownloadIcon fontSize="small" />)}
                            sx={{ mr: 1 }}
                        >
                            Exportar
                        </Button>
                    }
                    {handleCreate &&
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleCreate}
                            href=""
                        >
                            Agregar
                        </Button>
                    }
                </Box>
            </Box>
            {handleChangeSearch &&
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
                                    onChange={handleChangeSearch}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            }
        </Box>
    )
}