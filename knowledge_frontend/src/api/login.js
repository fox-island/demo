import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:8080', // 删掉 /api
    timeout: 5000
})

export function LoginApi(username, password) {
    return request({
        url: '/api/login',   // 加上 /api 前缀
        method: 'post',
        data: {
            username: username,
            password: password
        }
    })
}

export function Register(username, password) {
    return request({
        url: '/api/register', // 加上 /api 前缀
        method: 'post',
        data: {
            username: username,
            password: password
        }
    })
}
