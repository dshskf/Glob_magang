import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { encrypt, decrypt } from '../../../config/lib';
import swal from 'sweetalert';
import {
    getDataUsersAPI, getDataDetailedUserAPI, getDataRegisteredAPI, getDataAlamatAPI, getDataTypeBlackList, showBlacklistBy, showJenisBlacklist,
    getDataPaymentListingAPI, getDataPaymentAPI, getDataCheckedIdPayment, getDataDetailedPaymentAPI, updateStatusPayment, insertPaymentListingSeller,
    getDataDetailedUserRegisteredAPI, updateUserStatus, getstragg, getDataCategoryAPI, getDataCheckedKodeCust, getDataKodeCustAPI, getDataDetailedSalesHandlerAPI,
    getDataDetailedKodeCustomerAPI, getDataDetailedMappingAPI, getDataDetailedAlamatMappingAPI, getDataKodeMappingAlamatAPI, updateKodeMappingAlamat,
    getDataCheckedKodeAlamatMapping, totalBeranda, logoutUserAPI, sendEmailAktivasi, postQuery,
} from '../../../config/redux/action';
import { MDBDataTable } from 'mdbreact';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import './Pengguna.css'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, FormFeedback } from 'reactstrap'
import Toast from 'light-toast';
import Axios from 'axios';
import { firebaseApp } from '../../../config/firebase/index'

class ContentPengguna extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        allDataUser: [],
        tmpfilteredDataUser: [],
        allfilteredDataUser: [],
        allRegisteredUser: [],
        allPaymentListing: [],
        alltypeBlackList: [],
        allAlamat: [],
        allPaymentNotListed: [],
        allPaymentChecked: [],
        allCategory: [],
        selectedFilter: 'Semua',
        isOpen: false,
        isOpenFilter: false,
        isOpenConfirm: false,
        isOpenConfirmBlackList: false,
        statusFilter: false,
        isOpenDetailUser: false,
        isOpenDropdownStatusBlackList: false,
        isOpenDropdownTypeBlackList: false,
        isOpenAlertBlackList: false,
        isOpenNotes: false,
        company_register_id: '',
        company_register_name: '',
        company_register_status: '',
        company_register_date: '',
        company_register_id_tipe_bisnis: '',
        company_register_tipe_bisnis: '',
        company_register_phone: '',
        company_register_email: '',
        company_register_npwp: '',
        company_register_siup: '',
        company_register_dokumen: '',
        company_register_jml_akun: '',
        company_register_is_blacklist: 'false',
        company_register_id_jenis_blacklist: '',
        company_register_jenis_blacklist: '',
        company_register_blacklist_by: '',
        company_register_notes_blacklist_company: '',
        id_user: '',
        nama_user: '',
        no_ktp_user: '',
        email_user: '',
        no_hp_user: '',
        username_user: '',
        status_user: '',
        role_user: '',
        create_date_user: '',
        is_blacklist: 'false',
        id_blacklist: '0',
        blacklist_by: '',
        company_blacklist_by: '',
        nama_jenis_blacklist: 'Pilih jenis blacklist',
        notes_blacklist: '',
        notes_blacklist_company: '',
        empty_notes_blacklist: false,
        empty_notes_blacklist_company: false,
        id_blacklist_company: '0',
        nama_jenis_blacklist_company: 'Pilih jenis alasan nonaktif',
        errormessage: '',
        isOpenModalBlacklist: false,
        isOpenDetailPayment: false,
        isbtnupdatepayment: true,
        id_payment: '',
        nama_payment: '',
        deskripsi_payment: '',
        status_payment: '',
        pembanding_status_payment: '',
        isOpenStatusPayment: false,
        isOpenConfirmStatusPayment: false,
        id_buyer: '',
        isOpenInsertPayment: false,
        isBtnInsertPayment: true,
        id_payment_inserted: '',
        deskripsi_payment_inserted: 'Tidak ada deskripsi payment',
        isOpenConfirmInsertPayment: false,
        getstragg: '',
        kode_customer: '',
        validation_kode_customer: false,
        empty_kode_customer: false,
        feedback_kode_customer: '',
        kode_customer_selected: '',
        kode_sales: '',
        kode_sales_selected: '',
        show_kode_sales_selected: '',
        isBtnInsert: true,
        allCheckedKodeCust: [],
        allCheckedMapSales: 0,
        isOpenMapping: false,
        company_mapping_register_id: '',
        company_mapping_register_name: '',
        company_mapping_register_status: '',
        company_mapping_register_date: '',
        company_mapping_register_id_tipe_bisnis: '',
        company_mapping_register_tipe_bisnis: '',
        company_mapping_kode_customer: '',
        pembanding_company_mapping_kode_customer: '',
        company_mapping_kode_customer_inserted: '',
        validation_mapping_kode_customer: false,
        empty_mapping_kode_customer: false,
        feedback_mapping_kode_customer: '',
        isBtnUpdateMapping: true,
        company_mapping_kode_sales_inserted: '',
        company_mapping_kode_sales: '',
        show_company_mapping_kode_sales: '',
        isOpenConfirmMapping: false,
        countKodeCustomer: 0,
        isOpenAttentionStatusInactive: false,
        isOpenDetailAlamat: false,
        isConfirmAlamatValid: false,
        isbtnupdatekodemappingalamat: true,
        id_alamat: '',
        alamat: '',
        kelurahan: '',
        kecamatan: '',
        kota: '',
        provinsi: '',
        kodepos: '',
        no_telp: '',
        kode_shipto_mapping: '',
        insert_kode_shipto_ok: false,
        pembanding_kode_shipto_mapping: '',
        validation_kode_shipto_mapping: false,
        empty_kode_shipto_mapping: false,
        kode_billto_mapping: '',
        insert_kode_billto_ok: false,
        pembanding_kode_billto_mapping: '',
        validation_kode_billto_mapping: false,
        empty_kode_billto_mapping: false,
        isOpenConfirmMappingAlamat: false,
        allCheckedKodeAlamat: [],
        allCheckedMapAlamat: 0,
        feedback_kode_shipto_mapping: '',
        feedback_kode_billto_mapping_penagihan: '',
        checkCountPaymentBuyer: 0,
        checkCountAlamatMapped: 0,
        isBtnAktifkan: true,
        isOpenModalDokumen: false,
        is_listing_dokumen: false
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
        this.loadDataUsers()
    }

    loadDataUsers = async () => {
        let passquery = ""
        // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
        //     passquery = encrypt("select gcm_master_company.id, gcm_master_company.nama_perusahaan, "+
        //         "gcm_master_category.nama as tipe_bisnis, gcm_company_listing.status as company_status, to_char(gcm_master_company.create_date, 'DD/MM/YYYY') create_date "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //             "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+
        //             " and gcm_master_company.type='B'"+
        //             " and gcm_master_company.tipe_bisnis="+this.state.sa_divisi+
        //             " order by gcm_master_company.nama_perusahaan asc, gcm_company_listing.update_date desc;")
        // } else {
        //     passquery = encrypt("select gcm_master_company.id, gcm_master_company.nama_perusahaan, "+
        //         "gcm_master_category.nama as tipe_bisnis, gcm_company_listing.status as company_status, to_char(gcm_master_company.create_date, 'DD/MM/YYYY') create_date "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //             "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+
        //             " and gcm_master_company.type='B'"+
        //             " order by gcm_master_company.nama_perusahaan asc, gcm_company_listing.update_date desc;")
        // }
        if (this.state.sa_role === 'sales') {
            passquery = encrypt("select gcm_master_company.id, gcm_master_company.nama_perusahaan, " +
                "gcm_master_category.nama as tipe_bisnis, gcm_company_listing.status as company_status, to_char(gcm_master_company.create_date, 'DD/MM/YYYY') create_date " +
                "from gcm_company_listing_sales " +
                "inner join gcm_master_company on gcm_master_company.id = gcm_company_listing_sales.buyer_id " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_company_listing_sales.seller_id=" + this.state.company_id +
                " and gcm_master_company.type='B' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login +
                " order by gcm_master_company.create_date desc, gcm_master_company.nama_perusahaan asc, gcm_company_listing.update_date desc;")
        } else {
            passquery = encrypt("select gcm_master_company.id, gcm_master_company.nama_perusahaan, " +
                "gcm_master_category.nama as tipe_bisnis, gcm_company_listing.status as company_status, to_char(gcm_master_company.create_date, 'DD/MM/YYYY') create_date " +
                "from gcm_master_company " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id +
                " and gcm_master_company.type='B'" +
                " order by gcm_master_company.create_date desc, gcm_master_company.nama_perusahaan asc, gcm_company_listing.update_date desc;")
        }
        const res = await this.props.getDataUsersAPI({ query: passquery }).catch(err => err)
        if (res) {
            res.map((user, index) => {
                return (
                    res[index].keterangan =
                    (this.state.sa_role === 'sales') ?
                        <center>
                            <div>
                                <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                                    onClick={(e) => this.handleDetailUser(e, res[index].id)}>Lihat Detail</button>
                            </div>
                        </center>
                        :
                        <center>
                            <div>
                                <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                                    onClick={(e) => this.handleDetailUser(e, res[index].id)}>Lihat Detail</button>
                                <button className="mb-2 mr-2 btn btn-primary" title="Edit Mapping Perusahaan"
                                    onClick={(e) => this.handleDetailMapping(e, res[index].id, res[index].pure_status)}>
                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                </button>
                            </div>
                        </center>,
                    res[index].create_date =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.create_date}</p>
                )
            })
            this.setState({
                allDataUser: res,
                tmpfilteredDataUser: res
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

    loadCategory = async (kategori_sales) => {
        let passquerycategory = ""
        if (this.state.tipe_bisnis === '1') {
            passquerycategory = encrypt("select * from gcm_master_user where gcm_master_user.company_id=" +
                this.state.company_id + " and gcm_master_user.sa_divisi=" + kategori_sales + " order by id;")
        } else {
            passquerycategory = encrypt("select * from gcm_master_user where gcm_master_user.company_id=" +
                this.state.company_id + " order by id;")
        }
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

    handleDetailMapping = async (e, id, stat) => {
        if (stat !== 'I') {
            this.handleModalDetailMapping()
            e.stopPropagation();
            let passquerydetailmapping = encrypt("select gcm_master_company.id, gcm_master_company.nama_perusahaan, " +
                "gcm_company_listing.status, gcm_master_category.nama as tipe_bisnis_nama, gcm_master_company.tipe_bisnis, " +
                "to_char(gcm_master_company.create_date, 'DD/MM/YYYY') create_date, gcm_company_listing.buyer_number_mapping " +
                "from gcm_master_company inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "where gcm_master_company.id=" + id + " and gcm_company_listing.seller_id =" + this.state.company_id)
            const resdetailmapping = await this.props.getDataDetailedMappingAPI({ query: passquerydetailmapping }).catch(err => err)
            if (resdetailmapping) {
                await this.setState({
                    company_mapping_register_id: resdetailmapping.id,
                    company_mapping_register_name: resdetailmapping.company_name,
                    company_mapping_register_status: decrypt(resdetailmapping.status_perusahaan),
                    company_mapping_register_date: resdetailmapping.create_date,
                    company_mapping_register_id_tipe_bisnis: resdetailmapping.id_tipe_bisnis,
                    company_mapping_register_tipe_bisnis: resdetailmapping.tipe_bisnis,
                    company_mapping_kode_customer: resdetailmapping.buyer_number_mapping,
                    pembanding_company_mapping_kode_customer: resdetailmapping.buyer_number_mapping
                })
                if (this.state.company_mapping_register_status !== 'I') {
                    await this.loadSalesHandlerMapping(decrypt(resdetailmapping.id))
                }
                await this.loadCategory(resdetailmapping.id_tipe_bisnis)
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
        } else {
            this.handleModalAttentionStatusInactive()
        }
    }

    handleDetailUser = async (e, id) => {
        this.handleModalDetail()
        e.stopPropagation();
        let passquerydetail = encrypt("select gcm_master_company.id, gcm_master_company.nama_perusahaan, " +
            "gcm_company_listing.status, gcm_master_company.no_npwp, gcm_master_company.tipe_bisnis, " +
            "gcm_master_company.no_siup, gcm_master_company.email, gcm_master_company.no_telp, " +
            "gcm_master_category.nama as tipe_bisnis_nama, gcm_master_company.dokumen_pendukung, gcm_company_listing.buyer_number_mapping, " +
            "to_char(gcm_master_company.create_date, 'DD/MM/YYYY') create_date, to_char(gcm_master_company.update_date, 'DD/MM/YYYY') update_date, count(gcm_master_user.id) as jumlah_akun, " +
            "gcm_company_listing.is_blacklist, gcm_company_listing.id_blacklist, gcm_company_listing.blacklist_by, gcm_company_listing.notes_blacklist " +
            "from gcm_master_company left join gcm_master_user on gcm_master_company.id = gcm_master_user.company_id " +
            "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id " +
            "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
            "where gcm_master_company.id=" + id + " and gcm_company_listing.seller_id =" + this.state.company_id +
            "group by gcm_master_company.id, gcm_master_company.nama_perusahaan, gcm_company_listing.status, " +
            "gcm_master_company.no_npwp, gcm_master_company.no_siup, " +
            "gcm_master_company.email, gcm_master_company.no_telp, gcm_master_category.nama, gcm_master_company.dokumen_pendukung, " +
            "gcm_master_company.create_date, gcm_master_company.update_date, gcm_company_listing.is_blacklist, gcm_company_listing.buyer_number_mapping, " +
            "gcm_company_listing.id_blacklist, gcm_company_listing.blacklist_by, gcm_company_listing.notes_blacklist, gcm_master_company.tipe_bisnis")
        const resdetail = await this.props.getDataDetailedUserAPI({ query: passquerydetail }).catch(err => err)

        if (resdetail) {
            let dokumen = decrypt(resdetail.dokumen)
            let is_listing = false

            if (dokumen === 'listing') {
                passquerydetail = encrypt("select url_file,tipe from gcm_listing_dokumen where company_id=" + id)
                const getDokumen = await this.props.postQuery({ query: passquerydetail }).catch(err => err)

                if (getDokumen) {
                    dokumen = getDokumen.map(dok => ({
                        tipe: dok.tipe,
                        aksi: <center>
                            <a href={dok.url_file} target="_blank"> Unduh</a>
                        </center>
                    }))
                    is_listing = true
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

            await this.setState({
                company_register_id: resdetail.id,
                company_register_name: resdetail.company_name,
                company_register_status: decrypt(resdetail.status_perusahaan),
                company_register_date: resdetail.create_date,
                company_register_id_tipe_bisnis: resdetail.id_tipe_bisnis,
                company_register_tipe_bisnis: resdetail.tipe_bisnis,
                company_register_phone: resdetail.telepon,
                company_register_kodepos: resdetail.kodepos,
                company_register_email: resdetail.email,
                company_register_npwp: decrypt(resdetail.npwp),
                company_register_siup: decrypt(resdetail.siup),
                company_register_dokumen: dokumen,
                company_register_jml_akun: decrypt(resdetail.jml_akun),
                company_register_is_blacklist: resdetail.is_blacklist,
                company_register_id_jenis_blacklist: resdetail.id_blacklist,
                company_register_blacklist_by: resdetail.blacklist_by,
                company_register_notes_blacklist_company: resdetail.notes_blacklist,
                kode_customer_selected: resdetail.buyer_number_mapping,
                is_listing_dokumen: is_listing,
            })
            if (this.state.company_register_is_blacklist === true) {
                this.showBlacklistBy(this.state.company_register_blacklist_by)
                this.showBlacklistType(this.state.company_register_id_jenis_blacklist)
            }
            if (this.state.company_register_status !== 'I') {
                await this.loadSalesHandler(decrypt(resdetail.id))
            }
            await this.loadCategory(resdetail.id_tipe_bisnis)
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
        await this.loadRegisteredAccount(id)
        await this.loadAlamatAccount(id)
        await this.loadPayment(id)
        await this.loadPaymentNotListed(id)
        await this.checkCountPayment(id)
        await this.checkCountAlamatMapped(id)
        if (this.state.checkCountPaymentBuyer > 0 && this.state.checkCountAlamatMapped > 0) {
            this.setState({ isBtnAktifkan: false })
        } else {
            this.setState({ isBtnAktifkan: true })
        }
    }

    checkCountPayment = async (id) => {
        await this.setState({ id_buyer: id })
        let passquerycheckcountpayment = await encrypt("select count(gcm_payment_listing.id) as total " +
            "from gcm_payment_listing " +
            "where gcm_payment_listing.buyer_id =" + id + " and gcm_payment_listing.seller_id =" + this.state.company_id)
        const rescountcheckpayment = await this.props.totalBeranda({ query: passquerycheckcountpayment }).catch(err => err)
        if (rescountcheckpayment) {
            this.setState({
                checkCountPaymentBuyer: Number(rescountcheckpayment.total)
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

    checkCountAlamatMapped = async (id) => {
        let passquerycountalamatmapped = encrypt("select count(gcm_listing_alamat.id) as total " +
            "from gcm_listing_alamat " +
            "inner join gcm_master_alamat on gcm_listing_alamat.id_master_alamat = gcm_master_alamat.id " +
            "where gcm_master_alamat.company_id=" + id + " and flag_active='A' and gcm_listing_alamat.id_seller=" + this.state.company_id +
            " and gcm_listing_alamat.id_buyer=" + id + " and gcm_listing_alamat.kode_shipto_customer is not null;")
        const rescountalamatmapped = await this.props.totalBeranda({ query: passquerycountalamatmapped }).catch(err => err)
        if (rescountalamatmapped) {
            this.setState({
                checkCountAlamatMapped: Number(rescountalamatmapped.total)
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

    loadSalesHandler = async (buyer_id) => {
        let passquerysaleshandler = encrypt("select gcm_master_user.nama, gcm_master_user.kode_sales, gcm_company_listing_sales.id_sales" +
            " from gcm_master_user " +
            "inner join gcm_company_listing_sales on gcm_master_user.id = gcm_company_listing_sales.id_sales " +
            "where gcm_company_listing_sales.seller_id=" + this.state.company_id + " and gcm_company_listing_sales.buyer_id=" + buyer_id)
        const ressaleshandler = await this.props.getDataDetailedSalesHandlerAPI({ query: passquerysaleshandler }).catch(err => err)
        if (ressaleshandler) {
            await this.setState({
                kode_sales_selected: ressaleshandler.id_sales,
                show_kode_sales_selected: ressaleshandler.kode_sales + " | " + ressaleshandler.nama
            })
        }
    }

    loadSalesHandlerMapping = async (buyer_id) => {
        let passquerysaleshandler = encrypt("select gcm_master_user.nama, gcm_master_user.kode_sales, gcm_company_listing_sales.id_sales" +
            " from gcm_master_user " +
            "inner join gcm_company_listing_sales on gcm_master_user.id = gcm_company_listing_sales.id_sales " +
            "where gcm_company_listing_sales.seller_id=" + this.state.company_id + " and gcm_company_listing_sales.buyer_id=" + buyer_id)
        const ressaleshandler = await this.props.getDataDetailedSalesHandlerAPI({ query: passquerysaleshandler }).catch(err => err)
        if (ressaleshandler) {
            await this.setState({
                company_mapping_kode_sales_selected: ressaleshandler.id_sales,
                show_company_mapping_kode_sales: ressaleshandler.kode_sales + " | " + ressaleshandler.nama
            })
        }
    }

    loadAlamatAccount = async (id) => {
        let passqueryalamataccount = encrypt("select gcm_master_alamat.alamat, gcm_master_kelurahan.nama as kelurahan, " +
            "gcm_master_kecamatan.nama as kecamatan, gcm_master_city.nama as kota, gcm_master_provinsi.nama as provinsi, " +
            "gcm_master_alamat.kodepos, gcm_master_alamat.no_telp, gcm_master_alamat.shipto_active, gcm_master_alamat.billto_active, " +
            "gcm_listing_alamat.kode_shipto_customer, gcm_listing_alamat.id,gcm_listing_alamat.kode_billto_customer " +
            "from gcm_master_alamat " +
            "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id " +
            "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id " +
            "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id " +
            "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id " +
            "inner join gcm_listing_alamat on gcm_listing_alamat.id_master_alamat = gcm_master_alamat.id " +
            "where gcm_master_alamat.company_id=" + id + " and flag_active='A' and gcm_listing_alamat.id_seller=" + this.state.company_id +
            " and gcm_listing_alamat.id_buyer=" + id)
        const resalamataccount = await this.props.getDataAlamatAPI({ query: passqueryalamataccount }).catch(err => err)
        if (resalamataccount) {
            resalamataccount.map((user, index) => {
                return (
                    resalamataccount[index].kode_shipto_customer =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.kode_shipto_customer}</p>,
                    resalamataccount[index].kode_billto_customer =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.kode_billto_customer}</p>,
                    resalamataccount[index].keterangan =
                    <center>
                        <div>
                            <button className="mb-2 mr-2 btn btn-primary" title="Edit Mapping Perusahaan"
                                onClick={(e) => this.handleDetailAlamat(e, resalamataccount[index].id)}>
                                <i className="fa fa-edit" aria-hidden="true"></i>
                            </button>
                        </div>
                    </center>
                )
            })
            this.setState({
                allAlamat: resalamataccount
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

    handleDetailAlamat = async (e, id) => {
        this.handleModalDetailAlamat()
        e.stopPropagation();
        let passquerykodedetailalamat = encrypt("select gcm_master_alamat.alamat, gcm_master_kelurahan.nama as kelurahan, gcm_master_kecamatan.nama as kecamatan, " +
            "gcm_master_city.nama as kota, gcm_master_provinsi.nama as provinsi, gcm_master_alamat.kodepos, gcm_master_alamat.no_telp, " +
            "gcm_listing_alamat.id, gcm_listing_alamat.kode_shipto_customer, gcm_listing_alamat.kode_billto_customer " +
            "from gcm_master_alamat " +
            "inner join gcm_listing_alamat on gcm_master_alamat.id = gcm_listing_alamat.id_master_alamat " +
            "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id " +
            "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id " +
            "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id " +
            "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id " +
            "where gcm_listing_alamat.id = " + id)

        const resdetailalamat = await this.props.getDataDetailedAlamatMappingAPI({ query: passquerykodedetailalamat }).catch(err => err)
        if (resdetailalamat) {
            this.setState({
                id_alamat: resdetailalamat.id,
                alamat: resdetailalamat.alamat,
                kelurahan: resdetailalamat.kelurahan,
                kecamatan: resdetailalamat.kecamatan,
                kota: resdetailalamat.kota,
                provinsi: resdetailalamat.provinsi,
                kodepos: resdetailalamat.kodepos,
                no_telp: resdetailalamat.no_telp,
                kode_shipto_mapping: resdetailalamat.kode_shipto_customer,
                pembanding_kode_shipto_mapping: resdetailalamat.kode_shipto_customer,
                kode_billto_mapping: resdetailalamat.kode_billto_customer,
                pembanding_kode_billto_mapping: resdetailalamat.kode_billto_customer,
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

    handleModalDetailAlamat = async () => {
        await this.setState({
            isOpenDetailAlamat: !this.state.isOpenDetailAlamat,
            isbtnupdatekodemappingalamat: true,
            id_alamat: '',
            alamat: '',
            kelurahan: '',
            kecamatan: '',
            kota: '',
            provinsi: '',
            kodepos: '',
            no_telp: '',
            kode_shipto_mapping: '',
            validation_kode_shipto_mapping: false,
            empty_kode_shipto_mapping: false,
            kode_billto_mapping: '',
            validation_kode_billto_mapping: false,
            empty_kode_billto_mapping: false
        })
        this.loadCheckingMappingAlamat()
    }


    loadPayment = async (id) => {
        await this.setState({ id_buyer: id })
        let passquerypayment = await encrypt("select gcm_master_payment.payment_name, gcm_master_payment.deskripsi, gcm_payment_listing.status, gcm_seller_payment_listing.id " +
            "from gcm_payment_listing " +
            "inner join gcm_seller_payment_listing on gcm_payment_listing.payment_id = gcm_seller_payment_listing.id " +
            "inner join gcm_master_payment on gcm_master_payment.id = gcm_seller_payment_listing.payment_id " +
            "where gcm_payment_listing.buyer_id =" + id + " and gcm_payment_listing.seller_id =" + this.state.company_id)
        const respayment = await this.props.getDataPaymentListingAPI({ query: passquerypayment }).catch(err => err)
        if (respayment) {
            respayment.map((user, index) => {
                return (
                    respayment[index].status =
                    <center>
                        <div className={user.status === 'A' ? 'mb-2 mr-2 badge badge-success' : user.status === 'I' ? 'mb-2 mr-2 badge badge-danger' : 'mb-2 mr-2 badge badge-danger'}>
                            {user.status === 'A' ? 'Aktif' : 'Nonaktif'}</div>
                    </center>,
                    respayment[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailPaymentListing(e, respayment[index].id)}>Lihat Detail</button>
                    </center>
                )
            })
            this.setState({
                allPaymentListing: respayment
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

    handleDetailPaymentListing = async (e, id) => {
        this.handleModalDetailPayment()
        e.stopPropagation()
        let passquerydetailpayment = encrypt("select gcm_master_payment.payment_name, gcm_master_payment.deskripsi, " +
            "gcm_payment_listing.status, gcm_payment_listing.id from gcm_payment_listing " +
            "inner join gcm_seller_payment_listing on gcm_seller_payment_listing.id = gcm_payment_listing.payment_id " +
            "inner join gcm_master_payment on gcm_master_payment.id = gcm_seller_payment_listing.payment_id " +
            "where gcm_payment_listing.payment_id=" + id)
        const resdetailpayment = await this.props.getDataDetailedPaymentAPI({ query: passquerydetailpayment }).catch(err => err)
        if (resdetailpayment) {
            await this.setState({
                id_payment: resdetailpayment.id,
                nama_payment: resdetailpayment.nama,
                deskripsi_payment: resdetailpayment.deskripsi,
                status_payment: resdetailpayment.status,
                pembanding_status_payment: resdetailpayment.status
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

    handleDetailUserRegistered = async (e, id) => {
        this.handleModalDetailUser()
        this.loadTypeBlackList()
        await this.setState({
            id_user: id
        })
        e.stopPropagation();
        let passquerydetailuserregistered = encrypt("select gcm_master_user.nama, gcm_master_user.no_ktp, gcm_master_user.email, " +
            "gcm_master_user.no_hp, gcm_master_user.username, gcm_master_user.status, gcm_master_user.role, " +
            "gcm_master_user.is_blacklist, gcm_master_user.id_blacklist, gcm_master_type_blacklist.nama as nama_type_blacklist, " +
            "gcm_master_user.notes_blacklist, gcm_master_user.blacklist_by, gcm_master_company.nama_perusahaan, to_char(gcm_master_user.create_date, 'DD/MM/YYYY') create_date " +
            "from gcm_master_user " +
            "left join gcm_master_type_blacklist on gcm_master_user.id_blacklist = gcm_master_type_blacklist.id " +
            "left join gcm_master_company on gcm_master_user.blacklist_by = gcm_master_company.id " +
            "where gcm_master_user.id=" + id)
        const resdetailuserregistered = await this.props.getDataDetailedUserRegisteredAPI({ query: passquerydetailuserregistered }).catch(err => err)
        if (resdetailuserregistered) {
            this.setState({
                nama_user: resdetailuserregistered.nama_user,
                no_ktp_user: resdetailuserregistered.no_ktp_user,
                email_user: resdetailuserregistered.email_user,
                no_hp_user: resdetailuserregistered.no_hp_user,
                username_user: resdetailuserregistered.username_user,
                status_user: resdetailuserregistered.status_user,
                role_user: resdetailuserregistered.role_user,
                is_blacklist: resdetailuserregistered.is_blacklist,
                id_blacklist: resdetailuserregistered.id_blacklist,
                blacklist_by: resdetailuserregistered.blacklist_by,
                company_blacklist_by: resdetailuserregistered.company_blacklist_by,
                nama_jenis_blacklist: resdetailuserregistered.nama_type_blacklist,
                notes_blacklist: resdetailuserregistered.notes_blacklist,
                create_date_user: resdetailuserregistered.create_date_user
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

    loadTypeBlackList = async () => {
        let passquerytypeblacklist = encrypt("select * from gcm_master_type_blacklist;")
        const restypeblacklist = await this.props.getDataTypeBlackList({ query: passquerytypeblacklist }).catch(err => err)
        if (restypeblacklist) {
            this.setState({
                alltypeBlackList: restypeblacklist
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

    handleModalDetailMapping = () => {
        this.setState({
            isOpenMapping: !this.state.isOpenMapping,
            allCheckedMapSales: 0,
            company_mapping_kode_customer_inserted: '',
            company_mapping_kode_sales_inserted: '',
            validation_mapping_kode_customer: false,
            empty_mapping_kode_customer: false,
            countKodeCustomer: 0,
            isBtnUpdateMapping: true
        })
        this.loadCheckingKodeCustomer()
    }

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            getstragg: '',
            allCheckedMapSales: 0,
            kode_sales_selected: '',
            show_kode_sales_selected: '',
            isBtnAktifkan: true
        })
        this.loadCheckingKodeCustomer()
    }

    handleModalDetailUser = async () => {
        await this.setState({
            isOpenDetailUser: !this.state.isOpenDetailUser,
            id_blacklist: '0',
            nama_jenis_blacklist: 'Pilih jenis blacklist',
            empty_notes_blacklist: false
        })
    }

    handleModalDetailPayment = async () => {
        await this.setState({
            isOpenDetailPayment: !this.state.isOpenDetailPayment,
            isbtnupdatepayment: true,
            id_payment: '',
            nama_payment: '',
            deskripsi_payment: '',
            status_payment: ''
        })
    }

    handleStatusBlackList = () => {
        this.setState({
            isOpenDropdownStatusBlackList: !this.state.isOpenDropdownStatusBlackList
        })
    }

    handleDropDownTypeBlackList = () => {
        this.setState({
            isOpenDropdownTypeBlackList: !this.state.isOpenDropdownTypeBlackList
        })
    }

    handleModalAlertBlackList = () => {
        this.setState({
            isOpenAlertBlackList: !this.state.isOpenAlertBlackList
        })
    }

    handleFilter = () => {
        this.setState({
            isOpenFilter: !this.state.isOpenFilter
        })
    }

    filterData = (e) => {
        if (e === 'S') {
            this.loadDataUsers()
            this.setState({
                statusFilter: false,
                selectedFilter: 'Semua'
            })
        } else {
            this.setState({
                statusFilter: true,
                allfilteredDataUser: this.state.tmpfilteredDataUser.filter(tmpfilteredDataUser => tmpfilteredDataUser.filterby === e)
            })
            e === 'A' ? this.setState({ selectedFilter: 'Aktif' }) :
                e === 'I' ? this.setState({ selectedFilter: 'Belum Aktif' }) :
                    this.setState({ selectedFilter: 'Nonaktif' })
        }
    }

    loadRegisteredAccount = async (id) => {
        let passqueryregisteredaccount = encrypt("select gcm_master_user.id as id_user, gcm_master_user.username, gcm_master_user.nama, " +
            "gcm_master_user.status, gcm_master_user.role from gcm_master_user " +
            "inner join gcm_master_company on gcm_master_company.id = gcm_master_user.company_id " +
            "where gcm_master_user.company_id=" + id + " group by gcm_master_user.id, gcm_master_user.username, " +
            "gcm_master_user.nama, gcm_master_user.status, gcm_master_user.role;")
        const resregisteredaccount = await this.props.getDataRegisteredAPI({ query: passqueryregisteredaccount }).catch(err => err)
        if (resregisteredaccount) {
            resregisteredaccount.map((user, index) => {
                return (
                    resregisteredaccount[index].status =
                    <center>
                        <div className={user.status === 'A' ? 'mb-2 mr-2 badge badge-success' : user.status === 'I' ? 'mb-2 mr-2 badge badge-danger' : 'mb-2 mr-2 badge badge-danger'}>
                            {user.status === 'A' ? 'Aktif' : 'Nonaktif'}</div>
                    </center>,
                    resregisteredaccount[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailUserRegistered(e, resregisteredaccount[index].id_user)}>Lihat Detail</button>
                    </center>,
                    resregisteredaccount[index].role =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.role}</p>
                )
            })
            this.setState({
                allRegisteredUser: resregisteredaccount
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

    handleModalConfirm = async (stat) => {
        await this.loadCategory(this.state.company_register_id_tipe_bisnis)
        await this.loadCheckingKodeCustomer()
        await this.loadKodeCustomer()
        // sini call lagi kode customer
        if (stat === 'Blacklist' && this.state.id_blacklist_company === '0' && this.state.notes_blacklist_company === '') {
            this.setState({
                isOpenAlertBlackList: !this.state.isOpenAlertBlackList,
                errormessage: 'Harap pilih jenis alasan nonaktif dan masukkan alasan nonaktif!',
                empty_notes_blacklist_company: true
            })
        } else if (stat === 'Blacklist' && this.state.id_blacklist_company === '0') {
            this.setState({
                isOpenAlertBlackList: !this.state.isOpenAlertBlackList,
                errormessage: 'Harap pilih jenis alasan nonaktif!'
            })
        } else if (stat === 'Blacklist' && this.state.notes_blacklist_company === '') {
            this.setState({
                empty_notes_blacklist_company: true
            })
        } else if (stat === 'Blacklist' && this.state.id_blacklist_company !== '0' && this.state.notes_blacklist_company !== '') {
            this.setState({
                empty_notes_blacklist_company: false,
                isOpenConfirm: !this.state.isOpenConfirm
            })
        }
        else {
            this.setState({
                isOpenConfirm: !this.state.isOpenConfirm,
                kode_sales: '',
                kode_customer: '',
                validation_kode_customer: false,
                empty_kode_customer: false,
                isBtnInsert: true
            })
        }
    }

    loadKodeCustomer = async () => {
        let passquerykodecust = encrypt("select gcm_company_listing.buyer_number_mapping from gcm_company_listing " +
            "where gcm_company_listing.buyer_id=" + decrypt(this.state.company_register_id) + " and gcm_company_listing.seller_id=" + this.state.company_id)
        const reskodecust = await this.props.getDataDetailedKodeCustomerAPI({ query: passquerykodecust }).catch(err => err)
        if (reskodecust) {
            await this.setState({
                kode_customer_selected: reskodecust.buyer_number_mapping
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

    handleModalConfirmBlackList = () => {
        this.setState({
            isOpenConfirmBlackList: !this.state.isOpenConfirmBlackList
        })
    }

    confirmAction = async () => {
        Toast.loading('Loading...');
        let activate = "A"
        let reject = "R"
        const emailData = {
            sender: this.state.company_name,
            receiver: this.state.company_register_name,
            email_receiver: this.state.company_register_email,
            receiver_type: "buyer"
        }

        let company_reg_id = decrypt(this.state.company_register_id)
        if (this.state.company_register_status === activate) {
            let passqueryupdatestatus = encrypt(
                "with new_order as (" +
                "update gcm_company_listing set status='" + reject + "', update_date=now(), is_blacklist=true, id_blacklist=" + this.state.id_blacklist_company +
                ", notes_blacklist='" + this.state.notes_blacklist_company + "', blacklist_by=" + this.state.company_id + " where buyer_id=" + company_reg_id +
                " and seller_id=" + this.state.company_id + " returning status) " +
                "update gcm_company_listing_sales set id_sales='" + this.state.kode_sales_selected + "', status='I' " +
                "where buyer_id='" + company_reg_id + "' and seller_id='" + this.state.company_id + "' returning status;"
            )
            const resupdatestatus = await this.props.updateUserStatus({ query: passqueryupdatestatus }).catch(err => err)
            Toast.hide();
            if (resupdatestatus) {
                swal({
                    title: "Sukses!",
                    text: "Perubahan disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.handleModalDetail()
                    this.handleModalBlacklist()
                    this.handleModalConfirm()
                    this.loadDataUsers()
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
        } else if (this.state.company_register_status === reject) {
            await this.loadCheckingKodeCustomer()
            await this.loadCheckingMappingSales(company_reg_id)
            let check_kode_cust = this.state.allCheckedKodeCust.filter(input_kode_cust => { return input_kode_cust.buyer_number_mapping === this.state.kode_customer_selected });
            if (check_kode_cust !== '' && check_kode_cust.length <= 1) {
                let passqueryupdatestatus = ""
                if (Number(this.state.allCheckedMapSales) === 1) {
                    passqueryupdatestatus = encrypt(
                        "with new_order as (" +
                        "update gcm_company_listing set status='" + activate + "', update_date=now(), is_blacklist=false, id_blacklist=" + this.state.id_blacklist_company +
                        ", notes_blacklist='" + this.state.notes_blacklist_company + "', blacklist_by=null, buyer_number_mapping='" + this.state.kode_customer_selected + "', " +
                        "seller_number_mapping='" + this.state.id_company_registered + "' " +
                        "where buyer_id=" + company_reg_id + " and seller_id=" + this.state.company_id + " returning status) " +
                        "update gcm_company_listing_sales set id_sales='" + this.state.kode_sales_selected + "', status='A' " +
                        "where buyer_id='" + company_reg_id + "' and seller_id='" + this.state.company_id + "' returning status;"
                    )
                }
                const resupdatestatus = await this.props.updateUserStatus({ query: passqueryupdatestatus }).catch(err => err)
                Toast.hide();
                if (resupdatestatus) {
                    await this.props.sendEmailToUser(emailData)
                    swal({
                        title: "Sukses!",
                        text: "Perubahan disimpan!",
                        icon: "success",
                        button: false,
                        timer: "2500"
                    })
                        .then(() => {
                            this.handleModalDetail()                            
                            this.handleModalConfirm()
                            this.loadDataUsers()
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
                this.setState({ validation_kode_customer: false, feedback_kode_customer: 'Kode pelanggan telah digunakan', empty_kode_customer: true, isBtnInsert: true })
            }
        } else {
            await this.loadCheckingKodeCustomer()
            await this.loadCheckingMappingSales(company_reg_id)
            let check_kode_cust = this.state.allCheckedKodeCust.filter(input_kode_cust => { return input_kode_cust.buyer_number_mapping === this.state.kode_customer });
            if (check_kode_cust !== '' && check_kode_cust.length === 0) {
                let passqueryupdatestatus = ""
                if (Number(this.state.allCheckedMapSales) > 0) {
                    passqueryupdatestatus = encrypt(
                        "with new_order as (" +
                        "update gcm_company_listing set status='" + activate + "', update_date=now(), is_blacklist=false, id_blacklist=" + this.state.id_blacklist_company +
                        ", notes_blacklist='" + this.state.notes_blacklist_company + "', blacklist_by=null, buyer_number_mapping='" + this.state.kode_customer + "', " +
                        "seller_number_mapping='" + this.state.id_company_registered + "' " +
                        "where buyer_id=" + company_reg_id + " and seller_id=" + this.state.company_id + " returning status) " +
                        "update gcm_company_listing_sales set id_sales='" + this.state.kode_sales + "', status='A' " +
                        "where buyer_id='" + company_reg_id + "' and seller_id='" + this.state.company_id + "' returning status;"
                    )
                } else {
                    passqueryupdatestatus = encrypt(
                        "with new_order as (" +
                        "update gcm_company_listing set status='" + activate + "', update_date=now(), is_blacklist=false, id_blacklist=" + this.state.id_blacklist_company +
                        ", notes_blacklist='" + this.state.notes_blacklist_company + "', blacklist_by=null, buyer_number_mapping='" + this.state.kode_customer + "', " +
                        "seller_number_mapping='" + this.state.id_company_registered + "' " +
                        "where buyer_id=" + company_reg_id + " and seller_id=" + this.state.company_id + " returning status) " +
                        "insert into gcm_company_listing_sales (buyer_id, seller_id, id_sales, status) values ('" +
                        company_reg_id + "', '" + this.state.company_id + "', '" + this.state.kode_sales + "', 'A') returning status;"
                    )
                }

                const resupdatestatus = await this.props.updateUserStatus({ query: passqueryupdatestatus }).catch(err => err)
                Toast.hide();
                if (resupdatestatus) {
                    await this.props.sendEmailToUser(emailData)
                    swal({
                        title: "Sukses!",
                        text: "Perubahan disimpan!",
                        icon: "success",
                        button: false,
                        timer: "2500"
                    })
                        .then(() => {
                            this.handleModalDetail()                            
                            this.handleModalConfirm()
                            this.loadDataUsers()
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
                this.setState({ validation_kode_customer: false, feedback_kode_customer: 'Kode pelanggan telah digunakan', empty_kode_customer: true, isBtnInsert: true })
            }
        }
    }

    loadCheckingKodeCustomer = async () => {
        let passquerycheckingkodecust = encrypt("select gcm_company_listing.buyer_number_mapping from gcm_company_listing " +
            "where gcm_company_listing.seller_id=" + this.state.company_id)
        const reskodecust = await this.props.getDataKodeCustAPI({ query: passquerycheckingkodecust }).catch(err => err)
        if (reskodecust) {
            await this.setState({
                allCheckedKodeCust: reskodecust
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

    loadCheckingMappingSales = async (buyer_id) => {
        let passquerycheckingmapsales = encrypt("select count(gcm_company_listing_sales.id) as total from gcm_company_listing_sales " +
            "where gcm_company_listing_sales.seller_id=" + this.state.company_id + " and gcm_company_listing_sales.buyer_id=" + buyer_id)
        const resmapsales = await this.props.getDataCheckedKodeCust({ query: passquerycheckingmapsales }).catch(err => err)
        if (resmapsales) {
            await this.setState({
                allCheckedMapSales: Number(resmapsales.total)
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

    changeStatusBlackList = (stat) => {
        this.setState({
            is_blacklist: stat
        })
        if (stat === false) {
            this.setState({
                id_blacklist: '0'
            })
        }
    }

    populateTypeBlackList = (id, nama) => {
        this.setState({
            id_blacklist: id,
            nama_jenis_blacklist: nama
        })
    }

    populateTypeBlackListCompany = (id, nama) => {
        this.setState({
            id_blacklist_company: id,
            nama_jenis_blacklist_company: nama
        })
    }

    handleChange = async (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'kode_shipto_mapping') {
            this.check_kode_shipto_mapping(event.target.value)
        }
        if (event.target.name === 'kode_billto_mapping') {
            this.check_kode_billto_mapping(event.target.value)
        }
        if (this.state.insert_kode_shipto_ok === true && this.state.insert_kode_billto_ok === true
            && event.target.value !== '') {
            this.setState({ isbtnupdatekodemappingalamat: false })
        }
        if (event.target.name === 'kode_sales') {
            this.changeSales(event.target.value)
        }
        if (event.target.name === 'kode_customer') {
            this.check_kode_customer(event.target.value)
        }
        if (event.target.name === 'kode_sales_selected') {
            this.changeSalesEdited(event.target.value)
        }
        if (event.target.name === 'kode_customer_selected') {
            this.check_kode_customer_selected(event.target.value)
        }
        if (event.target.name === 'company_mapping_kode_sales_inserted') {
            this.changeSalesMapping(event.target.value)
        }
        if (event.target.name === 'company_mapping_kode_customer_inserted') {
            this.check_kode_customer_mapping(event.target.value)
        }
        if (event.target.name === 'company_mapping_kode_sales_selected') {
            this.changeSalesMappingEdited(event.target.value)
        }
        if (event.target.name === 'company_mapping_kode_customer') {
            this.check_kode_customer_mapping_selected(event.target.value)
        }
        if (event.target.name === 'notes_blacklist') {
            this.check_notes_blacklist(event.target.value)
        }
        if (event.target.name === 'notes_blacklist_company') {
            this.check_notes_blacklist_company(event.target.value)
        }
        if (event.target.name === 'id_payment_inserted') {
            let arr = this.state.allPaymentNotListed.filter
                (arr_id => { return arr_id.id === event.target.value });
            this.setState({ deskripsi_payment_inserted: arr[0].deskripsi })
            await this.setState({ id_payment_inserted: event.target.value })
            if (this.state.id_payment_inserted !== '') {
                await this.setState({ isBtnInsertPayment: false })
            }
        }
    }

    check_kode_shipto_mapping = (e) => {
        // if (e === '') {
        //     this.setState({
        //         isbtnupdatekodemappingalamat: true, feedback_kode_shipto_mapping: 'Kolom ini wajib diisi',
        //         empty_kode_shipto_mapping: true, validation_kode_shipto_mapping: false
        //     })
        // } else {
        //     this.setState({ empty_kode_shipto_mapping: false })
        //     let check_kode_shipto_map = this.state.allCheckedKodeAlamat.filter
        //     if (check_kode_shipto_map !== '' && check_kode_shipto_map.length <= 1) {
        //         this.setState({ validation_kode_shipto_mapping: true, feedback_kode_shipto_mapping: '', empty_kode_shipto_mapping: false })
        //         this.setState({ isbtnupdatekodemappingalamat: false })
        //     } else {
        //         this.setState({
        //             validation_kode_shipto_mapping: false, feedback_kode_shipto_mapping: 'Kode mapping alamat ship to telah digunakan',
        //             empty_kode_shipto_mapping: true, isbtnupdatekodemappingalamat: true
        //         })
        //     }
        // }
        if (e === '') {
            this.setState({
                isbtnupdatekodemappingalamat: true, feedback_kode_shipto_mapping: 'Kolom ini wajib diisi',
                empty_kode_shipto_mapping: true, validation_kode_shipto_mapping: false
            })
            this.setState({ insert_kode_shipto_ok: false })
        } else {
            this.setState({ empty_kode_shipto_mapping: false })
            let check_kode_shipto_map = this.state.allCheckedKodeAlamat.filter
            if (check_kode_shipto_map !== '' && check_kode_shipto_map.length <= 1) {
                this.setState({ validation_kode_shipto_mapping: true, feedback_kode_shipto_mapping: '', empty_kode_shipto_mapping: false })
                // this.setState({ isbtnupdatekodemappingalamat: false })
                this.setState({ insert_kode_shipto_ok: true })
            } else {
                this.setState({
                    validation_kode_shipto_mapping: false, feedback_kode_shipto_mapping: 'Kode mapping alamat ship to telah digunakan',
                    empty_kode_shipto_mapping: true, isbtnupdatekodemappingalamat: true
                })
                this.setState({ insert_kode_shipto_ok: false })
            }
        }

        if (document.getElementById("kode_shipto_mapping").value !== "" && document.getElementById("kode_billto_mapping").value !== "") {
            this.setState({ validation_kode_shipto_mapping: true, feedback_kode_shipto_mapping: '', empty_kode_shipto_mapping: false })
            this.setState({ insert_kode_shipto_ok: true, isbtnupdatekodemappingalamat: false })
        }
    }

    check_kode_billto_mapping = (e) => {
        if (this.state.kode_shipto_mapping !== "") {
            if (e === '') {
                this.setState({
                    isbtnupdatekodemappingalamat: true, feedback_kode_billto_mapping: 'Kolom ini wajib diisi',
                    empty_kode_billto_mapping: true, validation_kode_billto_mapping: false
                })
                this.setState({ insert_kode_billto_ok: false })
            } else {
                this.setState({ validation_kode_billto_mapping: true, feedback_kode_billto_mapping: '', empty_kode_billto_mapping: false })
                this.setState({ isbtnupdatekodemappingalamat: false, insert_kode_billto_ok: true })
            }
        }
        else if (this.state.kode_shipto_mapping === "") {
            if (e === '') {
                this.setState({
                    isbtnupdatekodemappingalamat: true, feedback_kode_billto_mapping: 'Kolom ini wajib diisi',
                    empty_kode_billto_mapping: true, validation_kode_billto_mapping: false
                })
                this.setState({ insert_kode_billto_ok: false })
            } else {
                this.setState({ empty_kode_billto_mapping: false })
                let check_kode_billto_map = this.state.allCheckedKodeAlamat.filter
                if (check_kode_billto_map !== '' && check_kode_billto_map.length <= 1) {
                    this.setState({ validation_kode_billto_mapping: true, feedback_kode_billto_mapping: '', empty_kode_billto_mapping: false })
                    // this.setState({ isbtnupdatekodemappingalamat: false })
                    this.setState({ insert_kode_billto_ok: true })
                } else {
                    this.setState({
                        validation_kode_billto_mapping: false, feedback_kode_billto_mapping: 'Kode mapping alamat bill to telah digunakan',
                        empty_kode_billto_mapping: true, isbtnupdatekodemappingalamat: true
                    })
                    this.setState({ insert_kode_billto_ok: false })
                }
            }
        }

        if (document.getElementById("kode_shipto_mapping").value !== "" && document.getElementById("kode_billto_mapping").value !== "") {
            this.setState({ validation_kode_billto_mapping: true, feedback_kode_billto_mapping: '', empty_kode_billto_mapping: false })
            this.setState({ insert_kode_billto_ok: true, isbtnupdatekodemappingalamat: false })
        }

    }


    changeSales = async (id) => {
        await this.setState({
            kode_sales: id
        })
        if (this.state.kode_customer !== '' && this.state.kode_sales !== '') {
            this.setState({ isBtnInsert: false })
        } else {
            this.setState({ isBtnInsert: true })
        }
    }

    check_kode_customer = (e) => {
        if (e === '') {
            this.setState({ validation_kode_customer: false, feedback_kode_customer: 'Kolom ini wajib diisi', empty_kode_customer: true, isBtnInsert: true })
        } else {
            this.setState({ empty_kode_customer: false })
            let check_kode_cust = this.state.allCheckedKodeCust.filter(input_kode_cust => { return input_kode_cust.buyer_number_mapping === e });
            if (check_kode_cust !== '' && check_kode_cust.length === 0) {
                this.setState({ validation_kode_customer: true, feedback_kode_customer: '', empty_kode_customer: false })
                if (this.state.kode_sales !== '') {
                    this.setState({ isBtnInsert: false })
                }
            } else {
                this.setState({ validation_kode_customer: false, feedback_kode_customer: 'Kode pelanggan telah digunakan', empty_kode_customer: true, isBtnInsert: true })
            }
        }
    }

    changeSalesEdited = async (id) => {
        await this.setState({
            kode_sales_selected: id
        })
        // sini
        // if (this.state.kode_customer_selected !== '' && this.state.kode_sales_selected !== '') {
        //     this.setState({isBtnInsert: false})
        // }
    }

    check_kode_customer_selected = (e) => {
        if (e === '') {
            this.setState({ validation_kode_customer: false, feedback_kode_customer: 'Kolom ini wajib diisi', empty_kode_customer: true, isBtnInsert: true })
        } else {
            this.setState({ empty_kode_customer: false })
            let check_kode_cust = this.state.allCheckedKodeCust.filter(input_kode_cust => { return input_kode_cust.buyer_number_mapping === e });
            if (check_kode_cust !== '' && check_kode_cust.length <= 1) {
                this.setState({ validation_kode_customer: true, feedback_kode_customer: '', empty_kode_customer: false })
                if (this.state.kode_sales !== '') {
                    this.setState({ isBtnInsert: false })
                }
            } else {
                this.setState({ validation_kode_customer: false, feedback_kode_customer: 'Kode pelanggan telah digunakan', empty_kode_customer: true, isBtnInsert: true })
            }
        }
    }

    changeSalesMapping = async (id) => {
        await this.setState({
            company_mapping_kode_sales: id
        })
        if (this.state.company_mapping_kode_customer_inserted !== '' && this.state.company_mapping_kode_sales !== '') {
            this.setState({ isBtnUpdateMapping: false })
        } else {
            this.setState({ isBtnUpdateMapping: true })
        }
    }

    check_kode_customer_mapping = (e) => {
        if (e === '') {
            this.setState({
                validation_mapping_kode_customer: false,
                feedback_mapping_kode_customer: 'Kolom ini wajib diisi', empty_mapping_kode_customer: true, isBtnUpdateMapping: true
            })
        } else {
            this.setState({ empty_mapping_kode_customer: false })
            let check_kode_cust = this.state.allCheckedKodeCust.filter(input_kode_cust => { return input_kode_cust.buyer_number_mapping === e });
            if (check_kode_cust !== '' && check_kode_cust.length === 0) {
                this.setState({ validation_mapping_kode_customer: true, feedback_mapping_kode_customer: '', empty_mapping_kode_customer: false })
                if (this.state.company_mapping_kode_sales !== '') {
                    this.setState({ isBtnUpdateMapping: false })
                }
            } else {
                this.setState({
                    validation_mapping_kode_customer: false, feedback_mapping_kode_customer: 'Kode pelanggan telah digunakan',
                    empty_mapping_kode_customer: true, isBtnUpdateMapping: true
                })
            }
        }
    }

    changeSalesMappingEdited = async (id) => {
        await this.setState({
            company_mapping_kode_sales_selected: id
        })
        if (this.state.company_mapping_kode_customer !== '' && this.state.company_mapping_kode_sales_selected !== '') {
            this.setState({ isBtnUpdateMapping: false })
        } else {
            this.setState({ isBtnUpdateMapping: true })
        }
    }

    check_kode_customer_mapping_selected = (e) => {
        if (e === '') {
            this.setState({
                validation_mapping_kode_customer: false,
                feedback_mapping_kode_customer: 'Kolom ini wajib diisi', empty_mapping_kode_customer: true, isBtnUpdateMapping: true
            })
        } else {
            this.setState({ empty_mapping_kode_customer: false })
            let check_kode_cust = this.state.allCheckedKodeCust.filter(input_kode_cust => { return input_kode_cust.buyer_number_mapping === e });
            if (check_kode_cust !== '' && check_kode_cust.length === 0) {
                this.setState({ validation_mapping_kode_customer: true, feedback_mapping_kode_customer: '', empty_mapping_kode_customer: false })
                if (this.state.company_mapping_kode_sales_selected !== '') {
                    this.setState({ isBtnUpdateMapping: false })
                }
            } else {
                if (e === this.state.pembanding_company_mapping_kode_customer) {
                    this.setState({
                        validation_mapping_kode_customer: true, feedback_mapping_kode_customer: '',
                        empty_mapping_kode_customer: false
                    })
                    if (this.state.company_mapping_kode_sales_selected !== '') {
                        this.setState({ isBtnUpdateMapping: false })
                    }
                } else {
                    this.setState({
                        validation_mapping_kode_customer: false, feedback_mapping_kode_customer: 'Kode pelanggan telah digunakan',
                        empty_mapping_kode_customer: true, isBtnUpdateMapping: true
                    })
                }
            }
        }
    }

    handleModalConfirmMapping = async () => {
        await this.loadCheckingKodeCustomer()
        if (this.state.company_mapping_register_status === 'A') {
            await this.checkCountKodeCustomer(this.state.company_mapping_kode_customer)
            let check_kode_cust = this.state.allCheckedKodeCust.filter(input_kode_cust => {
                return input_kode_cust.buyer_number_mapping === this.state.company_mapping_kode_customer
            });
            if (check_kode_cust !== '' && check_kode_cust.length === 0) {
                if (this.state.company_mapping_kode_customer === this.state.pembanding_company_mapping_kode_customer
                    && Number(this.state.countKodeCustomer) === 1) {
                    this.setState({
                        isOpenConfirmMapping: !this.state.isOpenConfirmMapping
                    })
                } else {
                    if (Number(this.state.countKodeCustomer) > 0) {
                        this.setState({
                            validation_mapping_kode_customer: false, feedback_mapping_kode_customer: 'Kode pelanggan telah digunakan',
                            empty_mapping_kode_customer: true, isBtnUpdateMapping: true
                        })
                    } else {
                        this.setState({
                            isOpenConfirmMapping: !this.state.isOpenConfirmMapping
                        })
                    }
                }
            } else {
                if (this.state.company_mapping_kode_customer === this.state.pembanding_company_mapping_kode_customer
                    && Number(this.state.countKodeCustomer) === 1) {
                    this.setState({
                        isOpenConfirmMapping: !this.state.isOpenConfirmMapping
                    })
                } else {
                    this.setState({
                        validation_mapping_kode_customer: false, feedback_mapping_kode_customer: 'Kode pelanggan telah digunakan',
                        empty_mapping_kode_customer: true, isBtnUpdateMapping: true
                    })
                }
            }
        } else {
            await this.checkCountKodeCustomer(this.state.company_mapping_kode_customer_inserted)
            let check_kode_cust = this.state.allCheckedKodeCust.filter(input_kode_cust => {
                return input_kode_cust.buyer_number_mapping === this.state.company_mapping_kode_customer_inserted
            });
            if (check_kode_cust !== '' && check_kode_cust.length === 0) {
                if (Number(this.state.countKodeCustomer) > 0) {
                    this.setState({
                        validation_mapping_kode_customer: false, feedback_mapping_kode_customer: 'Kode pelanggan telah digunakan',
                        empty_mapping_kode_customer: true, isBtnUpdateMapping: true
                    })
                } else {
                    this.setState({
                        isOpenConfirmMapping: !this.state.isOpenConfirmMapping
                    })
                }
            } else {
                this.setState({
                    validation_mapping_kode_customer: false, feedback_mapping_kode_customer: 'Kode pelanggan telah digunakan',
                    empty_mapping_kode_customer: true, isBtnUpdateMapping: true
                })
            }
        }
    }

    handleModalConfirmAlamatMapping = async () => {
        await this.loadCheckingMappingAlamat()
        await this.checkCountKodeMappingAlamat(this.state.kode_shipto_mapping)

        // let allCheckedKodeAlamat = this.state.allCheckedKodeAlamat[0]

        if (this.state.isConfirmAlamatValid) {
            this.setState({
                isOpenConfirmMappingAlamat: false,
                isConfirmAlamatValid: false
            })
        }
        this.setState({
            isOpenConfirmMappingAlamat: !this.state.isOpenConfirmMappingAlamat,
            isConfirmAlamatValid: true
        })

        // if (this.state.kode_billto_mapping !== allCheckedKodeAlamat.kode_billto_customer &&
        //     this.state.kode_shipto_mapping !== allCheckedKodeAlamat.kode_shipto_customer) {
        //     if (this.state.isConfirmAlamatValid) {
        //         this.setState({
        //             isOpenConfirmMappingAlamat: false,
        //             isConfirmAlamatValid: false
        //         })
        //     }
        //     this.setState({
        //         isOpenConfirmMappingAlamat: !this.state.isOpenConfirmMappingAlamat,
        //         isConfirmAlamatValid: true
        //     })
        // }
        // if (!this.state.kode_billto_mapping || this.state.kode_billto_mapping === allCheckedKodeAlamat.kode_billto_customer) {
        //     this.setState({
        //         validation_kode_billto_mapping: false, feedback_kode_billto_mapping: 'Kode mapping alamat telah digunakan',
        //         empty_kode_billto_mapping: true, isbtnupdatekodemappingalamat: true, isConfirmAlamatValid: false
        //     })
        // }
        // if (!this.state.kode_shipto_mapping || this.state.kode_shipto_mapping === allCheckedKodeAlamat.kode_shipto_customer) {
        //     this.setState({
        //         validation_kode_shipto_mapping: false, feedback_kode_shipto_mapping: 'Kode mapping alamat telah digunakan',
        //         empty_kode_shipto_mapping: true, isbtnupdatekodemappingalamat: true, isConfirmAlamatValid: false
        //     })
        // }

    }

    handleModalInsertAlamatMapping = () => {
        this.setState({
            isConfirmAlamatValid: false
        })
    }

    confirmActionMappingAlamat = async () => {
        Toast.loading('Loading...');
        await this.loadCheckingMappingAlamat()
        await this.checkCountKodeMappingAlamat(this.state.kode_shipto_mapping)
        let passquerymappingalamat = encrypt(`update gcm_listing_alamat set kode_shipto_customer='${this.state.kode_shipto_mapping}', kode_billto_customer='${this.state.kode_billto_mapping}'
            where id=${this.state.id_alamat} returning kode_shipto_customer, kode_billto_customer`)

        if (this.state.isConfirmAlamatValid) {
            const resupdatemappingalamat = await this.props.updateKodeMappingAlamat({ query: passquerymappingalamat }).catch(err => err)
            Toast.hide();
            if (resupdatemappingalamat) {
                swal({
                    title: "Sukses!",
                    text: "Kode mapping alamat tersimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.handleModalDetailAlamat()
                    this.loadAlamatAccount(decrypt(this.state.company_register_id))
                });
            }
            else {
                swal({
                    title: "Gagal!",
                    text: "Tidak ada perubahan disimpan!",
                    icon: "error",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    // window.location.reload()
                });
            }
        }

        await this.checkCountPayment(this.state.id_buyer)
        await this.checkCountAlamatMapped(this.state.id_buyer)
        this.setState({ isConfirmAlamatValid: false })
        if (this.state.checkCountPaymentBuyer > 0 && this.state.checkCountAlamatMapped > 0) {
            this.setState({ isBtnAktifkan: false })
        } else {
            this.setState({ isBtnAktifkan: true })
        }
    }

    checkCountKodeMappingAlamat = async (kode_shipto_mapping) => {
        let passquerycheckingkodealamatmapping = encrypt("select count(gcm_listing_alamat.id) as total from gcm_listing_alamat " +
            "where gcm_listing_alamat.id_seller=" + this.state.company_id +
            " and gcm_listing_alamat.kode_shipto_customer='" + kode_shipto_mapping + "'")
        const resmapkodealamat = await this.props.getDataCheckedKodeAlamatMapping({ query: passquerycheckingkodealamatmapping }).catch(err => err)
        if (resmapkodealamat) {
            await this.setState({
                allCheckedMapAlamat: Number(resmapkodealamat.total)
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

    loadCheckingMappingAlamat = async () => {
        let passquerycheckingkodemappingalamat = encrypt(`
            select a.kode_shipto_customer, a.kode_billto_customer 
            from gcm_listing_alamat a inner join gcm_master_alamat b  
            on a.id_master_alamat = b.id
            where a.id_seller = ${this.state.company_id} and b.flag_active = 'A' and id_buyer=${this.state.id_buyer}
        `)


        const reskodemappingalamat = await this.props.getDataKodeMappingAlamatAPI({ query: passquerycheckingkodemappingalamat }).catch(err => err)
        if (reskodemappingalamat) {
            await this.setState({
                allCheckedKodeAlamat: reskodemappingalamat,
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

    checkCountKodeCustomer = async (buyer_number_mapping) => {
        let passquerycheckingkodecust = encrypt("select count(gcm_company_listing.id) as total from gcm_company_listing " +
            "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_company_listing.buyer_id=" + decrypt(this.state.company_mapping_register_id) +
            " and gcm_company_listing.buyer_number_mapping='" + buyer_number_mapping + "'")
        const resmapkodecust = await this.props.getDataCheckedKodeCust({ query: passquerycheckingkodecust }).catch(err => err)
        if (resmapkodecust) {
            await this.setState({
                countKodeCustomer: Number(resmapkodecust.total)
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

    check_notes_blacklist = (e) => {
        if (e === '') {
            this.setState({ empty_notes_blacklist: true })
        } else {
            this.setState({ empty_notes_blacklist: false })
        }
    }

    check_notes_blacklist_company = (e) => {
        if (e === '') {
            this.setState({ empty_notes_blacklist_company: true })
        } else {
            this.setState({ empty_notes_blacklist_company: false })
        }
    }

    handleModalBlacklist = async () => {
        await this.loadTypeBlackList()
        await this.setState({
            isOpenModalBlacklist: !this.state.isOpenModalBlacklist,
            empty_notes_blacklist_company: false,
            id_blacklist_company: '0',
            notes_blacklist_company: ''
        })
        if (this.state.company_register_status !== 'I') {
            await this.loadSalesHandler(decrypt(this.state.company_register_id))
        }
    }

    handleModalActionUser = async () => {
        if (this.state.is_blacklist === true) {
            if (this.state.id_blacklist === '0') {
                this.setState({
                    isOpenAlertBlackList: !this.state.isOpenAlertBlackList,
                    errormessage: 'Harap pilih jenis daftar hitam!'
                })
            }
            if (this.state.notes_blacklist === '') {
                this.setState({
                    empty_notes_blacklist: true
                })
            }
            if (this.state.id_blacklist !== '0' && this.state.notes_blacklist !== '') {
                this.setState({
                    isOpenConfirmBlackList: !this.state.isOpenConfirmBlackList
                })
            }
        }
        else {
            this.setState({
                isOpenConfirmBlackList: !this.state.isOpenConfirmBlackList
            })
        }
    }

    confirmActionForUser = async () => {
        Toast.loading('Loading...');
        let passqueryupdateuserstatusblacklist = ""
        if (this.state.is_blacklist) {
            passqueryupdateuserstatusblacklist = encrypt("update gcm_master_user set is_blacklist='" + this.state.is_blacklist +
                "', id_blacklist='" + this.state.id_blacklist + "', notes_blacklist='" + this.state.notes_blacklist + "', blacklist_by=" + this.state.company_id +
                ", update_by=" + this.state.id_pengguna_login + ", update_date=now() where id=" + this.state.id_user + " returning update_date;")
        } else {
            passqueryupdateuserstatusblacklist = encrypt("update gcm_master_user set is_blacklist='" + this.state.is_blacklist +
                "', id_blacklist='" + this.state.id_blacklist + "', notes_blacklist='', blacklist_by=null" +
                ", update_by=" + this.state.id_pengguna_login + ", update_date=now() where id=" + this.state.id_user + " returning update_date;")
        }
        const resupdatestatususerblacklist = await this.props.updateUserStatus({ query: passqueryupdateuserstatusblacklist }).catch(err => err)
        Toast.hide();
        if (resupdatestatususerblacklist) {
            this.handleModalConfirmBlackList()
            this.handleModalDetailUser()
        }
        else {
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

    showBlacklistBy = async (id) => {
        let passqueryblacklistcompanybywho = encrypt("select nama_perusahaan from gcm_master_company where id=" + id)
        const showblacklistcompanybywho = await this.props.showBlacklistBy({ query: passqueryblacklistcompanybywho }).catch(err => err)
        if (showblacklistcompanybywho) {
            this.setState({ company_register_blacklist_by: showblacklistcompanybywho.nama_perusahaan })
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

    showBlacklistType = async (id) => {
        let passqueryshowblacklisttye = encrypt("select nama from gcm_master_type_blacklist where id=" + id)
        const showblacklisttype = await this.props.showJenisBlacklist({ query: passqueryshowblacklisttye }).catch(err => err)
        if (showblacklisttype) {
            this.setState({ company_register_jenis_blacklist: showblacklisttype.nama })
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

    handleModalNotes = () => {
        this.setState({
            isOpenNotes: !this.state.isOpenNotes
        })
    }

    handleStatusPayment = () => {
        this.setState({
            isOpenStatusPayment: !this.state.isOpenStatusPayment
        })
    }

    changeStatusPayment = async (e) => {
        if (e === this.state.pembanding_status_payment) {
            await this.setState({ status_payment: e, isbtnupdatepayment: true })
        } else {
            await this.setState({
                status_payment: e,
                isbtnupdatepayment: false
            })
        }
    }

    confirmActionChangeStatusPayment = async () => {
        Toast.loading('Loading...');
        let passquerychangestatuspayment = encrypt("update gcm_payment_listing set status='" + this.state.status_payment + "' " +
            "where id=" + this.state.id_payment + " returning status")
        const resupdatestatuspayment = await this.props.updateStatusPayment({ query: passquerychangestatuspayment }).catch(err => err)
        Toast.hide();
        if (resupdatestatuspayment) {
            swal({
                title: "Sukses!",
                text: "Metode payment berhasil ditambahkan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalDetailPayment()
                this.handleModalConfirmStatusPayment()
                this.loadPayment(this.state.id_buyer)
            });
        }
        else {
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

    handleModalConfirmStatusPayment = () => {
        this.setState({ isOpenConfirmStatusPayment: !this.state.isOpenConfirmStatusPayment })
    }

    loadPaymentNotListed = async (id) => {
        let passquerypaymentnotlisted = ""
        let str_agg = encrypt("select string_agg(cast(payment_id as varchar), ',') " +
            "from gcm_payment_listing where gcm_payment_listing.buyer_id =" + id + " and gcm_payment_listing.seller_id =" + this.state.company_id)
        const res = await this.props.getstragg({ query: str_agg }).catch(err => err)
        if (res) {
            await this.setState({ getstragg: res.str_agg })
            if (this.state.getstragg !== null) {
                passquerypaymentnotlisted = encrypt("select DISTINCT gcm_master_payment.payment_name, gcm_master_payment.deskripsi, " +
                    "gcm_seller_payment_listing.status, gcm_seller_payment_listing.id from gcm_seller_payment_listing " +
                    "left join gcm_master_payment on gcm_master_payment.id = gcm_seller_payment_listing.payment_id " +
                    "left join gcm_payment_listing on gcm_payment_listing.payment_id = gcm_seller_payment_listing.id " +
                    "where gcm_seller_payment_listing.status = 'A' and gcm_seller_payment_listing.seller_id = " + this.state.company_id +
                    " and gcm_seller_payment_listing.id not in (" + res.str_agg + ") ")
            } else {
                passquerypaymentnotlisted = encrypt("select DISTINCT gcm_master_payment.payment_name, gcm_master_payment.deskripsi, " +
                    "gcm_seller_payment_listing.status, gcm_seller_payment_listing.id " +
                    "from gcm_seller_payment_listing " +
                    "inner join gcm_master_payment on gcm_master_payment.id = gcm_seller_payment_listing.payment_id " +
                    "where gcm_seller_payment_listing.status = 'A' and gcm_seller_payment_listing.seller_id = " + this.state.company_id)
            }

            console.log(decrypt(passquerypaymentnotlisted))

            const respaymentnotlisted = await this.props.getDataPaymentAPI({ query: passquerypaymentnotlisted }).catch(err => err)
            if (respaymentnotlisted) {
                this.setState({
                    allPaymentNotListed: respaymentnotlisted
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
    }

    handleModalInsertPayment = () => {
        this.setState({
            isOpenInsertPayment: !this.state.isOpenInsertPayment,
            isBtnInsertPayment: true,
            id_payment_inserted: '',
            deskripsi_payment_inserted: 'Tidak ada deskripsi payment'
        })
    }

    handleModalConfirmInsertPayment = async () => {
        await this.loadCheckingPayment()
        let check_id_payment_registered = this.state.allPaymentChecked.filter(input_id => { return input_id.payment_id === this.state.id_payment_inserted });
        if (check_id_payment_registered !== '' && check_id_payment_registered.length === 0) {
            this.setState({ isOpenConfirmInsertPayment: !this.state.isOpenConfirmInsertPayment })
        } else {
            swal({
                title: "Kesalahan!",
                text: "Metode payment telah terdaftar",
                icon: "info",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                window.location.reload()
            });
        }
    }

    loadCheckingPayment = async () => {
        let passqueryidpayment = encrypt("select gcm_payment_listing.payment_id from gcm_payment_listing where seller_id=" +
            this.state.company_id + " and buyer_id=" + this.state.id_buyer)
        const residpaymentchecked = await this.props.getDataCheckedIdPayment({ query: passqueryidpayment }).catch(err => err)
        if (residpaymentchecked) {
            this.setState({
                allPaymentChecked: residpaymentchecked
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

    confirmActionInsertPayment = async () => {
        Toast.loading('Loading...');
        let passqueryinsertpayment = encrypt("insert into gcm_payment_listing (seller_id, buyer_id, payment_id, status) " +
            "values ('" + this.state.company_id + "', '" + this.state.id_buyer + "', '" + this.state.id_payment_inserted + "', 'A') returning status;")
        const resinsertpayment = await this.props.insertPaymentListingSeller({ query: passqueryinsertpayment }).catch(err => err)
        Toast.hide();
        if (resinsertpayment) {
            swal({
                title: "Sukses!",
                text: "Metode payment berhasil ditambahkan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.setState({ isOpenConfirmInsertPayment: !this.state.isOpenConfirmInsertPayment })
                this.handleModalInsertPayment()
                this.loadPayment(this.state.id_buyer)
            });
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
        await this.checkCountPayment(this.state.id_buyer)
        await this.checkCountAlamatMapped(this.state.id_buyer)
        if (this.state.checkCountPaymentBuyer > 0 && this.state.checkCountAlamatMapped > 0) {
            this.setState({ isBtnAktifkan: false })
        } else {
            this.setState({ isBtnAktifkan: true })
        }
    }

    confirmActionMapping = async () => {
        Toast.loading('Loading...');
        let company_reg_id = decrypt(this.state.company_mapping_register_id)
        let passqueryupdatestatus = ""
        if (this.state.company_mapping_register_status === 'A') {
            passqueryupdatestatus = encrypt(
                "with new_order as (" +
                "update gcm_company_listing set update_date=now(), buyer_number_mapping='" + this.state.company_mapping_kode_customer +
                "', seller_number_mapping='" + this.state.id_company_registered + "' where buyer_id=" + company_reg_id +
                " and seller_id=" + this.state.company_id + " returning status) " +
                "update gcm_company_listing_sales set id_sales='" + this.state.company_mapping_kode_sales_selected + "' " +
                "where buyer_id='" + company_reg_id + "' and seller_id='" + this.state.company_id + "' returning status;")
        } else {
            passqueryupdatestatus = encrypt(
                "with new_order as (" +
                "update gcm_company_listing set update_date=now(), buyer_number_mapping='" + this.state.company_mapping_kode_customer_inserted +
                "', seller_number_mapping='" + this.state.id_company_registered + "' where buyer_id=" + company_reg_id +
                " and seller_id=" + this.state.company_id + " returning status) " +
                "insert into gcm_company_listing_sales (buyer_id, seller_id, id_sales, status) values ('" +
                company_reg_id + "', '" + this.state.company_id + "', '" + this.state.company_mapping_kode_sales_inserted + "', 'A') returning status;")
        }
        const resupdatestatus = await this.props.updateUserStatus({ query: passqueryupdatestatus }).catch(err => err)
        Toast.hide();
        if (resupdatestatus) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalConfirmMapping()
                this.handleModalDetailMapping()
                this.loadDataUsers()
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
    }

    handleModalAttentionStatusInactive = () => {
        this.setState({ isOpenAttentionStatusInactive: !this.state.isOpenAttentionStatusInactive })
    }

    handleOpenModalDokumen = () => {
        if (!this.state.is_listing_dokumen) {
            window.open(this.state.company_register_dokumen, '_blank');
        } else {
            this.setState({
                isOpenModalDokumen: !this.state.isOpenModalDokumen
            })
        }
    }

    downloadDokumen = async (e) => {
        window.open(e.target.value, '_blank');
    }

    render() {

        const statusFilter = this.state.statusFilter
        const data = {
            columns: [
                {
                    label: 'Nama Perusahaan',
                    field: 'nama_perusahaan',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Tipe Bisnis',
                    field: 'tipe_bisnis',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Tanggal Registrasi',
                    field: 'create_date',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Status Perusahaan',
                    field: 'status',
                    width: 150
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    sort: 'asc',
                    width: 150
                }],
            rows: (statusFilter) ? this.state.allfilteredDataUser : this.state.allDataUser
        }
        const dataRegistered = {
            columns: [
                {
                    label: 'Nama Akun',
                    field: 'username',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Nama Lengkap',
                    field: 'nama',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Peran',
                    field: 'role',
                    width: 50
                },
                {
                    label: 'Status Akun',
                    field: 'status',
                    width: 70
                }
                // ,
                // {
                //     label: 'Keterangan',
                //     field: 'keterangan',
                //     width: 100
                // }
            ],
            rows: this.state.allRegisteredUser
        }
        const dataAlamat = {
            columns: [
                {
                    label: 'Alamat Perusahaan',
                    field: 'alamat',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Telepon',
                    field: 'no_telp',
                    width: 50
                },
                {
                    label: 'Pengiriman',
                    field: 'status_shipto',
                    sort: 'asc',
                    width: 30
                },
                {
                    label: 'Penagihan',
                    field: 'status_billto',
                    width: 30
                },
                {
                    label: 'Kode Mapping Alamat Pengiriman',
                    field: 'kode_shipto_customer',
                    width: 100
                },
                {
                    label: 'Kode Mapping Alamat Penagihan',
                    field: 'kode_billto_customer',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 30
                }],
            rows: this.state.allAlamat
        }
        const dataAlamatBySales = {
            columns: [
                {
                    label: 'Alamat Perusahaan',
                    field: 'alamat',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Telepon',
                    field: 'no_telp',
                    width: 50
                },
                {
                    label: 'Pengiriman',
                    field: 'status_shipto',
                    sort: 'asc',
                    width: 30
                },
                {
                    label: 'Penagihan',
                    field: 'status_billto',
                    width: 30
                },
                {
                    label: 'Kode Mapping Alamat Pengiriman',
                    field: 'kode_shipto_customer',
                    width: 100
                },
                {
                    label: 'Kode Mapping Alamat Penagihan',
                    field: 'kode_billto_customer',
                    width: 100
                },],
            rows: this.state.allAlamat
        }
        const dataPaymentListing = {
            columns: [
                {
                    label: 'Nama Payment',
                    field: 'payment_name',
                    sort: 'asc',
                    width: 100
                },
                // {
                //     label: 'Deskripsi',
                //     field: 'deskripsi',
                //     width: 100
                // },
                {
                    label: 'Status Payment',
                    field: 'status',
                    sort: 'asc',
                    width: 30
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    sort: 'asc',
                    width: 150
                }],
            rows: this.state.allPaymentListing
        }

        const dataDokumen = {
            columns: [
                {
                    label: 'Tipe Dokumen',
                    field: 'tipe',
                },
                {
                    label: 'Aksi',
                    field: 'aksi',
                }
            ],
            rows: this.state.company_register_dokumen
        }

        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-users icon-gradient bg-mean-fruit"></i>
                                </div>
                                <div>Manajemen Pembeli
                                    <div className="page-title-subheading">Daftar perusahaan yang terdaftar sebagai konsumen pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                <ButtonDropdown direction="left" isOpen={this.state.isOpenFilter} toggle={this.handleFilter}>
                                    <DropdownToggle caret color={this.state.selectedFilter === 'Semua' ? "primary" :
                                        this.state.selectedFilter === 'Aktif' ? "success" :
                                            this.state.selectedFilter === 'Belum Aktif' ? "secondary" : "danger"} title="Filter berdasarkan status">
                                        <i className="fa fa-fw" aria-hidden="true"></i>
                                            &nbsp;&nbsp;{this.state.selectedFilter}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => this.filterData('S')}>Semua</DropdownItem>
                                        <DropdownItem onClick={() => this.filterData('A')}>Aktif</DropdownItem>
                                        <DropdownItem onClick={() => this.filterData('I')}>Belum Aktif</DropdownItem>
                                        <DropdownItem onClick={() => this.filterData('R')}>Nonaktif</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <div className="card-content" style={{ padding: '2%' }}>
                                    <MDBDataTable
                                        bordered
                                        striped
                                        responsive
                                        hover
                                        data={data}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal PopUp */}
                <Modal size="xl" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>
                        Detail Perusahaan {this.state.company_register_is_blacklist === true ? <i data-toggle="tooltip" data-placement="right" title="Tampilkan notes perusahaan"><ErrorOutlineIcon onClick={this.handleModalNotes}> </ErrorOutlineIcon></i> : false}
                    </ModalHeader>
                    <ModalBody>
                        <div className="card-header card-header-tab-animation">
                            <ul className="nav nav-justified">
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-0" className="active nav-link">Informasi Perusahaan</a></li>
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-1" className="nav-link">Akun Terdaftar</a></li>
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-2" className="nav-link">Informasi Payment Perusahaan</a></li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content">
                                <div className="tab-pane active" id="tab-eg115-0" role="tabpanel">
                                    {
                                        (this.state.sa_role === 'admin') ?
                                            <div className="alert alert-danger fade show" role="alert">Harap perhatikan kode mapping alamat pada tabel alamat perusahaan dan metode payment pada tab Informasi Payment Perusahaan!</div>
                                            : null
                                    }
                                    <div style={{ marginTop: '3%' }} className="row">
                                        <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Perusahaan</p>
                                            <p className="mb-0"> {this.state.company_register_name}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Tipe Bisnis Perusahaan</p>
                                            <p className="mb-0"> {this.state.company_register_tipe_bisnis}</p>
                                            {/* <p className="mb-0" style={{fontWeight:'bold'}}> Alamat Perusahaan</p>
                                            <p className="mb-0"> {this.state.company_register_alamat}</p>
                                            <p className="mb-0"> {this.state.company_register_kota}</p>
                                            <p className="mb-0"> {this.state.company_register_provinsi} {this.state.company_register_kodepos}</p> */}
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Email Perusahaan</p>
                                            <p className="mb-0"> {this.state.company_register_email}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Telepon Perusahaan</p>
                                            <p className="mb-0"> {this.state.company_register_phone}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Perusahaan</p>
                                            <p className="mb-0"> {this.state.company_register_status === 'A' ? 'Aktif' :
                                                this.state.company_register_status === 'R' ? 'Nonaktif' : 'Belum Aktif'}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Registrasi</p>
                                            <p className="mb-0"> {this.state.company_register_date}</p>
                                        </div>
                                        <div style={{ width: '50%', float: 'right', paddingLeft: '3%' }}>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Pelanggan</p>
                                            <p className="mb-0"> {(this.state.kode_customer_selected !== '' && this.state.kode_customer_selected !== null ? this.state.kode_customer_selected : 'Belum ditentukan')}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Sales Distributor</p>
                                            <p className="mb-0"> {(this.state.show_kode_sales_selected !== '' && this.state.show_kode_sales_selected !== null ? this.state.show_kode_sales_selected : 'Belum ditentukan')}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nomor NPWP</p>
                                            <p className="mb-0"> {this.state.company_register_npwp}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nomor SIUP</p>
                                            <p className="mb-0"> {this.state.company_register_siup}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Jumlah Akun Terdaftar</p>
                                            <p className="mb-0"> {this.state.company_register_jml_akun} akun</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Dokumen Pelengkap</p>
                                            <p className="mb-0" style={{ cursor: 'pointer' }} onClick={this.handleOpenModalDokumen}><i className="pe-7s-download"></i> Unduh</p>
                                        </div>

                                        {/* Modal Dokumen Pelengkap */}
                                        <Modal size="md" toggle={this.handleOpenModalDokumen} isOpen={this.state.isOpenModalDokumen} backdrop="static" keyboard={false}>
                                            <ModalHeader toggle={this.handleOpenModalDokumen}>Dokumen Pelengkap</ModalHeader>
                                            <ModalBody>
                                                <MDBDataTable
                                                    bordered
                                                    striped
                                                    responsive
                                                    hover
                                                    data={dataDokumen}
                                                />
                                            </ModalBody>
                                        </Modal>
                                    </div>
                                    <div style={{ marginTop: '3%' }} className="row">
                                        <div style={{ width: '100%', paddingLeft: '3%' }}>
                                            {
                                                (this.state.sa_role === 'admin') ?
                                                    <MDBDataTable
                                                        bordered
                                                        striped
                                                        responsive
                                                        data={dataAlamat}
                                                    />
                                                    : <MDBDataTable
                                                        bordered
                                                        striped
                                                        responsive
                                                        data={dataAlamatBySales}
                                                    />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-eg115-1" role="tabpanel">
                                    <div style={{ marginTop: '3%' }}>
                                        <MDBDataTable
                                            // scrollY
                                            // maxHeight="5vh"
                                            striped
                                            bordered
                                            responsive
                                            small
                                            data={dataRegistered}
                                        />
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-eg115-2" role="tabpanel">
                                    <div style={{ marginTop: '3%' }}>
                                        <div style={{ textAlign: "right" }}>
                                            {
                                                (this.state.sa_role === 'admin') ?
                                                    <button className="sm-2 mr-2 btn btn-primary" title="Tambah metode payment" onClick={this.handleModalInsertPayment}>
                                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                                    </button>
                                                    : false

                                            }
                                        </div>
                                        <MDBDataTable
                                            // scrollY
                                            // maxHeight="5vh"
                                            striped
                                            bordered
                                            responsive
                                            small
                                            data={dataPaymentListing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    {
                        (this.state.company_register_status === 'A' && this.state.sa_role === 'admin') ?
                            (<ModalFooter>
                                <Button color="danger" onClick={this.handleModalBlacklist}>Nonaktifkan</Button>
                                <Button color="secondary" onClick={this.handleModalDetail}>Batal</Button>
                            </ModalFooter>)
                            : (this.state.company_register_status === 'I' && this.state.sa_role === 'admin') ?
                                (<ModalFooter>
                                    <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnAktifkan}>Aktifkan</Button>
                                    <Button color="secondary" onClick={this.handleModalDetail}>Batal</Button>
                                </ModalFooter>)
                                : (this.state.company_register_status === 'R' && this.state.sa_role === 'admin') ?
                                    (<ModalFooter>
                                        <Button color="primary" onClick={this.handleModalConfirm}>Aktifkan</Button>
                                        <Button color="secondary" onClick={this.handleModalDetail}>Batal</Button>
                                    </ModalFooter>)
                                    : null
                    }
                </Modal>

                {/* Modal Confirm */}
                <Modal size="md" toggle={this.handleModalConfirm} isOpen={this.state.isOpenConfirm} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirm}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>
                                {(this.state.company_register_status) === 'A' ? 'Nonaktifkan perusahaan?' : 'Aktifkan perusahaan ini?'}
                            </label>
                        </div>
                        {(this.state.company_register_status === 'R') ?
                            <div className="alert alert-danger fade show" role="alert">
                                <center>
                                    Kode pelanggan dan kode sales distributor di bawah ini merupakan data yang telah tersimpan sebelumnya.<br></br>
                                    Harap periksa dan teliti kembali sebelum melakukan aktivasi.
                                </center>
                            </div>
                            : null}
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Kode Pelanggan</p>
                            {
                                (this.state.company_register_status) === 'A' ?
                                    <Input type="text" name="kode_customer_selected" id="kode_customer_selected"
                                        value={this.state.kode_customer_selected}
                                        disabled={true} />
                                    : (this.state.company_register_status) === 'R' ?
                                        <Input type="text" name="kode_customer_selected" id="kode_customer_selected"
                                            value={this.state.kode_customer_selected}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_kode_customer}
                                            invalid={this.state.empty_kode_customer} />
                                        : <Input type="text" name="kode_customer" id="kode_customer"
                                            value={this.state.kode_customer}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            valid={this.state.validation_kode_customer}
                                            invalid={this.state.empty_kode_customer} />
                            }
                            <FormFeedback>{this.state.feedback_kode_customer}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Kode Sales Distributor</p>
                            {
                                (this.state.company_register_status) === 'A' ?
                                    <Input type="text" name="show_kode_sales_selected" id="show_kode_sales_selected"
                                        value={this.state.show_kode_sales_selected}
                                        disabled>
                                    </Input>
                                    : (this.state.company_register_status) === 'R' ?
                                        <Input type="select" name="kode_sales_selected" id="kode_sales_selected"
                                            value={this.state.kode_sales_selected}
                                            onChange={this.handleChange}
                                        >
                                            <option value="" disabled selected hidden>Pilih sales</option>
                                            {
                                                this.state.allCategory.map(allCategory => {
                                                    return <option value={allCategory.id}>{allCategory.kode_sales} | {allCategory.nama}</option>
                                                })
                                            }
                                        </Input>
                                        : <Input type="select" name="kode_sales" id="kode_sales"
                                            value={this.state.kode_sales}
                                            onChange={this.handleChange}
                                        >
                                            <option value="" disabled selected hidden>Pilih sales</option>
                                            {
                                                this.state.allCategory.map(allCategory => {
                                                    return <option value={allCategory.id} key={allCategory.id}>{allCategory.kode_sales} | {allCategory.nama}</option>
                                                })
                                            }
                                        </Input>
                            }
                        </FormGroup>
                    </ModalBody>
                    {
                        (this.state.company_register_status === 'A') ?
                            <ModalFooter>
                                <Button color="danger" onClick={this.confirmAction}>Nonaktifkan</Button>
                                <Button color="secondary" onClick={this.handleModalConfirm}>Batal</Button>
                            </ModalFooter>
                            : (this.state.company_register_status === 'R') ?
                                <ModalFooter>
                                    <Button color="primary" onClick={this.confirmAction} disabled=
                                        {(this.state.kode_customer_selected !== '' && this.state.kode_sales_selected !== '') ? false : "disabled"}>Aktifkan</Button>
                                    <Button color="secondary" onClick={this.handleModalConfirm}>Batal</Button>
                                </ModalFooter>
                                : <ModalFooter>
                                    <Button color="primary" onClick={this.confirmAction} disabled={this.state.isBtnInsert}>Aktifkan</Button>
                                    <Button color="secondary" onClick={this.handleModalConfirm}>Batal</Button>
                                </ModalFooter>
                    }
                </Modal>

                {/* Modal Detailed User */}
                <Modal size="md" toggle={this.handleModalDetailUser} isOpen={this.state.isOpenDetailUser} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailUser}>Detail Akun Pembeli</ModalHeader>
                    <ModalBody>
                        <div style={{ marginTop: '3%' }}>
                            <div style={{ width: '50%', float: 'left', paddingRight: '3%' }}>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Lengkap</p>
                                <p className="mb-0">{this.state.nama_user}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nomor KTP</p>
                                <p className="mb-0">{this.state.no_ktp_user}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Email</p>
                                <p className="mb-0">{this.state.email_user}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Telepon</p>
                                <p className="mb-0">{this.state.no_hp_user}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Akun</p>
                                <p className="mb-0">{this.state.username_user}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Peran</p>
                                <p className="mb-0">{this.state.role_user}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Status Akun</p>
                                <p className="mb-0">{this.state.status_user === 'A' ? 'Aktif' : 'Nonaktif'}</p>
                            </div>
                            <div style={{ width: '50%', float: 'right' }}>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Status Blacklist</p>
                                {
                                    <ButtonDropdown isOpen={this.state.isOpenDropdownStatusBlackList}
                                        toggle=
                                        {
                                            (this.state.is_blacklist === true && this.state.blacklist_by === this.state.company_id && this.state.blacklist_by !== null) ?
                                                this.handleStatusBlackList
                                                : (this.state.is_blacklist === false && this.state.blacklist_by !== this.state.company_id && this.state.blacklist_by !== null) ?
                                                    this.handleStatusBlackList
                                                    : (this.state.blacklist_by === null) ?
                                                        this.handleStatusBlackList
                                                        : (this.state.is_blacklist === false && this.state.blacklist_by === this.state.company_id) ?
                                                            this.handleStatusBlackList
                                                            : (this.state.is_blacklist === true && this.state.blacklist_by === this.state.company_id) ?
                                                                this.handleStatusBlackList
                                                                : !this.handleStatusBlackList
                                        }>
                                        <DropdownToggle caret color={this.state.is_blacklist === true ? "danger" : "success"}>
                                            {this.state.is_blacklist === true ? 'Aktif' : 'Nonaktif'}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => this.changeStatusBlackList(true)}>Aktif</DropdownItem>
                                            <DropdownItem onClick={() => this.changeStatusBlackList(false)}>Nonaktif</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                }
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Jenis Blacklist</p>
                                {
                                    (this.state.is_blacklist === true) ?
                                        <ButtonDropdown isOpen={this.state.isOpenDropdownTypeBlackList}
                                            toggle=
                                            {((this.state.blacklist_by === this.state.company_id) || this.state.blacklist_by === null) ? this.handleDropDownTypeBlackList : false}>
                                            <DropdownToggle caret color="light" title="Jenis blacklist">
                                                {this.state.nama_jenis_blacklist === null ? 'Pilih jenis blacklist' : this.state.nama_jenis_blacklist}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem disabled> Pilih jenis blacklist</DropdownItem>
                                                {
                                                    this.state.alltypeBlackList.map(alltypeBlackList => {
                                                        return <DropdownItem onClick={() => this.populateTypeBlackList(alltypeBlackList.id, alltypeBlackList.nama)}>
                                                            {alltypeBlackList.nama}</DropdownItem>
                                                    })
                                                }
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                        :
                                        <DropdownToggle caret color="light" title="Jenis blacklist" disabled>Pilih jenis blacklist
                                        </DropdownToggle>
                                }
                                <p className="mb-0" style={{ fontWeight: 'bold', display: (this.state.blacklist_by === '0' || this.state.blacklist_by === null) ? 'none' : false }}>Blacklist Oleh</p>
                                <p className="mb-0" style={{ display: (this.state.blacklist_by === '0' || this.state.blacklist_by === null) ? 'none' : false }}>{this.state.company_blacklist_by}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Deskripsi Blacklist</p>
                                <Input type="textarea" name="notes_blacklist" maxLength="50" rows="2" value={this.state.notes_blacklist}
                                    disabled={((this.state.blacklist_by === this.state.company_id) || (this.state.blacklist_by === null)) ? false : "disabled"}
                                    onChange={(((this.state.blacklist_by === this.state.company_id) || (this.state.blacklist_by === null)) && this.state.id_blacklist !== '0' && this.state.is_blacklist === true) ? this.handleChange : false}
                                    onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_notes_blacklist} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </div>
                        </div>
                    </ModalBody>
                    {
                        ((this.state.blacklist_by === this.state.company_id && this.state.is_blacklist === true) ||
                            (this.state.blacklist_by === this.state.company_id && this.state.is_blacklist === false) ||
                            (this.state.is_blacklist === true && this.state.blacklist_by === null)) ?
                            <ModalFooter>
                                <Button color="primary" onClick={this.handleModalActionUser} disabled={(this.state.id_blacklist !== '0' && this.state.notes_blacklist !== '') ? false : "disabled"}>Konfirmasi</Button>
                                <Button color="secondary" onClick={this.handleModalDetailUser}>Batal</Button>
                            </ModalFooter>
                            : false
                    }
                </Modal>

                {/* Modal Handle BlackList */}
                <Modal size="sm" toggle={this.handleModalAlertBlackList} isOpen={this.state.isOpenAlertBlackList} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAlertBlackList}>Peringatan!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>{this.state.errormessage}</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Confirm BlackList*/}
                <Modal size="sm" toggle={this.handleModalConfirmBlackList} isOpen={this.state.isOpenConfirmBlackList} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmBlackList}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Simpan perubahan ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionForUser}>Konfirmasi</Button>
                        <Button color="secondary" onClick={this.handleModalConfirmBlackList}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal BlackList By Company */}
                <Modal size="md" toggle={this.handleModalBlacklist} isOpen={this.state.isOpenModalBlacklist} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalBlacklist}>Alasan Nonaktif</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Jenis Alasan Nonaktif</p>
                            <ButtonDropdown isOpen={this.state.isOpenDropdownTypeBlackList}
                                toggle={this.handleDropDownTypeBlackList}>
                                <DropdownToggle caret color="light" title="Jenis alasan nonaktif">
                                    {(this.state.id_blacklist_company === '0') ? 'Pilih jenis alasan nonaktif' : this.state.nama_jenis_blacklist_company}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem disabled> Pilih jenis alasan nonaktif </DropdownItem>
                                    {
                                        this.state.alltypeBlackList.map(alltypeBlackList => {
                                            return <DropdownItem onClick={() => this.populateTypeBlackListCompany(alltypeBlackList.id, alltypeBlackList.nama)}>
                                                {alltypeBlackList.nama}</DropdownItem>
                                        })
                                    }
                                </DropdownMenu>
                            </ButtonDropdown>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Tuliskan Alasan Nonaktif</p>
                            <Input type="textarea" name="notes_blacklist_company" maxLength="50" rows="2"
                                disabled={this.state.id_blacklist_company === '0' ? "disabled" : false}
                                onChange={this.state.id_blacklist_company === '0' ? false : this.handleChange}
                                onKeyPress={this.handleWhiteSpace}
                                invalid={this.state.empty_notes_blacklist_company} />
                            <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.handleModalConfirm('Blacklist')} disabled={(this.state.id_blacklist_company !== '0' && this.state.notes_blacklist_company !== '') ? false : true}>Nonaktifkan</Button>
                        <Button color="secondary" onClick={this.handleModalBlacklist}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Notes */}
                <Modal size="sm" toggle={this.handleModalNotes} isOpen={this.state.isOpenNotes} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalNotes}>Notes Perusahaan</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Dinonaktifkan Oleh</p>
                            <p className="mb-0">{this.state.company_register_blacklist_by}</p>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Jenis Alasan Nonaktif</p>
                            <p className="mb-0">{this.state.company_register_jenis_blacklist}</p>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Alasan Nonaktif</p>
                            <p className="mb-0">{this.state.company_register_notes_blacklist_company}</p>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Detailed Payment */}
                <Modal size="md" toggle={this.handleModalDetailPayment} isOpen={this.state.isOpenDetailPayment} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailPayment}>{(this.state.sa_role === 'admin') ? 'Edit Informasi Payment' : 'Detail Informasi Payment'}
                    </ModalHeader>
                    <ModalBody>
                        {/* <div className="position-relative form-group" style={{marginTop:'3%'}}> */}
                        <div style={{ marginTop: '3%' }} className="row">
                            <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Payment</p>
                                <p className="mb-0"> {this.state.nama_payment}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Payment</p>
                                {
                                    (this.state.sa_role === 'admin') ?
                                        <ButtonDropdown isOpen={this.state.isOpenStatusPayment} toggle={this.handleStatusPayment}>
                                            <DropdownToggle caret color={this.state.status_payment === 'A' ? "success" : "danger"}>
                                                {this.state.status_payment === 'A' ? 'Aktif' : 'Nonaktif'}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => this.changeStatusPayment('A')}>Aktif</DropdownItem>
                                                <DropdownItem onClick={() => this.changeStatusPayment('I')}>Nonaktif</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                        : <div className={this.state.status_payment === 'A' ? 'mb-2 mr-2 badge badge-success' : this.state.status_payment === 'I' ?
                                            'mb-2 mr-2 badge badge-danger' : 'mb-2 mr-2 badge badge-danger'}>
                                            {this.state.status_payment === 'A' ? 'Aktif' : 'Nonaktif'}</div>
                                }
                            </div>
                            <div style={{ width: '50%', float: 'right', paddingLeft: '3%', paddingRight: '3%' }}>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Deskripsi Payment</p>
                                <p className="mb-0"> {this.state.deskripsi_payment}</p>
                            </div>
                        </div>
                    </ModalBody>
                    {
                        (this.state.sa_role === 'admin') ?
                            <ModalFooter>
                                <Button color="primary" onClick={this.handleModalConfirmStatusPayment} disabled={this.state.isbtnupdatepayment}>Konfirmasi</Button>
                                <Button color="danger" onClick={this.handleModalDetailPayment}>Batal</Button>
                            </ModalFooter>
                            : null
                    }
                </Modal>

                {/* Modal Confirm Status Payment*/}
                <Modal size="sm" toggle={this.handleModalConfirmStatusPayment} isOpen={this.state.isOpenConfirmStatusPayment} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmStatusPayment}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Simpan perubahan ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionChangeStatusPayment}>Konfirmasi</Button>
                        <Button color="danger" onClick={this.handleModalConfirmStatusPayment}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Insert Payment */}
                <Modal size="md" toggle={this.handleModalInsertPayment} isOpen={this.state.isOpenInsertPayment} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsertPayment}>Tambah Metode Payment</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Payment</p>
                            <Input type="select" name="id_payment_inserted" id="id_payment_inserted"
                                value={this.state.id_payment_inserted}
                                onChange={this.handleChange}>
                                <option value="" disabled selected>Pilih Metode Payment</option>
                                {
                                    this.state.allPaymentNotListed.map((allPaymentNotListed) => {
                                        return <option value={allPaymentNotListed.id}>{allPaymentNotListed.payment_name}</option>
                                    })
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Deskripsi Payment</p>
                            <p className="mb-0">{this.state.deskripsi_payment_inserted}</p>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsertPayment} disabled={this.state.isBtnInsertPayment}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalInsertPayment}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Insert */}
                <Modal size="sm" toggle={this.handleModalConfirmInsertPayment} isOpen={this.state.isOpenConfirmInsertPayment} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsertPayment}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionInsertPayment}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsertPayment}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Mapping */}
                <Modal size="md" toggle={this.handleModalDetailMapping} isOpen={this.state.isOpenMapping} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailMapping}>Detail Mapping Perusahaan</ModalHeader>
                    <ModalBody>
                        {(this.state.company_mapping_register_status === 'I') ?
                            <div className="alert alert-danger fade show" role="alert" style={{ width: '100%', paddingLeft: '3%', paddingRight: '3%' }}>
                                <center>
                                    Perubahan kode pelanggan dan kode sales tidak sekaligus mengaktifkan status perusahaan.<br></br>
                                    Harap lakukan aktivasi dengan klik tombol Lihat Detail.
                                </center>
                            </div>
                            : null}
                        <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Perusahaan</p>
                            <p className="mb-0"> {this.state.company_mapping_register_name}</p>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Tipe Bisnis Perusahaan</p>
                            <p className="mb-0"> {this.state.company_mapping_register_tipe_bisnis}</p>
                        </div>
                        <div style={{ width: '50%', float: 'right', paddingLeft: '3%' }}>
                            {this.state.company_mapping_register_status === 'R' ?
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Kode Sales Distributor</p>
                                : null
                            }
                            {this.state.company_mapping_register_status === 'R' ?
                                <p className="mb-0">{this.state.show_company_mapping_kode_sales}</p>
                                : null}
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Perusahaan</p>
                            <p className="mb-0"> {this.state.company_mapping_register_status === 'A' ? 'Aktif' :
                                this.state.company_mapping_register_status === 'R' ? 'Nonaktif' : 'Belum Aktif'}</p>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Registrasi</p>
                            <p className="mb-0"> {this.state.company_mapping_register_date}</p>
                        </div>
                        <div style={{ width: '100%', paddingLeft: '3%', paddingRight: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Kode Pelanggan</p>
                                {
                                    (this.state.company_mapping_register_status) === 'R' ?
                                        <p className="mb-0"> {this.state.company_mapping_kode_customer}</p>
                                        // <Input type="text" name="company_mapping_kode_customer" id="company_mapping_kode_customer" 
                                        //     value={this.state.company_mapping_kode_customer} 
                                        //     disabled={true}/>
                                        : (this.state.company_mapping_register_status) === 'I' ?
                                            <Input type="text" name="company_mapping_kode_customer_inserted" id="company_mapping_kode_customer_inserted"
                                                value={this.state.company_mapping_kode_customer_inserted}
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                valid={this.state.validation_mapping_kode_customer}
                                                invalid={this.state.empty_mapping_kode_customer} />
                                            : <Input type="text" name="company_mapping_kode_customer" id="company_mapping_kode_customer"
                                                value={this.state.company_mapping_kode_customer}
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                valid={this.state.validation_mapping_kode_customer}
                                                invalid={this.state.empty_mapping_kode_customer} />
                                }
                                <FormFeedback>{this.state.feedback_mapping_kode_customer}</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                {this.state.company_mapping_register_status !== 'R'
                                    ?
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Kode Sales Distributor</p>
                                    : null
                                }
                                {
                                    (this.state.company_mapping_register_status) === 'R' ?
                                        // sini
                                        // <Input type="text" name="show_company_mapping_kode_sales" id="show_company_mapping_kode_sales" 
                                        //     value={this.state.show_company_mapping_kode_sales}
                                        //     disabled>
                                        // </Input>
                                        null
                                        : (this.state.company_mapping_register_status) === 'A' ?
                                            <Input type="select" name="company_mapping_kode_sales_selected" id="company_mapping_kode_sales_selected"
                                                value={this.state.company_mapping_kode_sales_selected}
                                                onChange={this.handleChange}
                                            >
                                                <option value="" disabled selected hidden>Pilih sales</option>
                                                {
                                                    this.state.allCategory.map(allCategory => {
                                                        return <option value={allCategory.id} key={allCategory.id}>{allCategory.kode_sales} | {allCategory.nama}</option>
                                                    })
                                                }
                                            </Input>
                                            : <Input type="select" name="company_mapping_kode_sales_inserted" id="company_mapping_kode_sales_inserted"
                                                value={this.state.company_mapping_kode_sales_inserted}
                                                onChange={this.handleChange}
                                            >
                                                <option value="" disabled selected hidden>Pilih sales</option>
                                                {
                                                    this.state.allCategory.map(allCategory => {
                                                        return <option value={allCategory.id} key={allCategory.id}>{allCategory.kode_sales} | {allCategory.nama}</option>
                                                    })
                                                }
                                            </Input>
                                }
                            </FormGroup>
                        </div>
                    </ModalBody>
                    {
                        (this.state.company_mapping_register_status === 'A') ?
                            <ModalFooter>
                                <Button color="primary" onClick={this.handleModalConfirmMapping} disabled={this.state.isBtnUpdateMapping}>Konfirmasi</Button>
                                <Button color="secondary" onClick={this.handleModalDetailMapping}>Batal</Button>
                            </ModalFooter>
                            : (this.state.company_mapping_register_status === 'R') ?
                                null
                                : <ModalFooter>
                                    <Button color="primary" onClick={this.handleModalConfirmMapping} disabled={this.state.isBtnUpdateMapping}>Konfirmasi</Button>
                                    <Button color="secondary" onClick={this.handleModalDetailMapping}>Batal</Button>
                                </ModalFooter>
                    }
                </Modal>

                {/* Modal Confirm Mapping */}
                <Modal size="sm" toggle={this.handleModalConfirmMapping} isOpen={this.state.isOpenConfirmMapping} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmMapping}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionMapping}>Konfirmasi</Button>
                        <Button color="danger" onClick={this.handleModalConfirmMapping}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Perhatian Status Belum Aktif */}
                <Modal size="sm" toggle={this.handleModalAttentionStatusInactive} isOpen={this.state.isOpenAttentionStatusInactive} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAttentionStatusInactive}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, harap lakukan aktivasi terlebih dahulu dengan klik tombol Lihat Detail.</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Detail Alamat */}
                <Modal size="sm" toggle={this.handleModalDetailAlamat} isOpen={this.state.isOpenDetailAlamat} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailAlamat}>Detail Alamat Perusahaan</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Alamat Perusahaan</p>
                                <p className="mb-0"> {this.state.alamat}</p>
                                <p className="mb-0"> {this.state.kelurahan}, {this.state.kecamatan}</p>
                                <p className="mb-0"> {this.state.kota}, {this.state.provinsi} {this.state.kodepos}</p>
                                <p className="mb-0"> {this.state.no_telp}</p>
                            </FormGroup>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Kode Mapping Alamat Pengiriman</p>
                                <Input type="text" name="kode_shipto_mapping" id="kode_shipto_mapping"
                                    value={this.state.kode_shipto_mapping}
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                    valid={this.state.validation_kode_shipto_mapping}
                                    invalid={this.state.empty_kode_shipto_mapping} />
                                <FormFeedback>{this.state.feedback_kode_shipto_mapping}</FormFeedback>
                                <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '2rem' }}>Kode Mapping Alamat Penagihan</p>
                                <Input type="text" name="kode_billto_mapping" id="kode_billto_mapping"
                                    value={this.state.kode_billto_mapping}
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                    valid={this.state.validation_kode_billto_mapping}
                                    invalid={this.state.empty_kode_billto_mapping} />
                                <FormFeedback>{this.state.feedback_kode_billto_mapping}</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmAlamatMapping}
                            disabled={this.state.isbtnupdatekodemappingalamat}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalDetailAlamat}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Mapping Alamat */}
                <Modal size="sm" toggle={this.handleModalInsertAlamatMapping} isOpen={this.state.isConfirmAlamatValid} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsertAlamatMapping}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionMappingAlamat}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalInsertAlamatMapping}>Batal</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
const reduxState = (state) => ({
    userData: state.userData
})

const reduxDispatch = (dispatch) => ({
    getDataUsersAPI: (data) => dispatch(getDataUsersAPI(data)),
    getDataDetailedMappingAPI: (data) => dispatch(getDataDetailedMappingAPI(data)),
    getDataDetailedUserAPI: (data) => dispatch(getDataDetailedUserAPI(data)),
    getDataDetailedUserRegisteredAPI: (data) => dispatch(getDataDetailedUserRegisteredAPI(data)),
    getDataDetailedPaymentAPI: (data) => dispatch(getDataDetailedPaymentAPI(data)),
    getDataCategoryAPI: (data) => dispatch(getDataCategoryAPI(data)),
    getDataTypeBlackList: (data) => dispatch(getDataTypeBlackList(data)),
    getDataRegisteredAPI: (data) => dispatch(getDataRegisteredAPI(data)),
    getDataPaymentListingAPI: (data) => dispatch(getDataPaymentListingAPI(data)),
    getDataCheckedIdPayment: (data) => dispatch(getDataCheckedIdPayment(data)),
    getDataAlamatAPI: (data) => dispatch(getDataAlamatAPI(data)),
    getDataPaymentAPI: (data) => dispatch(getDataPaymentAPI(data)),
    insertPaymentListingSeller: (data) => dispatch(insertPaymentListingSeller(data)),
    showBlacklistBy: (data) => dispatch(showBlacklistBy(data)),
    showJenisBlacklist: (data) => dispatch(showJenisBlacklist(data)),
    updateStatusPayment: (data) => dispatch(updateStatusPayment(data)),
    updateUserStatus: (data) => dispatch(updateUserStatus(data)),
    getstragg: (data) => dispatch(getstragg(data)),
    getDataCheckedKodeCust: (data) => dispatch(getDataCheckedKodeCust(data)),
    getDataKodeCustAPI: (data) => dispatch(getDataKodeCustAPI(data)),
    getDataDetailedSalesHandlerAPI: (data) => dispatch(getDataDetailedSalesHandlerAPI(data)),
    getDataDetailedKodeCustomerAPI: (data) => dispatch(getDataDetailedKodeCustomerAPI(data)),
    getDataDetailedAlamatMappingAPI: (data) => dispatch(getDataDetailedAlamatMappingAPI(data)),
    getDataKodeMappingAlamatAPI: (data) => dispatch(getDataKodeMappingAlamatAPI(data)),
    updateKodeMappingAlamat: (data) => dispatch(updateKodeMappingAlamat(data)),
    getDataCheckedKodeAlamatMapping: (data) => dispatch(getDataCheckedKodeAlamatMapping(data)),
    totalBeranda: (data) => dispatch(totalBeranda(data)),
    logoutAPI: () => dispatch(logoutUserAPI()),
    sendEmailToUser: (data) => dispatch(sendEmailAktivasi(data)),
    postQuery: (data) => dispatch(postQuery(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentPengguna));
