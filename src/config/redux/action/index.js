import API from '../../../config/services';
import React from 'react'
import { encrypt } from '../../lib';
import NumberFormat from 'react-number-format';
import { storage } from '../../firebase';
import axios from 'axios'


export const loginUserAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'login')
            .then(res => {
                console.log(res)
                let status = res.data.status;
                let dataUser = Object.create(null);
                if (status === "success") {
                    localStorage.setItem('access_token', res.data.token.access_token)
                    localStorage.setItem('refresh_token', res.data.token.refresh_token)
                    let dt = [];
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataUser = {
                                status: encrypt("success"),
                                username: encrypt(dt[index].username),
                                role: encrypt(dt[index].role),
                                id: encrypt(dt[index].id),
                                company_id: encrypt(dt[index].company_id),
                                company_name: encrypt(dt[index].nama_perusahaan),
                                tipe_bisnis: encrypt(dt[index].tipe_bisnis + ""),
                                nama_tipe_bisnis: encrypt(dt[index].nama),
                                sa_role: encrypt(dt[index].sa_role),
                                sa_divisi: encrypt(dt[index].sa_divisi + ""),
                                id_sales_registered: dt[index].kode_sales !== null ? encrypt(dt[index].kode_sales) : encrypt(""),
                                id_company_registered: dt[index].kode_seller !== null ? encrypt(dt[index].kode_seller) : encrypt("")
                            }
                        )
                    })
                } else {
                    dataUser = {
                        status: encrypt("error")
                    }
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataUser)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getKotaSeller = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getKotaSeller')
            .then(res => {
                let status = res.data.status;
                let dataKota = Object.create(null);
                if (status === "success") {
                    let dt = [];
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataKota = {
                                kota: encrypt(dt[index].kota)
                            }
                        )
                    })
                } else {
                    dataKota = {
                        status: encrypt("error")
                    }
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataKota)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getKodeSalesLoginAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                kode_sales: (dt[index].kode_sales)
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getPassword = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                password: dt[index].password.substring(0, dt[index].password.length - 1)
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const loginSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'login')
            .then(res => {
                let status = res.data.status;
                let dataUser = Object.create(null);
                if (status === "success") {
                    localStorage.setItem('access_token', res.data.token.access_token)
                    localStorage.setItem('refresh_token', res.data.token.refresh_token)
                    let dt = [];
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataUser = {
                                status: encrypt("success"),
                                username: encrypt(dt[index].username),
                                role: encrypt(dt[index].role),
                                id: encrypt(dt[index].id),
                                company_id: encrypt(dt[index].company_id),
                                company_name: encrypt(dt[index].nama_perusahaan),
                                tipe_bisnis: encrypt(dt[index].tipe_bisnis + ""),
                                sa_role: encrypt(dt[index].sa_role)
                            }
                        )
                    })
                } else {
                    dataUser = {
                        status: encrypt("error")
                    }
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataUser)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataUsersAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataUsersAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].create_date = user.create_date,
                            dt[index].filterby = user.company_status,
                            dt[index].pure_status = user.company_status,
                            dt[index].status =
                            <center>
                                <div className={getBadge(user.company_status)}>{user.company_status === 'A' ? 'Aktif'
                                    : user.company_status === 'R' ? 'Nonaktif' : 'Belum Aktif'}</div>
                            </center>
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedUserAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedUserAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                company_name: dt[index].nama_perusahaan,
                                status_perusahaan: encrypt(dt[index].status),
                                create_date: dt[index].create_date,
                                tipe_bisnis: dt[index].tipe_bisnis_nama,
                                id_tipe_bisnis: dt[index].tipe_bisnis,
                                // alamat: dt[index].alamat,
                                // kelurahan: dt[index].kelurahan,
                                // kecamatan: dt[index].kecamatan,
                                // kota: dt[index].kota,
                                // provinsi: dt[index].provinsi,
                                // kodepos:dt[index].kodepos,
                                telepon: dt[index].no_telp,
                                email: dt[index].email,
                                npwp: encrypt(dt[index].no_npwp),
                                siup: encrypt(dt[index].no_siup),
                                dokumen: encrypt(dt[index].dokumen_pendukung),
                                jml_akun: encrypt(dt[index].jumlah_akun),
                                is_blacklist: dt[index].is_blacklist,
                                blacklist_by: dt[index].blacklist_by,
                                id_blacklist: dt[index].id_blacklist,
                                notes_blacklist: dt[index].notes_blacklist,
                                buyer_number_mapping: dt[index].buyer_number_mapping
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedUserSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                company_name: dt[index].nama_perusahaan,
                                status_perusahaan: encrypt(dt[index].status),
                                create_date: dt[index].create_date,
                                tipe_bisnis: dt[index].tipe_bisnis_nama,
                                id_tipe_bisnis: dt[index].tipe_bisnis,
                                // alamat: dt[index].alamat,
                                // kelurahan: dt[index].kelurahan,
                                // kecamatan: dt[index].kecamatan,
                                // kota: dt[index].kota,
                                // provinsi: dt[index].provinsi,
                                // kodepos:dt[index].kodepos,
                                telepon: dt[index].no_telp,
                                email: dt[index].email,
                                npwp: encrypt(dt[index].no_npwp),
                                siup: encrypt(dt[index].no_siup),
                                dokumen: encrypt(dt[index].dokumen_pendukung),
                                jml_akun: encrypt(dt[index].jumlah_akun),
                                is_blacklist: dt[index].is_blacklist,
                                blacklist_by: dt[index].blacklist_by,
                                id_blacklist: dt[index].id_blacklist,
                                notes_blacklist: dt[index].notes_blacklist,
                                kode_seller: dt[index].kode_seller
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedMappingAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedMappingAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                company_name: dt[index].nama_perusahaan,
                                status_perusahaan: encrypt(dt[index].status),
                                create_date: dt[index].create_date,
                                tipe_bisnis: dt[index].tipe_bisnis_nama,
                                id_tipe_bisnis: dt[index].tipe_bisnis,
                                buyer_number_mapping: dt[index].buyer_number_mapping
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedMappingSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                company_name: dt[index].nama_perusahaan,
                                status_perusahaan: encrypt(dt[index].seller_status),
                                create_date: dt[index].create_date,
                                tipe_bisnis: dt[index].tipe_bisnis_nama,
                                kode_seller: dt[index].kode_seller
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedSalesHandlerAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedSalesHandlerAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama: dt[index].nama,
                                kode_sales: dt[index].kode_sales,
                                id_sales: dt[index].id_sales
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedKodeCustomerAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                buyer_number_mapping: dt[index].buyer_number_mapping
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedKodeSellerAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                kode_seller: dt[index].kode_seller
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedUserRegisteredAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedUserRegisteredAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama_user: dt[index].nama,
                                no_ktp_user: dt[index].no_ktp,
                                email_user: dt[index].email,
                                no_hp_user: dt[index].no_hp,
                                username_user: dt[index].username,
                                status_user: dt[index].status,
                                role_user: dt[index].role,
                                is_blacklist: dt[index].is_blacklist,
                                id_blacklist: dt[index].id_blacklist,
                                blacklist_by: dt[index].blacklist_by,
                                company_blacklist_by: dt[index].nama_perusahaan,
                                nama_type_blacklist: dt[index].nama_type_blacklist,
                                notes_blacklist: dt[index].notes_blacklist,
                                create_date_user: dt[index].create_date
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataRegisteredAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataRegisteredAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataAlamatAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataAlamatAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].alamat = user.alamat + ", " + user.kelurahan + ", " + user.kecamatan + ", " + user.kota + ", " + user.provinsi + " " + user.kodepos,
                            dt[index].status_shipto = user.shipto_active,
                            dt[index].status_billto = user.billto_active,
                            (dt[index].status_shipto === 'Y') ? dt[index].status_shipto = <center><div><span className="badge badge-pill badge-success">✓</span></div></center> : dt[index].status_shipto = <center><div><span className="badge badge-pill badge-danger">x</span></div></center>,
                            (dt[index].status_billto === 'Y') ? dt[index].status_billto = <center><div><span className="badge badge-pill badge-success">✓</span></div></center> : dt[index].status_billto = <center><div><span className="badge badge-pill badge-danger">x</span></div></center>
                        )
                    })
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataAlamatPengguna = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataAlamatPengguna')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].alamat = user.alamat + ", " + user.kelurahan + ", " + user.kecamatan + ", " + user.kota + ", " + user.provinsi + " " + user.kodepos,
                            dt[index].status_shipto = user.shipto_active,
                            dt[index].status_billto = user.billto_active,
                            (dt[index].status_shipto === 'Y') ? dt[index].status_shipto = <center><div><span className="badge badge-pill badge-success">✓</span></div></center> : dt[index].status_shipto = <center><div><span className="badge badge-pill badge-danger">x</span></div></center>,
                            (dt[index].status_billto === 'Y') ? dt[index].status_billto = <center><div><span className="badge badge-pill badge-success">✓</span></div></center> : dt[index].status_billto = <center><div><span className="badge badge-pill badge-danger">x</span></div></center>
                        )
                    })
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedAlamatMappingAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedAlamatMappingAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: dt[index].id,
                                alamat: dt[index].alamat,
                                kelurahan: dt[index].kelurahan,
                                kecamatan: dt[index].kecamatan,
                                kota: dt[index].kota,
                                provinsi: dt[index].provinsi,
                                kodepos: dt[index].kodepos,
                                no_telp: dt[index].no_telp,
                                kode_shipto_customer: dt[index].kode_shipto_customer,
                                kode_billto_customer: dt[index].kode_billto_customer
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataPaymentListingAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataPaymentListingAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedPaymentAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedPaymentAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: dt[index].id,
                                nama: dt[index].payment_name,
                                deskripsi: dt[index].deskripsi,
                                status: dt[index].status
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedPaymentSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedPaymentSuperAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: dt[index].id,
                                nama_perusahaan: dt[index].nama_perusahaan,
                                nama: dt[index].payment_name,
                                deskripsi: dt[index].deskripsi,
                                status: dt[index].status
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateKodeMappingAlamat = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateKodeMappingAlamat')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateStatusPayment = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateStatusPayment')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateStatusPaymentAdmin = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateStatusPaymentAdmin')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}


export const getDataTypeBlackList = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataTypeBlackList')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataTypeCancelReason = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.data;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const showBlacklistBy = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'showBlacklistBy')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama_perusahaan: dt[index].nama_perusahaan
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const showJenisBlacklist = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'showJenisBlacklist')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama: dt[index].nama
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateOngkir = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateUserStatus = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateUserStatus')
            .then(res => {
                let status = res.data.status;
                // console.log("in here with Status :"+status)
                // console.log(res.data)
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertTransactionReceived = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getBadge = (status) => {
    return status === 'A' ? 'mb-2 mr-2 badge badge-success' :
        status === 'I' ? 'mb-2 mr-2 badge badge-secondary' : 'mb-2 mr-2 badge badge-danger'
}

export const getBadgeTransaction = (status) => {
    return status === 'UNPAID' ? 'mb-2 mr-2 badge badge-danger' : 'mb-2 mr-2 badge badge-success'
}

export const getBadgeBarang = (status) => {
    return status === 'I' ? 'mb-2 mr-2 badge badge-danger' :
        status === 'A' ? 'mb-2 mr-2 badge badge-success' :
            status === 'C' ? 'mb-2 mr-2 badge badge-primary' :
                status === 'N' ? 'mb-2 mr-2 badge badge-alternate' :
                    'mb-2 mr-2 badge badge-warning'
}

export const getBadgeStatusPayment = (status) => {
    return status === 'A' ? 'mb-2 mr-2 badge badge-success' :
        status === 'C' ? 'mb-2 mr-2 badge badge-primary' :
            status === 'I' ? 'mb-2 mr-2 badge badge-danger' : 'mb-2 mr-2 badge badge-warning'
}

export const getDataTransactionsAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataTransactionsAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].id_transaction = user.id_transaction,
                            dt[index].create_date = user.create_date,
                            dt[index].update_date = user.update_date,
                            dt[index].status = user.status === 'WAITING' ? 'Menunggu'
                                : user.status === 'ONGOING' ? 'Diproses'
                                    : user.status === 'SHIPPED' ? 'Dikirim'
                                        : user.status === 'RECEIVED' ? 'Diterima'
                                            : user.status === 'COMPLAINED' ? 'Dikeluhkan'
                                                : user.status === 'CANCELED' ? 'Dibatalkan' : 'Selesai',
                            dt[index].filterby = user.status,
                            dt[index].filterbypayment = user.status_payment,
                            dt[index].status_payment =
                            <div className={getBadgeTransaction(user.status_payment)}>{user.status_payment === 'UNPAID' ? 'Belum Lunas'
                                : 'Lunas'}</div>
                        )
                    })
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedTransactionAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    console.log(dt)
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                id_transaction: dt[index].id_transaction,
                                id_transaction_ref: dt[index].id_transaction_ref,
                                foto_transaction_ref: dt[index].foto_transaction_ref,
                                bukti_bayar: dt[index].bukti_bayar,
                                tanggal_bayar: dt[index].tanggal_bayar,
                                pemilik_rekening: dt[index].pemilik_rekening,
                                company_name_transaction: dt[index].nama_perusahaan,
                                company_email_transaction: dt[index].company_email,
                                company_contact_transaction: dt[index].no_telp,
                                company_type_bisnis_transaction: dt[index].company_type_bisnis_transaction,
                                tipe_bisnis: dt[index].tipe_bisnis,
                                status: dt[index].status,
                                status_payment: dt[index].status_payment,
                                payment_name: dt[index].payment_name,
                                create_date: dt[index].create_date,
                                update_date: dt[index].update_date,
                                date_ongoing: dt[index].date_ongoing,
                                date_onshipped: dt[index].date_shipped,
                                date_onreceived: dt[index].date_received,
                                date_oncomplained: dt[index].date_complained,
                                date_onfinished: dt[index].date_finished,
                                date_oncanceled: dt[index].date_canceled,
                                date_confirm_admin: dt[index].date_confirm_admin,
                                log_logistik: dt[index].log_logistik,
                                username: dt[index].username,
                                nama: dt[index].nama,
                                email: dt[index].email,
                                telepon: dt[index].no_hp,
                                total: dt[index].total,
                                total_with_ongkir: dt[index].total_with_ongkir,
                                ongkos_kirim: dt[index].ongkos_kirim,
                                kurs_rate: dt[index].kurs_rate,
                                shipto_id: dt[index].shipto_id,
                                billto_id: dt[index].billto_id,
                                cancel_reason: dt[index].cancel_reason,
                                approval_by_sales: dt[index].approval_by_sales,
                                approval_by_admin: dt[index].approval_by_admin,
                                id_sales: dt[index].id_sales,
                                buyer_number_mapping: dt[index].buyer_number_mapping,
                                tgl_permintaan_kirim: dt[index].tgl_permintaan_kirim,
                                ppn_seller: dt[index].ppn_seller
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedSalesTransactionAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama_sales: dt[index].nama,
                                kode_sales: dt[index].kode_sales
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedAlamatTransactionAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedAlamatTransactionAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                alamat: dt[index].alamat,
                                kelurahan: dt[index].kelurahan,
                                kecamatan: dt[index].kecamatan,
                                kota: dt[index].kota,
                                provinsi: dt[index].provinsi,
                                kodepos: dt[index].kodepos,
                                no_telp: dt[index].no_telp
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedOrderAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.data;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedTransactionBuyerSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedTransactionBuyerSuperAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                id_transaction: dt[index].id_transaction,
                                company_name_transaction: dt[index].nama_perusahaan,
                                company_email_transaction: dt[index].company_email,
                                company_contact_transaction: dt[index].no_telp,
                                status: dt[index].status,
                                status_payment: dt[index].status_payment,
                                create_date: dt[index].create_date,
                                update_date: dt[index].update_date,
                                username: dt[index].username,
                                nama: dt[index].nama,
                                email: dt[index].email,
                                telepon: dt[index].no_hp,
                                company_type_bisnis: dt[index].tipe_bisnis_buyer,
                                shipto_id: dt[index].shipto_id,
                                billto_id: dt[index].billto_id,
                                cancel_reason: dt[index].cancel_reason
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedTransactionSellerSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedTransactionSellerSuperAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                company_id_seller_transaction: dt[index].id,
                                company_name_seller_transaction: dt[index].nama_perusahaan,
                                company_email_seller_transaction: dt[index].company_email,
                                company_contact_seller_transaction: dt[index].no_telp,
                                company_seller_type_bisnis: dt[index].tipe_bisnis_seller,
                                kode_seller: dt[index].kode_seller
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataTransactionComplainedAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.data;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateTransactionStatus = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataOngkirAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataOngkirAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedOngkirAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedOngkirAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                nama_kota: dt[index].nama_kota,
                                nama_provinsi: dt[index].nama_provinsi,
                                satuan: dt[index].satuan,
                                harga: dt[index].harga
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataBarangAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataBarangAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].update_date = user.update_date,
                            dt[index].clear_price = user.price,
                            dt[index].price = <NumberFormat value={user.price} displayType={'text'} thousandSeparator={true} prefix={'USD '}></NumberFormat>,
                            dt[index].filterby = user.category_id,
                            dt[index].flagstatus = user.status,
                            dt[index].temporary = user.status_master,
                            dt[index].status =
                            (dt[index].temporary === 'I') ?
                                <div className={getBadgeBarang('N')}>Nonaktif</div>
                                : <div className={getBadgeBarang(user.status)}>
                                    {user.status === 'A' ? 'Tersedia' :
                                        user.status === 'C' ? 'Proses Konfirmasi' :
                                            user.status === 'R' ? 'Ditolak' : 'Tidak Tersedia'}</div>
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataBarangAdmin = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataBarangAdmin')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].update_date = user.update_date,
                            dt[index].clear_price = user.price,
                            dt[index].price = <NumberFormat value={user.price} displayType={'text'} thousandSeparator={true} prefix={'USD '}></NumberFormat>,
                            dt[index].filterby = user.category_id,
                            dt[index].flagstatus = user.status,
                            dt[index].temporary = user.status_master,
                            dt[index].status =
                            (dt[index].temporary === 'I') ?
                                <div className={getBadgeBarang('N')}>Nonaktif</div>
                                : <div className={getBadgeBarang(user.status)}>
                                    {user.status === 'A' ? 'Tersedia' :
                                        user.status === 'C' ? 'Proses Konfirmasi' :
                                            user.status === 'R' ? 'Ditolak' : 'Tidak Tersedia'}</div>
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}


export const getDataDetailedBarangAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedBarangAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                status: dt[index].status,
                                status_master: dt[index].status_master,
                                barang_id: encrypt(dt[index].barang_id),
                                price: dt[index].price,
                                price_terendah: dt[index].price_terendah,
                                foto: dt[index].foto,
                                deskripsi: dt[index].deskripsi,
                                departemen: dt[index].departemen,
                                update_by: dt[index].update_by,
                                update_date: dt[index].update_date,
                                nama: dt[index].nama,
                                kategori: dt[index].kategori,
                                berat: dt[index].berat,
                                volume: dt[index].volume,
                                nama_perusahaan: dt[index].nama_perusahaan,
                                nama_alias: dt[index].nama_alias,
                                alias: dt[index].alias,
                                minimum_pembelian: dt[index].jumlah_min_beli,
                                minimum_nego: dt[index].jumlah_min_nego,
                                persen_nego_1: dt[index].persen_nego_1,
                                persen_nego_2: dt[index].persen_nego_2,
                                persen_nego_3: dt[index].persen_nego_3,
                                kode_barang: dt[index].kode_barang,
                                nominal: Number(dt[index].nominal)
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedBarangAdmin = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedBarangAdmin')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                status: dt[index].status,
                                status_master: dt[index].status_master,
                                barang_id: encrypt(dt[index].barang_id),
                                price: dt[index].price,
                                price_terendah: dt[index].price_terendah,
                                foto: dt[index].foto,
                                deskripsi: dt[index].deskripsi,
                                departemen: dt[index].departemen,
                                update_by: dt[index].update_by,
                                update_date: dt[index].update_date,
                                nama: dt[index].nama,
                                kategori: dt[index].kategori,
                                berat: dt[index].berat,
                                volume: dt[index].volume,
                                nama_perusahaan: dt[index].nama_perusahaan,
                                nama_alias: dt[index].nama_alias,
                                alias: dt[index].alias,
                                minimum_pembelian: dt[index].jumlah_min_beli,
                                minimum_nego: dt[index].jumlah_min_nego,
                                persen_nego_1: dt[index].persen_nego_1,
                                persen_nego_2: dt[index].persen_nego_2,
                                persen_nego_3: dt[index].persen_nego_3,
                                kode_barang: dt[index].kode_barang,
                                nominal: Number(dt[index].nominal)
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedBarangSuperAdminOnConfirmAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedBarangSuperAdminOnConfirmAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id_from_master: encrypt(dt[index].id_from_master),
                                id: encrypt(dt[index].id),
                                status: dt[index].status,
                                barang_id: encrypt(dt[index].barang_id),
                                price: dt[index].price,
                                price_terendah: dt[index].price_terendah,
                                foto: dt[index].foto,
                                deskripsi: dt[index].deskripsi,
                                update_by: dt[index].update_by,
                                update_date: dt[index].update_date,
                                nama: dt[index].nama,
                                kategori: dt[index].kategori,
                                berat: dt[index].berat,
                                volume: dt[index].volume,
                                nama_perusahaan: dt[index].nama_perusahaan,
                                nama_alias: dt[index].nama_alias,
                                alias: dt[index].alias,
                                minimum_pembelian: dt[index].jumlah_min_beli,
                                minimum_nego: dt[index].jumlah_min_nego,
                                status_master: dt[index].status_master,
                                persen_nego_1: dt[index].persen_nego_1,
                                persen_nego_2: dt[index].persen_nego_2,
                                persen_nego_3: dt[index].persen_nego_3,
                                kode_barang: dt[index].kode_barang,
                                nominal: Number(dt[index].nominal)
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCategoryAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCategoryAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCategoryAdminPengguna = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCategoryAdminPengguna')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCategorySales = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCategorySales')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}


export const getDataSelectedCategoryAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataSelectedCategoryAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataPaymentAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataPaymentAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataPaymentAdmin = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataPaymentAdmin')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedMasterPaymentAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedMasterPaymentAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: dt[index].id,
                                nama_payment: dt[index].payment_name,
                                deskripsi_payment: dt[index].deskripsi,
                                durasi_payment: dt[index].durasi
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterPayment = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateMasterPayment')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertMasterPayment = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertMasterPayment')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataSatuanAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataSatuanAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedMasterSatuanAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedMasterSatuanAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: dt[index].id,
                                nama: dt[index].nama,
                                alias: dt[index].alias
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertMasterSatuan = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertMasterSatuan')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterSatuan = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, "updateMasterSatuan")
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateHargaOngkir = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateHargaOngkir')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getKursAPI = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.getKurs()
            .then(res => {
                let kurs_rupiah = res.data.rates.IDR;
                resolve(kurs_rupiah)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                reject(false)
            })
    })
}

export const getKursAPIManual = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getKursAPIManual')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                nominal: dt[index].nominal
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getstragg = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                str_agg: dt[index].string_agg
                            }
                        )
                    })
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const uploadGambarBarang = (data) => (dispatch) => {
    const urlPict = storage.ref(`picture/` + data.tmpPict).put(data.tmp)
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        urlPict.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (err) => {
            var errorCode = err.code;
            var errorMessage = err.message;
            console.log(errorCode, errorMessage)
            reject(false)
        }, () => {
            urlPict.snapshot.ref.getDownloadURL()
                .then(function (downloadURL) {
                    resolve(downloadURL)
                })
        })
    })
}

export const uploadGambarBanner = (data) => (dispatch) => {
    const urlPict = storage.ref(`banner/` + data.tmpPict).put(data.tmp)
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        urlPict.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (err) => {
            var errorCode = err.code;
            var errorMessage = err.message;
            console.log(errorCode, errorMessage)
            reject(false)
        }, () => {
            urlPict.snapshot.ref.getDownloadURL()
                .then(function (downloadURL) {
                    resolve(downloadURL)
                })
        })
    })
}

export const insertListBarang = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertListBarang')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateBarangStatus = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateBarangStatus')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateBarangPPNStatus = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateBarangPPNStatus')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterBarangStatus = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateMasterBarangStatus')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataBarangCanInsert = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataBarangCanInsert')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataBarangSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataBarangSuperAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].status =
                            <center><div className={getBadgeBarang(user.status)}>{user.status === 'A' ? 'Aktif'
                                : user.status === 'I' ? 'Nonaktif' : 'Konfirmasi'}</div></center>,
                            dt[index].filterby = user.category_id
                        )
                    })
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedBarangSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedBarangSuperAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama: dt[index].nama,
                                id_kategori: dt[index].category_id,
                                nama_kategori: dt[index].nama_kategori,
                                berat: dt[index].berat,
                                volume: dt[index].volume,
                                ex: dt[index].ex,
                                status: dt[index].status,
                                create_date: dt[index].create_date,
                                update_date: dt[index].update_date,
                                id_satuan_barang_selected: dt[index].satuan,
                                satuan_barang_selected: dt[index].nama_alias,
                                alias_satuan_barang_selected: dt[index].alias
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertMasterBarang = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertMasterBarang')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertMasterBarangFromSeller = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataInserted = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataInserted = {
                                id: dt[index].id
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataInserted)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataSellerAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataSellerAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataBarangSellerAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataBarangAPIOnConfirm')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].update_date = user.update_date,
                            dt[index].clear_price = user.price,
                            dt[index].price = <NumberFormat value={user.price} displayType={'text'} thousandSeparator={true} prefix={'USD '}></NumberFormat>,
                            dt[index].filterby = user.category_id,
                            dt[index].status =
                            <div className={getBadgeBarang(user.status)}>
                                {user.status === 'A' ? 'Tersedia' :
                                    user.status === 'C' ? 'Proses Konfirmasi' :
                                        user.status === 'R' ? 'Ditolak' : 'Tidak Tersedia'}</div>,
                            dt[index].nominal = Number(user.nominal)
                        )
                    })
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertMasterCategory = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertMasterCategory')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedMasterCategoryAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedMasterCategoryAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: dt[index].id,
                                nama: dt[index].nama
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterCategory = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateMasterCategory')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterKurs = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataBlacklistAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataBlacklistAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertMasterBlacklist = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertMasterBlacklist')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedMasterBlacklistAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedMasterBlacklistAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: dt[index].id,
                                nama: dt[index].nama
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterBlacklist = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, "updateMasterBlacklist")
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataReasonAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataReasonAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertMasterReason = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertMasterReason')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedMasterReasonAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedMasterReasonAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: dt[index].id,
                                nama: dt[index].nama
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterReason = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateMasterReason')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataNegotiationAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataNegotiationAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].nama = (user.nama.length > 50 ? user.nama.substring(0, 50) + "..." : user.nama),
                            dt[index].create_date = user.create_date,
                            dt[index].jatah_nego = 3 - (user.nego_count),
                            (dt[index].jatah_nego === 1) ? dt[index].jatah_nego = <center><div><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span></div></center> :
                                (dt[index].jatah_nego === 2) ? dt[index].jatah_nego = <center><div><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span></div></center> :
                                    (dt[index].jatah_nego === 3) ? dt[index].jatah_nego = <center><div><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span></div></center> :
                                        dt[index].jatah_nego = <center><div><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span></div></center>
                        )
                    })
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedNegotiationAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    var token = []

                    dt.map((user, index) => {
                        token.push(dt[index].token)
                        return (
                            dataDetailed = {
                                id_listing_barang: dt[index].id_listing_barang,
                                status: dt[index].status,
                                company_id: dt[index].company_id,
                                token: token,
                                nama_barang: dt[index].nama_barang,
                                berat: dt[index].berat,
                                qty: dt[index].qty,
                                flag_harga_sales_nego_pertama: dt[index].flag_harga_sales_nego_pertama,
                                foto: dt[index].foto,
                                clear_price: dt[index].price,
                                clear_price_terendah: dt[index].price_terendah,
                                price: <NumberFormat value={dt[index].price} displayType={'text'} thousandSeparator={true} prefix={'USD '}></NumberFormat>,
                                price_terendah: <NumberFormat value={dt[index].price_terendah} displayType={'text'} thousandSeparator={true} prefix={'USD '}></NumberFormat>,
                                nama_perusahaan: dt[index].nama_perusahaan,
                                nego_count: dt[index].nego_count,
                                jatah_nego: 3 - dt[index].nego_count,
                                create_date: dt[index].create_date,
                                nama: dt[index].nama,
                                harga_nego: dt[index].harga_nego,
                                harga_sales: dt[index].harga_sales,
                                notes: dt[index].notes,
                                created_by: dt[index].created_by,
                                updated_by: dt[index].updated_by,
                                updated_date: dt[index].updated_date,
                                harga_nego_2: dt[index].harga_nego_2,
                                harga_sales_2: dt[index].harga_sales_2,
                                harga_nego_3: dt[index].harga_nego_3,
                                harga_sales_3: dt[index].harga_sales_3,
                                harga_final: dt[index].harga_final,
                                updated_by_2: dt[index].updated_by_2,
                                updated_by_3: dt[index].updated_by_3,
                                updated_date_2: dt[index].updated_date_2,
                                updated_date_3: dt[index].updated_date_3,
                                alias: dt[index].alias,
                                buyer_number_mapping: dt[index].buyer_number_mapping,
                                kode_barang: dt[index].kode_barang
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }

                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const showLastUpdatedNego = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama: dt[index].nama
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateNegoStatus = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedNegotiationBuyerSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedNegotiationBuyerSuperAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama_user_buyer: dt[index].nama,
                                username_buyer: dt[index].username,
                                email_buyer: dt[index].email,
                                no_hp_buyer: dt[index].no_hp,
                                company_buyer_name: dt[index].nama_perusahaan,
                                company_buyer_tipe_bisnis: dt[index].tipe_bisnis_buyer,
                                company_buyer_email: dt[index].company_email,
                                company_buyer_no_telp: dt[index].no_telp,
                                nego_count: dt[index].nego_count,
                                jatah_nego: 3 - dt[index].nego_count
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedNegotiationSellerSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                company_seller_name: dt[index].nama_perusahaan,
                                company_id_seller: dt[index].id,
                                company_seller_tipe_bisnis: dt[index].tipe_bisnis_seller,
                                company_seller_email: dt[index].company_email,
                                company_seller_no_telp: dt[index].no_telp,
                                company_seller_kode_seller: dt[index].kode_seller
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedBarangNegotiationSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedBarangNegotiationSuperAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama_barang_nego: dt[index].nama,
                                nama_kategori_barang_nego: dt[index].nama_kategori,
                                berat_barang_nego: dt[index].berat,
                                volume_barang_nego: dt[index].volume,
                                clear_price_barang_nego: dt[index].price,
                                price_barang_nego: <NumberFormat value={dt[index].price} displayType={'text'} thousandSeparator={true} prefix={'USD '}></NumberFormat>,
                                foto_barang_nego: dt[index].foto,
                                deskripsi_barang_nego: dt[index].deskripsi,
                                create_date: dt[index].create_date
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedAccountInfoAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedAccountInfoAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                username: dt[index].username,
                                nama: dt[index].nama,
                                no_ktp: dt[index].no_ktp,
                                no_nik: dt[index].no_nik,
                                no_hp: dt[index].no_hp,
                                email: dt[index].email,
                                status: dt[index].status,
                                password: dt[index].password,
                                kode_sales: dt[index].kode_sales
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedCompanyInfoAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedCompanyInfoAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama_perusahaan: dt[index].nama_perusahaan,
                                no_telp: dt[index].no_telp,
                                email: dt[index].email,
                                no_npwp: dt[index].no_npwp,
                                no_siup: dt[index].no_siup,
                                tipe_bisnis: dt[index].tipe_bisnis,
                                kode_seller: dt[index].kode_seller,
                                ppn_seller: dt[index].ppn_seller
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedCompanyInfoSuperAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedCompanyInfoSuperAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama_perusahaan: dt[index].nama_perusahaan,
                                no_telp: dt[index].no_telp,
                                email: dt[index].email,
                                no_npwp: dt[index].no_npwp,
                                no_siup: dt[index].no_siup,
                                tipe_bisnis: dt[index].tipe_bisnis
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const checkIdTransactionCanceled = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.data;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const checkIdTransactionReceivedToFinished = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.data;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataLimitHariTransaksi = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataReturned = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataReturned = {
                                limit_hari: dt[index].limit_hari
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataReturned)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const totalBeranda = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataReturned = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataReturned = {
                                total: dt[index].total
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataReturned)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const totalBerandaChart = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.data;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const sendOtp = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postSendMessageOTP(data)
            .then(res => {
                let status = res.data.successCode;
                // let desc = res.data.desc;
                let messageid = res.data.messageID
                if (status === "0") {
                    resolve(messageid)
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getOtp = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postGetMessageOTP(data)
            .then(res => {
                let status = res.data.successCode;
                // let desc = res.data.desc;
                let message = res.data.message
                let dataReturned = Object.create(null);
                if (status === "0" || status === "1") {
                    dataReturned = {
                        nohp: message.nohp,
                        text: message.text,
                        otptype: message.otptype,
                        senddate: message.senddate,
                        status: message.status
                    }
                    resolve(dataReturned)
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCompanyHandledBySales = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCompanyHandledBySales')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataUsernameAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataUsernameAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataKodeMappingAlamatAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataKodeMappingAlamatAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataKodeCustAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataKodeCustAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCheckedNomorHp = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                no_hp: dt[index].no_hp
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCheckedBarang = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCheckedBarang')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCheckedNego = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCheckedNego')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataReturned = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataReturned = {
                                total: dt[index].total
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataReturned)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCheckedKodeBarang = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCheckedKodeBarang')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataReturned = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataReturned = {
                                total: dt[index].total
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataReturned)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCheckedKodeSales = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCheckedKodeSales')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataReturned = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataReturned = {
                                total: dt[index].total
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataReturned)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCheckedKodeCust = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCheckedKodeCust')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataReturned = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataReturned = {
                                total: dt[index].total
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataReturned)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCheckedKodeAlamatMapping = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCheckedKodeAlamatMapping')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataReturned = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataReturned = {
                                total: dt[index].total
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataReturned)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCheckedKurs = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCheckedKurs')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataReturned = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataReturned = {
                                total: dt[index].total
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataReturned)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedKursAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedKursAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: dt[index].id,
                                nominal: dt[index].nominal,
                                tgl_start: dt[index].tgl_start,
                                tgl_end: dt[index].tgl_end,
                                pure_tgl_start: dt[index].pure_tgl_start,
                                pure_tgl_end: dt[index].pure_tgl_end,
                                tgl_start_edited: dt[index].tgl_start_edited,
                                tgl_end_edited: dt[index].tgl_end_edited
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataStatusMasterBarangAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                status_master: dt[index].status_master
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterUser = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateMasterUser')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterCompany = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateMasterCompany')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateMasterAlamat = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateMasterAlamat')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedAlamatCompanyAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedAlamatCompanyAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id: encrypt(dt[index].id),
                                company_alamat_selected: dt[index].alamat,
                                company_alamat_kelurahan_selected: dt[index].kelurahan,
                                company_alamat_kecamatan_selected: dt[index].kecamatan,
                                company_alamat_kota_selected: dt[index].kota,
                                company_alamat_provinsi_selected: dt[index].provinsi,
                                company_alamat_id_kelurahan_selected: dt[index].id_kelurahan,
                                company_alamat_id_kecamatan_selected: dt[index].id_kecamatan,
                                company_alamat_id_kota_selected: dt[index].id_kota,
                                company_alamat_id_provinsi_selected: dt[index].id_provinsi,
                                company_alamat_kodepos_selected: dt[index].kodepos,
                                company_alamat_telepon_selected: dt[index].no_telp
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataProvinsi = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataProvinsi')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataKota = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataKota')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataKecamatan = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataKecamatan')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataKelurahan = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataKelurahan')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getCurrentPassword = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getCurrentPassword')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                password: dt[index].password
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDivisi = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDivisi')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nama_divisi: dt[index].nama_divisi
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataSalesTransactionAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.data;
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataSalesAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataSalesAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].show_status =
                            <center><div className={getBadge(user.status)}>{user.status === 'A' ? 'Aktif'
                                : user.status === 'R' ? 'Nonaktif' : 'Belum Aktif'}</div></center>
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataDetailedSalesAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataDetailedSalesAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                id_sales: dt[index].id,
                                nama_sales: dt[index].nama,
                                no_nik_sales: dt[index].no_nik,
                                email_sales: dt[index].email,
                                no_hp_sales: dt[index].no_hp,
                                username_sales: dt[index].username,
                                id_kategori_sales: dt[index].sa_divisi,
                                password: dt[index].password,
                                status_pure: dt[index].status,
                                status_sales: (dt[index].status === 'A' ? 'Aktif' : dt[index].status === 'R' ? 'Nonaktif' : 'Belum Aktif'),
                                nama_kategori_sales: dt[index].nama_kategori,
                                sa_role_sales: dt[index].sa_role,
                                kode_sales: dt[index].kode_sales
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertMasterAkun = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertMasterAkun')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}


export const insertBarangAdmin = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertBarangAdmin')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}


export const getDataPaymentAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataPaymentAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].status =
                            <center>
                                <div className={getBadgeStatusPayment(user.status)}>{user.status === 'A' ? 'Aktif'
                                    : user.status === 'I' ? 'Nonaktif'
                                        : user.status === 'C' ? 'Proses Konfirmasi'
                                            : 'Ditolak'}</div>
                            </center>
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getPaymentList = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getPaymentList')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].status =
                            <center>
                                <div className={getBadgeStatusPayment(user.status)}>{user.status === 'A' ? 'Aktif'
                                    : user.status === 'I' ? 'Nonaktif'
                                        : user.status === 'C' ? 'Proses Konfirmasi'
                                            : 'Ditolak'}</div>
                            </center>
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}


export const insertPaymentListingSeller = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertPaymentListingSeller')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataCheckedIdPayment = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataCheckedIdPayment')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                } else {
                    // console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataKursAdminAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataKursAdminAPI')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dt[index].nominal =
                            <NumberFormat value={Number(dt[index].nominal)} displayType={'text'}
                                thousandSeparator='.' decimalSeparator=',' prefix={'  IDR '}></NumberFormat>
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dt)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertKursSeller = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertKursSeller')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const updateKursSeller = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'updateKursSeller')
            .then(res => {
                let status = res.data.status;
                if (status === "success")
                    resolve(true)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getKursActiveAPIManual = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getKursActiveAPIManual')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nominal: dt[index].nominal,
                                create_date: dt[index].create_date,
                                update_date: dt[index].update_date,
                                tgl_start: dt[index].tgl_start,
                                tgl_end: dt[index].tgl_end,
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getKursActiveAdmin = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getKursActiveAdmin')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                nominal: dt[index].nominal,
                                create_date: dt[index].create_date,
                                update_date: dt[index].update_date,
                                tgl_start: dt[index].tgl_start,
                                tgl_end: dt[index].tgl_end,
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getPPNBarang = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getPPNBarang')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                ppn_seller: dt[index].ppn_seller
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const checkFieldInsertAkun = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'checkFieldInsertAkun')
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.values;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                check_username: dt[index].check_username,
                                check_nohp: dt[index].check_nohp,
                                check_email: dt[index].check_email,
                                check_nik: dt[index].check_nik
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const checkFieldUpdateCompany = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                let dt = [];
                let dataDetailed = Object.create(null);
                if (status === "success") {
                    dt = res.data.data;
                    dt.map((user, index) => {
                        return (
                            dataDetailed = {
                                check_nohp: dt[index].check_nohp,
                                check_email: dt[index].check_email
                            }
                        )
                    })
                } else {
                    console.log("error query")
                }
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(dataDetailed)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const logoutUserAPI = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_IS_LOGIN", value: false })
        localStorage.clear()
        resolve(true)
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                reject(false)
            })
    })
}

export const sendEmailAktivasi = (data) => (dispatch) => {

    axios.post(`https://glob.co.id/External/sendEmail`, data)
        .then(res => {

        })
}

export const navigationHandler = (data) => (dispatch) => {
    dispatch({ type: "CHANGE_IS_SHOWN", value: data })
}

export const checkRenderedSidebar = (data) => (dispatch) => {
    dispatch({ type: "SET_SIDEBAR", value: data })
}


export const getNotifyData = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                let status = res.data.status;
                if (status === "success") {

                } else {
                    console.log("error query")
                }
                resolve(res.data.data)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                reject(false)
            })
    })
}

export const queryKalenderData = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'queryKalender')
            .then(res => {
                let status = res.data.status;
                if (status === "success") {
                } else {
                    console.log("error query")
                }

                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const postKalenderData = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'postKalenderData')
            .then(res => {
                let status = res.data.status;
                if (status === "success") {
                } else {
                    console.log("error query")
                }

                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getNotificationNumber = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getNotificationNumber')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getMasterBankData = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getMasterBankData')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}


export const postMasterBankData = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'postMasterBankData')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}


export const getMasterBannerData = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getMasterBannerData')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const postMasterBannerData = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'postMasterBannerData')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getRiwayatHarga = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getRiwayatHarga')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getPaymentListing = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getPaymentListing')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getKategoriUmum = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getKategoriUmum')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDokumenPengguna = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDokumenPengguna')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getTotalCountPengguna = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getTotalCountPengguna')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}



export const getDepartmentSales = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDepartmentSales')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const getDataBarangOnClose = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'getDataBarangOnClose')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}



export const postQuery = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postQuery(data)
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.data)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const deactivateRekeningBank = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'deactivateRekeningBank')
            .then(res => {
                let status = res.data.status;
                if (status === "success") {
                } else {
                    console.log("error query")
                }

                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const insertRekening = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'insertRekening')
            .then(res => {
                let status = res.data.status;
                if (status === "success") {
                } else {
                    console.log("error query")
                }

                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}

export const postHargaBarangExcel = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: "CHANGE_LOADING", value: true })
        API.postAdmin(data, 'postHargaBarangExcel')
            .then(res => {
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: true })
                resolve(res.data.values)
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                dispatch({ type: "CHANGE_LOADING", value: false })
                dispatch({ type: "CHANGE_IS_LOGIN", value: false })
                reject(false)
            })
    })
}


export const changeFetchCartUserId = (data) => (dispatch) => {
    dispatch({ type: "CHANGE_FETCH_CHAT_USER", value: data })
}

export const changeChatScreen = (data) => (dispatch) => {
    dispatch({ type: "SET_CHAT_SCREEN", value: data })
}

export const setSocketIOConnection = (data) => dispatch => {
    dispatch({ type: "SET_IO_CONNECTION", value: data })
}