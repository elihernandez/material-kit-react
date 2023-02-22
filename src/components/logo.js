import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'

export const Logo = styled((props) => {
    const { variant, ...other } = props

    const color = variant === 'light' ? '#C1C4D6' : '#5048E5'

    return (
        <img src="https://www.recursoiglesia.com/logo_white.png" alt="Logo recursoiglesia" width="100%" />
    )
})``

Logo.defaultProps = {
    variant: 'primary'
}

Logo.propTypes = {
    variant: PropTypes.oneOf(['light', 'primary'])
}
