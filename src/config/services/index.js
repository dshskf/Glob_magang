import postServices from './postServices'
import postSendMessageOtpServices from './postSendMessageOtpServices'
import postGetMessageOtpServices from './postGetMessageOtpServices'
import getServices from './getServices';
import { default as adminRequest } from './admin.requests'
import { default as superAdminRequest } from './superAdmin.request'


// POST
const postQuery = (data) => postServices(data)
const postSendMessageOTP = (data) => postSendMessageOtpServices(data);
const postGetMessageOTP = (data) => postGetMessageOtpServices(data);

const postAdmin=(data,uri) => adminRequest(data,uri);
const postSuperAdmin = (data,uri) => superAdminRequest(data,uri);

// GET
const getKurs = () => getServices();

const API = {
    postQuery,
    getKurs,
    postSendMessageOTP,
    postGetMessageOTP,
    postAdmin,
    postSuperAdmin
}

export default API;