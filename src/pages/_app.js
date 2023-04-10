import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import Head from 'next/head'
import { theme } from '../theme'
import SnackbarApp from '../components/Snackbar'

const App = ({ Component, pageProps }) => {
    const getLayout = Component.getLayout ?? ((page) => page)

    return (
        <>
            <Head>
                <title>
                    Panel Recurso Iglesia
                </title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {getLayout(<Component />)}
                <SnackbarApp />
            </ThemeProvider>
        </>
    )
}

export default App
