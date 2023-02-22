import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import Head from 'next/head'
import Router from 'next/router'
import * as Yup from 'yup'
var bcrypt = require('bcryptjs')

const Login = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup
                .string()
                .email('Ingresa un correo electrónico válido')
                .max(255)
                .required('Correo electrónico requerido'),
            password: Yup
                .string()
                .max(255)
                .required('Contraseña requerida')
        }),
        onSubmit: (values) => handleSubmit(values)
    })

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('api/login', {
                email: values.email,
                password: values.password
            })

            if (response.data.isValid) {
                Router.replace('/')
            }
        } catch {

        }
    }

    return (
        <>
            <Head>
                <title>Iniciar sesión | Panel Recurso Iglesia</title>
            </Head>
            <Box
                component="main"
                mt={10}
            >
                <Container maxWidth="xs">
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container justifyContent="center" sx={{ mb: 5 }}>
                            <Grid item xs={8}>
                                <img src="https://www.recursoiglesia.com/logo_black.png" alt="Logo recursoiglesia" width="100%" />
                            </Grid>
                        </Grid>
                        <Box sx={{ my: 3 }}>
                            <Typography
                                color="textPrimary"
                                variant="h4"
                            >
                                Iniciar sesión
                            </Typography>
                        </Box>
                        <TextField
                            error={Boolean(formik.touched.email && formik.errors.email)}
                            fullWidth
                            helperText={formik.touched.email && formik.errors.email}
                            label="Correo electrónico"
                            margin="normal"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
                            variant="outlined"
                        />
                        <TextField
                            error={Boolean(formik.touched.password && formik.errors.password)}
                            fullWidth
                            helperText={formik.touched.password && formik.errors.password}
                            label="Contraseña"
                            margin="normal"
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.password}
                            variant="outlined"
                        />
                        <Box sx={{ py: 2 }}>
                            <Button
                                color="primary"
                                disabled={formik.isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Iniciar sesión
                            </Button>
                        </Box>
                    </form>
                </Container>
            </Box>
        </>
    )
}

export default Login
