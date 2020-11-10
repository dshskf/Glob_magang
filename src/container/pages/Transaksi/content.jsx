import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { encrypt, decrypt } from '../../../config/lib';
import NumberFormat from 'react-number-format';
import swal from 'sweetalert';
import {
    getDataTransactionsAPI, getDataDetailedTransactionAPI, getDataTypeCancelReason, getDataDetailedOrderAPI, updateTransactionStatus, getDataDetailedAlamatTransactionAPI,
    insertTransactionReceived, getDataDetailedSalesTransactionAPI, getDataSalesTransactionAPI, getDataTransactionComplainedAPI,
    getPPNBarang, checkIdTransactionCanceled, totalBeranda, getDataLimitHariTransaksi, checkIdTransactionReceivedToFinished, logoutUserAPI, postQuery
} from '../../../config/redux/action';
import { MDBDataTable } from 'mdbreact';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import './Transaksi.css'
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle,
    Col, Input, FormGroup, Label, Card, CardImg, CardBody, CardTitle, CardText, FormFeedback
} from 'reactstrap'
import io from 'socket.io-client'
import moment from 'moment';
import 'moment/locale/id'
import Toast from 'light-toast';

import { socket_uri } from '../../../config/services/socket'
import { enc } from 'crypto-js';

class ContentTransaksi extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        allDataTransaction: [],
        tmpfilteredDataTransaction: [],
        allFilteredDataTransaction: [],
        allFilteredDataTransactionByPayment: [],
        allDetailedOrder: [],
        allDetailedOrderNonWaiting: [],
        allTransactionComplained: [],
        allSales: [],
        detailStatusPembayaran: null,
        id_transaction_ref: null,
        foto_transaction_ref: null,
        pemilik_rekening: null,
        statusFilter: 'Menunggu',
        statusFilterPayment: false,
        isOpenFilterPayment: false,
        isOpen: false,
        isOpenConfirm: false,
        isOpenReceivedConfirm: false,
        isOpenBuktiTransfer: false,
        isOpenDropdownStatusPayment: false,
        isOpenConfirmCancel: false,
        isOpenUbahTanggalPengirimanKirim: false,
        updateTanggalPengirimanKirim: null,
        selectedFilterPayment: 'Semua',
        id: '',
        id_transaction: '',
        company_name_transaction: '',
        company_email_transaction: '',
        company_contact_transaction: '',
        company_type_bisnis_transaction: '',
        company_tipe_bisnis: '',
        catatan_logistik: '',
        status: '',
        status_payment: '',
        payment_name: '',
        foto_bukti_payment: '',
        create_date: '',
        update_date: '',
        date_ongoing: '',
        date_onshipped: '',
        date_onreceived: '',
        date_oncomplained: '',
        date_onfinished: '',
        date_oncanceled: '',
        date_confirm_admin: '',
        username: '',
        nama: '',
        email: '',
        telepon: '',
        total: '',
        total_with_ongkir: '',
        ongkos_kirim: '',
        total_without_ongkir_onconfirm: '',
        ongkos_kirim_onconfirm: '',
        kurs_rate: '',
        buyer_number_mapping: '',
        tgl_permintaan_kirim: '',
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
        cancel_reason: '',
        approval_by_admin: '',
        approval_by_sales: '',
        id_sales: '',
        pembanding_id_sales: '',
        nama_sales: '',
        kode_sales: '',
        ongkir: '',
        status_aksi_transaksi: '',
        notes_cancel_transaksi: '',
        empty_notes_cancel_transaksi: false,
        isOpenDropdownSalesTransaction: false,
        isOpenDropdownTypeCancelTransaction: false,
        isCheckedCatatanLogistic: false,
        id_cancel_reason: '0',
        nama_jenis_cancel_reason: '',
        alltypecancelreason: [],
        isBtnCancelReason: true,
        // startDate: moment().subtract(29, 'days'),       // sebulan lalu
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
        allTransactionToCanceled: [],
        isBtnRefreshTransaction: false,
        isOpenAttentionJumlahOrderKosong: false,
        total_berat_dipenuhi: '',
        total_berat_awal: '',
        company_info_ppn: '',
        limit_hari_transaksi_selesai: '',
        limit_hari_transaksi_selesai_selected: '',
        limit_hari_transaksi_selesai_inserted: '',
        isOpenLimitHariTransaksi: false,
        isOpenModalLimitHariTransaksi: false,
        isOpenLimitHariTransaksiForInsert: false,
        isOpenModalLimitHariTransaksiForInsert: false,
        isOpenConfirmLimitHariTransaksi: false,
        isOpenDetailStatusPembayaran: false,
        countDataLimitHari: 0,
        isBtnUpdateLimitHariTransaksi: true,
        isBtnInsertLimitHariTransaksi: true,
        feedback_limit_hari_transaksi: '',
        empty_limit_hari_transaksi: false,
        flag_limit_transaksi: '',
        allTransactionToFinished: [],
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

    async componentDidMount() {
        // let socket = io(socket_uri)

        // socket.on('transaction_from_user', async (data) => {
        //     if (data.type === 'admin') {
        //         await this.loadData()
        //     } else if (data.type === 'sales') {
        //         await this.loadData()
        //     }
        // })
        navigator.serviceWorker.addEventListener("message", async (message) => {
            await this.loadData()
        })
        await this.loadData()
    }


    loadData = async () => {
        await this.loadDataTransactions("0")
        await this.checkDataCanceledTransactions()
        if (this.state.allTransactionToCanceled.length > 0) {
            await this.updateTransactionToCanceled()
        }
        await this.checkDataLimitHari()
        if (this.state.countDataLimitHari > 0) {
            await this.loadDataLimitHari()
            await this.checkDataFinishedTransactions()
            if (this.state.allTransactionToFinished.length > 0) {
                await this.updateTransactionToFinished()
            }
        }
    }

    checkDataLimitHari = async () => {
        let passquerycountlimithari = encrypt("select count(id) as total from gcm_limit_complain " +
            "where company_id=" + this.state.company_id)
        const res = await this.props.totalBeranda({ query: passquerycountlimithari }).catch(err => err)
        if (res) {
            this.setState({
                countDataLimitHari: Number(res.total)
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    loadDataLimitHari = async () => {
        let passquerylimithari = encrypt("select limit_hari from gcm_limit_complain " +
            "where company_id=" + this.state.company_id + " limit 1;")
        const res = await this.props.getDataLimitHariTransaksi({ query: passquerylimithari }).catch(err => err)
        if (res) {
            this.setState({
                limit_hari_transaksi_selesai: Number(res.limit_hari),
                limit_hari_transaksi_selesai_selected: Number(res.limit_hari)
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    loadDataTransactions = async (flag) => {
        let passquery = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.sa_role==='sales'  && this.state.tipe_bisnis === '1') {
            //     passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, "+
            //         "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY') create_date, "+
            //         "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin "+
            //         "from gcm_transaction_detail "+
            //     "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //     "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //     "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //     "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' and gcm_master_company.tipe_bisnis="+this.state.sa_divisi+" group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, "+
            //         "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin order by gcm_master_transaction.create_date desc;")
            // } else {
            //     passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, "+
            //         "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY') create_date, "+
            //         "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin "+
            //         "from gcm_transaction_detail "+
            //     "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //     "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //     "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //     "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, "+
            //         "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin order by gcm_master_transaction.create_date desc;")
            // }
            if (this.state.sa_role === 'sales') {
                passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, " +
                    "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, " +
                    "to_char(gcm_master_transaction.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin, " +
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
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login + " group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, " +
                    "gcm_master_transaction.date_ongoing, gcm_master_transaction.date_shipped, gcm_master_transaction.date_received, gcm_master_transaction.date_complained, " +
                    "gcm_master_transaction.date_finished, gcm_master_transaction.date_canceled, " +
                    "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin order by gcm_master_transaction.create_date desc;")
            } else {
                passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, " +
                    "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, " +
                    "to_char(gcm_master_transaction.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin, " +
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
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, " +
                    "gcm_master_transaction.date_ongoing, gcm_master_transaction.date_shipped, gcm_master_transaction.date_received, gcm_master_transaction.date_complained, " +
                    "gcm_master_transaction.date_finished, gcm_master_transaction.date_canceled, " +
                    "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin order by gcm_master_transaction.create_date desc;")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, "+
            //         "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY') create_date, "+
            //         "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin "+
            //         "from gcm_transaction_detail "+
            //     "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //     "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //     "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //     "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_company.tipe_bisnis="+this.state.sa_divisi+" group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, "+
            //         "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin order by gcm_master_transaction.create_date desc;")
            // } else {
            //     passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, "+
            //         "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY') create_date, "+
            //         "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin "+
            //         "from gcm_transaction_detail "+
            //     "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //     "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //     "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //     "'::TIMESTAMP + '1 days'::INTERVAL group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, "+
            //         "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin order by gcm_master_transaction.create_date desc;")
            // }
            if (this.state.sa_role === 'sales') {
                passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, " +
                    "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, " +
                    "to_char(gcm_master_transaction.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin, " +
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
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login + " group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, " +
                    "gcm_master_transaction.date_ongoing, gcm_master_transaction.date_shipped, gcm_master_transaction.date_received, gcm_master_transaction.date_complained, " +
                    "gcm_master_transaction.date_finished, gcm_master_transaction.date_canceled, " +
                    "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin order by gcm_master_transaction.create_date desc;")
            } else {
                passquery = encrypt("select gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, " +
                    "gcm_master_transaction.status, to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY  HH24:MI:SS') create_date, " +
                    "to_char(gcm_master_transaction.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin, " +
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
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL group by gcm_master_transaction.id_transaction, gcm_master_company.nama_perusahaan, gcm_master_transaction.status, gcm_master_transaction.create_date, " +
                    "gcm_master_transaction.date_ongoing, gcm_master_transaction.date_shipped, gcm_master_transaction.date_received, gcm_master_transaction.date_complained, " +
                    "gcm_master_transaction.date_finished, gcm_master_transaction.date_canceled, " +
                    "gcm_master_transaction.update_date, gcm_master_transaction.status_payment, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin order by gcm_master_transaction.create_date desc;")
            }
        }
        const res = await this.props.getDataTransactionsAPI({ query: passquery }).catch(err => err)
        if (res) {
            res.map((user, index) => {
                return (
                    res[index].status_approval =
                    <center>
                        <div className="mb-2 mr-2 badge badge-primary">
                            {user.approval_by_sales === null && user.approval_by_admin === null ? 'Menunggu konfirmasi'
                                : user.approval_by_sales !== null && user.approval_by_admin === null ? 'Menunggu konfirmasi administrator' : ''}</div>
                    </center>,
                    res[index].keterangan =
                    <center>
                        <div>
                            <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                                onClick={(e) => this.handleDetailTransaction(e, res[index].id_transaction, res[index].status)}>Lihat Detail
                                </button>
                        </div>
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
            if (flag === '1') {
                swal({
                    title: "Sukses!",
                    text: "Data transaksi berhasil diperbarui!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {

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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
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

    handleDetailTransaction = async (e, id, status) => {
        this.handleModalDetail()
        e.stopPropagation();
        let passquerydetailtransaction = ""
        if (status === 'Menunggu' || status === 'Dibatalkan') {
            passquerydetailtransaction = encrypt("select gcm_master_transaction.id, gcm_master_transaction.id_transaction, gcm_master_transaction.bukti_bayar,gcm_master_transaction.tanggal_bayar," +
                "gcm_master_transaction.pemilik_rekening, gcm_master_company.nama_perusahaan, gcm_master_company.email as company_email, gcm_master_company.no_telp, " +
                "gcm_master_transaction.id_transaction_ref, gcm_master_transaction.foto_transaction_ref, gcm_master_transaction.status, case when gcm_master_transaction.status_payment = 'UNPAID' " +
                "then case when gcm_master_transaction.id_list_bank is null then 'menunggu pembayaran' else 'menunggu verifikasi' end else 'pembayaran selesai' end as status_payment, " +
                "to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, to_char(gcm_master_transaction.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, " +
                "gcm_master_user.nama, gcm_master_user.username, gcm_master_user.email, gcm_master_transaction.ongkos_kirim, gcm_master_transaction.log_logistik, " +
                "gcm_master_user.no_hp, sum(gcm_transaction_detail.harga) as total, " +
                "to_char(gcm_master_transaction.tgl_permintaan_kirim, 'DD/MM/YYYY') tgl_permintaan_kirim," +
                "(sum(gcm_transaction_detail.harga)+gcm_master_transaction.ongkos_kirim) as total_with_ongkir, " +
                "gcm_master_category.nama as company_type_bisnis_transaction, " +
                "gcm_master_transaction.shipto_id, gcm_master_transaction.billto_id, gcm_master_company.tipe_bisnis, " +
                "gcm_master_transaction.cancel_reason, gcm_master_payment.payment_name, " +
                "gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin, gcm_master_transaction.id_sales, " +
                "to_char(gcm_master_transaction.date_ongoing, 'DD/MM/YYYY HH24:MI:SS') date_ongoing, " +
                "to_char(gcm_master_transaction.date_shipped, 'DD/MM/YYYY HH24:MI:SS') date_shipped, " +
                "to_char(gcm_master_transaction.date_received, 'DD/MM/YYYY HH24:MI:SS') date_received, " +
                "to_char(gcm_master_transaction.date_complained, 'DD/MM/YYYY HH24:MI:SS') date_complained, " +
                "to_char(gcm_master_transaction.date_finished, 'DD/MM/YYYY HH24:MI:SS') date_finished, " +
                "to_char(gcm_master_transaction.date_canceled, 'DD/MM/YYYY HH24:MI:SS') date_canceled, " +
                "to_char(gcm_master_transaction.date_confirm_admin, 'DD/MM/YYYY HH24:MI:SS') date_confirm_admin, " +
                "gcm_master_transaction.kurs_rate, gcm_company_listing.buyer_number_mapping, gcm_master_transaction.ppn_seller " +
                "from gcm_master_transaction " +
                "inner join gcm_master_company on gcm_master_transaction.company_id=gcm_master_company.id " +
                "inner join gcm_company_listing on gcm_master_company.id=gcm_company_listing.buyer_id " +
                "inner join gcm_master_user on gcm_master_transaction.create_by=gcm_master_user.id " +
                "inner join gcm_transaction_detail on gcm_master_transaction.id_transaction=gcm_transaction_detail.transaction_id " +
                "inner join gcm_master_category on gcm_master_category.id = gcm_master_company.tipe_bisnis " +
                "inner join gcm_payment_listing on gcm_master_transaction.payment_id = gcm_payment_listing.id " +
                "inner join gcm_seller_payment_listing on gcm_payment_listing.payment_id = gcm_seller_payment_listing.id " +
                "inner join gcm_master_payment on gcm_seller_payment_listing.payment_id = gcm_master_payment.id " +
                "where gcm_master_transaction.id_transaction='" + id + "' and gcm_company_listing.seller_id=" + this.state.company_id +
                " group by gcm_master_transaction.id, gcm_master_transaction.id_transaction, gcm_company_listing.buyer_number_mapping, " +
                "gcm_master_company.nama_perusahaan, gcm_master_company.email, gcm_master_company.no_telp, gcm_master_company.tipe_bisnis, " +
                "gcm_master_transaction.status, gcm_master_transaction.status_payment, gcm_master_transaction.create_date, gcm_master_transaction.ongkos_kirim, " +
                "gcm_master_transaction.update_date, gcm_master_user.nama, gcm_master_user.username, gcm_master_user.email, gcm_master_transaction.tgl_permintaan_kirim, " +
                "gcm_master_user.no_hp, gcm_master_transaction.kurs_rate, gcm_master_category.nama, gcm_master_transaction.shipto_id, gcm_master_transaction.billto_id, " +
                "gcm_master_transaction.date_ongoing, gcm_master_transaction.date_shipped, gcm_master_transaction.date_received, gcm_master_transaction.date_complained, " +
                "gcm_master_transaction.date_finished, gcm_master_transaction.date_canceled, gcm_master_transaction.date_confirm_admin, gcm_master_transaction.ppn_seller, " +
                "gcm_master_transaction.cancel_reason, gcm_master_payment.payment_name, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin, gcm_master_transaction.id_sales, gcm_master_transaction.id_list_bank," +
                "gcm_master_transaction.bukti_bayar,gcm_master_transaction.tanggal_bayar,gcm_master_transaction.pemilik_rekening,gcm_master_transaction.id_transaction_ref,gcm_master_transaction.foto_transaction_ref, gcm_master_transaction.log_logistik;"
            )
        } else {
            passquerydetailtransaction = encrypt("select gcm_master_transaction.id, gcm_master_transaction.id_transaction, gcm_master_transaction.bukti_bayar,gcm_master_transaction.tanggal_bayar," +
                "gcm_master_transaction.pemilik_rekening,gcm_master_transaction.id_transaction_ref,gcm_master_transaction.foto_transaction_ref," +
                "gcm_master_company.nama_perusahaan, gcm_master_company.email as company_email, gcm_master_company.no_telp, " +
                "gcm_master_transaction.status, case when gcm_master_transaction.status_payment = 'UNPAID' then case when gcm_master_transaction.id_list_bank is null " +
                "then 'menunggu pembayaran' else 'menunggu verifikasi' end else 'pembayaran selesai' end as status_payment, " +
                "to_char(gcm_master_transaction.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, to_char(gcm_master_transaction.update_date, 'DD/MM/YYYY HH24:MI:SS') update_date, " +
                "gcm_master_user.nama, gcm_master_user.username, gcm_master_user.email, " +
                "to_char(gcm_master_transaction.tgl_permintaan_kirim, 'DD/MM/YYYY') tgl_permintaan_kirim," +
                "(sum(gcm_transaction_detail.harga_final)+gcm_master_transaction.ongkos_kirim) as total_with_ongkir, " +
                "gcm_master_user.no_hp, sum(gcm_transaction_detail.harga_final) as total, gcm_master_category.nama as company_type_bisnis_transaction, " +
                "gcm_master_transaction.shipto_id, gcm_master_transaction.billto_id, gcm_master_company.tipe_bisnis, " +
                "gcm_master_transaction.cancel_reason, gcm_master_payment.payment_name, gcm_master_transaction.ongkos_kirim, gcm_master_transaction.log_logistik, " +
                "gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin, gcm_master_transaction.id_sales, " +
                "to_char(gcm_master_transaction.date_ongoing, 'DD/MM/YYYY HH24:MI:SS') date_ongoing, " +
                "to_char(gcm_master_transaction.date_shipped, 'DD/MM/YYYY HH24:MI:SS') date_shipped, " +
                "to_char(gcm_master_transaction.date_received, 'DD/MM/YYYY HH24:MI:SS') date_received, " +
                "to_char(gcm_master_transaction.date_complained, 'DD/MM/YYYY HH24:MI:SS') date_complained, " +
                "to_char(gcm_master_transaction.date_finished, 'DD/MM/YYYY HH24:MI:SS') date_finished, " +
                "to_char(gcm_master_transaction.date_canceled, 'DD/MM/YYYY HH24:MI:SS') date_canceled, " +
                "to_char(gcm_master_transaction.date_confirm_admin, 'DD/MM/YYYY HH24:MI:SS') date_confirm_admin, " +
                "gcm_master_transaction.kurs_rate, gcm_company_listing.buyer_number_mapping, gcm_master_transaction.ppn_seller " +
                "from gcm_master_transaction " +
                "inner join gcm_master_company on gcm_master_transaction.company_id=gcm_master_company.id " +
                "inner join gcm_company_listing on gcm_master_company.id=gcm_company_listing.buyer_id " +
                "inner join gcm_master_user on gcm_master_transaction.create_by=gcm_master_user.id " +
                "inner join gcm_transaction_detail on gcm_master_transaction.id_transaction=gcm_transaction_detail.transaction_id " +
                "inner join gcm_master_category on gcm_master_category.id = gcm_master_company.tipe_bisnis " +
                "inner join gcm_payment_listing on gcm_master_transaction.payment_id = gcm_payment_listing.id " +
                "inner join gcm_seller_payment_listing on gcm_payment_listing.payment_id = gcm_seller_payment_listing.id " +
                "inner join gcm_master_payment on gcm_seller_payment_listing.payment_id = gcm_master_payment.id " +
                "where gcm_master_transaction.id_transaction='" + id + "' and gcm_company_listing.seller_id=" + this.state.company_id +
                " group by gcm_master_transaction.id, gcm_master_transaction.id_transaction, gcm_company_listing.buyer_number_mapping, " +
                "gcm_master_company.nama_perusahaan, gcm_master_company.email, gcm_master_company.no_telp, gcm_master_company.tipe_bisnis, " +
                "gcm_master_transaction.status, gcm_master_transaction.status_payment, gcm_master_transaction.create_date, gcm_master_transaction.ongkos_kirim, " +
                "gcm_master_transaction.update_date, gcm_master_user.nama, gcm_master_user.username, gcm_master_user.email, " +
                "gcm_master_transaction.tgl_permintaan_kirim, gcm_master_transaction.ppn_seller, " +
                "gcm_master_transaction.date_ongoing, gcm_master_transaction.date_shipped, gcm_master_transaction.date_received, gcm_master_transaction.date_complained, " +
                "gcm_master_transaction.date_finished, gcm_master_transaction.date_canceled, gcm_master_transaction.date_confirm_admin, " +
                "gcm_master_user.no_hp, gcm_master_transaction.kurs_rate, gcm_master_category.nama, gcm_master_transaction.shipto_id, gcm_master_transaction.billto_id, " +
                "gcm_master_transaction.cancel_reason, gcm_master_payment.payment_name, gcm_master_transaction.approval_by_sales, gcm_master_transaction.approval_by_admin, gcm_master_transaction.id_sales,gcm_master_transaction.id_list_bank," +
                "gcm_master_transaction.bukti_bayar,gcm_master_transaction.tanggal_bayar,gcm_master_transaction.pemilik_rekening,gcm_master_transaction.id_transaction_ref,gcm_master_transaction.foto_transaction_ref, gcm_master_transaction.log_logistik;"

            )
        }

        const resdetail = await this.props.getDataDetailedTransactionAPI({ query: passquerydetailtransaction }).catch(err => err)

        if (resdetail) {
            await this.setState({
                id: decrypt(resdetail.id),
                id_transaction: resdetail.id_transaction,
                id_transaction_ref: resdetail.id_transaction_ref,
                foto_transaction_ref: resdetail.foto_transaction_ref,
                company_name_transaction: resdetail.company_name_transaction,
                company_email_transaction: resdetail.company_email_transaction,
                company_contact_transaction: resdetail.company_contact_transaction,
                company_type_bisnis_transaction: resdetail.company_type_bisnis_transaction,
                company_tipe_bisnis: resdetail.tipe_bisnis,
                status: resdetail.status,
                status_payment: resdetail.status_payment,
                payment_name: resdetail.payment_name,
                create_date: resdetail.create_date,
                update_date: resdetail.update_date,
                date_ongoing: resdetail.date_ongoing,
                date_onshipped: resdetail.date_onshipped,
                date_onreceived: resdetail.date_onreceived,
                date_oncomplained: resdetail.date_oncomplained,
                date_onfinished: resdetail.date_onfinished,
                date_oncanceled: resdetail.date_oncanceled,
                date_confirm_admin: resdetail.date_confirm_admin,
                username: resdetail.username,
                nama: resdetail.nama,
                email: resdetail.email,
                telepon: resdetail.telepon,
                total: resdetail.total,
                kurs_rate: resdetail.kurs_rate,
                shipto: resdetail.shipto_id,
                billto: resdetail.billto_id,
                cancel_reason: resdetail.cancel_reason,
                approval_by_sales: resdetail.approval_by_sales,
                approval_by_admin: resdetail.approval_by_admin,
                id_sales: resdetail.id_sales,
                pembanding_id_sales: resdetail.id_sales,
                buyer_number_mapping: resdetail.buyer_number_mapping,
                total_with_ongkir: resdetail.total_with_ongkir,
                ongkos_kirim: resdetail.ongkos_kirim,
                total_without_ongkir_onconfirm: resdetail.total,
                ongkos_kirim_onconfirm: (resdetail.ongkos_kirim === null ? '' : resdetail.ongkos_kirim),
                tgl_permintaan_kirim: resdetail.tgl_permintaan_kirim,
                company_info_ppn: Number(resdetail.ppn_seller),
                bukti_bayar: resdetail.bukti_bayar,
                tanggal_bayar: resdetail.tanggal_bayar,
                pemilik_rekening: resdetail.pemilik_rekening,
                catatan_logistik: resdetail.log_logistik,
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
                const res = this.props.logoutAPI();
                if (res) {
                    // this.props.history.push('/admin')
                    // window.location.reload()
                }
            });
        }
        await this.loadDataSales(this.state.company_id, this.state.company_tipe_bisnis)
        await this.loadDetailedOrder(this.state.id_transaction, this.state.status)
        await this.loadTransactionComplained(this.state.id_transaction)
        await this.loadAlamatShipTo(this.state.shipto, this.state.id_transaction)
        await this.loadAlamatBillTo(this.state.billto, this.state.id_transaction)
        if (this.state.id_sales !== null) {
            await this.loadSales(this.state.id_sales)
        }
    }

    loadDataSales = async (id, tipe_bisnis) => {
        let passqueryallsales = encrypt("select gcm_master_user.id, gcm_master_user.nama, gcm_master_user.kode_sales " +
            "from gcm_master_user " +
            "inner join gcm_master_company on gcm_master_user.company_id = gcm_master_company.id " +
            "where gcm_master_user.company_id=" + id)
        const resallsales = await this.props.getDataSalesTransactionAPI({ query: passqueryallsales }).catch(err => err)
        if (resallsales) {
            this.setState({
                allSales: resallsales
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    loadDetailedOrder = async (id_transaction, status) => {

        // let passquerydetailedorder =  encrypt("select gcm_transaction_detail.id, gcm_master_barang.nama, gcm_transaction_detail.qty, "+
        //     "concat(gcm_transaction_detail.qty, ' x ', cast(gcm_list_barang.jumlah_min_beli as int), ' ', gcm_master_satuan.alias) as show_qty, "+
        //     "concat(gcm_transaction_detail.qty, ' (@', cast(gcm_list_barang.jumlah_min_beli as int), ' ', gcm_master_satuan.alias) as show_qty_for_received, "+
        //     "gcm_transaction_detail.harga from gcm_transaction_detail "+ 
        //         "inner join gcm_list_barang on gcm_transaction_detail.barang_id=gcm_list_barang.id "+
        //         "inner join gcm_master_barang on gcm_list_barang.barang_id=gcm_master_barang.id "+
        //         "inner join gcm_master_satuan on gcm_master_barang.satuan=gcm_master_satuan.id "+
        //     "where gcm_transaction_detail.transaction_id= '"+id_transaction+"' order by gcm_master_barang.nama asc")
        let passquerydetailedorder = ""
        if (status === 'WAITING' || status === 'CANCELED') {
            console.log('hei1')
            passquerydetailedorder = encrypt("select gcm_list_barang.kode_barang, gcm_transaction_detail.id, gcm_transaction_detail.transaction_id, " +
                "gcm_transaction_detail.barang_id, gcm_transaction_detail.harga_asli, gcm_master_barang.berat, " +
                "gcm_master_barang.nama, gcm_transaction_detail.qty," +
                "concat(gcm_transaction_detail.qty, ' x ', cast(gcm_master_barang.berat as int), ' ', gcm_master_satuan.alias) as show_qty, " +
                "concat(gcm_transaction_detail.qty, ' (@', cast(gcm_master_barang.berat as int), ' ', gcm_master_satuan.alias, ')') as show_qty_for_received, " +
                "gcm_transaction_detail.harga, gcm_transaction_detail.harga_kesepakatan,  gcm_transaction_detail.note from gcm_transaction_detail " +
                "inner join gcm_list_barang on gcm_transaction_detail.barang_id=gcm_list_barang.id " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id=gcm_master_barang.id " +
                "inner join gcm_master_satuan on gcm_master_barang.satuan=gcm_master_satuan.id " +
                "where gcm_transaction_detail.transaction_id= '" + id_transaction + "' order by gcm_master_barang.nama asc")

        } else {
            passquerydetailedorder = encrypt("select gcm_list_barang.kode_barang, gcm_transaction_detail.id, gcm_transaction_detail.transaction_id, " +
                "gcm_transaction_detail.barang_id, gcm_transaction_detail.harga_asli, gcm_master_barang.berat, " +
                "gcm_master_barang.nama, gcm_transaction_detail.qty, " +
                "concat(gcm_transaction_detail.qty, ' x ', cast(gcm_master_barang.berat as int), ' ', gcm_master_satuan.alias) as show_qty, " +
                "concat(gcm_transaction_detail.qty, ' (@', cast(gcm_master_barang.berat as int), ' ', gcm_master_satuan.alias, ')') as show_qty_for_received, " +
                "gcm_transaction_detail.qty_dipenuhi, " +
                "concat(gcm_transaction_detail.qty_dipenuhi, ' x ', cast(gcm_master_barang.berat as int), ' ', gcm_master_satuan.alias) as show_qty_dipenuhi, " +
                "concat(gcm_transaction_detail.qty_dipenuhi, ' (@', cast(gcm_master_barang.berat as int), ' ', gcm_master_satuan.alias, ')') as show_qty_for_dipenuhi, " +
                "gcm_transaction_detail.harga, gcm_transaction_detail.harga_kesepakatan, gcm_transaction_detail.harga_final, " +
                "gcm_transaction_detail.batch_number, gcm_transaction_detail.exp_date,gcm_transaction_detail.id,gcm_transaction_detail.note " +
                "from gcm_transaction_detail " +
                "inner join gcm_list_barang on gcm_transaction_detail.barang_id=gcm_list_barang.id " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id=gcm_master_barang.id " +
                "inner join gcm_master_satuan on gcm_master_barang.satuan=gcm_master_satuan.id " +
                "where gcm_transaction_detail.transaction_id= '" + id_transaction + "' order by gcm_master_barang.nama asc")
        }
        const resdetailedorder = await this.props.getDataDetailedOrderAPI({ query: passquerydetailedorder }).catch(err => err)
        console.log(resdetailedorder)
        if (resdetailedorder) {
            if (status === 'WAITING' || status === 'CANCELED') {
                resdetailedorder.map((user, index) => {
                    return (
                        resdetailedorder[index].harga =
                        <div className="text-right">
                            <NumberFormat value={user.harga} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat>
                        </div>,
                        resdetailedorder[index].pure_show_qty = user.show_qty,
                        resdetailedorder[index].show_qty =
                        <p className="mb-0" style={{ textAlign: 'center' }}>{user.show_qty}</p>,
                        resdetailedorder[index].nama =
                        <div>
                            <p className="mb-0">{user.kode_barang} | {user.nama}</p>
                            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}><b>Catatan:</b> {user.note}</p>
                        </div>
                    )
                })
                this.setState({
                    allDetailedOrder: resdetailedorder
                })
            } else {
                resdetailedorder.map((user, index) => {
                    return (
                        resdetailedorder[index].harga_final =
                        <div className="text-right">
                            <NumberFormat value={user.harga_final} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat>
                        </div>,
                        resdetailedorder[index].show_qty =
                        <p className="mb-0" style={{ textAlign: 'center' }}>{user.show_qty}</p>,
                        resdetailedorder[index].show_qty_dipenuhi =
                        <p className="mb-0" style={{ textAlign: 'center' }}>{user.show_qty_dipenuhi}</p>,
                        resdetailedorder[index].exp_date =
                        <p className="mb-0" style={{ textAlign: 'center' }}>{user.exp_date}</p>,
                        resdetailedorder[index].batch_number =
                        <p className="mb-0" style={{ textAlign: 'center' }}>{user.batch_number}</p>,
                        resdetailedorder[index].nama =
                        <div>
                            <p className="mb-0">{user.kode_barang} | {user.nama}</p>
                            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}><b>Catatan:</b> {user.note}</p>
                        </div>
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    loadAlamatBillTo = async (id_billto, id_transaction) => {
        let passqueryalamatbillto = encrypt("select gcm_master_alamat.alamat, gcm_master_kelurahan.nama as kelurahan, gcm_master_kecamatan.nama as kecamatan, " +
            "gcm_master_city.nama as kota, gcm_master_provinsi.nama as provinsi, gcm_master_alamat.kodepos, gcm_master_alamat.no_telp " +
            "from gcm_master_alamat " +
            "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id " +
            "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id " +
            "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id " +
            "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id " +
            "inner join gcm_master_transaction on gcm_master_transaction.billto_id = gcm_master_alamat.id " +
            "where gcm_master_transaction.billto_id = " + id_billto + " and gcm_master_transaction.id_transaction = '" + id_transaction + "'")
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    loadSales = async (id) => {
        let passquerysales = encrypt("select gcm_master_user.nama, gcm_master_user.kode_sales " +
            "from gcm_master_user " +
            "where gcm_master_user.id = " + id)
        const ressales = await this.props.getDataDetailedSalesTransactionAPI({ query: passquerysales }).catch(err => err)
        if (ressales) {
            this.setState({
                nama_sales: ressales.kode_sales + " | " + ressales.nama_sales,
                kode_sales: ressales.kode_sales
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    handleDropDownSalesTransaction = () => {
        this.setState({
            isOpenDropdownSalesTransaction: !this.state.isOpenDropdownSalesTransaction
        })
    }

    populateSales = (id, nama, kode_sales) => {
        this.setState({
            id_sales: id,
            nama_sales: kode_sales + " | " + nama
        })
    }

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            status_aksi_transaksi: ''
        })
    }

    handleModalConfirmAdmin = async () => {
        let length = this.state.allDetailedOrder.length
        let jml = 0
        let jml_berat_dipenuhi = 0
        let jml_berat_awal = 0
        for (var i = 0; i < length; i++) {
            jml = jml + Number((document.getElementById('jml-' + i).value === '' ? '0' : document.getElementById('jml-' + i).value))
            jml_berat_dipenuhi = jml_berat_dipenuhi + (Number((document.getElementById('jml-' + i).value === '' ? '0' :
                document.getElementById('jml-' + i).value)) * this.state.allDetailedOrder[i].berat)
            jml_berat_awal = jml_berat_awal + (Number(this.state.allDetailedOrder[i].qty * this.state.allDetailedOrder[i].berat))
        }
        await this.setState({ total_berat_dipenuhi: jml_berat_dipenuhi, total_berat_awal: jml_berat_awal })
        if (jml === 0) {
            this.handleModalAttentionJumlahOrderKosong()
        } else {
            this.setState({
                isOpenConfirm: !this.state.isOpenConfirm
            })
        }
    }

    handleModalConfirm = async () => {
        this.setState({
            isOpenConfirm: !this.state.isOpenConfirm
        })
    }

    handleModalConfirmCancel = () => {
        this.loadTypeCancelReason()
        this.setState({
            isOpenConfirmCancel: !this.state.isOpenConfirmCancel,
            status_aksi_transaksi: 'Cancel',
            id_cancel_reason: '0',
            nama_jenis_cancel_reason: '',
            notes_cancel_transaksi: '',
            empty_notes_cancel_transaksi: false,
            isBtnCancelReason: true
        })
    }

    loadTypeCancelReason = async () => {
        let passquerytypecancelreason = encrypt("select * from gcm_master_reason;")
        const restypecancelreason = await this.props.getDataTypeCancelReason({ query: passquerytypecancelreason }).catch(err => err)
        if (restypecancelreason) {
            this.setState({
                alltypecancelreason: restypecancelreason
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    handleModalBuktiTransfer = () => {
        this.setState({
            isOpenBuktiTransfer: !this.state.isOpenBuktiTransfer
        })
    }

    handleDropdownStatusPayment = () => {
        this.setState({
            isOpenDropdownStatusPayment: !this.state.isOpenDropdownStatusPayment
        })
    }

    handleModalReceivedConfirm = () => {
        this.setState({
            isOpenReceivedConfirm: !this.state.isOpenReceivedConfirm,
            ongkos_kirim_onconfirm: ''
        })
    }

    changeStatusPayment = (e) => {
        this.setState({
            status_payment: e
        })
    }



    confirmAction = async () => {
        Toast.loading('Loading...');
        let waiting = "WAITING"
        let ongoing = "ONGOING"
        let shipped = "SHIPPED"
        let received = "RECEIVED"
        let canceled = "CANCELED"
        let complained = "COMPLAINED"
        let passqueryupdatestatustransaksi = ""

        let status_payment = this.state.status_payment === 'menunggu pembayaran' ? 'UNPAID' : 'PAID'
        let log_logistik = this.state.catatan_logistik ?
            `'${this.state.catatan_logistik}'`
            :
            `NULL`

        const set_catatan_logistik = {
            field: this.state.isCheckedCatatanLogistic ? ', log_logistik=' : '',
            value: this.state.isCheckedCatatanLogistic ? this.state.catatan_logistik : ''
        }

        if (this.state.status === waiting) {

            if (this.state.status_aksi_transaksi === 'Cancel') {
                // passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='"+canceled+"', status_payment='"+this.state.status_payment+
                //     "', update_by='"+this.state.id_pengguna_login+"', cancel_reason='"+this.state.notes_cancel_transaksi+"', update_date=now(), id_sales='"+this.state.id_pengguna_login+"', "+
                //     "id_cancel_reason='"+this.state.id_cancel_reason+"' "+
                //     "where id="+this.state.id+" returning status;")
                if (this.state.approval_by_sales === null) {
                    passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + canceled + "', status_payment='" + status_payment +
                        "', update_by='" + this.state.id_pengguna_login + "', cancel_reason='" + this.state.notes_cancel_transaksi + "', date_canceled=now(), log_logistik=" + log_logistik + "," +
                        "date_confirm_admin=now(), update_date=now(), id_cancel_reason='" + this.state.id_cancel_reason + "' " +
                        "where id=" + this.state.id + " returning status;")
                } else {
                    passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + canceled + "', status_payment='" + status_payment +
                        "', update_by='" + this.state.id_pengguna_login + "', cancel_reason='" + this.state.notes_cancel_transaksi + "', date_canceled=now(), log_logistik=" + log_logistik + "," +
                        "date_confirm_admin=now(), id_cancel_reason='" + this.state.id_cancel_reason + "' " +
                        "where id=" + this.state.id + " returning status;")
                }

            } else {
                if (this.state.sa_role === 'admin') {
                    if ((Number(this.state.ongkos_kirim) === 0 && this.state.ongkos_kirim !== null)) {
                        if (this.state.approval_by_sales === null) {
                            passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + ongoing + "', status_payment='" + status_payment +
                                "', update_by='" + this.state.id_pengguna_login + "', update_date=now(), date_confirm_admin=now(), date_ongoing=now(), approval_by_admin='" + this.state.id_pengguna_login + "', id_sales='" + this.state.id_sales + "', " +
                                "approval_by_sales='" + this.state.id_pengguna_login + "', log_logistik=" + log_logistik + " " +
                                "where id=" + this.state.id + " returning status;")
                        } else {
                            passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + ongoing + "', status_payment='" + status_payment +
                                "', update_by='" + this.state.id_pengguna_login + "', date_confirm_admin=now(), date_ongoing=now(), approval_by_admin='" + this.state.id_pengguna_login + "', id_sales='" + this.state.id_sales + "', " +
                                "approval_by_sales='" + this.state.id_sales + "', log_logistik=" + log_logistik + " " +
                                "where id=" + this.state.id + " returning status;")
                        }
                    } else if (this.state.ongkos_kirim === null) {
                        if (this.state.approval_by_sales === null) {
                            passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + ongoing + "', status_payment='" + status_payment +
                                "', update_by='" + this.state.id_pengguna_login + "', update_date=now(), date_confirm_admin=now(), date_ongoing=now(), approval_by_admin='" + this.state.id_pengguna_login + "', id_sales='" + this.state.id_sales + "', " +
                                "ongkos_kirim='" + this.state.ongkos_kirim_onconfirm + "', " +
                                "approval_by_sales='" + this.state.id_pengguna_login + "', log_logistik=" + log_logistik + " " +
                                "where id=" + this.state.id + " returning status;")
                        } else {
                            passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + ongoing + "', status_payment='" + status_payment +
                                "', update_by='" + this.state.id_pengguna_login + "', date_confirm_admin=now(), date_ongoing=now(), approval_by_admin='" + this.state.id_pengguna_login + "', id_sales='" + this.state.id_sales + "', " +
                                "ongkos_kirim='" + this.state.ongkos_kirim_onconfirm + "', " +
                                "approval_by_sales='" + this.state.id_sales + "', log_logistik=" + log_logistik + " " +
                                "where id=" + this.state.id + " returning status;")
                        }
                    } else {
                        if (this.state.approval_by_sales === null) {
                            passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + ongoing + "', status_payment='" + status_payment +
                                "', update_by='" + this.state.id_pengguna_login + "', update_date=now(), date_confirm_admin=now(), date_ongoing=now(), approval_by_admin='" + this.state.id_pengguna_login + "', id_sales='" + this.state.id_sales + "', " +
                                "ongkos_kirim='" + Number(Number(this.state.ongkos_kirim) / Number(this.state.total_berat_awal) * Number(this.state.total_berat_dipenuhi)) + "', " +
                                "approval_by_sales='" + this.state.id_pengguna_login + "', log_logistik=" + log_logistik + " " +
                                "where id=" + this.state.id + " returning status;")
                        } else {
                            passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + ongoing + "', status_payment='" + status_payment +
                                "', update_by='" + this.state.id_pengguna_login + "', date_confirm_admin=now(), date_ongoing=now(), approval_by_admin='" + this.state.id_pengguna_login + "', id_sales='" + this.state.id_sales + "', " +
                                "ongkos_kirim='" + Number(Number(this.state.ongkos_kirim) / Number(this.state.total_berat_awal) * Number(this.state.total_berat_dipenuhi)) + "', " +
                                "approval_by_sales='" + this.state.id_sales + "', log_logistik=" + log_logistik + " " +
                                "where id=" + this.state.id + " returning status;")
                        }
                    }
                    this.handleUpdateTransactionDetail()
                } else {
                    passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status_payment='" + status_payment +
                        "', update_by='" + this.state.id_pengguna_login + "', update_date=now(), approval_by_sales='" + this.state.id_pengguna_login + "', id_sales='" + this.state.id_pengguna_login + "' " + set_catatan_logistik.field + set_catatan_logistik.value +
                        " where id=" + this.state.id + " returning status;")
                }
                // this.handleConfirmReceived()
            }
        } else if (this.state.status === ongoing) {
            // this.handleConfirmReceived()
            passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + received + "', update_by='" +
                this.state.id_pengguna_login + "', date_received=now() where id=" + this.state.id + " returning status;")
        } else if (this.state.status === shipped) {
            passqueryupdatestatustransaksi = encrypt("update gcm_master_transaction set status='" + received + "', update_by='" +
                this.state.id_pengguna_login + "', date_received=now() where id=" + this.state.id + " returning status;")
        } else if (this.state.status === complained) {
            passqueryupdatestatustransaksi = encrypt(`update gcm_master_transaction set status='FINISHED', date_finished=now() where id=${this.state.id} returning status`)
        }
        const resupdatestatustransaksi = await this.props.updateTransactionStatus({ query: passqueryupdatestatustransaksi }).catch(err => err)
        Toast.hide();
        if (resupdatestatustransaksi) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.loadDataTransactions("0")
                window.location.reload()
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

    handleUpdateTransactionDetail = async () => {
        let queryawal =
            "with new_order as (" +
            "update gcm_transaction_detail as gtd set " +
            "qty_dipenuhi = c.qty_dipenuhi, harga_final = c.harga_final, " +
            "batch_number = c.batch_number, exp_date = c.exp_date " +
            "from (values "
        let queryloop = ""
        let length = this.state.allDetailedOrder.length
        for (var i = 0; i < length; i++) {
            let harga_final = 0
            let detail_transaction_id = this.state.allDetailedOrder[i].id
            let batch_number = (document.getElementById('batch_number-' + i).value) === '' ? '-' : document.getElementById('batch_number-' + i).value
            let expired_date = (document.getElementById('expired_date-' + i).value) === '' ? '-' : document.getElementById('expired_date-' + i).value
            let jml = (document.getElementById('jml-' + i).value === '' ? '0' : document.getElementById('jml-' + i).value)
            //kasih if nego atau beli straight
            harga_final = jml * this.state.allDetailedOrder[i].harga_kesepakatan * this.state.allDetailedOrder[i].berat
            queryloop = queryloop + "(" + detail_transaction_id + ", " + jml + ", " + harga_final + ", '" + batch_number + "', '" + expired_date + "')"
            if (i < length - 1) {
                queryloop = queryloop.concat(",")
            } else {
                queryloop = queryloop.concat(") as c(id, qty_dipenuhi, harga_final, batch_number, exp_date) where c.id=gtd.id returning gtd.transaction_id) " +
                    "select new_order.transaction_id from new_order limit 1;")
                // update ongkir durung digarap
            }
        }
        let querygabung = encrypt(queryawal.concat(queryloop))
        const resupdatestatustransaksi = await this.props.updateTransactionStatus({ query: querygabung }).catch(err => err)
        if (resupdatestatustransaksi) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.loadDataTransactions("0")
                window.location.reload()
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

    handleConfirmReceived = async () => {
        let queryinsertawal = "insert into gcm_transaction_received (detail_transaction_id, " +
            "batch_number, exp_date, qty, create_by, update_by) values "
        let contentloop = ""
        let length = this.state.allDetailedOrder.length
        for (var i = 0; i < length; i++) {
            let detail_transaction_id = this.state.allDetailedOrder[i].id
            // tanya Chris
            let batch_number = document.getElementById('batch_number-' + i).value
            let expired_date = document.getElementById('expired_date-' + i).value
            let jml = document.getElementById('jml-' + i).value
            contentloop = contentloop + "('" + detail_transaction_id + "', '" + batch_number + "', '" +
                expired_date + "', '" + jml + "', '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "')"
            if (i < length - 1) {
                contentloop = contentloop.concat(",")
            } else {
                contentloop = contentloop.concat(" returning detail_transaction_id;")
            }
        }
        let passqueryinserttransactionreceived = encrypt(queryinsertawal.concat(contentloop))
        const resinserttransactionreceived = await this.props.insertTransactionReceived({ query: passqueryinserttransactionreceived }).catch(err => err)
        if (resinserttransactionreceived) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.loadDataTransactions("0")
                window.location.reload()
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

    loadTransactionComplained = async (id_transaction) => {
        let passquerytransactioncomplained = encrypt("select gcm_list_barang.foto, gcm_master_barang.nama, gcm_transaction_complain.detail_transaction_id, " +
            "gcm_transaction_complain.jenis_complain, gcm_transaction_complain.notes_complain " +
            "from gcm_transaction_complain " +
            "inner join gcm_transaction_detail on gcm_transaction_complain.detail_transaction_id = gcm_transaction_detail.id " +
            "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
            "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
            "where gcm_transaction_detail.transaction_id='" + id_transaction + "'")
        const restransactioncomplained = await this.props.getDataTransactionComplainedAPI({ query: passquerytransactioncomplained }).catch(err => err)
        if (restransactioncomplained) {
            this.setState({
                allTransactionComplained: restransactioncomplained
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    handleEvent = (event, picker) => {
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate,
        });
        this.loadDataTransactions("0")
    }

    handleChange = async (event) => {
        if (event.target.name !== 'ongkos_kirim_onconfirm') {
            this.setState({
                [event.target.name]: event.target.value
            })
        } else {
            this.setState({
                [event.target.name]: event.target.value.split('.').join('').split(',').join('.')
            })
        }
        if (event.target.name === 'notes_cancel_transaksi') {
            this.check_notes_cancel_transaksi(event.target.value)
        }
        if (event.target.name === 'ongkos_kirim_onconfirm') {
            this.check_ongkir(event.target.value)
        }
    }

    handleChangeJumlah = (event, index, max) => {
        let get_data = document.getElementById('jml-' + index).value.toString().length
        if (Number(document.getElementById('jml-' + index).value) > Number(max) ||
            (document.getElementById('jml-' + index).value.charAt(0) === '0' && document.getElementById('jml-' + index).value.charAt(1) === '0')) {
            document.getElementById('jml-' + index).value = document.getElementById('jml-' + index).value.slice(0, get_data - 1)
        }
    }

    check_ongkir = (x) => {
        if (x === '') {
            document.getElementById('errorharga').style.display = 'block'
            this.setState({ errormessage: 'Kolom ini harus diisi', isBtnInsert: true })
        } else {
            document.getElementById('errorharga').style.display = 'none'
            this.setState({ errormessage: '', isBtnInsert: false })
        }
    }

    handleWhiteSpace = (e) => {
        if (e.which === 32 && !e.target.value.length) {
            e.preventDefault()
        }
    }

    check_notes_cancel_transaksi = (e) => {
        if (e === '') {
            this.setState({ empty_notes_cancel_transaksi: true, isBtnCancelReason: true })
        } else {
            this.setState({ empty_notes_cancel_transaksi: false })
            if (this.state.id_cancel_reason === '0') {
                this.setState({ isBtnCancelReason: true })
            } else {
                this.setState({ isBtnCancelReason: false })
            }
        }
    }

    handleDropDownTypeCancelTransaction = () => {
        this.setState({
            isOpenDropdownTypeCancelTransaction: !this.state.isOpenDropdownTypeCancelTransaction
        })
    }

    populateTypeCancelTransaction = (id, nama) => {
        this.setState({
            id_cancel_reason: id,
            nama_jenis_cancel_reason: nama
        })
    }

    handleRefreshTransaction = async () => {
        await this.setState({ isBtnRefreshTransaction: true })
        await this.checkDataCanceledTransactions()
        if (this.state.allTransactionToCanceled.length > 0) {
            await this.updateTransactionToCanceled()
        }
        await this.checkDataLimitHari()
        if (this.state.countDataLimitHari > 0) {
            await this.loadDataLimitHari()
            await this.checkDataFinishedTransactions()
            if (this.state.allTransactionToFinished.length > 0) {
                await this.updateTransactionToFinished()
            }
        }
        await this.loadDataTransactions("1")
        await this.setState({ isBtnRefreshTransaction: false })
    }

    checkDataFinishedTransactions = async () => {
        let passqueryidtofinished = encrypt("select gcm_master_transaction.id_transaction from gcm_master_transaction " +
            "inner join gcm_payment_listing on gcm_master_transaction.payment_id = gcm_payment_listing.id " +
            "inner join gcm_seller_payment_listing on gcm_payment_listing.payment_id = gcm_seller_payment_listing.id " +
            "inner join gcm_master_payment on gcm_seller_payment_listing.payment_id = gcm_master_payment.id " +
            "inner join gcm_transaction_detail on gcm_master_transaction.id_transaction = gcm_transaction_detail.transaction_id " +
            "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
            "where gcm_master_transaction.status = 'RECEIVED' and gcm_list_barang.company_id=" + this.state.company_id +
            "and now() > gcm_master_transaction.date_received + interval '" + this.state.limit_hari_transaksi_selesai + " days'")
        const restransactiontofinished = await this.props.checkIdTransactionReceivedToFinished({ query: passqueryidtofinished }).catch(err => err)
        if (restransactiontofinished) {
            await this.setState({
                allTransactionToFinished: restransactiontofinished
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    updateTransactionToFinished = async () => {
        let rowFailed = ""
        for (let i = 0; i < this.state.allTransactionToFinished.length; i++) {
            let passqueryupdatestatustransaksi = encrypt("select func_change_to_finished('" +
                this.state.allTransactionToFinished[i].id_transaction + "');")
            const resupdatestatustransaksi = await this.props.updateTransactionStatus({ query: passqueryupdatestatustransaksi }).catch(err => err)
            if (resupdatestatustransaksi) {

            } else {
                rowFailed = rowFailed.concat(i + 1)
                if (i < this.state.allTransactionToFinished.length - 1) {
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

    checkDataCanceledTransactions = async () => {
        let passqueryidtocanceled = encrypt("select gcm_master_transaction.id_transaction from gcm_master_transaction " +
            "inner join gcm_payment_listing on gcm_master_transaction.payment_id = gcm_payment_listing.id " +
            "inner join gcm_seller_payment_listing on gcm_payment_listing.payment_id = gcm_seller_payment_listing.id " +
            "inner join gcm_master_payment on gcm_seller_payment_listing.payment_id = gcm_master_payment.id " +
            "inner join gcm_transaction_detail on gcm_master_transaction.id_transaction = gcm_transaction_detail.transaction_id " +
            "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
            "where gcm_master_transaction.status = 'WAITING' and gcm_list_barang.company_id=" + this.state.company_id +
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
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

    handleModalAttentionJumlahOrderKosong = () => {
        this.setState({ isOpenAttentionJumlahOrderKosong: !this.state.isOpenAttentionJumlahOrderKosong })
    }

    handleLimitHariTransaksi = () => {
        this.setState({ isOpenLimitHariTransaksi: !this.state.isOpenLimitHariTransaksi })
    }

    handleModalLimitHariTransaksi = () => {
        this.setState({
            isOpenModalLimitHariTransaksi: !this.state.isOpenModalLimitHariTransaksi,
            feedback_limit_hari_transaksi: '',
            empty_limit_hari_transaksi: false,
            flag_limit_transaksi: 'update'
        })
    }

    handleModalLimitHariTransaksiForInsert = () => {
        this.setState({
            isOpenModalLimitHariTransaksiForInsert: !this.state.isOpenModalLimitHariTransaksiForInsert,
            feedback_limit_hari_transaksi: '',
            empty_limit_hari_transaksi: false,
            flag_limit_transaksi: 'insert'
        })
    }

    handleWhiteSpaceNumber = (e) => {
        if ((e.which === 32 && !e.target.value.length) || e.which === 32) {
            e.preventDefault()
        }
    }

    handleChangeLimitTransaksi = (event) => {
        if (event.target.name === 'limit_hari_transaksi_selesai_selected') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                this.check_limit_hari_transaksi(event.target.value)
            }
        }
        if (event.target.name === 'limit_hari_transaksi_selesai_inserted') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                this.check_limit_hari_transaksi_inserted(event.target.value)
            }
        }
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    check_limit_hari_transaksi = async (x) => {
        if (x === '') {
            await this.setState({ isBtnUpdateLimitHariTransaksi: true })
            await this.setState({ empty_limit_hari_transaksi: true, feedback_limit_hari_transaksi: 'Kolom ini wajib diisi' })
        } else {
            await this.setState({ isBtnUpdateLimitHariTransaksi: false })
            await this.setState({ empty_limit_hari_transaksi: false, feedback_limit_hari_transaksi: '' })
        }
    }

    check_limit_hari_transaksi_inserted = async (x) => {
        if (x === '') {
            await this.setState({ isBtnInsertLimitHariTransaksi: true })
            await this.setState({ empty_limit_hari_transaksi: true, feedback_limit_hari_transaksi: 'Kolom ini wajib diisi' })
        } else {
            await this.setState({ isBtnInsertLimitHariTransaksi: false })
            await this.setState({ empty_limit_hari_transaksi: false, feedback_limit_hari_transaksi: '' })
        }
    }

    handleModalConfirmLimitHariTransaksi = () => {
        this.setState({ isOpenConfirmLimitHariTransaksi: !this.state.isOpenConfirmLimitHariTransaksi })
    }

    confirmActionLimitHariTransaksi = async () => {
        Toast.loading('Loading...');
        let passquerylimitharitransaksi = ""
        if (this.state.flag_limit_transaksi === 'insert') {
            passquerylimitharitransaksi = encrypt("select func_change_limit_finished(" + this.state.company_id + ", " + this.state.limit_hari_transaksi_selesai_inserted + ");")
        } else {
            passquerylimitharitransaksi = encrypt("select func_change_limit_finished(" + this.state.company_id + ", " + this.state.limit_hari_transaksi_selesai_selected + ");")
        }
        const resupdateslimithari = await this.props.updateTransactionStatus({ query: passquerylimitharitransaksi }).catch(err => err)
        Toast.hide();
        if (resupdateslimithari) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.loadDataTransactions("0")
                window.location.reload()
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

    handleSelesaikanPesanan = async () => {
        const query = `update gcm_master_transaction set status='FINISHED', date_finished=now() where id=${this.state.id} returning id`
        const resUpdate = await this.props.updateTransactionStatus({ query: encrypt(query) }).catch(err => err)
        if (resUpdate) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.loadDataTransactions("0")
                window.location.reload()
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

    handleModalUbahTanggalPengiriman = () => {
        this.setState({
            isOpenUbahTanggalPengirimanKirim: !this.state.isOpenUbahTanggalPengirimanKirim
        })
    }

    handleUbahPengirimanInput = e => {
        console.log(e.target.value)
        this.setState({
            updateTanggalPengirimanKirim: e.target.value
        })
    }

    updateTanggalPengirimanKirim = async () => {
        const query = encrypt(`update gcm_master_transaction set tgl_permintaan_kirim ='${this.state.updateTanggalPengirimanKirim}' 
        where id=${this.state.id} returning *`)

        const post_update_pengiriman = await this.props.postQuery({ query: query })
        if (post_update_pengiriman) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.loadDataTransactions("0")
                window.location.reload()
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

    handleDisabledKonfirmasiWaiting = () => {
        return this.state.id_sales !== null ?
            this.state.payment_name === 'Advance Payment' && this.state.status_payment === 'UNPAID' ?
                true : false
            : true
    }


    handleDetailsStatusPembayaranModal = async () => {
        const query = encrypt(`select gmt.tanggal_bayar,gmt.bukti_bayar,gmt.pemilik_rekening as pemilik_rekening_pembeli,gmb.nama as nama_bank,glb.* 
        from gcm_master_transaction gmt
        inner join gcm_listing_bank glb on gmt.id_list_bank=glb.id
        left join gcm_master_bank gmb on glb.id_bank = gmb.id
        where gmt.id=${this.state.id}`)

        const resdetail = await this.props.postQuery({ query: query }).catch(err => err)
        if (resdetail) {
            this.setState({ detailStatusPembayaran: resdetail[0] })
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


        this.setState({
            isOpenDetailStatusPembayaran: !this.state.isOpenDetailStatusPembayaran
        })
    }

    updateDetailStatusPembayaran = async () => {
        const query = encrypt(`
            update gcm_master_transaction set status_payment = 'PAID', update_by=  '${this.state.id_pengguna_login}', update_date = now() where 
            status = 'WAITING' and id_transaction = '${this.state.id_transaction}' returning *
        `)
        console.log(decrypt(query))
        const postQuery = await this.props.postQuery({ query: query }).catch(err => err)

        if (postQuery) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                // window.location.reload()
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

    toogleCheckedCatatanLogistik = () => {
        this.setState({
            isCheckedCatatanLogistic: !this.state.isCheckedCatatanLogistic
        })
    }



    render() {
        let start = this.state.startDate.format('DD MMMM YYYY');
        let end = this.state.endDate.format('DD MMMM YYYY');
        let label = start + ' - ' + end;
        if (start === end) { label = start; }
        const statusFilterPayment = this.state.statusFilterPayment
        const dataonwaiting = {
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
                    label: 'Status Konfirmasi',
                    field: 'status_approval',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Tanggal Transaksi',
                    field: 'create_date',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'Terakhir Diperbarui',
                    field: 'update_date',
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
                // {
                //     label: 'Kode Barang Distributor',
                //     field: 'kode_barang'
                // },
                {
                    label: 'Kode Barang Distributor | Nama Barang',
                    field: 'nama',
                    sort: 'asc'
                },
                {
                    label: 'Jumlah Order',
                    field: 'show_qty',
                    minimal: 'lg'
                },
                {
                    label: 'Total Harga',
                    field: 'harga',
                    minimal: 'lg'
                }],
            rows: this.state.allDetailedOrder
        }
        const dataDetailedOrdernonwaiting = {
            columns: [
                // {
                //     label: 'Kode Barang Distributor',
                //     field: 'kode_barang'
                // },
                {
                    label: 'Kode Barang Distributor | Nama Barang',
                    field: 'nama',
                    sort: 'asc'
                },
                {
                    label: 'Nomor Batch',
                    field: 'batch_number'
                },
                {
                    label: 'Tanggal Kedaluwarsa',
                    field: 'exp_date'
                },
                {
                    label: 'Jumlah Order',
                    field: 'show_qty'
                },
                {
                    label: 'Jumlah Order Dipenuhi',
                    field: 'show_qty_dipenuhi'
                },
                {
                    label: 'Total Harga',
                    field: 'harga_final'
                }],
            rows: this.state.allDetailedOrderNonWaiting
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
                                    <div className="page-title-subheading">Daftar transaksi yang terkait pada {this.state.company_name}
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
                                <div className="row" style={{ paddingTop: '2%' }}>
                                    {
                                        (this.state.sa_role === 'admin') ?
                                            <ButtonDropdown direction="left" isOpen={this.state.isOpenLimitHariTransaksi} toggle={this.handleLimitHariTransaksi}>
                                                <DropdownToggle caret color="danger" title="Limit Hari Transaksi Selesai">
                                                    &nbsp;&nbsp;Limit Hari Transaksi Selesai :
                                                    {(this.state.countDataLimitHari > 0) ?
                                                        " " + this.state.limit_hari_transaksi_selesai + " hari" :
                                                        " Belum ditentukan"}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem disabled>Limit Hari Transaksi Selesai : &nbsp;&nbsp;
                                                    {(this.state.countDataLimitHari > 0) ?
                                                            " " + this.state.limit_hari_transaksi_selesai + " hari" :
                                                            " Belum ditentukan"}
                                                    </DropdownItem>
                                                    <DropdownItem onClick=
                                                        {(this.state.countDataLimitHari > 0) ?
                                                            this.handleModalLimitHariTransaksi
                                                            : this.handleModalLimitHariTransaksiForInsert}>Perbarui </DropdownItem>
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                            : <button className="mr-2 btn btn-danger">Limit Hari Transaksi Selesai :
                                            {(this.state.countDataLimitHari > 0) ?
                                                    " " + this.state.limit_hari_transaksi_selesai + " hari" :
                                                    " Belum ditentukan"}
                                            </button>
                                    }
                                </div>
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
                                                data={dataonwaiting}
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
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-0-transaction" className="active nav-link">Informasi Transaksi</a></li>
                                <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-1-transaction" className="nav-link">Data Transaksi</a></li>
                                {this.state.status === 'COMPLAINED' ?
                                    <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-2-transaction" className="nav-link">Daftar Aduan</a></li>
                                    : null
                                }
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content">
                                {
                                    (this.state.sa_role === 'admin' && this.state.status === 'WAITING') ?
                                        <div className="alert alert-danger fade show" role="alert">Harap perhatikan Kode Sales Distributor pada tab Data Transaksi!</div>
                                        : null
                                }
                                <div className="tab-pane active" id="tab-eg115-0-transaction" role="tabpanel">
                                    <div style={{ marginTop: '3%' }} className="row">
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
                                            <p className="mb-0"> {this.state.company_name_transaction} - {this.state.buyer_number_mapping}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Tipe Bisnis Perusahaan</p>
                                            <p className="mb-0"> {this.state.company_type_bisnis_transaction}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Email Perusahaan</p>
                                            <p className="mb-0"> {this.state.company_email_transaction}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Telepon Perusahaan</p>
                                            <p className="mb-0"> {this.state.company_contact_transaction}</p>
                                        </div>
                                        {
                                            // in here this.handleSelesaikanPesanan
                                            this.state.status === "COMPLAINED" ?
                                                <Button color="primary" onClick={this.handleModalConfirm} style={{ marginLeft: "80%", marginTop: '2rem' }} >Selesaikan Pesanan</Button>
                                                :
                                                null
                                        }

                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-eg115-1-transaction" role="tabpanel">
                                    <div className="row" style={{ marginTop: '3%' }}>
                                        <div className="flex-parent">
                                            {
                                                (this.state.statusFilter) !== 'Dibatalkan' ?
                                                    <div className="input-flex-container">
                                                        <div className={
                                                            (this.state.approval_by_sales === null && this.state.statusFilter === 'Menunggu') ?
                                                                "input active" : "input"
                                                        }>
                                                            {this.state.approval_by_sales === null ?
                                                                <span data-year="Menunggu Konfirmasi" data-info={null}></span>
                                                                : <span data-year="Menunggu Konfirmasi" data-info={this.state.update_date}></span>
                                                            }
                                                        </div>
                                                        <div className={
                                                            (this.state.approval_by_sales !== null && this.state.statusFilter === 'Menunggu') ?
                                                                "input active" : "input"
                                                        }>
                                                            <span data-year="Konfirmasi Administrator" data-info=
                                                                {(this.state.approval_by_sales !== null && this.state.approval_by_admin !== null) ?
                                                                    this.state.date_confirm_admin : null
                                                                }>
                                                            </span>
                                                        </div>
                                                        <div className={
                                                            (this.state.statusFilter === 'Diproses') ?
                                                                "input active" : "input"
                                                        }>
                                                            <span data-year="Diproses" data-info={this.state.date_ongoing}></span>
                                                        </div>
                                                        <div className={
                                                            (this.state.statusFilter === 'Dikirim') ?
                                                                "input active" : "input"
                                                        }>
                                                            <span data-year="Dikirim" data-info={this.state.date_onshipped}></span>
                                                        </div>
                                                        <div className={
                                                            (this.state.statusFilter === 'Diterima') ?
                                                                "input active" : "input"
                                                        }>
                                                            <span data-year="Diterima" data-info={this.state.date_onreceived}></span>
                                                        </div>
                                                        {
                                                            (this.state.date_oncomplained !== null) ?
                                                                <div className={
                                                                    (this.state.statusFilter === 'Dikeluhkan') ?
                                                                        "input active" : "input"
                                                                }>
                                                                    <span data-year="Dikeluhkan" data-info={this.state.date_oncomplained}></span>
                                                                </div>
                                                                : (this.state.date_oncomplained === null && this.state.statusFilter === 'Selesai') ?
                                                                    null
                                                                    : <div className="input">
                                                                        <span data-year="Dikeluhkan" data-info={this.state.date_oncomplained}></span>
                                                                    </div>
                                                        }
                                                        <div className={
                                                            (this.state.statusFilter === 'Selesai') ?
                                                                "input active" : "input"
                                                        }>
                                                            <span data-year="Selesai" data-info={this.state.date_onfinished}></span>
                                                        </div>
                                                        {
                                                            (this.state.create_date !== null && this.state.update_date !== null &&
                                                                this.state.date_ongoing !== null) ? null
                                                                :
                                                                <div className={
                                                                    (this.state.statusFilter === 'Dibatalkan') ?
                                                                        "input active" : "input"
                                                                }>
                                                                    <span data-year="Dibatalkan" data-info={this.state.date_oncanceled}></span>
                                                                </div>
                                                        }
                                                    </div>
                                                    :
                                                    <div className="input-flex-container">
                                                        <div className={
                                                            (this.state.approval_by_sales === null && this.state.statusFilter === 'Menunggu') ?
                                                                "input active" : "input"
                                                        }>
                                                            <span data-year="Menunggu Konfirmasi" data-info={this.state.create_date}></span>
                                                        </div>
                                                        <div className={
                                                            (this.state.approval_by_sales !== null && this.state.statusFilter === 'Menunggu') ?
                                                                "input active" : "input"
                                                        }>
                                                            <span data-year="Konfirmasi Administrator" data-info={this.state.date_confirm_admin}></span>
                                                        </div>
                                                        {
                                                            <div className={
                                                                (this.state.statusFilter === 'Dibatalkan') ?
                                                                    "input active" : "input"
                                                            }>
                                                                <span data-year="Dibatalkan" data-info={this.state.date_oncanceled}></span>
                                                            </div>
                                                        }
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="row" style={{ marginTop: '5%' }}>
                                        <div style={{ width: '100%' }}>
                                            <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Transaksi</p>
                                                {
                                                    (this.state.approval_by_sales === null && this.state.approval_by_admin === null && this.state.status === 'WAITING') ?
                                                        <p className="mb-0">Menunggu Konfirmasi</p>
                                                        : (this.state.approval_by_sales !== null && this.state.approval_by_admin === null && this.state.status === 'WAITING') ?
                                                            <p className="mb-0">Menunggu Konfirmasi Administrator</p>
                                                            : <p className="mb-0"> {this.state.status === 'WAITING' ? 'Menunggu'
                                                                : this.state.status === 'ONGOING' ? 'Diproses'
                                                                    : this.state.status === 'SHIPPED' ? 'Dikirim'
                                                                        : this.state.status === 'RECEIVED' ? 'Diterima'
                                                                            : this.state.status === 'COMPLAINED' ? 'Diadukan'
                                                                                : this.state.status === 'FINISHED' ? 'Selesai' : 'Dibatalkan'}</p>
                                                }
                                                {/* <p className="mb-0"> {this.state.status === 'WAITING' ? 'Menunggu'
                                                    : this.state.status === 'ONGOING' ? 'Diproses'
                                                    : this.state.status === 'RECEIVED' ? 'Diterima'
                                                    : this.state.status === 'COMPLAINED' ? 'Diadukan'
                                                    : this.state.status === 'FINISHED' ? 'Selesai': 'Dibatalkan'}</p> */}
                                                {/* <p className="mb-0" style={{fontWeight:'bold'}}> Status Pembayaran  </p>
                                                <p className="mb-0"> {this.state.status_payment === 'PAID' ? 'Lunas' : 'Belum Lunas'}</p> */}
                                                {
                                                    this.state.status === 'CANCELED' ? <p className="mb-0">Keterangan : {this.state.cancel_reason} </p>
                                                        : null
                                                }
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Transaksi  </p>
                                                <p className="mb-0"> {this.state.create_date}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Permintaan Kirim  </p>
                                                <p className="mb-0"> {(this.state.tgl_permintaan_kirim === null ? 'Tidak ditentukan' : this.state.tgl_permintaan_kirim)}</p>
                                                {
                                                    this.state.status === 'WAITING' &&
                                                    <p
                                                        onClick={this.handleModalUbahTanggalPengiriman}
                                                        style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}
                                                    >Ubah</p>
                                                }
                                                <Modal size="md" toggle={this.handleModalUbahTanggalPengiriman} isOpen={this.state.isOpenUbahTanggalPengirimanKirim} backdrop="static" keyboard={false}>
                                                    <ModalHeader toggle={this.handleModalUbahTanggalPengiriman}>Ubah Tanggal Pengiriman</ModalHeader>
                                                    <ModalBody>
                                                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                                            <FormGroup>
                                                                <Input type="date" placeholder="Tanggal Perminataan Kirim" onChange={this.handleUbahPengirimanInput} />
                                                                <p style={{ color: 'red', fontSize: '12px', marginLeft: '10px' }}>*Harap perhatikan format tanggal</p>
                                                            </FormGroup>
                                                        </div>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="primary" disabled={this.state.updateTanggalPengirimanKirim === null} onClick={this.updateTanggalPengirimanKirim}>Update</Button>
                                                        <Button color="danger" onClick={this.handleModalUbahTanggalPengiriman}>Batal</Button>
                                                    </ModalFooter>
                                                </Modal>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Alamat Pengiriman </p>
                                                <p className="mb-0"> {this.state.alamat_shipto}</p>
                                                <p className="mb-0"> {this.state.kelurahan_shipto}, {this.state.kecamatan_shipto}</p>
                                                <p className="mb-0"> {this.state.kota_shipto}, {this.state.provinsi_shipto} {this.state.kodepos_shipto}</p>
                                                <p className="mb-0"> {this.state.no_telp_shipto}</p>
                                            </div>
                                            <div style={{ width: '50%', float: 'right', paddingLeft: '3%' }}>
                                                {/* <p className="mb-0" style={{fontWeight:'bold'}}> ID Transaksi</p>
                                                <p className="mb-0"> {this.state.id_transaction}</p> */}
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Sales Distributor </p>
                                                {
                                                    (this.state.sa_role === 'sales') ?
                                                        <p className="mb-0"> {(this.state.id_sales === null ? 'Belum ditentukan' : this.state.nama_sales)}</p>
                                                        : (this.state.sa_role === 'admin' && this.state.status === 'WAITING' && this.state.pembanding_id_sales === null) ?
                                                            <ButtonDropdown isOpen={this.state.isOpenDropdownSalesTransaction}
                                                                toggle={this.handleDropDownSalesTransaction}>
                                                                <DropdownToggle caret color="primary" title="Sales">
                                                                    {this.state.id_sales === null ? 'Pilih sales' : this.state.nama_sales}
                                                                </DropdownToggle>
                                                                <DropdownMenu>
                                                                    <DropdownItem disabled> Pilih sales</DropdownItem>
                                                                    {
                                                                        this.state.allSales.map(allSales => {
                                                                            return <DropdownItem onClick={() => this.populateSales(allSales.id, allSales.nama, allSales.kode_sales)}>
                                                                                {allSales.kode_sales} | {allSales.nama}</DropdownItem>
                                                                        })
                                                                    }
                                                                </DropdownMenu>
                                                            </ButtonDropdown>
                                                            :
                                                            <p className="mb-0"> {this.state.id_sales === null ? 'Belum ditentukan' : this.state.nama_sales}</p>
                                                }
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Kurs Transaksi</p>
                                                <p className="mb-0"> <NumberFormat value={Number(this.state.kurs_rate)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> </p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Metode Pembayaran  </p>
                                                <p className="mb-0"> {this.state.payment_name}</p>
                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Pembayaran  </p>
                                                <p className="mb-0"> {this.state.status_payment}</p>
                                                {
                                                    (this.state.status === 'WAITING' && this.state.pemilik_rekening) && <p className="mb-0" style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }} onClick={this.handleDetailsStatusPembayaranModal}> Lihat Detail</p>
                                                }

                                                {
                                                    this.state.detailStatusPembayaran && <Modal size="md" toggle={this.handleDetailsStatusPembayaranModal} isOpen={this.state.isOpenDetailStatusPembayaran} backdrop="static" keyboard={false}>
                                                        <ModalHeader toggle={this.handleDetailsStatusPembayaranModal}>Detail Status Pembayaran</ModalHeader>
                                                        <ModalBody>
                                                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                                                <div>
                                                                    <label style={{ margin: 0, fontWeight: 'bold' }}>Nama Pemilik Rekening</label>
                                                                    <p>{this.state.detailStatusPembayaran.pemilik_rekening_pembeli}</p>
                                                                </div>
                                                                <div>
                                                                    <label style={{ margin: 0, fontWeight: 'bold' }}>Bank Tujuan</label>
                                                                    <p>
                                                                        {
                                                                            this.state.detailStatusPembayaran.nama_bank + "-" +
                                                                            this.state.detailStatusPembayaran.no_rekening + "-" +
                                                                            this.state.detailStatusPembayaran.pemilik_rekening
                                                                        }</p>
                                                                </div>
                                                                <div>
                                                                    <label style={{ margin: 0, fontWeight: 'bold' }}>Tanggal Pembayaran</label>
                                                                    <p>{this.state.detailStatusPembayaran.tanggal_bayar && this.state.detailStatusPembayaran.tanggal_bayar.split('T')[0]}</p>
                                                                </div>
                                                                <div>
                                                                    <label style={{ margin: 0, fontWeight: 'bold', width: '100%' }}>Bukti Pembayaran</label>
                                                                    <img src={this.state.detailStatusPembayaran.bukti_bayar} style={{ width: '10rem' }} />
                                                                </div>
                                                            </div>
                                                        </ModalBody>
                                                        <ModalFooter style={{ position: 'relative' }}>
                                                            <Button color="primary" onClick={this.updateDetailStatusPembayaran}>Perbarui</Button>
                                                            <Button color="danger" onClick={this.handleDetailsStatusPembayaranModal}>Batal</Button>
                                                        </ModalFooter>
                                                    </Modal>
                                                }

                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Alamat Penagihan </p>
                                                <p className="mb-0"> {this.state.alamat_billto}</p>
                                                <p className="mb-0"> {this.state.kelurahan_billto}, {this.state.kecamatan_billto}</p>
                                                <p className="mb-0"> {this.state.kota_billto}, {this.state.provinsi_billto} {this.state.kodepos_billto}</p>
                                                <p className="mb-0"> {this.state.no_telp_billto}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div style={{ width: '100%', marginTop: '3%', paddingLeft: '3%' }}>
                                            {
                                                (this.state.status === 'WAITING' || this.state.status === 'CANCELED') ?
                                                    <MDBDataTable
                                                        striped
                                                        bordered
                                                        responsive
                                                        hover
                                                        data={dataDetailedOrder}
                                                    />
                                                    :
                                                    <MDBDataTable
                                                        striped
                                                        bordered
                                                        responsive
                                                        hover
                                                        data={dataDetailedOrdernonwaiting}
                                                    />
                                            }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div style={{ width: '70%', float: 'left', paddingLeft: '3%' }}>
                                            {
                                                this.state.id_transaction_ref && <div>
                                                    <label style={{ fontWeight: 'bold', width: '100%' }}>Nomor PO Pembeli</label>
                                                    <a style={{ cursor: 'pointer', color: 'gray' }} href={this.state.foto_transaction_ref && this.state.foto_transaction_ref} target="_blank">{this.state.id_transaction_ref}</a>
                                                </div>
                                            }

                                        </div>
                                        <div style={{ width: '30%', float: 'right', paddingLeft: '3%' }}>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Subtotal </p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="mb-0 text-right"> <NumberFormat value={Number(this.state.total)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                                </div>
                                            </div>
                                            {
                                                this.state.company_info_ppn !== 0 ?
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <p className="mb-0" style={{ fontWeight: 'bold' }}> PPN {this.state.company_info_ppn}% </p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-0 text-right">
                                                                <NumberFormat value={Math.ceil(Number(this.state.total) * (Number(this.state.company_info_ppn) / 100))} displayType={'text'}
                                                                    thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>

                                                        </div>
                                                    </div>
                                                    : null
                                            }
                                            <div className="row">
                                                <div className="col-6">
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Ongkos Kirim </p>
                                                </div>
                                                <div className="col-6">
                                                    {this.state.ongkos_kirim === null ?
                                                        <p className="mb-0 text-right"> Belum ditentukan </p>
                                                        : Number(this.state.ongkos_kirim) === 0 ?
                                                            <p className="mb-0 text-right"> Gratis </p>
                                                            : <p className="mb-0 text-right">
                                                                <NumberFormat value={Number(this.state.ongkos_kirim)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Total Transaksi </p>
                                                </div>
                                                <div className="col-6">
                                                    {this.state.ongkos_kirim !== null ?
                                                        // <p className="mb-0 text-right"> <NumberFormat value={Number(this.state.total_with_ongkir)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                                        <p className="mb-0 text-right"> <NumberFormat value={Number(Number(this.state.ongkos_kirim) + Math.ceil((Number(this.state.company_info_ppn / 100) * Number(this.state.total))) + Number(this.state.total))} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                                        : <p className="mb-0 text-right"> <NumberFormat value={Number(this.state.total) + (Math.ceil(Number(this.state.company_info_ppn / 100) * Number(this.state.total)))} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                                    }
                                                </div>
                                            </div>
                                            {/* <p className="mb-0" style={{fontWeight:'bold'}}> Subtotal  </p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}> Ongkos Kirim  </p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}> Total Transaksi  </p>
                                            <div style={{width:'50%', float:'right', paddingLeft:'3%'}}>
                                                <p className="mb-0"> <NumberFormat value={Number(this.state.total)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                                <p className="mb-0"> <NumberFormat value={Number(this.state.ongkos_kirim)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                                <p className="mb-0"> <NumberFormat value={Number(this.state.total_with_ongkir)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-eg115-2-transaction" role="tabpanel">
                                    <div className="scroll-area-lg">
                                        <div className="scrollbar-container ps--active-y">
                                            <div className="row">
                                                {
                                                    this.state.allTransactionComplained.map((user, index) => {
                                                        return (
                                                            <Col xs="12" sm="12" md="4" className="product-card ">
                                                                <Card style={{ marginBottom: '10%' }}>
                                                                    <div style={{ width: "50%", alignContent: "center", margin: "auto", marginTop: "5%" }}>
                                                                        <CardImg src={user.foto} alt="" />
                                                                    </div>
                                                                    <CardBody>
                                                                        <CardTitle>{user.nama}</CardTitle>
                                                                        <CardText>Jenis Aduan : {user.jenis_complain}</CardText>
                                                                        <CardText>Rincian : {user.notes_complain}</CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    {
                        this.state.status === 'WAITING' && this.state.sa_role === 'admin' ?
                            (<ModalFooter>
                                {/* <Button color="primary" onClick={this.handleModalBuktiTransfer}>Konfirmasi </Button> */}
                                {/* <Button color="primary" onClick={this.handleModalConfirm}>Konfirmasi </Button> */}
                                <Button color="primary"
                                    onClick={this.handleModalReceivedConfirm}
                                    disabled={this.handleDisabledKonfirmasiWaiting()}
                                >Konfirmasi
                                </Button>
                                <Button color="danger" onClick={this.handleModalConfirmCancel}>Batalkan</Button>
                            </ModalFooter>)
                            // : this.state.status === 'ONGOING' ?
                            //     ( <ModalFooter>
                            //         {/* <Button color="primary" onClick={this.handleModalReceivedConfirm}>Konfirmasi </Button> */}
                            //         <Button color="primary" onClick={this.handleModalConfirm}>Konfirmasi </Button>
                            //         <Button color="danger" onClick={this.handleModalDetail}>Batal</Button>
                            //     </ModalFooter>)
                            : this.state.status === 'SHIPPED' && this.state.sa_role === 'admin' ?
                                <ModalFooter>
                                    <Button color="primary" onClick={this.handleModalConfirm}>Konfirmasi Barang Diterima </Button>
                                </ModalFooter>
                                : this.state.status === 'WAITING' && this.state.sa_role === 'sales' && this.state.approval_by_sales === null ?
                                    (<ModalFooter>
                                        <Button color="primary" onClick={this.handleModalConfirm}>Konfirmasi </Button>
                                        {/* <Button color="danger" onClick={this.handleModalConfirmCancel}>Batalkan</Button> */}
                                    </ModalFooter>)
                                    : null
                    }
                </Modal>

                {/* Modal Confirm Transaksi*/}
                <Modal size="sm" toggle={this.handleModalConfirm} isOpen={this.state.isOpenConfirm} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirm}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            {
                                this.state.status === "COMPLAINED" ?
                                    <label>Selesaikan transaksi ini?</label>
                                    :
                                    this.state.status === 'SHIPPED' ?
                                        <label>Konfirmasi bahwa barang dalam transaksi ini telah diterima pembeli?</label>
                                        : this.state.status_aksi_transaksi === 'Cancel' ?
                                            <label>Batalkan transaksi ini?</label>
                                            :
                                            <label>Konfirmasi transaksi ini?</label>
                            }
                        </div>
                        <div style={{ marginLeft: '1.2rem' }}>
                            <Input type="checkbox"
                                checked={this.state.isCheckedCatatanLogistic}
                                onChange={this.toogleCheckedCatatanLogistik}
                            />Tambahkan catatan logistik
                        </div>
                        {
                            this.state.isCheckedCatatanLogistic && <Input
                                name="catatan_logistik"
                                value={this.state.catatan_logistik}
                                onChange={this.handleChange}
                                style={{ marginTop: '1rem', resize: 'none' }}
                                type="textarea"
                                rows="4"
                                maxLength="100"
                            />
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmAction}>Konfirmasi</Button>
                        <Button color="danger" onClick={this.handleModalConfirm}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Cancel Transaksi*/}
                <Modal size="md" toggle={this.handleModalConfirmCancel} isOpen={this.state.isOpenConfirmCancel} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmCancel}>Alasan Pembatalan Transaksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Jenis Alasan Pembatalan Transaksi</p>
                            <ButtonDropdown isOpen={this.state.isOpenDropdownTypeCancelTransaction}
                                toggle={this.handleDropDownTypeCancelTransaction}>
                                <DropdownToggle caret color="light" title="Jenis alasan pembatalan">
                                    {(this.state.id_cancel_reason === '0') ? 'Pilih jenis alasan pembatalan' : this.state.nama_jenis_cancel_reason}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem disabled> Pilih jenis alasan pembatalan </DropdownItem>
                                    {
                                        this.state.alltypecancelreason.map(alltypecancelreason => {
                                            return <DropdownItem onClick={() => this.populateTypeCancelTransaction(alltypecancelreason.id, alltypecancelreason.nama)}>
                                                {alltypecancelreason.nama}</DropdownItem>
                                        })
                                    }
                                </DropdownMenu>
                            </ButtonDropdown>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Tuliskan Alasan Pembatalan Transaksi</p>
                            <Input type="textarea" name="notes_cancel_transaksi" maxLength="100" rows="2"
                                onChange={this.handleChange}
                                onKeyPress={this.handleWhiteSpace}
                                invalid={this.state.empty_notes_cancel_transaksi} />
                            <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnCancelReason}>Konfirmasi</Button>
                        <Button color="danger" onClick={this.handleModalConfirmCancel}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Bukti Transfer */}
                <Modal size="md" toggle={this.handleModalBuktiTransfer} isOpen={this.state.isOpenBuktiTransfer} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalBuktiTransfer}>Bukti Pembayaran Transaksi #{this.state.id_transaction}</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <FormGroup row>
                                <Label for="batch_number" md={6}>Status Pembayaran</Label>
                                <Col md={6}>
                                    {
                                        (this.state.foto_bukti_payment !== '') ?
                                            <ButtonDropdown isOpen={this.state.isOpenDropdownStatusPayment} toggle={this.handleDropdownStatusPayment}>
                                                <DropdownToggle caret color={this.state.status_payment === 'PAID' ? "success" : "danger"}>
                                                    {this.state.status_payment === 'PAID' ? 'Lunas' : 'Belum Lunas'}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => this.changeStatusPayment('Paid')}>Lunas</DropdownItem>
                                                    <DropdownItem onClick={() => this.changeStatusPayment('Unpaid')}>Belum Lunas</DropdownItem>
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                            :
                                            <DropdownToggle caret color="danger" disabled>{this.state.status_payment === 'PAID' ? 'Lunas' : 'Belum Lunas'}</DropdownToggle>
                                    }
                                </Col>
                            </FormGroup>
                        </div>
                        <div style={{ alignContent: 'center', margin: "auto" }}>
                            <img src={(this.state.foto_bukti_payment === '') ? "assets/images/default_image_not_found.jpg" : this.state.foto_bukti_payment} alt="" style={{ width: "100%" }} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirm}>Konfirmasi</Button>
                        <Button color="danger" onClick={this.handleModalBuktiTransfer}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Received Confirm */}
                <Modal size="lg" toggle={this.handleModalReceivedConfirm} isOpen={this.state.isOpenReceivedConfirm} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalReceivedConfirm}>Konfirmasi Pengiriman Barang</ModalHeader>
                    <ModalBody>
                        <div style={{ width: '50%', float: 'left', paddingLeft: '3%' }}>
                            {
                                (this.state.ongkos_kirim === null) ?
                                    <div className="alert alert-danger fade show text-center" role="alert">
                                        <p className="mb-0">Ongkos kirim belum ditentukan.</p>
                                        <p className="mb-0">Kolom ongkos kirim diisi nilai kumulatif.</p>
                                        <p className="mb-0">Mohon periksa dan teliti kolom ongkos kirim.</p>
                                    </div>
                                    : null
                            }
                            <div style={{ width: '50%', float: 'left' }}>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> ID Transaksi</p>
                                <p className="mb-0"> {this.state.id_transaction}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Kurs Transaksi</p>
                                <p className="mb-0"> <NumberFormat value={Number(this.state.kurs_rate)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> </p>
                            </div>
                            <div style={{ width: '50%', float: 'right' }}>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Transaksi</p>
                                <p className="mb-0"> {this.state.create_date}</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Permintaan Kirim</p>
                                <p className="mb-0"> {(this.state.tgl_permintaan_kirim === null ? 'Tidak ditentukan' : this.state.tgl_permintaan_kirim)}</p>
                            </div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Alamat Pengiriman </p>
                            <p className="mb-0"> {this.state.alamat_shipto}</p>
                            <p className="mb-0"> {this.state.kelurahan_shipto}, {this.state.kecamatan_shipto}</p>
                            <p className="mb-0"> {this.state.kota_shipto}, {this.state.provinsi_shipto} {this.state.kodepos_shipto}</p>
                            <p className="mb-0"> {this.state.no_telp_shipto}</p>
                            <div className="position-relative form-group">
                                <label style={{ fontWeight: 'bold', width: '100%' }}>Catatan Logistik</label>
                                <Input type="textarea"
                                    maxLength='100'
                                    style={{ resize: 'none', border: '1px solid gray', borderRadius: '4px', width: '100%', height: '6rem', padding: '8px 10px' }}
                                    name="catatan_logistik"
                                    value={this.state.catatan_logistik}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <p className="mb-0" style={{ fontWeight: 'bold', borderTop: '2px solid gray', paddingTop: '10px' }}> Subtotal </p>
                            <p className="mb-0"> <NumberFormat value={Number(this.state.total)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                            {this.state.company_info_ppn !== 0 ?
                                <div>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> PPN {this.state.company_info_ppn}% </p>
                                    <p className="mb-0">
                                        <NumberFormat value={Math.ceil(Number(this.state.total) * (Number(this.state.company_info_ppn) / 100))} displayType={'text'}
                                            thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>

                                </div>
                                : null
                            }
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>  </p>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Ongkos Kirim </p>
                            {this.state.ongkos_kirim === null ?
                                <div>
                                    <NumberFormat thousandSeparator='.' value={this.state.ongkos_kirim_onconfirm}
                                        allowNegative={false} decimalSeparator=',' name="ongkos_kirim_onconfirm"
                                        id="ongkos_kirim_onconfirm" onChange={this.handleChange} className="form-control"></NumberFormat>
                                    <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                    <div id="errorharga" style={{ display: 'none' }}>
                                        <p style={{ color: 'red' }}>{this.state.errormessage}</p>
                                    </div>
                                </div>
                                : Number(this.state.ongkos_kirim) === 0 ?
                                    <p className="mb-0"> Gratis </p>
                                    :
                                    <p className="mb-0">
                                        <NumberFormat value={Number(this.state.ongkos_kirim)} displayType={'text'} thousandSeparator='.'
                                            decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                            }
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Total Transaksi </p>
                            {this.state.ongkos_kirim !== null ?
                                // <p className="mb-0"> <NumberFormat value={Number(this.state.total_with_ongkir)} 
                                //     displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                <p className="mb-0"> <NumberFormat value={Number(Number(this.state.ongkos_kirim) + Math.ceil(Number(this.state.company_info_ppn / 100) * Number(this.state.total)) + Number(this.state.total))}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                :
                                // <p className="mb-0"> <NumberFormat value={Number(this.state.total_without_ongkir_onconfirm)+Number(this.state.ongkos_kirim_onconfirm)} 
                                //     displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                <p className="mb-0"> <NumberFormat value={Number(this.state.total_without_ongkir_onconfirm) + Number(this.state.ongkos_kirim_onconfirm) + Math.ceil(Number(this.state.company_info_ppn / 100) * Number(this.state.total))}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                            }
                        </div>
                        <div style={{ width: '50%', float: 'right', paddingLeft: '3%' }}>
                            <div className="main-card mb-3 card">
                                <div className="card-header">
                                    <i className="header-icon lnr-laptop-phone icon-gradient bg-plum-plate"> </i>Daftar Order [ {this.state.allDetailedOrder.length} ]
                                </div>
                                <div className="card-body">
                                    <div className="scroll-area-md">
                                        <div className="scrollbar-container ps--active-y">
                                            {
                                                this.state.allDetailedOrder.map((user, index) => {
                                                    return (
                                                        <div className="mb-3 card bg-white"
                                                            style={{ paddingTop: '1%', paddingLeft: '3%', paddingRight: '4%', paddingBottom: '0%', marginBottom: '0%' }} key={index}>
                                                            <div style={{ backgroundColor: '#3f6ad8', borderRadius: '3% 3% 0% 0%' }}>
                                                                <p className="mb-0" style={{ fontWeight: 'bold', color: 'white', paddingLeft: '3%', paddingRight: '3%' }}>{user.nama}</p>
                                                            </div>
                                                            <div className="card-body"
                                                                style={{ backgroundColor: 'white', border: '1px solid #3f6ad8', borderRadius: '0% 0% 1% 1%' }}>
                                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Nomor Batch </p>
                                                                <Input name="batch_number" id={`batch_number-${index}`}
                                                                // type="text" pattern="[0-9]*"
                                                                />
                                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Kedaluwarsa </p>
                                                                <Input type="date" name="expired_date" id={`expired_date-${index}`} />
                                                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Jumlah Order Dipenuhi </p>
                                                                <div className="input-group">
                                                                    <Input name="jml" id={`jml-${index}`} type="number"
                                                                        min={0} max={user.qty} defaultValue="0"
                                                                        onChange={(e) => this.handleChangeJumlah(e, index, user.qty)}
                                                                    />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text">dari {user.pure_show_qty}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    {
                        this.state.ongkos_kirim === null ?
                            <ModalFooter>
                                <Button color="primary" onClick={this.handleModalConfirmAdmin} disabled=
                                    {this.state.ongkos_kirim_onconfirm === '' ? "disabled" : false}>Konfirmasi</Button>
                                <Button color="danger" onClick={this.handleModalReceivedConfirm}>Batal</Button>
                            </ModalFooter>
                            : <ModalFooter>
                                <Button color="primary" onClick={this.handleModalConfirmAdmin}>Konfirmasi</Button>
                                <Button color="danger" onClick={this.handleModalReceivedConfirm}>Batal</Button>
                            </ModalFooter>
                    }
                </Modal>

                {/* Modal Perhatian Jumlah Order Tidak Diisi */}
                <Modal size="sm" toggle={this.handleModalAttentionJumlahOrderKosong} isOpen={this.state.isOpenAttentionJumlahOrderKosong} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAttentionJumlahOrderKosong}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, tidak ada jumlah order yang dapat dipenuhi. Harap isi jumlah order dipenuhi dengan benar!</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Detail Limit Hari Transaksi */}
                <Modal size="md" toggle={this.handleModalLimitHariTransaksi} isOpen={this.state.isOpenModalLimitHariTransaksi} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalLimitHariTransaksi}>Detail Limit Hari Transaksi Selesai</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Limit Hari Transaksi Selesai</p>
                                <Input type="text" name="limit_hari_transaksi_selesai_selected" id="limit_hari_transaksi_selesai_selected"
                                    className="form-control"
                                    onChange={this.handleChangeLimitTransaksi}
                                    onKeyPress={this.handleWhiteSpaceNumber}
                                    invalid={this.state.empty_limit_hari_transaksi}
                                    value={this.state.limit_hari_transaksi_selesai_selected}
                                />
                                <FormFeedback>{this.state.feedback_limit_hari_transaksi}</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmLimitHariTransaksi} disabled={this.state.isBtnUpdateLimitHariTransaksi}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalLimitHariTransaksi}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Insert Limit Hari Transaksi */}
                <Modal size="md" toggle={this.handleModalLimitHariTransaksiForInsert} isOpen={this.state.isOpenModalLimitHariTransaksiForInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalLimitHariTransaksiForInsert}>Detail Limit Hari Transaksi Selesai</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Limit Hari Transaksi Selesai</p>
                                <Input type="text" name="limit_hari_transaksi_selesai_inserted" id="limit_hari_transaksi_selesai_inserted"
                                    className="form-control"
                                    onChange={this.handleChangeLimitTransaksi}
                                    onKeyPress={this.handleWhiteSpaceNumber}
                                    invalid={this.state.empty_limit_hari_transaksi}
                                    value={this.state.limit_hari_transaksi_selesai_inserted}
                                />
                                <FormFeedback>{this.state.feedback_limit_hari_transaksi}</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmLimitHariTransaksi} disabled={this.state.isBtnInsertLimitHariTransaksi}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalLimitHariTransaksiForInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Limit Hari Transaksi*/}
                <Modal size="sm" toggle={this.handleModalConfirmLimitHariTransaksi} isOpen={this.state.isOpenConfirmLimitHariTransaksi} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmLimitHariTransaksi}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionLimitHariTransaksi}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirmLimitHariTransaksi}>Batal</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
const reduxState = (state) => ({
    userData: state.userData,
    io: state.io
})

const reduxDispatch = (dispatch) => ({
    getDataTransactionsAPI: (data) => dispatch(getDataTransactionsAPI(data)),
    getDataTypeCancelReason: (data) => dispatch(getDataTypeCancelReason(data)),
    getDataSalesTransactionAPI: (data) => dispatch(getDataSalesTransactionAPI(data)),
    getDataDetailedSalesTransactionAPI: (data) => dispatch(getDataDetailedSalesTransactionAPI(data)),
    getDataDetailedTransactionAPI: (data) => dispatch(getDataDetailedTransactionAPI(data)),
    getDataDetailedAlamatTransactionAPI: (data) => dispatch(getDataDetailedAlamatTransactionAPI(data)),
    getDataDetailedOrderAPI: (data) => dispatch(getDataDetailedOrderAPI(data)),
    getDataTransactionComplainedAPI: (data) => dispatch(getDataTransactionComplainedAPI(data)),
    insertTransactionReceived: (data) => dispatch(insertTransactionReceived(data)),
    updateTransactionStatus: (data) => dispatch(updateTransactionStatus(data)),
    checkIdTransactionCanceled: (data) => dispatch(checkIdTransactionCanceled(data)),
    getPPNBarang: (data) => dispatch(getPPNBarang(data)),
    totalBeranda: (data) => dispatch(totalBeranda(data)),
    getDataLimitHariTransaksi: (data) => dispatch(getDataLimitHariTransaksi(data)),
    checkIdTransactionReceivedToFinished: (data) => dispatch(checkIdTransactionReceivedToFinished(data)),
    postQuery: (data) => dispatch(postQuery(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentTransaksi));