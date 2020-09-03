import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { encrypt, decrypt } from '../../../config/lib';
import {
    loginUserAPI, getKodeSalesLoginAPI, getPassword, sendOtp, getOtp, getDataCheckedNomorHp,
    updateUserStatus, loginSuperAdminAPI, postQuery
} from '../../../config/redux/action';
import {
    Input, Modal, ModalHeader, ModalBody, ModalFooter, ButtonDropdown, DropdownItem,
    DropdownMenu, DropdownToggle, FormGroup
} from 'reactstrap'
import { firebaseApp } from '../../../config/firebase/index'
// import OTPInput from "otp-input-react";
// import OTPInput from "../../../../node_modules/";
import swal from 'sweetalert';
import NumberFormat from 'react-number-format';
import ButtonCustom from '../../../component/atom/Button';
import Toast from 'light-toast';
import './login.css'
import '@firebase/messaging';

class Login extends Component {
    state = {
        username: '',
        password: '',
        allNomorHp: '',
        isOpen: false,
        nomor_hp: '',
        valueOTP: '',
        sendValueOTP: '',
        messageid: '',
        empty_username: false,
        empty_password: false,
        isOpenModalOtp: false,
        isOpenWaitingOtp: false,
        isBtnWaitOtp: true,
        isBtnConfirmOtp: false,
        isOpenViaOtp: false,
        defaultOtpVia: 'SMS',
        dataLogin: {},
        timer: '',
        viewpassword: 'password',
        logopassword: 'fa fa-eye-slash',
        id_user: '',
        kode_sales: '',
        isOpenModalKodeSales: false,
        validation_kode_sales: false,
        empty_kode_sales: false,
        passingusername: '',
        passingpassword: '',
        id_sales_registered: ''
    }

    componentDidMount() {
        this.setState({
            username: '',
            password: ''
        })
        let x = localStorage.getItem('userData');
        if (x) {
            this.props.history.push('/admin/beranda')
        }
    }

    handleChangeText = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
        if (e.target.id === 'username') {
            this.check_field_username(e.target.value)
        }
        if (e.target.id === 'password') {
            this.check_field_password(e.target.value)
        }
    }

    check_field_username = (e) => {
        if (e !== '') {
            this.setState({ empty_username: false })
        } else {
            this.setState({ empty_username: true })
        }
    }

    check_field_password = (e) => {
        if (e !== '') {
            this.setState({ empty_password: false })
        } else {
            this.setState({ empty_password: true })
        }
    }

    handleModalOtp = () => {
        this.setState({
            isOpenModalOtp: !this.state.isOpenModalOtp
        })
    }

    insertFCMToken = async (user_id, company_id) => {

        const messaging = firebaseApp.messaging()
        return messaging.requestPermission()
            .then(() => {
                console.log('Approved')
                return messaging.getToken()
            })
            .then(async token => {
                const passquery = encrypt(`
                    INSERT INTO gcm_notification_token(user_id, company_id,token)
                    values (${user_id}, ${company_id},'${token}') returning *;            
                `)
                await this.props.postData({ query: passquery }).catch(err => err)

                return token
            })
            .catch(err => {
                console.log(err)
            })
    }


    handleLoginSubmit = async () => {
        const { username, password } = this.state;
        if (username === '') {
            this.setState({ empty_username: true })
        }
        if (password === '') {
            this.setState({ empty_password: true })
        }
        if (username !== '') {
            this.setState({ empty_username: false })
        }
        if (password !== '') {
            this.setState({ empty_password: false })
        }
        if (username !== '' && password !== '') {
            // OK semua
            const passencrypt = encrypt(password);
            let passquery = encrypt("select gcm_master_user.username, gcm_master_user.role," +
                "gcm_master_user.id, gcm_master_company.id as company_id, gcm_master_company.kode_seller, " +
                "gcm_master_company.id as company_id, gcm_master_company.nama_perusahaan, gcm_master_user.kode_sales," +
                "gcm_master_company.tipe_bisnis, gcm_master_category.nama, gcm_master_user.sa_role, gcm_master_user.sa_divisi " +
                "from gcm_master_company " +
                "inner join gcm_master_user on gcm_master_company.id = gcm_master_user.company_id " +
                "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
                "where username='" + username + "' and password='" +
                passencrypt + "' and gcm_master_company.type='S' and gcm_master_user.role='admin' and gcm_master_user.status='A' " +
                "and gcm_master_company.seller_status='A'");
            const res = await this.props.loginAPI({ query: passquery }).catch(err => err);

            if (res) {

                this.setState({
                    username: '',
                    password: '',
                    isOpen: false
                })
                if (decrypt(res.status) === "success") {
                    if (decrypt(res.id_sales_registered) === '') {
                        await this.setState({ id_user: decrypt(res.id), passingusername: username, passingpassword: passencrypt })
                        this.handleCheckingKodeSales()
                    } else {
                        const token = await this.insertFCMToken(decrypt(res.id), decrypt(res.company_id))
                        if (token !== undefined) {
                            localStorage.setItem('user_token', JSON.stringify(token))
                        }
                        localStorage.setItem('userData', JSON.stringify(res))
                        swal({
                            title: "Sukses!",
                            text: "Selamat datang, " + decrypt(res.username),
                            icon: "success",
                            button: false,
                            timer: "2500"
                        }).then(() => {
                            this.props.history.push('/admin/beranda')
                            window.location.reload()
                        });
                    }
                } else {
                    // OTP
                    let passqueryusernonactive = encrypt("select gcm_master_user.username, gcm_master_user.role," +
                        "gcm_master_user.id, gcm_master_company.id as company_id, gcm_master_company.kode_seller, " +
                        "gcm_master_company.id as company_id, gcm_master_company.nama_perusahaan, gcm_master_user.kode_sales, " +
                        "gcm_master_company.tipe_bisnis, gcm_master_category.nama, gcm_master_user.sa_role, gcm_master_user.sa_divisi " +
                        "from gcm_master_company " +
                        "inner join gcm_master_user on gcm_master_company.id = gcm_master_user.company_id " +
                        "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
                        "where username='" + username + "' and password='" +
                        passencrypt + "' and gcm_master_company.type='S' and gcm_master_user.role='admin' and gcm_master_user.status='I' " +
                        "and gcm_master_company.seller_status='A'");
                    const resnonactive = await this.props.loginAPI({ query: passqueryusernonactive }).catch(err => err);
                    if (resnonactive) {
                        this.setState({
                            username: '',
                            password: '',
                            isOpen: false
                        })
                        if (decrypt(resnonactive.status) === "success") {
                            this.handleModalOtp()
                            this.setState({
                                dataLogin: resnonactive, id_sales_registered: decrypt(resnonactive.id_sales_registered),
                                id_user: decrypt(resnonactive.id), passingusername: username, passingpassword: passencrypt
                            })
                        }
                        else {
                            // superadmin
                            let passquerysuperadmin = encrypt("select gcm_master_user.username, gcm_master_user.role," +
                                "gcm_master_user.id, gcm_master_company.id as company_id," +
                                "gcm_master_company.id as company_id, gcm_master_company.nama_perusahaan," +
                                "gcm_master_company.tipe_bisnis, gcm_master_user.sa_role from " +
                                "gcm_master_user " +
                                "inner join gcm_master_company on gcm_master_user.company_id = gcm_master_company.id " +
                                "where username='" + username + "' and password='" +
                                passencrypt + "' and gcm_master_company.type='A' and gcm_master_user.role='superadmin' and gcm_master_user.status='A'");
                            const res = await this.props.loginAPISuperAdmin({ query: passquerysuperadmin }).catch(err => err);

                            if (res) {
                                this.setState({
                                    username: '',
                                    password: '',
                                })
                                if (decrypt(res.status) === "success") {        // handle response query
                                    const token = await this.insertFCMToken(decrypt(res.id), decrypt(res.company_id))
                                    if (token !== undefined) {
                                        localStorage.setItem('user_token', JSON.stringify(token))
                                    }
                                    localStorage.setItem('userData', JSON.stringify(res))
                                    swal({
                                        title: "Sukses!",
                                        text: "Selamat datang, " + decrypt(res.username),
                                        icon: "success",
                                        button: false,
                                        timer: "2500"
                                    }).then(() => {
                                        this.props.history.push('/admin/beranda')
                                        window.location.reload()
                                    });
                                } else {
                                    // status akun = 'R'
                                    const passencrypt = encrypt(password);
                                    let passquery = encrypt("select gcm_master_user.username, gcm_master_user.role," +
                                        "gcm_master_user.id, gcm_master_company.id as company_id, gcm_master_company.kode_seller, " +
                                        "gcm_master_company.id as company_id, gcm_master_company.nama_perusahaan, gcm_master_user.kode_sales, " +
                                        "gcm_master_company.tipe_bisnis, gcm_master_category.nama, gcm_master_user.sa_role, gcm_master_user.sa_divisi " +
                                        "from gcm_master_company " +
                                        "inner join gcm_master_user on gcm_master_company.id = gcm_master_user.company_id " +
                                        "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
                                        "where username='" + username + "' and password='" +
                                        passencrypt + "' and gcm_master_company.type='S' and gcm_master_user.role='admin' and gcm_master_user.status='R' " +
                                        "and gcm_master_company.seller_status='A'");
                                    const res = await this.props.loginAPI({ query: passquery }).catch(err => err);
                                    if (res) {
                                        this.setState({
                                            username: '',
                                            password: '',
                                            isOpen: false
                                        })
                                        if (decrypt(res.status) === "success") {
                                            swal({
                                                title: "Kesalahan!",
                                                text: "Harap hubungi administrator untuk aktivasi akun.",
                                                icon: "error",
                                                buttons: {
                                                    confirm: "Oke"
                                                }
                                            }).then(() => {
                                                this.props.history.push('/admin')
                                                window.location.reload()
                                            });
                                        } else {
                                            // seller_status = 'I'
                                            const passencrypt = encrypt(password);
                                            let passquery = encrypt("select gcm_master_user.username, gcm_master_user.role," +
                                                "gcm_master_user.id, gcm_master_company.id as company_id, gcm_master_company.kode_seller, " +
                                                "gcm_master_company.id as company_id, gcm_master_company.nama_perusahaan, gcm_master_user.kode_sales, " +
                                                "gcm_master_company.tipe_bisnis, gcm_master_category.nama, gcm_master_user.sa_role, gcm_master_user.sa_divisi " +
                                                "from gcm_master_company " +
                                                "inner join gcm_master_user on gcm_master_company.id = gcm_master_user.company_id " +
                                                "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
                                                "where username='" + username + "' and password='" +
                                                passencrypt + "' and gcm_master_company.type='S' and gcm_master_user.role='admin' " +
                                                "and (gcm_master_company.seller_status='I' or gcm_master_company.seller_status='R') ");
                                            const res = await this.props.loginAPI({ query: passquery }).catch(err => err);
                                            if (res) {
                                                this.setState({
                                                    username: '',
                                                    password: '',
                                                    isOpen: false
                                                })
                                                if (decrypt(res.status) === "success") {
                                                    swal({
                                                        title: "Kesalahan!",
                                                        text: "Harap hubungi administrator GLOB untuk aktivasi perusahaan.",
                                                        icon: "error",
                                                        buttons: {
                                                            confirm: "Oke"
                                                        }
                                                    }).then(() => {
                                                        this.props.history.push('/admin')
                                                        window.location.reload()
                                                    });
                                                } else {
                                                    swal({
                                                        title: "Kesalahan!",
                                                        text: "Kesalahan nama pengguna / kata sandi.",
                                                        icon: "error",
                                                        button: false,
                                                        timer: "2500"
                                                    }).then(() => {
                                                        this.props.history.push('/admin')
                                                        window.location.reload()
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                swal({
                    title: "Kesalahan 503!",
                    text: "Harap periksa koneksi internet!",
                    icon: "error",
                    buttons: {
                        confirm: "Oke"
                    }
                }).then(() => {
                    this.props.history.push('/admin')
                    window.location.reload()
                });
            }
        }
    }

    handleCheckingKodeSales = () => {
        this.setState({
            isOpenModalKodeSales: !this.state.isOpenModalKodeSales,
            kode_sales: '',
            validation_kode_sales: false,
            empty_kode_sales: false
        })
    }

    confirmActionKodeSales = async () => {
        let passupdatekodesales = encrypt("update gcm_master_user set kode_sales='" + this.state.kode_sales + "' " +
            "where gcm_master_user.id=" + this.state.id_user + " returning status")
        Toast.loading('Loading...');
        const reskodesales = await this.props.updateUserStatus({ query: passupdatekodesales }).catch(err => err);
        Toast.hide();
        if (reskodesales) {
            this.loginSuccess(this.state.passingusername, this.state.passingpassword)
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                this.props.history.push('/admin')
                window.location.reload()
            });
        }
    }

    loginSuccess = async (username, passencrypt) => {
        let passquery = encrypt("select gcm_master_user.username, gcm_master_user.role," +
            "gcm_master_user.id, gcm_master_company.id as company_id, gcm_master_company.kode_seller, " +
            "gcm_master_company.id as company_id, gcm_master_company.nama_perusahaan, gcm_master_user.kode_sales," +
            "gcm_master_company.tipe_bisnis, gcm_master_category.nama, gcm_master_user.sa_role, gcm_master_user.sa_divisi " +
            "from gcm_master_company " +
            "inner join gcm_master_user on gcm_master_company.id = gcm_master_user.company_id " +
            "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
            "where username='" + username + "' and password='" +
            passencrypt + "' and gcm_master_company.type='S' and gcm_master_user.role='admin' and gcm_master_user.status='A' " +
            "and gcm_master_company.seller_status='A'");
        const res = await this.props.loginAPI({ query: passquery }).catch(err => err);

        if (res) {
            this.setState({
                username: '',
                password: '',
                isOpen: false
            })
            if (decrypt(res.status) === "success") {
                const token = await this.insertFCMToken(decrypt(res.id), decrypt(res.company_id))
                if (token !== undefined) {
                    localStorage.setItem('user_token', JSON.stringify(token))
                }
                localStorage.setItem('userData', JSON.stringify(res))
                swal({
                    title: "Sukses!",
                    text: "Kode sales distributor tersimpan.\nSelamat datang, " + decrypt(res.username),
                    icon: "success",
                    button: false,
                    timer: "3000"
                }).then(() => {
                    // this.props.history.push('/admin/beranda')
                    // window.location.reload()
                });
            }
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                this.props.history.push('/admin')
                window.location.reload()
            });
        }
    }

    handleAlert = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    handleDisMissAlert = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    timerBtnKirimUlangOtp = () => {
        setTimeout(() => this.setState({ isBtnWaitOtp: false }), 60000);
        setTimeout(() => this.setState({ isBtnConfirmOtp: true }), 3600000);
        this.printCountDown()
    }

    handleModalConfirmInsertOtp = async () => {
        await this.loadCheckingNomorHp()
        if (this.state.nomor_hp !== '' && this.state.nomor_hp !== this.state.allNomorHp) {
            swal({
                title: "Kesalahan!",
                text: "Harap masukkan nomor HP yang sesuai saat pendaftaran akun atau dapat hubungi administrator.",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                this.props.history.push('/admin')
                window.location.reload()
            });
        } else {
            if (this.state.nomor_hp !== '') {
                this.handleModalOtp()
                this.timerBtnKirimUlangOtp()
                this.setState({
                    isOpenWaitingOtp: !this.state.isOpenWaitingOtp,
                })
                this.sendOtp()
            }
        }
    }

    loadCheckingNomorHp = async () => {
        let passquerycheckingnomorhp = encrypt("select gcm_master_user.no_hp from gcm_master_user where gcm_master_user.username='" +
            this.state.passingusername + "' and gcm_master_user.password='" + this.state.passingpassword + "'")
        const resnomorchecked = await this.props.getDataCheckedNomorHp({ query: passquerycheckingnomorhp }).catch(err => err)
        if (resnomorchecked) {
            this.setState({
                allNomorHp: resnomorchecked.no_hp
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                this.props.history.push('/admin')
                window.location.reload()
            });
        }
    }

    sendOtp = async () => {
        let x = this.generateOtp()
        let dataReturned = Object.create(null);
        dataReturned = {
            otptype: this.state.defaultOtpVia,
            nohp: this.state.nomor_hp,
            message: 'Yth. pengguna GLOB Seller di nomor ' + this.state.nomor_hp + '. Berikut OTP Anda: ' + x +
                '. Gunakan OTP ini untuk aktivasi akun Anda. Terima kasih.',
            userid: 'GMOS001',
            key: 'z25k4at3jzob718iqceofgor6a1tbm'
        }
        const ressendotp = await this.props.sendOtp(dataReturned).catch(err => err)
        if (ressendotp) {
            this.setState({
                sendValueOTP: x,
                messageid: ressendotp
            })
        }
    }

    handleDropDownOpenViaOtp = () => {
        this.setState({ isOpenViaOtp: !this.state.isOpenViaOtp })
    }

    handleChangeOTP = (event) => {
        console.log(event.target.value)
        this.setState({ valueOTP: event.target.value })
    }

    generateOtp = () => {
        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP
    }

    changeOtpVia = (stat) => {
        this.setState({ defaultOtpVia: stat })
    }

    confirmAction = async () => {
        let dataCheckGetOtp = Object.create(null);
        dataCheckGetOtp = {
            messageid: this.state.messageid,
            userid: 'GMOS001',
            key: 'z25k4at3jzob718iqceofgor6a1tbm'
        }
        Toast.loading('Loading...');
        const resgetotp = await this.props.getOtp(dataCheckGetOtp).catch(err => err)
        if (resgetotp) {
            if (this.state.valueOTP === this.state.sendValueOTP) {
                let passqueryupdatestatususer = encrypt("update gcm_master_user set status='A', update_by=" + decrypt(this.state.dataLogin.id) +
                    ", update_date=now(), no_hp='" + this.state.nomor_hp + "', no_hp_verif=true" +
                    " where id=" + decrypt(this.state.dataLogin.id) + " returning update_date;")

                const resupdatestatususer = await this.props.updateUserStatus({ query: passqueryupdatestatususer }).catch(err => err)
                Toast.hide();
                if (resupdatestatususer) {
                    // pengecekan kode sales di sini
                    if (this.state.id_sales_registered === '') {
                        this.handleCheckingKodeSales()
                    } else {
                        const token = await this.insertFCMToken(decrypt(this.state.dataLogin.id), decrypt(this.state.dataLogin.company_id))
                        if (token !== undefined) {
                            localStorage.setItem('user_token', JSON.stringify(token))
                        }
                        localStorage.setItem('userData', JSON.stringify(this.state.dataLogin));
                        const userData = JSON.parse(localStorage.getItem('userData'))
                        this.setState({
                            isOpenWaitingOtp: !this.state.isOpenWaitingOtp
                        })
                        swal({
                            title: "Sukses!",
                            text: "Selamat datang, " + decrypt(userData.username),
                            icon: "success",
                            button: false,
                            timer: "2500"
                        }).then(() => {
                            // this.props.history.push('/admin/beranda')
                        });
                    }
                }
            } else {
                swal({
                    title: "Kesalahan!",
                    text: "Kode OTP tidak sesuai! Ulangi proses masuk akun!",
                    icon: "error",
                    buttons: {
                        confirm: "Oke"
                    }
                }).then(() => {
                    this.props.history.push('/admin')
                    window.location.reload()
                });
            }
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                this.props.history.push('/admin')
                window.location.reload()
            });
        }
    }

    printCountDown = () => {
        let count1 = 60;
        let myTimer = setInterval(() => {
            this.setState({ timer: 'Kirim ulang OTP? Tunggu ' + count1 + ' detik' })
            count1--;
            if (count1 === 0) {
                clearInterval(myTimer);
                this.setState({ timer: 'Silakan mengirim ulang!' })
            }
        }, 1000);
    }

    handleKirimUlangOtp = () => {
        this.setState({ nomor_hp: '', defaultOtpVia: 'SMS', isOpenWaitingOtp: !this.state.isOpenWaitingOtp, valueOTP: '', isBtnConfirmOtp: !this.state.isBtnConfirmOtp })
        this.handleModalOtp()
    }

    handleviewpassword = () => {
        if (this.state.viewpassword === 'password' && this.state.logopassword === 'fa fa-eye-slash') {
            this.setState({
                viewpassword: 'text',
                logopassword: 'fa fa-eye'
            })
        } else {
            this.setState({
                viewpassword: 'password',
                logopassword: 'fa fa-eye-slash'
            })
        }
    }

    handleWhiteSpaceNumber = (e) => {
        if ((e.which === 32 && !e.target.value.length) || e.which === 32) {
            e.preventDefault()
        }
    }

    render() {
        return (
            <div className="limiter">
                {/* local */}
                {/* <div className="container-login100" style={{backgroundImage: `url(admin/assets/images/bg_gcm01.jpg)`}}> */}
                {/* server */}
                <div className="container-login100" style={{ backgroundImage: `url(admin/assets/images/bg_gcm01.jpg)` }}>
                    <div className="col-md-4" style={{ margin: '0', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div className="main-card mb-3 card">
                            <div className="card-body"><h5 className="card-title">GLOB Administrator</h5>
                                <div className="position-relative form-group"><label htmlFor="username" className="">Nama Pengguna</label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">@</span>
                                        <Input value={this.state.username} onChange={this.handleChangeText} onKeyPress={this.handleWhiteSpaceNumber}
                                            name="username" id="username" placeholder="Masukkan nama pengguna" type="text"
                                            className="form-control" invalid={this.state.empty_username}></Input>
                                    </div>
                                </div>
                                <div className="position-relative form-group"><label htmlFor="password" className="">Kata Sandi</label>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" onClick={this.handleviewpassword}>
                                            <i className={this.state.logopassword}> </i>
                                        </span>
                                        <Input value={this.state.password} onChange={this.handleChangeText} id="password"
                                            name="password" placeholder="Masukkan kata sandi" type={this.state.viewpassword}
                                            className="form-control" invalid={this.state.empty_password}></Input>
                                    </div>
                                </div>
                                <center>
                                    <ButtonCustom onClick={this.handleLoginSubmit} title="Masuk" loading={this.props.isLoading}></ButtonCustom>
                                </center>
                            </div>
                        </div>

                        {/* Modal Insert OTP */}
                        <Modal size="md" toggle={this.handleModalOtp} isOpen={this.state.isOpenModalOtp} backdrop="static">
                            <ModalHeader>Verifikasi OTP</ModalHeader>
                            <ModalBody>
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <div className="position-relative form-group">
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Kirim kode OTP melalui :</p>
                                            <ButtonDropdown isOpen={this.state.isOpenViaOtp} toggle={this.handleDropDownOpenViaOtp}>
                                                <DropdownToggle caret color="primary" title="Kirim One Time Password melalui">
                                                    {this.state.defaultOtpVia}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => this.changeOtpVia('SMS')}>SMS</DropdownItem>
                                                    <DropdownItem onClick={() => this.changeOtpVia('WA')}>WA</DropdownItem>
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="position-relative form-group">
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Nomor HP</p>
                                            <NumberFormat isNumericString={true} name="nomor_hp" id="nomor_hp" className="form-control" placeholder="Nomor HP" onChange={this.handleChange} />
                                            <div id="errornomorhp" style={{ display: 'none' }}>
                                                <p style={{ color: 'red' }}>Kolom ini harus diisi</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <button className="mb-2 mr-2 btn btn-primary" onClick={this.handleModalConfirmInsertOtp} disabled={(this.state.nomor_hp === '') ? "disabled" : false}>Konfirmasi</button>
                            </ModalFooter>
                        </Modal>

                        {/* Modal Waiting OTP */}
                        <Modal size="md" toggle={this.handleModalConfirmInsertOtp} isOpen={this.state.isOpenWaitingOtp} backdrop="static">
                            <ModalHeader>Verifikasi OTP</ModalHeader>
                            <ModalBody>
                                <div style={{ width: '100%' }}>
                                    <p>Masukkan kode OTP yang dikirimkan ke nomor {this.state.nomor_hp}</p>
                                    <div style={{ display: 'table', margin: '0 auto' }}>
                                        <input
                                            value={this.state.valueOTP}
                                            onChange={this.handleChangeOTP}
                                            autoFocus
                                            OTPLength={6}
                                            otpType="number"
                                            disabled={this.state.isBtnConfirmOtp}
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <p>{this.state.timer}</p>
                                <button className="mb-2 mr-2 btn btn-success" id="btnkirimulangotp" disabled={this.state.isBtnWaitOtp} onClick={this.handleKirimUlangOtp}>Kirim ulang OTP</button>
                                <button className="mb-2 mr-2 btn btn-primary" onClick={this.confirmAction}
                                    disabled={(this.state.valueOTP.length < 6) ? "disabled" : this.state.isBtnConfirmOtp}>Konfirmasi</button>
                            </ModalFooter>
                        </Modal>

                        {/* Modal Kode Sales */}
                        <Modal size="md" toggle={this.handleCheckingKodeSales} isOpen={this.state.isOpenModalKodeSales} backdrop="static">
                            <ModalHeader>Verifikasi Kode Sales Distributor</ModalHeader>
                            <ModalBody>
                                <div className="alert alert-danger fade show" role="alert" style={{ width: '100%', paddingLeft: '3%', paddingRight: '3%' }}>
                                    <center>
                                        Kode sales distributor perlu diatur dengan kombinasi khusus.<br></br> Mohon atur kode sales distributor untuk akun ini.
                                    </center>
                                </div>
                                <FormGroup>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Sales Distributor</p>
                                    <Input type="text" name="kode_sales" id="kode_sales"
                                        value={this.state.kode_sales}
                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                        valid={this.state.validation_kode_sales}
                                        invalid={this.state.empty_kode_sales} />
                                </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                                <button className="mb-2 mr-2 btn btn-primary" disabled={this.state.kode_sales === '' ? "disabled" : false} onClick={this.confirmActionKodeSales}>Konfirmasi</button>
                                <button className="mb-2 mr-2 btn btn-danger" onClick={this.handleCheckingKodeSales}>Batal</button>
                            </ModalFooter>
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}

const reduxState = (state) => ({
    isLoading: state.isLoading,
    userData: state.userData
})

const reduxDispatch = (dispatch) => ({
    loginAPI: (data) => dispatch(loginUserAPI(data)),
    getPassword: (data) => dispatch(getPassword(data)),
    sendOtp: (data) => dispatch(sendOtp(data)),
    getOtp: (data) => dispatch(getOtp(data)),
    getDataCheckedNomorHp: (data) => dispatch(getDataCheckedNomorHp(data)),
    getKodeSalesLoginAPI: (data) => dispatch(getKodeSalesLoginAPI(data)),
    updateUserStatus: (data) => dispatch(updateUserStatus(data)),
    loginAPISuperAdmin: (data) => dispatch(loginSuperAdminAPI(data)),
    postData: (data) => dispatch(postQuery(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(Login));