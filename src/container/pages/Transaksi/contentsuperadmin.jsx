import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { encrypt, decrypt } from '../../../config/lib';
import NumberFormat from 'react-number-format';
import {
    getDataTransactionsAPI, getDataDetailedTransactionBuyerSuperAdminAPI, getDataDetailedOrderAPI, getDataDetailedAlamatTransactionAPI,
    getDataAlamatAPI, getDataDetailedTransactionSellerSuperAdminAPI, checkIdTransactionCanceled, updateTransactionStatus, logoutUserAPI
}
    from '../../../config/redux/action';
import { MDBDataTable } from 'mdbreact';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import moment from 'moment';
import 'moment/locale/id'
import './Transaksi.css'
import swal from 'sweetalert'
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'


class ContentTransaksiSuperAdmin extends Component {
    state = {
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        allDataTransaction: [],
        tmpfilteredDataTransaction: [],
        allFilteredDataTransaction: [],
        allFilteredDataTransactionByPayment: [],
        allDetailedOrder: [],
        allDetailedOrderNonWaiting: [],
        allAlamatSeller: [],
        allTransactionToCanceled: [],
        statusFilter: 'Menunggu',
        statusFilterPayment: false,
        isOpenFilterPayment: false,
        isOpen: false,
        selectedFilterPayment: 'Semua',
        id_transaction: '',
        company_name_transaction: '',
        company_email_transaction: '',
        company_contact_transaction: '',
        company_type_bisnis: '',
        status: '',
        status_payment: '',
        create_date: '',
        update_date: '',
        username: '',
        nama: '',
        email: '',
        telepon: '',
        company_id_seller_transaction: '',
        company_name_seller_transaction: '',
        company_email_seller_transaction: '',
        company_contact_seller_transaction: '',
        company_kode_seller_transaction: '',
        company_seller_type_bisnis: '',
        cancel_reason: '',
        shipto: '',
        billto: '',
        alamat_shipto: '',
        kelurahan_shipto: '',
        kecamatan_shipto: '',
        kota_shipto: '',
        provinsi_shipto: '',
        kodepos_shipto: '',
        no_telp_shipto: '',
        alamat_billto: '',
        kelurahan_billto: '',
        kecamatan_billto: '',
        kota_billto: '',
        provinsi_billto: '',
        kodepos_billto: '',
        no_telp_billto: '',
        startDate: moment().startOf('month'),
        endDate: moment(),                              // now
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        },
        isBtnRefreshTransaction: false
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.setState({
            company_id: decrypt(userData.company_id),
            company_name: decrypt(userData.company_name),
            tipe_bisnis: decrypt(userData.tipe_bisnis)
        })
    }

    async componentDidMount() {
        await this.loadDataTransactions("0")
        await this.checkDataCanceledTransactions()
        if (this.state.allTransactionToCanceled.length > 0) {
            await this.updateTransactionToCanceled()
        }
    }

    loadDataTransactions = async (flag) => {
        let passquery = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, " +
                "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, " +
                "to_char(gcm_master_transaction.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, gcm_master_transaction.status_payment, " +
                "to_char(gcm_master_transaction.date_ongoing, 'DD/MM/YYYY HH24:MI:SS') date_ongoing, " +
                "to_char(gcm_master_transaction.date_shipped, 'DD/MM/YYYY HH24:MI:SS') date_shipped, " +
                "to_char(gcm_master_transaction.date_received, 'DD/MM/YYYY HH24:MI:SS') date_received, " +
                "to_char(gcm_master_transaction.date_complained, 'DD/MM/YYYY HH24:MI:SS') date_complained, " +
                "to_char(gcm_master_transaction.date_finished, 'DD/MM/YYYY HH24:MI:SS') date_finished, " +
                "to_char(gcm_master_transaction.date_canceled, 'DD/MM/YYYY HH24:MI:SS') date_canceled " +
                "from gcm_transaction_detail " +
                "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                "where gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'" +
                "group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, " +
                "gcm_master_transaction.date_ongoing, gcm_master_transaction.date_shipped, gcm_master_transaction.date_received, gcm_master_transaction.date_complained, " +
                "gcm_master_transaction.date_finished, gcm_master_transaction.date_canceled, " +
                "gcm_master_transaction.update_date, gcm_master_transaction.status_payment order by gcm_master_transaction.create_date desc;")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, " +
                "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, " +
                "to_char(gcm_master_transaction.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, gcm_master_transaction.status_payment, " +
                "to_char(gcm_master_transaction.date_ongoing, 'DD/MM/YYYY HH24:MI:SS') date_ongoing, " +
                "to_char(gcm_master_transaction.date_shipped, 'DD/MM/YYYY HH24:MI:SS') date_shipped, " +
                "to_char(gcm_master_transaction.date_received, 'DD/MM/YYYY HH24:MI:SS') date_received, " +
                "to_char(gcm_master_transaction.date_complained, 'DD/MM/YYYY HH24:MI:SS') date_complained, " +
                "to_char(gcm_master_transaction.date_finished, 'DD/MM/YYYY HH24:MI:SS') date_finished, " +
                "to_char(gcm_master_transaction.date_canceled, 'DD/MM/YYYY HH24:MI:SS') date_canceled " +
                "from gcm_transaction_detail " +
                "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                "where gcm_master_transaction.create_date between '" +
                this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') + "'::TIMESTAMP + '1 days'::INTERVAL " +
                "group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, " +
                "gcm_master_transaction.date_ongoing, gcm_master_transaction.date_shipped, gcm_master_transaction.date_received, gcm_master_transaction.date_complained, " +
                "gcm_master_transaction.date_finished, gcm_master_transaction.date_canceled, " +
                "gcm_master_transaction.update_date, gcm_master_transaction.status_payment order by gcm_master_transaction.create_date desc;")
        }
        const res = await this.props.getDataTransactionsAPI({ query: passquery }).catch(err => err)
        if (res) {
            res.map((user, index) => {
                return (
                    res[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailTransaction(e, res[index].id_transaction)}>Lihat Detail</button>
                    </center>,
                    res[index].create_date =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.create_date}</p>,
                    res[index].update_date =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.update_date}</p>,
                    res[index].date_ongoing =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.date_ongoing}</p>,
                    res[index].date_shipped =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.date_shipped}</p>,
                    res[index].date_received =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.date_received}</p>,
                    res[index].date_complained =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.date_complained}</p>,
                    res[index].date_finished =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.date_finished}</p>,
                    res[index].date_canceled =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.date_canceled}</p>,
                    res[index].show_id_transaction =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.id_transaction}</p>
                )
            })
            this.setState({
                allDataTransaction: res,
                tmpfilteredDataTransaction: res
            })
            swal({
                title: "Sukses!",
                text: "Data transaksi berhasil diperbarui!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {

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
        this.setState({
            allFilteredDataTransaction: this.state.tmpfilteredDataTransaction.filter(tmpfilteredDataTransaction =>
                tmpfilteredDataTransaction.filterby === this.state.statusFilter)
        })
    }

    filterDataTransaction = (e, x) => {
        e.stopPropagation()
        this.setState({
            selectedFilterPayment: 'Semua',
            statusFilterPayment: false,
            statusFilter: x,
            allFilteredDataTransaction: this.state.tmpfilteredDataTransaction.filter(tmpfilteredDataTransaction =>
                tmpfilteredDataTransaction.filterby === x)
        })
    }

    filterDataStatusPayment = (x) => {
        x === 'S' ?
            this.setState({
                statusFilterPayment: false,
                selectedFilterPayment: 'Semua'
            }) :
            x === 'UNPAID' ?
                this.setState({
                    statusFilterPayment: true,
                    selectedFilterPayment: 'Belum Lunas',
                    allFilteredDataTransactionByPayment: this.state.allFilteredDataTransaction.filter(allFilteredDataTransaction =>
                        allFilteredDataTransaction.filterbypayment === x)
                }) :
                this.setState({
                    statusFilterPayment: true,
                    selectedFilterPayment: 'Lunas',
                    allFilteredDataTransactionByPayment: this.state.allFilteredDataTransaction.filter(allFilteredDataTransaction =>
                        allFilteredDataTransaction.filterbypayment === x)
                })
    }

    handleFilterPayment = () => {
        this.setState({
            isOpenFilterPayment: !this.state.isOpenFilterPayment
        })
    }

    handleDetailTransaction = async (e, id) => {
        this.handleModalDetail()
        e.stopPropagation();
        let passquerydetailtransaction = encrypt("select gcm_master_transaction.id, gcm_master_transaction.id_transaction, " +
            "gcm_master_company.nama_perusahaan, gcm_master_company.email as company_email, gcm_master_company.no_telp, " +
            "gcm_master_transaction.status, gcm_master_transaction.status_payment, gcm_master_transaction.cancel_reason, " +
            "to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, to_char(gcm_master_transaction.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, " +
            "gcm_master_user.nama, gcm_master_user.username, gcm_master_user.email, gcm_master_user.no_hp, " +
            "gcm_master_category.nama as tipe_bisnis_buyer, gcm_master_transaction.shipto_id, gcm_master_transaction.billto_id " +
            "from gcm_master_transaction " +
            "inner join gcm_master_company on gcm_master_transaction.company_id=gcm_master_company.id " +
            "inner join gcm_master_user on gcm_master_transaction.create_by=gcm_master_user.id " +
            "inner join gcm_transaction_detail on gcm_master_transaction.id_transaction=gcm_transaction_detail.transaction_id " +
            "inner join gcm_master_category on gcm_master_category.id = gcm_master_company.tipe_bisnis " +
            "where gcm_master_transaction.id_transaction='" + id + "'" +
            " group by gcm_master_transaction.id, gcm_master_transaction.id_transaction, gcm_master_transaction.cancel_reason, " +
            "gcm_master_company.nama_perusahaan, gcm_master_company.email, gcm_master_company.no_telp, " +
            "gcm_master_transaction.status, gcm_master_transaction.status_payment, gcm_master_transaction.create_date, " +
            "gcm_master_transaction.update_date, gcm_master_user.nama, gcm_master_user.username, gcm_master_user.email, " +
            "gcm_master_user.no_hp, gcm_master_category.nama, gcm_master_transaction.shipto_id, gcm_master_transaction.billto_id;")
        const resdetail = await this.props.getDataDetailedTransactionBuyerSuperAdminAPI({ query: passquerydetailtransaction }).catch(err => err)
        if (resdetail) {
            await this.setState({
                id_transaction: resdetail.id_transaction,
                company_name_transaction: resdetail.company_name_transaction,
                company_email_transaction: resdetail.company_email_transaction,
                company_contact_transaction: resdetail.company_contact_transaction,
                status: resdetail.status,
                status_payment: resdetail.status_payment,
                create_date: resdetail.create_date,
                update_date: resdetail.update_date,
                username: resdetail.username,
                nama: resdetail.nama,
                email: resdetail.email,
                telepon: resdetail.telepon,
                company_type_bisnis: resdetail.company_type_bisnis,
                shipto: resdetail.shipto_id,
                billto: resdetail.billto_id,
                cancel_reason: resdetail.cancel_reason
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
        this.loadSellerOrder(this.state.id_transaction)
        this.loadDetailedOrder(this.state.id_transaction, this.state.status)
        this.loadAlamatShipTo(this.state.shipto, this.state.id_transaction)
        this.loadAlamatBillTo(this.state.billto, this.state.id_transaction)
    }

    loadSellerOrder = async (id) => {
        let passquerydetailsellertransaction = encrypt("select gcm_master_company.nama_perusahaan, gcm_master_company.email as company_email, " +
            "gcm_master_company.no_telp, gcm_master_category.nama as tipe_bisnis_seller, gcm_master_company.id, gcm_master_company.kode_seller " +
            "from gcm_list_barang " +
            "inner join gcm_transaction_detail on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
            "inner join gcm_master_company on gcm_master_company.id = gcm_list_barang.company_id " +
            "inner join gcm_master_category on gcm_master_category.id = gcm_master_company.tipe_bisnis " +
            "where gcm_transaction_detail.transaction_id='" + id + "' and gcm_master_company.type='S'" +
            "group by gcm_master_company.nama_perusahaan, gcm_master_company.email, gcm_master_company.no_telp, gcm_master_category.nama, " +
            "gcm_master_company.kode_seller, gcm_master_company.id")
        const resdetailseller = await this.props.getDataDetailedTransactionSellerSuperAdminAPI({ query: passquerydetailsellertransaction }).catch(err => err)
        this.loadAlamatSeller(resdetailseller.company_id_seller_transaction)
        if (resdetailseller) {
            this.setState({
                company_id_seller_transaction: resdetailseller.company_id_seller_transaction,
                company_name_seller_transaction: resdetailseller.company_name_seller_transaction,
                company_email_seller_transaction: resdetailseller.company_email_seller_transaction,
                company_contact_seller_transaction: resdetailseller.company_contact_seller_transaction,
                company_seller_type_bisnis: resdetailseller.company_seller_type_bisnis,
                company_kode_seller_transaction: resdetailseller.kode_seller
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

    loadAlamatSeller = async (id) => {
        let passqueryalamatseller = encrypt("select gcm_master_alamat.alamat, gcm_master_kelurahan.nama as kelurahan, " +
            "gcm_master_kecamatan.nama as kecamatan, gcm_master_city.nama as kota, gcm_master_provinsi.nama as provinsi, " +
            "gcm_master_alamat.kodepos, gcm_master_alamat.no_telp, gcm_master_alamat.shipto_active, gcm_master_alamat.billto_active " +
            "from gcm_master_alamat " +
            "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id " +
            "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id " +
            "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id " +
            "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id " +
            "where gcm_master_alamat.company_id=" + id)
        const resalamatseller = await this.props.getDataAlamatAPI({ query: passqueryalamatseller }).catch(err => err)
        if (resalamatseller) {
            this.setState({
                allAlamatSeller: resalamatseller
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

    loadAlamatShipTo = async (id_shipto, id_transaction) => {
        let passqueryalamatshipto = encrypt("select gcm_master_alamat.alamat, gcm_master_kelurahan.nama as kelurahan, gcm_master_kecamatan.nama as kecamatan, " +
            "gcm_master_city.nama as kota, gcm_master_provinsi.nama as provinsi, gcm_master_alamat.kodepos, gcm_master_alamat.no_telp " +
            "from gcm_master_alamat " +
            "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id " +
            "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id " +
            "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id " +
            "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id " +
            "inner join gcm_master_transaction on gcm_master_transaction.shipto_id = gcm_master_alamat.id " +
            "where gcm_master_transaction.shipto_id = " + id_shipto + " and gcm_master_transaction.id_transaction = '" + id_transaction + "'")
        const resalamatshipto = await this.props.getDataDetailedAlamatTransactionAPI({ query: passqueryalamatshipto }).catch(err => err)
        if (resalamatshipto) {
            this.setState({
                alamat_shipto: resalamatshipto.alamat,
                kelurahan_shipto: resalamatshipto.kelurahan,
                kecamatan_shipto: resalamatshipto.kecamatan,
                kota_shipto: resalamatshipto.kota,
                provinsi_shipto: resalamatshipto.provinsi,
                kodepos_shipto: resalamatshipto.kodepos,
                no_telp_shipto: resalamatshipto.no_telp
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

    loadAlamatBillTo = async (id_shipto, id_transaction) => {
        let passqueryalamatbillto = encrypt("select gcm_master_alamat.alamat, gcm_master_kelurahan.nama as kelurahan, gcm_master_kecamatan.nama as kecamatan, " +
            "gcm_master_city.nama as kota, gcm_master_provinsi.nama as provinsi, gcm_master_alamat.kodepos, gcm_master_alamat.no_telp " +
            "from gcm_master_alamat " +
            "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id " +
            "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id " +
            "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id " +
            "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id " +
            "inner join gcm_master_transaction on gcm_master_transaction.billto_id = gcm_master_alamat.id " +
            "where gcm_master_transaction.billto_id = " + id_shipto + " and gcm_master_transaction.id_transaction = '" + id_transaction + "'")
        const resalamatbillto = await this.props.getDataDetailedAlamatTransactionAPI({ query: passqueryalamatbillto }).catch(err => err)
        if (resalamatbillto) {
            this.setState({
                alamat_billto: resalamatbillto.alamat,
                kelurahan_billto: resalamatbillto.kelurahan,
                kecamatan_billto: resalamatbillto.kecamatan,
                kota_billto: resalamatbillto.kota,
                provinsi_billto: resalamatbillto.provinsi,
                kodepos_billto: resalamatbillto.kodepos,
                no_telp_billto: resalamatbillto.no_telp
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

    loadDetailedOrder = async (id_transaction, status) => {
        // let passquerydetailedorder =  encrypt("select gcm_transaction_detail.id, gcm_master_barang.nama, concat(gcm_transaction_detail.qty, ' x ', cast(gcm_list_barang.jumlah_min_beli as int), ' ', gcm_master_satuan.alias) as qty "+
        //     "from gcm_transaction_detail "+ 
        //         "inner join gcm_list_barang on gcm_transaction_detail.barang_id=gcm_list_barang.id "+
        //         "inner join gcm_master_barang on gcm_list_barang.barang_id=gcm_master_barang.id "+
        //         "inner join gcm_master_satuan on gcm_master_barang.satuan=gcm_master_satuan.id "+
        //     "where gcm_transaction_detail.transaction_id= '"+id_transaction+"' order by gcm_master_barang.nama asc")
        let passquerydetailedorder = ""
        if (status === 'WAITING' || status === 'CANCELED') {
            passquerydetailedorder = encrypt("select gcm_transaction_detail.id,gcm_transaction_detail.note, gcm_master_barang.nama, concat(gcm_transaction_detail.qty, ' x ', cast(gcm_master_barang.berat as int), ' ', gcm_master_satuan.alias) as show_qty " +
                "from gcm_transaction_detail " +
                "inner join gcm_list_barang on gcm_transaction_detail.barang_id=gcm_list_barang.id " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id=gcm_master_barang.id " +
                "inner join gcm_master_satuan on gcm_master_barang.satuan=gcm_master_satuan.id " +
                "where gcm_transaction_detail.transaction_id= '" + id_transaction + "' order by gcm_master_barang.nama asc")
        } else {
            passquerydetailedorder = encrypt("select gcm_transaction_detail.id,gcm_transaction_detail.note, gcm_master_barang.nama, concat(gcm_transaction_detail.qty, ' x ', cast(gcm_master_barang.berat as int), ' ', gcm_master_satuan.alias) as show_qty, " +
                "concat(gcm_transaction_detail.qty_dipenuhi, ' x ', cast(gcm_master_barang.berat as int), ' ', gcm_master_satuan.alias) as show_qty_dipenuhi, " +
                "gcm_transaction_detail.exp_date " +
                "from gcm_transaction_detail " +
                "inner join gcm_list_barang on gcm_transaction_detail.barang_id=gcm_list_barang.id " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id=gcm_master_barang.id " +
                "inner join gcm_master_satuan on gcm_master_barang.satuan=gcm_master_satuan.id " +
                "where gcm_transaction_detail.transaction_id= '" + id_transaction + "' order by gcm_master_barang.nama asc")
        }
        const resdetailedorder = await this.props.getDataDetailedOrderAPI({ query: passquerydetailedorder }).catch(err => err)
        if (resdetailedorder) {
            if (status === 'WAITING' || status === 'CANCELED') {
                resdetailedorder.map((user, index) => {
                    return (
                        resdetailedorder[index].nama =
                        <div>
                            <p className="mb-0"> {user.nama}</p>
                            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}><b>Catatan:</b> {user.note}</p>
                        </div>,
                        resdetailedorder[index].harga =
                        <NumberFormat value={user.harga} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat>,
                        resdetailedorder[index].show_qty =
                        <p className="mb-0" style={{ textAlign: 'center' }}>{user.show_qty}</p>
                    )
                })
                this.setState({
                    allDetailedOrder: resdetailedorder
                })
            } else {
                resdetailedorder.map((user, index) => {
                    return (
                        resdetailedorder[index].nama =
                        <div>
                            <p className="mb-0"> {user.nama}</p>
                            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}><b>Catatan:</b> {user.note}</p>
                        </div>,
                        resdetailedorder[index].harga =
                        <NumberFormat value={user.harga} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat>,
                        resdetailedorder[index].show_qty =
                        <p className="mb-0" style={{ textAlign: 'center' }}>{user.show_qty}</p>,
                        resdetailedorder[index].show_qty_dipenuhi =
                        <p className="mb-0" style={{ textAlign: 'center' }}>{user.show_qty_dipenuhi}</p>,
                        resdetailedorder[index].exp_date =
                        <p className="mb-0" style={{ textAlign: 'center' }}>{user.exp_date}</p>
                    )
                })
                this.setState({
                    allDetailedOrderNonWaiting: resdetailedorder
                })
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
            isOpen: !this.state.isOpen
        })
    }

    handleEvent = (event, picker) => {
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate,
        });
        this.loadDataTransactions("0")
    }

    handleRefreshTransaction = async () => {
        await this.setState({ isBtnRefreshTransaction: true })
        // await this.checkDataCanceledTransactions()
        // if (this.state.allTransactionToCanceled.length > 0) {
        //     await this.updateTransactionToCanceled()
        // } else {
        //     await this.loadDataTransactions("1")
        // }
        await this.loadDataTransactions("1")
        await this.setState({ isBtnRefreshTransaction: false })
    }

    checkDataCanceledTransactions = async () => {
        let passqueryidtocanceled = encrypt("select gcm_master_transaction.id_transaction from gcm_master_transaction " +
            "inner join gcm_payment_listing on gcm_master_transaction.payment_id = gcm_payment_listing.id " +
            "inner join gcm_seller_payment_listing on gcm_payment_listing.payment_id = gcm_seller_payment_listing.id " +
            "inner join gcm_master_payment on gcm_seller_payment_listing.payment_id = gcm_master_payment.id " +
            "inner join gcm_transaction_detail on gcm_master_transaction.id_transaction = gcm_transaction_detail.transaction_id " +
            "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
            "where gcm_master_transaction.status = 'WAITING' " +
            "and now() > gcm_master_transaction.create_date + interval '48 hours' and gcm_master_payment.id = 2")
        const restransactiontocanceled = await this.props.checkIdTransactionCanceled({ query: passqueryidtocanceled }).catch(err => err)
        if (restransactiontocanceled) {
            await this.setState({
                allTransactionToCanceled: restransactiontocanceled
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

    updateTransactionToCanceled = async () => {
        let rowFailed = ""
        for (let i = 0; i < this.state.allTransactionToCanceled.length; i++) {
            let passqueryupdatestatustransaksi = encrypt("select func_change_to_canceled('" +
                this.state.allTransactionToCanceled[i].id_transaction + "');")
            const resupdatestatustransaksi = await this.props.updateTransactionStatus({ query: passqueryupdatestatustransaksi }).catch(err => err)
            if (resupdatestatustransaksi) {

            } else {
                rowFailed = rowFailed.concat(i + 1)
                if (i < this.state.allTransactionToCanceled.length - 1) {
                    rowFailed = rowFailed.concat(', ')
                }
            }
        }
        if (rowFailed === "") {
            await this.loadDataTransactions("1")
        } else {
            swal({
                title: "Kesalahan!",
                text: "Data transaksi gagal diperbarui!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            }).then(() => {
                window.location.reload()
            });
        }
    }

    render() {
        let start = this.state.startDate.format('DD MMMM YYYY');
        let end = this.state.endDate.format('DD MMMM YYYY');
        let label = start + ' - ' + end;
        if (start === end) { label = start; }
        const statusFilterPayment = this.state.statusFilterPayment
        const data = {
            columns: [
                {
                    label: 'ID Transaksi',
                    field: 'show_id_transaction',
                    width: 150
                },
                {
                    label: 'Perusahaan Pembeli',
                    field: 'nama_perusahaan',
                    width: 150
                },
                {
                    label: 'Tanggal Transaksi',
                    field: 'create_date',
                    sort: 'desc',
                    width: 50
                },
                {
                    label: 'Terakhir Diperbarui',
                    field: 'update_date',
                    sort: 'desc',
                    width: 50
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: (statusFilterPayment) ? this.state.allFilteredDataTransactionByPayment : this.state.allFilteredDataTransaction
        }
        const dataongoing = {
            columns: [
                {
                    label: 'ID Transaksi',
                    field: 'show_id_transaction',
                    width: 150
                },
                {
                    label: 'Nama Perusahaan',
                    field: 'nama_perusahaan',
                    width: 150
                },
                // {
                //     label: 'Status Pembayaran',
                //     field: 'status_payment',
                //     sort: 'asc',
                //     width: 150
                // },
                {
                    label: 'Tanggal Transaksi',
                    field: 'create_date',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Terakhir Diperbarui',
                    field: 'date_ongoing',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: (statusFilterPayment) ? this.state.allFilteredDataTransactionByPayment : this.state.allFilteredDataTransaction
        }
        const dataonshipped = {
            columns: [
                {
                    label: 'ID Transaksi',
                    field: 'show_id_transaction',
                    width: 150
                },
                {
                    label: 'Nama Perusahaan',
                    field: 'nama_perusahaan',
                    width: 150
                },
                // {
                //     label: 'Status Pembayaran',
                //     field: 'status_payment',
                //     sort: 'asc',
                //     width: 150
                // },
                {
                    label: 'Tanggal Transaksi',
                    field: 'create_date',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Terakhir Diperbarui',
                    field: 'date_shipped',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: (statusFilterPayment) ? this.state.allFilteredDataTransactionByPayment : this.state.allFilteredDataTransaction
        }
        const dataonreceived = {
            columns: [
                {
                    label: 'ID Transaksi',
                    field: 'show_id_transaction',
                    width: 150
                },
                {
                    label: 'Nama Perusahaan',
                    field: 'nama_perusahaan',
                    width: 150
                },
                // {
                //     label: 'Status Pembayaran',
                //     field: 'status_payment',
                //     sort: 'asc',
                //     width: 150
                // },
                {
                    label: 'Tanggal Transaksi',
                    field: 'create_date',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Terakhir Diperbarui',
                    field: 'date_received',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: (statusFilterPayment) ? this.state.allFilteredDataTransactionByPayment : this.state.allFilteredDataTransaction
        }
        const dataoncomplained = {
            columns: [
                {
                    label: 'ID Transaksi',
                    field: 'show_id_transaction',
                    width: 150
                },
                {
                    label: 'Nama Perusahaan',
                    field: 'nama_perusahaan',
                    width: 150
                },
                // {
                //     label: 'Status Pembayaran',
                //     field: 'status_payment',
                //     sort: 'asc',
                //     width: 150
                // },
                {
                    label: 'Tanggal Transaksi',
                    field: 'create_date',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Terakhir Diperbarui',
                    field: 'date_complained',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: (statusFilterPayment) ? this.state.allFilteredDataTransactionByPayment : this.state.allFilteredDataTransaction
        }
        const dataonfinished = {
            columns: [
                {
                    label: 'ID Transaksi',
                    field: 'show_id_transaction',
                    width: 150
                },
                {
                    label: 'Nama Perusahaan',
                    field: 'nama_perusahaan',
                    width: 150
                },
                // {
                //     label: 'Status Pembayaran',
                //     field: 'status_payment',
                //     sort: 'asc',
                //     width: 150
                // },
                {
                    label: 'Tanggal Transaksi',
                    field: 'create_date',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Terakhir Diperbarui',
                    field: 'date_finished',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: (statusFilterPayment) ? this.state.allFilteredDataTransactionByPayment : this.state.allFilteredDataTransaction
        }
        const dataoncanceled = {
            columns: [
                {
                    label: 'ID Transaksi',
                    field: 'show_id_transaction',
                    width: 150
                },
                {
                    label: 'Nama Perusahaan',
                    field: 'nama_perusahaan',
                    width: 150
                },
                // {
                //     label: 'Status Pembayaran',
                //     field: 'status_payment',
                //     sort: 'asc',
                //     width: 150
                // },
                {
                    label: 'Tanggal Transaksi',
                    field: 'create_date',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Terakhir Diperbarui',
                    field: 'date_canceled',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: (statusFilterPayment) ? this.state.allFilteredDataTransactionByPayment : this.state.allFilteredDataTransaction
        }
        const dataDetailedOrder = {
            columns: [
                {
                    label: 'Nama Barang',
                    field: 'nama',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Jumlah Barang',
                    field: 'show_qty',
                    sort: 'asc',
                    width: 100
                }],
            rows: this.state.allDetailedOrder
        }
        const dataDetailedOrdernonWaiting = {
            columns: [
                {
                    label: 'Nama Barang',
                    field: 'nama',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Tanggal Kedaluwarsa',
                    field: 'exp_date',
                    minimal: 'lg'
                },
                {
                    label: 'Jumlah Order',
                    field: 'show_qty',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Jumlah Order Dipenuhi',
                    field: 'show_qty_dipenuhi',
                    minimal: 'lg'
                }],
            rows: this.state.allDetailedOrderNonWaiting
        }
        const dataAlamatSeller = {
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
            rows: this.state.allAlamatSeller
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-graph2 icon-gradient bg-mean-fruit"></i>
                                </div>
                                <div>Manajemen Transaksi
                                    <div className="page-title-subheading">Daftar transaksi yang tercatat pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                {/* <ButtonDropdown direction="left" isOpen={this.state.isOpenFilterPayment} toggle={this.handleFilterPayment}>
                                        <DropdownToggle caret color={this.state.selectedFilterPayment === 'Semua' ? "primary" : 
                                                this.state.selectedFilterPayment === 'Lunas' ? "success" : "danger"} title="Filter berdasarkan status pembayaran">
                                            <i className="fa fa-fw" aria-hidden="true"></i>
                                            &nbsp;&nbsp;{this.state.selectedFilterPayment}
                                        </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => this.filterDataStatusPayment('S')}>Semua</DropdownItem>
                                        <DropdownItem onClick={() => this.filterDataStatusPayment('PAID')}>Lunas</DropdownItem>
                                        <DropdownItem onClick={() => this.filterDataStatusPayment('UNPAID')}>Belum Lunas</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown> */}
                                <DatetimeRangePicker
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    ranges={this.state.ranges}
                                    onEvent={this.handleEvent}>
                                    <Button className="selected-date-range-btn" color="primary" style={{ width: '100%' }}>
                                        <div className="pull-left">
                                            <i className="fa fa-calendar" />
                                            &nbsp;
                                            <span>
                                                {label}
                                            </span>
                                        </div>
                                    </Button>
                                </DatetimeRangePicker>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Perbarui data transaksi"
                            disabled={this.state.isBtnRefreshTransaction} onClick={this.handleRefreshTransaction}>
                            <i className="fa fa-fw" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <div className="card-header card-header-tab-animation">
                                    <ul className="nav nav-justified">
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-0" className="active nav-link" onClick={(e) => this.filterDataTransaction(e, 'Menunggu')}>Menunggu</a></li>
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-1" className="nav-link" onClick={(e) => this.filterDataTransaction(e, 'Diproses')}>Diproses</a></li>
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-2" className="nav-link" onClick={(e) => this.filterDataTransaction(e, 'Dikirim')}>Dikirim</a></li>
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-3" className="nav-link" onClick={(e) => this.filterDataTransaction(e, 'Diterima')}>Diterima</a></li>
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-4" className="nav-link" onClick={(e) => this.filterDataTransaction(e, 'Dikeluhkan')}>Dikeluhkan</a></li>
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-5" className="nav-link" onClick={(e) => this.filterDataTransaction(e, 'Selesai')}>Selesai</a></li>
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-6" className="nav-link" onClick={(e) => this.filterDataTransaction(e, 'Dibatalkan')}>Dibatalkan</a></li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="tab-eg115-0" role="tabpanel" >
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={data}
                                            />
                                        </div>
                                        <div className="tab-pane" id="tab-eg115-1" role="tabpanel">
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={dataongoing}
                                            />
                                        </div>
                                        <div className="tab-pane" id="tab-eg115-2" role="tabpanel">
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={dataonshipped}
                                            />
                                        </div>
                                        <div className="tab-pane" id="tab-eg115-3" role="tabpanel">
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={dataonreceived}
                                            />
                                        </div>
                                        <div className="tab-pane" id="tab-eg115-4" role="tabpanel">
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={dataoncomplained}
                                            />
                                        </div>
                                        <div className="tab-pane" id="tab-eg115-5" role="tabpanel">
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={dataonfinished}
                                            />
                                        </div>
                                        <div className="tab-pane" id="tab-eg115-6" role="tabpanel">
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={dataoncanceled}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal size="xl" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Detail Transaksi #{this.state.id_transaction}</ModalHeader>
                    <ModalBody>
                        <div className="card-header card-header-tab-animation">
                            <ul className="nav nav-justified">
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-0-transaction" className="active nav-link">Informasi Pembeli</a></li>
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-1-transaction" className="nav-link">Informasi Penjual</a></li>
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-2-transaction" className="nav-link">Informasi Transaksi</a></li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content">
                                <div className="tab-pane active" id="tab-eg115-0-transaction" role="tabpanel">
                                    <div style={{ marginTop: '3%' }}>
                                        <div className="row">
                                            <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Lengkap Pembeli</p>
                                                <p className="mb-0"> {this.state.nama}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Pengguna Pembeli  </p>
                                                <p className="mb-0"> {this.state.username}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Email Pembeli</p>
                                                <p className="mb-0"> {this.state.email}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Telepon Pembeli</p>
                                                <p className="mb-0"> {this.state.telepon}</p>
                                            </div>
                                            <div style={{ width: '50%', float: 'right', paddingLeft: '3%' }}>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Perusahaan</p>
                                                <p className="mb-0"> {this.state.company_name_transaction}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Tipe Bisnis Perusahaan</p>
                                                <p className="mb-0"> {this.state.company_type_bisnis}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Email Perusahaan</p>
                                                <p className="mb-0"> {this.state.company_email_transaction}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Telepon Perusahaan</p>
                                                <p className="mb-0"> {this.state.company_contact_transaction}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-eg115-1-transaction" role="tabpanel">
                                    <div style={{ marginTop: '3%' }}>
                                        <div className="row">
                                            <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Perusahaan</p>
                                                <p className="mb-0"> {this.state.company_name_seller_transaction} - {this.state.company_kode_seller_transaction}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Tipe Bisnis Perusahaan</p>
                                                <p className="mb-0"> {this.state.company_seller_type_bisnis}</p>
                                            </div>
                                            <div style={{ width: '50%', float: 'right', paddingLeft: '3%' }}>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Email Perusahaan</p>
                                                <p className="mb-0"> {this.state.company_email_seller_transaction}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Telepon Perusahaan</p>
                                                <p className="mb-0"> {this.state.company_contact_seller_transaction}</p>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '3%' }} className="row">
                                            <div style={{ width: '100%', paddingLeft: '3%' }}>
                                                <MDBDataTable
                                                    bordered
                                                    striped
                                                    responsive
                                                    data={dataAlamatSeller}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-eg115-2-transaction" role="tabpanel">
                                    <div style={{ marginTop: '3%' }}>
                                        <div className="row">
                                            <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Transaksi </p>
                                                <p className="mb-0"> {this.state.status === 'WAITING' ? 'Menunggu'
                                                    : this.state.status === 'ONGOING' ? 'Diproses'
                                                        : this.state.status === 'SHIPPED' ? 'Dikirim'
                                                            : this.state.status === 'RECEIVED' ? 'Diterima'
                                                                : this.state.status === 'COMPLAINED' ? 'Diadukan'
                                                                    : this.state.status === 'FINISHED' ? 'Selesai' : 'Dibatalkan'}</p>
                                                {
                                                    this.state.status === 'CANCELED' ? <p className="mb-0">Keterangan : {this.state.cancel_reason} </p>
                                                        : null
                                                }
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Alamat Pengiriman </p>
                                                <p className="mb-0"> {this.state.alamat_shipto}</p>
                                                <p className="mb-0"> {this.state.kelurahan_shipto}, {this.state.kecamatan_shipto}</p>
                                                <p className="mb-0"> {this.state.kota_shipto}, {this.state.provinsi_shipto} {this.state.kodepos_shipto}</p>
                                            </div>
                                            <div style={{ width: '50%', float: 'right', paddingLeft: '3%' }}>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Transaksi</p>
                                                <p className="mb-0"> {this.state.create_date}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Alamat Penagihan </p>
                                                <p className="mb-0"> {this.state.alamat_billto}</p>
                                                <p className="mb-0"> {this.state.kelurahan_billto}, {this.state.kecamatan_billto}</p>
                                                <p className="mb-0"> {this.state.kota_billto}, {this.state.provinsi_billto} {this.state.kodepos_billto}</p>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '3%' }} className="row">
                                            <div style={{ width: '100%', paddingLeft: '3%' }}>
                                                {
                                                    (this.state.status === 'WAITING' || this.state.status === 'CANCELED') ?
                                                        <MDBDataTable
                                                            bordered
                                                            striped
                                                            responsive
                                                            hover
                                                            data={dataDetailedOrder}
                                                        />
                                                        : <MDBDataTable
                                                            bordered
                                                            striped
                                                            responsive
                                                            hover
                                                            data={dataDetailedOrdernonWaiting}
                                                        />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    getDataTransactionsAPI: (data) => dispatch(getDataTransactionsAPI(data)),
    getDataAlamatAPI: (data) => dispatch(getDataAlamatAPI(data)),
    getDataDetailedAlamatTransactionAPI: (data) => dispatch(getDataDetailedAlamatTransactionAPI(data)),
    getDataDetailedTransactionBuyerSuperAdminAPI: (data) => dispatch(getDataDetailedTransactionBuyerSuperAdminAPI(data)),
    getDataDetailedTransactionSellerSuperAdminAPI: (data) => dispatch(getDataDetailedTransactionSellerSuperAdminAPI(data)),
    getDataDetailedOrderAPI: (data) => dispatch(getDataDetailedOrderAPI(data)),
    checkIdTransactionCanceled: (data) => dispatch(checkIdTransactionCanceled(data)),
    updateTransactionStatus: (data) => dispatch(updateTransactionStatus(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentTransaksiSuperAdmin));