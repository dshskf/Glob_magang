import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import {
    getDataSalesAPI, getDataDetailedSalesAPI, getDataCheckedKodeSales, getDataCategoryAPI, getDataUsernameAPI,
    insertMasterAkun, updateMasterUser, getDataCompanyHandledBySales, checkFieldInsertAkun, logoutUserAPI
}
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, FormFeedback } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import Toast from 'light-toast';

// cek kode sales saat insert dan update
class ContentSales extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        allSales: [],
        allCategory: [],
        allUsername: [],
        isOpen: false,
        isOpenInsert: false,
        isOpenConfirmInsert: false,
        isOpenConfirmUpdate: false,
        isBtnInsert: true,
        isBtnConfirmInsert: true,
        isBtnUpdate: true,
        isBtnConfirmUpdate: true,
        id_sales: '',
        nama_sales: '',
        no_nik_sales: '',
        email_sales: '',
        no_hp_sales: '',
        username_sales: '',
        pembanding_username_sales: '',
        status_sales: '',
        nama_kategori_sales: '',
        nama_status_sales: '',
        sa_role_sales: '',
        id_kategori_sales: '',
        password_sales: '',
        kode_sales: '',
        pembanding_kode_sales: '',
        confirm_password_sales: '',
        validation_nama_sales: false,
        validation_no_nik_sales: false,
        validation_email_sales: false,
        validation_no_hp_sales: false,
        validation_username_sales: false,
        validation_password_sales: false,
        validation_confirm_password_sales: false,
        validation_kode_sales: false,
        feedback_nama_sales: '',
        feedback_no_nik_sales: '',
        feedback_email_sales: '',
        feedback_no_hp_sales: '',
        feedback_username_sales: '',
        feedback_password_sales: '',
        feedback_confirm_password_sales: '',
        feedback_kode_sales: '',
        empty_nama_sales: false,
        empty_no_nik_sales: false,
        empty_email_sales: false,
        empty_no_hp_sales: false,
        empty_username_sales: false,
        empty_password_sales: false,
        empty_confirm_password_sales: false,
        empty_kode_sales: false,
        viewpasswordedited: 'password',
        logopasswordedited: 'fa fa-eye-slash',
        viewpasswordeditedkedua: 'password',
        logopasswordeditedkedua: 'fa fa-eye-slash',
        nama_sales_inserted: '',
        no_nik_sales_inserted: '',
        email_sales_inserted: '',
        no_hp_sales_inserted: '',
        username_sales_inserted: '',
        password_sales_inserted: '',
        confirm_password_sales_inserted: '',
        kode_sales_inserted: '',
        id_kategori_sales_inserted: '1',
        nama_kategori_sales_inserted: 'Pilih kategori sales',
        validation_nama_sales_inserted: false,
        validation_no_nik_sales_inserted: false,
        validation_email_sales_inserted: false,
        validation_no_hp_sales_inserted: false,
        validation_username_sales_inserted: false,
        validation_password_sales_inserted: false,
        validation_confirm_password_sales_inserted: false,
        validation_kode_sales_inserted: false,
        feedback_nama_sales_inserted: '',
        feedback_no_nik_sales_inserted: '',
        feedback_email_sales_inserted: '',
        feedback_no_hp_sales_inserted: '',
        feedback_username_sales_inserted: '',
        feedback_password_sales_inserted: '',
        feedback_confirm_password_sales_inserted: '',
        feedback_kode_sales_inserted: '',
        empty_nama_sales_inserted: false,
        empty_no_nik_sales_inserted: false,
        empty_email_sales_inserted: false,
        empty_no_hp_sales_inserted: false,
        empty_username_sales_inserted: false,
        empty_password_sales_inserted: false,
        empty_confirm_password_sales_inserted: false,
        empty_kode_sales_inserted: false,
        viewpassword: 'password',
        logopassword: 'fa fa-eye-slash',
        viewpasswordkedua: 'password',
        logopasswordkedua: 'fa fa-eye-slash',
        disable_confirm_password: true,
        disable_confirm_password_edited: true,
        status_akun_default: '',
        pembanding_status_akun_default: '',
        allCheckedKodeSales: 0,
        isOpenAttentionKodeSales: false,
        allCompanyHandledBySales: [],
        isOpenAttentionKodeSalesConfirmKedua: false,
        check_username_insert: 0,
        check_nohp_insert: 0,
        check_email_insert: 0,
        check_nik_insert: 0,
        check_username_update: 0,
        check_nohp_update: 0,
        check_email_update: 0,
        check_nik_update: 0
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.setState({
            id_pengguna_login: decrypt(userData.id),
            company_id: decrypt(userData.company_id),
            company_name: decrypt(userData.company_name),
            tipe_bisnis: decrypt(userData.tipe_bisnis),
            sa_role: decrypt(userData.sa_role),
            sa_divisi: decrypt(userData.sa_divisi),
            id_sales_registered: decrypt(userData.id_sales_registered),
            id_company_registered: decrypt(userData.id_company_registered)
        })
    }

    componentDidMount() {
        this.loadSales()
        this.loadCategory()
    }

    loadSales = async () => {
        let passquerysales = encrypt("select gcm_master_user.id, gcm_master_user.nama, gcm_master_user.username, gcm_master_user.status, " +
            "gcm_master_category.nama as nama_kategori, gcm_master_user.kode_sales from gcm_master_user " +
            "inner join gcm_master_category on gcm_master_user.sa_divisi = gcm_master_category.id where gcm_master_user.company_id=" + this.state.company_id +
            " and gcm_master_user.sa_role = 'sales'")
        const ressales = await this.props.getDataSalesAPI({ query: passquerysales }).catch(err => err)
        if (ressales) {
            ressales.map((user, index) => {
                return (
                    ressales[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailSales(e, ressales[index].id)}> Lihat Detail</button>
                    </center>
                )
            })
            this.setState({
                allSales: ressales
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
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    loadCategory = async () => {
        let passquerycategory = encrypt("select * from gcm_master_category where id != 5 order by id;")
        const rescategory = await this.props.getDataCategoryAPI({ query: passquerycategory }).catch(err => err)
        if (rescategory) {
            this.setState({
                allCategory: rescategory
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
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    loadUsernameAccount = async () => {
        let passqueryusername = encrypt("select gcm_master_user.username from gcm_master_user")
        const resusername = await this.props.getDataUsernameAPI({ query: passqueryusername }).catch(err => err)
        if (resusername) {
            this.setState({
                allUsername: resusername
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
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    handleModalInsert = () => {
        this.setState({
            isOpenInsert: !this.state.isOpenInsert,
            nama_sales_inserted: '',
            no_nik_sales_inserted: '',
            email_sales_inserted: '',
            no_hp_sales_inserted: '',
            username_sales_inserted: '',
            password_sales_inserted: '',
            confirm_password_sales_inserted: '',
            kode_sales_inserted: '',
            id_kategori_sales_inserted: '1',
            nama_kategori_sales_inserted: 'Pilih kategori sales',
            validation_nama_sales_inserted: false,
            validation_no_nik_sales_inserted: false,
            validation_email_sales_inserted: false,
            validation_no_hp_sales_inserted: false,
            validation_username_sales_inserted: false,
            validation_password_sales_inserted: false,
            validation_confirm_password_sales_inserted: false,
            validation_kode_sales_inserted: false,
            feedback_nama_sales_inserted: '',
            feedback_no_nik_sales_inserted: '',
            feedback_email_sales_inserted: '',
            feedback_no_hp_sales_inserted: '',
            feedback_username_sales_inserted: '',
            feedback_password_sales_inserted: '',
            feedback_confirm_password_sales_inserted: '',
            feedback_kode_sales_inserted: '',
            empty_nama_sales_inserted: false,
            empty_no_nik_sales_inserted: false,
            empty_email_sales_inserted: false,
            empty_no_hp_sales_inserted: false,
            empty_username_sales_inserted: false,
            empty_password_sales_inserted: false,
            empty_confirm_password_sales_inserted: false,
            empty_kode_sales_inserted: false,
            disable_confirm_password: true
        })
        this.loadUsernameAccount()
    }

    handleWhiteSpace = (e) => {
        if (e.which === 32 && !e.target.value.length) {
            e.preventDefault()
        }
    }

    handleWhiteSpaceNumber = (e) => {
        if ((e.which === 32 && !e.target.value.length) || e.which === 32) {
            e.preventDefault()
        }
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

    handleviewpasswordkedua = () => {
        if (this.state.viewpasswordkedua === 'password' && this.state.logopasswordkedua === 'fa fa-eye-slash') {
            this.setState({
                viewpasswordkedua: 'text',
                logopasswordkedua: 'fa fa-eye'
            })
        } else {
            this.setState({
                viewpasswordkedua: 'password',
                logopasswordkedua: 'fa fa-eye-slash'
            })
        }
    }

    handleviewpasswordedited = () => {
        if (this.state.viewpasswordedited === 'password' && this.state.logopasswordedited === 'fa fa-eye-slash') {
            this.setState({
                viewpasswordedited: 'text',
                logopasswordedited: 'fa fa-eye'
            })
        } else {
            this.setState({
                viewpasswordedited: 'password',
                logopasswordedited: 'fa fa-eye-slash'
            })
        }
    }

    handleviewpasswordeditedkedua = () => {
        if (this.state.viewpasswordeditedkedua === 'password' && this.state.logopasswordeditedkedua === 'fa fa-eye-slash') {
            this.setState({
                viewpasswordeditedkedua: 'text',
                logopasswordeditedkedua: 'fa fa-eye'
            })
        } else {
            this.setState({
                viewpasswordeditedkedua: 'password',
                logopasswordeditedkedua: 'fa fa-eye-slash'
            })
        }
    }

    handleDetailSales = async (e, id) => {
        this.handleModalDetail()
        e.stopPropagation()
        // let passquerydetail = encrypt("select gcm_master_user.nama, gcm_master_user.no_ktp, gcm_master_user.email, gcm_master_user.no_hp, "+
        //         "gcm_master_user.username, gcm_master_user.status, gcm_master_user.sa_divisi, gcm_master_user.password, gcm_master_user.id, "+
        //         "gcm_master_category.nama as nama_kategori, gcm_master_user.sa_role from gcm_master_user "+
        //     "inner join gcm_master_category on gcm_master_user.sa_divisi = gcm_master_category.id "+
        //     "where gcm_master_user.id ="+id)
        let passquerydetail = encrypt("select gcm_master_user.nama, gcm_master_user.no_nik, gcm_master_user.email, gcm_master_user.no_hp, " +
            "gcm_master_user.username, gcm_master_user.status, gcm_master_user.sa_divisi, gcm_master_user.password, gcm_master_user.id, " +
            "gcm_master_category.nama as nama_kategori, gcm_master_user.sa_role, gcm_master_user.kode_sales from gcm_master_user " +
            "inner join gcm_master_category on gcm_master_user.sa_divisi = gcm_master_category.id " +
            "where gcm_master_user.id =" + id)
        const resdetail = await this.props.getDataDetailedSalesAPI({ query: passquerydetail }).catch(err => err)
        if (resdetail) {
            await this.setState({
                id_sales: resdetail.id_sales,
                nama_sales: resdetail.nama_sales,
                no_nik_sales: (resdetail.no_nik_sales === null ? '' : resdetail.no_nik_sales),
                email_sales: resdetail.email_sales,
                no_hp_sales: resdetail.no_hp_sales,
                username_sales: resdetail.username_sales,
                pembanding_username_sales: resdetail.username_sales,
                status_sales: resdetail.status_sales,
                id_kategori_sales: resdetail.id_kategori_sales,
                nama_kategori_sales: resdetail.nama_kategori_sales,
                sa_role_sales: resdetail.sa_role_sales,
                password_sales: decrypt(resdetail.password),
                confirm_password_sales: decrypt(resdetail.password),
                nama_status_sales: resdetail.status_sales,
                status_akun_default: resdetail.status_sales,
                pembanding_status_akun_default: resdetail.status_sales,
                kode_sales: resdetail.kode_sales,
                pembanding_kode_sales: resdetail.kode_sales
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
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
        this.loadCompanyHandlerBySales(this.state.id_sales)
    }

    loadCompanyHandlerBySales = async (id_sales) => {
        let passquerycompanybysales = encrypt("select gcm_master_company.nama_perusahaan, " +
            "gcm_master_category.nama as nama_kategori, gcm_company_listing_sales.status " +
            "from gcm_company_listing_sales " +
            "inner join gcm_master_company on gcm_company_listing_sales.buyer_id = gcm_master_company.id " +
            "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
            "where gcm_company_listing_sales.seller_id=" + this.state.company_id +
            " and gcm_company_listing_sales.id_sales=" + this.state.id_sales)
        const rescompanyhandled = await this.props.getDataCompanyHandledBySales({ query: passquerycompanybysales }).catch(err => err)
        if (rescompanyhandled) {
            rescompanyhandled.map((user, index) => {
                return (
                    rescompanyhandled[index].status =
                    <center>
                        <div className={user.status === 'A' ? 'mb-2 mr-2 badge badge-success' : user.status === 'I' ? 'mb-2 mr-2 badge badge-danger' : 'mb-2 mr-2 badge badge-danger'}>
                            {user.status === 'A' ? 'Aktif' : 'Nonaktif'}</div>
                    </center>
                )
            })
            this.setState({ allCompanyHandledBySales: rescompanyhandled })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            validation_nama_sales: false,
            validation_no_nik_sales: false,
            validation_email_sales: false,
            validation_no_hp_sales: false,
            validation_username_sales: false,
            validation_password_sales: false,
            validation_confirm_password_sales: false,
            validation_kode_sales: false,
            feedback_nama_sales: '',
            feedback_no_nik_sales: '',
            feedback_email_sales: '',
            feedback_no_hp_sales: '',
            feedback_username_sales: '',
            feedback_password_sales: '',
            feedback_confirm_password_sales: '',
            feedback_kode_sales: '',
            empty_nama_sales: false,
            empty_no_nik_sales: false,
            empty_email_sales: false,
            empty_no_hp_sales: false,
            empty_username_sales: false,
            empty_password_sales: false,
            empty_confirm_password_sales: false,
            empty_kode_sales: false,
            disable_confirm_password_edited: true,
            isBtnUpdate: true,
            allCheckedKodeSales: 0
        })
        this.loadUsernameAccount()
    }

    changeKategoriAkun = async (id, nama_kategori) => {
        await this.setState({
            id_kategori_sales_inserted: id,
            nama_kategori_sales_inserted: nama_kategori
        })
        if (this.state.no_nik_sales_inserted !== '' &&
            this.state.nama_sales_inserted !== '' &&
            this.state.kode_sales_inserted !== '' &&
            (this.state.no_hp_sales_inserted !== '' && this.state.no_hp_sales_inserted.length <= 15) &&
            (this.state.email_sales_inserted !== '' && this.state.validation_email_sales_inserted === true) &&
            (this.state.username_sales_inserted !== '' && this.state.validation_username_sales_inserted === true) &&
            this.state.validation_password_sales_inserted === true && this.state.validation_confirm_password_sales_inserted === true) {
            this.setState({ isBtnInsert: false })
        }
    }

    changeKategoriAkunEdited = async (id, nama_kategori) => {
        await this.setState({
            id_kategori_sales: id,
            nama_kategori_sales: nama_kategori,
            isBtnUpdate: true
        })
        // if (this.state.nama_sales !== '' && this.state.no_ktp_sales.length === 16 &&
        if (this.state.nama_sales !== '' && this.state.no_nik_sales !== '' &&
            (this.state.kode_sales !== '' && this.state.kode_sales !== null) &&
            (this.state.no_hp_sales !== '' && this.state.no_hp_sales.length <= 15) &&
            (this.state.email_sales !== '' || this.state.validation_email_sales === true) &&
            (this.state.username_sales !== '' || this.state.validation_username_sales === true) &&
            (this.state.password_sales !== '' || this.state.validation_password_sales === true)) {
            this.setState({ isBtnUpdate: false })
        }
    }

    changeStatusAkunEdited = (status) => {
        this.setState({ status_akun_default: status })
        if (status === 'A') {
            this.setState({ nama_status_sales: 'Aktif' })
        } else {
            this.setState({ nama_status_sales: 'Nonaktif' })
        }
        // if (this.state.nama_sales !== '' && this.state.no_ktp_sales.length === 16 &&
        if (this.state.nama_sales !== '' && this.state.no_nik_sales !== '' &&
            (this.state.kode_sales !== '' && this.state.kode_sales !== null) &&
            (this.state.no_hp_sales !== '' && this.state.no_hp_sales.length <= 15) &&
            (this.state.email_sales !== '' || this.state.validation_email_sales === true) &&
            (this.state.username_sales !== '' || this.state.validation_username_sales === true) &&
            (this.state.password_sales !== '' || this.state.validation_password_sales === true)) {
            this.setState({ isBtnUpdate: false })
        }
    }

    loadCheckingKodeSales = async (kd_sales) => {
        let passquerycheckingkodesales = encrypt("select count(gcm_master_user.id) as total from gcm_master_user " +
            "where gcm_master_user.company_id=" + this.state.company_id + " and gcm_master_user.kode_sales='" + kd_sales + "'")
        const reskodesales = await this.props.getDataCheckedKodeSales({ query: passquerycheckingkodesales }).catch(err => err)
        if (reskodesales) {
            await this.setState({
                allCheckedKodeSales: Number(reskodesales.total)
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
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    handleChange = (event) => {
        if (event.target.name === 'nama_sales_inserted') {
            if (event.target.value.match("^[a-zA-Z ]*$") !== null) {
                this.check_field_nama_sales(event.target.value)
            } else {
                return;
            }
        }
        if (event.target.name === 'username_sales_inserted') {
            this.check_field_username_sales(event.target.value)
        }
        if (event.target.name === 'id_kategori_sales_inserted') {
            this.changeKategoriAkun(event.target.value)
        }
        if (event.target.name === 'no_nik_sales_inserted') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                this.check_field_nik_sales(event.target.value)
            }
        }
        if (event.target.name === 'email_sales_inserted') {
            this.check_field_email_sales(event.target.value)
        }
        if (event.target.name === 'kode_sales_inserted') {
            this.check_field_kode_sales(event.target.value)
        }
        if (event.target.name === 'no_hp_sales_inserted') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                if (event.target.value.substring(0, 1) === '0') {
                    this.check_field_telepon_sales(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'password_sales_inserted') {
            this.check_field_password_sales(event.target.value)
        }
        if (event.target.name === 'confirm_password_sales_inserted') {
            this.check_field_confirm_password_sales(event.target.value)
        }
        // handle edited
        if (event.target.name === 'nama_sales') {
            if (event.target.value.match("^[a-zA-Z ]*$") !== null) {
                this.check_field_nama_sales_edited(event.target.value)
            } else {
                return;
            }
        }
        if (event.target.name === 'username_sales') {
            this.check_field_username_sales_edited(event.target.value)
        }
        if (event.target.name === 'id_kategori_sales') {
            this.changeKategoriAkunEdited(event.target.value)
        }
        if (event.target.name === 'no_nik_sales') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                this.check_field_nik_sales_edited(event.target.value)
            }
        }
        if (event.target.name === 'email_sales') {
            this.check_field_email_sales_edited(event.target.value)
        }
        if (event.target.name === 'no_hp_sales') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                if (event.target.value.substring(0, 1) === '0') {
                    this.check_field_telepon_sales_edited(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'kode_sales') {
            this.check_field_kode_sales_edited(event.target.value)
        }
        if (event.target.name === 'password_sales') {
            this.check_field_password_sales_edited(event.target.value)
        }
        if (event.target.name === 'status_akun_default') {
            this.changeStatusAkunEdited(event.target.value)
        }
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    check_field_nama_sales = (e) => {
        if (e === '') {
            this.setState({ validation_nama_sales_inserted: false, feedback_nama_sales_inserted: 'Kolom ini wajib diisi', empty_nama_sales_inserted: true, isBtnInsert: true })
        } else {
            this.setState({ validation_nama_sales_inserted: true, feedback_nama_sales_inserted: '', empty_nama_sales_inserted: false })
            // handle button
            // if (this.state.no_ktp_sales_inserted.length === 16 &&
            if (this.state.no_nik_sales_inserted !== '' &&
                this.state.kode_sales_inserted !== '' &&
                (this.state.no_hp_sales_inserted !== '' && this.state.no_hp_sales_inserted.length <= 15) &&
                (this.state.email_sales_inserted !== '' && this.state.validation_email_sales_inserted === true) &&
                (this.state.username_sales_inserted !== '' && this.state.validation_username_sales_inserted === true) &&
                this.state.validation_password_sales_inserted === true && this.state.validation_confirm_password_sales_inserted === true) {
                this.setState({ isBtnInsert: false })
            }
        }
    }

    check_field_username_sales = (e) => {
        if (e === '') {
            this.setState({ empty_username_sales_inserted: true, feedback_username_sales_inserted: 'Kolom ini wajib diisi', isBtnInsert: true })
        } else {
            if (e.length < 8 && e.length > 0) {
                this.setState({
                    validation_username_sales_inserted: false,
                    empty_username_sales_inserted: true,
                    feedback_username_sales_inserted: 'Nama pengguna minimal 8 karakter',
                    isBtnInsert: true
                })
            }
            else if (e.length >= 8) {
                this.setState({ empty_username_sales_inserted: false })
                let check_username = this.state.allUsername.filter(input_username => { return input_username.username === e });
                if (check_username !== '' && check_username.length === 0) {
                    this.setState({
                        validation_username_sales_inserted: true, empty_username_sales_inserted: false,
                        feedback_username_sales_inserted: ''
                    })
                    // handle button
                    // if (this.state.nama_sales_inserted !== '' && this.state.no_ktp_sales_inserted.length === 16 &&
                    if (this.state.nama_sales_inserted !== '' && this.state.no_nik_sales_inserted !== '' &&
                        this.state.kode_sales_inserted !== '' &&
                        (this.state.no_hp_sales_inserted !== '' && this.state.no_hp_sales_inserted.length <= 15) &&
                        (this.state.email_sales_inserted !== '' && this.state.validation_email_sales_inserted === true) &&
                        this.state.validation_password_sales_inserted === true && this.state.validation_confirm_password_sales_inserted === true) {
                        this.setState({ isBtnInsert: false })
                    }
                } else {
                    this.setState({
                        validation_username_sales_inserted: false, empty_username_sales_inserted: true,
                        feedback_username_sales_inserted: 'Nama pengguna telah digunakan', isBtnInsert: true
                    })
                }
            }
        }
    }

    check_field_nik_sales = (e) => {
        if (e === '') {
            this.setState({ empty_no_nik_sales_inserted: true, feedback_no_nik_sales_inserted: 'Kolom ini wajib diisi', isBtnInsert: true })
        } else {
            // if (e.length === 16) {
            this.setState({
                validation_no_nik_sales_inserted: true,
                empty_no_nik_sales_inserted: false,
                feedback_no_nik_sales_inserted: '',
                isBtnInsert: true
            })
            // handle button
            if (this.state.nama_sales_inserted !== '' && this.state.kode_sales_inserted !== '' &&
                (this.state.no_hp_sales_inserted !== '' && this.state.no_hp_sales_inserted.length <= 15) &&
                (this.state.email_sales_inserted !== '' && this.state.validation_email_sales_inserted === true) &&
                (this.state.username_sales_inserted !== '' && this.state.validation_username_sales_inserted === true) &&
                this.state.validation_password_sales_inserted === true && this.state.validation_confirm_password_sales_inserted === true) {
                this.setState({ isBtnInsert: false })
            }
            // } else {
            //     this.setState({
            //         empty_no_nik_sales_inserted: true,
            //         feedback_no_nik_sales_inserted: 'Nomor KTP terdiri atas 16 karakter',
            //         isBtnInsert: true
            //     })
            // }
        }
    }

    check_field_email_sales = (e) => {
        if (e === '') {
            this.setState({
                empty_email_sales_inserted: true,
                feedback_email_sales_inserted: 'Kolom ini wajib diisi',
                isBtnInsert: true
            })
        } else {
            const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (emailRex.test(e)) {
                this.setState({
                    validation_email_sales_inserted: true,
                    empty_email_sales_inserted: false,
                    feedback_email_sales_inserted: ''
                })
                // handle button
                // if (this.state.nama_sales_inserted !== '' && this.state.no_ktp_sales_inserted.length === 16 &&
                if (this.state.nama_sales_inserted !== '' && this.state.no_nik_sales_inserted !== '' && this.state.kode_sales_inserted !== '' &&
                    (this.state.no_hp_sales_inserted !== '' && this.state.no_hp_sales_inserted.length <= 15) &&
                    (this.state.username_sales_inserted !== '' && this.state.validation_username_sales_inserted === true) &&
                    this.state.validation_password_sales_inserted === true && this.state.validation_confirm_password_sales_inserted === true) {
                    this.setState({ isBtnInsert: false })
                }
            } else {
                this.setState({
                    empty_email_sales_inserted: true,
                    feedback_email_sales_inserted: 'Masukkan alamat email dengan benar',
                    isBtnInsert: true
                })
            }
        }
    }

    check_field_telepon_sales = (e) => {
        if (e === '') {
            this.setState({
                empty_no_hp_sales_inserted: true, feedback_no_hp_sales_inserted: 'Kolom ini wajib diisi',
                isBtnInsert: true
            })
        } else {
            if (e.length > 15) {
                this.setState({
                    empty_no_hp_sales_inserted: true,
                    feedback_no_hp_sales_inserted: 'Nomor telepon maksimal terdiri atas 15 karakter',
                    isBtnInsert: true
                })
            } else {
                this.setState({
                    validation_no_hp_sales_inserted: true,
                    empty_no_hp_sales_inserted: false,
                    feedback_no_hp_sales_inserted: ''
                })
                // handle button
                // if (this.state.nama_sales_inserted !== '' && this.state.no_ktp_sales_inserted.length === 16 &&
                if (this.state.nama_sales_inserted !== '' && this.state.no_nik_sales_inserted !== '' && this.state.kode_sales_inserted !== '' &&
                    (this.state.email_sales_inserted !== '' && this.state.validation_email_sales_inserted === true) &&
                    (this.state.username_sales_inserted !== '' && this.state.validation_username_sales_inserted === true) &&
                    this.state.validation_password_sales_inserted === true && this.state.validation_confirm_password_sales_inserted === true) {
                    this.setState({ isBtnInsert: false })
                }
            }
        }
    }

    check_field_kode_sales = (e) => {
        if (e === '') {
            this.setState({ validation_kode_sales_inserted: false, feedback_kode_sales_inserted: 'Kolom ini wajib diisi', empty_kode_sales_inserted: true, isBtnInsert: true })
        } else {
            this.setState({ validation_kode_sales_inserted: true, feedback_kode_sales_inserted: '', empty_kode_sales_inserted: false })
            // handle button
            // if (this.state.no_ktp_sales_inserted.length === 16 &&
            if (this.state.no_nik_sales_inserted !== '' &&
                (this.state.no_hp_sales_inserted !== '' && this.state.no_hp_sales_inserted.length <= 15) &&
                (this.state.email_sales_inserted !== '' && this.state.validation_email_sales_inserted === true) &&
                (this.state.username_sales_inserted !== '' && this.state.validation_username_sales_inserted === true) &&
                this.state.validation_password_sales_inserted === true && this.state.validation_confirm_password_sales_inserted === true) {
                this.setState({ isBtnInsert: false })
            }
        }
    }

    check_field_password_sales = async (e) => {
        if (e === '') {
            await this.setState({
                empty_password_sales_inserted: true,
                validation_password_sales_inserted: false,
                feedback_password_sales_inserted: 'Kolom ini wajib diisi',
                isBtnInsert: true,
                disable_confirm_password: true,
                feedback_confirm_password_sales_inserted: '',
                empty_confirm_password_sales_inserted: false,
                validation_confirm_password_sales_inserted: false,
                confirm_password_sales_inserted: ''
            })
            document.getElementById('errorpassword').style.display = 'block'
            document.getElementById('errorpasswordkedua').style.display = 'block'
        } else {
            const passwordRex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            this.setState({ disable_confirm_password: false })
            if (passwordRex.test(e)) {
                this.setState({
                    validation_password_sales_inserted: true,
                    empty_password_sales_inserted: false,
                    feedback_password_sales_inserted: '',
                })
                if (this.state.confirm_password_sales_inserted !== '') {
                    if (e === this.state.confirm_password_sales_inserted) {
                        await this.setState({
                            validation_confirm_password_sales_inserted: true,
                            empty_confirm_password_sales_inserted: false,
                            feedback_confirm_password_sales_inserted: '',
                        })
                        // handle button
                        // if (this.state.nama_sales_inserted !== '' && this.state.no_ktp_sales_inserted.length === 16 &&
                        if (this.state.nama_sales_inserted !== '' && this.state.no_nik_sales_inserted !== '' && this.state.kode_sales_inserted !== '' &&
                            (this.state.no_hp_sales_inserted !== '' && this.state.no_hp_sales_inserted.length <= 15) &&
                            (this.state.email_sales_inserted !== '' && this.state.validation_email_sales_inserted === true) &&
                            (this.state.username_sales_inserted !== '' && this.state.validation_username_sales_inserted === true) &&
                            this.state.validation_confirm_password_sales_inserted === true) {
                            this.setState({ isBtnInsert: false })
                        }
                    } else {
                        this.setState({
                            validation_confirm_password_sales_inserted: false,
                            empty_confirm_password_sales_inserted: true,
                            feedback_confirm_password_sales_inserted: 'Kata sandi tidak cocok',
                            isBtnInsert: true
                        })
                        document.getElementById('errorpasswordkedua').style.display = 'block'
                    }
                }
                document.getElementById('errorpassword').style.display = 'none'
            } else {
                if (e !== '') {
                    this.setState({
                        empty_password_sales_inserted: true,
                        feedback_password_sales_inserted: 'Kata sandi minimal 8 karakter terdiri huruf besar, kecil, dan angka',
                        isBtnInsert: true
                    })
                    document.getElementById('errorpassword').style.display = 'block'
                }
            }
        }
    }

    check_field_confirm_password_sales = (e) => {
        if (this.state.password_sales_inserted !== '') {
            if (e === '') {
                this.setState({
                    validation_confirm_password_sales_inserted: false,
                    empty_confirm_password_sales_inserted: true,
                    feedback_confirm_password_sales_inserted: 'Kolom ini wajib diisi',
                    isBtnInsert: true
                })
                document.getElementById('errorpasswordkedua').style.display = 'block'
            } else {
                if (e === this.state.password_sales_inserted) {
                    this.setState({
                        validation_confirm_password_sales_inserted: true,
                        empty_confirm_password_sales_inserted: false,
                        feedback_confirm_password_sales_inserted: '',
                    })
                    document.getElementById('errorpasswordkedua').style.display = 'none'
                    // handle button
                    // if (this.state.nama_sales_inserted !== '' && this.state.no_ktp_sales_inserted.length === 16 &&
                    if (this.state.nama_sales_inserted !== '' && this.state.no_nik_sales_inserted !== '' && this.state.kode_sales_inserted !== '' &&
                        (this.state.no_hp_sales_inserted !== '' && this.state.no_hp_sales_inserted.length <= 15) &&
                        (this.state.email_sales_inserted !== '' && this.state.validation_email_sales_inserted === true) &&
                        (this.state.username_sales_inserted !== '' && this.state.validation_username_sales_inserted === true) &&
                        this.state.validation_password_sales_inserted === true) {
                        this.setState({ isBtnInsert: false })
                    }
                } else {
                    if (e !== '') {
                        this.setState({
                            validation_confirm_password_sales_inserted: false,
                            empty_confirm_password_sales_inserted: true,
                            feedback_confirm_password_sales_inserted: 'Kata sandi tidak cocok',
                            isBtnInsert: true
                        })
                        document.getElementById('errorpasswordkedua').style.display = 'block'
                    }
                }
            }
        }
    }

    handleModalConfirmInsert = async () => {
        await this.loadUsernameAccount()
        await this.checkFinalFieldInsert()
        await this.loadCheckingKodeSales(this.state.kode_sales_inserted)
        let check_username = this.state.allUsername.filter(input_username => { return input_username.username === this.state.username_sales_inserted });
        if (check_username !== '' && check_username.length === 0) {
            if (Number(this.state.allCheckedKodeSales) > 0) {
                this.handleModalAttentionKodeSales()
                this.setState({
                    validation_kode_sales_inserted: false, empty_kode_sales_inserted: true,
                    feedback_kode_sales_inserted: 'Kode sales distributor telah digunakan', isBtnInsert: true
                })
                if (Number(this.state.check_username_insert) > 0) {
                    this.setState({
                        validation_username_sales_inserted: false, empty_username_sales_inserted: true,
                        feedback_username_sales_inserted: 'Nama pengguna telah digunakan', isBtnInsert: true
                    })
                }
                if (Number(this.state.check_nohp_insert) > 0) {
                    this.setState({
                        validation_no_hp_sales_inserted: false, empty_no_hp_sales_inserted: true,
                        feedback_no_hp_sales_inserted: 'Nomor telepon telah digunakan', isBtnInsert: true
                    })
                }
                if (Number(this.state.check_email_insert) > 0) {
                    this.setState({
                        validation_email_sales_inserted: false, empty_email_sales_inserted: true,
                        feedback_email_sales_inserted: 'Email telah digunakan', isBtnInsert: true
                    })
                }
                if (Number(this.state.check_nik_insert) > 0) {
                    this.setState({
                        validation_no_nik_sales_inserted: false, empty_no_nik_sales_inserted: true,
                        feedback_no_nik_sales_inserted: 'Nomor NIK telah digunakan', isBtnInsert: true
                    })
                }
            } else {
                if (Number(this.state.check_username_insert) === 0 &&
                    Number(this.state.check_nohp_insert) === 0 &&
                    Number(this.state.check_email_insert) === 0 &&
                    Number(this.state.check_nik_insert) === 0) {
                    this.setState({
                        isOpenConfirmInsert: !this.state.isOpenConfirmInsert
                    })
                } else {
                    if (Number(this.state.check_username_insert) > 0) {
                        this.setState({
                            validation_username_sales_inserted: false, empty_username_sales_inserted: true,
                            feedback_username_sales_inserted: 'Nama pengguna telah digunakan', isBtnInsert: true
                        })
                    }
                    if (Number(this.state.check_nohp_insert) > 0) {
                        this.setState({
                            validation_no_hp_sales_inserted: false, empty_no_hp_sales_inserted: true,
                            feedback_no_hp_sales_inserted: 'Nomor telepon telah digunakan', isBtnInsert: true
                        })
                    }
                    if (Number(this.state.check_email_insert) > 0) {
                        this.setState({
                            validation_email_sales_inserted: false, empty_email_sales_inserted: true,
                            feedback_email_sales_inserted: 'Email telah digunakan', isBtnInsert: true
                        })
                    }
                    if (Number(this.state.check_nik_insert) > 0) {
                        this.setState({
                            validation_no_nik_sales_inserted: false, empty_no_nik_sales_inserted: true,
                            feedback_no_nik_sales_inserted: 'Nomor NIK telah digunakan', isBtnInsert: true
                        })
                    }
                }
            }
        } else {
            this.setState({
                validation_username_sales_inserted: false, empty_username_sales_inserted: true,
                feedback_username_sales_inserted: 'Nama pengguna telah digunakan', isBtnInsert: true
            })
        }
    }

    handleModalAttentionKodeSales = () => {
        this.setState({ isOpenAttentionKodeSales: !this.state.isOpenAttentionKodeSales })
    }

    confirmActionInsertAkun = async () => {
        Toast.loading('Loading...');
        let encryptpassword = encrypt(this.state.password_sales_inserted)
        let passqueryinsertakun = ""
        await this.checkFinalFieldInsert()
        await this.loadCheckingKodeSales(this.state.kode_sales_inserted)
        if (Number(this.state.allCheckedKodeSales) > 0) {
            this.handleModalAttentionKodeSalesConfirmKedua()
        } else {
            if (Number(this.state.check_username_insert) === 0 &&
                Number(this.state.check_nohp_insert) === 0 &&
                Number(this.state.check_email_insert) === 0 &&
                Number(this.state.check_nik_insert) === 0) {
                if (this.state.tipe_bisnis === '1') {
                    // passqueryinsertakun = encrypt("insert into gcm_master_user (nama, no_ktp, no_hp, email, username, password, status, "+
                    //     "role, company_id, create_by, create_date, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, "+
                    //     "id_blacklist, is_blacklist, notes_blacklist) values ("+
                    //         "'"+this.state.nama_sales_inserted+"', '"+this.state.no_ktp_sales_inserted+"', '"+this.state.no_hp_sales_inserted+"', "+
                    //         "'"+this.state.email_sales_inserted+"', '"+this.state.username_sales_inserted+"', '"+encryptpassword+"', "+
                    //         "'I', 'admin', '"+this.state.company_id+"', "+
                    //         "'"+this.state.id_pengguna_login+"', now(), '"+this.state.id_pengguna_login+"', "+
                    //         "now(), 'sales', '"+this.state.id_kategori_sales_inserted+"', "+
                    //         "false, false, '0', false, '') returning update_date")
                    passqueryinsertakun = encrypt("insert into gcm_master_user (nama, no_nik, no_hp, email, username, password, status, " +
                        "role, company_id, create_by, create_date, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, " +
                        "id_blacklist, is_blacklist, notes_blacklist, kode_sales) values (" +
                        "'" + this.state.nama_sales_inserted + "', '" + this.state.no_nik_sales_inserted + "', '" + this.state.no_hp_sales_inserted + "', " +
                        "'" + this.state.email_sales_inserted + "', '" + this.state.username_sales_inserted + "', '" + encryptpassword + "', " +
                        "'I', 'admin', '" + this.state.company_id + "', " +
                        "'" + this.state.id_pengguna_login + "', now(), '" + this.state.id_pengguna_login + "', " +
                        "now(), 'sales', '" + this.state.id_kategori_sales_inserted + "', " +
                        "false, false, '0', false, '', '" + this.state.kode_sales_inserted + "') returning update_date")
                } else {
                    // passqueryinsertakun = encrypt("insert into gcm_master_user (nama, no_ktp, no_hp, email, username, password, status, "+
                    //     "role, company_id, create_by, create_date, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, "+
                    //     "id_blacklist, is_blacklist, notes_blacklist) values ("+
                    //         "'"+this.state.nama_sales_inserted+"', '"+this.state.no_ktp_sales_inserted+"', '"+this.state.no_hp_sales_inserted+"', "+
                    //         "'"+this.state.email_sales_inserted+"', '"+this.state.username_sales_inserted+"', '"+encryptpassword+"', "+
                    //         "'I', 'admin', '"+this.state.company_id+"', "+
                    //         "'"+this.state.id_pengguna_login+"', now(), '"+this.state.id_pengguna_login+"', "+
                    //         "now(), 'sales', '"+this.state.sa_divisi+"', "+
                    //         "false, false, '0', false, '') returning update_date")
                    passqueryinsertakun = encrypt("insert into gcm_master_user (nama, no_nik, no_hp, email, username, password, status, " +
                        "role, company_id, create_by, create_date, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, " +
                        "id_blacklist, is_blacklist, notes_blacklist, kode_sales) values (" +
                        "'" + this.state.nama_sales_inserted + "', '" + this.state.no_nik_sales_inserted + "', '" + this.state.no_hp_sales_inserted + "', " +
                        "'" + this.state.email_sales_inserted + "', '" + this.state.username_sales_inserted + "', '" + encryptpassword + "', " +
                        "'I', 'admin', '" + this.state.company_id + "', " +
                        "'" + this.state.id_pengguna_login + "', now(), '" + this.state.id_pengguna_login + "', " +
                        "now(), 'sales', '" + this.state.sa_divisi + "', " +
                        "false, false, '0', false, '', '" + this.state.kode_sales_inserted + "') returning update_date")
                }
                const resinsertakun = await this.props.insertMasterAkun({ query: passqueryinsertakun }).catch(err => err)
                Toast.hide();
                if (resinsertakun) {
                    swal({
                        title: "Sukses!",
                        text: "Akun berhasil ditambahkan!",
                        icon: "success",
                        button: false,
                        timer: "2500"
                    }).then(() => {                        
                        this.setState({ isOpenConfirmInsert: false })
                        this.handleModalInsert()
                        this.loadSales()
                        this.loadCategory()
                    });
                } else {
                    swal({
                        title: "Kesalahan 503!",
                        text: "Harap periksa koneksi internet!",
                        icon: "error",
                        buttons: {
                            confirm: "Oke"
                        }
                    })
                }
            } else {
                swal({
                    title: "Gagal!",
                    text: "Tidak ada perubahan disimpan!",
                    icon: "error",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    window.location.reload()
                });
            }
        }
    }

    check_field_nama_sales_edited = (e) => {
        if (e === '') {
            this.setState({ validation_nama_sales: false, feedback_nama_sales: 'Kolom ini wajib diisi', empty_nama_sales: true, isBtnUpdate: true })
        } else {
            this.setState({ validation_nama_sales: true, feedback_nama_sales: '', empty_nama_sales: false })
            // handle button
            // if (this.state.no_ktp_sales.length === 16 &&
            if (this.state.no_nik_sales !== '' &&
                (this.state.kode_sales !== '' && this.state.kode_sales !== null) &&
                (this.state.no_hp_sales !== '' && this.state.no_hp_sales.length <= 15) &&
                (this.state.email_sales !== '' || this.state.validation_email_sales === true) &&
                (this.state.username_sales !== '' || this.state.validation_username_sales === true) &&
                (this.state.password_sales !== '' || this.state.validation_password_sales === true)) {
                this.setState({ isBtnUpdate: false })
            }
        }
    }

    check_field_username_sales_edited = (e) => {
        if (e === '') {
            this.setState({ empty_username_sales: true, feedback_username_sales: 'Kolom ini wajib diisi', isBtnUpdate: true })
        } else {
            if (e.length < 8 && e.length > 0) {
                this.setState({
                    validation_username_sales: false,
                    empty_username_sales: true,
                    feedback_username_sales: 'Nama pengguna minimal 8 karakter',
                    isBtnUpdate: true
                })
            }
            else if (e.length >= 8) {
                this.setState({ empty_username_sales: false })
                let check_username = this.state.allUsername.filter(input_username => { return input_username.username === e });
                if (check_username !== '' && check_username.length === 0) {
                    this.setState({
                        validation_username_sales: true, empty_username_sales: false,
                        feedback_username_sales: ''
                    })
                    // handle button
                    // if (this.state.nama_sales !== '' && this.state.no_ktp_sales.length === 16 &&
                    if (this.state.nama_sales !== '' && this.state.no_nik_sales !== '' &&
                        (this.state.kode_sales !== '' && this.state.kode_sales !== null) &&
                        (this.state.no_hp_sales !== '' && this.state.no_hp_sales.length <= 15) &&
                        (this.state.email_sales !== '' || this.state.validation_email_sales === true) &&
                        (this.state.password_sales !== '' || this.state.validation_password_sales === true)) {
                        this.setState({ isBtnUpdate: false })
                    }
                } else {
                    this.setState({
                        validation_username_sales: false, empty_username_sales: true,
                        feedback_username_sales: 'Nama pengguna telah digunakan', isBtnUpdate: true
                    })
                    if (e === this.state.pembanding_username_sales) {
                        this.setState({
                            empty_username_sales: false,
                            feedback_username_sales: ''
                        })
                        // if (this.state.nama_sales !== '' && this.state.no_ktp_sales.length === 16 &&
                        if (this.state.nama_sales !== '' && this.state.no_nik_sales !== '' &&
                            (this.state.kode_sales !== '' && this.state.kode_sales !== null) &&
                            (this.state.no_hp_sales !== '' && this.state.no_hp_sales.length <= 15) &&
                            (this.state.email_sales !== '' || this.state.validation_email_sales === true) &&
                            (this.state.password_sales !== '' || this.state.validation_password_sales === true)) {
                            this.setState({ isBtnUpdate: false })
                        }
                    }
                }
            }
        }
    }

    check_field_nik_sales_edited = (e) => {
        if (e === '') {
            this.setState({ empty_no_nik_sales: true, feedback_no_nik_sales: 'Kolom ini wajib diisi', isBtnUpdate: true })
        } else {
            // if (e.length === 16) {
            this.setState({
                validation_no_nik_sales: true,
                empty_no_nik_sales: false,
                feedback_no_nik_sales: '',
                isBtnUpdate: true
            })
            // handle button
            if (this.state.nama_sales !== '' &&
                (this.state.kode_sales !== '' && this.state.kode_sales !== null) &&
                (this.state.no_hp_sales !== '' && this.state.no_hp_sales.length <= 15) &&
                (this.state.email_sales !== '' || this.state.validation_email_sales === true) &&
                (this.state.username_sales !== '' || this.state.validation_username_sales === true) &&
                (this.state.password_sales !== '' || this.state.validation_password_sales === true)) {
                this.setState({ isBtnUpdate: false })
            }
            // } else {
            //     this.setState({
            //         empty_no_nik_sales: true,
            //         feedback_no_nik_sales: 'Nomor KTP terdiri atas 16 karakter',
            //         isBtnUpdate: true
            //     })
            // }
        }
    }

    check_field_email_sales_edited = (e) => {
        if (e === '') {
            this.setState({
                empty_email_sales: true,
                feedback_email_sales: 'Kolom ini wajib diisi',
                isBtnUpdate: true
            })
        } else {
            const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (emailRex.test(e)) {
                this.setState({
                    validation_email_sales: true,
                    empty_email_sales: false,
                    feedback_email_sales: ''
                })
                // handle button
                // if (this.state.nama_sales !== '' && this.state.no_ktp_sales.length === 16 &&
                if (this.state.nama_sales !== '' && this.state.no_nik_sales !== '' &&
                    (this.state.kode_sales !== '' && this.state.kode_sales !== null) &&
                    (this.state.no_hp_sales !== '' && this.state.no_hp_sales.length <= 15) &&
                    (this.state.username_sales !== '' || this.state.validation_username_sales === true) &&
                    (this.state.password_sales !== '' || this.state.validation_password_sales === true)) {
                    this.setState({ isBtnUpdate: false })
                }
            } else {
                this.setState({
                    empty_email_sales: true,
                    feedback_email_sales: 'Masukkan alamat email dengan benar',
                    isBtnUpdate: true
                })
            }
        }
    }

    check_field_telepon_sales_edited = (e) => {
        if (e === '') {
            this.setState({
                empty_no_hp_sales: true, feedback_no_hp_sales: 'Kolom ini wajib diisi',
                isBtnUpdate: true
            })
        } else {
            if (e.length > 15) {
                this.setState({
                    empty_no_hp_sales: true,
                    feedback_no_hp_sales: 'Nomor telepon maksimal terdiri atas 15 karakter',
                    isBtnUpdate: true
                })
            } else {
                this.setState({
                    validation_no_hp_sales: true,
                    empty_no_hp_sales: false,
                    feedback_no_hp_sales: ''
                })
                // handle button
                // if (this.state.nama_sales !== '' && this.state.no_ktp_sales.length === 16 &&
                if (this.state.nama_sales !== '' && this.state.no_nik_sales !== '' &&
                    (this.state.kode_sales !== '' && this.state.kode_sales !== null) &&
                    (this.state.email_sales !== '' || this.state.validation_email_sales === true) &&
                    (this.state.username_sales !== '' || this.state.validation_username_sales === true) &&
                    (this.state.password_sales !== '' || this.state.validation_password_sales === true)) {
                    this.setState({ isBtnUpdate: false })
                }
            }
        }
    }

    check_field_kode_sales_edited = (e) => {
        if (e === '') {
            this.setState({ validation_kode_sales: false, feedback_kode_sales: 'Kolom ini wajib diisi', empty_kode_sales: true, isBtnUpdate: true })
        } else {
            this.setState({ validation_kode_sales: true, feedback_kode_sales: '', empty_kode_sales: false })
            // handle button
            // if (this.state.no_ktp_sales.length === 16 &&
            if (this.state.no_nik_sales !== '' &&
                (this.state.no_hp_sales !== '' && this.state.no_hp_sales.length <= 15) &&
                (this.state.email_sales !== '' || this.state.validation_email_sales === true) &&
                (this.state.username_sales !== '' || this.state.validation_username_sales === true) &&
                (this.state.password_sales !== '' || this.state.validation_password_sales === true)) {
                this.setState({ isBtnUpdate: false })
            }
        }
    }

    check_field_password_sales_edited = async (e) => {
        if (e === '') {
            await this.setState({
                empty_password_sales: true,
                validation_password_sales: false,
                feedback_password_sales: 'Kolom ini wajib diisi',
                isBtnUpdate: true,
                // disable_confirm_password_edited: true,
                // feedback_confirm_password_sales:'',
                // empty_confirm_password_sales:false,
                // validation_confirm_password_sales:false,
                // confirm_password_sales:''
            })
            document.getElementById('errorpasswordedited').style.display = 'block'
            // document.getElementById('errorpasswordeditedkedua').style.display='block'
        } else {
            const passwordRex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            // this.setState({disable_confirm_password_edited: false})
            if (passwordRex.test(e)) {
                this.setState({
                    validation_password_sales: true,
                    empty_password_sales: false,
                    feedback_password_sales: '',
                })
                // if (this.state.confirm_password_sales_inserted !== '') {
                //     if (e === this.state.confirm_password_sales_inserted) {
                //         await this.setState({
                //             validation_confirm_password_sales_inserted: true, 
                //             empty_confirm_password_sales_inserted: false, 
                //             feedback_confirm_password_sales_inserted:'',
                //         })
                // handle button
                // if (this.state.nama_sales !== '' && this.state.no_ktp_sales.length === 16 &&
                if (this.state.nama_sales !== '' && this.state.no_nik_sales !== '' &&
                    (this.state.kode_sales !== '' && this.state.kode_sales !== null) &&
                    (this.state.no_hp_sales !== '' && this.state.no_hp_sales.length <= 15) &&
                    (this.state.email_sales !== '' || this.state.validation_email_sales === true) &&
                    (this.state.username_sales !== '' || this.state.validation_username_sales === true)) {
                    this.setState({ isBtnUpdate: false })
                }
                //     } else {
                //         this.setState({
                //             validation_confirm_password_sales_inserted: false, 
                //             empty_confirm_password_sales_inserted: true,
                //             feedback_confirm_password_sales_inserted: 'Kata sandi tidak cocok',
                //             isBtnInsert: true
                //         })
                //         document.getElementById('errorpasswordkedua').style.display='block'
                //     }
                // }
                document.getElementById('errorpasswordedited').style.display = 'none'
            } else {
                if (e !== '') {
                    this.setState({
                        empty_password_sales: true,
                        feedback_password_sales: 'Kata sandi minimal 8 karakter terdiri huruf besar, kecil, dan angka',
                        isBtnUpdate: true
                    })
                    document.getElementById('errorpasswordedited').style.display = 'block'
                }
            }
        }
    }

    handleModalConfirm = async () => {
        await this.loadUsernameAccount()
        await this.checkFinalFieldUpdate()
        await this.loadCheckingKodeSales(this.state.kode_sales)
        let check_username = this.state.allUsername.filter(input_username => { return input_username.username === this.state.account_info_username_selected });
        if (check_username !== '' && check_username.length === 0) {
            if (this.state.kode_sales === this.state.pembanding_kode_sales && Number(this.state.allCheckedKodeSales) === 1) {
                if (Number(this.state.check_username_update) === 0 &&
                    Number(this.state.check_nohp_update) === 0 &&
                    Number(this.state.check_email_update) === 0 &&
                    Number(this.state.check_nik_update) === 0) {
                    this.setState({
                        isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
                    })
                } else {
                    if (Number(this.state.check_username_update) > 0) {
                        this.setState({
                            validation_username_sales: false, empty_username_sales: true,
                            feedback_username_sales: 'Nama pengguna telah digunakan', isBtnUpdate: true
                        })
                    }
                    if (Number(this.state.check_nohp_update) > 0) {
                        this.setState({
                            validation_no_hp_sales: false, empty_no_hp_sales: true,
                            feedback_no_hp_sales: 'Nomor telepon telah digunakan', isBtnUpdate: true
                        })
                    }
                    if (Number(this.state.check_email_update) > 0) {
                        this.setState({
                            validation_email_sales: false, empty_email_sales: true,
                            feedback_email_sales: 'Email telah digunakan', isBtnUpdate: true
                        })
                    }
                    if (Number(this.state.check_nik_update) > 0) {
                        this.setState({
                            validation_no_nik_sales: false, empty_no_nik_sales: true,
                            feedback_no_nik_sales: 'Nomor NIK telah digunakan', isBtnUpdate: true
                        })
                    }
                }
            } else {
                if (Number(this.state.allCheckedKodeSales) > 0) {
                    this.handleModalAttentionKodeSales()
                    this.setState({
                        validation_kode_sales: false, empty_kode_sales: true,
                        feedback_kode_sales: 'Kode sales distributor telah digunakan', isBtnUpdate: true
                    })
                    if (Number(this.state.check_username_update) > 0) {
                        this.setState({
                            validation_username_sales: false, empty_username_sales: true,
                            feedback_username_sales: 'Nama pengguna telah digunakan', isBtnUpdate: true
                        })
                    }
                    if (Number(this.state.check_nohp_update) > 0) {
                        this.setState({
                            validation_no_hp_sales: false, empty_no_hp_sales: true,
                            feedback_no_hp_sales: 'Nomor telepon telah digunakan', isBtnUpdate: true
                        })
                    }
                    if (Number(this.state.check_email_update) > 0) {
                        this.setState({
                            validation_email_sales: false, empty_email_sales: true,
                            feedback_email_sales: 'Email telah digunakan', isBtnUpdate: true
                        })
                    }
                    if (Number(this.state.check_nik_update) > 0) {
                        this.setState({
                            validation_no_nik_sales: false, empty_no_nik_sales: true,
                            feedback_no_nik_sales: 'Nomor NIK telah digunakan', isBtnUpdate: true
                        })
                    }
                } else {
                    if (Number(this.state.check_username_update) === 0 &&
                        Number(this.state.check_nohp_update) === 0 &&
                        Number(this.state.check_email_update) === 0 &&
                        Number(this.state.check_nik_update) === 0) {
                        this.setState({
                            isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
                        })
                    } else {
                        if (Number(this.state.check_username_update) > 0) {
                            this.setState({
                                validation_username_sales: false, empty_username_sales: true,
                                feedback_username_sales: 'Nama pengguna telah digunakan', isBtnUpdate: true
                            })
                        }
                        if (Number(this.state.check_nohp_update) > 0) {
                            this.setState({
                                validation_no_hp_sales: false, empty_no_hp_sales: true,
                                feedback_no_hp_sales: 'Nomor telepon telah digunakan', isBtnUpdate: true
                            })
                        }
                        if (Number(this.state.check_email_update) > 0) {
                            this.setState({
                                validation_email_sales: false, empty_email_sales: true,
                                feedback_email_sales: 'Email telah digunakan', isBtnUpdate: true
                            })
                        }
                        if (Number(this.state.check_nik_update) > 0) {
                            this.setState({
                                validation_no_nik_sales: false, empty_no_nik_sales: true,
                                feedback_no_nik_sales: 'Nomor NIK telah digunakan', isBtnUpdate: true
                            })
                        }
                    }
                }
            }
        } else {
            if (this.state.username_sales === this.state.pembanding_username_sales) {
                if (this.state.kode_sales === this.state.pembanding_kode_sales && Number(this.state.allCheckedKodeSales) === 1) {
                    if (Number(this.state.check_username_update) === 0 &&
                        Number(this.state.check_nohp_update) === 0 &&
                        Number(this.state.check_email_update) === 0 &&
                        Number(this.state.check_nik_update) === 0) {
                        this.setState({
                            isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
                        })
                    } else {
                        if (Number(this.state.check_username_update) > 0) {
                            this.setState({
                                validation_username_sales: false, empty_username_sales: true,
                                feedback_username_sales: 'Nama pengguna telah digunakan', isBtnUpdate: true
                            })
                        }
                        if (Number(this.state.check_nohp_update) > 0) {
                            this.setState({
                                validation_no_hp_sales: false, empty_no_hp_sales: true,
                                feedback_no_hp_sales: 'Nomor telepon telah digunakan', isBtnUpdate: true
                            })
                        }
                        if (Number(this.state.check_email_update) > 0) {
                            this.setState({
                                validation_email_sales: false, empty_email_sales: true,
                                feedback_email_sales: 'Email telah digunakan', isBtnUpdate: true
                            })
                        }
                        if (Number(this.state.check_nik_update) > 0) {
                            this.setState({
                                validation_no_nik_sales: false, empty_no_nik_sales: true,
                                feedback_no_nik_sales: 'Nomor NIK telah digunakan', isBtnUpdate: true
                            })
                        }
                    }
                } else {
                    if (Number(this.state.allCheckedKodeSales) > 0) {
                        this.handleModalAttentionKodeSales()
                        this.setState({
                            validation_kode_sales: false, empty_kode_sales: true,
                            feedback_kode_sales: 'Kode sales distributor telah digunakan', isBtnUpdate: true
                        })
                        if (Number(this.state.check_username_update) > 0) {
                            this.setState({
                                validation_username_sales: false, empty_username_sales: true,
                                feedback_username_sales: 'Nama pengguna telah digunakan', isBtnUpdate: true
                            })
                        }
                        if (Number(this.state.check_nohp_update) > 0) {
                            this.setState({
                                validation_no_hp_sales: false, empty_no_hp_sales: true,
                                feedback_no_hp_sales: 'Nomor telepon telah digunakan', isBtnUpdate: true
                            })
                        }
                        if (Number(this.state.check_email_update) > 0) {
                            this.setState({
                                validation_email_sales: false, empty_email_sales: true,
                                feedback_email_sales: 'Email telah digunakan', isBtnUpdate: true
                            })
                        }
                        if (Number(this.state.check_nik_update) > 0) {
                            this.setState({
                                validation_no_nik_sales: false, empty_no_nik_sales: true,
                                feedback_no_nik_sales: 'Nomor NIK telah digunakan', isBtnUpdate: true
                            })
                        }
                    } else {
                        if (Number(this.state.check_username_update) === 0 &&
                            Number(this.state.check_nohp_update) === 0 &&
                            Number(this.state.check_email_update) === 0 &&
                            Number(this.state.check_nik_update) === 0) {
                            this.setState({
                                isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
                            })
                        } else {
                            if (Number(this.state.check_username_update) > 0) {
                                this.setState({
                                    validation_username_sales: false, empty_username_sales: true,
                                    feedback_username_sales: 'Nama pengguna telah digunakan', isBtnUpdate: true
                                })
                            }
                            if (Number(this.state.check_nohp_update) > 0) {
                                this.setState({
                                    validation_no_hp_sales: false, empty_no_hp_sales: true,
                                    feedback_no_hp_sales: 'Nomor telepon telah digunakan', isBtnUpdate: true
                                })
                            }
                            if (Number(this.state.check_email_update) > 0) {
                                this.setState({
                                    validation_email_sales: false, empty_email_sales: true,
                                    feedback_email_sales: 'Email telah digunakan', isBtnUpdate: true
                                })
                            }
                            if (Number(this.state.check_nik_update) > 0) {
                                this.setState({
                                    validation_no_nik_sales: false, empty_no_nik_sales: true,
                                    feedback_no_nik_sales: 'Nomor NIK telah digunakan', isBtnUpdate: true
                                })
                            }
                        }
                    }
                }
            } else {
                this.setState({
                    validation_username_sales: false, empty_username_sales: true,
                    feedback_username_sales: 'Nama pengguna telah digunakan', isBtnUpdate: true
                })
            }
        }
    }

    confirmActionUpdateAkun = async () => {
        Toast.loading('Loading...');
        let passencrypt = encrypt(this.state.password_sales)
        let passqueryupdateakun = ""
        await this.checkFinalFieldUpdate()
        if (Number(this.state.check_username_update) === 0 &&
            Number(this.state.check_nohp_update) === 0 &&
            Number(this.state.check_email_update) === 0 &&
            Number(this.state.check_nik_update) === 0) {
            if (this.state.tipe_bisnis === '1') {
                if (this.state.status_sales === 'Belum Aktif') {
                    // passqueryupdateakun = encrypt("update gcm_master_user set username='"+this.state.username_sales+"', "+
                    //     "nama='"+this.state.nama_sales+"', no_ktp='"+this.state.no_ktp_sales+"', no_hp='"+this.state.no_hp_sales+"', "+
                    //     "email='"+this.state.email_sales+"', sa_divisi='"+this.state.id_kategori_sales+"', password='"+passencrypt+"', "+
                    //     "status='I', update_by='"+this.state.id_pengguna_login+"', update_date=now() "+
                    //         "where id="+this.state.id_sales+" returning nama;")
                    passqueryupdateakun = encrypt("update gcm_master_user set username='" + this.state.username_sales + "', " +
                        "nama='" + this.state.nama_sales + "', no_nik='" + this.state.no_nik_sales + "', no_hp='" + this.state.no_hp_sales + "', " +
                        "email='" + this.state.email_sales + "', sa_divisi='" + this.state.id_kategori_sales + "', password='" + passencrypt + "', " +
                        "status='I', update_by='" + this.state.id_pengguna_login + "', update_date=now(), kode_sales='" + this.state.kode_sales + "' " +
                        "where id=" + this.state.id_sales + " returning nama;")
                } else {
                    let pushstatusakun = ""
                    if (this.state.status_akun_default === 'Aktif') {
                        pushstatusakun = "A"
                    } else {
                        pushstatusakun = "R"
                    }
                    // passqueryupdateakun = encrypt("update gcm_master_user set username='"+this.state.username_sales+"', "+
                    //     "nama='"+this.state.nama_sales+"', no_ktp='"+this.state.no_ktp_sales+"', no_hp='"+this.state.no_hp_sales+"', "+
                    //     "email='"+this.state.email_sales+"', sa_divisi='"+this.state.id_kategori_sales+"', password='"+passencrypt+"', "+
                    //     "status='"+pushstatusakun+"', update_by='"+this.state.id_pengguna_login+"', update_date=now() "+
                    //         "where id="+this.state.id_sales+" returning nama;")
                    passqueryupdateakun = encrypt("update gcm_master_user set username='" + this.state.username_sales + "', " +
                        "nama='" + this.state.nama_sales + "', no_nik='" + this.state.no_nik_sales + "', no_hp='" + this.state.no_hp_sales + "', " +
                        "email='" + this.state.email_sales + "', sa_divisi='" + this.state.id_kategori_sales + "', password='" + passencrypt + "', " +
                        "status='" + pushstatusakun + "', update_by='" + this.state.id_pengguna_login + "', update_date=now(), kode_sales='" + this.state.kode_sales + "' " +
                        "where id=" + this.state.id_sales + " returning nama;")
                }
            } else {
                if (this.state.status_sales === 'Belum Aktif') {
                    // passqueryupdateakun = encrypt("update gcm_master_user set username='"+this.state.username_sales+"', "+
                    //     "nama='"+this.state.nama_sales+"', no_ktp='"+this.state.no_ktp_sales+"', no_hp='"+this.state.no_hp_sales+"', "+
                    //     "email='"+this.state.email_sales+"', sa_divisi='"+this.state.sa_divisi+"', password='"+passencrypt+"', "+
                    //     "status='I', update_by='"+this.state.id_pengguna_login+"', update_date=now() "+
                    //         "where id="+this.state.id_sales+" returning nama;")
                    passqueryupdateakun = encrypt("update gcm_master_user set username='" + this.state.username_sales + "', " +
                        "nama='" + this.state.nama_sales + "', no_nik='" + this.state.no_nik_sales + "', no_hp='" + this.state.no_hp_sales + "', " +
                        "email='" + this.state.email_sales + "', sa_divisi='" + this.state.sa_divisi + "', password='" + passencrypt + "', " +
                        "status='I', update_by='" + this.state.id_pengguna_login + "', update_date=now(), kode_sales='" + this.state.kode_sales + "' " +
                        "where id=" + this.state.id_sales + " returning nama;")
                } else {
                    let pushstatusakun = ""
                    if (this.state.status_akun_default === 'Aktif') {
                        pushstatusakun = "A"
                    } else {
                        pushstatusakun = "R"
                    }
                    // passqueryupdateakun = encrypt("update gcm_master_user set username='"+this.state.username_sales+"', "+
                    //     "nama='"+this.state.nama_sales+"', no_ktp='"+this.state.no_ktp_sales+"', no_hp='"+this.state.no_hp_sales+"', "+
                    //     "email='"+this.state.email_sales+"', sa_divisi='"+this.state.sa_divisi+"', password='"+passencrypt+"', "+
                    //     "status='"+pushstatusakun+"', update_by='"+this.state.id_pengguna_login+"', update_date=now() "+
                    //         "where id="+this.state.id_sales+" returning nama;")
                    passqueryupdateakun = encrypt("update gcm_master_user set username='" + this.state.username_sales + "', " +
                        "nama='" + this.state.nama_sales + "', no_nik='" + this.state.no_nik_sales + "', no_hp='" + this.state.no_hp_sales + "', " +
                        "email='" + this.state.email_sales + "', sa_divisi='" + this.state.sa_divisi + "', password='" + passencrypt + "', " +
                        "status='" + pushstatusakun + "', update_by='" + this.state.id_pengguna_login + "', update_date=now(), kode_sales='" + this.state.kode_sales + "' " +
                        "where id=" + this.state.id_sales + " returning nama;")
                }
            }
            const resupdateAkun = await this.props.updateMasterUser({ query: passqueryupdateakun }).catch(err => err)
            Toast.hide();
            if (resupdateAkun) {
                swal({
                    title: "Sukses!",
                    text: "Perubahan disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.setState({ isOpenConfirmUpdate: false })
                    this.handleModalDetail()
                    this.loadSales()
                    this.loadCategory()
                });
            } else {
                swal({
                    title: "Gagal!",
                    text: "Tidak ada perubahan disimpan!",
                    icon: "error",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    window.location.reload()
                });
            }
        } else {
            swal({
                title: "Gagal!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                button: false,
                timer: "2500"
            }).then(() => {
                window.location.reload()
            });
        }
    }

    handleWindowReload = () => {
        window.location.reload()
    }

    handleModalAttentionKodeSalesConfirmKedua = () => {
        this.setState({ isOpenAttentionKodeSalesConfirmKedua: !this.state.isOpenAttentionKodeSalesConfirmKedua })
    }

    checkFinalFieldInsert = async () => {
        let passquerycheckfieldinsert = encrypt("select * from " +
            "(select count (username) as check_username from gcm_master_user where username like '" + this.state.username_sales_inserted + "') a, " +
            "(select count (no_hp) check_nohp from gcm_master_user where no_hp like '" + this.state.no_hp_sales_inserted + "') b, " +
            "(select count (email) check_email from gcm_master_user where email like '" + this.state.email_sales_inserted + "') c, " +
            "(select count (no_nik) check_nik from gcm_master_user where no_nik like '" + this.state.no_nik_sales_inserted + "' " +
            "and company_id=" + this.state.company_id + ") d ")
        const rescheckfieldinsert = await this.props.checkFieldInsertAkun({ query: passquerycheckfieldinsert }).catch(err => err)
        if (rescheckfieldinsert) {
            await this.setState({
                check_username_insert: rescheckfieldinsert.check_username,
                check_nohp_insert: rescheckfieldinsert.check_nohp,
                check_email_insert: rescheckfieldinsert.check_email,
                check_nik_insert: rescheckfieldinsert.check_nik
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
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    checkFinalFieldUpdate = async () => {
        let passquerycheckfieldupdate = encrypt("select * from " +
            "(select count (username) as check_username from gcm_master_user where username like '" + this.state.username_sales + "' and id !=" + this.state.id_sales + ") a, " +
            "(select count (no_hp) check_nohp from gcm_master_user where no_hp like '" + this.state.no_hp_sales + "' and id !=" + this.state.id_sales + ") b, " +
            "(select count (email) check_email from gcm_master_user where email like '" + this.state.email_sales + "' and id !=" + this.state.id_sales + ") c, " +
            "(select count (no_nik) check_nik from gcm_master_user where no_nik like '" + this.state.no_nik_sales + "' " +
            "and company_id=" + this.state.company_id + " and id !=" + this.state.id_sales + ") d ")
        const rescheckfieldupdate = await this.props.checkFieldInsertAkun({ query: passquerycheckfieldupdate }).catch(err => err)
        if (rescheckfieldupdate) {
            await this.setState({
                check_username_update: rescheckfieldupdate.check_username,
                check_nohp_update: rescheckfieldupdate.check_nohp,
                check_email_update: rescheckfieldupdate.check_email,
                check_nik_update: rescheckfieldupdate.check_nik
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
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    render() {
        const data = {
            columns: [
                {
                    label: 'Kode Sales Distributor',
                    field: 'kode_sales',
                    width: 100
                },
                {
                    label: 'Nama Lengkap',
                    field: 'nama',
                    width: 100
                },
                {
                    label: 'Nama Pengguna',
                    field: 'username',
                    width: 100
                },
                {
                    label: 'Status Akun',
                    field: 'show_status',
                    width: 100
                },
                {
                    label: 'Kategori Sales',
                    field: 'nama_kategori',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allSales
        }
        const dataCompanyHandled = {
            columns: [
                {
                    label: 'Nama Perusahaan',
                    field: 'nama_perusahaan',
                    width: 100
                },
                {
                    label: 'Tipe Bisnis',
                    field: 'nama_kategori',
                    width: 100
                },
                {
                    label: 'Status Perusahaan',
                    field: 'status',
                    width: 100
                }],
            rows: this.state.allCompanyHandledBySales
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-user icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Sales
                                    <div className="page-title-subheading">Daftar sales yang terdaftar pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">

                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Tambah akun sales" onClick={this.handleModalInsert}>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <div className="card-body">
                                    <div>
                                        <MDBDataTable
                                            bordered
                                            striped
                                            responsive
                                            hover
                                            sorting="false"
                                            data={data}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Insert Sales */}
                <Modal size="lg" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Akun Sales</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <div className="row">
                                <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                    <FormGroup>
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Lengkap</p>
                                        <Input type="text" name="nama_sales_inserted" id="nama_sales_inserted"
                                            value={this.state.nama_sales_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                            valid={this.state.validation_nama_sales_inserted}
                                            invalid={this.state.empty_nama_sales_inserted} />
                                        <FormFeedback>{this.state.feedback_nama_sales_inserted}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Nomor Induk Karyawan</p>
                                        <Input type="text" name="no_nik_sales_inserted" id="no_nik_sales_inserted"
                                            value={this.state.no_nik_sales_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_no_nik_sales_inserted}
                                            invalid={this.state.empty_no_nik_sales_inserted} />
                                        <FormFeedback>{this.state.feedback_no_nik_sales_inserted}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Nomor Telepon</p>
                                        <Input type="text" name="no_hp_sales_inserted" id="no_hp_sales_inserted"
                                            value={this.state.no_hp_sales_inserted}
                                            maxLength={15}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_no_hp_sales_inserted}
                                            invalid={this.state.empty_no_hp_sales_inserted} />
                                        <FormFeedback>{this.state.feedback_no_hp_sales_inserted}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Email</p>
                                        <Input type="email" name="email_sales_inserted" id="email_sales_inserted"
                                            value={this.state.email_sales_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_email_sales_inserted}
                                            invalid={this.state.empty_email_sales_inserted} />
                                        <FormFeedback>{this.state.feedback_email_sales_inserted}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Sales Distributor</p>
                                        <Input type="text" name="kode_sales_inserted" id="kode_sales_inserted" className="form-control"
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            value={this.state.kode_sales_inserted}
                                            valid={this.state.validation_kode_sales_inserted}
                                            invalid={this.state.empty_kode_sales_inserted}
                                        />
                                        <FormFeedback>{this.state.feedback_kode_sales_inserted}</FormFeedback>
                                    </FormGroup>
                                </div>
                                <div style={{ width: '50%', float: 'right', paddingLeft: '3%', paddingRight: '3%' }}>
                                    <FormGroup>
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Pengguna</p>
                                        <Input type="text" name="username_sales_inserted" id="username_sales_inserted"
                                            value={this.state.username_sales_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_username_sales_inserted}
                                            invalid={this.state.empty_username_sales_inserted} />
                                        <FormFeedback>{this.state.feedback_username_sales_inserted}</FormFeedback>
                                    </FormGroup>
                                    {
                                        (this.state.sa_role === 'admin' && this.state.sa_divisi === '1') ?
                                            <FormGroup>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Kategori Sales</p>
                                                <Input type="select" name="id_kategori_sales_inserted" id="id_kategori_sales_inserted"
                                                    value={this.state.id_kategori_sales_inserted}
                                                    onChange={this.handleChange}
                                                >
                                                    {
                                                        this.state.allCategory.map(allCategory => {
                                                            return <option value={allCategory.id} key={allCategory.id}>{allCategory.nama}</option>
                                                        })
                                                    }
                                                </Input>
                                            </FormGroup>
                                            : null
                                    }
                                    <FormGroup>
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Kata Sandi</p>
                                        <div className="input-group-prepend">
                                            <Input type={this.state.viewpassword} name="password_sales_inserted" id="password_sales_inserted"
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                                value={this.state.password_sales_inserted}
                                                valid={this.state.validation_password_sales_inserted}
                                                invalid={this.state.empty_password_sales_inserted} />
                                            <span className="input-group-text" onClick={this.handleviewpassword}>
                                                <i className={this.state.logopassword}> </i>
                                            </span>
                                        </div>
                                        <div id="errorpassword" style={{ display: 'none', marginTop: '1%' }}>
                                            <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.feedback_password_sales_inserted}</p>
                                        </div>
                                        <FormFeedback>{this.state.feedback_password_sales_inserted}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Konfirmasi Kata Sandi</p>
                                        <div className="input-group-prepend">
                                            <Input type={this.state.viewpasswordkedua} name="confirm_password_sales_inserted" id="confirm_password_sales_inserted"
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                                value={this.state.confirm_password_sales_inserted}
                                                valid={this.state.validation_confirm_password_sales_inserted}
                                                disabled={this.state.disable_confirm_password}
                                                invalid={this.state.empty_confirm_password_sales_inserted} />
                                            <span className="input-group-text" onClick={this.handleviewpasswordkedua}>
                                                <i className={this.state.logopasswordkedua}> </i>
                                            </span>
                                        </div>
                                        <div id="errorpasswordkedua" style={{ display: 'none', marginTop: '1%' }}>
                                            <p style={{ color: '#d92550', fontSize: '10pt' }}>{this.state.feedback_confirm_password_sales_inserted}</p>
                                        </div>
                                        <FormFeedback>{this.state.feedback_confirm_password_sales_inserted}</FormFeedback>
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={this.state.isBtnInsert}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Insert */}
                <Modal size="sm" toggle={this.handleModalConfirmInsert} isOpen={this.state.isOpenConfirmInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsert}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionInsertAkun}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Sales */}
                <Modal size="lg" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Edit Akun Sales</ModalHeader>
                    <ModalBody>
                        <div className="card-header card-header-tab-animation">
                            <ul className="nav nav-justified">
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-0-account" className="active nav-link">Informasi Akun Sales</a></li>
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-1-account" className="nav-link">Data Perusahaan Terkait</a></li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content">
                                <div className="tab-pane active" id="tab-eg115-0-account" role="tabpanel">
                                    <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                        <div className="row">
                                            <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                                <FormGroup>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Lengkap</p>
                                                    <Input type="text" name="nama_sales" id="nama_sales"
                                                        value={this.state.nama_sales}
                                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                                        valid={this.state.validation_nama_sales}
                                                        invalid={this.state.empty_nama_sales} />
                                                    <FormFeedback>{this.state.feedback_nama_sales}</FormFeedback>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nomor Induk Karyawan</p>
                                                    <Input type="text" name="no_nik_sales" id="no_nik_sales"
                                                        value={this.state.no_nik_sales}
                                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                        valid={this.state.validation_no_nik_sales}
                                                        invalid={this.state.empty_no_nik_sales} />
                                                    <FormFeedback>{this.state.feedback_no_nik_sales}</FormFeedback>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nomor Telepon</p>
                                                    <Input type="text" name="no_hp_sales" id="no_hp_sales"
                                                        value={this.state.no_hp_sales}
                                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                        valid={this.state.validation_no_hp_sales}
                                                        maxLength={15}
                                                        invalid={this.state.empty_no_hp_sales} />
                                                    <FormFeedback>{this.state.feedback_no_hp_sales}</FormFeedback>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Email</p>
                                                    <Input type="email" name="email_sales" id="email_sales"
                                                        value={this.state.email_sales}
                                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                        valid={this.state.validation_email_sales}
                                                        invalid={this.state.empty_email_sales} />
                                                    <FormFeedback>{this.state.feedback_email_sales}</FormFeedback>
                                                </FormGroup>
                                                {
                                                    (this.state.sa_role === 'admin' && this.state.sa_divisi === '1') ?
                                                        <FormGroup>
                                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Sales Distributor</p>
                                                            <Input type="text" name="kode_sales" id="kode_sales" className="form-control"
                                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                                value={this.state.kode_sales}
                                                                valid={this.state.validation_kode_sales}
                                                                invalid={this.state.empty_kode_sales}
                                                            />
                                                            <FormFeedback>{this.state.feedback_kode_sales}</FormFeedback>
                                                        </FormGroup>
                                                        : null
                                                }
                                            </div>
                                            <div style={{ width: '50%', float: 'right', paddingLeft: '3%', paddingRight: '3%' }}>
                                                <FormGroup>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Pengguna</p>
                                                    <Input type="text" name="username_sales" id="username_sales"
                                                        value={this.state.username_sales}
                                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                        valid={this.state.validation_username_sales}
                                                        invalid={this.state.empty_username_sales} />
                                                    <FormFeedback>{this.state.feedback_username_sales}</FormFeedback>
                                                </FormGroup>
                                                <FormGroup>
                                                    {
                                                        (this.state.sa_role === 'admin' && this.state.sa_divisi === '1') ?
                                                            <FormGroup>
                                                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Kategori Sales</p>
                                                                <Input type="select" name="id_kategori_sales" id="id_kategori_sales"
                                                                    value={this.state.id_kategori_sales}
                                                                    onChange={this.handleChange}
                                                                >
                                                                    {
                                                                        this.state.allCategory.map(allCategory => {
                                                                            return <option value={allCategory.id} key={allCategory.id}>{allCategory.nama}</option>
                                                                        })
                                                                    }
                                                                </Input>
                                                            </FormGroup>
                                                            : <FormGroup>
                                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Sales Distributor</p>
                                                                <Input type="text" name="kode_sales" id="kode_sales" className="form-control"
                                                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                                    value={this.state.kode_sales}
                                                                    valid={this.state.validation_kode_sales}
                                                                    invalid={this.state.empty_kode_sales}
                                                                />
                                                                <FormFeedback>{this.state.feedback_kode_sales}</FormFeedback>
                                                            </FormGroup>
                                                    }
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Kata Sandi</p>
                                                    <div className="input-group-prepend">
                                                        <Input type={this.state.viewpasswordedited} name="password_sales" id="password_sales"
                                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                                            value={this.state.password_sales}
                                                            valid={this.state.validation_password_sales}
                                                            invalid={this.state.empty_password_sales} />
                                                        <span className="input-group-text" onClick={this.handleviewpasswordedited}>
                                                            <i className={this.state.logopasswordedited}> </i>
                                                        </span>
                                                    </div>
                                                    <div id="errorpasswordedited" style={{ display: 'none', marginTop: '1%' }}>
                                                        <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.feedback_password_sales}</p>
                                                    </div>
                                                    <FormFeedback>{this.state.feedback_password_sales}</FormFeedback>
                                                </FormGroup>
                                                <FormGroup>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Status Akun</p>
                                                    {
                                                        this.state.status_sales === 'Belum Aktif' ?
                                                            <div className={(this.state.status_sales) === 'Aktif' ? 'mb-2 mr-2 badge badge-success'
                                                                : (this.state.status_sales) === 'Belum Aktif' ? 'mb-2 mr-2 badge badge-secondary'
                                                                    : 'mb-2 mr-2 badge badge-danger'} style={{ marginTop: '2%' }}>{this.state.status_sales}</div>
                                                            :
                                                            <Input type="select" name="status_akun_default" id="status_akun_default"
                                                                value={this.state.status_akun_default}
                                                                onChange={this.handleChange}>
                                                                <option value="Aktif">Aktif</option>
                                                                <option value='Nonaktif'>Nonaktif</option>
                                                            </Input>
                                                    }
                                                </FormGroup>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-eg115-1-account" role="tabpanel">
                                    <MDBDataTable
                                        bordered
                                        striped
                                        responsive
                                        hover
                                        data={dataCompanyHandled}
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnUpdate}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalDetail}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Update*/}
                <Modal size="sm" toggle={this.handleModalConfirm} isOpen={this.state.isOpenConfirmUpdate} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirm}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        {
                            (this.state.status_akun_default === 'Nonaktif' && this.state.pembanding_status_akun_default !== 'Nonaktif') ?
                                <div className="alert alert-danger fade show" role="alert" style={{ width: '100%', paddingLeft: '3%', paddingRight: '3%' }}>
                                    <center>
                                        Menonaktifkan akun sales ini akan mempengaruhi aktivitas manajemen pembeli, transaksi, dan negosiasi <br></br>
                                        dari perusahaan pembeli yang terkait dengan akun sales ini. Lanjutkan aksi?
                                    </center>
                                </div>
                                :
                                <div className="position-relative form-group">
                                    <label>Apakah yakin akan melakukan aksi ini?</label>
                                </div>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionUpdateAkun}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirm}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Perhatian Kode Sales Terdaftar */}
                <Modal size="sm" toggle={this.handleModalAttentionKodeSales} isOpen={this.state.isOpenAttentionKodeSales} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAttentionKodeSales}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, sistem mendeteksi kesamaan kode sales ini dengan kode sales lain yang telah terdaftar. Mohon ubah kode sales distributor untuk sales ini.</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Perhatian Kode Sales Terdaftar Confirm Kedua*/}
                <Modal size="sm" toggle={this.handleModalAttentionKodeSalesConfirmKedua} isOpen={this.state.isOpenAttentionKodeSalesConfirmKedua} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleWindowReload}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, sistem mendeteksi kesamaan kode sales ini dengan kode sales lain yang telah terdaftar. Mohon ubah kode sales distributor untuk sales ini dan ulangi proses ini.</label>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
const reduxState = (state) => ({
    userData: state.userData
})

const reduxDispatch = (dispatch) => ({
    getDataSalesAPI: (data) => dispatch(getDataSalesAPI(data)),
    getDataDetailedSalesAPI: (data) => dispatch(getDataDetailedSalesAPI(data)),
    getDataCheckedKodeSales: (data) => dispatch(getDataCheckedKodeSales(data)),
    getDataCategoryAPI: (data) => dispatch(getDataCategoryAPI(data)),
    getDataUsernameAPI: (data) => dispatch(getDataUsernameAPI(data)),
    insertMasterAkun: (data) => dispatch(insertMasterAkun(data)),
    updateMasterUser: (data) => dispatch(updateMasterUser(data)),
    getDataCompanyHandledBySales: (data) => dispatch(getDataCompanyHandledBySales(data)),
    checkFieldInsertAkun: (data) => dispatch(checkFieldInsertAkun(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentSales));