import axios from 'axios'
import { RootAdmin } from './config'

const postServices = (data, uri) => {
    const promise = new Promise((resolve, reject) => {
        const accessToken = localStorage.getItem('access_token')
        const refreshToken = localStorage.getItem('refresh_token')

        let options = accessToken && {
            headers: {
                'authorization': accessToken,
                're-authorization': refreshToken
            }
        }

        axios.interceptors.request.use(
            config => {
                return config;
            },
            error => {
                reject(error)
            }
        );
        axios.interceptors.response.use(
            async (response) => {
                if (response.data.newToken) {
                    localStorage.setItem('access_token', response.data.access_token)
                    localStorage.setItem('refresh_token', response.data.refresh_token)

                    window.stop()
                    window.location.reload()
                    resolve(response)
                } else {
                    if (response.data.status === 'success') {
                        // console.log("Success on :" + response.config.url)
                        return response
                    }
                    else {
                        console.log("Error on :" + response.config.url)
                        return response
                    }
                }
            },
            (error) => {
                console.log("Error on :" + error)
                return reject(error);
            }
        );


        axios.post(RootAdmin + uri, data, options)
            .then((res) => {
                // if (res.data) {
                //     if (res.data.logoutAction) {
                //         localStorage.clear()
                //         window.stop()
                //         window.location.reload()
                //     }
                // }
                resolve(res);
            }, (error) => {
                console.log("Error on :" + RootAdmin + uri)
                reject(error);
            })
    })
    return promise;
}

export default postServices;