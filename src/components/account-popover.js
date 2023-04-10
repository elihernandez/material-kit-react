import { Box, MenuItem, MenuList, Popover, Typography } from '@mui/material'
import PropTypes from 'prop-types'

export const AccountPopover = (props) => {
    const { anchorEl, onClose, open, ...other } = props

    const handleSignOut = async () => {

    }

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom'
            }}
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: { width: '300px' }
            }}
            {...other}
        >
            <Box
                sx={{
                    py: 1.5,
                    px: 2
                }}
            >
                <Typography variant="overline">
                    Cuenta
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    recursoiglesia
                </Typography>
            </Box>
            <MenuList
                disablePadding
                sx={{
                    '& > *': {
                        '&:first-of-type': {
                            borderTopColor: 'divider',
                            borderTopStyle: 'solid',
                            borderTopWidth: '1px'
                        },
                        padding: '12px 16px'
                    }
                }}
            >
                <MenuItem onClick={handleSignOut}>
                    Cerrar sesión
                </MenuItem>
            </MenuList>
        </Popover>
    )
}

AccountPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired
}
