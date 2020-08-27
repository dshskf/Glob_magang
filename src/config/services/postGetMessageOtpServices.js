import axios from 'axios'
import { RootGetOtp } from './config'

const postGetMessageOTPServices = (data) => {
    const promise = new Promise ((resolve, reject) => {
        axios.post(RootGetOtp, data)
            .then((res) => {
                resolve(res);
            }, (error) => {
                reject(error);
            })
    })
    return promise;
}
export default postGetMessageOTPServices;