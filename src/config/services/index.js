import postServices from './postServices'
import postSendMessageOtpServices from './postSendMessageOtpServices'
import postGetMessageOtpServices from './postGetMessageOtpServices'
import getServices from './getServices';

// POST
const postQuery = (data) => postServices(data)
const postSendMessageOTP = (data) => postSendMessageOtpServices(data);
const postGetMessageOTP = (data) => postGetMessageOtpServices(data);

// GET
const getKurs = () => getServices();

const API = {   
    postQuery,
    getKurs,
    postSendMessageOTP,
    postGetMessageOTP
}

export default API;