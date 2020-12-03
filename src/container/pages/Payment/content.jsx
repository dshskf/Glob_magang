import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import {
    getDataPaymentAdminAPI, getDataPaymentAPI, insertPaymentListingSeller, getDataDetailedPaymentAPI,
    getDataCheckedIdPayment, updateStatusPayment, logoutUserAPI, postQuery
}
    from '../../../config/redux/action';
import swal from 'sweetalert';
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup,
    ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu
} from 'reactstrap'
import { withRouter } from 'react-router-dom';
import Toast from 'light-toast';


class ContentPayment extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        allPaymentListing: [],
        allPaymentFromMaster: [],
        allPaymentChecked: [],
        deskripsi_payment_inserted: 'Tidak ada deskripsi payment',
        id_payment_inserted: '',
        payment_inserted_name: '',
        isOpen: false,
        isOpenInsert: false,
        isBtnInsert: true,
        isOpenConfirmInsert: false,
        id_payment: '',
        nama_payment: '',
        deskripsi_payment: '',
        status_payment: '',
        rekeningBank: '',
        rekeningBankNama: '',
        rekeningBankIdBank: '',
        rekeningData: [],
        rekeningList: null,
        bankList: null,
        selectedRekening: null,
        pembanding_status_payment: '',
        isOpenStatusPayment: false,
        isbtnupdatepayment: true,
        isOpenConfirmStatusPayment: false,
        isOpenRekeningBank: false,
        isOpenRekeningBankEdit: false,
        isOpenDeactivate: false,
        isSubmitRekeningAction: false,
        isDisabledTambahRekening: true,
        isOpenInsertRekeningBaru: false,
        isDisableAddRowRekeningButton: true
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
        this.loadPaymentListing()
        this.loadPaymentFromMaster()
    }

    loadPaymentListing = async () => {
        let passquerypaymentlisting = encrypt("select gcm_master_payment.payment_name, gcm_seller_payment_listing.status, gcm_seller_payment_listing.id " +
            "from gcm_seller_payment_listing " +
            "inner join gcm_master_payment on gcm_seller_payment_listing.payment_id = gcm_master_payment.id " +
            "where seller_id=" + this.state.company_id)
        const respaymentlisting = await this.props.getDataPaymentAdminAPI({ query: passquerypaymentlisting }).catch(err => err)


        let queryRekening = encrypt(`
            select a.*,b.nama as nama_bank from gcm_listing_bank a
            inner join gcm_master_bank b on a.id_bank=b.id
            where company_id=${this.state.company_id} and a.status='A'
        `)
        let getRekening = await this.props.postQuery({ query: queryRekening }).catch(err => err)

        getRekening = getRekening.map(data => ({
            ...data,
            action: <center>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-danger" name={data.id} onClick={this.handleDeactivateRekeningBank} value="delete"> Hapus</button>
            </center>
        }))

        queryRekening = encrypt(`select * from gcm_master_bank`)
        const getBank = await this.props.postQuery({ query: queryRekening }).catch(err => err)

        if (respaymentlisting && getRekening && getBank) {
            this.setState({
                rekeningList: getRekening,
                bankList: getBank
            })
            respaymentlisting.map((user, index) => {
                return (
                    respaymentlisting[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailPayment(e, respaymentlisting[index].id)}>Lihat Detail</button>
                    </center>
                )
            })
            this.setState({
                allPaymentListing: respaymentlisting
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            });
        }
    }

    loadPaymentFromMaster = async () => {
        let passquerypaymentmaster = encrypt("select gcm_master_payment.id, gcm_master_payment.payment_name, gcm_master_payment.deskripsi " +
            "from gcm_master_payment " +
            "where not exists " +
            "(select * from gcm_seller_payment_listing " +
            "where gcm_seller_payment_listing.payment_id = gcm_master_payment.id and gcm_seller_payment_listing.seller_id=" +
            this.state.company_id + ")")
        const respaymentmaster = await this.props.getDataPaymentAPI({ query: passquerypaymentmaster }).catch(err => err)
        if (respaymentmaster) {
            this.setState({
                allPaymentFromMaster: respaymentmaster
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

    loadCheckingPayment = async () => {
        let passqueryidpayment = encrypt("select gcm_seller_payment_listing.payment_id from gcm_seller_payment_listing where seller_id=" + this.state.company_id)
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

            });
        }
    }

    handleModalInsert = () => {
        this.setState({
            isOpenInsert: !this.state.isOpenInsert,
            isBtnInsert: true,
            id_payment_inserted: '',
            deskripsi_payment_inserted: 'Tidak ada deskripsi payment'
        })
    }

    handleChange = async (event) => {
        if (event.target.name === 'id_payment_inserted') {
            const id = event.target.value.split('-')[0]
            const value = event.target.value.split('-')[1]
            let arr = this.state.allPaymentFromMaster.filter(arr_id => { return arr_id.id === id });

            await this.setState({
                id_payment_inserted: id,
                payment_inserted_name: value,
                deskripsi_payment_inserted: arr[0].deskripsi
            })

            if (this.state.id_payment_inserted !== '') {
                this.setState({ isBtnInsert: false })
            }
        }
        // this.setState({[event.target.name] : event.target.value})
    }

    handleModalConfirmInsert = async () => {
        await this.loadCheckingPayment()
        let check_id_payment_registered = this.state.allPaymentChecked.filter(input_id => { return input_id.payment_id === this.state.id_payment_inserted });
        if (check_id_payment_registered !== '' && check_id_payment_registered.length === 0) {
            if (!this.state.isOpenConfirmInsert && this.state.payment_inserted_name === 'Advance Payment') {
                this.handleModalRekeningBank('add')
            } else {
                this.setState({ isOpenConfirmInsert: !this.state.isOpenConfirmInsert })
            }

        } else {
            swal({
                title: "Kesalahan!",
                text: "Metode payment telah terdaftar",
                icon: "info",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                // window.location.reload()
            });
        }
    }



    confirmActionInsertPayment = async () => {
        Toast.loading('Loading...');

        let passqueryinsertpayment = `insert into gcm_seller_payment_listing (seller_id, payment_id, status)
            values ('${this.state.company_id}', '${this.state.id_payment_inserted}', 'A') returning status           
            `

        if (this.state.payment_inserted_name === 'Advance Payment') {
            passqueryinsertpayment = `
                with new_payment as(insert into gcm_seller_payment_listing (seller_id, payment_id, status)
                values ('${this.state.company_id}', '${this.state.id_payment_inserted}', 'A') returning status)
                insert into gcm_listing_bank(company_id,id_bank,no_rekening,pemilik_rekening,status,create_by,create_date,update_by,update_date)
                values 
            `
            this.state.rekeningData.map((data, i) => {
                if (i < this.state.rekeningData.length - 1) {
                    passqueryinsertpayment += `(${this.state.company_id},'${data.rekeningBankIdBank}',${data.rekeningBank},'${data.rekeningBankNama}','A',${this.state.id_pengguna_login},now(),${this.state.id_pengguna_login},now()), `
                    return
                }
                passqueryinsertpayment += `(${this.state.company_id},'${data.rekeningBankIdBank}',${data.rekeningBank},'${data.rekeningBankNama}','A',${this.state.id_pengguna_login},now(),${this.state.id_pengguna_login},now()) returning * `
                return
            })
        }


        const resinsertpayment = await this.props.insertPaymentListingSeller({ query: encrypt(passqueryinsertpayment) }).catch(err => err)
        Toast.hide();
        if (resinsertpayment) {
            swal({
                title: "Sukses!",
                text: "Metode payment berhasil ditambahkan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                if (this.state.payment_inserted_name === 'Advance Payment') {
                    this.handleModalRekeningBank('add')
                }
                this.handleModalInsert()
                this.handleModalConfirmInsert()
                this.loadPaymentListing()
                this.loadPaymentFromMaster()
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

            });
        }
    }

    handleDetailPayment = async (e, id) => {
        this.handleModalDetailPayment()
        e.stopPropagation()
        let passquerydetailpayment = encrypt(`select gcm_master_payment.payment_name, gcm_master_payment.deskripsi, gcm_seller_payment_listing.status, gcm_seller_payment_listing.id
            from gcm_seller_payment_listing
            inner join gcm_master_payment on gcm_master_payment.id = gcm_seller_payment_listing.payment_id
            where gcm_seller_payment_listing.id=${id}`
        )
        const resdetailpayment = await this.props.getDataDetailedPaymentAPI({ query: passquerydetailpayment }).catch(err => err)
        if (resdetailpayment) {
            await this.setState({
                id_payment: resdetailpayment.id,
                nama_payment: resdetailpayment.nama,
                deskripsi_payment: resdetailpayment.deskripsi,
                status_payment: resdetailpayment.status,
                pembanding_status_payment: resdetailpayment.status,
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

    handleModalDetailPayment = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            rekeingList: null,
            id_payment: '',
            nama_payment: '',
            deskripsi_payment: '',
            status_payment: '',
            pembanding_status_payment: '',
            isbtnupdatepayment: true
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

    handleModalConfirmStatusPayment = () => {
        this.setState({ isOpenConfirmStatusPayment: !this.state.isOpenConfirmStatusPayment, })
    }

    confirmActionChangeStatusPayment = async () => {
        let passquerychangestatuspayment = ""

        if (this.state.status_payment === 'R') {
            passquerychangestatuspayment = `
                update gcm_seller_payment_listing set status='C'
                where id= ${this.state.id_payment} returning status                
            `
        } else {

            passquerychangestatuspayment = `
                with new_order1 as (
                update gcm_seller_payment_listing set status='${this.state.status_payment}'
                where id= ${this.state.id_payment} returning status), 
                new_order2 as(
                update gcm_payment_listing set status='${this.state.status_payment}'
                where payment_id= ${this.state.id_payment} and seller_id= ${this.state.company_id})
                select status from new_order1
            `
        }

        const resupdatestatuspayment = await this.props.updateStatusPayment({ query: encrypt(passquerychangestatuspayment) }).catch(err => err)

        if (resupdatestatuspayment) {
            if (this.state.status_payment === 'R') {
                swal({
                    title: "Sukses!",
                    text: "Pengajuan metode payment berhasil disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.handleModalConfirmStatusPayment()
                    this.handleModalDetailPayment()
                    this.loadPaymentListing()
                    this.loadPaymentFromMaster()
                });
            } else {
                swal({
                    title: "Sukses!",
                    text: "Perubahan metode payment berhasil disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.handleModalConfirmStatusPayment()
                    this.handleModalDetailPayment()
                    this.loadPaymentListing()
                    this.loadPaymentFromMaster()
                });
            }
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

    handleDeactivateRekeningBank = e => {
        let filter_rekening = this.state.rekeningList.filter(d => d.id.toString() === e.target.name)
        this.setState({
            isOpenDeactivate: !this.state.isOpenDeactivate,
            selectedRekening: filter_rekening[0]
        })
    }

    deactivateRekeningBank = async () => {
        const query = encrypt(`update gcm_listing_bank set status='I' where id=${this.state.selectedRekening.id} returning *`)
        const postUpdate = await this.props.postQuery({ query: query }).catch(err => err)

        if (postUpdate) {
            swal({
                title: "Sukses!",
                text: "Perubahan metode payment berhasil disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.setState({
                    isOpenDeactivate: false
                })
                this.handleModalDetailPayment()
                this.loadPaymentListing()
                this.loadPaymentFromMaster()
            });
        } else {
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

    handleModalRekeningBank = (method) => {
        if (method === 'add') {
            this.setState({ isOpenRekeningBank: !this.state.isOpenRekeningBank })
        }
        else {
            this.setState({ isOpenRekeningBankEdit: !this.state.isOpenRekeningBankEdit })
        }
        this.setState({
            isSubmitRekeningAction: false,
            isDisabledTambahRekening: true,
            isDisableAddRowRekeningButton: true,
            rekeningBank: '',
            rekeningBankNama: '',
            rekeningBankIdBank: '',
            rekeningData: [],
        })
    }


    handleChangeInputRekening = async e => {
        const { name, value } = e.target
        await this.setState({ [name]: value })

        if (this.state.rekeningBank !== '' &&
            this.state.rekeningBankNama !== '' &&
            this.state.rekeningBankIdBank !== ''
        ) {
            this.setState({
                isDisabledTambahRekening: false,
                isDisableAddRowRekeningButton: false
            })
        } else {
            this.setState({
                isDisabledTambahRekening: true,
                isDisableAddRowRekeningButton: true
            })
        }
    }

    handleAddInputRekeningRows = async () => {
        const { rekeningBank, rekeningBankNama, rekeningBankIdBank, rekeningData, isDisableAddRowRekeningButton } = this.state
        const prevData = rekeningData

        if (!isDisableAddRowRekeningButton) {
            const newData = {
                id: prevData.id ? 0 : prevData + 1,
                rekeningBank: rekeningBank,
                rekeningBankNama: rekeningBankNama,
                rekeningBankIdBank: rekeningBankIdBank,
            }

            prevData.push(newData)
            await this.setState({
                rekeningData: prevData,
                rekeningBank: '',
                rekeningBankNama: '',
                rekeningBankIdBank: '',
                isDisableAddRowRekeningButton: true,
                isDisabledTambahRekening: true,
            })
        }

    }

    handleRemoveInputRekeningRows = e => {
        let filtered = this.state.rekeningData.filter(d => d.id.toString() !== e.target.name)
        this.setState({
            rekeningData: filtered,
            isSubmitRekeningAction: this.state.rekeningData.length === 0
        })
        return
    }

    handleSubmitRekeningData = async () => {
        this.handleAddInputRekeningRows()
        await this.setState({
            isOpenConfirmInsert: !this.state.isOpenConfirmInsert,
            isSubmitRekeningAction: !this.state.isSubmitRekeningAction
        })
    }

    handleSubmitEditRekeningData = () => {
        this.handleAddInputRekeningRows()
        this.setState({
            isOpenInsertRekeningBaru: !this.state.isOpenInsertRekeningBaru,
            isSubmitRekeningAction: !this.state.isSubmitRekeningAction
        })
    }

    handleModalInsertRekeningBaru = () => {
        this.setState({ isOpenInsertRekeningBaru: false })
    }

    insertRekeningBaru = () => {
        if (this.state.rekeningData) {
            let query = `insert into gcm_listing_bank(company_id,id_bank,no_rekening,pemilik_rekening,status,create_by,create_date,update_by,update_date) values `

            this.state.rekeningData.map((data, i) => {
                if (i < this.state.rekeningData.length - 1) {
                    query += `(${this.state.company_id},'${data.rekeningBankIdBank}',${data.rekeningBank},'${data.rekeningBankNama}','A',${this.state.id_pengguna_login},now(),${this.state.id_pengguna_login},now()), `

                    return
                }
                query += `(${this.state.company_id},'${data.rekeningBankIdBank}',${data.rekeningBank},'${data.rekeningBankNama}','A',${this.state.id_pengguna_login},now(),${this.state.id_pengguna_login},now()) returning * `
                return
            })

            const passQuery = this.props.postQuery({ query: encrypt(query) }).catch(err => err)
            if (passQuery) {
                swal({
                    title: "Sukses!",
                    text: "Perubahan metode payment berhasil disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.handleModalDetailPayment()
                    this.handleModalInsertRekeningBaru()
                    this.handleModalRekeningBank('edit')
                    this.loadPaymentListing()
                    this.loadPaymentFromMaster()
                });
            } else {
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
    }


    rekeningBankComponent = () => {
        let component = []

        let temp = (isLast = false, val) => {
            return (
                <FormGroup style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                    <div style={{ width: '25%' }}>
                        <label>Nama</label>
                        <Input
                            type="text"
                            name="rekeningBankNama"
                            value={val ? val["rekeningBankNama"] : this.state["rekeningBankNama"]}
                            onChange={this.handleChangeInputRekening}
                            disabled={!isLast}
                        />
                    </div>
                    <div style={{ width: '25%' }}>
                        <label>Nama Bank</label>
                        <select
                            name="rekeningBankIdBank"
                            value={val ? val["rekeningBankIdBank"] : this.state["rekeningBankIdBank"]}
                            style={{
                                border: '1px solid rgba(0,0,0,0.2)',
                                borderRadius: '4px',
                                height: '2.4rem',
                                width: '100%',
                                color: 'rgba(0,0,0,0.8)',
                                outline: 'none',
                            }}
                            onChange={this.handleChangeInputRekening}
                            disabled={!isLast}
                        >
                            <option value="" selected={true} disabled={true} hidden={true}>Select Bank</option>
                            {
                                this.state.bankList && this.state.bankList.map(bank => (
                                    <option value={bank.id}>{bank.nama}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div style={{ width: '25%' }}>
                        <label>No Rekening</label>
                        <Input
                            type="text"
                            name="rekeningBank"
                            value={val ? val["rekeningBank"] : this.state["rekeningBank"]}
                            onChange={this.handleChangeInputRekening}
                            disabled={!isLast}
                        />
                    </div>

                    <div style={{ width: '20%', marginBottom: '4px' }}>
                        {
                            isLast ?
                                <button className="btn btn-primary" onClick={this.handleAddInputRekeningRows} disabled={this.state.isDisableAddRowRekeningButton}>+</button>
                                :
                                <button className="btn btn-danger" name={val && val.id} onClick={this.handleRemoveInputRekeningRows}>-</button>
                        }

                    </div>

                </FormGroup>
            )
        }

        // let rekeningData = this.state.rekeningData.length === 0 ? 1 : this.state.rekeningData.length 

        for (let i = 0; i < this.state.rekeningData.length; i++) {
            component.push(temp(false, this.state.rekeningData[i]))
        }

        if (!this.state.isSubmitRekeningAction || this.state.rekeningData.length === 0) {
            component.push(temp(true, null))
        }

        return component
    }


    render() {
        const dataPaymentListing = {
            columns: [
                {
                    label: 'Nama Payment',
                    field: 'payment_name',
                    width: 100
                },
                {
                    label: 'Status Payment',
                    field: 'status',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allPaymentListing
        }
        const dataRekeningListing = {
            columns: [
                {
                    label: 'Pemilik Rekening',
                    field: 'pemilik_rekening',
                    width: 150
                },
                {
                    label: 'Nama Bank',
                    field: 'nama_bank',
                    width: 100
                },
                {
                    label: 'No Rekening',
                    field: 'no_rekening',
                    width: 100
                },
                {
                    label: 'Action',
                    field: 'action',
                    width: 100
                }
            ],
            rows: this.state.rekeningList
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-wallet icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Payment
                                    <div className="page-title-subheading">Daftar metode payment yang tersedia pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">

                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Tambah metode payment" onClick={this.handleModalInsert}>
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
                                            order={['id', 'asc']}
                                            sorting="false"
                                            data={dataPaymentListing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Insert Payment */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Metode Payment</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Payment</p>
                            <Input type="select" name="id_payment_inserted" id="id_payment_inserted"
                                value={this.state.id_payment_inserted}
                                onChange={this.handleChange}>
                                <option value="" disabled selected>Pilih Metode Payment</option>
                                {
                                    // this.state.allPaymentFromMaster.map((allPaymentFromMaster, index)=>{
                                    //     return <option value={index}>{allPaymentFromMaster.payment_name}</option>
                                    // })
                                    this.state.allPaymentFromMaster.map((allPaymentFromMaster) => {
                                        return <option value={`${allPaymentFromMaster.id}-${allPaymentFromMaster.payment_name}`}>{allPaymentFromMaster.payment_name}</option>
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
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={this.state.isBtnInsert}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Insert Rekening */}
                <Modal size="md" toggle={() => this.handleModalRekeningBank('add')} isOpen={this.state.isOpenRekeningBank} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={() => this.handleModalRekeningBank('add')}>Rekening Bank</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            {
                                this.rekeningBankComponent()
                            }

                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" disabled={this.state.isDisabledTambahRekening} onClick={this.handleSubmitRekeningData}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalUbahTanggalPengiriman} onClick={() => this.handleModalRekeningBank('add')}>Batal</Button>
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
                        <Button color="primary" onClick={this.confirmActionInsertPayment}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal DetailedPayment */}
                <Modal size="md" toggle={this.handleModalDetailPayment} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailPayment}>Detail Informasi Payment</ModalHeader>
                    <ModalBody>
                        {/* <div className="position-relative form-group" style={{marginTop:'3%'}}> */}
                        <div style={{ marginTop: '3%', marginBottom: '3rem' }} className="row">
                            <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Payment</p>
                                <p className="mb-0"> {this.state.nama_payment}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Payment</p>
                                {
                                    (this.state.status_payment === 'C') ?
                                        <div className='mb-2 mr-2 badge badge-primary'>Proses Konfirmasi</div>
                                        : (this.state.status_payment === 'R') ?
                                            <div className='mb-2 mr-2 badge badge-warning'>Ditolak</div>
                                            :
                                            <ButtonDropdown isOpen={this.state.isOpenStatusPayment} toggle={this.handleStatusPayment}>
                                                <DropdownToggle caret color={this.state.status_payment === 'A' ? "success" : "danger"}>
                                                    {this.state.status_payment === 'A' ? 'Aktif' : 'Nonaktif'}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => this.changeStatusPayment('A')}>Aktif</DropdownItem>
                                                    <DropdownItem onClick={() => this.changeStatusPayment('I')}>Nonaktif</DropdownItem>
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                }
                            </div>
                            <div style={{ width: '50%', float: 'right', paddingLeft: '3%', paddingRight: '3%' }}>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Deskripsi Payment</p>
                                <p className="mb-0"> {this.state.deskripsi_payment}</p>
                            </div>
                        </div>
                        {
                            this.state.nama_payment &&
                            (
                                (this.state.nama_payment === "Advance Payment" && this.state.rekeningList) &&
                                <React.Fragment>
                                    <MDBDataTable
                                        responsive
                                        hover
                                        striped
                                        entries={5}
                                        info={false}
                                        paging={false}
                                        data={dataRekeningListing}
                                    />
                                    <button className="btn btn-primary" style={{ width: '100%', margin: '1rem 0' }} onClick={() => this.handleModalRekeningBank('edit')}>+ Tambah Rekening</button>
                                </React.Fragment>
                            )
                        }

                    </ModalBody>
                    {
                        (this.state.status_payment === 'A' || this.state.status_payment === 'I') ?
                            <ModalFooter>
                                <Button color="primary" onClick={this.handleModalConfirmStatusPayment} disabled={this.state.isbtnupdatepayment}>Konfirmasi</Button>
                                <Button color="danger" onClick={this.handleModalDetailPayment}>Batal</Button>
                            </ModalFooter>
                            : (this.state.status_payment === 'R') ?
                                <ModalFooter>
                                    <Button color="primary" onClick={this.handleModalConfirmStatusPayment}>Ajukan lagi</Button>
                                    <Button color="danger" onClick={this.handleModalDetailPayment}>Batal</Button>
                                </ModalFooter>
                                : null
                    }
                </Modal>

                {/* Modal Edit Insert Rekening */}
                <Modal size="md" toggle={() => this.handleModalRekeningBank('edit')} isOpen={this.state.isOpenRekeningBankEdit} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={() => this.handleModalRekeningBank('edit')}>Rekening Bank</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            {
                                this.rekeningBankComponent()
                            }

                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" disabled={this.state.isDisabledTambahRekening} onClick={this.handleSubmitEditRekeningData}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalUbahTanggalPengiriman} onClick={() => this.handleModalRekeningBank('edit')}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Edit Insert Rekening*/}
                <Modal size="sm" toggle={this.handleModalInsertRekeningBaru} isOpen={this.state.isOpenInsertRekeningBaru} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsertRekeningBaru}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>
                                Apakah anda yakin akan melakukan aksi ini?
                            </label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.insertRekeningBaru}>Konfirmasi</Button>
                        <Button color="danger" onClick={this.handleModalInsertRekeningBaru}>Batal</Button>
                    </ModalFooter>
                </Modal>


                {/* Modal Confirm Status Payment*/}
                <Modal size="sm" toggle={this.handleModalConfirmStatusPayment} isOpen={this.state.isOpenConfirmStatusPayment} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmStatusPayment}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>
                                {(this.state.status_payment === 'R') ? 'Ajukan ulang metode payment ini?' : 'Simpan perubahan ini? Harap perhatikan metode payment setiap perusahaan yang berlangganan!'}
                            </label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionChangeStatusPayment}>Konfirmasi</Button>
                        <Button color="danger" onClick={this.handleModalConfirmStatusPayment}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Deactivate */}
                <Modal size="sm" toggle={this.handleDeactivateRekeningBank} isOpen={this.state.isOpenDeactivate} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleDeactivateRekeningBank}>Konfirmasi Aksi</ModalHeader>
                    {
                        this.state.selectedRekening &&
                        <ModalBody>
                            <div className="position-relative form-group">
                                <div>
                                    <label style={{ margin: 0 }}><strong>Pemilik</strong></label>
                                    <p>{this.state.selectedRekening.pemilik_rekening}</p>
                                </div>
                                <div>
                                    <label style={{ margin: 0 }}><strong>Nama Bank</strong></label>
                                    <p>{this.state.selectedRekening.nama_bank}</p>
                                </div>
                                <div>
                                    <label style={{ margin: 0 }}><strong>No Rekening</strong></label>
                                    <p>{this.state.selectedRekening.no_rekening}</p>
                                </div>
                                <label>Apakah yakin akan melakukan aksi ini?</label>
                            </div>
                        </ModalBody>
                    }
                    <ModalFooter>
                        <Button color="primary" onClick={this.deactivateRekeningBank}>Hapus</Button>
                        <Button color="danger" onClick={this.handleDeactivateRekeningBank}>Batal</Button>
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
    getDataPaymentAPI: (data) => dispatch(getDataPaymentAPI(data)),
    getDataPaymentAdminAPI: (data) => dispatch(getDataPaymentAdminAPI(data)),
    getDataDetailedPaymentAPI: (data) => dispatch(getDataDetailedPaymentAPI(data)),
    insertPaymentListingSeller: (data) => dispatch(insertPaymentListingSeller(data)),
    updateStatusPayment: (data) => dispatch(updateStatusPayment(data)),
    getDataCheckedIdPayment: (data) => dispatch(getDataCheckedIdPayment(data)),
    postQuery: (data) => dispatch(postQuery(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentPayment));