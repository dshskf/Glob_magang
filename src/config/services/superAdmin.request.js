import axios from 'axios'
import { RootSuperAdmin } from './config'

const postServices = (data, uri) => {    
    const promise = new Promise((resolve, reject) => {
        axios.post(RootSuperAdmin + uri, data)
            .then((res) => {
                console.log(res)
                resolve(res);
            }, (error) => {
                reject(error);
            })
    })
    return promise;
}

export default postServices;