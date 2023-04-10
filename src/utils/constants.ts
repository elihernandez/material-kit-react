import axios from 'axios'

export const env = process.env.NODE_ENV
export const API_URL = env === 'development' ? 'http://localhost:3002/api' : 'https://www.recursoiglesia.com/api'
//export const API_URL = env === 'development' ? 'https://www.recursoiglesia.com/api' : 'https://www.recursoiglesia.com/api'

export const paths = {
    api: {
        importDbData: `${API_URL}/import/dbdata`,
        importTemplatesData: `${API_URL}/import/dbtemplates`,
        importMultitracksData: `${API_URL}/import/dbmultitracks`,
        newsletterSubscriber: `${API_URL}/newsletterSubscriber`,
        multitracks: `${API_URL}/multitrack`,
        templates: `${API_URL}/template`,
        softwares: `${API_URL}/software`,
        requests: `${API_URL}/multitrackRequest`,
        donwloads: `${API_URL}/download`,
        categories: `${API_URL}/category`,
        products: `${API_URL}/product`,
    }
}

export const fetcher = url => axios.get(url).then(res => res.data)