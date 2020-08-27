import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { withRouter } from 'react-router-dom';
import {
    getDataNegotiationAPI, getKursActiveAPIManual, showLastUpdatedNego, getDataDetailedNegotiationAPI,
    updateNegoStatus, getKursAPI, getKursAPIManual, getDataDetailedSalesHandlerAPI, logoutUserAPI
} from '../../../config/redux/action';
import { MDBDataTable } from 'mdbreact';
import './Negosiasi.css'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
// import Shimmer from "react-shimmer-effect";
import moment from 'moment';
import 'moment/locale/id'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge, Input, Label, FormFeedback } from 'reactstrap'
import axios from 'axios'

class ContentNegosiasi extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        allDataNegotiationActive: [],
        allDataNegotiationInActive: [],
        tmpfilteredDataNegotiationActive: [],
        tmpfilteredDataNegotiationInActive: [],
        cart_id: '',
        history_nego_id: '',
        cart_status: '',
        cart_nama_barang: '',
        cart_berat: '',
        cart_qty: '',
        cart_qty_total: '',
        cart_pedoman_pembagi: '',
        cart_flag_harga_sales_nego_pertama: '',
        cart_foto: '',
        cart_clear_price: '',
        cart_price_rupiah: '',
        cart_price: '',
        cart_price_clear_terendah: '',
        cart_price_tertinggi: '',
        cart_price_terendah: '',
        cart_nama_perusahaan: '',
        cart_nego_count: '',
        cart_jatah_nego: '',
        cart_create_date: '',
        cart_nama: '',
        cart_harga_nego: '',
        cart_harga_sales: '',
        cart_notes: '',
        cart_created_by: '',
        cart_updated_by: '',
        cart_updated_date: '',
        cart_harga_nego_2: '',
        cart_harga_sales_2: '',
        cart_harga_nego_3: '',
        cart_harga_sales_3: '',
        cart_harga_final: '',
        cart_updated_by_2: '',
        cart_updated_by_3: '',
        cart_updated_date_2: '',
        cart_updated_date_3: '',
        cart_price_current_buyer: '',
        cart_price_current_seller: '',
        cart_nama_updated_nego: '',
        cart_nama_updated_nego_2: '',
        cart_nama_updated_nego_3: '',
        cart_id_nama_perusahaan: '',
        cart_satuan: '',
        cart_user_token: '',
        cart_buyer_number_mapping: '',
        cart_kode_sales: '',
        cart_nama_sales: '',
        cart_id_sales: '',
        cart_kode_barang: '',
        harga_tawar_terbaru: '',
        harga_final: '',
        isOpen: false,
        isOpenModalNegoBaru: false,
        isOpenModalSetujuiNego: false,
        isOpenPeringatan: false,
        isOpenHargaFinal: false,
        isOpenConfirmHargaFinal: false,
        isOpenNotes: false,
        isBtnNego: true,
        isBtnConfirmHargaFinal: true,
        empty_harga_tawar_terbaru: false,
        empty_harga_final: false,
        kurs_now: '',
        kurs_now_manual: '',
        color_card_inactive: 'rgb(51, 51, 51)',
        errormessage: '',
        errormessagehargafinal: '',
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
        isBtnRefreshNegotiation: false
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
        // this.loadKurs()
    }

    async componentDidMount() {
        await this.loadKursManual()
        await this.loadDataNegotiationActive("0")
        await this.loadDataNegotiationInActive("0")
    }

    loadKurs = async () => {
        const reskurs = await this.props.getKursAPI().catch(err => err)
        if (reskurs) {
            this.setState({
                kurs_now: reskurs
            })
        }
    }

    loadKursManual = async () => {
        // let passquerykurs = encrypt("select * from gcm_master_kurs")
        // const reskurs = await this.props.getKursAPIManual({query:passquerykurs}).catch(err => err)
        let passquerykurs = encrypt("select * from gcm_listing_kurs where company_id=" + this.state.company_id +
            " and (now() >= gcm_listing_kurs.tgl_start and now() <= gcm_listing_kurs.tgl_end);")
        const reskurs = await this.props.getKursActiveAPIManual({ query: passquerykurs }).catch(err => err)
        if (reskurs) {
            this.setState({
                kurs_now_manual: reskurs.nominal
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

    loadDataNegotiationActive = async (flag) => {
        let passquery = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // nego hanya mengikat ke divisi sales
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
            //     "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
            //         "from gcm_master_cart "+
            //         "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //         "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
            //         "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //         "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
            //         "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+
            //         "' and gcm_master_barang.category_id="+this.state.sa_divisi+" order by gcm_master_cart.update_date desc;")
            // } else {
            //     passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
            //         "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
            //             "from gcm_master_cart "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
            //             "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id="+this.state.company_id+
            //             " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+
            //             "' order by gcm_master_cart.update_date desc;")
            // }
            if (this.state.sa_role === 'sales') {
                passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, " +
                    "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id " +
                    "from gcm_master_cart " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') +
                    "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login + " order by gcm_master_cart.update_date desc;")
            } else {
                passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, " +
                    "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id " +
                    "from gcm_master_cart " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') +
                    "' order by gcm_master_cart.update_date desc;")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
            //         "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
            //             "from gcm_master_cart "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
            //             "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id="+this.state.company_id+
            //             " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //             "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_barang.category_id="+this.state.sa_divisi+" order by gcm_master_cart.update_date desc;")
            // } else {
            //     passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
            //         "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
            //             "from gcm_master_cart "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
            //             "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id="+this.state.company_id+
            //             " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //             "'::TIMESTAMP + '1 days'::INTERVAL order by gcm_master_cart.update_date desc;")
            // }
            if (this.state.sa_role === 'sales') {
                passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, " +
                    "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id " +
                    "from gcm_master_cart " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login + " order by gcm_master_cart.update_date desc;")
            } else {
                passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, " +
                    "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id " +
                    "from gcm_master_cart " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL order by gcm_master_cart.update_date desc;")
            }
        }
        const res = await this.props.getDataNegotiationAPI({ query: passquery }).catch(err => err)
        if (res) {
            res.map((user, index) => {
                return (
                    res[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailNegotiation(e, res[index].history_nego_id, res[index].id)}>Lihat Detail</button>
                    </center>,
                    res[index].create_date =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.create_date}</p>
                )
            })
            this.setState({
                allDataNegotiationActive: res,
                tmpfilteredDataNegotiationActive: res
            })
            // if (flag === '1') {
            //     swal({
            //         title: "Sukses!",
            //         text: "Data negosiasi berhasil diperbarui!",
            //         icon: "success",
            //         button: false,
            //         timer: "2500"
            //     }).then(()=> {

            //     });
            // }
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

    loadDataNegotiationInActive = async (flag) => {
        let passquery = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
            //     "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY') create_date,  gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
            //         "from gcm_master_cart "+
            //         "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //         "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
            //         "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //         "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
            //         "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+
            //         "' and gcm_master_barang.category_id="+this.state.sa_divisi+" order by gcm_master_cart.update_date desc;")
            // } else {
            //     passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
            //         "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY') create_date,  gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
            //             "from gcm_master_cart "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
            //             "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id="+this.state.company_id+
            //             " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+
            //             "' order by gcm_master_cart.update_date desc;")
            // }
            if (this.state.sa_role === 'sales') {
                passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, " +
                    "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date,  gcm_master_barang.nama, gcm_master_cart.history_nego_id " +
                    "from gcm_master_cart " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') +
                    "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login + " order by gcm_master_cart.update_date desc;")
            } else {
                passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, " +
                    "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date,  gcm_master_barang.nama, gcm_master_cart.history_nego_id " +
                    "from gcm_master_cart " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') +
                    "' order by gcm_master_cart.update_date desc;")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
            //         "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY') create_date,  gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
            //             "from gcm_master_cart "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
            //             "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id="+this.state.company_id+
            //             " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //             "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_barang.category_id="+this.state.sa_divisi+" order by gcm_master_cart.update_date desc;")
            // } else {
            //     passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
            //         "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY') create_date,  gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
            //             "from gcm_master_cart "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
            //             "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id="+this.state.company_id+
            //             " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //             "'::TIMESTAMP + '1 days'::INTERVAL order by gcm_master_cart.update_date desc;")
            // }
            if (this.state.sa_role === 'sales') {
                passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, " +
                    "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date,  gcm_master_barang.nama, gcm_master_cart.history_nego_id " +
                    "from gcm_master_cart " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login + " order by gcm_master_cart.update_date desc;")
            } else {
                passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, " +
                    "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date,  gcm_master_barang.nama, gcm_master_cart.history_nego_id " +
                    "from gcm_master_cart " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL order by gcm_master_cart.update_date desc;")
            }
        }
        const res = await this.props.getDataNegotiationAPI({ query: passquery }).catch(err => err)
        if (res) {
            res.map((user, index) => {
                return (
                    res[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailNegotiation(e, res[index].history_nego_id, res[index].id)}>Lihat Detail</button>
                    </center>,
                    res[index].create_date =
                    <p className="mb-0" style={{ textAlign: 'center' }}>{user.create_date}</p>
                )
            })
            this.setState({
                allDataNegotiationInActive: res,
                tmpfilteredDataNegotiationInActive: res
            })
            if (flag === '1') {
                swal({
                    title: "Sukses!",
                    text: "Data negosiasi berhasil diperbarui!",
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
    }

    handleDetailNegotiation = async (e, id_history_nego, id_master_cart) => {
        this.handleModalDetail()
        this.loadDataSalesTerkait(id_history_nego)
        e.stopPropagation();
        this.setState({
            history_nego_id: id_history_nego,
            cart_id: id_master_cart
        })

        let passquerydetailnegotiation = encrypt("select gcm_master_barang.nama as nama_barang, gcm_master_cart.qty, gcm_list_barang.price, gcm_master_satuan.alias, " +
            "gcm_list_barang.price_terendah, gcm_list_barang.foto, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, gcm_master_user.nama, " +
            "gcm_history_nego.harga_nego, gcm_history_nego.harga_sales, gcm_history_nego.notes, gcm_master_barang.berat, " +
            "gcm_history_nego.created_by, gcm_history_nego.updated_by, to_char(gcm_history_nego.updated_date, 'DD/MM/YYYY HH24:MI:SS') updated_date, " +
            "gcm_history_nego.harga_nego_2, gcm_history_nego.harga_sales_2, gcm_history_nego.harga_nego_3, gcm_master_cart.harga_sales as flag_harga_sales_nego_pertama, gcm_master_cart.company_id ," +
            "gcm_history_nego.harga_sales_3, gcm_history_nego.harga_final, gcm_history_nego.updated_by_2, " +
            "gcm_history_nego.updated_by_3, to_char(gcm_history_nego.updated_date_2, 'DD/MM/YYYY HH24:MI:SS') updated_date_2, to_char(gcm_history_nego.updated_date_3, 'DD/MM/YYYY HH24:MI:SS') updated_date_3, gcm_master_cart.status, " +
            "gcm_company_listing.buyer_number_mapping, gcm_list_barang.kode_barang, gcm_notification_token.user_id, gcm_notification_token.token " +
            "from gcm_history_nego " +
            "inner join gcm_master_cart on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
            "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
            "inner join gcm_company_listing on gcm_master_company.id=gcm_company_listing.buyer_id " +
            "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
            "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
            "inner join gcm_master_satuan on gcm_master_barang.satuan=gcm_master_satuan.id " +
            "inner join gcm_master_user on gcm_master_cart.create_by = gcm_master_user.id " +
            "left join gcm_notification_token on gcm_notification_token.user_id = gcm_master_user.id " +
            "where gcm_history_nego.id=" + id_history_nego + " and gcm_company_listing.seller_id=" + this.state.company_id)
        const resdetail = await this.props.getDataDetailedNegotiationAPI({ query: passquerydetailnegotiation }).catch(err => err)

        if (resdetail) {
            this.setState({
                cart_status: resdetail.status,
                cart_user_token: resdetail.token,
                cart_id_nama_perusahaan: resdetail.company_id,
                cart_nama_barang: resdetail.nama_barang,
                cart_qty: resdetail.qty,
                cart_berat: resdetail.berat,
                cart_qty_total: resdetail.qty * resdetail.berat,
                cart_pedoman_pembagi: resdetail.berat,
                cart_flag_harga_sales_nego_pertama: resdetail.flag_harga_sales_nego_pertama,
                cart_foto: resdetail.foto,
                cart_clear_price: resdetail.clear_price,
                cart_price: resdetail.price,
                cart_price_clear_terendah: resdetail.price_terendah,
                cart_nama_perusahaan: resdetail.nama_perusahaan,
                cart_nego_count: resdetail.nego_count,
                cart_jatah_nego: resdetail.jatah_nego,
                cart_create_date: resdetail.create_date,
                cart_nama: resdetail.nama,
                cart_harga_nego: resdetail.harga_nego,
                cart_harga_sales: resdetail.harga_sales,
                cart_notes: resdetail.notes,
                cart_created_by: resdetail.created_by,
                cart_updated_by: resdetail.updated_by,
                cart_updated_date: resdetail.updated_date,
                cart_harga_nego_2: resdetail.harga_nego_2,
                cart_harga_sales_2: resdetail.harga_sales_2,
                cart_harga_nego_3: resdetail.harga_nego_3,
                cart_harga_sales_3: resdetail.harga_sales_3,
                cart_harga_final: resdetail.harga_final,
                cart_updated_by_2: resdetail.updated_by_2,
                cart_updated_by_3: resdetail.updated_by_3,
                cart_updated_date_2: resdetail.updated_date_2,
                cart_updated_date_3: resdetail.updated_date_3,
                // cart_price_rupiah: parseInt(resdetail.clear_price*this.state.kurs_now).toFixed(0),
                // cart_price_tertinggi: Math.round(parseInt(resdetail.clear_price*this.state.kurs_now).toFixed(0)),
                // cart_price_terendah: Math.round(parseInt(resdetail.clear_price_terendah*this.state.kurs_now).toFixed(0)),
                // cart_price_rupiah: parseInt(resdetail.clear_price*this.state.kurs_now_manual).toFixed(0),
                // cart_price_tertinggi: Math.round(parseInt(resdetail.clear_price*this.state.kurs_now_manual).toFixed(0)),
                // cart_price_terendah: Math.round(parseInt(resdetail.clear_price_terendah*this.state.kurs_now_manual).toFixed(0)),
                cart_price_rupiah: Math.ceil(resdetail.clear_price * this.state.kurs_now_manual),
                cart_price_tertinggi: Math.ceil(resdetail.clear_price * this.state.kurs_now_manual),
                cart_price_terendah: Math.ceil(resdetail.clear_price_terendah * this.state.kurs_now_manual),
                cart_satuan: resdetail.alias,
                cart_buyer_number_mapping: resdetail.buyer_number_mapping,
                cart_kode_barang: resdetail.kode_barang
            })
            if (this.state.cart_updated_by !== null) {
                this.loadDataPenego(this.state.cart_updated_by, "1")
            }
            if (this.state.cart_updated_by_2 !== null) {
                this.loadDataPenego(this.state.cart_updated_by_2, "2")
            }
            if (this.state.cart_updated_by_2 !== null) {
                this.loadDataPenego(this.state.cart_updated_by_3, "3")
            }
            if (this.state.cart_nego_count === '1') {
                this.setState({
                    cart_price_current_buyer: resdetail.harga_nego,
                    cart_price_current_seller: resdetail.harga_sales
                })
                document.getElementById('card_nego_2').style.backgroundColor = this.state.color_card_inactive
                document.getElementById('card_nego_2').style.opacity = 0.5
                document.getElementById('card_nego_3').style.backgroundColor = this.state.color_card_inactive
                document.getElementById('card_nego_3').style.opacity = 0.5
            } else if (this.state.cart_nego_count === '2') {
                this.setState({
                    cart_price_current_buyer: resdetail.harga_nego_2
                })
                if (this.state.cart_harga_sales_2 !== null) {
                    this.setState({
                        cart_price_current_seller: resdetail.harga_sales_2
                    })
                } else {
                    this.setState({
                        cart_price_current_seller: resdetail.harga_sales
                    })
                }
                document.getElementById('card_nego_3').style.backgroundColor = this.state.color_card_inactive
                document.getElementById('card_nego_3').style.opacity = 0.5
            } else if (this.state.cart_nego_count === '3') {
                this.setState({
                    cart_price_current_buyer: resdetail.harga_nego_3
                })
                if (this.state.cart_harga_sales_3 !== null) {
                    this.setState({
                        cart_price_current_seller: resdetail.harga_sales_3
                    })
                } else {
                    this.setState({
                        cart_price_current_seller: resdetail.harga_sales_2
                    })
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
                // const res = this.props.logoutAPI();
                // if (res) {
                // this.props.history.push('/admin')
                // window.location.reload()
                // }
            });
        }
    }

    loadDataSalesTerkait = async (id_history_nego) => {
        let passquerysales = encrypt("select gcm_master_user.kode_sales, gcm_master_user.nama, gcm_company_listing_sales.id_sales " +
            "from gcm_history_nego " +
            "inner join gcm_master_cart on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
            "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
            "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
            "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
            "inner join gcm_master_user on gcm_company_listing_sales.id_sales = gcm_master_user.id " +
            "where gcm_history_nego.id=" + id_history_nego + " and gcm_company_listing.seller_id=" + this.state.company_id)
        const ressaleshandler = await this.props.getDataDetailedSalesHandlerAPI({ query: passquerysales }).catch(err => err)
        if (ressaleshandler) {
            await this.setState({
                cart_kode_sales: ressaleshandler.kode_sales,
                cart_nama_sales: ressaleshandler.nama,
                cart_id_sales: ressaleshandler.id_sales
            })
        }
    }

    loadDataPenego = async (id_terakhir_update, position) => {
        let passquerylastupdatedby = encrypt("select nama from gcm_master_user where id=" + id_terakhir_update)
        const reslastupdatedby = await this.props.showLastUpdatedNego({ query: passquerylastupdatedby }).catch(err => err)
        if (reslastupdatedby) {
            if (position === '1') {
                this.setState({ cart_nama_updated_nego: reslastupdatedby.nama })
            } else if (position === '2') {
                this.setState({ cart_nama_updated_nego_2: reslastupdatedby.nama })
            } else {
                this.setState({ cart_nama_updated_nego_3: reslastupdatedby.nama })
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

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            empty_harga_tawar_terbaru: false,
            harga_tawar_terbaru: ''
        })
    }

    handleConfirmNegoBaru = () => {
        if (this.state.harga_tawar_terbaru === '') {
            this.setState({ empty_harga_tawar_terbaru: true, errormessage: 'Kolom ini harus diisi' })
        } else if (parseInt(this.state.harga_tawar_terbaru.split('.').join('')) > parseInt(this.state.cart_price_tertinggi)) {
            this.setState({ empty_harga_tawar_terbaru: true, errormessage: 'Harga penawaran terbaru harus lebih rendah dari harga barang!', isOpenPeringatan: !this.state.isOpenPeringatan })
        } else if (parseInt(this.state.harga_tawar_terbaru.split('.').join('')) < parseInt(this.state.cart_price_current_buyer)) {
            this.setState({ empty_harga_tawar_terbaru: true, errormessage: 'Harga penawaran terbaru harus lebih tinggi dari harga penawaran terakhir pembeli!', isOpenPeringatan: !this.state.isOpenPeringatan })
        }
        else {
            this.setState({
                isOpenModalNegoBaru: !this.state.isOpenModalNegoBaru,
                empty_harga_tawar_terbaru: false
            })
        }
    }

    handleConfirmSetujui = () => {
        this.setState({
            isOpenModalSetujuiNego: !this.state.isOpenModalSetujuiNego
        })
    }

    handleModalPeringatan = () => {
        this.setState({
            isOpenPeringatan: !this.state.isOpenPeringatan
        })
    }

    handleModalNotes = () => {
        this.setState({
            isOpenNotes: !this.state.isOpenNotes
        })
    }

    handleModalHargaFinal = () => {
        this.setState({
            isOpenHargaFinal: !this.state.isOpenHargaFinal,
            empty_harga_final: false
        })
    }

    handleConfirmHargaFinal = () => {
        if (this.state.harga_final === '') {
            this.setState({ empty_harga_final: true })
        } else if (parseInt(this.state.harga_final.split('.').join('')) > parseInt(this.state.cart_price_tertinggi)) {
            this.setState({ empty_harga_final: true, errormessage: 'Harga final harus lebih rendah dari harga barang!', isOpenPeringatan: !this.state.isOpenPeringatan })
        } else if (parseInt(this.state.harga_final.split('.').join('')) < parseInt(this.state.cart_price_current_buyer)) {
            this.setState({ empty_harga_final: true, errormessage: 'Harga final harus lebih tinggi dari harga penawaran terakhir pembeli!', isOpenPeringatan: !this.state.isOpenPeringatan })
        }
        else {
            this.setState({
                isOpenConfirmHargaFinal: !this.state.isOpenConfirmHargaFinal,
                empty_harga_final: false
            })
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        this.check_harga_penawaran(event.target.value)
    }

    check_harga_penawaran = (x) => {
        if (x === '') {
            document.getElementById('errorharga').style.display = 'block'
            this.setState({ empty_harga_tawar_terbaru: true, errormessage: 'Kolom ini harus diisi', isBtnNego: true })
        } else if (parseInt(x.split('.').join('')) > parseInt(this.state.cart_price_tertinggi)) {
            document.getElementById('errorharga').style.display = 'block'
            this.setState({ empty_harga_tawar_terbaru: true, errormessage: 'Harga penawaran terbaru harus lebih rendah dari harga tertinggi barang!', isBtnNego: true })
        }
        // else if (parseInt(x.split('.').join('')) > parseInt(this.state.cart_price_terendah)) {
        //     document.getElementById('errorharga').style.display='block'
        //     this.setState({empty_harga_tawar_terbaru: true, errormessage:'Harga penawaran terbaru tidak boleh lebih tinggi dari harga terendah barang!', isBtnNego:true})
        // } 
        else if (parseInt(x.split('.').join('')) < parseInt(this.state.cart_price_current_buyer)) {
            document.getElementById('errorharga').style.display = 'block'
            this.setState({ empty_harga_tawar_terbaru: true, errormessage: 'Harga penawaran terbaru harus lebih tinggi dari harga penawaran terakhir pembeli!', isBtnNego: true })
        } else if (x !== '' && (parseInt(x.split('.').join('')) < parseInt(this.state.cart_price_tertinggi)) && (parseInt(x.split('.').join(''))) > parseInt(this.state.cart_price_current_buyer)) {
            document.getElementById('errorharga').style.display = 'none'
            this.setState({ empty_harga_tawar_terbaru: false, isBtnNego: false })
        }
    }

    handleChangeHargaFinal = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        this.check_harga_final(event.target.value)
    }

    check_harga_final = (x) => {
        if (x === '') {
            document.getElementById('errorhargafinal').style.display = 'block'
            this.setState({ empty_harga_final: true, errormessagehargafinal: 'Kolom ini harus diisi', isBtnConfirmHargaFinal: true })
        } else if (parseInt(x.split('.').join('')) > parseInt(this.state.cart_price_tertinggi)) {
            document.getElementById('errorhargafinal').style.display = 'block'
            this.setState({ empty_harga_final: true, errormessagehargafinal: 'Harga final harus lebih rendah dari harga tertinggi barang!', isBtnConfirmHargaFinal: true })
        } else if (parseInt(x.split('.').join('')) < parseInt(this.state.cart_price_current_buyer)) {
            document.getElementById('errorhargafinal').style.display = 'block'
            this.setState({ empty_harga_final: true, errormessagehargafinal: 'Harga final harus lebih tinggi dari harga penawaran terakhir pembeli!', isBtnConfirmHargaFinal: true })
        } else if (x !== '' && (parseInt(x.split('.').join('')) < parseInt(this.state.cart_price_tertinggi)) && (parseInt(x.split('.').join(''))) >= parseInt(this.state.cart_price_current_buyer)) {
            document.getElementById('errorhargafinal').style.display = 'none'
            this.setState({ empty_harga_final: false, isBtnConfirmHargaFinal: false })
        }
    }

    sendNotificationFCM = async (token) => {
        const fetchOptions = {
            "to": token,
            "collapse_key": "type_a",
            "notification": {
                "body": "Testing",
                "title": "Just Cause"
            },
            "data": {
                "body": "test",
                "title": "yow",
                "key_1": "Value for key_1",
                "key_2": "Value for key_2"
            }
        }


        const post = await axios.post("https://fcm.googleapis.com/fcm/send", fetchOptions, {
            headers: {
                "Authorization": "key=AAAA6NuQ4as:APA91bG9s8KnXjq2LjuRtTBDxcBXfM-D3AHk5Lcpstlf6uMU1tmc-M9FHK78w0FXk7uGfwHn4isfg6KFJnJeuIgHyVASgch_jo1ATWab_eB9WF4ArQw22Xli9owTQwFnRL64-ERS5-0Z",
                "Content-Type": "application/json"
            }
        })
        return post
    }

    confirmAction = async (stat) => {
        if (this.state.cart_user_token != null) {
            const postNotification = await this.sendNotificationFCM(this.state.cart_user_token)
        }        
        if (stat === 'Nego') {
            let passqueryupdatehistorynego = `with insertion as(insert into gcm_notification_nego (barang_id,barang_nama,buyer_id,buyer_nama,seller_id,seller_nama,date,source)
            values (${this.state.cart_id_sales},'${this.state.cart_nama_barang}',${this.state.cart_id_nama_perusahaan},'${this.state.cart_nama_perusahaan}',${this.state.company_id},'${this.state.company_name}',now(),'seller'))`

            if (this.state.cart_nego_count === '1') {
                passqueryupdatehistorynego += "update gcm_history_nego set harga_sales='" + this.state.harga_tawar_terbaru.split('.').join('') + "', " +
                    "updated_by=" + this.state.id_pengguna_login + ", updated_date=now() where id=" + this.state.history_nego_id + " returning updated_date"
            } else if (this.state.cart_nego_count === '2' && this.state.cart_harga_sales_2 === null) {
                passqueryupdatehistorynego += "update gcm_history_nego set harga_sales_2='" + this.state.harga_tawar_terbaru.split('.').join('') + "', " +
                    "updated_by_2=" + this.state.id_pengguna_login + ", updated_date_2=now() where id=" + this.state.history_nego_id + " returning updated_date_2"
            } else if (this.state.cart_nego_count === '3' && this.state.cart_harga_sales_3 === null) {
                passqueryupdatehistorynego += "update gcm_history_nego set harga_sales_3='" + this.state.harga_tawar_terbaru.split('.').join('') + "', " +
                    "updated_by_3=" + this.state.id_pengguna_login + ", updated_date_3=now() where id=" + this.state.history_nego_id + " returning updated_date_3"
            }

            const resupdatehistorynego = await this.props.updateNegoStatus({ query: encrypt(passqueryupdatehistorynego) }).catch(err => err)

            if (resupdatehistorynego) {
                let passqueryupdatemastercart = encrypt("update gcm_master_cart set harga_sales='" + (this.state.harga_tawar_terbaru.split('.').join('')) * this.state.cart_qty_total + "', " +
                    "update_by=" + this.state.id_pengguna_login + ", update_date=now() where id=" + this.state.cart_id + " returning update_date")
                const resupdatemastercart = await this.props.updateNegoStatus({ query: passqueryupdatemastercart }).catch(err => err)
                if (resupdatemastercart) {
                    swal({
                        title: "Sukses!",
                        text: "Perubahan disimpan!",
                        icon: "success",
                        button: false,
                        timer: "2500"
                    }).then(() => {
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
        } else if (stat === 'Approve') {
            let passqueryupdatehistorynego = `with insertion as(insert into gcm_notification_nego (barang_id,barang_nama,buyer_id,buyer_nama,seller_id,seller_nama,date,source)
            values (${this.state.cart_id_sales},'${this.state.cart_nama_barang}',${this.state.cart_id_nama_perusahaan},'${this.state.cart_nama_perusahaan}',${this.state.company_id},'${this.state.company_name}',now(),'seller'))`

            if (this.state.cart_nego_count === '1') {
                passqueryupdatehistorynego += "update gcm_history_nego set harga_sales='" + this.state.cart_price_current_buyer + "', " +
                    "harga_final='" + this.state.cart_price_current_buyer + "', updated_by=" + this.state.id_pengguna_login + ", updated_date=now() where id=" + this.state.history_nego_id + " returning updated_date"
            } else if (this.state.cart_nego_count === '2' && this.state.cart_harga_sales_2 === null) {
                passqueryupdatehistorynego += "update gcm_history_nego set harga_sales_2='" + this.state.cart_price_current_buyer + "', " +
                    "harga_final='" + this.state.cart_price_current_buyer + "', updated_by_2=" + this.state.id_pengguna_login + ", updated_date_2=now() where id=" + this.state.history_nego_id + " returning updated_date_2"
            } else if (this.state.cart_nego_count === '3' && this.state.cart_harga_sales_3 === null) {
                passqueryupdatehistorynego += "update gcm_history_nego set harga_sales_3='" + this.state.cart_price_current_buyer + "', " +
                    "harga_final='" + this.state.cart_price_current_buyer + "', updated_by_3=" + this.state.id_pengguna_login + ", updated_date_3=now() where id=" + this.state.history_nego_id + " returning updated_date_3"
            }
            const resupdatehistorynego = await this.props.updateNegoStatus({ query: encrypt(passqueryupdatehistorynego) }).catch(err => err)
            if (resupdatehistorynego) {
                let passqueryupdatemastercart = encrypt("update gcm_master_cart set harga_sales='" + this.state.cart_price_current_buyer * this.state.cart_qty_total + "', " +
                    "harga_konsumen='" + this.state.cart_price_current_buyer * this.state.cart_qty + "', update_by=" + this.state.id_pengguna_login + ", update_date=now() where id=" + this.state.cart_id + " returning update_date")
                const resupdatemastercart = await this.props.updateNegoStatus({ query: passqueryupdatemastercart }).catch(err => err)
                if (resupdatemastercart) {
                    swal({
                        title: "Sukses!",
                        text: "Perubahan disimpan!",
                        icon: "success",
                        button: false,
                        timer: "2500"
                    }).then(() => {
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
        } else if (stat === 'ApproveHargaFinal') {
            let passqueryupdatehistorynego = encrypt(`with insertion as(insert into gcm_notification_nego (barang_id,barang_nama,buyer_id,buyer_nama,seller_id,seller_nama,date,source)
                values (${this.state.cart_id_sales},'${this.state.cart_nama_barang}',${this.state.cart_id_nama_perusahaan},'${this.state.cart_nama_perusahaan}',${this.state.company_id},'${this.state.company_name}',now(),'seller'))` +
                "update gcm_history_nego set harga_final='" + (this.state.harga_final.split('.').join('')) + "', " +
                "updated_by=" + this.state.id_pengguna_login + ", updated_date=now() where id=" + this.state.history_nego_id + " returning updated_date")

            const resupdatehistorynego = await this.props.updateNegoStatus({ query: passqueryupdatehistorynego }).catch(err => err)
            if (resupdatehistorynego) {
                let passqueryupdatemastercart = encrypt("update gcm_master_cart set harga_sales='" + (this.state.harga_final.split('.').join('')) * this.state.cart_qty_total + "', " +
                    "harga_konsumen='" + (this.state.harga_final.split('.').join('') * this.state.cart_qty_total) + "', update_by=" + this.state.id_pengguna_login + ", update_date=now() where id=" + this.state.cart_id + " returning update_date")
                const resupdatemastercart = await this.props.updateNegoStatus({ query: passqueryupdatemastercart }).catch(err => err)
                if (resupdatemastercart) {
                    swal({
                        title: "Sukses!",
                        text: "Perubahan disimpan!",
                        icon: "success",
                        button: false,
                        timer: "2500"
                    }).then(() => {
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

    handleEvent = (event, picker) => {
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate,
        });
        this.loadDataNegotiationActive("0")
        this.loadDataNegotiationInActive("0")
    }

    handleRefreshNegotiation = async () => {
        await this.setState({ isBtnRefreshNegotiation: true })
        await this.loadKursManual()
        await this.loadDataNegotiationActive("1")
        await this.loadDataNegotiationInActive("1")
        await this.setState({ isBtnRefreshNegotiation: false })
    }

    render() {
        let start = this.state.startDate.format('DD MMMM YYYY');
        let end = this.state.endDate.format('DD MMMM YYYY');
        let label = start + ' - ' + end;
        if (start === end) { label = start; }
        const dataNegoActive = {
            columns: [
                {
                    label: 'Perusahaan Pembeli',
                    field: 'nama_perusahaan',
                    width: 150
                },
                {
                    label: 'Nama Barang',
                    field: 'nama',
                    width: 150
                },
                {
                    label: 'Jatah Negosiasi',
                    field: 'jatah_nego',
                    width: 150
                },
                {
                    label: 'Tanggal Negosiasi',
                    field: 'create_date',
                    sort: 'desc',
                    width: 50
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allDataNegotiationActive
        }
        const dataNegoInActive = {
            columns: [
                {
                    label: 'Perusahaan Pembeli',
                    field: 'nama_perusahaan',
                    width: 150
                },
                {
                    label: 'Nama Barang',
                    field: 'nama',
                    width: 150
                },
                {
                    label: 'Jatah Negosiasi',
                    field: 'jatah_nego',
                    width: 150
                },
                {
                    label: 'Tanggal Negosiasi',
                    field: 'create_date',
                    sort: 'desc',
                    width: 50
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allDataNegotiationInActive
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-comment icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Negosiasi
                                    <div className="page-title-subheading">Daftar negosiasi untuk barang yang terdaftar pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
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
                        <button className="sm-2 mr-2 btn btn-primary" title="Perbarui data negosiasi"
                            disabled={this.state.isBtnRefreshNegotiation} onClick={this.handleRefreshNegotiation}>
                            <i className="fa fa-fw" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <div className="card-header card-header-tab-animation">
                                    <ul className="nav nav-justified">
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-0-nego" className="active nav-link"
                                        // onClick={this.loadDataNegotiationActive("0")}
                                        >Aktif</a></li>
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-1-nego" className="nav-link"
                                        // onClick={this.loadDataNegotiationInActive("0")}
                                        >Selesai</a></li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="tab-eg115-0-nego" role="tabpanel" >
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={dataNegoActive}
                                            />
                                        </div>
                                        <div className="tab-pane" id="tab-eg115-1-nego" role="tabpanel">
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={dataNegoInActive}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Detail Nego */}
                    <Modal size="lg" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                        {
                            (this.state.cart_notes === null || this.state.cart_notes === '') ?
                                <ModalHeader toggle={this.handleModalDetail}>Detail Negosiasi</ModalHeader>
                                :
                                <ModalHeader toggle={this.handleModalDetail}>Detail Negosiasi <i data-toggle="tooltip" data-placement="right" title="Tampilkan notes negosiasi"><InfoOutlinedIcon onClick={this.handleModalNotes}> </InfoOutlinedIcon></i></ModalHeader>
                        }
                        <ModalBody>
                            <div className="row" style={{ marginLeft: '3%', marginRight: '3%' }}>
                                <div style={{ width: '50%', float: 'left' }}>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Barang</p>
                                    <p className="mb-0"> {this.state.cart_kode_barang}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Barang</p>
                                    <p className="mb-0"> {this.state.cart_nama_barang}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Jumlah Barang </p>
                                    {/* <p className="mb-0"> {this.state.cart_qty} x {this.state.cart_qty_total} {this.state.cart_satuan}</p> */}
                                    <p className="mb-0"> {this.state.cart_qty} x {this.state.cart_berat} {this.state.cart_satuan}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Harga Tertinggi Barang</p>
                                    <p className="mb-0"><Badge color="warning"> {this.state.cart_price} </Badge>
                                        <NumberFormat value={this.state.cart_price_rupiah}
                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.cart_satuan}
                                    </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Harga Terendah Barang</p>
                                    <p className="mb-0"><Badge color="warning"> {this.state.cart_price_clear_terendah} </Badge>
                                        <NumberFormat value={(this.state.cart_price_terendah)}
                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.cart_satuan} </p>
                                </div>
                                <div style={{ width: '50%', float: 'right', paddingLeft: '3%' }}>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Sales Distributor </p>
                                    <p className="mb-0">{this.state.cart_kode_sales} | {this.state.cart_nama_sales}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Perusahaan Penego</p>
                                    <p className="mb-0"> {this.state.cart_nama_perusahaan} - {this.state.cart_buyer_number_mapping}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Pengaju Negosiasi</p>
                                    <p className="mb-0"> {this.state.cart_nama}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Tanggal Negosiasi</p>
                                    <p className="mb-0"> {this.state.cart_create_date}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Jatah Negosiasi</p>
                                    {(this.state.cart_jatah_nego === 1) ? <div><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span></div> :
                                        (this.state.cart_jatah_nego === 2) ? <div><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span></div> :
                                            (this.state.cart_jatah_nego === 3) ? <div><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span><span className="badge badge-pill badge-success" style={{ marginLeft: '1%' }}>✓</span></div> :
                                                <div><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span><span className="badge badge-pill badge-danger" style={{ marginLeft: '1%' }}>х</span></div>}
                                </div>
                            </div>
                            <div className="row" style={{ marginBottom: '0px' }}>
                                <div className="col-md-4">
                                    <div className="card-shadow-primary border mb-3 card card-body border-primary" style={{ marginTop: '10%' }} id="card_nego">
                                        {/* sini */}
                                        {/* <div style={{position: "absolute", top: "0", left: "0", marginTop:"3%", marginLeft:'3%'}}>
                                            <p style={{fontSize:'9pt'}}>{(this.state.cart_updated_date !== null) ? 'Diperbarui : '+this.state.cart_updated_date : ''}</p>
                                        </div>
                                        <div style={{position: "absolute", top: "0", left: "0", marginTop:"10%", marginLeft:'3%'}}>
                                            <p style={{fontSize:'9pt'}}>{(this.state.cart_nama_updated_nego !== '' ? 'Oleh : '+this.state.cart_nama_updated_nego : '')}</p>
                                        </div> */}
                                        <div style={{ position: "absolute", top: "0", right: "0", marginTop: "3%" }}>
                                            <Label><div className="mb-2 mr-2 badge badge-primary">Nego 1</div></Label>
                                        </div>
                                        <div style={{ marginTop: '10%' }}>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Pembeli</p>
                                            <p className="mb-0"><NumberFormat value={this.state.cart_harga_nego} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}</p>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Penjual</p>
                                            {(this.state.cart_harga_sales === null && this.state.cart_harga_nego !== null) ?
                                                <p className="mb-0">Menunggu</p>
                                                : (this.state.cart_harga_sales === null && this.state.cart_harga_nego === null) ?
                                                    <p className="mb-0">-</p>
                                                    :
                                                    <p className="mb-0"><NumberFormat value={this.state.cart_harga_sales} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}</p>
                                            }
                                        </div>
                                        <div style={{ marginTop: '5%' }}>
                                            <p className="mb-0" style={{ fontSize: '9pt' }}>{(this.state.cart_updated_date !== null) ? 'Diperbarui : ' + this.state.cart_updated_date : 'Diperbarui : -'}</p>
                                            <p className="mb-0" style={{ fontSize: '9pt' }}>{(this.state.cart_nama_updated_nego !== '' ? 'Oleh : ' + this.state.cart_nama_updated_nego : 'Oleh : -')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card-shadow-primary border mb-3 card card-body border-primary" style={{ marginTop: '10%' }} id="card_nego_2">
                                        {/* <div style={{position: "absolute", top: "0", left: "0", marginTop:"3%", marginLeft:'3%'}}>
                                            <p style={{fontSize:'9pt'}}>{(this.state.cart_updated_date_2 !== null) ? 'Diperbarui : '+this.state.cart_updated_date_2 : ''}</p>
                                        </div>
                                        <div style={{position: "absolute", top: "0", left: "0", marginTop:"10%", marginLeft:'3%'}}>
                                            <p style={{fontSize:'9pt'}}>{(this.state.cart_nama_updated_nego_2 !== '' ? 'Oleh : '+this.state.cart_nama_updated_nego_2 : '')}</p>
                                        </div> */}
                                        <div style={{ position: "absolute", top: "0", right: "0", marginTop: "3%" }}>
                                            <Label><div className="mb-2 mr-2 badge badge-primary">Nego 2</div></Label>
                                        </div>
                                        <div style={{ marginTop: '10%' }}>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Pembeli</p>
                                            {(this.state.cart_harga_nego_2 === null) ?
                                                <p className="mb-0">-</p>
                                                :
                                                <p className="mb-0"><NumberFormat value={this.state.cart_harga_nego_2} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}</p>
                                            }
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Penjual</p>
                                            {(this.state.cart_harga_sales_2 === null && this.state.cart_harga_nego_2 !== null) ?
                                                <p className="mb-0">Menunggu</p>
                                                : (this.state.cart_harga_sales_2 === null && this.state.cart_harga_nego_2 === null) ?
                                                    <p className="mb-0">-</p>
                                                    :
                                                    <p className="mb-0"><NumberFormat value={this.state.cart_harga_sales_2} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}</p>
                                            }
                                        </div>
                                        <div style={{ marginTop: '5%' }}>
                                            <p className="mb-0" style={{ fontSize: '9pt' }}>{(this.state.cart_updated_date_2 !== null) ? 'Diperbarui : ' + this.state.cart_updated_date_2 : 'Diperbarui : -'}</p>
                                            <p className="mb-0" style={{ fontSize: '9pt' }}>{(this.state.cart_nama_updated_nego_2 !== '' ? 'Oleh : ' + this.state.cart_nama_updated_nego_2 : 'Oleh : -')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card-shadow-primary border mb-3 card card-body border-primary" style={{ marginTop: '10%' }} id="card_nego_3">
                                        {/* <div style={{position: "absolute", top: "0", left: "0", marginTop:"3%", marginLeft:'3%'}}>
                                            <p style={{fontSize:'9pt'}}>{(this.state.cart_updated_date_3 !== null) ? 'Diperbarui : '+this.state.cart_updated_date_3 : ''}</p>
                                        </div>
                                        <div style={{position: "absolute", top: "0", left: "0", marginTop:"10%", marginLeft:'3%'}}>
                                            <p style={{fontSize:'9pt'}}>{(this.state.cart_nama_updated_nego_3 !== '' ? 'Oleh : '+this.state.cart_nama_updated_nego_3 : '')}</p>
                                        </div> */}
                                        <div style={{ position: "absolute", top: "0", right: "0", marginTop: "3%" }}>
                                            <Label><div className="mb-2 mr-2 badge badge-primary">Nego 3</div></Label>
                                        </div>
                                        <div style={{ marginTop: '10%' }}>
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Pembeli</p>
                                            {(this.state.cart_harga_nego_3 === null) ?
                                                <p className="mb-0">-</p>
                                                :
                                                <p className="mb-0"><NumberFormat value={this.state.cart_harga_nego_3} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}</p>
                                            }
                                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Penjual</p>
                                            {(this.state.cart_harga_sales_3 === null && this.state.cart_harga_nego_3 !== null) ?
                                                <p className="mb-0">Menunggu</p>
                                                : (this.state.cart_harga_sales_3 === null && this.state.cart_harga_nego_3 === null) ?
                                                    <p className="mb-0">-</p>
                                                    :
                                                    <p className="mb-0"><NumberFormat value={this.state.cart_harga_sales_3} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}</p>
                                            }
                                        </div>
                                        <div style={{ marginTop: '5%' }}>
                                            <p className="mb-0" style={{ fontSize: '9pt' }}>{(this.state.cart_updated_date_3 !== null) ? 'Diperbarui : ' + this.state.cart_updated_date_3 : 'Diperbarui : -'}</p>
                                            <p className="mb-0" style={{ fontSize: '9pt' }}>{(this.state.cart_nama_updated_nego_3 !== '' ? 'Oleh : ' + this.state.cart_nama_updated_nego_3 : 'Oleh : -')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '50%', float: 'left' }}>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Penawaran Terakhir Pembeli</p>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Penawaran Terakhir Anda</p>
                                {
                                    ((this.state.cart_nego_count === '1' && this.state.cart_harga_nego !== null && this.state.cart_harga_nego_2 === null && this.state.cart_harga_final === '0' && this.state.cart_flag_harga_sales_nego_pertama === null)
                                        || (this.state.cart_harga_sales_2 === null && this.state.cart_nego_count === '2' && this.state.cart_harga_nego_2 !== null && this.state.cart_harga_final === '0')
                                        || (this.state.cart_harga_sales_3 === null && this.state.cart_nego_count === '3' && this.state.cart_harga_nego_3 !== null && this.state.cart_harga_final === '0')) ?
                                        <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '10%' }}> Harga Penawaran Terbaru (@{this.state.cart_satuan})</p> //hpt
                                        : (this.state.cart_harga_final !== '0') ?
                                            <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '5%' }}> Harga Final </p>
                                            :
                                            false
                                }
                            </div>
                            <div style={{ width: '50%', float: 'right' }}>
                                <p className="mb-0"><NumberFormat value={this.state.cart_price_current_buyer} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}</p>
                                <p className="mb-0"><NumberFormat value={this.state.cart_price_current_seller} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}</p>
                                {
                                    ((this.state.cart_nego_count === '1' && this.state.cart_harga_nego !== null && this.state.cart_harga_nego_2 === null && this.state.cart_harga_final === '0' && this.state.cart_flag_harga_sales_nego_pertama === null)
                                        || (this.state.cart_harga_sales_2 === null && this.state.cart_nego_count === '2' && this.state.cart_harga_nego_2 !== null && this.state.cart_harga_final === '0')
                                        || (this.state.cart_harga_sales_3 === null && this.state.cart_nego_count === '3' && this.state.cart_harga_nego_3 !== null && this.state.cart_harga_final === '0')) ?
                                        <div className="input-group" style={{ marginTop: '5%' }}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">IDR</span>
                                                {/* <Input type="number" name="harga_tawar_terbaru" id="harga_tawar_terbaru" className="form-control"
                                                            placeholder="Harga" onChange={this.handleChange}
                                                            required
                                                            invalid={this.state.empty_harga_tawar_terbaru}
                                                            max={this.state.cart_price_rupiah}
                                                            min={this.state.cart_price_current_buyer}/> */}
                                                <NumberFormat thousandSeparator='.' allowNegative={false} decimalSeparator=',' name="harga_tawar_terbaru" id="harga_tawar_terbaru" onChange={this.handleChange} className="form-control"></NumberFormat>
                                            </div>
                                            <FormFeedback></FormFeedback>
                                        </div>
                                        : (this.state.cart_harga_final !== '0') ?
                                            <p className="mb-0"><Badge color="primary" style={{ marginTop: '5%' }}><NumberFormat value={this.state.cart_harga_final} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></Badge> / {this.state.cart_satuan} </p>
                                            :
                                            false
                                }
                                <div id="errorharga" style={{ display: 'none' }}>
                                    <p style={{ color: 'red' }}>{this.state.errormessage}</p>
                                </div>
                            </div>
                        </ModalBody>
                        {
                            ((this.state.cart_nego_count === '1' && this.state.cart_harga_nego !== null && this.state.cart_harga_nego_2 === null && this.state.cart_harga_final === '0' && this.state.cart_flag_harga_sales_nego_pertama === null)
                                || (this.state.cart_harga_sales_2 === null && this.state.cart_nego_count === '2' && this.state.cart_harga_nego_2 !== null && this.state.cart_harga_final === '0')
                                || (this.state.cart_harga_sales_3 === null && this.state.cart_nego_count === '3' && this.state.cart_harga_nego_3 !== null && this.state.cart_harga_final === '0'))
                                ?
                                <ModalFooter>
                                    <Button color="primary" onClick={this.handleConfirmNegoBaru}
                                        disabled={this.state.isBtnNego}>Nego </Button>
                                    <Button color="success" onClick={this.handleConfirmSetujui}>Setuju</Button>
                                </ModalFooter>
                                : ((this.state.cart_nego_count === '3' && (this.state.cart_harga_nego_3 !== this.state.cart_harga_sales_3) && this.state.cart_harga_final === '0'))
                                    ?
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.handleModalHargaFinal}>Tetapkan Harga Final </Button>
                                    </ModalFooter>
                                    :
                                    false
                        }
                    </Modal>

                    {/* Modal Confirm Nego  MCN*/}
                    <Modal size="sm" toggle={this.handleConfirmNegoBaru} isOpen={this.state.isOpenModalNegoBaru} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleConfirmNegoBaru}>Konfirmasi Aksi</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group">
                                <label>Apakah yakin akan melakukan aksi ini?</label>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.confirmAction('Nego')}>Konfirmasi</Button>
                            <Button color="danger" onClick={this.handleConfirmNegoBaru}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    {/* Modal Confirm Setujui */}
                    <Modal size="sm" toggle={this.handleConfirmSetujui} isOpen={this.state.isOpenModalSetujuiNego} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleConfirmSetujui}>Konfirmasi Aksi</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group">
                                <label>Setuju pada harga <NumberFormat value={this.state.cart_price_current_buyer} displayType={'text'} style={{ fontWeight: 'bold' }} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}?
                                    Proses negosiasi akan diselesaikan dan harga barang akan mengikuti harga kesepakatan negosiasi.
                                </label>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.confirmAction('Approve')}>Konfirmasi</Button>
                            <Button color="danger" onClick={this.handleConfirmSetujui}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    {/* Modal Peringatan */}
                    <Modal size="sm" toggle={this.handleModalPeringatan} isOpen={this.state.isOpenPeringatan} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleModalPeringatan}>Peringatan!</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group">
                                <label>{this.state.errormessage}</label>
                            </div>
                        </ModalBody>
                    </Modal>

                    {/* Modal Tentukan Harga Final */}
                    <Modal size="md" toggle={this.handleModalHargaFinal} isOpen={this.state.isOpenHargaFinal} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleModalHargaFinal}>Konfirmasi Harga Final</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group">
                                <label>Proses negosiasi akan diselesaikan dan harga barang akan mengikuti harga final berikut.</label>
                                <div className="input-group">
                                    <div style={{ width: '45%', float: 'left', marginTop: '4%' }}>
                                        <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '2%' }}>Harga Barang</p>
                                        <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '2%' }}>Penawaran Terakhir Pembeli</p>
                                        <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '2%' }}>Penawaran Terakhir Anda</p>
                                        <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '8%' }}>Harga Final</p>
                                    </div>
                                    <div style={{ width: '55%', float: 'right', marginTop: '4%' }}>
                                        <p className="mb-0" style={{ paddingTop: '1%' }}> <NumberFormat value={this.state.cart_price_rupiah}
                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                        <p className="mb-0" style={{ marginTop: '2%' }}> <NumberFormat value={this.state.cart_price_current_buyer}
                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                        <p className="mb-0" style={{ marginTop: '2%' }}> <NumberFormat value={this.state.cart_price_current_seller}
                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat></p>
                                        <div className="input-group-prepend" style={{ marginTop: '3%' }}>
                                            <span className="input-group-text">IDR</span>
                                            {/* <Input type="number" name="harga_final" id="harga_final" className="form-control"
                                                placeholder="Harga" onChange={this.handleChange}
                                                required
                                                invalid={this.state.empty_harga_final}
                                                max={this.state.cart_price_rupiah}
                                                min={this.state.cart_price_current_buyer}/> */}
                                            <NumberFormat thousandSeparator='.' decimalSeparator=',' allowNegative={false} name="harga_final" id="harga_final" onChange={this.handleChangeHargaFinal} className="form-control"></NumberFormat>
                                        </div>
                                        <FormFeedback></FormFeedback>
                                        <div id="errorhargafinal" style={{ display: 'none' }}>
                                            <p style={{ color: 'red' }}>{this.state.errormessagehargafinal}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.handleConfirmHargaFinal} disabled={this.state.isBtnConfirmHargaFinal}>Konfirmasi</Button>
                            <Button color="danger" onClick={this.handleModalHargaFinal}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    {/* Modal Confirm HargaFinal */}
                    <Modal size="sm" toggle={this.handleConfirmHargaFinal} isOpen={this.state.isOpenConfirmHargaFinal} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleConfirmHargaFinal}>Konfirmasi Aksi</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group">
                                <label>Apakah yakin akan melakukan konfirmasi harga final sebesar <NumberFormat value={this.state.harga_final} displayType={'text'} style={{ fontWeight: 'bold' }} thousandSeparator='.' decimalSeparator=',' prefix={'IDR '}></NumberFormat> / {this.state.cart_satuan}?</label>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.confirmAction('ApproveHargaFinal')}>Konfirmasi</Button>
                            <Button color="danger" onClick={this.handleConfirmHargaFinal}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    {/* Modal Notes */}
                    <Modal size="sm" toggle={this.handleModalNotes} isOpen={this.state.isOpenNotes} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleModalNotes}>Notes Negosiasi</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group">
                                <Input type="textarea" name="notes_blacklist" maxLength="50" rows="2" value={this.state.cart_notes}
                                    disabled="disabled"
                                />
                            </div>
                        </ModalBody>
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
    getKursAPIManual: (data) => dispatch(getKursAPIManual(data)),
    getKursActiveAPIManual: (data) => dispatch(getKursActiveAPIManual(data)),
    getDataNegotiationAPI: (data) => dispatch(getDataNegotiationAPI(data)),
    getDataDetailedSalesHandlerAPI: (data) => dispatch(getDataDetailedSalesHandlerAPI(data)),
    getDataDetailedNegotiationAPI: (data) => dispatch(getDataDetailedNegotiationAPI(data)),
    showLastUpdatedNego: (data) => dispatch(showLastUpdatedNego(data)),
    updateNegoStatus: (data) => dispatch(updateNegoStatus(data)),
    getKursAPI: () => dispatch(getKursAPI()),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentNegosiasi));