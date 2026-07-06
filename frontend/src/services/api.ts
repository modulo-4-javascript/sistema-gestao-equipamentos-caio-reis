// AULA 07: descomente este arquivo para criar a instância do Axios usada pelos services.
import axios from 'axios'

export const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
})

