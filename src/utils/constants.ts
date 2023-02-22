export const env = process.env.NODE_ENV
export const API_URL = env === 'development' ? 'http://localhost:3000/api' : 'https://www.recursoiglesia.com/api'