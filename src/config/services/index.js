import postServices from './postServices'
import postSendMessageOtpServices from './postSendMessageOtpServices'
import postGetMessageOtpServices from './postGetMessageOtpServices'
import getServices from './getServices';
import { default as adminRequest } from './admin.requests'


// POST
const postQuery = (data) => postServices(data)
const postSendMessageOTP = (data) => postSendMessageOtpServices(data);
const postGetMessageOTP = (data) => postGetMessageOtpServices(data);
const postAdmin = (data, uri, token) => adminRequest(data, uri, token);

// GET
const getKurs = () => getServices();

const API = {
    postQuery,
    getKurs,
    postSendMessageOTP,
    postGetMessageOTP,
    postAdmin,
}

export default API;