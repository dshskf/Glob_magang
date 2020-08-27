import axios from 'axios'
import { RootSendOtp } from './config'

const postSendMessageOTPServices = (data) => {
    const promise = new Promise ((resolve, reject) => {
        axios.post(RootSendOtp, data)
            .then((res) => {
                resolve(res);
            }, (error) => {
                reject(error);
            })
    })
    return promise;
}
export default postSendMessageOTPServices;