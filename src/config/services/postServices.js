import axios from 'axios'
import { RootPathSelect } from './config'

const postServices = (data) => {
    const promise = new Promise ((resolve, reject) => {
        axios.post(RootPathSelect, data)
            .then((res) => {
                resolve(res);
            }, (error) => {
                reject(error);
            })
    })
    return promise;
}

export default postServices;