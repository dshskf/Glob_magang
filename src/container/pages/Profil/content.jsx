import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getDataDetailedAccountInfoAPI, getDataUsernameAPI, sendOtp, getOtp, updateMasterUser, updateMasterCompany,
    getDataAlamatAPI, getDataDetailedAlamatCompanyAPI, getDataProvinsi, getDataKota, getDataKecamatan, getDataKelurahan, getCurrentPassword,
    updateMasterAlamat, getDataDetailedCompanyInfoAPI, getDataCheckedKodeSales, checkFieldInsertAkun, checkFieldUpdateCompany, logoutUserAPI } from '../../../config/redux/action';
import swal from 'sweetalert';
// import OTPInput from "otp-input-react";
import InputMask from 'react-input-mask';
import { Col, Card, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Button, 
    ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, FormGroup, FormFeedback } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import Toast from 'light-toast';

class ContentProfil extends Component {
    state = {
        id_pengguna_login:'',
        company_id:'',
        company_name:'',
        tipe_bisnis:'',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        allUsername:[],
        allAlamat:[],
        allProvinsi:[],
        allKota:[],
        allKecamatan:[],
        allKelurahan:[],
        company_info_name:'',
        company_info_telepon:'',
        company_info_email:'',
        company_info_npwp:'',
        company_info_siup:'',
        company_info_tipe_bisnis:'',
        company_info_ppn:'',
        account_info_username:'',
        account_info_nama:'',
        account_info_nik:'',
        account_info_telepon:'',
        account_info_ktp:'',
        account_info_email:'',
        account_info_status:'',
        account_info_password:'',
        account_info_kode_sales:'',
        account_info_username_selected:'',
        account_info_nama_selected:'',
        account_info_nik_selected:'',
        account_info_telepon_selected:'',
        account_info_email_selected:'',
        account_info_status_selected:'',
        account_info_password_inserted:'',
        account_info_password_selected:'',
        account_info_kode_sales_selected:'',
        temp_new_password_selected:'',
        account_info_password_selected_mirror:'',
        pembanding_account_info_password_selected:'',
        pembanding_account_info_telepon_selected:'',
        pembanding_account_info_kode_sales_selected:'',
        empty_account_info_username_selected: false,
        empty_account_info_nama_selected: false,
        empty_account_info_nik_selected: false,
        empty_account_info_telepon_selected: false,
        empty_account_info_email_selected: false,
        empty_account_info_status_selected: false,
        empty_account_info_password_selected: false,
        empty_account_info_password_selected_mirror: false,
        validation_account_info_username: false,
        feedback_account_info_username_selected:'',
        validation_account_info_nama: false,
        validation_account_info_email: false,
        feedback_account_info_email_selected:'',
        validation_account_info_telepon: false,
        feedback_account_info_telepon_selected:'',
        validation_account_info_nik: false,
        feedback_account_info_nik_selected:'',
        validation_account_info_password: false,
        feedback_account_info_password_selected:'',
        validation_account_info_password_mirror: false,
        feedback_account_info_password_selected_mirror:'',
        empty_company_info_password: false,
        validation_company_info_password: false,
        isOpenModalDetailAkun: false,
        isBtnUpdate: true,
        isBtnConfirmUpdateAkun: false,
        isOpenModalDetailCompany: false,
        isBtnConfirmUpdateCompany: false,
        viewpassword: 'password',
        logopassword:'fa fa-eye-slash',
        viewpassword_mirror: 'password',
        logopassword_mirror:'fa fa-eye-slash',
        viewpassword_company: 'password',
        logopassword_company:'fa fa-eye-slash',
        company_info_name_selected:'',
        company_info_telepon_selected:'',
        company_info_email_selected:'',
        company_info_npwp_selected:'',
        company_info_siup_selected:'',
        company_info_kode:'',
        empty_company_info_name_selected:false,
        empty_company_info_telepon_selected:false,
        empty_company_info_email_selected:false,
        empty_company_info_npwp_selected:false,
        empty_company_info_siup_selected:false,
        validation_company_info_name: false,
        validation_company_info_email: false,
        validation_company_info_telepon: false,
        validation_company_info_siup: false,
        validation_company_info_npwp: false,
        feedback_company_info_name_selected:'',
        feedback_company_info_email_selected:'',
        feedback_company_info_telepon_selected:'',
        feedback_company_info_siup_selected:'',
        feedback_company_info_npwp_selected:'',
        isBtnUpdateCompany: true,
        isOpenWaitingOtp: false,
        isOpenViaOtp: false,
        isOpenModalOtp: false,
        valueOTP:'',
        sendValueOTP:'',
        messageid:'',
        defaultOtpVia: 'SMS',
        isBtnWaitOtp: true,
        isBtnConfirmOtp: false,
        timer:'',
        isOpenConfirmUpdateCompany: false,
        isOpenDetailAlamatCompany: false,
        company_alamat_selected:'',
        company_alamat_kelurahan_selected:'',
        company_alamat_kecamatan_selected:'',
        company_alamat_kota_selected:'',
        company_alamat_provinsi_selected:'',
        company_alamat_kodepos_selected:'',
        company_alamat_telepon_selected:'',
        company_alamat_id_selected:'',
        company_alamat_id_kelurahan_selected:'',
        company_alamat_id_kecamatan_selected:'',
        company_alamat_id_kota_selected:'',
        company_alamat_id_provinsi_selected:'',
        validation_company_alamat: false,
        feedback_company_alamat_selected:'',
        empty_company_alamat_selected:false,
        validation_company_alamat_kodepos: false,
        feedback_company_alamat_kodepos_selected:'',
        empty_company_alamat_kodepos_selected:false,
        validation_company_alamat_telepon: false,
        feedback_company_alamat_telepon_selected:'',
        empty_company_alamat_telepon_selected:false,
        validation_account_info_kode_sales: false,
        feedback_account_info_kode_sales_selected:'',
        empty_account_info_kode_sales_selected:false,
        isBtnUpdateAlamatCompany:true,
        isOpenConfirmUpdateAlamatCompany: false,
        company_alamat_password_inserted: '',
        viewpassword_company_alamat: 'password',
        logopassword_company_alamat:'fa fa-eye-slash',
        validation_company_alamat_password: false,
        empty_company_alamat_password: false,
        isOpenModalDetailCompanyBySales: false,
        allCheckedKodeSales:0,
        isOpenAttentionKodeSales: false,
        check_username_update: 0,
        check_nohp_update: 0,
        check_email_update: 0,
        check_nik_update: 0,
        check_telepon_company_update: 0,
        check_email_company_update: 0
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
        this.loadAccountInfo()
        this.loadCompanyInfo()
        this.loadAlamatCompany()
    }

    loadAccountInfo = async() => {
        // let passqueryaccountinfo = encrypt("select gcm_master_user.username, gcm_master_user.nama, gcm_master_user.no_ktp, "+
        //     "gcm_master_user.no_hp, gcm_master_user.email, gcm_master_user.password, gcm_master_user.status "+
        //     "from gcm_master_user where gcm_master_user.id ="+this.state.id_pengguna_login)
        let passqueryaccountinfo = encrypt("select gcm_master_user.username, gcm_master_user.nama, gcm_master_user.no_nik, "+
            "gcm_master_user.no_ktp, "+
            "gcm_master_user.no_hp, gcm_master_user.email, gcm_master_user.password, gcm_master_user.status, gcm_master_user.kode_sales "+
            "from gcm_master_user where gcm_master_user.id ="+this.state.id_pengguna_login)
        const resaccountinfo = await this.props.getDataDetailedAccountInfoAPI({query:passqueryaccountinfo}).catch(err => err)
        if (resaccountinfo) {
            this.setState({
                account_info_username:resaccountinfo.username,
                account_info_nama:resaccountinfo.nama,
                account_info_nik:(resaccountinfo.no_nik === null ? '' : resaccountinfo.no_nik),
                account_info_ktp:resaccountinfo.no_ktp,
                account_info_telepon:resaccountinfo.no_hp,
                account_info_email:resaccountinfo.email,
                account_info_status:resaccountinfo.status,
                account_info_kode_sales:(resaccountinfo.kode_sales === null ? '' : resaccountinfo.kode_sales)
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }

    }

    loadCompanyInfo = async() => {
        let passquerycompanyinfo = encrypt("select gcm_master_company.nama_perusahaan, gcm_master_company.no_telp, gcm_master_company.email, "+
            "gcm_master_company.no_npwp, gcm_master_company.no_siup, gcm_master_category.nama as tipe_bisnis, gcm_master_company.kode_seller, "+
            "gcm_master_company.ppn_seller "+
            "from gcm_master_company "+
                "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id "+
            "where gcm_master_company.id ="+this.state.company_id)
        const rescompanyinfo = await this.props.getDataDetailedCompanyInfoAPI({query:passquerycompanyinfo}).catch(err => err)
        if (rescompanyinfo) {
            this.setState({
                company_info_name:rescompanyinfo.nama_perusahaan,
                company_info_telepon:rescompanyinfo.no_telp,
                company_info_email:rescompanyinfo.email,
                company_info_npwp:rescompanyinfo.no_npwp,
                company_info_siup:rescompanyinfo.no_siup,
                company_info_tipe_bisnis:rescompanyinfo.tipe_bisnis,
                company_info_kode:rescompanyinfo.kode_seller,
                company_info_ppn: rescompanyinfo.ppn_seller
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    loadAlamatCompany = async() => {
        let passqueryalamatcompany =  encrypt("select gcm_master_alamat.alamat, gcm_master_kelurahan.nama as kelurahan, "+
                "gcm_master_kecamatan.nama as kecamatan, gcm_master_city.nama as kota, gcm_master_provinsi.nama as provinsi, "+
                "gcm_master_alamat.kodepos, gcm_master_alamat.no_telp, gcm_master_alamat.shipto_active, gcm_master_alamat.billto_active, gcm_master_alamat.id "+
            "from gcm_master_alamat "+
                "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id "+
                "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id "+
                "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id "+
                "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id "+
            "where gcm_master_alamat.company_id="+this.state.company_id)
        const resalamatcompany = await this.props.getDataAlamatAPI({query:passqueryalamatcompany}).catch(err => err)
        if (resalamatcompany) {
            resalamatcompany.map((user, index) => {
                return (
                    resalamatcompany[index].aksi = 
                    <button className="sm-2 mr-2 btn btn-primary" title="Edit Informasi Alamat Perusahaan"
                        onClick={(e) => this.handleDetailAlamatCompany(e, resalamatcompany[index].id)}>
                        <i className="fa fa-edit" aria-hidden="true"></i>
                    </button>
                )
            })
            this.setState({
                allAlamat: resalamatcompany
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    handleDetailAlamatCompany = async(e, id) => {
        this.handleModalDetailAlamatCompany()
        e.stopPropagation();
        let passquerydetailalamatcompany = encrypt("select gcm_master_alamat.alamat, gcm_master_alamat.kelurahan as id_kelurahan, "+
                "gcm_master_kelurahan.nama as kelurahan, "+
                "gcm_master_alamat.kecamatan as id_kecamatan, gcm_master_kecamatan.nama as kecamatan, "+
                "gcm_master_alamat.kota as id_kota, gcm_master_city.nama as kota, "+
                "gcm_master_alamat.provinsi as id_provinsi, gcm_master_provinsi.nama as provinsi, "+
                "gcm_master_alamat.kodepos, gcm_master_alamat.no_telp, gcm_master_alamat.id "+
            "from gcm_master_alamat "+
                "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id "+
                "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id "+
                "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id "+
                "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id "+
            "where gcm_master_alamat.id="+id)
        const resdetailalamatcompany = await this.props.getDataDetailedAlamatCompanyAPI({query:passquerydetailalamatcompany}).catch(err => err)
        if (resdetailalamatcompany) {
            this.setState({
                company_alamat_selected:resdetailalamatcompany.company_alamat_selected,
                company_alamat_kelurahan_selected:resdetailalamatcompany.company_alamat_kelurahan_selected,
                company_alamat_kecamatan_selected:resdetailalamatcompany.company_alamat_kecamatan_selected,
                company_alamat_kota_selected:resdetailalamatcompany.company_alamat_kota_selected,
                company_alamat_provinsi_selected:resdetailalamatcompany.company_alamat_provinsi_selected,
                company_alamat_kodepos_selected:resdetailalamatcompany.company_alamat_kodepos_selected,
                company_alamat_telepon_selected:resdetailalamatcompany.company_alamat_telepon_selected,
                company_alamat_id_kelurahan_selected:resdetailalamatcompany.company_alamat_id_kelurahan_selected,
                company_alamat_id_kecamatan_selected:resdetailalamatcompany.company_alamat_id_kecamatan_selected,
                company_alamat_id_kota_selected:resdetailalamatcompany.company_alamat_id_kota_selected,
                company_alamat_id_provinsi_selected:resdetailalamatcompany.company_alamat_id_provinsi_selected,
                company_alamat_id_selected:decrypt(resdetailalamatcompany.id)
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
        await this.loadProvinsi()
        await this.loadKota(this.state.company_alamat_id_provinsi_selected)
        await this.loadKecamatan(this.state.company_alamat_id_kota_selected)
        await this.loadKelurahan(this.state.company_alamat_id_kecamatan_selected)
    }

    loadProvinsi = async() =>{
        let passqueryprovinsi = encrypt("select * from gcm_master_provinsi")
        const resprovinsi = await this.props.getDataProvinsi({query:passqueryprovinsi}).catch(err => err)
        if (resprovinsi) {
            this.setState({
                allProvinsi: resprovinsi
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                        // window.location.reload()
                // }
            });
        }
    }

    changeProvinsiSelected = async(id_prov) => {
        await this.setState({
            company_alamat_id_kota_selected:'',
            company_alamat_kota_selected:'',
            company_alamat_id_kecamatan_selected:'',
            company_alamat_kecamatan_selected:'',
            company_alamat_id_kelurahan_selected:'',
            company_alamat_kelurahan_selected:'',
            allKota:[],
            allKecamatan:[],
            allKelurahan:[],
            isBtnUpdateAlamatCompany: true
        })
        if (this.state.company_alamat_selected !== '' &&
                this.state.company_alamat_id_kota_selected !== '' && this.state.company_alamat_id_kecamatan_selected !== '' &&
                    this.state.company_alamat_id_kelurahan_selected !== '' &&
                    (this.state.company_alamat_kodepos_selected !== '' && this.state.company_alamat_kodepos_selected.length === 5) &&
                    (this.state.company_alamat_telepon_selected !== '' && this.state.company_alamat_telepon_selected.length <= 15)) {
                            this.setState({isBtnUpdateAlamatCompany: false})
        }
        await this.loadKota(id_prov)
    }

    loadKota = async(id_prov, status) =>{
        let passquerykota = encrypt("select * from gcm_master_city where id_provinsi='"+id_prov+"'")
        const reskota = await this.props.getDataKota({query:passquerykota}).catch(err => err)
        if (reskota) {
            this.setState({
                allKota: reskota
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                //     const res = this.props.logoutAPI();
                //     if (res) {
                //         this.props.history.push('/admin')
                //         window.location.reload()
                // }
            });
        }
    }

    changeKotaSelected = async(id_kota) => {
        await this.setState({
            company_alamat_id_kecamatan_selected:'',
            company_alamat_kecamatan_selected:'',
            company_alamat_id_kelurahan_selected:'',
            company_alamat_kelurahan_selected:'',
            allKecamatan:[],
            allKelurahan:[],
            isBtnUpdateAlamatCompany: true
        })
        if (this.state.company_alamat_selected !== '' &&
                this.state.company_alamat_id_provinsi_selected !== '' && this.state.company_alamat_id_kecamatan_selected !== '' &&
                this.state.company_alamat_id_kelurahan_selected !== '' &&
                    (this.state.company_alamat_kodepos_selected !== '' && this.state.company_alamat_kodepos_selected.length === 5) &&
                    (this.state.company_alamat_telepon_selected !== '' && this.state.company_alamat_telepon_selected.length <= 15)) {
                            this.setState({isBtnUpdateAlamatCompany: false})
        }
        await this.loadKecamatan(id_kota)
    }

    loadKecamatan = async(id_kota) =>{
        let passquerykecamatan = encrypt("select * from gcm_master_kecamatan where id_city='"+id_kota+"'")
        const reskecamatan = await this.props.getDataKecamatan({query:passquerykecamatan}).catch(err => err)
        if (reskecamatan) {
            this.setState({
                allKecamatan: reskecamatan
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                //     const res = this.props.logoutAPI();
                //     if (res) {
                //         this.props.history.push('/admin')
                //         window.location.reload()
                // }
            });
        }
    }

    changeKecamatanSelected = async(id_kecamatan) => {
        await this.setState({
            company_alamat_id_kelurahan_selected:'',
            company_alamat_kelurahan_selected:'',
            allKelurahan:[],
            isBtnUpdateAlamatCompany: true
        })
        if (this.state.company_alamat_selected !== '' &&
            this.state.company_alamat_id_provinsi_selected !== '' && this.state.company_alamat_id_kota_selected !== '' &&
            this.state.company_alamat_id_kelurahan_selected !== '' &&
                (this.state.company_alamat_kodepos_selected !== '' && this.state.company_alamat_kodepos_selected.length === 5) &&
                    (this.state.company_alamat_telepon_selected !== '' && this.state.company_alamat_telepon_selected.length <= 15)) {
                            this.setState({isBtnUpdateAlamatCompany: false})
        }
        await this.loadKelurahan(id_kecamatan)
    }

    loadKelurahan = async(id_kecamatan) =>{
        let passquerykelurahan = encrypt("select * from gcm_master_kelurahan where id_kecamatan='"+id_kecamatan+"'")
        const reskelurahan = await this.props.getDataKelurahan({query:passquerykelurahan}).catch(err => err)
        if (reskelurahan) {
            this.setState({
                allKelurahan: reskelurahan
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                //     const res = this.props.logoutAPI();
                //     if (res) {
                //         this.props.history.push('/admin')
                //         window.location.reload()
                // }
            });
        }
    }

    changeKelurahanSelected = () => {
        this.setState({isBtnUpdateAlamatCompany: true})
        if (this.state.company_alamat_selected !== '' && this.state.company_alamat_id_provinsi_selected !== '' && 
            this.state.company_alamat_id_kota_selected !== '' && this.state.company_alamat_id_kecamatan_selected !== '' &&
                (this.state.company_alamat_kodepos_selected !== '' && this.state.company_alamat_kodepos_selected.length === 5) &&
                (this.state.company_alamat_telepon_selected !== '' && this.state.company_alamat_telepon_selected.length <= 15)) {
                    this.setState({isBtnUpdateAlamatCompany: false})
        }
    }

    handleModalDetailAlamatCompany = () => {
        this.setState({
            isOpenDetailAlamatCompany: !this.state.isOpenDetailAlamatCompany,
            validation_company_alamat: false,
            feedback_company_alamat_selected:'',
            empty_company_alamat_selected:false,
            validation_company_alamat_kodepos: false,
            feedback_company_alamat_kodepos_selected:'',
            empty_company_alamat_kodepos_selected:false,
            validation_company_alamat_telepon: false,
            feedback_company_alamat_telepon_selected:'',
            empty_company_alamat_telepon_selected:false,
            isBtnUpdateAlamatCompany: true
        })
    }

    handleModalConfirmAlamatCompany = () => {
        this.setState({
            isOpenConfirmUpdateAlamatCompany: !this.state.isOpenConfirmUpdateAlamatCompany
        })
    }

    handleWhiteSpace = (e) => {
        if (e.which === 32 &&  !e.target.value.length) {
            e.preventDefault()
        }
    }

    handleWhiteSpaceNumber = (e) => {
        if ((e.which === 32 &&  !e.target.value.length) || e.which === 32){
            e.preventDefault()
        }
    }

    handleChange = (event) => {
        if (event.target.name === 'account_info_username_selected') {
            this.check_field_username(event.target.value)
        }
        if (event.target.name === 'account_info_nama_selected') {
            if(event.target.value.match("^[a-zA-Z ]*$") !== null) {
                this.check_field_nama(event.target.value)
            } else {
                return;
            }
        }
        if (event.target.name === 'account_info_kode_sales_selected') {
            this.check_field_kode_sales(event.target.value)
        }
        if (event.target.name === 'account_info_nik_selected') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                this.check_field_nik(event.target.value)
            }
        }
        if (event.target.name === 'account_info_telepon_selected') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                if(event.target.value.substring(0,1) === '0') {
                    this.check_field_telepon(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'account_info_email_selected') {
            this.check_field_email(event.target.value)
        }
        if (event.target.name === 'account_info_password_selected') {
            this.check_field_password(event.target.value)
        }
        if (event.target.name === 'company_info_name_selected') {
            this.check_field_nama_company(event.target.value)
        }
        if (event.target.name === 'company_info_telepon_selected') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                if(event.target.value.substring(0,1) === '0') {
                    this.check_field_telepon_company(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'company_info_email_selected') {
            this.check_field_email_company(event.target.value)
        }
        if (event.target.name === 'company_info_npwp_selected') {
            this.check_field_npwp_company(event.target.value)
        }
        if (event.target.name === 'company_info_siup_selected') {
            this.check_field_siup_company(event.target.value)
        }
        if (event.target.name === 'company_alamat_selected') {
            this.check_field_alamat_company(event.target.value)
        }
        if (event.target.name === 'company_alamat_kodepos_selected') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                this.check_field_kodepos_alamat_company(event.target.value)
            }
        }
        if (event.target.name === 'company_alamat_telepon_selected') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                this.check_field_telepon_alamat_company(event.target.value)
            }
        }
        if (event.target.name === 'company_alamat_id_provinsi_selected') {
            this.changeProvinsiSelected(event.target.value)
        }
        if (event.target.name === 'company_alamat_id_kota_selected') {
            this.changeKotaSelected(event.target.value)
        }
        if (event.target.name === 'company_alamat_id_kecamatan_selected') {
            this.changeKecamatanSelected(event.target.value)
        }
        if (event.target.name === 'company_alamat_id_kelurahan_selected') {
            this.changeKelurahanSelected(event.target.value)
        }
        if (event.target.name === 'account_info_password_inserted') {
            this.checkvalidationpasswordaccountinfo(event.target.value)
        }
        if (event.target.name === 'company_info_password_inserted') {
            this.checkvalidationpasswordcompanyinfo(event.target.value)
        }
        if (event.target.name === 'company_alamat_password_inserted') {
            this.checkvalidationpasswordcompanyalamat(event.target.value)
        }
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    check_field_username = (e) => {
        if (e === '') {
            this.setState({empty_account_info_username_selected: true,  feedback_account_info_username_selected: 'Kolom ini wajib diisi', isBtnUpdate: true})
        } else {
            if (e.length < 8 && e.length > 0){
                this.setState({
                    validation_account_info_username: false, 
                    empty_account_info_username_selected: true,
                    feedback_account_info_username_selected: 'Nama pengguna minimal 8 karakter',
                    isBtnUpdate: true
                })
            }
            else if (e.length >= 8){
                this.setState({empty_account_info_username_selected: false})
                let check_username = this.state.allUsername.filter(input_username => {return input_username.username === e });
                if (check_username !== '' && check_username.length === 0){
                    this.setState({validation_account_info_username: true, empty_account_info_username_selected: false, 
                        feedback_account_info_username_selected: ''})
                    if (this.state.account_info_nama_selected !== '' &&
                        // this.state.account_info_ktp_selected.length === 16 &&
                        this.state.account_info_nik_selected !== '' &&
                        this.state.account_info_kode_sales_selected !== '' &&
                        this.state.account_info_telepon_selected !== '' &&
                        (this.state.account_info_email_selected !== '' || this.state.validation_account_info_email === true)) {
                            this.setState({isBtnUpdate: false})
                    }
                } else {
                    this.setState({validation_account_info_username: false, empty_account_info_username_selected: true,
                        feedback_account_info_username_selected: 'Nama pengguna telah digunakan', isBtnUpdate: true})
                    if (e === this.state.account_info_username) {
                        this.setState({
                            empty_account_info_username_selected: false, 
                            feedback_account_info_username_selected: ''})
                        if (this.state.account_info_nama_selected !== '' &&
                            // this.state.account_info_ktp_selected.length === 16 &&
                            this.state.account_info_nik_selected !== '' &&
                            this.state.account_info_kode_sales_selected !== '' &&
                            (this.state.account_info_telepon_selected !== '' && this.state.account_info_telepon_selected.length <= 15) &&
                            (this.state.account_info_email_selected !== '' || this.state.validation_account_info_email === true)) {
                                this.setState({isBtnUpdate: false})
                        }
                    }
                }
            }
        }
    }

    check_field_nama = (e) => {
        if (e === '') {
            this.setState({validation_account_info_nama: false, empty_account_info_nama_selected: true, isBtnUpdate: true})
        } else {
            if ((this.state.account_info_username_selected !== '' || this.state.validation_account_info_username === true) &&
                    // this.state.account_info_ktp_selected.length === 16 &&
                    this.state.account_info_nik_selected !== '' &&
                    this.state.account_info_kode_sales_selected !== '' &&
                        (this.state.account_info_telepon_selected !== '' && this.state.account_info_telepon_selected.length <= 15) &&
                            (this.state.account_info_email_selected !== '' || this.state.validation_account_info_email === true)) {
                                this.setState({isBtnUpdate: false})
            }
            this.setState({validation_account_info_nama: true, empty_account_info_nama_selected: false})
        }
    }

    check_field_kode_sales = (e) => {
        if (e === '') {
            this.setState({validation_account_info_kode_sales: false, feedback_account_info_kode_sales_selected:'Kolom ini wajib diisi', empty_account_info_kode_sales_selected: true, isBtnUpdate: true})
        } else {
            if ((this.state.account_info_username_selected !== '' || this.state.validation_account_info_username === true) &&
                    // this.state.account_info_ktp_selected.length === 16 &&
                    this.state.account_info_nik_selected !== '' &&
                        (this.state.account_info_telepon_selected !== '' && this.state.account_info_telepon_selected.length <= 15) &&
                            (this.state.account_info_email_selected !== '' || this.state.validation_account_info_email === true)) {
                                this.setState({isBtnUpdate: false})
            }
            this.setState({validation_account_info_kode_sales: true, feedback_account_info_kode_sales_selected:'', empty_account_info_kode_sales_selected: false})
        }
    }

    check_field_nik = (e) => {
        if (e === '') {
            this.setState({empty_account_info_nik_selected: true, feedback_account_info_nik_selected: 'Kolom ini wajib diisi', isBtnUpdate: true})
        } else {
            // if (e.length === 16) {
                this.setState({
                    validation_account_info_nik: true, 
                    empty_account_info_nik_selected: false, 
                    feedback_account_info_nik_selected:'',
                    isBtnUpdate: true
                })
                if ((this.state.account_info_username_selected !== '' || this.state.validation_account_info_username === true) &&
                    this.state.account_info_nama_selected !== '' &&
                    this.state.account_info_kode_sales_selected !== '' &&
                        (this.state.account_info_telepon_selected !== '' && this.state.account_info_telepon_selected.length <= 15) &&
                            (this.state.account_info_email_selected !== '' || this.state.validation_account_info_email === true)) {
                                this.setState({isBtnUpdate: false})
                }
            // } else {
            //     this.setState({
            //         empty_account_info_nik_selected: true,
            //         feedback_account_info_nik_selected: 'Nomor KTP terdiri atas 16 karakter',
            //         isBtnUpdate: true
            //     })
            // }
        }
    }

    check_field_telepon = (e) => {
        if (e === '') {
            this.setState({empty_account_info_telepon_selected: true, feedback_account_info_telepon_selected:'Kolom ini wajib diisi',
                isBtnUpdate: true})
        } else {
            if (e.length > 15) {
                this.setState({
                    empty_account_info_telepon_selected: true,
                    feedback_account_info_telepon_selected: 'Nomor telepon maksimal terdiri atas 15 karakter',
                    isBtnUpdate: true
                })
            } else {
                this.setState({
                    validation_account_info_telepon: true, 
                    empty_account_info_telepon_selected: false, 
                    feedback_account_info_telepon_selected:''
                })
                if ((this.state.account_info_username_selected !== '' || this.state.validation_account_info_username === true) &&
                    this.state.account_info_nama_selected !== '' &&
                        // this.state.account_info_ktp_selected.length === 16 &&
                        this.state.account_info_nik_selected !== '' &&
                        this.state.account_info_kode_sales_selected !== '' &&
                            (this.state.account_info_email_selected !== '' || this.state.validation_account_info_email === true)) {
                            this.setState({isBtnUpdate: false})
                }
            }            
        }
    }

    check_field_email = (e) => {
        if (e === '') {
            this.setState({
                empty_account_info_email_selected: true,
                feedback_account_info_email_selected: 'Kolom ini wajib diisi',
                isBtnUpdate: true
            })
        } else {
            const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (emailRex.test(e)) {
                this.setState({
                    validation_account_info_email: true, 
                    empty_account_info_email_selected: false, 
                    feedback_account_info_email_selected:''})
                if ((this.state.account_info_username_selected !== '' || this.state.validation_account_info_username === true) &&
                    this.state.account_info_nama_selected !== '' &&
                        // this.state.account_info_ktp_selected.length === 16 &&
                        this.state.account_info_kode_sales_selected !== '' &&
                        this.state.account_info_nik_selected !== '' &&
                            (this.state.account_info_telepon_selected !== '' && this.state.account_info_telepon_selected.length <= 15)) {
                                this.setState({isBtnUpdate: false})
                }
            } else {
                this.setState({
                    empty_account_info_email_selected: true,
                    feedback_account_info_email_selected: 'Masukkan alamat email dengan benar',
                    isBtnUpdate: true
                })
            }
        }
    }

    check_field_password = (e) => {
        this.setState({temp_new_password_selected: e})
        if (e === '') {
            this.setState({
                validation_account_info_password: false,
                empty_account_info_password_selected: false, 
                feedback_account_info_password_selected:'',
            })
            document.getElementById('errorpassword').style.display='none'
            if ((this.state.account_info_username_selected !== '' || this.state.validation_account_info_username === true) &&
                    this.state.account_info_nama_selected !== '' &&
                        // this.state.account_info_ktp_selected.length === 16 &&
                        this.state.account_info_nik_selected !== '' &&
                        this.state.account_info_kode_sales_selected !== '' &&
                            (this.state.account_info_telepon_selected !== '' && this.state.account_info_telepon_selected.length <= 15) &&
                                (this.state.account_info_email_selected !== '' || this.state.validation_account_info_email === true)) {
                                this.setState({isBtnUpdate: false})
            }
        } else {
            const passwordRex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (passwordRex.test(e)) {
                this.setState({
                    validation_account_info_password: true, 
                    empty_account_info_password_selected: false, 
                    feedback_account_info_password_selected:'',
                })
                if ((this.state.account_info_username_selected !== '' || this.state.validation_account_info_username === true) &&
                    this.state.account_info_nama_selected !== '' &&
                        // this.state.account_info_ktp_selected.length === 16 &&
                        this.state.account_info_nik_selected !== '' &&
                        this.state.account_info_kode_sales_selected !== '' &&
                            (this.state.account_info_telepon_selected !== '' && this.state.account_info_telepon_selected.length <= 15) &&
                                (this.state.account_info_email_selected !== '' || this.state.validation_account_info_email === true)) {
                                this.setState({isBtnUpdate: false})
                }
                document.getElementById('errorpassword').style.display='none'
            } else {
                if (e !== '') {
                    this.setState({
                        empty_account_info_password_selected: true,
                        feedback_account_info_password_selected: 'Kata sandi minimal 8 karakter dan terdiri dari huruf besar, kecil, dan angka',
                        isBtnUpdate: true
                    })
                    document.getElementById('errorpassword').style.display='block'
                } else {
                    this.setState({ 
                        empty_account_info_password_selected: false, 
                        feedback_account_info_password_selected:'',
                    })
                    document.getElementById('errorpassword').style.display='none'
                }
            }
        }
    }

    check_field_nama_company = (e) => {
        if (e === '') {
            this.setState({validation_company_info_name: false, empty_company_info_name_selected: true, isBtnUpdateCompany: true})
        } else {
            if ((this.state.company_info_telepon_selected !== '' && this.state.company_info_telepon_selected.length <= 15) &&
                    (this.state.company_info_email_selected !== '' || this.state.validation_company_info_email === true) &&
                        (this.state.company_info_npwp_selected !== '' && this.state.company_info_npwp_selected.length === 20) &&
                        this.state.company_info_siup_selected !== '') {
                                this.setState({isBtnUpdateCompany: false})
            }
            this.setState({validation_company_info_name: true, empty_company_info_name_selected: false})
        }
    }

    check_field_telepon_company = (e) => {
        if (e === '') {
            this.setState({empty_company_info_telepon_selected: true, feedback_company_info_telepon_selected:'Kolom ini wajib diisi',
                isBtnUpdateCompany: true})
        } else {
            if (e.length > 15) {
                this.setState({
                    empty_company_info_telepon_selected: true,
                    feedback_company_info_telepon_selected: 'Nomor telepon maksimal terdiri atas 15 karakter',
                    isBtnUpdateCompany: true
                })
            } else {
                this.setState({
                    validation_company_info_telepon: true, 
                    empty_company_info_telepon_selected: false, 
                    feedback_company_info_telepon_selected:''
                })
                if (this.state.company_info_name_selected !== '' &&
                    (this.state.company_info_email_selected !== '' || this.state.validation_company_info_email === true) &&
                        (this.state.company_info_npwp_selected !== '' && this.state.company_info_npwp_selected.length === 20) &&
                            this.state.company_info_siup_selected !== '') {
                            this.setState({isBtnUpdateCompany: false})
                }
            }            
        }
    }

    check_field_email_company = (e) => {
        if (e === '') {
            this.setState({
                empty_company_info_email_selected: true,
                feedback_company_info_email_selected: 'Kolom ini wajib diisi',
                isBtnUpdateCompany: true
            })
        } else {
            const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (emailRex.test(e)) {
                this.setState({
                    validation_company_info_email: true, 
                    empty_company_info_email_selected: false, 
                    feedback_company_info_email_selected:''})
                    if (this.state.company_info_name_selected !== '' &&
                        (this.state.company_info_telepon_selected !== '' && this.state.company_info_telepon_selected.length <= 15) &&
                            (this.state.company_info_npwp_selected !== '' && this.state.company_info_npwp_selected.length === 20) &&
                                this.state.company_info_siup_selected !== '') {
                                this.setState({isBtnUpdateCompany: false})
                    }
            } else {
                this.setState({
                    empty_company_info_email_selected: true,
                    feedback_company_info_email_selected: 'Masukkan alamat email dengan benar',
                    isBtnUpdateCompany: true
                })
            }
        }
    }

    check_field_npwp_company = (e) => {
        let x = e.split('_').length-1                      
        if (e === '') {
            if (x === 15) {
                this.setState({empty_company_info_npwp_selected: true, feedback_company_info_npwp_selected: 'Kolom ini wajib diisi', isBtnUpdateCompany: true})
            }
        } else {
            if (e.length-x === 20) {
                this.setState({
                    validation_company_info_npwp: true, 
                    empty_company_info_npwp_selected: false, 
                    feedback_company_info_npwp_selected:''
                })
                if (this.state.company_info_name_selected !== '' &&
                    (this.state.company_info_telepon_selected !== '' && this.state.company_info_telepon_selected.length <= 15) &&
                         (this.state.company_info_email_selected !== '' || this.state.validation_company_info_email === true) &&
                            this.state.company_info_siup_selected !== '') {
                            this.setState({isBtnUpdateCompany: false})
                }
            } else {
                if (x === 15) {
                    this.setState({
                        empty_company_info_npwp_selected: true,
                        feedback_company_info_npwp_selected: 'Kolom ini wajib diisi',
                        isBtnUpdateCompany: true
                    })
                } else {
                    this.setState({
                        empty_company_info_npwp_selected: true,
                        feedback_company_info_npwp_selected: 'Nomor NPWP terdiri atas 15 angka',
                        isBtnUpdateCompany: true
                    })
                }
            }
        }
    }

    check_field_siup_company = (e) => {
        if (e === '') {
            this.setState({validation_company_info_siup: false, empty_company_info_siup_selected: true, isBtnUpdateCompany: true})
        } else {
            if ((this.state.company_info_telepon_selected !== '' && this.state.company_info_telepon_selected.length <= 15) &&
                    (this.state.company_info_email_selected !== '' || this.state.validation_company_info_email === true) &&
                        (this.state.company_info_npwp_selected !== '' && this.state.company_info_npwp_selected.length === 20) &&
                        this.state.company_info_name_selected !== '') {
                                this.setState({isBtnUpdateCompany: false})
            }
            this.setState({validation_company_info_siup: true, empty_company_info_siup_selected: false})
        }
    }

    check_field_alamat_company = (e) => {
        if (e === '') {
            this.setState({validation_company_alamat: false, empty_company_alamat_selected: true, isBtnUpdateAlamatCompany: true})
        } else {
            if (this.state.company_alamat_id_provinsi_selected !== '' && 
                    this.state.company_alamat_id_kota_selected !== '' && this.state.company_alamat_id_kecamatan_selected !== '' &&
                    this.state.company_alamat_id_kelurahan_selected !== '' &&
                    (this.state.company_alamat_kodepos_selected !== '' && this.state.company_alamat_kodepos_selected.length === 5) &&
                        (this.state.company_alamat_telepon_selected !== '' && this.state.company_alamat_telepon_selected.length <=15)) {
                            this.setState({isBtnUpdateAlamatCompany: false})
            }
            this.setState({validation_company_alamat: true, empty_company_alamat_selected: false})
        }
    }

    

    check_field_kodepos_alamat_company = (e) => {
        if (e === '') {
            this.setState({empty_company_alamat_kodepos_selected: true, feedback_company_alamat_kodepos_selected:'Kolom ini wajib diisi',
                isBtnUpdateAlamatCompany: true})
        } else {
            if (e.length > 5 || e.length < 5) {
                this.setState({
                    empty_company_alamat_kodepos_selected: true,
                    feedback_company_alamat_kodepos_selected: 'Kodepos terdiri atas 5 karakter angka',
                    isBtnUpdateAlamatCompany: true
                })
            } else {
                this.setState({
                    validation_company_alamat_kodepos: true, 
                    empty_company_alamat_kodepos_selected: false, 
                    feedback_company_alamat_kodepos_selected:''
                })
                if (this.state.company_alamat_selected !== '' && this.state.company_alamat_id_provinsi_selected !== '' && 
                    this.state.company_alamat_id_kota_selected !== '' && this.state.company_alamat_id_kecamatan_selected !== '' &&
                    this.state.company_alamat_id_kelurahan_selected !== '' &&
                        (this.state.company_alamat_telepon_selected !== '' && this.state.company_alamat_telepon_selected.length <=15)) {
                            this.setState({isBtnUpdateAlamatCompany: false})
                }
            }            
        }
    }

    check_field_telepon_alamat_company = (e) => {
        if (e === '') {
            this.setState({empty_company_alamat_telepon_selected: true, feedback_company_alamat_telepon_selected:'Kolom ini wajib diisi',
                isBtnUpdateAlamatCompany: true})
        } else {
            if (e.length > 15) {
                this.setState({
                    empty_company_alamat_telepon_selected: true,
                    feedback_company_alamat_telepon_selected: 'Nomor telepon maksimal terdiri atas 15 karakter',
                    isBtnUpdateAlamatCompany: true
                })
            } else {
                this.setState({
                    validation_company_alamat_telepon: true, 
                    empty_company_alamat_telepon_selected: false, 
                    feedback_company_alamat_telepon_selected:''
                })
                if (this.state.company_alamat_selected !== '' && this.state.company_alamat_id_provinsi_selected !== '' && 
                    this.state.company_alamat_id_kota_selected !== '' && this.state.company_alamat_id_kecamatan_selected !== '' &&
                    this.state.company_alamat_id_kelurahan_selected !== '' &&
                        (this.state.company_alamat_kodepos_selected !== '' && this.state.company_alamat_kodepos_selected.length === 5)) {
                            this.setState({isBtnUpdateAlamatCompany: false})
                }
            }            
        }
    }

    checkvalidationpasswordaccountinfo = (e) => {
        if (e === '') {
            this.setState({empty_account_info_password_selected_mirror: true})
        } else {
            this.setState({empty_account_info_password_selected_mirror: false})
        }
    }

    checkvalidationpasswordcompanyinfo = (e) => {
        if (e === '') {
            this.setState({empty_company_info_password: true})
        } else {
            this.setState({empty_company_info_password: false})
        }
    }

    checkvalidationpasswordcompanyalamat = (e) => {
        if (e === '') {
            this.setState({empty_company_alamat_password: true})
        } else {
            this.setState({empty_company_alamat_password: false})
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

    handleviewpasswordmirror = () => {
        if (this.state.viewpassword_mirror === 'password' && this.state.logopassword_mirror === 'fa fa-eye-slash') {
            this.setState({
                viewpassword_mirror: 'text',
                logopassword_mirror: 'fa fa-eye'
            })
        } else {
            this.setState({
                viewpassword_mirror: 'password',
                logopassword_mirror: 'fa fa-eye-slash'
            })
        }
    }

    handleviewpasswordcompany = () => {
        if (this.state.viewpassword_company === 'password' && this.state.logopassword_company === 'fa fa-eye-slash') {
            this.setState({
                viewpassword_company: 'text',
                logopassword_company: 'fa fa-eye'
            })
        } else {
            this.setState({
                viewpassword_company: 'password',
                logopassword_company: 'fa fa-eye-slash'
            })
        }
    }

    handleviewpasswordcompanyalamat = () => {
        if (this.state.viewpassword_company_alamat === 'password' && this.state.logopassword_company_alamat === 'fa fa-eye-slash') {
            this.setState({
                viewpassword_company_alamat: 'text',
                logopassword_company_alamat: 'fa fa-eye'
            })
        } else {
            this.setState({
                viewpassword_company_alamat: 'password',
                logopassword_company_alamat: 'fa fa-eye-slash'
            })
        }
    }

    handleModalDetailCompany = () => {
        if (this.state.sa_role === 'admin') {
            this.setState({
                isOpenModalDetailCompany: !this.state.isOpenModalDetailCompany,
                empty_company_info_name_selected: false,
                empty_company_info_telepon_selected: false,
                empty_company_info_email_selected: false,
                empty_company_info_npwp_selected: false,
                empty_company_info_siup_selected: false,
                validation_company_info_name: false,
                validation_company_info_telepon: false,
                validation_company_info_email: false,
                validation_company_info_npwp: false,
                validation_company_info_siup: false,
                isBtnUpdateCompany: true
            })
            this.loadDetailCompanyInfo()
        } else {
            this.setState({
                isOpenModalDetailCompanyBySales: !this.state.isOpenModalDetailCompanyBySales
            })
        }
    }

    loadDetailCompanyInfo = async() => {
        let passquerycompanyinfo = encrypt("select gcm_master_company.nama_perusahaan, gcm_master_company.no_telp, gcm_master_company.email, "+
            "gcm_master_company.no_npwp, gcm_master_company.no_siup, gcm_master_category.nama as tipe_bisnis, gcm_master_company.ppn_seller "+
            "from gcm_master_company "+
                "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id "+
            "where gcm_master_company.id ="+this.state.company_id)
        const rescompanyinfo = await this.props.getDataDetailedCompanyInfoAPI({query:passquerycompanyinfo}).catch(err => err)
        if (rescompanyinfo) {
            this.setState({
                company_info_name_selected:rescompanyinfo.nama_perusahaan,
                company_info_telepon_selected:rescompanyinfo.no_telp,
                company_info_email_selected:rescompanyinfo.email,
                company_info_npwp_selected:rescompanyinfo.no_npwp,
                company_info_siup_selected:rescompanyinfo.no_siup,
                company_info_ppn:rescompanyinfo.ppn_seller
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    handleModalDetailAkun = async() => {
        this.setState({
            isOpenModalDetailAkun: !this.state.isOpenModalDetailAkun,
            empty_account_info_username_selected: false,
            empty_account_info_nama_selected: false,
            empty_account_info_nik_selected: false,
            empty_account_info_telepon_selected: false,
            empty_account_info_email_selected: false,
            empty_account_info_status_selected: false,
            empty_account_info_password_selected: false,
            validation_account_info_username: false,
            validation_account_info_nama: false,
            validation_account_info_nik: false,
            validation_account_info_telepon: false,
            validation_account_info_email: false,
            validation_account_info_password: false,
            validation_account_info_kode_sales: false,
            empty_account_info_kode_sales_selected:false,
            isBtnUpdate: true,
            allCheckedKodeSales:0
        })
        await this.loadDetailAccountInfo()
        await this.loadUsernameAccount()
    }

    loadDetailAccountInfo = async() => {
        // let passqueryaccountinfo = encrypt("select gcm_master_user.username, gcm_master_user.nama, gcm_master_user.no_ktp, "+
        //     "gcm_master_user.no_hp, gcm_master_user.email, gcm_master_user.password, gcm_master_user.status "+
        //     "from gcm_master_user where gcm_master_user.id ="+this.state.id_pengguna_login)
        let passqueryaccountinfo = encrypt("select gcm_master_user.username, gcm_master_user.nama, gcm_master_user.no_nik, "+
            "gcm_master_user.no_hp, gcm_master_user.email, gcm_master_user.password, gcm_master_user.status, gcm_master_user.kode_sales "+
            "from gcm_master_user where gcm_master_user.id ="+this.state.id_pengguna_login)
        const resaccountinfo = await this.props.getDataDetailedAccountInfoAPI({query:passqueryaccountinfo}).catch(err => err)
        if (resaccountinfo) {
            this.setState({
                account_info_username_selected:resaccountinfo.username,
                account_info_nama_selected:resaccountinfo.nama,
                account_info_nik_selected:resaccountinfo.no_nik,
                account_info_telepon_selected:resaccountinfo.no_hp,
                pembanding_account_info_telepon_selected:resaccountinfo.no_hp,
                account_info_email_selected:resaccountinfo.email,
                account_info_password_selected:decrypt(resaccountinfo.password),
                pembanding_account_info_password_selected:decrypt(resaccountinfo.password),
                account_info_status_selected:resaccountinfo.status,
                account_info_kode_sales_selected:resaccountinfo.kode_sales,
                pembanding_account_info_kode_sales_selected:resaccountinfo.kode_sales
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    loadUsernameAccount = async() => {
        let passqueryusername = encrypt("select gcm_master_user.username from gcm_master_user")
        const resusername = await this.props.getDataUsernameAPI({query:passqueryusername}).catch(err => err)
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
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    handleModalConfirm = async() => {
        await this.loadUsernameAccount()
        await this.checkFinalFieldUpdate()
        await this.loadCheckingKodeSales(this.state.account_info_kode_sales_selected)
        let check_username = this.state.allUsername.filter(input_username => {return input_username.username === this.state.account_info_username_selected });
        if (check_username !== '' && check_username.length === 0){
            if (this.state.account_info_kode_sales_selected === this.state.pembanding_account_info_kode_sales_selected &&
                Number(this.state.allCheckedKodeSales) === 1) {
                    if (Number(this.state.check_username_update) === 0 &&
                        Number(this.state.check_nohp_update) === 0 &&
                        Number(this.state.check_email_update) === 0 &&
                        Number(this.state.check_nik_update) === 0) {
                            this.setState({
                                isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
                            })
                    } else {
                        if (Number(this.state.check_username_update) > 0) {
                            this.setState({validation_account_info_username: false, empty_account_info_username_selected: true,
                                feedback_account_info_username_selected: 'Nama pengguna telah digunakan', isBtnUpdate: true})
                        }
                        if (Number(this.state.check_nohp_update) > 0) {
                            this.setState({validation_account_info_telepon: false, empty_account_info_telepon_selected: true,
                                feedback_account_info_telepon_selected: 'Nomor telepon telah digunakan', isBtnUpdate: true})
                        }
                        if (Number(this.state.check_email_update) > 0) {
                            this.setState({validation_account_info_email: false, empty_account_info_email_selected: true,
                                feedback_account_info_email_selected: 'Email telah digunakan', isBtnUpdate: true})
                        }
                        if (Number(this.state.check_nik_update) > 0) {
                            this.setState({validation_account_info_nik: false, empty_account_info_nik_selected: true,
                                feedback_account_info_nik_selected: 'Nomor NIK telah digunakan', isBtnUpdate: true})
                        }
                    }
            } else {
                if (Number(this.state.allCheckedKodeSales) > 0) {
                    this.handleModalAttentionKodeSales()
                    this.setState({validation_account_info_kode_sales: false, empty_account_info_kode_sales_selected: true,
                        feedback_account_info_kode_sales_selected: 'Kode sales distributor telah digunakan', isBtnUpdate: true})
                    if (Number(this.state.check_username_update) > 0) {
                        this.setState({validation_account_info_username: false, empty_account_info_username_selected: true,
                            feedback_account_info_username_selected: 'Nama pengguna telah digunakan', isBtnUpdate: true})
                    }
                    if (Number(this.state.check_nohp_update) > 0) {
                        this.setState({validation_account_info_telepon: false, empty_account_info_telepon_selected: true,
                            feedback_account_info_telepon_selected: 'Nomor telepon telah digunakan', isBtnUpdate: true})
                    }
                    if (Number(this.state.check_email_update) > 0) {
                        this.setState({validation_account_info_email: false, empty_account_info_email_selected: true,
                            feedback_account_info_email_selected: 'Email telah digunakan', isBtnUpdate: true})
                    }
                    if (Number(this.state.check_nik_update) > 0) {
                        this.setState({validation_account_info_nik: false, empty_account_info_nik_selected: true,
                            feedback_account_info_nik_selected: 'Nomor NIK telah digunakan', isBtnUpdate: true})
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
                            this.setState({validation_account_info_username: false, empty_account_info_username_selected: true,
                                feedback_account_info_username_selected: 'Nama pengguna telah digunakan', isBtnUpdate: true})
                        }
                        if (Number(this.state.check_nohp_update) > 0) {
                            this.setState({validation_account_info_telepon: false, empty_account_info_telepon_selected: true,
                                feedback_account_info_telepon_selected: 'Nomor telepon telah digunakan', isBtnUpdate: true})
                        }
                        if (Number(this.state.check_email_update) > 0) {
                            this.setState({validation_account_info_email: false, empty_account_info_email_selected: true,
                                feedback_account_info_email_selected: 'Email telah digunakan', isBtnUpdate: true})
                        }
                        if (Number(this.state.check_nik_update) > 0) {
                            this.setState({validation_account_info_nik: false, empty_account_info_nik_selected: true,
                                feedback_account_info_nik_selected: 'Nomor NIK telah digunakan', isBtnUpdate: true})
                        }
                    }
                }
            }
        } else {
            if (this.state.account_info_username_selected === this.state.account_info_username) {
                if (this.state.account_info_kode_sales_selected === this.state.pembanding_account_info_kode_sales_selected &&
                    Number(this.state.allCheckedKodeSales) === 1) {
                        if (Number(this.state.check_username_update) === 0 &&
                            Number(this.state.check_nohp_update) === 0 &&
                            Number(this.state.check_email_update) === 0 &&
                            Number(this.state.check_nik_update) === 0) {
                                this.setState({
                                    isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
                                })
                        } else {
                            if (Number(this.state.check_username_update) > 0) {
                                this.setState({validation_account_info_username: false, empty_account_info_username_selected: true,
                                    feedback_account_info_username_selected: 'Nama pengguna telah digunakan', isBtnUpdate: true})
                            }
                            if (Number(this.state.check_nohp_update) > 0) {
                                this.setState({validation_account_info_telepon: false, empty_account_info_telepon_selected: true,
                                    feedback_account_info_telepon_selected: 'Nomor telepon telah digunakan', isBtnUpdate: true})
                            }
                            if (Number(this.state.check_email_update) > 0) {
                                this.setState({validation_account_info_email: false, empty_account_info_email_selected: true,
                                    feedback_account_info_email_selected: 'Email telah digunakan', isBtnUpdate: true})
                            }
                            if (Number(this.state.check_nik_update) > 0) {
                                this.setState({validation_account_info_nik: false, empty_account_info_nik_selected: true,
                                    feedback_account_info_nik_selected: 'Nomor NIK telah digunakan', isBtnUpdate: true})
                            }
                        }
                } else {
                    if (Number(this.state.allCheckedKodeSales) > 0) {
                        this.handleModalAttentionKodeSales()
                        this.setState({validation_account_info_kode_sales: false, empty_account_info_kode_sales_selected: true,
                            feedback_account_info_kode_sales_selected: 'Kode sales distributor telah digunakan', isBtnUpdate: true})
                        if (Number(this.state.check_username_update) > 0) {
                            this.setState({validation_account_info_username: false, empty_account_info_username_selected: true,
                                feedback_account_info_username_selected: 'Nama pengguna telah digunakan', isBtnUpdate: true})
                        }
                        if (Number(this.state.check_nohp_update) > 0) {
                            this.setState({validation_account_info_telepon: false, empty_account_info_telepon_selected: true,
                                feedback_account_info_telepon_selected: 'Nomor telepon telah digunakan', isBtnUpdate: true})
                        }
                        if (Number(this.state.check_email_update) > 0) {
                            this.setState({validation_account_info_email: false, empty_account_info_email_selected: true,
                                feedback_account_info_email_selected: 'Email telah digunakan', isBtnUpdate: true})
                        }
                        if (Number(this.state.check_nik_update) > 0) {
                            this.setState({validation_account_info_nik: false, empty_account_info_nik_selected: true,
                                feedback_account_info_nik_selected: 'Nomor NIK telah digunakan', isBtnUpdate: true})
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
                                this.setState({validation_account_info_username: false, empty_account_info_username_selected: true,
                                    feedback_account_info_username_selected: 'Nama pengguna telah digunakan', isBtnUpdate: true})
                            }
                            if (Number(this.state.check_nohp_update) > 0) {
                                this.setState({validation_account_info_telepon: false, empty_account_info_telepon_selected: true,
                                    feedback_account_info_telepon_selected: 'Nomor telepon telah digunakan', isBtnUpdate: true})
                            }
                            if (Number(this.state.check_email_update) > 0) {
                                this.setState({validation_account_info_email: false, empty_account_info_email_selected: true,
                                    feedback_account_info_email_selected: 'Email telah digunakan', isBtnUpdate: true})
                            }
                            if (Number(this.state.check_nik_update) > 0) {
                                this.setState({validation_account_info_nik: false, empty_account_info_nik_selected: true,
                                    feedback_account_info_nik_selected: 'Nomor NIK telah digunakan', isBtnUpdate: true})
                            }
                        }
                    }
                }
            } else {
                this.setState({validation_account_info_username: false, empty_account_info_username_selected: true,
                    feedback_account_info_username_selected: 'Nama pengguna telah digunakan', isBtnUpdate: true})
            }
        }
    }

    handleModalAttentionKodeSales = () => {
        this.setState({isOpenAttentionKodeSales:!this.state.isOpenAttentionKodeSales})
    }

    loadCheckingKodeSales = async(kd_sales) => {
        let passquerycheckingkodesales = encrypt("select count(gcm_master_user.id) as total from gcm_master_user "+
            "where gcm_master_user.company_id="+this.state.company_id+" and gcm_master_user.kode_sales='"+kd_sales+"'")
        const reskodesales = await this.props.getDataCheckedKodeSales({query:passquerycheckingkodesales}).catch(err => err)
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
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    confirmActionUpdateAccountInfo = async() => {
        Toast.loading('Loading...');
        await this.getCurrentPassword()
        await this.checkFinalFieldUpdate()
        if (this.state.account_info_password_inserted === this.state.pembanding_account_info_password_selected) {
            if (this.state.account_info_telepon_selected !== this.state.pembanding_account_info_telepon_selected) {
                this.handleModalOtp()
                this.setState({
                    isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
                })
            } else {
                let passqueryupdatemasteruser = ""
                if (Number(this.state.check_username_update) === 0 &&
                    Number(this.state.check_nohp_update) === 0 &&
                    Number(this.state.check_email_update) === 0 &&
                    Number(this.state.check_nik_update) === 0) {
                        if (this.state.account_info_password_selected === '') {
                            if (this.state.sa_role === 'sales') {
                                passqueryupdatemasteruser = encrypt("update gcm_master_user set username='"+this.state.account_info_username_selected+"', "+
                                    "nama='"+this.state.account_info_nama_selected+"', no_hp='"+this.state.account_info_telepon_selected+"', "+
                                    "email='"+this.state.account_info_email_selected+"', update_by='"+this.state.id_pengguna_login+"', update_date=now() "+
                                        "where id="+this.state.id_pengguna_login+" returning nama;")
                            } else {
                                passqueryupdatemasteruser = encrypt("update gcm_master_user set username='"+this.state.account_info_username_selected+"', "+
                                    "nama='"+this.state.account_info_nama_selected+"', no_hp='"+this.state.account_info_telepon_selected+"', "+
                                    "no_nik='"+this.state.account_info_nik_selected+"', kode_sales='"+this.state.account_info_kode_sales_selected+"', "+
                                    "email='"+this.state.account_info_email_selected+"', update_by='"+this.state.id_pengguna_login+"', update_date=now() "+
                                        "where id="+this.state.id_pengguna_login+" returning nama;")
                            }
                        } else {
                            if (this.state.sa_role === 'sales') {
                                passqueryupdatemasteruser = encrypt("update gcm_master_user set username='"+this.state.account_info_username_selected+"', "+
                                    "nama='"+this.state.account_info_nama_selected+"', no_hp='"+this.state.account_info_telepon_selected+"', "+
                                    "email='"+this.state.account_info_email_selected+"', password='"+encrypt(this.state.account_info_password_selected)+"', update_by='"+this.state.id_pengguna_login+"', update_date=now() "+
                                    "where id="+this.state.id_pengguna_login+" returning nama;")
                            } else {
                                passqueryupdatemasteruser = encrypt("update gcm_master_user set username='"+this.state.account_info_username_selected+"', "+
                                    "nama='"+this.state.account_info_nama_selected+"', no_hp='"+this.state.account_info_telepon_selected+"', "+
                                    "no_nik='"+this.state.account_info_nik_selected+"', kode_sales='"+this.state.account_info_kode_sales_selected+"', "+
                                    "email='"+this.state.account_info_email_selected+"', password='"+encrypt(this.state.account_info_password_selected)+"', update_by='"+this.state.id_pengguna_login+"', update_date=now() "+
                                    "where id="+this.state.id_pengguna_login+" returning nama;")
                            }
                        }
                        const resupdateMasterUser = await this.props.updateMasterUser({query:passqueryupdatemasteruser}).catch(err => err)
                        Toast.hide();
                        if (resupdateMasterUser) {
                            swal({
                                title: "Sukses!",
                                text: "Perubahan disimpan!",
                                icon: "success",
                                button: false,
                                timer: "2500"
                            }).then(()=> {
                                this.loadAccountInfo()
                                this.loadCompanyInfo()
                                this.loadAlamatCompany()
                                window.location.reload()
                            });
                        } else {
                            swal({
                                title: "Gagal!",
                                text: "Tidak ada perubahan disimpan!",
                                icon: "error",
                                button: false,
                                timer: "2500"
                              }).then(()=> {
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
                        }).then(()=> {
                        window.location.reload()
                    });
                }
            }
        } else {
            swal({
                title: "Kata sandi tidak cocok!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                button: false,
                timer: "2500"
              }).then(()=> {
                window.location.reload()
            });
        }
    }

    confirmActionUpdateAlamatCompany = async() => {
        Toast.loading('Loading...');
        await this.getCurrentPassword()
        if (this.state.company_alamat_password_inserted === this.state.pembanding_account_info_password_selected) {
            let passqueryupdatealamat = encrypt("update gcm_master_alamat set kelurahan='"+this.state.company_alamat_id_kelurahan_selected+"', "+
                    "kecamatan='"+this.state.company_alamat_id_kecamatan_selected+"', kota='"+this.state.company_alamat_id_kota_selected+"', "+
                    "provinsi='"+this.state.company_alamat_id_provinsi_selected+"', kodepos='"+this.state.company_alamat_kodepos_selected+"', "+
                    "no_telp='"+this.state.company_alamat_telepon_selected+"', alamat='"+this.state.company_alamat_selected+"', flag_active='A' "+
                "where id="+this.state.company_alamat_id_selected+" returning alamat")
            const resupdateMasterAlamat = await this.props.updateMasterAlamat({query:passqueryupdatealamat}).catch(err => err)
            Toast.hide();
            if (resupdateMasterAlamat) {
                swal({
                    title: "Sukses!",
                    text: "Perubahan disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(()=> {
                    this.loadAccountInfo()
                    this.loadCompanyInfo()
                    this.loadAlamatCompany()
                    window.location.reload()
                });
            } else {
                swal({
                    title: "Gagal!",
                    text: "Tidak ada perubahan disimpan!",
                    icon: "error",
                    button: false,
                    timer: "2500"
                    }).then(()=> {
                    window.location.reload()
                });
            }
        } else {
            swal({
                title: "Kata sandi tidak cocok!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                button: false,
                timer: "2500"
              }).then(()=> {
                window.location.reload()
            });
        }
    }

    handleModalConfirmCompany = async() => {
        await this.checkFinalFieldUpdateCompany()
        if (Number(this.state.check_telepon_company_update) === 0 &&
            Number(this.state.check_email_company_update) === 0) {
                this.setState({
                    isOpenConfirmUpdateCompany: !this.state.isOpenConfirmUpdateCompany
                })
        } else {
            if (Number(this.state.check_telepon_company_update) > 0) {
                this.setState({validation_company_info_telepon: false, empty_company_info_telepon_selected: true,
                    feedback_company_info_telepon_selected: 'Nomor telepon telah digunakan', isBtnUpdateCompany: true})
            }
            if (Number(this.state.check_email_company_update) > 0) {
                this.setState({validation_company_info_email: false, empty_company_info_email_selected: true,
                    feedback_company_info_email_selected: 'Email telah digunakan', isBtnUpdateCompany: true})
            }
        }
    }

    confirmActionUpdateCompanyInfo = async() => {
        Toast.loading('Loading...');
        await this.getCurrentPassword()
        await this.checkFinalFieldUpdateCompany()
        if (this.state.company_info_password_inserted === this.state.pembanding_account_info_password_selected) {
            if (Number(this.state.check_telepon_company_update) === 0 &&
                Number(this.state.check_email_company_update) === 0) {
                    let passqueryupdatemastercompany = encrypt("update gcm_master_company set nama_perusahaan='"+this.state.company_info_name_selected+"', "+
                        "no_telp='"+this.state.company_info_telepon_selected+"', email='"+this.state.company_info_email_selected+"', no_npwp='"+this.state.company_info_npwp_selected+"', "+
                        "no_siup='"+this.state.company_info_siup_selected+"', update_date=now() "+
                        "where id="+this.state.company_id+" returning nama_perusahaan;")
                    const resupdateMasterCompany = await this.props.updateMasterCompany({query:passqueryupdatemastercompany}).catch(err => err)
                    Toast.hide()
                    if (resupdateMasterCompany) {
                        swal({
                            title: "Sukses!",
                            text: "Perubahan disimpan!",
                            icon: "success",
                            button: false,
                            timer: "2500"
                        }).then(()=> {
                            this.loadAccountInfo()
                            this.loadCompanyInfo()
                            this.loadAlamatCompany()
                            window.location.reload()
                        });
                    } else {
                        swal({
                            title: "Gagal!",
                            text: "Tidak ada perubahan disimpan!",
                            icon: "error",
                            button: false,
                            timer: "2500"
                            }).then(()=> {
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
                    }).then(()=> {
                    window.location.reload()
                });
            }
        } else {
            swal({
                title: "Kata sandi tidak cocok!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                button: false,
                timer: "2500"
              }).then(()=> {
                window.location.reload()
            });
        }
    }

    getCurrentPassword = async() => {
        let passgetpassword = encrypt("select gcm_master_user.password from gcm_master_user where id="+this.state.id_pengguna_login)
        const resgetpassword = await this.props.getCurrentPassword({query:passgetpassword}).catch(err => err)
        if (resgetpassword) {
            this.setState({pembanding_account_info_password_selected: decrypt(resgetpassword.password)})
        } else {
            swal({
                title: "Gagal!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                button: false,
                timer: "2500"
                }).then(()=> {
                window.location.reload()
            });
        }
    }

    handleModalConfirmInsertOtp = () =>{
        if (this.state.account_info_telepon_selected !== '') {
            this.handleModalOtp()
            this.timerBtnKirimUlangOtp()
            this.sendOtp()
            this.setState({
                isOpenWaitingOtp: !this.state.isOpenWaitingOtp,
                account_info_password_inserted:'',
                validation_account_info_telepon: false,
                valueOTP:'',
                defaultOtpVia:'SMS'
            })
        }
    }

    timerBtnKirimUlangOtp = () => {
        setTimeout(() => this.setState({ isBtnWaitOtp: false}), 60000);
        setTimeout(() => this.setState({ isBtnConfirmOtp: true }), 3600000);
        this.printCountDown() 
    }

    printCountDown = () => {
        let count1 = 60;
        let myTimer = setInterval(() => {
            this.setState({timer: 'Kirim ulang OTP? Tunggu '+count1+' detik'})
            count1--;
            if (count1 === 0) {
                clearInterval(myTimer);
                this.setState({timer: 'Silakan mengirim ulang!'})
            }
        }, 1000);
    }

    sendOtp = async() => {
        let x = this.generateOtp()
        let dataReturned = Object.create(null);
        dataReturned = {
            otptype: this.state.defaultOtpVia,
            nohp: this.state.account_info_telepon_selected,
            message: 'Yth. pengguna GLOB Seller di nomor '+this.state.account_info_telepon_selected+'. Berikut OTP Anda: '+x+
                '. Gunakan OTP ini untuk verifikasi perubahan nomor telepon Anda. Terima kasih.',
            userid: 'GMOS001',
            key: 'z25k4at3jzob718iqceofgor6a1tbm'
        }
        const ressendotp = await this.props.sendOtp(dataReturned).catch (err => err)
        if (ressendotp) {
            this.setState({
                sendValueOTP:x,
                messageid: ressendotp
            })
        }
    }

    generateOtp = () => {
        let digits = '0123456789'; 
        let OTP = ''; 
        for (let i = 0; i < 6; i++ ) { 
            OTP += digits[Math.floor(Math.random() * 10)]; 
        } 
        return OTP
    }


    handleDropDownOpenViaOtp = () => {
        this.setState({isOpenViaOtp: !this.state.isOpenViaOtp})
    }

    handleModalOtp = () => {
        this.setState({
            isOpenModalOtp: !this.state.isOpenModalOtp,
            isOpenWaitingOtp: false
        })
    }

    changeOtpVia = (stat) => {
        this.setState({defaultOtpVia: stat})
    }

    handleChangeOTP = (event) =>{
        this.setState({valueOTP: event})
    }

    handleKirimUlangOtp = async() => {
        await this.setState({account_info_telepon_selected: this.state.account_info_telepon_selected, 
            defaultOtpVia:'SMS', isOpenWaitingOtp: !this.state.isOpenWaitingOtp, valueOTP:'', isBtnConfirmOtp: false})
        this.handleModalOtp()
    }

    confirmActionOTP = async() => {
        Toast.loading('Loading...');
        let dataCheckGetOtp = Object.create(null);
        await this.checkFinalFieldUpdate()
        dataCheckGetOtp = {
            messageid: this.state.messageid,
            userid: 'GMOS001',
            key: 'z25k4at3jzob718iqceofgor6a1tbm'
        }
        const resgetotp = await this.props.getOtp(dataCheckGetOtp).catch (err => err)

        if (resgetotp) {
            if (this.state.valueOTP === this.state.sendValueOTP) {
                let passqueryupdatemasteruser = ""
                if (Number(this.state.check_username_update) === 0 &&
                    Number(this.state.check_nohp_update) === 0 &&
                    Number(this.state.check_email_update) === 0 &&
                    Number(this.state.check_nik_update) === 0) {
                        if (this.state.account_info_password_selected === '') {
                            if (this.state.sa_role === 'sales') {
                                passqueryupdatemasteruser = encrypt("update gcm_master_user set username='"+this.state.account_info_username_selected+"', "+
                                    "nama='"+this.state.account_info_nama_selected+"', no_hp='"+this.state.account_info_telepon_selected+"', "+
                                    "email='"+this.state.account_info_email_selected+"', update_by='"+this.state.id_pengguna_login+"', update_date=now(), "+
                                    "no_hp_verif=true "+
                                    "where id="+this.state.id_pengguna_login+" returning update_date;")
                            } else {
                                passqueryupdatemasteruser = encrypt("update gcm_master_user set username='"+this.state.account_info_username_selected+"', "+
                                    "nama='"+this.state.account_info_nama_selected+"', no_hp='"+this.state.account_info_telepon_selected+"', "+
                                    "no_nik='"+this.state.account_info_nik_selected+"', kode_sales='"+this.state.account_info_kode_sales_selected+"', "+
                                    "email='"+this.state.account_info_email_selected+"', update_by='"+this.state.id_pengguna_login+"', update_date=now(), "+
                                    "no_hp_verif=true "+
                                    "where id="+this.state.id_pengguna_login+" returning update_date;")
                            }
                        } else {
                            if (this.state.sa_role === 'sales') {
                                passqueryupdatemasteruser = encrypt("update gcm_master_user set username='"+this.state.account_info_username_selected+"', "+
                                    "nama='"+this.state.account_info_nama_selected+"', no_hp='"+this.state.account_info_telepon_selected+"', "+
                                    "email='"+this.state.account_info_email_selected+"', password='"+encrypt(this.state.account_info_password_selected)+"', update_by='"+this.state.id_pengguna_login+"', update_date=now(), "+
                                    "no_hp_verif=true "+
                                    "where id="+this.state.id_pengguna_login+" returning update_date;")
                            } else {
                                passqueryupdatemasteruser = encrypt("update gcm_master_user set username='"+this.state.account_info_username_selected+"', "+
                                    "nama='"+this.state.account_info_nama_selected+"', no_hp='"+this.state.account_info_telepon_selected+"', "+
                                    "no_nik='"+this.state.account_info_nik_selected+"', kode_sales='"+this.state.account_info_kode_sales_selected+"', "+
                                    "email='"+this.state.account_info_email_selected+"', password='"+encrypt(this.state.account_info_password_selected)+"', update_by='"+this.state.id_pengguna_login+"', update_date=now(), "+
                                    "no_hp_verif=true "+
                                    "where id="+this.state.id_pengguna_login+" returning update_date;")
                            }
                        }
                        const resupdateMasterUser = await this.props.updateMasterUser({query:passqueryupdatemasteruser}).catch(err => err)
                        Toast.hide();
                        if (resupdateMasterUser) {
                            swal({
                                title: "Sukses!",
                                text: "Perubahan disimpan!",
                                icon: "success",
                                button: false,
                                timer: "2500"
                            }).then(()=> {
                                this.loadAccountInfo()
                                this.loadCompanyInfo()
                                this.loadAlamatCompany()
                                window.location.reload()
                            });
                        } else {
                            swal({
                                title: "Gagal!",
                                text: "Tidak ada perubahan disimpan!",
                                icon: "error",
                                button: false,
                                timer: "2500"
                              }).then(()=> {
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
                      }).then(()=> {
                        window.location.reload()
                    });
                }
            } else {
                swal({
                    title: "Kesalahan!",
                    text: "Kode OTP tidak sesuai! Tidak ada perubahan disimpan!",
                    icon: "error",
                    buttons: {
                        confirm: "Oke"
                        }
                    }).then(()=> {
                        window.location.reload()
                    });
            }
        } else {
            Toast.hide();
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    checkFinalFieldUpdate = async() => {
        let passquerycheckfieldupdate = encrypt("select * from "+
            "(select count (username) as check_username from gcm_master_user where username like '"+this.state.account_info_username_selected+"' and id !="+this.state.id_pengguna_login+") a, "+
            "(select count (no_hp) check_nohp from gcm_master_user where no_hp like '"+this.state.account_info_telepon_selected+"' and id !="+this.state.id_pengguna_login+") b, "+
            "(select count (email) check_email from gcm_master_user where email like '"+this.state.account_info_email_selected+"' and id !="+this.state.id_pengguna_login+") c, "+
            "(select count (no_nik) check_nik from gcm_master_user where no_nik like '"+this.state.account_info_nik_selected+"' "+
                "and company_id="+this.state.company_id+" and id !="+this.state.id_pengguna_login+") d ")
        const rescheckfieldupdate = await this.props.checkFieldInsertAkun({query:passquerycheckfieldupdate}).catch(err => err)
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
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    checkFinalFieldUpdateCompany = async() => {
        let passquerycheckfieldupdatecompany = encrypt("select * from "+
            "(select count (no_telp) check_nohp from gcm_master_company where no_telp like '"+this.state.company_info_telepon_selected+"' and id !="+this.state.company_id+") a, "+
            "(select count (email) check_email from gcm_master_company where email like '"+this.state.company_info_email_selected+"' and id !="+this.state.company_id+") b")
        const rescheckfieldupdatecompany = await this.props.checkFieldUpdateCompany({query:passquerycheckfieldupdatecompany}).catch(err => err)
        if (rescheckfieldupdatecompany) {
            await this.setState({
                check_telepon_company_update: rescheckfieldupdatecompany.check_nohp,
                check_email_company_update: rescheckfieldupdatecompany.check_email
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }


    render(){
        const dataAlamat = {
            columns: [
                {
                    label: 'Alamat Perusahaan',
                    field: 'alamat',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Telepon',
                    field: 'no_telp',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Aksi',
                    field: 'aksi',
                    width: 30
                }],
            rows: this.state.allAlamat
        }
        const dataAlamatSales = {
            columns: [
                {
                    label: 'Alamat Perusahaan',
                    field: 'alamat',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Telepon',
                    field: 'no_telp',
                    sort: 'asc',
                    width: 100
                }],
            rows: this.state.allAlamat
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
                                <div>Profil
                                    <div className="page-title-subheading">Profil {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <Col md="6">
                            <div style={{textAlign: "right"}}>
                                <button className="sm-2 mr-2 btn btn-primary" title="Edit Informasi Akun" onClick={this.handleModalDetailAkun}>
                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                </button>
                            </div>
                            <Card body outline color="primary">
                                <CardTitle>Informasi Akun</CardTitle>
                                    <div className="row">
                                        <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nama Pengguna</p>
                                            <p className="mb-0">{this.state.account_info_username}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nama Lengkap</p>
                                            <p className="mb-0">{this.state.account_info_nama}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nomor Induk Karyawan</p>
                                            <p className="mb-0">{(this.state.account_info_nik !== '') ? this.state.account_info_nik : '-'}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Kode Sales Distributor</p>
                                            <p className="mb-0">{(this.state.account_info_kode_sales !== '') ? this.state.account_info_kode_sales : '-'}</p>
                                        </div>
                                        <div style={{width:'50%', float:'right', paddingLeft:'3%'}}>
                                            {
                                                (this.state.sa_role === 'admin') ?
                                                    <div>
                                                        <p className="mb-0" style={{fontWeight:'bold'}}>Nomor KTP</p>
                                                        <p className="mb-0">{this.state.account_info_ktp}</p>
                                                    </div>
                                                : null
                                            }
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nomor Telepon</p>
                                            <p className="mb-0">{this.state.account_info_telepon}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Email</p>
                                            <p className="mb-0">{this.state.account_info_email}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Status Akun</p>
                                            <p className="mb-0">
                                                {(this.state.account_info_status === 'A' ) ? 'Aktif' : 'Nonaktif'}
                                            </p>
                                        </div>
                                    </div>
                            </Card>
                        </Col>
                        <Col md="6">
                            <div style={{textAlign: "right"}}>
                                <button className="sm-2 mr-2 btn btn-primary" title="Edit Informasi Perusahaan" onClick={this.handleModalDetailCompany}>
                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                </button>  
                            </div>
                            <Card body outline color="primary">
                                <CardTitle>Informasi Perusahaan</CardTitle>
                                    <div className="row">
                                        <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nama Perusahaan</p>
                                            <p className="mb-0">{this.state.company_info_name}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Telepon Perusahaan</p>
                                            <p className="mb-0">{this.state.company_info_telepon}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Email Perusahaan</p>
                                            <p className="mb-0">{this.state.company_info_email}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Kode Perusahaan</p>
                                            <p className="mb-0">{this.state.company_info_kode}</p>
                                        </div>
                                        <div style={{width:'50%', float:'right', paddingLeft:'3%'}}>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Tipe Bisnis</p>
                                            <p className="mb-0">{this.state.company_info_tipe_bisnis}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nomor NPWP</p>
                                            <p className="mb-0">{this.state.company_info_npwp}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nomor SIUP</p>
                                            <p className="mb-0">{this.state.company_info_siup}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>PPN Transaksi</p>
                                            <p className="mb-0">{Number(this.state.company_info_ppn)}%</p>
                                        </div>
                                    </div>
                            </Card>
                        </Col>
                    </div>
                    <div className="row" style={{paddingTop:'3%'}}>
                        <Col md="12">
                            <Card body outline color="primary">
                                <CardTitle>Informasi Alamat Perusahaan</CardTitle>
                                    <div style={{width:'100%'}}>
                                        {
                                            this.state.sa_role === 'admin' ?
                                                <MDBDataTable
                                                    striped
                                                    responsive
                                                    data={dataAlamat}
                                                />
                                            :
                                            <MDBDataTable
                                                    striped
                                                    responsive
                                                    data={dataAlamatSales}
                                                />
                                        }
                                    </div>
                            </Card>
                        </Col>
                    </div> 
                </div>
                {/* Modal Detail Akun */}
                <Modal size="lg" toggle={this.handleModalDetailAkun} isOpen={this.state.isOpenModalDetailAkun} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailAkun}>Edit Informasi Akun</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{marginTop:'3%'}}>
                            <div className="row">
                                <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Nama Pengguna</p>
                                        <Input type="text" name="account_info_username_selected" id="account_info_username_selected" 
                                            placeholder="Nama Pengguna" value={this.state.account_info_username_selected} 
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_account_info_username}
                                            invalid={this.state.empty_account_info_username_selected}/>
                                        <FormFeedback>{this.state.feedback_account_info_username_selected}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Nama Lengkap</p>
                                        <Input type="text" name="account_info_nama_selected" id="account_info_nama_selected" 
                                            placeholder="Nama Lengkap" value={this.state.account_info_nama_selected}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                            valid={this.state.validation_account_info_nama}
                                            invalid={this.state.empty_account_info_nama_selected}/>
                                        <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                    </FormGroup>
                                    {
                                        this.state.sa_role === 'sales' ?
                                            <FormGroup>
                                                <p className="mb-0" style={{fontWeight:'bold'}}>Nomor Induk Karyawan</p> 
                                                <Input type="text" name="account_info_nik_selected" id="account_info_nik_selected" 
                                                    value={this.state.account_info_nik_selected} 
                                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                    valid={this.state.validation_account_info_nik}
                                                    disabled={true}
                                                    invalid={this.state.empty_account_info_nik_selected}
                                                />
                                                <FormFeedback>{this.state.feedback_account_info_nik_selected}</FormFeedback>
                                            </FormGroup>
                                        :
                                            <FormGroup>
                                                <p className="mb-0" style={{fontWeight:'bold'}}>Nomor Induk Karyawan</p> 
                                                <Input type="text" name="account_info_nik_selected" id="account_info_nik_selected" 
                                                    value={this.state.account_info_nik_selected} 
                                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                    valid={this.state.validation_account_info_nik}
                                                    invalid={this.state.empty_account_info_nik_selected}
                                                />
                                                <FormFeedback>{this.state.feedback_account_info_nik_selected}</FormFeedback>
                                            </FormGroup>
                                    }
                                    {
                                        this.state.sa_role === 'sales' ?
                                            <FormGroup>
                                                <p className="mb-0" style={{fontWeight:'bold'}}>Kode Sales Distributor</p>
                                                <Input type="text" name="account_info_kode_sales_selected" id="account_info_kode_sales_selected" 
                                                    value={this.state.account_info_kode_sales_selected} 
                                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                    valid={this.state.validation_account_info_kode_sales}
                                                    disabled={true}
                                                    invalid={this.state.empty_account_info_kode_sales_selected}
                                                />
                                                <FormFeedback>{this.state.feedback_account_info_kode_sales_selected}</FormFeedback>
                                            </FormGroup>
                                        :
                                            <FormGroup>
                                                <p className="mb-0" style={{fontWeight:'bold'}}>Kode Sales Distributor</p>
                                                <Input type="text" name="account_info_kode_sales_selected" id="account_info_kode_sales_selected" 
                                                    value={this.state.account_info_kode_sales_selected} 
                                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                    valid={this.state.validation_account_info_kode_sales}
                                                    invalid={this.state.empty_account_info_kode_sales_selected}
                                                />
                                                <FormFeedback>{this.state.feedback_account_info_kode_sales_selected}</FormFeedback>
                                            </FormGroup>
                                    }
                                </div>
                                <div style={{width:'50%', float:'right', paddingLeft:'3%', paddingRight:'3%'}}>
                                    {
                                        (this.state.sa_role === 'admin') ?
                                            <FormGroup>
                                                <p className="mb-0" style={{fontWeight:'bold'}}>Nomor KTP</p>
                                                <Input type="text" name="account_info_ktp" id="account_info_ktp" 
                                                    placeholder="Nomor KTP" value={this.state.account_info_ktp} 
                                                    disabled={true}/>
                                            </FormGroup>
                                        : null
                                    }
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Nomor Telepon</p>
                                        <Input type="text" name="account_info_telepon_selected" id="account_info_telepon_selected" 
                                            placeholder="Nomor Telepon" value={this.state.account_info_telepon_selected} 
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_account_info_telepon}
                                            maxLength={15}
                                            invalid={this.state.empty_account_info_telepon_selected}/>
                                        <FormFeedback>{this.state.feedback_account_info_telepon_selected}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Email</p>
                                        <Input type="email" name="account_info_email_selected" id="account_info_email_selected" 
                                            placeholder="Email" value={this.state.account_info_email_selected} 
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_account_info_email}
                                            invalid={this.state.empty_account_info_email_selected}/>
                                        <FormFeedback>{this.state.feedback_account_info_email_selected}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Kata Sandi Baru (opsional)</p>
                                        <div className="input-group-prepend">
                                            <Input type={this.state.viewpassword} name="account_info_password_selected" id="account_info_password_selected" 
                                                placeholder="Kata Sandi"
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                                valid={this.state.validation_account_info_password}
                                                invalid={this.state.empty_account_info_password_selected}/>
                                            <span className="input-group-text" onClick={this.handleviewpassword}>
                                                <i className={this.state.logopassword}> </i>
                                            </span>
                                        </div>
                                        <div id="errorpassword" style={{display:'none', marginTop:'1%'}}>
                                            <p style={{color:'#d92550', fontSize:'10pt'}}>{this.state.feedback_account_info_password_selected}</p>
                                        </div>
                                        <FormFeedback>{this.state.feedback_account_info_password_selected}</FormFeedback>
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnUpdate}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalDetailAkun}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Update Akun*/}
                <Modal size="md" toggle={this.handleModalConfirm} isOpen={this.state.isOpenConfirmUpdate} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirm}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>{this.state.temp_new_password_selected === '' ? 'Masukkan kata sandi' : 'Masukkan kata sandi lama'}</label>
                            <div className="input-group-prepend">
                                <Input type={this.state.viewpassword_mirror} name="account_info_password_inserted" id="account_info_password_inserted" 
                                    placeholder={this.state.temp_new_password_selected === '' ? 'Kata Sandi' : 'Kata Sandi Lama'}
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    valid={this.state.validation_account_info_password_mirror}
                                    invalid={this.state.empty_account_info_password_selected_mirror}/>
                                <span className="input-group-text" onClick={this.handleviewpasswordmirror}>
                                    <i className={this.state.logopassword_mirror}> </i>
                                </span>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionUpdateAccountInfo} disabled={this.state.account_info_password_inserted === '' ? true : false}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirm}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Company By Sales */}
                <Modal size="md" toggle={this.handleModalDetailCompany} isOpen={this.state.isOpenModalDetailCompanyBySales} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailCompany}>Perhatian</ModalHeader>
                    <ModalBody>
                        <p className="mb-0">Edit Informasi Perusahaan hanya dapat diakses oleh administrator.</p>
                    </ModalBody>
                </Modal>

                {/* Modal Detail Company */}
                <Modal size="lg" toggle={this.handleModalDetailCompany} isOpen={this.state.isOpenModalDetailCompany} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailCompany}>Edit Informasi Perusahaan</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{marginTop:'3%'}}>
                            <div className="row">
                                <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Nama Perusahaan</p>
                                        <Input type="text" name="company_info_name_selected" id="company_info_name_selected" 
                                            placeholder="Nama Perusahaan" value={this.state.company_info_name_selected} 
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                            valid={this.state.validation_company_info_name}
                                            invalid={this.state.empty_company_info_name_selected}/>
                                        {/* <FormFeedback>{this.state.feedback_company_info_name_selected}</FormFeedback> */}
                                            <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Telepon Perusahaan</p>
                                        <Input type="text" name="company_info_telepon_selected" id="company_info_telepon_selected" 
                                            placeholder="Telepon Perusahaan" value={this.state.company_info_telepon_selected} 
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            maxLength={15}
                                            valid={this.state.validation_company_info_telepon}
                                            invalid={this.state.empty_company_info_telepon_selected}/>
                                        <FormFeedback>{this.state.feedback_company_info_telepon_selected}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Email Perusahaan</p>
                                        <Input type="email" name="company_info_email_selected" id="company_info_email_selected" 
                                            placeholder="Email Perusahaan" value={this.state.company_info_email_selected} 
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                            valid={this.state.validation_company_info_email}
                                            invalid={this.state.empty_company_info_email_selected}/>
                                        <FormFeedback>{this.state.feedback_company_info_email_selected}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Kode Perusahaan</p>
                                        <Input type="text" name="company_info_kode" id="company_info_kode" 
                                            value={this.state.company_info_kode} 
                                            disabled={true}/>
                                    </FormGroup>
                                </div>
                                <div style={{width:'50%', float:'right', paddingLeft:'3%', paddingRight:'3%'}}>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Tipe Bisnis</p>
                                        <Input type="text" name="company_info_tipe_bisnis" id="company_info_tipe_bisnis" 
                                            value={this.state.company_info_tipe_bisnis} 
                                            disabled={true}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Nomor NPWP</p>
                                        <Input type="text" name="company_info_npwp_selected" id="company_info_npwp_selected" 
                                            placeholder="__.___.___._-___.___" value={this.state.company_info_npwp_selected} 
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                            valid={this.state.validation_company_info_npwp}
                                            invalid={this.state.empty_company_info_npwp_selected}
                                            mask="99.999.999.9-999.999"
                                            maskplaceholder="_"
                                            tag={InputMask}
                                            />
                                        <FormFeedback>{this.state.feedback_company_info_npwp_selected}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Nomor SIUP</p>
                                        <Input type="text" name="company_info_siup_selected" id="company_info_siup_selected" 
                                            placeholder="Nomor SIUP" value={this.state.company_info_siup_selected} 
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_company_info_siup}
                                            invalid={this.state.empty_company_info_siup_selected}/>
                                        <FormFeedback>{this.state.feedback_company_info_siup_selected}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>PPN Transaksi (%)</p>
                                        <Input type="text" name="company_info_ppn" id="company_info_ppn" 
                                            value={Number(this.state.company_info_ppn)} 
                                            disabled={true}/>
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmCompany} disabled={this.state.isBtnUpdateCompany}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalDetailCompany}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Update Company*/}
                <Modal size="md" toggle={this.handleModalConfirmCompany} isOpen={this.state.isOpenConfirmUpdateCompany} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmCompany}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Masukkan kata sandi</label>
                            <div className="input-group-prepend">
                                <Input type={this.state.viewpassword_company} name="company_info_password_inserted" id="company_info_password_inserted" 
                                    placeholder="Kata Sandi"
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    valid={this.state.validation_company_info_password}
                                    invalid={this.state.empty_company_info_password}/>
                                <span className="input-group-text" onClick={this.handleviewpasswordcompany}>
                                    <i className={this.state.logopassword_company}> </i>
                                </span>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionUpdateCompanyInfo} disabled={this.state.company_info_password_inserted === '' ? true : false}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirmCompany}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Alamat Company */}
                <Modal size="lg" toggle={this.handleModalDetailAlamatCompany} isOpen={this.state.isOpenDetailAlamatCompany} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailAlamatCompany}>Edit Informasi Alamat Perusahaan</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{marginTop:'3%'}}>
                            <div className="row">
                                <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Alamat Perusahaan</p>
                                        <Input type="text" name="company_alamat_selected" id="company_alamat_selected" 
                                            placeholder="Alamat Perusahaan" value={this.state.company_alamat_selected} 
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                            valid={this.state.validation_company_alamat}
                                            invalid={this.state.empty_company_alamat_selected}/>
                                            <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Provinsi</p>
                                        <Input type="select" name="company_alamat_id_provinsi_selected" id="company_alamat_id_provinsi_selected" 
                                            value={this.state.company_alamat_id_provinsi_selected}
                                            onChange={this.handleChange}>
                                            {
                                                this.state.allProvinsi.map(allProvinsi=>{
                                                    return <option value={allProvinsi.id}>{allProvinsi.nama}</option>
                                                })
                                            }
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Kabupaten / Kota</p>
                                        <Input type="select" name="company_alamat_id_kota_selected" id="company_alamat_id_kota_selected" 
                                            value={this.state.company_alamat_id_kota_selected}
                                            onChange={this.handleChange}>
                                            {
                                                (this.state.company_alamat_id_kota_selected === '') ?
                                                <option value="" disabled selected hidden></option>
                                                : null
                                            }
                                            {
                                                this.state.allKota.map(allKota=>{
                                                    return <option value={allKota.id}>{allKota.nama}</option>
                                                })
                                            }
                                        </Input>
                                    </FormGroup>
                                </div>
                                <div style={{width:'50%', float:'right', paddingLeft:'3%', paddingRight:'3%'}}>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Kecamatan</p>
                                        <Input type="select" name="company_alamat_id_kecamatan_selected" id="company_alamat_id_kecamatan_selected" 
                                            value={this.state.company_alamat_id_kecamatan_selected}
                                            onChange={this.handleChange}
                                            >
                                            {
                                                (this.state.company_alamat_id_kecamatan_selected === '') ?
                                                <option value="" disabled selected hidden></option>
                                                : null
                                            }
                                            {
                                                this.state.allKecamatan.map(allKecamatan=>{
                                                    return <option value={allKecamatan.id}>{allKecamatan.nama}</option>
                                                })
                                            }
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <p className="mb-0" style={{fontWeight:'bold'}}>Kelurahan</p>
                                        <Input type="select" name="company_alamat_id_kelurahan_selected" id="company_alamat_id_kelurahan_selected" 
                                            value={this.state.company_alamat_id_kelurahan_selected}
                                            onChange={this.handleChange}                                            
                                            >
                                            {
                                                (this.state.company_alamat_id_kelurahan_selected === '') ?
                                                <option value="" disabled selected hidden></option>
                                                : null
                                            }
                                            {
                                                this.state.allKelurahan.map(allKelurahan=>{
                                                    return <option value={allKelurahan.id}>{allKelurahan.nama}</option>
                                                })
                                            }
                                        </Input>
                                    </FormGroup>
                                    <div style={{width:'50%', float:'left'}}>
                                        <FormGroup>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Kode Pos</p>
                                            <Input type="text" name="company_alamat_kodepos_selected" id="company_alamat_kodepos_selected" 
                                                placeholder="Kode Pos" value={this.state.company_alamat_kodepos_selected} 
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                valid={this.state.validation_company_alamat_kodepos}
                                                invalid={this.state.empty_company_alamat_kodepos_selected}/>
                                            <FormFeedback>{this.state.feedback_company_alamat_kodepos_selected}</FormFeedback>
                                        </FormGroup>
                                    </div>
                                    <div style={{width:'50%', float:'right', paddingLeft:'3%'}}>
                                        <FormGroup>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nomor Telepon</p>
                                            <Input type="text" name="company_alamat_telepon_selected" id="company_alamat_telepon_selected" 
                                                placeholder="Nomor Telepon" value={this.state.company_alamat_telepon_selected} 
                                                maxLength={15}
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                valid={this.state.validation_company_alamat_telepon}
                                                invalid={this.state.empty_company_alamat_telepon_selected}/>
                                            <FormFeedback>{this.state.feedback_company_alamat_telepon_selected}</FormFeedback>
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmAlamatCompany} disabled={this.state.isBtnUpdateAlamatCompany}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalDetailAlamatCompany}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Update Alamat Company*/}
                <Modal size="md" toggle={this.handleModalConfirmAlamatCompany} isOpen={this.state.isOpenConfirmUpdateAlamatCompany} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmAlamatCompany}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Masukkan kata sandi</label>
                            <div className="input-group-prepend">
                                <Input type={this.state.viewpassword_company_alamat} name="company_alamat_password_inserted" id="company_alamat_password_inserted" 
                                    placeholder="Kata Sandi"
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    valid={this.state.validation_company_alamat_password}
                                    invalid={this.state.empty_company_alamat_password}/>
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                <span className="input-group-text" onClick={this.handleviewpasswordcompanyalamat}>
                                    <i className={this.state.logopassword_company_alamat}> </i>
                                </span>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionUpdateAlamatCompany} disabled={this.state.company_alamat_password_inserted === '' ? true : false}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirmAlamatCompany}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Insert OTP */}
                <Modal size="md" toggle={this.handleModalOtp} isOpen={this.state.isOpenModalOtp} backdrop="static">
                    <ModalHeader>Verifikasi OTP</ModalHeader>
                    <ModalBody>
                        <div className="row" style={{padding:'3%'}}>
                            <p className="mb-0">
                                Verifikasi OTP diperlukan karena sistem mendeteksi perubahan nomor telepon.
                                Kode OTP dikirimkan ke nomor : {this.state.account_info_telepon_selected}
                            </p>
                        </div>
                        <div className="row" style={{padding:'3%'}}>
                            <div style={{width:'50%', float:'left'}}>
                                <p className="mb-0" style={{fontWeight:'bold', paddingTop:'1%'}}>Kirim kode OTP melalui :</p>
                            </div>
                            <div style={{width:'50%', float:'right'}}>
                                <ButtonDropdown isOpen={this.state.isOpenViaOtp} toggle={this.handleDropDownOpenViaOtp}>
                                    <DropdownToggle caret color="primary" title="Kirim One Time Password melalui">
                                        { this.state.defaultOtpVia}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => this.changeOtpVia('SMS')}>SMS</DropdownItem>
                                        <DropdownItem onClick={() => this.changeOtpVia('WA')}>WA</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="mb-2 mr-2 btn btn-primary" onClick={this.handleModalConfirmInsertOtp}>Konfirmasi</button>
                        <button className="mb-2 mr-2 btn btn-danger" onClick={this.handleModalOtp}>Batal</button>
                    </ModalFooter>
                </Modal>

                {/* Modal Waiting OTP */}
                <Modal size="md" toggle={this.handleModalConfirmInsertOtp} isOpen={this.state.isOpenWaitingOtp} backdrop="static">
                    <ModalHeader>Verifikasi OTP</ModalHeader>
                    <ModalBody>
                        <div style={{width:'100%'}}>
                            <p>Masukkan kode OTP yang dikirimkan ke nomor {this.state.account_info_telepon_selected}</p>
                            <div style={{display: 'table', margin: '0 auto'}}>
                            {/* <OTPInput
                                value={this.state.valueOTP}
                                onChange={this.handleChangeOTP}
                                autoFocus
                                OTPLength={6}
                                otpType="number"
                                disabled={this.state.isBtnConfirmOtp}
                                /> */}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <p>{this.state.timer}</p>
                        <button className="mb-2 mr-2 btn btn-success" id="btnkirimulangotp" disabled={this.state.isBtnWaitOtp} onClick={this.handleKirimUlangOtp}>Kirim ulang OTP</button>
                        <button className="mb-2 mr-2 btn btn-primary" onClick={this.confirmActionOTP}
                            disabled={(this.state.valueOTP.length < 6) ? "disabled" : this.state.isBtnConfirmOtp}>Konfirmasi</button>
                    </ModalFooter>
                </Modal>
                
                {/* Modal Perhatian Kode Sales Terdaftar */}
                <Modal size="sm" toggle={this.handleModalAttentionKodeSales} isOpen={this.state.isOpenAttentionKodeSales} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAttentionKodeSales}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, sistem mendeteksi kesamaan kode sales ini dengan kode sales lain yang telah terdaftar. Mohon ubah kode sales distributor.</label>
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
    getDataDetailedAccountInfoAPI: (data) => dispatch(getDataDetailedAccountInfoAPI(data)),
    getDataDetailedCompanyInfoAPI: (data) => dispatch(getDataDetailedCompanyInfoAPI(data)),
    getDataUsernameAPI: (data) => dispatch(getDataUsernameAPI(data)),
    updateMasterCompany: (data) => dispatch(updateMasterCompany(data)),
    getDataAlamatAPI: (data) => dispatch(getDataAlamatAPI(data)),
    getDataProvinsi: (data) => dispatch(getDataProvinsi(data)),
    getDataKota: (data) => dispatch(getDataKota(data)),
    getCurrentPassword: (data) => dispatch(getCurrentPassword(data)),
    getDataKecamatan: (data) => dispatch(getDataKecamatan(data)),
    getDataKelurahan: (data) => dispatch(getDataKelurahan(data)),
    getDataDetailedAlamatCompanyAPI: (data) => dispatch(getDataDetailedAlamatCompanyAPI(data)),
    getDataCheckedKodeSales: (data) => dispatch(getDataCheckedKodeSales(data)),
    sendOtp: (data) => dispatch(sendOtp(data)),
    getOtp: (data) => dispatch(getOtp(data)),
    updateMasterUser: (data) => dispatch(updateMasterUser(data)),
    updateMasterAlamat: (data) => dispatch(updateMasterAlamat(data)),
    checkFieldInsertAkun: (data) => dispatch(checkFieldInsertAkun(data)),
    checkFieldUpdateCompany: (data) => dispatch(checkFieldUpdateCompany(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter( connect(reduxState, reduxDispatch)(ContentProfil) );