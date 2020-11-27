import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { getDataNegotiationAPI, getDataDetailedNegotiationBuyerSuperAdminAPI, getDataAlamatAPI, getDataDetailedNegotiationSellerSuperAdminAPI,
    getDataDetailedBarangNegotiationSuperAdminAPI, getKursAPI, getKursAPIManual, logoutUserAPI } from '../../../config/redux/action';
import { MDBDataTable } from 'mdbreact';
// import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
// import DateRangePicker from 'react-daterange-picker'
// import 'react-daterange-picker/dist/css/react-calendar.css'
import DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import moment from 'moment';
import 'moment/locale/id'
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import { withRouter } from 'react-router-dom';

// kurs durung digarap (kan emang gak perlu wkwk)
class ContentNegosiasiSuperAdmin extends Component {
    state = {
        id_pengguna_login:'',
        company_id:'',
        company_name:'',
        tipe_bisnis:'',
        allDataNegotiationActive:[],
        allDataNegotiationInActive:[],
        tmpfilteredDataNegotiationActive:[],
        tmpfilteredDataNegotiationInActive:[],
        allAlamatSeller:[],
        isOpen: false,
        history_nego_id: '',
        cart_id: '',
        nama_user_buyer: '',
        username_buyer: '',
        email_buyer: '',
        no_hp_buyer: '',
        company_buyer_name: '',
        company_buyer_tipe_bisnis: '',
        company_buyer_email: '',
        company_buyer_no_telp: '',
        company_seller_name: '',
        company_id_seller:'',
        company_seller_tipe_bisnis: '',
        company_seller_email: '',
        company_seller_no_telp: '',
        company_seller_kode_seller:'',
        nama_barang_nego: '',
        nama_kategori_barang_nego: '',
        berat_barang_nego: '',
        volume_barang_nego: '',
        clear_price_barang_nego: '',
        price_barang_nego: '',
        price_barang_nego_rupiah: '',
        kurs_now: '',
        kurs_now_manual:'',
        foto_barang_nego: '',
        deskripsi_barang_nego: '',
        create_date:'',
        cart_jatah_nego:'',
        isOpenToggleDate: false,
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
            tipe_bisnis: decrypt(userData.tipe_bisnis)
        })
        // this.loadKurs()
        // this.loadKursManual()
    }

    componentDidMount() {
        this.loadDataNegotiationActive("0")
        this.loadDataNegotiationInActive("0")
    }

    loadKurs = async() => {
        const reskurs = await this.props.getKursAPI().catch(err => err)
        if (reskurs) {
            this.setState({
                kurs_now: reskurs
            })
        }
    }

    loadKursManual = async() => {
        let passquerykurs = encrypt("select * from gcm_master_kurs")
        const reskurs = await this.props.getKursAPIManual({query:passquerykurs}).catch(err => err)
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
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    loadDataNegotiationActive = async (flag) => {
        let passquery = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
                "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY  HH24:MI:SS') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
                    "from gcm_master_cart "+
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 "+
                    "and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+
                    "' order by gcm_master_cart.update_date desc;")
            this.setState({endDate: this.state.endDate.subtract(1, 'days')})
        } else {
            passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
                "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
                    "from gcm_master_cart "+
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
                    "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 "+
                    "and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
                    "'::TIMESTAMP + '1 days'::INTERVAL order by gcm_master_cart.update_date desc;")
        }
        
        const res = await this.props.getDataNegotiationAPI({query:passquery}).catch(err => err)
        if(res){
            res.map((user, index) => {
                return (
                    res[index].keterangan = 
                        <center>
                            <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                                onClick={(e) => this.handleDetailNegotiation(e, res[index].history_nego_id)}>Lihat Detail</button>
                        </center>,
                    res[index].create_date =
                        <p className="mb-0" style={{textAlign:'center'}}>{user.create_date}</p>
                )
            })
            this.setState({
                allDataNegotiationActive:res,
                tmpfilteredDataNegotiationActive: res
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

    loadDataNegotiationInActive = async (flag) => {
        let passquery = ""
        if (this.state.startDate.format('YYYY-MM-DD') === this.state.endDate.format('YYYY-MM-DD')) {
            let datetemp = this.state.endDate.add(1, "days")
            passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
                "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
                    "from gcm_master_cart "+
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 "+
                    " and gcm_master_cart.create_date >= '"+this.state.startDate.format('YYYY-MM-DD')+"' and gcm_master_cart.create_date < '"+datetemp.format('YYYY-MM-DD')+
                    "' order by gcm_master_cart.update_date desc;")
            this.setState({endDate: this.state.endDate.subtract(1, 'days')})
        } else {
            passquery = encrypt("select gcm_master_cart.id, gcm_master_company.nama_perusahaan, gcm_master_cart.nego_count, "+
                "to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date, gcm_master_barang.nama, gcm_master_cart.history_nego_id "+
                    "from gcm_master_cart "+
                    "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
                    "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
                    "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
                    "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
                    "where gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final != 0 "+
                    "and gcm_master_cart.create_date between '"+this.state.startDate.format('YYYY-MM-DD')+"' and '"+this.state.endDate.format('YYYY-MM-DD')+
                    "'::TIMESTAMP + '1 days'::INTERVAL order by gcm_master_cart.update_date desc;")
        }
        const res = await this.props.getDataNegotiationAPI({query:passquery}).catch(err => err)
        if(res){
            res.map((user, index) => {
                return (
                    res[index].keterangan = 
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailNegotiation(e, res[index].history_nego_id)}>Lihat Detail</button>
                    </center>,
                    res[index].create_date =
                        <p className="mb-0" style={{textAlign:'center'}}>{user.create_date}</p>
                )
            })
            this.setState({
                allDataNegotiationInActive:res,
                tmpfilteredDataNegotiationInActive: res
            })
            if (flag === '1') {
                swal({
                    title: "Sukses!",
                    text: "Data negosiasi berhasil diperbarui!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(()=> {

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
                }).then(()=> {
                    // const res = this.props.logoutAPI();
                    // if (res) {
                    //     this.props.history.push('/admin')
                    //     window.location.reload()
                    // }
                });
        }
    }

    handleDetailNegotiation = async(e, id_history_nego, id_master_cart) => {
        this.handleModalDetail()
        e.stopPropagation();
        this.setState({
            history_nego_id: id_history_nego,
            cart_id: id_master_cart
        })
        let passquerydetailnegotiation = encrypt("select gcm_master_user.nama, gcm_master_user.username, gcm_master_user.email, "+
            "gcm_master_user.no_hp, gcm_master_company.nama_perusahaan, gcm_master_category.nama as tipe_bisnis_buyer, "+
            "gcm_master_company.email as company_email, gcm_master_company.no_telp, gcm_master_cart.nego_count "+
                "from gcm_history_nego "+
            "inner join gcm_master_cart on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id "+
            "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id "+
            "inner join gcm_master_user on gcm_master_cart.create_by = gcm_master_user.id "+
                "where gcm_history_nego.id = "+id_history_nego)
        const resdetail = await this.props.getDataDetailedNegotiationBuyerSuperAdminAPI({query:passquerydetailnegotiation}).catch(err => err)
        if (resdetail) {
            this.setState({
                cart_jatah_nego: resdetail.jatah_nego,
                nama_user_buyer: resdetail.nama_user_buyer,
                username_buyer: resdetail.username_buyer,
                email_buyer: resdetail.email_buyer,
                no_hp_buyer: resdetail.no_hp_buyer,
                company_buyer_name: resdetail.company_buyer_name,
                company_buyer_tipe_bisnis: resdetail.company_buyer_tipe_bisnis,
                company_buyer_email: resdetail.company_buyer_email,
                company_buyer_no_telp: resdetail.company_buyer_no_telp
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
        this.loadSellerNego(id_history_nego)
    }

    loadSellerNego = async(id) => {
        let passquerydetailsellernego = encrypt("select gcm_master_company.nama_perusahaan, gcm_master_category.nama as tipe_bisnis_seller, "+
            "gcm_master_company.email as company_email, gcm_master_company.no_telp, gcm_master_company.id, gcm_master_company.kode_seller "+
                "from gcm_history_nego "+
            "inner join gcm_master_cart on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id "+
            "inner join gcm_master_company on gcm_list_barang.company_id = gcm_master_company.id "+
            "inner join gcm_master_category on gcm_master_company.tipe_bisnis = gcm_master_category.id "+
                "where gcm_history_nego.id = "+id)
        const resdetailseller = await this.props.getDataDetailedNegotiationSellerSuperAdminAPI({query:passquerydetailsellernego}).catch(err => err)
        this.loadAlamatSeller(resdetailseller.company_id_seller)
        if (resdetailseller) {
            this.setState({
                company_seller_name: resdetailseller.company_seller_name,
                company_id_seller: resdetailseller.company_id_seller,
                company_seller_tipe_bisnis: resdetailseller.company_seller_tipe_bisnis,
                company_seller_email: resdetailseller.company_seller_email,
                company_seller_no_telp: resdetailseller.company_seller_no_telp,
                company_seller_kode_seller:resdetailseller.company_seller_kode_seller
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
        this.loadBarangNego(id)
    }

    loadBarangNego = async(id) => {
        let passquerybarangnego = encrypt("select gcm_master_barang.nama, gcm_master_category.nama as nama_kategori, gcm_master_barang.berat, "+
            "gcm_master_barang.volume, gcm_list_barang.price, gcm_list_barang.foto, gcm_list_barang.deskripsi, to_char(gcm_master_cart.create_date, 'DD/MM/YYYY HH24:MI:SS') create_date "+
                "from gcm_list_barang "+
            "inner join gcm_master_cart on gcm_list_barang.id = gcm_master_cart.barang_id "+
            "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id "+
            "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id "+
            "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id "+
                "where gcm_history_nego.id ="+id)
        const resdetailbarangnego = await this.props.getDataDetailedBarangNegotiationSuperAdminAPI({query:passquerybarangnego}).catch(err => err)
        if (resdetailbarangnego) {
            this.setState({
                create_date: resdetailbarangnego.create_date,
                nama_barang_nego: resdetailbarangnego.nama_barang_nego,
                nama_kategori_barang_nego: resdetailbarangnego.nama_kategori_barang_nego,
                berat_barang_nego: resdetailbarangnego.berat_barang_nego,
                volume_barang_nego: resdetailbarangnego.volume_barang_nego,
                clear_price_barang_nego: resdetailbarangnego.clear_price_barang_nego,
                price_barang_nego: resdetailbarangnego.price_barang_nego,
                // price_barang_nego_rupiah: resdetailbarangnego.clear_price_barang_nego*this.state.kurs_now.toFixed(0),
                // price_barang_nego_rupiah: Math.ceil(resdetailbarangnego.clear_price_barang_nego*this.state.kurs_now_manual),
                foto_barang_nego: resdetailbarangnego.foto_barang_nego,
                deskripsi_barang_nego: resdetailbarangnego.deskripsi_barang_nego
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

    loadAlamatSeller = async(id) => {
        let passqueryalamatseller =  encrypt("select gcm_master_alamat.alamat, gcm_master_kelurahan.nama as kelurahan, "+
                "gcm_master_kecamatan.nama as kecamatan, gcm_master_city.nama as kota, gcm_master_provinsi.nama as provinsi, "+
                "gcm_master_alamat.kodepos, gcm_master_alamat.no_telp, gcm_master_alamat.shipto_active, gcm_master_alamat.billto_active "+
            "from gcm_master_alamat "+
                "inner join gcm_master_kelurahan on gcm_master_alamat.kelurahan = gcm_master_kelurahan.id "+
                "inner join gcm_master_kecamatan on gcm_master_alamat.kecamatan = gcm_master_kecamatan.id "+
                "inner join gcm_master_city on gcm_master_alamat.kota = gcm_master_city.id "+
                "inner join gcm_master_provinsi on gcm_master_alamat.provinsi = gcm_master_provinsi.id "+
            "where gcm_master_alamat.company_id="+id)
        const resalamatseller = await this.props.getDataAlamatAPI({query:passqueryalamatseller}).catch(err => err)
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
                }).then(()=> {
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

    handleToggleDate = () => {
        this.setState({isOpenToggleDate: !this.state.isOpenToggleDate})
    }

    handleEvent = (event, picker) => {
        this.setState({
          startDate: picker.startDate,
          endDate: picker.endDate,
        });
        this.loadDataNegotiationActive("0")
        this.loadDataNegotiationInActive("0")
    }

    handleRefreshNegotiation = async() => {
        await this.setState({isBtnRefreshNegotiation: true})
        // await this.loadKursManual()
        await this.loadDataNegotiationActive("1")
        await this.loadDataNegotiationInActive("1")
        await this.setState({isBtnRefreshNegotiation: false})
    }

    render(){
        let start = this.state.startDate.format('DD MMMM YYYY');
        let end = this.state.endDate.format('DD MMMM YYYY');
        let label = start + ' - ' + end;
        if (start === end) { label = start;}
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
                    width: 80
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
                                        <Button className="selected-date-range-btn" color="primary" style={{width:'100%'}}>
                                            <div className="pull-left">
                                                <i className="fa fa-calendar"/>
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
                    <div style={{textAlign: "right"}}>
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
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-0-nego-super" className="active nav-link">Aktif</a></li>
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-1-nego-super" className="nav-link">Selesai</a></li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="tab-eg115-0-nego-super" role="tabpanel" >
                                            <MDBDataTable
                                                bordered
                                                striped
                                                responsive
                                                hover
                                                data={dataNegoActive}
                                            />
                                        </div>
                                        <div className="tab-pane" id="tab-eg115-1-nego-super" role="tabpanel">
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
                        <ModalHeader toggle={this.handleModalDetail}>
                            Detail Negosiasi
                        </ModalHeader>
                        <ModalBody>
                            <div className="card-header card-header-tab-animation">
                                <ul className="nav nav-justified">
                                    <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-0-nego" className="active nav-link">Informasi Pembeli</a></li>
                                    <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-1-nego" className="nav-link">Informasi Penjual</a></li>
                                    <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-2-nego" className="nav-link">Informasi Negosiasi</a></li>
                                </ul>
                            </div>
                            <div className="card-body">
                                <div className="tab-content">
                                    <div className="tab-pane active" id="tab-eg115-0-nego" role="tabpanel">
                                        <div style={{marginTop:'3%'}}>
                                            <div className="row">
                                                <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Nama Lengkap Pembeli</p>
                                                    <p className="mb-0"> {this.state.nama_user_buyer}</p>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Nama Pengguna Pembeli  </p>
                                                    <p className="mb-0"> {this.state.username_buyer}</p>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Email Pembeli</p>
                                                    <p className="mb-0"> {this.state.email_buyer}</p>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Telepon Pembeli</p>
                                                    <p className="mb-0"> {this.state.no_hp_buyer}</p>
                                                </div>
                                                <div style={{width:'50%', float:'right', paddingLeft:'3%'}}>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Nama Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_buyer_name}</p>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Tipe Bisnis Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_buyer_tipe_bisnis}</p>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Email Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_buyer_email}</p>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Telepon Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_buyer_no_telp}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="tab-eg115-1-nego" role="tabpanel">
                                        <div style={{marginTop:'3%'}}>
                                            <div className="row">
                                                <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Nama Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_seller_name} - {this.state.company_seller_kode_seller}</p>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Tipe Bisnis Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_seller_tipe_bisnis}</p>
                                                </div>
                                                <div style={{width:'50%', float:'right', paddingLeft:'3%'}}>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Email Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_seller_email}</p>
                                                    <p className="mb-0" style={{fontWeight:'bold'}}> Telepon Perusahaan</p>
                                                    <p className="mb-0"> {this.state.company_seller_no_telp}</p>
                                                </div>
                                            </div>
                                            <div style={{marginTop:'3%'}} className="row">
                                                <div style={{width:'100%', paddingLeft:'3%'}}>
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
                                    <div className="tab-pane" id="tab-eg115-2-nego" role="tabpanel">
                                        <div style={{marginTop:'3%'}}>
                                            <div style={{width:'50%', float:'left', paddingRight:'3%'}}>
                                                <img src={this.state.foto_barang_nego} alt="" style={{width:"50%"}}/>
                                            </div>
                                            <div style={{width:'50%', float:'right'}}>
                                                <p className="mb-0" style={{fontWeight:'bold'}}> Tanggal Negosiasi</p>
                                                <p className="mb-0">{this.state.create_date} </p>
                                                <p className="mb-0" style={{fontWeight:'bold'}}> Jatah Negosiasi</p>
                                                    {(this.state.cart_jatah_nego === 1) ? <div><span className="badge badge-pill badge-success" style={{marginLeft:'1%'}}>✓</span><span className="badge badge-pill badge-danger" style={{marginLeft:'1%'}}>х</span><span className="badge badge-pill badge-danger" style={{marginLeft:'1%'}}>х</span></div> :
                                                    (this.state.cart_jatah_nego === 2) ? <div><span className="badge badge-pill badge-success" style={{marginLeft:'1%'}}>✓</span><span className="badge badge-pill badge-success" style={{marginLeft:'1%'}}>✓</span><span className="badge badge-pill badge-danger" style={{marginLeft:'1%'}}>х</span></div> :
                                                    (this.state.cart_jatah_nego === 3) ? <div><span className="badge badge-pill badge-success" style={{marginLeft:'1%'}}>✓</span><span className="badge badge-pill badge-success" style={{marginLeft:'1%'}}>✓</span><span className="badge badge-pill badge-success" style={{marginLeft:'1%'}}>✓</span></div>:
                                                     <div><span className="badge badge-pill badge-danger" style={{marginLeft:'1%'}}>х</span><span className="badge badge-pill badge-danger" style={{marginLeft:'1%'}}>х</span><span className="badge badge-pill badge-danger" style={{marginLeft:'1%'}}>х</span></div>}
                                                <p className="mb-0" style={{fontWeight:'bold'}}> Nama Barang</p>
                                                <p className="mb-0">{this.state.nama_barang_nego} </p>
                                                <p className="mb-0" style={{fontWeight:'bold'}}> Kategori Barang</p>
                                                <p className="mb-0">{this.state.nama_kategori_barang_nego} </p>
                                                <p className="mb-0" style={{fontWeight:'bold'}}> Berat / Volume Barang</p>
                                                <p className="mb-0">{this.state.berat_barang_nego} / {this.state.volume_barang_nego}</p>
                                                {/* <p className="mb-0" style={{fontWeight:'bold'}}> Harga Barang</p>
                                                <p className="mb-0"><Badge color="warning"> {this.state.price_barang_nego} </Badge>
                                                    <NumberFormat value={Math.ceil(this.state.price_barang_nego_rupiah)}
                                                        displayType={'text'} thousandSeparator={true} prefix={'   IDR '}></NumberFormat>
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
    getDataNegotiationAPI: (data) => dispatch(getDataNegotiationAPI(data)),
    getDataAlamatAPI: (data) => dispatch(getDataAlamatAPI(data)),
    getDataDetailedNegotiationBuyerSuperAdminAPI: (data) => dispatch(getDataDetailedNegotiationBuyerSuperAdminAPI(data)),
    getDataDetailedNegotiationSellerSuperAdminAPI: (data) => dispatch(getDataDetailedNegotiationSellerSuperAdminAPI(data)),
    getDataDetailedBarangNegotiationSuperAdminAPI: (data) => dispatch(getDataDetailedBarangNegotiationSuperAdminAPI(data)),
    getKursAPI: () => dispatch(getKursAPI()),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter( connect(reduxState, reduxDispatch)(ContentNegosiasiSuperAdmin) );