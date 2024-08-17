import axios from "axios";

const baseUrl = 'http://10.0.2.2:3000/auth'

const register = (user) => {
    return axios.post(`${baseUrl}/register`, user)
}

const login = (credentials) => {
    return axios.post(`${baseUrl}/login`, credentials)
}

const authService={
    register, login
}

export default authService