import AdbIcon from '@mui/icons-material/Adb'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import LinkIcon from '@mui/icons-material/Link'
import PeopleIcon from '@mui/icons-material/People'
import RequestPageIcon from '@mui/icons-material/RequestPage'
import { Box, Divider, Drawer, useMediaQuery } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Logo } from './logo'
import { NavItem } from './nav-item'

const items = [
    {
        href: '/',
        icon: (<DashboardIcon fontSize="small" />),
        title: 'Dashboard'
    },
    {
        href: '/descargas',
        icon: (<CloudDownloadIcon fontSize="small" />),
        title: 'Descargas'
    },
    {
        href: '/enlaces',
        icon: (<LinkIcon fontSize="small" />),
        title: 'Enlaces'
    },
    {
        href: '/solicitudes',
        icon: (<RequestPageIcon fontSize="small" />),
        title: 'Solicitudes'
    },
    {
        href: '/suscriptores',
        icon: (<PeopleIcon fontSize="small" />),
        title: 'Suscriptores'
    },
    {
        href: '/secuencias',
        icon: (<LibraryMusicIcon fontSize="small" />),
        title: 'Secuencias'
    },
    {
        href: '/plantillas',
        icon: (<DesignServicesIcon fontSize="small" />),
        title: 'Plantillas'
    },
    {
        href: '/programas',
        icon: (<AdbIcon fontSize="small" />),
        title: 'Programas'
    }
]

export const DashboardSidebar = (props) => {
    const { open, onClose } = props
    const router = useRouter()
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
        defaultMatches: true,
        noSsr: false
    })

    useEffect(
        () => {
            if (!router.isReady) {
                return
            }

            if (open) {
                onClose?.()
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.asPath]
    )

    const content = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                <div>
                    <Box sx={{ px: 5, py: 3, display: 'inline-flex', justifyContent: 'center' }}>
                        <NextLink
                            href="/"
                            passHref
                        >
                            <a>
                                <Logo
                                    sx={{
                                        height: 42,
                                        width: 42
                                    }}
                                />
                            </a>
                        </NextLink>
                    </Box>
                </div>
                <Divider
                    sx={{
                        borderColor: '#2D3748',
                        mb: 3
                    }}
                />
                <Box sx={{ flexGrow: 1 }}>
                    {items.map((item) => (
                        <NavItem
                            key={item.title}
                            icon={item.icon}
                            href={item.href}
                            title={item.title}
                        />
                    ))}
                </Box>
            </Box>
        </>
    )

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: 'neutral.900',
                        color: '#FFFFFF',
                        width: 280
                    }
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        )
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: 'neutral.900',
                    color: '#FFFFFF',
                    width: 280
                }
            }}
            sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
            variant="temporary"
        >
            {content}
        </Drawer>
    )
}

DashboardSidebar.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
}
