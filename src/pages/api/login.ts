import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { API_URL } from 'src/utils/constants'
import { setCookie } from 'cookies-next'
const CryptoJS = require('crypto-js')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const data = req.body
            const response = await axios.get(`${API_URL}/auth/signin`, {
                params: data
            })

            if (response.data.isValid) {
                const token = CryptoJS.AES.encrypt(process.env.SECRET_PASS, process.env.SECRET_KEY).toString()
                setCookie(process.env.PRI_TOKEN, token, { req, res, maxAge: 60 * 60 * 24, secure: true, httpOnly: true })
            }

            res
                .status(200)
                .json(response.data)
        } catch (e) {
            console.log(e)
            res.status(500)
            res.json(e)
        }
    } else {
        res
            .status(405)
            .json({ message: 'We only support GET' })
    }
}