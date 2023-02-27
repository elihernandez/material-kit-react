export const env = process.env.NODE_ENV
export const API_URL = env === 'development' ? 'http://localhost:3002/api' : 'https://www.recursoiglesia.com/api'
//export const API_URL = env === 'development' ? 'https://www.recursoiglesia.com/api' : 'https://www.recursoiglesia.com/api'