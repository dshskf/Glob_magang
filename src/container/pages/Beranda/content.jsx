import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { totalBeranda, totalBerandaChart, logoutUserAPI, getNotifyData} from '../../../config/redux/action';
import { MDBContainer } from 'mdbreact';
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap'
import swal from 'sweetalert';
import { withRouter } from 'react-router-dom';
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import moment from 'moment';
import 'moment/locale/id'

class ContentBeranda extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        total_barang: '',
        total_barang_aktif: '',
        total_barang_nonaktif: '',
        total_barang_onconfirm: '',
        total_barang_onconfirm_ditolak: '',
        total_barang_master_nonaktif: '',
        total_negosiasi: '',
        total_negosiasi_aktif: '',
        total_negosiasi_nonaktif: '',
        total_transaksi: '',
        total_transaksi_menunggu: '',
        total_transaksi_diproses: '',
        total_transaksi_dikirim: '',
        total_transaksi_diterima: '',
        total_transaksi_dikeluhkan: '',
        total_transaksi_selesai: '',
        total_transaksi_dibatalkan: '',
        total_pembeli: '',
        total_pembeli_aktif: '',
        total_pembeli_nonaktif: '',
        total_pembeli_inaktif: '',
        total_sales: '',
        total_sales_aktif: '',
        total_sales_nonaktif: '',
        total_sales_inaktif: '',
        total_payment: '',
        total_payment_aktif: '',
        total_payment_nonaktif: '',
        total_payment_onconfirm: '',
        total_payment_onconfirm_ditolak: '',
        isOpenModalNotify: false,
        openModalNotify: null,
        startDate: moment().startOf('month'),
        endDate: moment(),                              // now
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        }
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
        this.loadCountBarang()
        this.loadCountNegosiasi()
        this.loadCountTransaksi()
        this.loadCountPembeli()
        this.loadNotifyMapping()
        if (this.state.sa_role === 'admin') {
            this.loadCountSales()
            this.loadCountPayment()
        }
    }

    loadNotifyMapping = async () => {

        const query = `select distinct gmc.nama_perusahaan from gcm_listing_alamat gla inner join gcm_master_alamat gma on gla.id_master_alamat = gma.id  
        inner join gcm_master_company gmc on gmc.id = gla.id_buyer
        where id_seller = ${this.state.company_id} and (gma.shipto_active = 'Y' or gma.billto_active = 'Y')  and (gla.kode_shipto_customer is null or gla.kode_billto_customer is null) `

        const res = await this.props.getNotify({ query: encrypt(query) }).catch(err => err)

        if (res.length > 0) {
            this.setState({ isOpenModalNotify: true, openModalNotify: res })
        }
    }

    loadCountBarang = async () => {
        let passquerycountbarang = ""
        if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            passquerycountbarang = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " " +
                "and gcm_master_barang.category_id=" + this.state.sa_divisi)
        } else {
            passquerycountbarang = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id)
        }
        const res = await this.props.totalBeranda({ query: passquerycountbarang }).catch(err => err)
        if (res) {
            this.setState({
                total_barang: res.total
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
        let passquerycountbarangaktif = ""
        if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            passquerycountbarangaktif = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_list_barang.status = 'A' and gcm_master_barang.status='A' " +
                "and gcm_master_barang.category_id=" + this.state.sa_divisi)
        } else {
            passquerycountbarangaktif = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_list_barang.status = 'A' and gcm_master_barang.status='A' ")
        }
        const resaktif = await this.props.totalBeranda({ query: passquerycountbarangaktif }).catch(err => err)
        if (resaktif) {
            this.setState({
                total_barang_aktif: resaktif.total
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
        let passquerycountbarangnonaktif = ""
        if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            passquerycountbarangnonaktif = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_list_barang.status = 'I' and gcm_master_barang.status='A' " +
                "and gcm_master_barang.category_id=" + this.state.sa_divisi)
        } else {
            passquerycountbarangnonaktif = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_list_barang.status = 'I' and gcm_master_barang.status='A'")
        }
        const resnonaktif = await this.props.totalBeranda({ query: passquerycountbarangnonaktif }).catch(err => err)
        if (resnonaktif) {
            this.setState({
                total_barang_nonaktif: resnonaktif.total
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
        let passquerycountbarangonconfirm = ""
        if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            passquerycountbarangonconfirm = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_list_barang.status = 'C' and gcm_master_barang.status != 'I' " +
                "and gcm_master_barang.category_id=" + this.state.sa_divisi)
        } else {
            passquerycountbarangonconfirm = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_list_barang.status = 'C' and gcm_master_barang.status != 'I'")
        }
        const resonconfirm = await this.props.totalBeranda({ query: passquerycountbarangonconfirm }).catch(err => err)
        if (resonconfirm) {
            this.setState({
                total_barang_onconfirm: resonconfirm.total
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
        let passquerycountbarangonconfirmditolak = ""
        if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            passquerycountbarangonconfirmditolak = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_list_barang.status = 'R' and gcm_master_barang.status != 'I' " +
                "and gcm_master_barang.category_id=" + this.state.sa_divisi)
        } else {
            passquerycountbarangonconfirmditolak = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_list_barang.status = 'R' and gcm_master_barang.status != 'I'")
        }
        const resonconfirmditolak = await this.props.totalBeranda({ query: passquerycountbarangonconfirmditolak }).catch(err => err)
        if (resonconfirmditolak) {
            this.setState({
                total_barang_onconfirm_ditolak: resonconfirmditolak.total
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
        let passquerycountbarangmasternonaktif = ""
        if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            passquerycountbarangmasternonaktif = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_master_barang.status = 'I' " +
                "and gcm_master_barang.category_id=" + this.state.sa_divisi)
        } else {
            passquerycountbarangmasternonaktif = encrypt("select count(gcm_list_barang.id) as total " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_master_barang.status = 'I'")
        }
        const resonconfirmmasternonaktif = await this.props.totalBeranda({ query: passquerycountbarangmasternonaktif }).catch(err => err)
        if (resonconfirmmasternonaktif) {
            this.setState({
                total_barang_master_nonaktif: resonconfirmmasternonaktif.total
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
        // if (this.state.total_barang !== '0'){
        //     document.getElementById('divbarang').style.display='block'
        // }
    }

    loadCountNegosiasi = async () => {
        let passquerycountnegosiasi = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquerycountnegosiasi = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.nego_count > 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0))"+
            //         " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' "+
            //         "and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+"' "+
            //         "and gcm_master_barang.category_id="+this.state.sa_divisi)
            // } else {
            //     passquerycountnegosiasi = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.nego_count > 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0))"+
            //         " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' "+
            //         "and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycountnegosiasi = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0))" +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' " +
                    "and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') + "' " +
                    "and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycountnegosiasi = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0))" +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' " +
                    "and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquerycountnegosiasi = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.nego_count > 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         "and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0))"+
            //         " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_barang.category_id="+this.state.sa_divisi)
            // } else {
            //     passquerycountnegosiasi = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.nego_count > 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         "and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0))"+
            //         " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL;")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycountnegosiasi = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    "and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0))" +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycountnegosiasi = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    "and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0))" +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL;")
            }
        }
        const res = await this.props.totalBeranda({ query: passquerycountnegosiasi }).catch(err => err)
        if (res) {
            this.setState({
                total_negosiasi: res.total
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
        let passquerycountnegosiasiaktif = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' "+
            //         "and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+"' "+
            //         "and gcm_master_barang.category_id="+this.state.sa_divisi)
            // } else {
            //     passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' "+
            //         "and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' " +
                    "and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') + "' " +
                    "and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' " +
                    "and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_barang.category_id="+this.state.sa_divisi)
            // } else {
            //     passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL;")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL;")
            }
        }
        const resaktif = await this.props.totalBeranda({ query: passquerycountnegosiasiaktif }).catch(err => err)
        if (resaktif) {
            this.setState({
                total_negosiasi_aktif: resaktif.total
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
        let passquerycountnegosiasinonaktif = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' "+
            //         "and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+"' "+
            //         "and gcm_master_barang.category_id="+this.state.sa_divisi)
            // } else {
            //     passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' "+
            //         "and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' " +
                    "and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') + "' " +
                    "and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' " +
                    "and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            //     passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_barang.category_id="+this.state.sa_divisi)
            // } else {
            //     passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total "+
            //         "from gcm_master_cart "+
            //             "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            //             "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id "+
            //         "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL;")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total " +
                    "from gcm_master_cart " +
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                    "inner join gcm_master_barang on gcm_master_barang.id = gcm_list_barang.barang_id " +
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 and gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL;")
            }
        }
        const resnonaktif = await this.props.totalBeranda({ query: passquerycountnegosiasinonaktif }).catch(err => err)
        if (resnonaktif) {
            this.setState({
                total_negosiasi_nonaktif: resnonaktif.total
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
        // if (this.state.total_negosiasi !== '0'){
        //     document.getElementById('divnego').style.display='block'
        // }
    }

    loadCountTransaksi = async () => {
        let passquerycounttransaksi = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksi = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksi = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksi = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksi = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksi = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksi = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksi = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksi = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL")
            }
        }
        const res = await this.props.totalBeranda({ query: passquerycounttransaksi }).catch(err => err)
        if (res) {
            this.setState({
                total_transaksi: res.total
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
        let passquerycounttransaksimenunggu = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksimenunggu = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='WAITING' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksimenunggu = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='WAITING' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksimenunggu = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='WAITING' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksimenunggu = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='WAITING' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksimenunggu = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='WAITING'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksimenunggu = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='WAITING'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksimenunggu = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='WAITING'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksimenunggu = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='WAITING'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL")
            }
        }
        const reswaiting = await this.props.totalBeranda({ query: passquerycounttransaksimenunggu }).catch(err => err)
        if (reswaiting) {
            this.setState({
                total_transaksi_menunggu: reswaiting.total
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
        let passquerycounttransaksidiproses = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksidiproses = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='ONGOING' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksidiproses = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='ONGOING' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksidiproses = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='ONGOING' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksidiproses = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='ONGOING' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })

        } else {
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksidiproses = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='ONGOING'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksidiproses = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='ONGOING'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksidiproses = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='ONGOING'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksidiproses = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='ONGOING'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL")
            }
        }
        const resongoing = await this.props.totalBeranda({ query: passquerycounttransaksidiproses }).catch(err => err)
        if (resongoing) {
            this.setState({
                total_transaksi_diproses: resongoing.total
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
        let passquerycounttransaksiditerima = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksiditerima = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='RECEIVED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksiditerima = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='RECEIVED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksiditerima = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='RECEIVED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksiditerima = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='RECEIVED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksiditerima = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='RECEIVED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksiditerima = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='RECEIVED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksiditerima = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='RECEIVED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksiditerima = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='RECEIVED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL")
            }
        }
        const resreceived = await this.props.totalBeranda({ query: passquerycounttransaksiditerima }).catch(err => err)
        if (resreceived) {
            this.setState({
                total_transaksi_diterima: resreceived.total
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
        let passquerycounttransaksidikeluhkan = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksidikeluhkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='COMPLAINED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksidikeluhkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='COMPLAINED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksidikeluhkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='COMPLAINED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksidikeluhkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='COMPLAINED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksidikeluhkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='COMPLAINED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksidikeluhkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='COMPLAINED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksidikeluhkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='COMPLAINED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksidikeluhkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='COMPLAINED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL")
            }
        }
        const rescomplained = await this.props.totalBeranda({ query: passquerycounttransaksidikeluhkan }).catch(err => err)
        if (rescomplained) {
            this.setState({
                total_transaksi_dikeluhkan: rescomplained.total
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
        let passquerycounttransaksiselesai = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksiselesai = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='FINISHED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksiselesai = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='FINISHED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksiselesai = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='FINISHED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksiselesai = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='FINISHED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksiselesai = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='FINISHED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksiselesai = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='FINISHED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksiselesai = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='FINISHED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksiselesai = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='FINISHED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL")
            }
        }
        const resfinished = await this.props.totalBeranda({ query: passquerycounttransaksiselesai }).catch(err => err)
        if (resfinished) {
            this.setState({
                total_transaksi_selesai: resfinished.total
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
        let passquerycounttransaksidibatalkan = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='CANCELED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='CANCELED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='CANCELED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='CANCELED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='CANCELED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='CANCELED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='CANCELED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='CANCELED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL")
            }
        }
        const rescanceled = await this.props.totalBeranda({ query: passquerycounttransaksidibatalkan }).catch(err => err)
        if (rescanceled) {
            this.setState({
                total_transaksi_dibatalkan: rescanceled.total
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
        let passquerycounttransaksidikirim = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='CANCELED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"' and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='CANCELED' "+
            //         "and gcm_master_transaction.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+
            //         "' and gcm_master_transaction.create_date < '"+datetemp.format('YYYY-MM-DD')+"'")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksidikirim = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='SHIPPED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "' and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksidikirim = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='SHIPPED' " +
                    "and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                    "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            }
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
            //     passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='CANCELED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
            // } else {
            //     passquerycounttransaksidibatalkan = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total "+
            //         "from gcm_transaction_detail "+
            //             "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction "+
            //             "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id "+
            //             "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id "+
            //         "where gcm_list_barang.company_id="+this.state.company_id+" and gcm_master_transaction.status='CANCELED'"+
            //         " and gcm_master_transaction.create_date between '"+
            //         this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
            //         "'::TIMESTAMP + '1 days'::INTERVAL")
            // }
            if (this.state.sa_role === 'sales') {
                passquerycounttransaksidikirim = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "inner join gcm_company_listing_sales on gcm_transaction_detail.buyer_id = gcm_company_listing_sales.buyer_id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='SHIPPED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
            } else {
                passquerycounttransaksidikirim = encrypt("select count(distinct gcm_master_transaction.id_transaction) as total " +
                    "from gcm_transaction_detail " +
                    "inner join gcm_master_transaction on gcm_transaction_detail.transaction_id = gcm_master_transaction.id_transaction " +
                    "inner join gcm_list_barang on gcm_transaction_detail.barang_id = gcm_list_barang.id " +
                    "inner join gcm_master_company on gcm_transaction_detail.buyer_id = gcm_master_company.id " +
                    "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_master_transaction.status='SHIPPED'" +
                    " and gcm_master_transaction.create_date between '" +
                    this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                    "'::TIMESTAMP + '1 days'::INTERVAL")
            }
        }
        const resshipped = await this.props.totalBeranda({ query: passquerycounttransaksidikirim }).catch(err => err)
        if (resshipped) {
            this.setState({
                total_transaksi_dikirim: resshipped.total
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
        // if (this.state.total_transaksi !== '0'){
        //     document.getElementById('divtransaksi').style.display='block'
        // }
    }

    loadCountPembeli = async () => {
        let passquerycountpembeli = ""
        // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
        //     passquerycountpembeli = encrypt("select count(gcm_master_company.id) as total "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+" and gcm_master_company.type='B'"+
        //         " and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
        // } else {
        //     passquerycountpembeli = encrypt("select count(gcm_master_company.id) as total "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+" and gcm_master_company.type='B'")
        // }
        if (this.state.sa_role === 'sales') {
            passquerycountpembeli = encrypt("select count(gcm_master_company.id) as total " +
                "from gcm_master_company " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "inner join gcm_company_listing_sales on gcm_master_company.id = gcm_company_listing_sales.buyer_id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_master_company.type='B'" +
                " and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
        } else {
            passquerycountpembeli = encrypt("select count(gcm_master_company.id) as total " +
                "from gcm_master_company " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_master_company.type='B'")
        }
        const res = await this.props.totalBeranda({ query: passquerycountpembeli }).catch(err => err)
        if (res) {
            this.setState({
                total_pembeli: res.total
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
        let passquerycountpembeliaktif = ""
        // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
        //     passquerycountpembeliaktif = encrypt("select count(gcm_master_company.id) as total "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+" and gcm_master_company.type='B' and gcm_company_listing.status='A'"+
        //         " and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
        // } else {
        //     passquerycountpembeliaktif = encrypt("select count(gcm_master_company.id) as total "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+" and gcm_master_company.type='B' and gcm_company_listing.status='A'")
        // }
        if (this.state.sa_role === 'sales') {
            passquerycountpembeliaktif = encrypt("select count(gcm_master_company.id) as total " +
                "from gcm_master_company " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "inner join gcm_company_listing_sales on gcm_master_company.id = gcm_company_listing_sales.buyer_id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_master_company.type='B' and gcm_company_listing.status='A'" +
                " and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
        } else {
            passquerycountpembeliaktif = encrypt("select count(gcm_master_company.id) as total " +
                "from gcm_master_company " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_master_company.type='B' and gcm_company_listing.status='A'")
        }
        const resaktif = await this.props.totalBeranda({ query: passquerycountpembeliaktif }).catch(err => err)
        if (resaktif) {
            this.setState({
                total_pembeli_aktif: resaktif.total
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
        let passquerycountpembelinonaktif = ""
        // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
        //     passquerycountpembelinonaktif = encrypt("select count(gcm_master_company.id) as total "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+" and gcm_master_company.type='B' and gcm_company_listing.status='R'"+
        //         " and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
        // } else {
        //     passquerycountpembelinonaktif = encrypt("select count(gcm_master_company.id) as total "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+" and gcm_master_company.type='B' and gcm_company_listing.status='R'")
        // }
        if (this.state.sa_role === 'sales') {
            passquerycountpembelinonaktif = encrypt("select count(gcm_master_company.id) as total " +
                "from gcm_master_company " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "inner join gcm_company_listing_sales on gcm_master_company.id = gcm_company_listing_sales.buyer_id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_master_company.type='B' and gcm_company_listing.status='R'" +
                " and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
        } else {
            passquerycountpembelinonaktif = encrypt("select count(gcm_master_company.id) as total " +
                "from gcm_master_company " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_master_company.type='B' and gcm_company_listing.status='R'")
        }
        const resnonaktif = await this.props.totalBeranda({ query: passquerycountpembelinonaktif }).catch(err => err)
        if (resnonaktif) {
            this.setState({
                total_pembeli_nonaktif: resnonaktif.total
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
        let passquerycountpembeliinaktif = ""
        // if (this.state.sa_role==='sales' && this.state.tipe_bisnis === '1') {
        //     passquerycountpembeliinaktif = encrypt("select count(gcm_master_company.id) as total "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+" and gcm_master_company.type='B' and gcm_company_listing.status='I'"+
        //         " and gcm_master_company.tipe_bisnis="+this.state.sa_divisi)
        // } else {
        //     passquerycountpembeliinaktif = encrypt("select count(gcm_master_company.id) as total "+
        //         "from gcm_master_company "+
        //             "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id "+
        //         "where gcm_company_listing.seller_id="+this.state.company_id+" and gcm_master_company.type='B' and gcm_company_listing.status='I'")
        // }
        if (this.state.sa_role === 'sales') {
            passquerycountpembeliinaktif = encrypt("select count(gcm_master_company.id) as total " +
                "from gcm_master_company " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "inner join gcm_company_listing_sales on gcm_master_company.id = gcm_company_listing_sales.buyer_id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_master_company.type='B' and gcm_company_listing.status='I'" +
                " and gcm_company_listing_sales.id_sales=" + this.state.id_pengguna_login)
        } else {
            passquerycountpembeliinaktif = encrypt("select count(gcm_master_company.id) as total " +
                "from gcm_master_company " +
                "inner join gcm_company_listing on gcm_master_company.id = gcm_company_listing.buyer_id " +
                "where gcm_company_listing.seller_id=" + this.state.company_id + " and gcm_master_company.type='B' and gcm_company_listing.status='I'")
        }
        const resinaktif = await this.props.totalBeranda({ query: passquerycountpembeliinaktif }).catch(err => err)
        if (resinaktif) {
            this.setState({
                total_pembeli_inaktif: resinaktif.total
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
        // if (this.state.total_pembeli !== '0'){
        //     document.getElementById('divpembeli').style.display='block'
        // }
    }

    loadCountSales = async () => {
        let passquerycountsales = encrypt("select count(gcm_master_user.id) as total " +
            "from gcm_master_user " +
            "where gcm_master_user.company_id=" + this.state.company_id + " and gcm_master_user.sa_role='sales'")
        const res = await this.props.totalBeranda({ query: passquerycountsales }).catch(err => err)
        if (res) {
            this.setState({
                total_sales: res.total
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
        let passquerycountsalesaktif = encrypt("select count(gcm_master_user.id) as total " +
            "from gcm_master_user " +
            "where gcm_master_user.company_id=" + this.state.company_id + " and gcm_master_user.sa_role='sales' and " +
            "gcm_master_user.status='A'")
        const resaktif = await this.props.totalBeranda({ query: passquerycountsalesaktif }).catch(err => err)
        if (resaktif) {
            this.setState({
                total_sales_aktif: resaktif.total
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
        let passquerycountsalesnonaktif = encrypt("select count(gcm_master_user.id) as total " +
            "from gcm_master_user " +
            "where gcm_master_user.company_id=" + this.state.company_id + " and gcm_master_user.sa_role='sales' and " +
            "gcm_master_user.status='R'")
        const resnonaktif = await this.props.totalBeranda({ query: passquerycountsalesnonaktif }).catch(err => err)
        if (resnonaktif) {
            this.setState({
                total_sales_nonaktif: resnonaktif.total
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
        let passquerycountsalesinaktif = encrypt("select count(gcm_master_user.id) as total " +
            "from gcm_master_user " +
            "where gcm_master_user.company_id=" + this.state.company_id + " and gcm_master_user.sa_role='sales' and " +
            "gcm_master_user.status='I'")
        const resinaktif = await this.props.totalBeranda({ query: passquerycountsalesinaktif }).catch(err => err)
        if (resinaktif) {
            this.setState({
                total_sales_inaktif: resinaktif.total
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
        // if (this.state.total_sales !== '0'){
        //     document.getElementById('divsales').style.display='block'
        // }
    }

    loadCountPayment = async () => {
        let passquerycountpayment = encrypt("select count(gcm_seller_payment_listing.id) as total " +
            "from gcm_seller_payment_listing " +
            "where gcm_seller_payment_listing.seller_id=" + this.state.company_id)
        const res = await this.props.totalBeranda({ query: passquerycountpayment }).catch(err => err)
        if (res) {
            this.setState({
                total_payment: res.total
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
        let passquerycountpaymentaktif = encrypt("select count(gcm_seller_payment_listing.id) as total " +
            "from gcm_seller_payment_listing " +
            "where gcm_seller_payment_listing.seller_id=" + this.state.company_id + " and gcm_seller_payment_listing.status='A'")
        const resaktif = await this.props.totalBeranda({ query: passquerycountpaymentaktif }).catch(err => err)
        if (resaktif) {
            this.setState({
                total_payment_aktif: resaktif.total
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
        let passquerycountpaymentnonaktif = encrypt("select count(gcm_seller_payment_listing.id) as total " +
            "from gcm_seller_payment_listing " +
            "where gcm_seller_payment_listing.seller_id=" + this.state.company_id + " and gcm_seller_payment_listing.status='I'")
        const resnonaktif = await this.props.totalBeranda({ query: passquerycountpaymentnonaktif }).catch(err => err)
        if (resnonaktif) {
            this.setState({
                total_payment_nonaktif: resnonaktif.total
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
        let passquerycountpaymentonconfirm = encrypt("select count(gcm_seller_payment_listing.id) as total " +
            "from gcm_seller_payment_listing " +
            "where gcm_seller_payment_listing.seller_id=" + this.state.company_id + " and gcm_seller_payment_listing.status='C'")
        const resonconfirm = await this.props.totalBeranda({ query: passquerycountpaymentonconfirm }).catch(err => err)
        if (resonconfirm) {
            this.setState({
                total_payment_onconfirm: resonconfirm.total
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
        let passquerycountpaymentonconfirmditolak = encrypt("select count(gcm_seller_payment_listing.id) as total " +
            "from gcm_seller_payment_listing " +
            "where gcm_seller_payment_listing.seller_id=" + this.state.company_id + " and gcm_seller_payment_listing.status='R'")
        const resonconfirmditolak = await this.props.totalBeranda({ query: passquerycountpaymentonconfirmditolak }).catch(err => err)
        if (resonconfirmditolak) {
            this.setState({
                total_payment_onconfirm_ditolak: resonconfirmditolak.total
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
        // if (this.state.total_payment !== '0'){
        //     document.getElementById('divpayment').style.display='block'
        // }
    }

    handleEvent = (event, picker) => {
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate,
        })
        this.componentDidMount()
    }

    render() {
        let start = this.state.startDate.format('DD MMMM YYYY');
        let end = this.state.endDate.format('DD MMMM YYYY');
        let label = start + ' - ' + end;
        if (start === end) { label = start; }
        const dataPieBarang = {
            labels: ["Tersedia", "Proses Konfirmasi", "Tidak Tersedia", "Konfirmasi Ditolak", "Nonaktif"],
            datasets: [
                {
                    data: [this.state.total_barang_aktif, this.state.total_barang_onconfirm, this.state.total_barang_nonaktif,
                    this.state.total_barang_onconfirm_ditolak, this.state.total_barang_master_nonaktif],
                    backgroundColor: [
                        "#3ac47d",
                        "#3f6ad8",
                        "#d92550",
                        "#f7b924",
                        "#794c8a"
                    ],
                    hoverBackgroundColor: [
                        "#2e9d64",
                        "#213770",
                        "#ad1e40",
                        "#e0a008",
                        "#5c3a69"
                    ]
                }
            ]
        }
        const dataPieNego = {
            labels: ["Aktif", "Selesai"],
            datasets: [
                {
                    data: [this.state.total_negosiasi_aktif, this.state.total_negosiasi_nonaktif],
                    backgroundColor: [
                        "#3ac47d",
                        "#d92550"
                    ],
                    hoverBackgroundColor: [
                        "#2e9d64",
                        "#ad1e40"
                    ]
                }
            ]
        }
        const dataPieTransaksi = {
            labels: ["Menunggu", "Diproses", "Dikirim", "Diterima", "Dikeluhkan", "Selesai", "Dibatalkan"],
            datasets: [
                {
                    label: "Jumlah Transaksi",
                    data: [this.state.total_transaksi_menunggu, this.state.total_transaksi_diproses, this.state.total_transaksi_dikirim,
                    this.state.total_transaksi_diterima, this.state.total_transaksi_dikeluhkan, this.state.total_transaksi_selesai, this.state.total_transaksi_dibatalkan],
                    backgroundColor: [
                        "rgba(192,192,192,0.4)",
                        "rgba(0,0,255,0.4)",
                        "rgba(20, 130, 255, 0.4)",
                        "rgba(0,255,0,0.4)",
                        "rgba(255,0,0,0.4)",
                        "rgba(238,130,238,0.4)",
                        "rgba(255,255,0,0.4)"
                    ],
                    borderWidth: 2,
                    borderColor: [
                        "rgba(192,192,192,1)",
                        "rgba(0,0,255,1)",
                        "rgba(20, 130, 255, 1)",
                        "rgba(0,255,0,1)",
                        "rgba(255,0,0,1)",
                        "rgba(238,130,238,1)",
                        "rgba(255,255,0,1)"
                    ],
                    barChartOptions: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [
                                {
                                    barPercentage: 1,
                                    gridLines: {
                                        display: true,
                                        color: "rgba(0, 0, 0, 0.1)"
                                    }
                                }
                            ],
                            yAxes: [
                                {
                                    gridLines: {
                                        display: true,
                                        color: "rgba(0, 0, 0, 0.1)"
                                    },
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
        const dataPiePembeli = {
            labels: ["Aktif", "Belum Aktif", "Nonaktif"],
            datasets: [
                {
                    data: [this.state.total_pembeli_aktif, this.state.total_pembeli_inaktif, this.state.total_pembeli_nonaktif],
                    backgroundColor: [
                        "#3ac47d",
                        "#6c757d",
                        "#d92550"
                    ],
                    hoverBackgroundColor: [
                        "#2e9d64",
                        "#383d41",
                        "#ad1e40"
                    ]
                }
            ]
        }
        const dataPieSales = {
            labels: ["Aktif", "Belum Aktif", "Nonaktif"],
            datasets: [
                {
                    data: [this.state.total_sales_aktif, this.state.total_sales_inaktif, this.state.total_sales_nonaktif],
                    backgroundColor: [
                        "#3ac47d",
                        "#6c757d",
                        "#d92550"
                    ],
                    hoverBackgroundColor: [
                        "#2e9d64",
                        "#383d41",
                        "#ad1e40"
                    ]
                }
            ]
        }
        const dataPiePayment = {
            labels: ["Aktif", "Proses Konfirmasi", "Nonaktif", "Konfirmasi Ditolak"],
            datasets: [
                {
                    data: [this.state.total_payment_aktif, this.state.total_payment_onconfirm, this.state.total_payment_nonaktif,
                    this.state.total_payment_onconfirm_ditolak],
                    backgroundColor: [
                        "#3ac47d",
                        "#3f6ad8",
                        "#d92550",
                        "#f7b924"
                    ],
                    hoverBackgroundColor: [
                        "#2e9d64",
                        "#213770",
                        "#ad1e40",
                        "#e0a008"
                    ]
                }
            ]
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-home icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                {/* In here */}
                                {
                                    this.state.openModalNotify ?
                                        this.state.isOpenModalNotify ?
                                            <Modal size="sm" toggle={() => this.setState({ isOpenModalNotify: false })} isOpen={this.state.isOpenModalNotify} backdrop="static" keyboard={false}>
                                                <ModalHeader toggle={() => this.setState({ isOpenModalNotify: false })}>Perhatian</ModalHeader>
                                                <ModalBody>
                                                    <p>Silakan atur kode mapping alamat Pengiriman dan Penagihan pada :</p>
                                                    {
                                                        this.state.openModalNotify.map((data, index) => <li key={index}>{data.nama_perusahaan}</li>)
                                                    }
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="danger" onClick={() => this.setState({ isOpenModalNotify: false })}>Close</Button>
                                                </ModalFooter>
                                            </Modal>
                                            : null
                                        : null
                                }


                                <div>Beranda
                                    <div className="page-title-subheading">
                                        Beranda untuk {this.state.sa_role === 'sales' ? 'sales ' : 'administrator '} {this.state.company_name}
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
                    <div className="row">
                        <div className="col-md-6 col-xl-6">
                            <div className="card mb-3 widget-content">
                                <div className="widget-content-outer">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Pembeli</div>
                                            <div className="widget-subheading">Perusahaan pembeli</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_pembeli}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-6">
                            <div className="card mb-3 widget-content">
                                <div className="widget-content-outer">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Barang</div>
                                            <div className="widget-subheading">Barang terdaftar</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_barang}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6" id="divpembeli" style={{ display: this.state.total_pembeli === '0' ? 'none' : 'block' }}>
                            <div className="main-card mb-3 card">
                                <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Pembeli</h5>
                                <MDBContainer style={{ marginBottom: '5%' }}>
                                    <Doughnut data={dataPiePembeli} options={{ responsive: true }} />
                                </MDBContainer>
                            </div>
                        </div>
                        <div className="col-md-6" id="divbarang" style={{ display: this.state.total_barang === '0' ? 'none' : 'block' }}>
                            <div className="main-card mb-3 card">
                                <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Barang</h5>
                                <MDBContainer style={{ marginBottom: '5%' }}>
                                    <Doughnut data={dataPieBarang} options={{ responsive: true }} />
                                </MDBContainer>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-xl-6">
                            <div className="card mb-3 widget-content">
                                <div className="widget-content-outer">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Negosiasi</div>
                                            <div className="widget-subheading">Negosiasi terdaftar</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_negosiasi}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-6">
                            <div className="card mb-3 widget-content">
                                <div className="widget-content-outer">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Transaksi</div>
                                            <div className="widget-subheading">Transaksi terdaftar</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_transaksi}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6" id="divnego" style={{ display: this.state.total_negosiasi === '0' ? 'none' : 'block' }}>
                            <div className="main-card mb-3 card">
                                <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Negosiasi</h5>
                                <MDBContainer style={{ marginBottom: '5%' }}>
                                    <Pie data={dataPieNego} options={{ responsive: true }} />
                                </MDBContainer>
                            </div>
                        </div>
                        <div className="col-md-6" id="divtransaksi" style={{ display: this.state.total_transaksi === '0' ? 'none' : 'block' }}>
                            <div className="main-card mb-3 card">
                                <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Transaksi</h5>
                                <MDBContainer style={{ marginBottom: '5%' }}>
                                    <Bar data={dataPieTransaksi} options={{
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true
                                                }
                                            }]
                                        }
                                    }}
                                    />
                                </MDBContainer>
                            </div>
                        </div>
                    </div>
                    {
                        (this.state.sa_role === 'admin') ?
                            <div className="row">
                                <div className="col-md-6 col-xl-6">
                                    <div className="card mb-3 widget-content">
                                        <div className="widget-content-outer">
                                            <div className="widget-content-wrapper">
                                                <div className="widget-content-left">
                                                    <div className="widget-heading">Total Sales</div>
                                                    <div className="widget-subheading">Sales terdaftar</div>
                                                </div>
                                                <div className="widget-content-right">
                                                    <div className="widget-numbers text-info">{this.state.total_sales}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-6">
                                    <div className="card mb-3 widget-content">
                                        <div className="widget-content-outer">
                                            <div className="widget-content-wrapper">
                                                <div className="widget-content-left">
                                                    <div className="widget-heading">Total Metode Payment</div>
                                                    <div className="widget-subheading">Metode payment terdaftar</div>
                                                </div>
                                                <div className="widget-content-right">
                                                    <div className="widget-numbers text-info">{this.state.total_payment}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null
                    }
                    {
                        (this.state.sa_role === 'admin') ?
                            <div className="row">
                                <div className="col-md-6" id="divsales" style={{ display: this.state.total_sales === '0' ? 'none' : 'block' }}>
                                    <div className="main-card mb-3 card">
                                        <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Sales</h5>
                                        <MDBContainer style={{ marginBottom: '5%' }}>
                                            <Doughnut
                                                data={dataPieSales}
                                                options={{ responsive: true }} />
                                        </MDBContainer>
                                    </div>
                                </div>
                                <div className="col-md-6" id="divpayment" style={{ display: this.state.total_payment === '0' ? 'none' : 'block' }}>
                                    <div className="main-card mb-3 card">
                                        <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Metode Payment</h5>
                                        <MDBContainer style={{ marginBottom: '5%' }}>
                                            <Doughnut
                                                data={dataPiePayment}
                                                options={{ responsive: true }} />
                                        </MDBContainer>
                                    </div>
                                </div>
                            </div>
                            : null
                    }
                </div>
            </div>
        )
    }
}
const reduxState = (state) => ({
    userData: state.userData
})

const reduxDispatch = (dispatch) => ({
    totalBeranda: (data) => dispatch(totalBeranda(data)),
    totalBerandaChart: (data) => dispatch(totalBerandaChart(data)),
    getNotify: (data) => dispatch(getNotifyData(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentBeranda));