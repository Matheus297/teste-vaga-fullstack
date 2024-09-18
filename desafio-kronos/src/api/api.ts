import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:3001'
})


export const getUsers = (page?: number, limit?: number) => {
    return new Promise((resolve, reject) => {
        try {
            const response = api.get(`/users?page=${page}&limit=40`)
            resolve(response)
        } catch (error) {
            reject(error) 
        }
    })
}