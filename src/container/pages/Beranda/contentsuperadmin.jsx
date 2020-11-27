import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { totalBeranda, totalBerandaChart, getKursAPIManual, updateMasterKurs, logoutUserAPI } from '../../../config/redux/action';
import { MDBContainer } from 'mdbreact';
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import NumberFormat from 'react-number-format';
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import moment from 'moment';
import 'moment/locale/id'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormFeedback, FormGroup } from 'reactstrap'
import Toast from 'light-toast';

class ContentBerandaSuperAdmin extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        total_master_barang: '',
        total_master_barang_aktif: '',
        total_master_barang_inaktif: '',
        total_master_barang_nonaktif: '',
        total_master_kategori: '',
        total_master_blacklist: '',
        total_master_satuan: '',
        total_master_payment: '',
        total_master_reason: '',
        total_barang: '',
        total_barang_onconfirm: '',
        total_barang_rejected: '',
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
        total_penjual: '',
        total_penjual_aktif: '',
        total_penjual_nonaktif: '',
        total_penjual_inaktif: '',
        total_payment: '',
        total_payment_onconfirm: '',
        total_payment_rejected: '',
        isOpenKurs: false,
        id_kurs_now_manual: '',
        kurs_now_manual: '',
        updated_kurs_now_manual: '',
        isBtnUpdate: true,
        isOpenModalKurs: false,
        isOpenConfirmUpdate: false,
        tmp_kurs_now_manual: '',
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
            tipe_bisnis: decrypt(userData.tipe_bisnis)
        })
    }

    async componentDidMount() {
        this.loadCountMasterBarang()
        this.loadCountMasterKategori()
        this.loadCountMasterBlacklist()
        this.loadCountMasterSatuan()
        this.loadCountMasterPayment()
        this.loadCountBarang()
        this.loadCountNegosiasi()
        this.loadCountTransaksi()
        this.loadCountPenjual()
        this.loadCountPayment()
        this.loadCountMasterReason()
        // this.loadKursManual()
    }

    loadCountMasterBarang = async () => {
        let passquerycountmasterbarang = encrypt("select count(gcm_master_barang.id) as total " +
            "from gcm_master_barang")
        const res = await this.props.totalBeranda({ query: passquerycountmasterbarang }).catch(err => err)
        if (res) {
            this.setState({
                total_master_barang: res.total
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
        let passquerycountmasterbarangaktif = encrypt("select count(gcm_master_barang.id) as total " +
            "from gcm_master_barang where gcm_master_barang.status='A'")
        const resmasterbarangaktif = await this.props.totalBeranda({ query: passquerycountmasterbarangaktif }).catch(err => err)
        if (resmasterbarangaktif) {
            this.setState({
                total_master_barang_aktif: resmasterbarangaktif.total
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
        let passquerycountmasterbaranginaktif = encrypt("select count(gcm_master_barang.id) as total " +
            "from gcm_master_barang where gcm_master_barang.status='C'")
        const resmasterbaranginaktif = await this.props.totalBeranda({ query: passquerycountmasterbaranginaktif }).catch(err => err)
        if (resmasterbaranginaktif) {
            this.setState({
                total_master_barang_inaktif: resmasterbaranginaktif.total
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
        let passquerycountmasterbarangnonaktif = encrypt("select count(gcm_master_barang.id) as total " +
            "from gcm_master_barang where gcm_master_barang.status='I'")
        const resmasterbarangnonaktif = await this.props.totalBeranda({ query: passquerycountmasterbarangnonaktif }).catch(err => err)
        if (resmasterbarangnonaktif) {
            this.setState({
                total_master_barang_nonaktif: resmasterbarangnonaktif.total
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

    loadCountMasterKategori = async () => {
        let passquerycountkategori = encrypt("select count(gcm_master_category.id) as total " +
            "from gcm_master_category ")
        const res = await this.props.totalBeranda({ query: passquerycountkategori }).catch(err => err)
        if (res) {
            this.setState({
                total_master_kategori: res.total
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

    loadCountMasterReason = async () => {
        let passquerycountreason = encrypt("select count(gcm_master_reason.id) as total " +
            "from gcm_master_reason ")
        const res = await this.props.totalBeranda({ query: passquerycountreason }).catch(err => err)
        if (res) {
            this.setState({
                total_master_reason: res.total
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

    loadCountMasterBlacklist = async () => {
        let passquerycountblacklist = encrypt("select count(gcm_master_type_blacklist.id) as total " +
            "from gcm_master_type_blacklist ")
        const res = await this.props.totalBeranda({ query: passquerycountblacklist }).catch(err => err)
        if (res) {
            this.setState({
                total_master_blacklist: res.total
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

    loadCountMasterSatuan = async () => {
        let passquerycountsatuan = encrypt("select count(gcm_master_satuan.id) as total " +
            "from gcm_master_satuan ")
        const res = await this.props.totalBeranda({ query: passquerycountsatuan }).catch(err => err)
        if (res) {
            this.setState({
                total_master_satuan: res.total
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

    loadCountMasterPayment = async () => {
        let passquerycountmasterpayment = encrypt("select count(gcm_master_payment.id) as total " +
            "from gcm_master_payment ")
        const res = await this.props.totalBeranda({ query: passquerycountmasterpayment }).catch(err => err)
        if (res) {
            this.setState({
                total_master_payment: res.total
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

    loadCountBarang = async () => {
        let passquerycountbarang = encrypt("select count(gcm_list_barang.id) as total " +
            "from gcm_list_barang where gcm_list_barang.status = 'C' or gcm_list_barang.status = 'R'")
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
        let passquerycountbarangonconfirm = encrypt("select count(gcm_list_barang.id) as total " +
            "from gcm_list_barang where gcm_list_barang.status = 'C'")
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
        let passquerycountbarangrejected = encrypt("select count(gcm_list_barang.id) as total " +
            "from gcm_list_barang where gcm_list_barang.status = 'R'")
        const resrejected = await this.props.totalBeranda({ query: passquerycountbarangrejected }).catch(err => err)
        if (resrejected) {
            this.setState({
                total_barang_rejected: resrejected.total
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

    loadCountNegosiasi = async () => {
        let passquerycountnego = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            passquerycountnego = encrypt("select count(gcm_master_cart.id) as total " +
                "from gcm_master_cart " +
                "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                "where gcm_master_cart.nego_count > 0  and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0)) " +
                "and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' " +
                "and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycountnego = encrypt("select count(gcm_master_cart.id) as total " +
                "from gcm_master_cart " +
                "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                "where gcm_master_cart.nego_count > 0  and ((gcm_master_cart.status = 'A' and gcm_history_nego.harga_final = 0) or (gcm_history_nego.harga_final != 0)) " +
                " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL")
        }
        const res = await this.props.totalBeranda({ query: passquerycountnego }).catch(err => err)
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
            passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total " +
                "from gcm_master_cart " +
                "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 " +
                " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' " +
                "and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycountnegosiasiaktif = encrypt("select count(gcm_master_cart.id) as total " +
                "from gcm_master_cart " +
                "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 " +
                " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL;")
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
            passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total " +
                "from gcm_master_cart " +
                "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 " +
                " and gcm_master_cart.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') + "' " +
                "and gcm_master_cart.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycountnegosiasinonaktif = encrypt("select count(gcm_master_cart.id) as total " +
                "from gcm_master_cart " +
                "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 " +
                " and gcm_master_cart.create_date between '" + this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL;")
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
    }

    loadCountTransaksi = async () => {
        let passquerycounttransaksi = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            passquerycounttransaksi = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycounttransaksi = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.create_date between '" +
                this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL")
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
            passquerycounttransaksimenunggu = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='WAITING' and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycounttransaksimenunggu = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='WAITING' and gcm_master_transaction.create_date between '" +
                this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL")
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
            passquerycounttransaksidiproses = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='ONGOING' and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycounttransaksidiproses = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='ONGOING' and gcm_master_transaction.create_date between '" +
                this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL")
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
            passquerycounttransaksiditerima = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='RECEIVED' and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycounttransaksiditerima = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='RECEIVED' and gcm_master_transaction.create_date between '" +
                this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL")
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
            passquerycounttransaksidikeluhkan = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='COMPLAINED' and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycounttransaksidikeluhkan = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='COMPLAINED' and gcm_master_transaction.create_date between '" +
                this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL")
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
            passquerycounttransaksiselesai = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='FINISHED' and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycounttransaksiselesai = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='FINISHED' and gcm_master_transaction.create_date between '" +
                this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL")
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
            passquerycounttransaksidibatalkan = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='CANCELED' and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycounttransaksidibatalkan = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='CANCELED' and gcm_master_transaction.create_date between '" +
                this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL")
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
            passquerycounttransaksidikirim = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='SHIPPED' and gcm_master_transaction.create_date >= '" + this.state.startDate.format('YYYY-MM-DD') +
                "' and gcm_master_transaction.create_date < '" + datetemp.format('YYYY-MM-DD') + "'")
            this.setState({ endDate: this.state.endDate.subtract(1, 'days') })
        } else {
            passquerycounttransaksidikirim = encrypt("select count(gcm_master_transaction.id) as total " +
                "from gcm_master_transaction " +
                "where gcm_master_transaction.status='SHIPPED' and gcm_master_transaction.create_date between '" +
                this.state.startDate.format('YYYY-MM-DD') + "' and '" + this.state.endDate.format('YYYY-MM-DD') +
                "'::TIMESTAMP + '1 days'::INTERVAL")
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
    }

    loadCountPenjual = async () => {
        let passquerycountpenjual = encrypt("select count(gcm_master_company.id) as total " +
            "from gcm_master_company " +
            "where gcm_master_company.type='S'")
        const res = await this.props.totalBeranda({ query: passquerycountpenjual }).catch(err => err)
        if (res) {
            this.setState({
                total_penjual: res.total
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
        let passquerycountpenjualaktif = encrypt("select count(gcm_master_company.id) as total " +
            "from gcm_master_company " +
            "where gcm_master_company.type='S' and gcm_master_company.seller_status='A'")
        const respenjualaktif = await this.props.totalBeranda({ query: passquerycountpenjualaktif }).catch(err => err)
        if (respenjualaktif) {
            this.setState({
                total_penjual_aktif: respenjualaktif.total
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
        let passquerycountpenjualinaktif = encrypt("select count(gcm_master_company.id) as total " +
            "from gcm_master_company " +
            "where gcm_master_company.type='S' and gcm_master_company.seller_status='I'")
        const respenjualinaktif = await this.props.totalBeranda({ query: passquerycountpenjualinaktif }).catch(err => err)
        if (respenjualinaktif) {
            this.setState({
                total_penjual_inaktif: respenjualinaktif.total
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
        let passquerycountpenjualnonaktif = encrypt("select count(gcm_master_company.id) as total " +
            "from gcm_master_company " +
            "where gcm_master_company.type='S' and gcm_master_company.seller_status='R'")
        const respenjualnonaktif = await this.props.totalBeranda({ query: passquerycountpenjualnonaktif }).catch(err => err)
        if (respenjualnonaktif) {
            this.setState({
                total_penjual_nonaktif: respenjualnonaktif.total
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

    loadCountPayment = async () => {
        let passquerycountpayment = encrypt("select count(gcm_seller_payment_listing.id) as total " +
            "from gcm_seller_payment_listing where gcm_seller_payment_listing.status='C' or gcm_seller_payment_listing.status='R'")
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
        let passquerycountpaymentonconfirm = encrypt("select count(gcm_seller_payment_listing.id) as total " +
            "from gcm_seller_payment_listing where gcm_seller_payment_listing.status='C'")
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
        let passquerycountpaymentrejected = encrypt("select count(gcm_seller_payment_listing.id) as total " +
            "from gcm_seller_payment_listing where gcm_seller_payment_listing.status='R'")
        const resrejected = await this.props.totalBeranda({ query: passquerycountpaymentrejected }).catch(err => err)
        if (resrejected) {
            this.setState({
                total_payment_rejected: resrejected.total
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

    loadKursManual = async () => {
        let passquerykurs = encrypt("select * from gcm_master_kurs limit 1")
        const reskurs = await this.props.getKursAPIManual({ query: passquerykurs }).catch(err => err)
        if (reskurs) {
            this.setState({
                id_kurs_now_manual: decrypt(reskurs.id),
                kurs_now_manual: Number(reskurs.nominal),
                tmp_kurs_now_manual: Number(reskurs.nominal)
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

    handleKurs = () => {
        this.setState({
            isOpenKurs: !this.state.isOpenKurs
        })
    }

    handleModalKurs = () => {
        this.setState({
            isOpenModalKurs: !this.state.isOpenModalKurs,
            updated_kurs_now_manual: this.state.tmp_kurs_now_manual
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        this.check_kurs(event.target.value)
    }

    check_kurs = (x) => {
        if (x === '') {
            document.getElementById('errorharga').style.display = 'block'
            this.setState({ errormessage: 'Kolom ini harus diisi', isBtnUpdate: true })
        } else if (x !== '' && Number(x.split('.').join('').split(',').join('.')) === this.state.tmp_kurs_now_manual) {
            document.getElementById('errorharga').style.display = 'none'
            this.setState({ isBtnUpdate: true })
        } else if (x !== '' && Number(x.split('.').join('').split(',').join('.')) !== this.state.tmp_kurs_now_manual) {
            document.getElementById('errorharga').style.display = 'none'
            this.setState({ isBtnUpdate: false })
        }
    }

    handleModalConfirm = (stat) => {
        this.setState({
            isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate,
        })
    }

    confirmActionUpdateKurs = async () => {
        let passqueryupdatemasterkurs = encrypt("update gcm_master_kurs set nominal='" + this.state.updated_kurs_now_manual.split('.').join('').split(',').join('.') + "' " +
            " where id=" + this.state.id_kurs_now_manual + " returning nominal;")
            Toast.loading('Loading...');
        const resupdateMasterKurs = await this.props.updateMasterKurs({ query: passqueryupdatemasterkurs }).catch(err => err)
        Toast.hide();
        if (resupdateMasterKurs) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.componentDidMount()
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
            labels: ["Proses Konfirmasi", "Konfirmasi Ditolak"],
            datasets: [
                {
                    data: [this.state.total_barang_onconfirm, this.state.total_barang_rejected],
                    backgroundColor: [
                        "#3f6ad8",
                        "#f7b924"
                    ],
                    hoverBackgroundColor: [
                        "#213770",
                        "#e0a008"
                    ]
                }
            ]
        }
        const dataPiePayment = {
            labels: ["Proses Konfirmasi", "Konfirmasi Ditolak"],
            datasets: [
                {
                    data: [this.state.total_payment_onconfirm, this.state.total_payment_rejected],
                    backgroundColor: [
                        "#3f6ad8",
                        "#f7b924"
                    ],
                    hoverBackgroundColor: [
                        "#213770",
                        "#e0a008"
                    ]
                }
            ]
        }
        const dataPieMasterBarang = {
            labels: ["Aktif", "Proses Konfirmasi", "Nonaktif"],
            datasets: [
                {
                    data: [this.state.total_master_barang_aktif, this.state.total_master_barang_inaktif, this.state.total_master_barang_nonaktif],
                    backgroundColor: [
                        "#3ac47d",
                        "#3f6ad8",
                        "#d92550"
                    ],
                    hoverBackgroundColor: [
                        "#2e9d64",
                        "#213770",
                        "#ad1e40"
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
        const dataPiePenjual = {
            labels: ["Aktif", "Belum Aktif", "Nonaktif"],
            datasets: [
                {
                    data: [this.state.total_penjual_aktif, this.state.total_penjual_inaktif, this.state.total_penjual_nonaktif],
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
                                <div>Beranda
                                    <div className="page-title-subheading">Beranda untuk superadmin {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                {/* <ButtonDropdown direction="left" isOpen={this.state.isOpenKurs} toggle={this.handleKurs}>
                                    <DropdownToggle caret color="danger" title="Kurs saat ini">
                                        &nbsp;&nbsp;Kurs : 
                                        <NumberFormat value={Number(this.state.kurs_now_manual)} displayType={'text'} thousandSeparator='.' decimalSeparator=','  prefix={'  IDR '}></NumberFormat>
                                    </DropdownToggle>
                                    <DropdownMenu> */}
                                {/* <DropdownItem disabled>Kurs saat ini :&nbsp;&nbsp;{this.state.kurs_now_manual}</DropdownItem> */}
                                {/* <DropdownItem onClick={this.handleModalKurs}>Perbarui </DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown> */}
                                <DatetimeRangePicker style={{ paddingTop: '3%' }}
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
                                            <div className="widget-heading">Total Penjual</div>
                                            <div className="widget-subheading">Penjual terdaftar</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_penjual}</div>
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
                                            <div className="widget-heading">Total Pengajuan Barang</div>
                                            <div className="widget-subheading">Proses pengajuan barang</div>
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
                        <div className="col-md-6 xl-6" id="divpenjual" style={{ display: this.state.total_penjual === '0' ? 'none' : 'block' }}>
                            <div className="main-card mb-3 card">
                                <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Penjual</h5>
                                <MDBContainer style={{ marginBottom: '5%' }}>
                                    <Doughnut data={dataPiePenjual} options={{ responsive: true }} />
                                </MDBContainer>
                            </div>
                        </div>
                        <div className="col-md-6 xl-6" id="divbarang" style={{ display: this.state.total_barang === '0' ? 'none' : 'block' }}>
                            <div className="main-card mb-3 card">
                                <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Pengajuan Barang</h5>
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
                    <div className="row">
                        <div className="col-md-6 col-xl-6">
                            <div className="card mb-3 widget-content">
                                <div className="widget-content-outer">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Pengajuan Payment</div>
                                            <div className="widget-subheading">Proses pengajuan payment penjual</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_payment}</div>
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
                                            <div className="widget-heading">Total Master Barang</div>
                                            <div className="widget-subheading">Master barang terdaftar</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_master_barang}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 xl-6" id="divbarang" style={{ display: this.state.total_payment === '0' ? 'none' : 'block' }}>
                            <div className="main-card mb-3 card">
                                <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Pengajuan Payment</h5>
                                <MDBContainer style={{ marginBottom: '5%' }}>
                                    <Doughnut data={dataPiePayment} options={{ responsive: true }} />
                                </MDBContainer>
                            </div>
                        </div>
                        <div className="col-md-6 xl-6" id="divmasterbarang" style={{ display: this.state.total_master_barang === '0' ? 'none' : 'block' }}>
                            <div className="main-card mb-3 card">
                                <h5 className="card-title" style={{ marginLeft: '3%', marginTop: '3%' }}>Master Barang</h5>
                                <MDBContainer style={{ marginBottom: '5%' }}>
                                    <Doughnut data={dataPieMasterBarang} options={{ responsive: true }} />
                                </MDBContainer>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-xl-12">
                            <div className="card mb-3 widget-content">
                                <div className="widget-content-outer">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Master Kategori</div>
                                            <div className="widget-subheading">Master kategori terdaftar</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_master_kategori}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-xl-6">
                            <div className="card mb-3 widget-content">
                                <div className="widget-content-outer">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Master Satuan</div>
                                            <div className="widget-subheading">Master satuan terdaftar</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_master_satuan}</div>
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
                                            <div className="widget-heading">Total Master Payment</div>
                                            <div className="widget-subheading">Master payment terdaftar</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_master_payment}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-xl-6">
                            <div className="card mb-3 widget-content">
                                <div className="widget-content-outer">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="widget-heading">Total Master Reason</div>
                                            <div className="widget-subheading">Master reason terdaftar untuk pembatalan transaksi</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_master_reason}</div>
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
                                            <div className="widget-heading">Total Master Nonaktif</div>
                                            <div className="widget-subheading">Master nonaktif terdaftar</div>
                                        </div>
                                        <div className="widget-content-right">
                                            <div className="widget-numbers text-info">{this.state.total_master_blacklist}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Detail Kurs */}
                <Modal size="md" toggle={this.handleModalKurs} isOpen={this.state.isOpenModalKurs} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalKurs}>Detail Kurs</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nilai Kurs Sekarang</p>
                                <NumberFormat thousandSeparator='.' value={this.state.updated_kurs_now_manual} allowNegative={false} decimalSeparator=',' name="updated_kurs_now_manual" id="updated_kurs_now_manual" onChange={this.handleChange} className="form-control"></NumberFormat>
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                <div id="errorharga" style={{ display: 'none' }}>
                                    <p style={{ color: 'red' }}>{this.state.errormessage}</p>
                                </div>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnUpdate}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalKurs}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Update*/}
                <Modal size="sm" toggle={this.handleModalConfirm} isOpen={this.state.isOpenConfirmUpdate} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirm}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionUpdateKurs}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirm}>Batal</Button>
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
    totalBeranda: (data) => dispatch(totalBeranda(data)),
    totalBerandaChart: (data) => dispatch(totalBerandaChart(data)),
    getKursAPIManual: (data) => dispatch(getKursAPIManual(data)),
    updateMasterKurs: (data) => dispatch(updateMasterKurs(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentBerandaSuperAdmin));