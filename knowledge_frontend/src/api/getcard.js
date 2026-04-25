import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:8080', // 同样删掉 /api
    timeout: 5000
})

export const getcard = () => {
    return request.get('/api/cards') // 完整路径是 http://localhost:8080/api/cards
}
