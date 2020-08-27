import axios from 'axios'
import { RootKurs } from './config'

const getServices = () => {
    const promise = new Promise ((resolve, reject) => {
        axios.get(RootKurs)
            .then((res) => {
                resolve(res);
            }, (error) => {
                reject(error);
            })
    })
    return promise;
}

export default getServices;