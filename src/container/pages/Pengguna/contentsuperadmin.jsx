import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { encrypt, decrypt } from '../../../config/lib';
import {
    getDataUsersAPI, getDataDetailedUserSuperAdminAPI, getDataRegisteredAPI, getDataAlamatAPI, getDataTypeBlackList, SA_getDataPaymentListingAPI,
    getDataDetailedPaymentAPI, showBlacklistBy, showJenisBlacklist, updateUserStatus, getCheckingKodeSeller, getDataDetailedKodeSellerAPI,
    getDataDetailedMappingSuperAdminAPI, getDataCheckedKodeSeller, logoutUserAPI, sendEmailAktivasi, SA_updateUserStatus,
    SA_getDataUsersAPI, SA_updateUserStatusMapping
}
    from '../../../config/redux/action';
import { MDBDataTable } from 'mdbreact';
import './Pengguna.css'
import swal from 'sweetalert';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, ButtonDropdown,
    DropdownItem, DropdownMenu, DropdownToggle, Input, FormFeedback, FormGroup
} from 'reactstrap'
import Toast from 'light-toast';

class ContentPenggunaSuperAdmin extends Component {
    state = {
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        allDataUser: [],
        tmpfilteredDataUser: [],
        allfilteredDataUser: [],
        allRegisteredUser: [],
        alltypeBlackList: [],
        allAlamat: [],
        selectedFilter: 'Semua',
        isOpen: false,
        isOpenFilter: false,
        isOpenConfirm: false,
        statusFilter: false,
        company_register_id: '',
        company_register_name: '',
        company_register_status: '',
        company_register_date: '',
        company_register_id_tipe_bisnis: '',
        company_register_tipe_bisnis: '',
        company_register_alamat: '',
        company_register_kota: '',
        company_register_provinsi: '',
        company_register_phone: '',
        company_register_kodepos: '',
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
        id_blacklist_company: '0',
        nama_jenis_blacklist_company: '',
        isOpenModalBlacklist: false,
        isOpenDropdownTypeBlackList: false,
        isOpenAlertBlackList: false,
        isOpenNotes: false,
        empty_notes_blacklist_company: false,
        notes_blacklist_company: '',
        id_payment: '',
        nama_payment: '',
        deskripsi_payment: '',
        status_payment: '',
        kode_seller: '',
        validation_kode_seller: false,
        empty_kode_seller: false,
        feedback_kode_seller: '',
        isBtnConfirmKodeSeller: true,
        kode_seller_selected: '',
        allCheckedKodeSeller: [],
        company_mapping_register_id: '',
        company_mapping_register_name: '',
        company_mapping_register_status: '',
        company_mapping_register_date: '',
        company_mapping_register_tipe_bisnis: '',
        company_mapping_kode_seller: '',
        pembanding_company_mapping_kode_seller: '',
        isOpenAttentionStatusInactive: false,
        isOpenMapping: false,
        company_mapping_kode_seller_inserted: '',
        validation_mapping_kode_seller: false,
        empty_mapping_kode_seller: false,
        countKodeSeller: 0,
        isBtnUpdateMapping: true,
        feedback_mapping_kode_seller: '',
        isOpenConfirmMapping: false,
        allDataPayment: null
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.setState({
            company_id: decrypt(userData.company_id),
            company_name: decrypt(userData.company_name),
            tipe_bisnis: decrypt(userData.tipe_bisnis)
        })
    }

    componentDidMount() {
        this.loadDataUsers()
    }

    loadDataUsers = async () => {
        const res = await this.props.SA_getDataUsersAPI().catch(err => err)
        if (res) {
            res.map((user, index) => {
                return (
                    res[index].keterangan =
                    <center>
                        <div>
                            <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                                onClick={(e) => this.handleDetailUser(e, res[index].id)}>Lihat Detail</button>
                            <button className="mb-2 mr-2 btn btn-primary" title="Edit Kode Perusahaan"
                                onClick={(e) => this.handleDetailMapping(e, res[index].id, res[index].pure_status)}>
                                <i className="fa fa-edit" aria-hidden="true"></i></button>
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

            });
        }
    }

    handleDetailMapping = async (e, id, stat) => {
        if (stat !== 'I') {
            this.handleModalDetailMapping()
            e.stopPropagation();
            const resdetailmapping = await this.props.getDataDetailedMappingSuperAdminAPI({ id: id }).catch(err => err)
            if (resdetailmapping) {
                await this.setState({
                    company_mapping_register_id: resdetailmapping.id,
                    company_mapping_register_name: resdetailmapping.company_name,
                    company_mapping_register_status: decrypt(resdetailmapping.status_perusahaan),
                    company_mapping_register_date: resdetailmapping.create_date,
                    company_mapping_register_tipe_bisnis: resdetailmapping.tipe_bisnis,
                    company_mapping_kode_seller: resdetailmapping.kode_seller,
                    pembanding_company_mapping_kode_seller: resdetailmapping.kode_seller
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
        } else {
            this.handleModalAttentionStatusInactive()
        }
    }

    handleModalAttentionStatusInactive = () => {
        this.setState({ isOpenAttentionStatusInactive: !this.state.isOpenAttentionStatusInactive })
    }

    handleModalDetailMapping = () => {
        this.setState({
            isOpenMapping: !this.state.isOpenMapping,
            company_mapping_kode_seller_inserted: '',
            validation_mapping_kode_seller: false,
            empty_mapping_kode_seller: false,
            countKodeSeller: 0,
            isBtnUpdateMapping: true
        })
        this.loadCheckingKodeSeller()
    }

    loadPayment = async (id) => {
        await this.setState({ id_buyer: id })
        const respayment = await this.props.SA_getDataPaymentListingAPI({ id: id }).catch(err => err)
        if (respayment) {
            const paymentList = respayment.map((user, index) => {
                user.tempStatus = user.status
                user.tempKeterangan = user.keterangan
                user.status =
                    <center>
                        <div className={user.status === 'A' ? 'mb-2 mr-2 badge badge-success' : user.status === 'I' ? 'mb-2 mr-2 badge badge-danger' : user.status === 'C' ? 'mb-2 mr-2 badge badge-primary' : 'mb-2 mr-2 badge badge-warning'}>
                            {user.status === 'A' ? 'Aktif' : user.status === 'I' ? 'Nonaktif' : user.status === 'C' ? 'Proses Konfirmasi' : 'Ditolak'}</div>
                    </center>
                user.keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailPaymentListing(e, respayment[index].id)}>Lihat Detail</button>
                    </center>
                return user
            })
            await this.setState({
                allPaymentListing: paymentList
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

            });
        }
    }

    handleDetailPaymentListing = async (e, id) => {
        this.handleModalDetailPayment()
        e.stopPropagation()

        const filterPayment = this.state.allPaymentListing.filter(d => d.id === id)[0]

        if (filterPayment) {
            await this.setState({
                id_payment: filterPayment.id,
                nama_payment: filterPayment.payment_name,
                deskripsi_payment: filterPayment.deskripsi,
                status_payment: filterPayment.tempStatus
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

            });
        }
    }

    handleModalDetailPayment = async () => {
        await this.setState({
            isOpenDetailPayment: !this.state.isOpenDetailPayment,
            id_payment: '',
            nama_payment: '',
            deskripsi_payment: '',
            status_payment: ''
        })
    }

    handleDetailUser = async (e, id) => {
        this.handleModalDetail()
        e.stopPropagation();
        const resdetail = await this.props.getDataDetailedUserSuperAdminAPI({ id: id }).catch(err => err)
        if (resdetail) {
            this.setState({
                company_register_id: resdetail.id,
                company_register_name: resdetail.company_name,
                company_register_status: decrypt(resdetail.status_perusahaan),
                company_register_date: resdetail.create_date,
                company_register_id_tipe_bisnis: resdetail.id_tipe_bisnis,
                company_register_tipe_bisnis: resdetail.tipe_bisnis,
                company_register_phone: resdetail.telepon,
                company_register_email: resdetail.email,
                company_register_npwp: decrypt(resdetail.npwp),
                company_register_siup: decrypt(resdetail.siup),
                company_register_dokumen: decrypt(resdetail.dokumen),
                company_register_jml_akun: decrypt(resdetail.jml_akun),
                company_register_is_blacklist: resdetail.is_blacklist,
                company_register_id_jenis_blacklist: resdetail.id_blacklist,
                company_register_blacklist_by: resdetail.blacklist_by,
                company_register_notes_blacklist_company: resdetail.notes_blacklist,
                kode_seller_selected: resdetail.kode_seller
            })
            if (this.state.company_register_is_blacklist === true) {
                this.showBlacklistBy(this.state.company_register_blacklist_by)
                this.showBlacklistType(this.state.company_register_id_jenis_blacklist)
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

            });
        }
        this.loadRegisteredAccount(id)
        this.loadAlamatAccount(id)
        this.loadPayment(id)
    }

    loadAlamatAccount = async (id) => {
        const resalamataccount = await this.props.getDataAlamatAPI({ id: id }).catch(err => err)
        if (resalamataccount) {
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

            });
        }
    }

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen
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
        const resregisteredaccount = await this.props.getDataRegisteredAPI({ id: id }).catch(err => err)
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
                    resregisteredaccount[index].sa_role =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.sa_role}</p>
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

            });
        }
    }

    handleModalBlacklist = () => {
        this.loadTypeBlackList()
        this.setState({
            isOpenModalBlacklist: !this.state.isOpenModalBlacklist,
            empty_notes_blacklist_company: false,
            id_blacklist_company: '0',
            notes_blacklist_company: ''
        })
    }

    handleModalConfirm = async (stat) => {
        await this.loadCheckingKodeSeller()
        await this.loadKodeSeller()
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
                kode_seller: '',
                feedback_kode_seller: '',
                validation_kode_seller: false,
                empty_kode_seller: false,
                isBtnConfirmKodeSeller: true,
            })
        }
    }

    loadCheckingKodeSeller = async () => {
        const reskodeseller = await this.props.getCheckingKodeSeller().catch(err => err)
        if (reskodeseller) {
            await this.setState({
                allCheckedKodeSeller: reskodeseller
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

            });
        }
    }

    loadKodeSeller = async () => {
        const reskodeseller = await this.props.getDataDetailedKodeSellerAPI({ id: this.state.company_id }).catch(err => err)
        if (reskodeseller) {
            await this.setState({
                kode_customer_selected: reskodeseller.kode_seller
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

            });
        }
    }

    confirmAction = async () => {
        Toast.loading('Loading...');
        let activate = "A"
        let reject = "R"
        const emailData = {
            sender: "PT.GLOBAL CHEMINDO MEGATRADING",
            receiver: this.state.company_register_name,
            email_receiver: this.state.company_register_email,
            receiver_type: 'seller'
        }

        let company_reg_id = decrypt(this.state.company_register_id)
        if (this.state.company_register_status === activate) {
            const resupdatestatus = await this.props.SA_updateUserStatus({
                seller_status: reject,
                id_blacklist: this.state.id_blacklist_company,
                notes_blacklist: this.state.notes_blacklist_company,
                blacklist_by: this.state.company_id,
                id: company_reg_id,
                status: this.state.company_register_status
            }).catch(err => err)
            Toast.hide()
            if (resupdatestatus) {
                swal({
                    title: "Sukses!",
                    text: "Perubahan disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.handleModalBlacklist()
                    this.handleModalConfirm()
                    this.handleModalDetail()
                    this.loadDataUsers()
                });
            } else {
                swal({
                    title: "Gagal!",
                    text: "Tidak ada perubahan disimpan!",
                    icon: "error",
                    buttons: {
                        confirm: "Oke"
                    }
                })
            }
        } else if (this.state.company_register_status === reject) {
            await this.loadCheckingKodeSeller()
            let check_kode_seller = this.state.allCheckedKodeSeller.filter(input_kode_seller => { return input_kode_seller.kode_seller === this.state.kode_seller_selected });
            if (check_kode_seller !== '' && check_kode_seller.length <= 1) {
                const resupdatestatus = await this.props.SA_updateUserStatus({
                    seller_status: activate,
                    id_blacklist: this.state.id_blacklist_company,
                    notes_blacklist: this.state.notes_blacklist_company,
                    kode_seller: this.state.kode_seller_selected,
                    id: company_reg_id,
                    company_id: this.state.company_id,
                    status: this.state.company_register_status
                }).catch(err => err)
                Toast.hide();
                if (resupdatestatus) {
                    await this.props.sendEmailToUser(emailData)
                    swal({
                        title: "Sukses!",
                        text: "Perubahan disimpan!",
                        icon: "success",
                        button: false,
                        timer: "2500"
                    }).then(() => {
                        this.handleModalConfirm()
                        this.handleModalDetail()
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
                this.setState({ validation_kode_seller: false, feedback_kode_seller: 'Kode perusahaan telah digunakan', empty_kode_seller: true, isBtnConfirmKodeSeller: true })
            }
        } else {
            await this.loadCheckingKodeSeller()
            let check_kode_seller = this.state.allCheckedKodeSeller.filter(input_kode_seller => { return input_kode_seller.kode_seller === this.state.kode_seller });
            if (check_kode_seller !== '' && check_kode_seller.length === 0) {
                const resupdatestatus = await this.props.SA_updateUserStatus({
                    seller_status: activate,
                    id_blacklist: this.state.id_blacklist_company,
                    notes_blacklist: this.state.notes_blacklist_company,
                    kode_seller: this.state.kode_seller_selected,
                    kode_seller_selected: this.state.kode_seller_selected,
                    id: company_reg_id,
                    company_id: this.state.company_id,
                    status: this.state.company_register_status
                }).catch(err => err)
                Toast.hide();
                if (resupdatestatus) {
                    await this.props.sendEmailToUser(emailData)
                    swal({
                        title: "Sukses!",
                        text: "Perubahan disimpan!",
                        icon: "success",
                        button: false,
                        timer: "2500"
                    }).then(() => {
                        this.handleModalConfirm()
                        this.handleModalDetail()
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
                this.setState({ validation_kode_seller: false, feedback_kode_seller: 'Kode perusahaan telah digunakan', empty_kode_seller: true, isBtnConfirmKodeSeller: true })
            }
        }
    }

    handleModalConfirmMapping = async () => {
        await this.loadCheckingKodeSeller()
        if (this.state.company_mapping_register_status === 'A') {
            await this.checkCountKodeSeller(this.state.company_mapping_kode_seller)
            let check_kode_seller = this.state.allCheckedKodeSeller.filter(input_kode_seller => {
                return input_kode_seller.kode_seller === this.state.company_mapping_kode_seller
            });
            if (check_kode_seller !== '' && check_kode_seller.length === 0) {
                if (this.state.company_mapping_kode_seller === this.state.pembanding_company_mapping_kode_seller
                    && Number(this.state.countKodeSeller) === 1) {
                    this.setState({
                        isOpenConfirmMapping: !this.state.isOpenConfirmMapping
                    })
                } else {
                    if (Number(this.state.countKodeSeller) > 0) {
                        this.setState({
                            validation_mapping_kode_seller: false, feedback_mapping_kode_seller: 'Kode perusahaan telah digunakan',
                            empty_mapping_kode_seller: true, isBtnUpdateMapping: true
                        })
                    } else {
                        this.setState({
                            isOpenConfirmMapping: !this.state.isOpenConfirmMapping
                        })
                    }
                }
            } else {
                if (this.state.company_mapping_kode_seller === this.state.pembanding_company_mapping_kode_seller
                    && Number(this.state.countKodeSeller) === 1) {
                    this.setState({
                        isOpenConfirmMapping: !this.state.isOpenConfirmMapping
                    })
                } else {
                    this.setState({
                        validation_mapping_kode_seller: false, feedback_mapping_kode_seller: 'Kode perusahaan telah digunakan',
                        empty_mapping_kode_seller: true, isBtnUpdateMapping: true
                    })
                }
            }
        } else {
            await this.checkCountKodeSeller(this.state.company_mapping_kode_seller_inserted)
            let check_kode_seller = this.state.allCheckedKodeSeller.filter(input_kode_seller => {
                return input_kode_seller.kode_seller === this.state.company_mapping_kode_seller_inserted
            });
            if (check_kode_seller !== '' && check_kode_seller.length === 0) {
                if (Number(this.state.countKodeSeller) > 0) {
                    this.setState({
                        validation_mapping_kode_seller: false, feedback_mapping_kode_seller: 'Kode perusahaan telah digunakan',
                        empty_mapping_kode_seller: true, isBtnUpdateMapping: true
                    })
                } else {
                    this.setState({
                        isOpenConfirmMapping: !this.state.isOpenConfirmMapping
                    })
                }
            } else {
                this.setState({
                    validation_mapping_kode_seller: false, feedback_mapping_kode_seller: 'Kode perusahaan telah digunakan',
                    empty_mapping_kode_seller: true, isBtnUpdateMapping: true
                })
            }
        }
    }

    checkCountKodeSeller = async (kode_seller) => {
        const resmapkodeseller = await this.props.getDataCheckedKodeSeller({ kode_seller: kode_seller }).catch(err => err)
        if (resmapkodeseller) {
            await this.setState({
                countKodeSeller: Number(resmapkodeseller.total)
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

            });
        }
    }

    populateTypeBlackListCompany = (id, nama) => {
        this.setState({
            id_blacklist_company: id,
            nama_jenis_blacklist_company: nama
        })
    }

    loadTypeBlackList = async () => {
        const restypeblacklist = await this.props.getDataTypeBlackList().catch(err => err)
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

            });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'kode_seller') {
            this.check_kode_seller(event.target.value)
        }
        if (event.target.name === 'kode_seller_selected') {
            this.check_kode_seller_selected(event.target.value)
        }
        if (event.target.name === 'company_mapping_kode_seller_inserted') {
            this.check_kode_seller_mapping(event.target.value)
        }
        if (event.target.name === 'company_mapping_kode_seller') {
            this.check_kode_seller_mapping_selected(event.target.value)
        }
    }

    check_kode_seller = (e) => {
        if (e === '') {
            this.setState({ validation_kode_seller: false, feedback_kode_seller: 'Kolom ini wajib diisi', empty_kode_seller: true, isBtnConfirmKodeSeller: true })
        } else {
            this.setState({ empty_kode_seller: false })
            let check_kode_seller = this.state.allCheckedKodeSeller.filter(input_kode_seller => { return input_kode_seller.kode_seller === e });
            if (check_kode_seller !== '' && check_kode_seller.length === 0) {
                this.setState({ validation_kode_seller: true, feedback_kode_seller: '', empty_kode_seller: false })
                if (this.state.kode_seller !== '') {
                    this.setState({ isBtnConfirmKodeSeller: false })
                }
            } else {
                this.setState({ validation_kode_seller: false, feedback_kode_seller: 'Kode perusahaan telah digunakan', empty_kode_seller: true, isBtnConfirmKodeSeller: true })
            }
        }
    }

    check_kode_seller_selected = (e) => {
        if (e === '') {
            this.setState({ validation_kode_seller: false, feedback_kode_seller: 'Kolom ini wajib diisi', empty_kode_seller: true, isBtnConfirmKodeSeller: true })
        } else {
            this.setState({ empty_kode_customer: false })
            let check_kode_seller = this.state.allCheckedKodeSeller.filter(input_kode_seller => { return input_kode_seller.kode_seller === e });
            if (check_kode_seller !== '' && check_kode_seller.length <= 1) {
                this.setState({ validation_kode_seller: true, feedback_kode_seller: '', empty_kode_seller: false })
                if (this.state.kode_seller !== '') {
                    this.setState({ isBtnConfirmKodeSeller: false })
                }
            } else {
                this.setState({ validation_kode_seller: false, feedback_kode_seller: 'Kode perusahaan telah digunakan', empty_kode_seller: true, isBtnConfirmKodeSeller: true })
            }
        }
    }

    check_kode_seller_mapping = (e) => {
        // sini
        if (e === '') {
            this.setState({
                validation_mapping_kode_seller: false,
                feedback_mapping_kode_seller: 'Kolom ini wajib diisi', empty_mapping_kode_seller: true, isBtnUpdateMapping: true
            })
        } else {
            this.setState({ empty_mapping_kode_seller: false })
            let check_kode_seller = this.state.allCheckedKodeSeller.filter(input_kode_seller => { return input_kode_seller.kode_seller === e });
            if (check_kode_seller !== '' && check_kode_seller.length === 0) {
                this.setState({ validation_mapping_kode_seller: true, feedback_mapping_kode_seller: '', empty_mapping_kode_seller: false })
                if (this.state.company_mapping_kode_seller !== '') {
                    this.setState({ isBtnUpdateMapping: false })
                }
            } else {
                this.setState({
                    validation_mapping_kode_seller: false, feedback_mapping_kode_seller: 'Kode perusahaan telah digunakan',
                    empty_mapping_kode_seller: true, isBtnUpdateMapping: true
                })
            }
        }
    }

    check_kode_seller_mapping_selected = (e) => {
        // sini
        if (e === '') {
            this.setState({
                validation_mapping_kode_seller: false,
                feedback_mapping_kode_seller: 'Kolom ini wajib diisi', empty_mapping_kode_seller: true, isBtnUpdateMapping: true
            })
        } else {
            this.setState({ empty_mapping_kode_seller: false })
            let check_kode_seller = this.state.allCheckedKodeSeller.filter(input_kode_seller => { return input_kode_seller.kode_seller === e });
            if (check_kode_seller !== '' && check_kode_seller.length === 0) {
                this.setState({ validation_mapping_kode_seller: true, feedback_mapping_kode_seller: '', empty_mapping_kode_seller: false })
                if (this.state.company_mapping_kode_seller !== '') {
                    this.setState({ isBtnUpdateMapping: false })
                }
            } else {
                if (e === this.state.pembanding_company_mapping_kode_seller) {
                    this.setState({
                        validation_mapping_kode_seller: true, feedback_mapping_kode_seller: '',
                        empty_mapping_kode_seller: false
                    })
                    if (this.state.company_mapping_kode_seller !== '') {
                        this.setState({ isBtnUpdateMapping: false })
                    }
                } else {
                    this.setState({
                        validation_mapping_kode_seller: false, feedback_mapping_kode_seller: 'Kode perusahaan telah digunakan',
                        empty_mapping_kode_seller: true, isBtnUpdateMapping: true
                    })
                }
            }
        }
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

    showBlacklistBy = async (id) => {
        const showblacklistcompanybywho = await this.props.showBlacklistBy({ id: id }).catch(err => err)
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

            });
        }
    }

    showBlacklistType = async (id) => {
        const showblacklisttype = await this.props.showJenisBlacklist({ id: id }).catch(err => err)
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

            });
        }
    }

    handleModalNotes = () => {
        this.setState({
            isOpenNotes: !this.state.isOpenNotes
        })
    }

    handleWhiteSpaceNumber = (e) => {
        if ((e.which === 32 && !e.target.value.length) || e.which === 32) {
            e.preventDefault()
        }
    }

    confirmActionMapping = async () => {
        Toast.loading('Loading...');
        let company_reg_id = decrypt(this.state.company_mapping_register_id)
        let passqueryupdatestatus = ""
        let dataToSubmit
        if (this.state.company_mapping_register_status === 'A') {
            dataToSubmit = {
                kode_seller: this.state.company_mapping_kode_seller,
                id: company_reg_id
            }
        } else {
            dataToSubmit = {
                kode_seller: this.state.company_mapping_kode_seller_inserted,
                id: company_reg_id
            }
        }
        const resupdatestatus = await this.props.SA_updateUserStatusMapping({ ...dataToSubmit }).catch(err => err)
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
                    width: 50
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
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
                    label: 'Nama Pengguna',
                    field: 'username',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Nama Lengkap',
                    field: 'nama',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Peran',
                    field: 'sa_role',
                    width: 50
                },
                {
                    label: 'Status Akun',
                    field: 'status',
                    width: 70
                }],
            rows: this.state.allRegisteredUser
        }
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
                    width: 200
                }],
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
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-users icon-gradient bg-mean-fruit"></i>
                                </div>
                                <div>Manajemen Penjual
                                    <div className="page-title-subheading">Daftar perusahaan yang tercatat sebagai penjual pada {this.state.company_name}
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
                    {/* Modal PopUp */}
                    <Modal size="lg" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
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
                                        <div style={{ marginTop: '3%' }}>
                                            <div className="row">
                                                <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_register_name}</p>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Tipe Bisnis Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_register_tipe_bisnis}</p>
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
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Perusahaan </p>
                                                    <p className="mb-0"> {(this.state.kode_seller_selected !== '' && this.state.kode_seller_selected !== null ? this.state.kode_seller_selected : 'Belum ditentukan')}</p>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nomor NPWP</p>
                                                    <p className="mb-0"> {this.state.company_register_npwp}</p>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nomor SIUP</p>
                                                    <p className="mb-0"> {this.state.company_register_siup}</p>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Jumlah Akun Terdaftar</p>
                                                    <p className="mb-0"> {this.state.company_register_jml_akun} akun</p>
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Dokumen Pelengkap</p>
                                                    <p className="mb-0"> <a href={this.state.company_register_dokumen}><i className="pe-7s-download"></i> Unduh </a></p>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '3%' }} className="row">
                                                <div style={{ width: '100%', paddingLeft: '3%' }}>
                                                    <MDBDataTable
                                                        bordered
                                                        striped
                                                        responsive
                                                        data={dataAlamat}
                                                    />
                                                </div>
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
                                                small
                                                data={dataRegistered}
                                            />
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="tab-eg115-2" role="tabpanel">
                                        <div style={{ marginTop: '3%' }}>
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
                            this.state.company_register_status === 'A' ?
                                (<ModalFooter>
                                    <Button color="danger" onClick={this.handleModalBlacklist}>Nonaktifkan</Button>
                                    <Button color="secondary" onClick={this.handleModalDetail}>Batal</Button>
                                </ModalFooter>)
                                : this.state.company_register_status === 'I' ?
                                    (<ModalFooter>
                                        <Button color="primary" onClick={this.handleModalConfirm}>Aktifkan</Button>
                                        <Button color="secondary" onClick={this.handleModalDetail}>Batal</Button>
                                    </ModalFooter>)
                                    : this.state.company_register_status === 'R' ?
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
                                {(this.state.company_register_status) === 'A' ? 'Nonaktifkan perusahaan?' : 'Aktifkan perusahaan ini?'}
                            </div>
                            {(this.state.company_register_status === 'R') ?
                                <div className="alert alert-danger fade show" role="alert">
                                    <center>
                                        Kode perusahaan di bawah ini merupakan data yang telah tersimpan sebelumnya.<br></br>
                                    Harap periksa dan teliti kembali sebelum melakukan aktivasi.
                                </center>
                                </div>
                                : null}
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Kode Perusahaan</p>
                                {
                                    (this.state.company_register_status) === 'A' ?
                                        <Input type="text" name="kode_seller_selected" id="kode_seller_selected"
                                            value={this.state.kode_seller_selected}
                                            disabled={true} />
                                        : (this.state.company_register_status) === 'R' ?
                                            <Input type="text" name="kode_seller_selected" id="kode_seller_selected"
                                                value={this.state.kode_seller_selected}
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                valid={this.state.validation_kode_seller}
                                                maxLength={7}
                                                invalid={this.state.empty_kode_seller} />
                                            : <Input type="text" name="kode_seller" id="kode_seller"
                                                value={this.state.kode_seller}
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                valid={this.state.validation_kode_seller}
                                                maxLength={7}
                                                invalid={this.state.empty_kode_seller} />
                                }
                                <FormFeedback>{this.state.feedback_kode_seller}</FormFeedback>
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
                                            {(this.state.kode_seller_selected !== '') ? false : true}>Aktifkan</Button>
                                        <Button color="secondary" onClick={this.handleModalConfirm}>Batal</Button>
                                    </ModalFooter>
                                    : <ModalFooter>
                                        <Button color="primary" onClick={this.confirmAction} disabled={this.state.isBtnConfirmKodeSeller}>Aktifkan</Button>
                                        <Button color="secondary" onClick={this.handleModalConfirm}>Batal</Button>
                                    </ModalFooter>
                        }
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
                                    onChange={this.handleChange}
                                    invalid={this.state.empty_notes_blacklist_company} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={() => this.handleModalConfirm('Blacklist')}
                                disabled={(this.state.id_blacklist_company !== '0' && this.state.notes_blacklist_company !== '') ?
                                    false : true}>Nonaktifkan</Button>
                            <Button color="secondary" onClick={this.handleModalBlacklist}>Batal</Button>
                        </ModalFooter>
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
                                    <div className={this.state.status_payment === 'A' ? 'mb-2 mr-2 badge badge-success' : this.state.status_payment === 'I' ?
                                        'mb-2 mr-2 badge badge-danger' : this.state.status_payment === 'C' ? 'mb-2 mr-2 badge badge-primary' : 'mb-2 mr-2 badge badge-warning'}>
                                        {this.state.status_payment === 'A' ? 'Aktif' : this.state.status_payment === 'I' ? 'Nonaktif' : this.state.status_payment === 'C' ? 'Proses Konfirmasi' : 'Ditolak'}</div>
                                </div>
                                <div style={{ width: '50%', float: 'right', paddingLeft: '3%', paddingRight: '3%' }}>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Deskripsi Payment</p>
                                    <p className="mb-0"> {this.state.deskripsi_payment}</p>
                                </div>
                            </div>
                        </ModalBody>
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

                    {/* Modal Mapping */}
                    <Modal size="md" toggle={this.handleModalDetailMapping} isOpen={this.state.isOpenMapping} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleModalDetailMapping}>Detail Kode Perusahaan</ModalHeader>
                        <ModalBody>
                            {(this.state.company_mapping_register_status === 'I') ?
                                <div className="alert alert-danger fade show" role="alert" style={{ width: '100%', paddingLeft: '3%', paddingRight: '3%' }}>
                                    <center>
                                        Perubahan kode perusahaan tidak sekaligus mengaktifkan status perusahaan.<br></br>
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
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Perusahaan</p>
                                <p className="mb-0"> {this.state.company_mapping_register_status === 'A' ? 'Aktif' :
                                    this.state.company_mapping_register_status === 'R' ? 'Nonaktif' : 'Belum Aktif'}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Registrasi</p>
                                <p className="mb-0"> {this.state.company_mapping_register_date}</p>
                            </div>
                            <div style={{ width: '100%', paddingLeft: '3%', paddingRight: '3%' }}>
                                <FormGroup>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Kode Perusahaan</p>
                                    {
                                        (this.state.company_mapping_register_status) === 'R' ?
                                            // <Input type="text" name="company_mapping_kode_seller" id="company_mapping_kode_seller" 
                                            //     value={this.state.company_mapping_kode_seller} 
                                            //     disabled={true}/>
                                            <p className="mb-0"> {this.state.company_mapping_kode_seller}</p>
                                            : (this.state.company_mapping_register_status) === 'I' ?
                                                <Input type="text" name="company_mapping_kode_seller_inserted" id="company_mapping_kode_seller_inserted"
                                                    value={this.state.company_mapping_kode_seller_inserted}
                                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                    maxLength={7}
                                                    valid={this.state.validation_mapping_kode_seller}
                                                    invalid={this.state.empty_mapping_kode_seller} />
                                                : <Input type="text" name="company_mapping_kode_seller" id="company_mapping_kode_seller"
                                                    value={this.state.company_mapping_kode_seller}
                                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                    maxLength={7}
                                                    valid={this.state.validation_mapping_kode_seller}
                                                    invalid={this.state.empty_mapping_kode_seller} />
                                    }
                                    <FormFeedback>{this.state.feedback_mapping_kode_seller}</FormFeedback>
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
                </div>
            </div>
        )
    }
}
const reduxState = (state) => ({
    userData: state.userData
})

const reduxDispatch = (dispatch) => ({
    getDataUsersAPI: (data) => dispatch(getDataUsersAPI(data)),
    getDataDetailedUserSuperAdminAPI: (data) => dispatch(getDataDetailedUserSuperAdminAPI(data)),
    getDataAlamatAPI: (data) => dispatch(getDataAlamatAPI(data)),
    SA_getDataPaymentListingAPI: (data) => dispatch(SA_getDataPaymentListingAPI(data)),
    getDataDetailedPaymentAPI: (data) => dispatch(getDataDetailedPaymentAPI(data)),
    getDataRegisteredAPI: (data) => dispatch(getDataRegisteredAPI(data)),
    getDataTypeBlackList: (data) => dispatch(getDataTypeBlackList(data)),
    showBlacklistBy: (data) => dispatch(showBlacklistBy(data)),
    showJenisBlacklist: (data) => dispatch(showJenisBlacklist(data)),
    updateUserStatus: (data) => dispatch(updateUserStatus(data)),
    getCheckingKodeSeller: (data) => dispatch(getCheckingKodeSeller(data)),
    getDataCheckedKodeSeller: (data) => dispatch(getDataCheckedKodeSeller(data)),
    getDataDetailedKodeSellerAPI: (data) => dispatch(getDataDetailedKodeSellerAPI(data)),
    getDataDetailedMappingSuperAdminAPI: (data) => dispatch(getDataDetailedMappingSuperAdminAPI(data)),
    logoutAPI: () => dispatch(logoutUserAPI()),
    sendEmailToUser: (data) => dispatch(sendEmailAktivasi(data)),
    SA_getDataUsersAPI: (data) => dispatch(SA_getDataUsersAPI(data)),
    SA_updateUserStatus: (data) => dispatch(SA_updateUserStatus(data)),
    SA_updateUserStatusMapping: (data) => dispatch(SA_updateUserStatusMapping(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentPenggunaSuperAdmin));
