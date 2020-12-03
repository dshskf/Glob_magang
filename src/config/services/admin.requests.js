import axios from 'axios'
import { RootAdmin } from './config'

const postServices = (data, uri) => {    
    const promise = new Promise((resolve, reject) => {
        axios.post(RootAdmin + uri, data)
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