import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { decrypt, encrypt } from '../../../config/lib';
import {
    getDataCategoryAPI, getDataSellerAPI, getDataBarangSellerAPI, getDataBarangAPI, getDataDetailedBarangAPI,
    getDataStatusMasterBarangAPI, getDataDetailedBarangSuperAdminOnConfirmAPI, getKursAPI, getKursAPIManual,
    updateBarangStatus, logoutUserAPI
} from '../../../config/redux/action';
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, ButtonDropdown, DropdownItem,
    DropdownMenu, DropdownToggle, Input, Badge
} from 'reactstrap'
import swal from 'sweetalert'
import Pagination from "react-js-pagination"
import NumberFormat from 'react-number-format'
import BarangSuperAdminComponent from '../../../component/molecules/BarangSuperAdminComponent'
import Toast from 'light-toast';

class ContentBarangSuperAdmin extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        searchValue: '',
        searchValueOnConfirm: '',
        isOpenSeller: false,
        isOpenFilter: false,
        statusFilter: false,
        isOpen: false,
        isOpenOnConfirm: false,
        isOpenConfirm: false,
        selectedFilter: 'Semua',
        allCompanySeller: [],
        allDataBarang: [],
        allfilteredDataBarang: [],
        tmpfilteredDataBarang: [],
        allDataBarangOnConfirm: [],
        allfilteredDataBarangOnConfirm: [],
        tmpfilteredDataBarangOnConfirm: [],
        allDataBarangOnConfirmWithoutId: [],
        allfilteredDataBarangOnConfirmWithoutId: [],
        tmpfilteredDataBarangOnConfirmWithoutId: [],
        allCategory: [],
        kurs_now: '',
        kurs_now_manual: '',
        id_company_seller_selected: '0',
        id_company_seller_selected_onconfirm: '0',
        detailed_id_list_barang: '',
        detailed_status: '',
        detailed_status_master: '',
        detailed_barang_id: '',
        detailed_price: '',
        detailed_price_terendah: '',
        detailed_foto: '',
        detailed_deskripsi: '',
        detailed_update_by: '',
        detailed_update_date: '',
        detailed_nama: '',
        detailed_kategori: '',
        detailed_berat: '',
        detailed_volume: '',
        detailed_nama_satuan: '',
        detailed_nama_singkat_satuan: '',
        detailed_minimum_pembelian: '',
        detailed_minimum_nego: '',
        detailed_persen_nego_pertama: '',
        detailed_persen_nego_kedua: '',
        detailed_persen_nego_ketiga: '',
        detailed_kode_barang_distributor: '',
        detailed_nominal_kurs: '',
        detailed_id_list_barang_onconfirm: '',
        detailed_id_list_barang_onconfirm_from_master: '',
        pembanding_status_master_barang: '',
        detailed_status_onconfirm: '',
        detailed_status_onconfirm_from_master: '',
        detailed_barang_id_onconfirm: '',
        detailed_price_onconfirm: '',
        detailed_price_terendah_onconfirm: '',
        detailed_foto_onconfirm: '',
        detailed_deskripsi_onconfirm: '',
        detailed_update_by_onconfirm: '',
        detailed_update_date_onconfirm: '',
        detailed_nama_onconfirm: '',
        detailed_kategori_onconfirm: '',
        detailed_berat_onconfirm: '',
        detailed_volume_onconfirm: '',
        detailed_company_onconfirm: '',
        detailed_nama_satuan_onconfirm: '',
        detailed_nama_singkat_satuan_onconfirm: '',
        detailed_minimum_pembelian_onconfirm: '',
        detailed_minimum_nego_onconfirm: '',
        detailed_persen_nego_pertama_onconfirm: '',
        detailed_persen_nego_kedua_onconfirm: '',
        detailed_persen_nego_ketiga_onconfirm: '',
        detailed_kode_barang_distributor_onconfirm: '',
        detailed_nominal_kurs_onconfirm: '',
        confirmmessage: '',
        status_for_confirm: '',
        activePage: 1,
        slicex: '0',
        slicey: '8',
        flag_from_master_barang: ''
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.setState({
            id_pengguna_login: decrypt(userData.id),
            company_id: decrypt(userData.company_id),
            company_name: decrypt(userData.company_name),
            tipe_bisnis: decrypt(userData.tipe_bisnis)
        })
        this.loadCompanySeller()
        this.loadCategory()
        // this.loadKurs()
        // this.loadKursManual()
    }

    componentDidMount() {
        this.loadDataBarangSellerOnConfirmWithoutId()
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
        let passquerykurs = encrypt("select * from gcm_master_kurs")
        const reskurs = await this.props.getKursAPIManual({ query: passquerykurs }).catch(err => err)
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

    loadCompanySeller = async () => {
        let passqueryseller = encrypt("select gcm_master_company.id, gcm_master_company.nama_perusahaan from gcm_master_company where gcm_master_company.type='S';")
        const resseller = await this.props.getDataSellerAPI({ query: passqueryseller }).catch(err => err)
        if (resseller) {
            this.setState({
                allCompanySeller: resseller,
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

    loadCategory = async () => {
        let passquerycategory = encrypt("select * from gcm_master_category;")
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
                const res = this.props.logoutAPI();
                if (res) {
                    this.props.history.push('/admin')
                    window.location.reload()
                }
            });
        }
    }

    loadDataBarangSeller = async (id) => {
        this.setState({ statusFilter: false, selectedFilter: 'Semua' })
        let passquerybarangseller = encrypt("select	gcm_list_barang.id, gcm_master_barang.status as status_master, gcm_list_barang.status, gcm_list_barang.barang_id, gcm_list_barang.price, " +
            "gcm_list_barang.company_id," +
            "case when gcm_list_barang.flag_foto = 'Y' then  (select concat('assets/images/product', gcm_list_barang.company_id,'/',gcm_list_barang.kode_barang,'.png'))" +
            "else 'assets/images/no_image.png' end as foto, " +
            "gcm_list_barang.update_by, to_char(gcm_list_barang.update_date, 'DD/MM/YYYY') update_date, " +
            "gcm_master_barang.nama, gcm_master_category.nama as kategori, gcm_master_barang.category_id, gcm_master_barang.berat, gcm_master_barang.volume, " +
            "gcm_master_user.nama as nama_update, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias, gcm_listing_kurs.nominal " +
            "from gcm_list_barang " +
            "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
            "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
            "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
            "inner join gcm_listing_kurs on gcm_list_barang.company_id = gcm_listing_kurs.company_id " +
            "left join gcm_master_user on gcm_list_barang.update_by = gcm_master_user.id " +
            "where gcm_list_barang.company_id =" + id + " and gcm_list_barang.status != 'C' and now() between gcm_listing_kurs.tgl_start and gcm_listing_kurs.tgl_end " +
            "order by gcm_list_barang.update_date desc, gcm_master_barang.category_id asc, gcm_master_barang.nama asc")
        const res = await this.props.getDataBarangAPI({ query: passquerybarangseller }).catch(err => err)
        if (res) {
            this.setState({
                allDataBarang: res,
                tmpfilteredDataBarang: res
            })
        }
    }

    loadDataBarangSellerOnConfirm = async (id) => {
        this.setState({ statusFilter: false, selectedFilter: 'Semua' })
        let passquerybarangselleronconfirm = encrypt("select gcm_list_barang.id, gcm_list_barang.status, gcm_list_barang.barang_id, gcm_list_barang.price, " +
            "gcm_list_barang.company_id," +
            "case when gcm_list_barang.flag_foto = 'Y' then  (select concat('assets/images/product', gcm_list_barang.company_id,'/',gcm_list_barang.kode_barang,'.png'))" +
            "else 'assets/images/no_image.png' end as foto, " +
            "gcm_list_barang.update_by, to_char(gcm_list_barang.update_date, 'DD/MM/YYYY') update_date, " +
            "gcm_master_barang.nama, gcm_master_category.nama as kategori, gcm_master_barang.category_id, gcm_master_barang.berat, gcm_master_barang.volume, " +
            "gcm_master_user.nama as nama_update, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias, gcm_listing_kurs.nominal " +
            "from gcm_list_barang " +
            "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
            "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
            "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
            "inner join gcm_listing_kurs on gcm_list_barang.company_id = gcm_listing_kurs.company_id " +
            "left join gcm_master_user on gcm_list_barang.update_by = gcm_master_user.id " +
            "where gcm_list_barang.company_id =" + id + " and (gcm_list_barang.status = 'C' or gcm_list_barang.status = 'R') " +
            "and now() between gcm_listing_kurs.tgl_start and gcm_listing_kurs.tgl_end " +
            "order by gcm_list_barang.update_date desc, gcm_master_barang.category_id asc, gcm_master_barang.nama asc")
        const resonconfirm = await this.props.getDataBarangSellerAPI({ query: passquerybarangselleronconfirm }).catch(err => err)
        if (resonconfirm) {
            this.setState({
                allDataBarangOnConfirm: resonconfirm,
                tmpfilteredDataBarangOnConfirm: resonconfirm
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
        // and gcm_master_barang.status='A' 
    }

    loadDataBarangSellerOnConfirmWithoutId = async () => {
        this.setState({ statusFilter: false, selectedFilter: 'Semua' })
        let passquerybarangselleronconfirmwithoutid = encrypt("select gcm_list_barang.id, gcm_list_barang.status, gcm_list_barang.barang_id, gcm_list_barang.price, " +
            "gcm_list_barang.company_id, " +
            "case when gcm_list_barang.flag_foto = 'Y' then  (select concat('assets/images/product', gcm_list_barang.company_id,'/',gcm_list_barang.kode_barang,'.png'))" +
            "else 'assets/images/no_image.png' end as foto, " +
            " gcm_list_barang.update_by, to_char(gcm_list_barang.update_date, 'DD/MM/YYYY') update_date, " +
            "gcm_master_barang.nama, gcm_master_category.nama as kategori, gcm_master_barang.category_id, gcm_master_barang.berat, gcm_master_barang.volume, " +
            "gcm_master_user.nama as nama_update, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias, gcm_listing_kurs.nominal " +
            "from gcm_list_barang " +
            "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
            "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
            "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
            "inner join gcm_listing_kurs on gcm_list_barang.company_id = gcm_listing_kurs.company_id " +
            "left join gcm_master_user on gcm_list_barang.update_by = gcm_master_user.id " +
            "where (gcm_list_barang.status = 'C' or gcm_list_barang.status = 'R') and now() between gcm_listing_kurs.tgl_start and gcm_listing_kurs.tgl_end " +
            "order by gcm_list_barang.update_date desc, gcm_master_barang.category_id asc, gcm_master_barang.nama asc")
        const resonconfirmwithoutid = await this.props.getDataBarangSellerAPI({ query: passquerybarangselleronconfirmwithoutid }).catch(err => err)
        if (resonconfirmwithoutid) {
            this.setState({
                allDataBarangOnConfirmWithoutId: resonconfirmwithoutid,
                tmpfilteredDataBarangOnConfirmWithoutId: resonconfirmwithoutid
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
        // and gcm_master_barang.status='A' 
    }

    filterSeller = (event) => {
        this.setState({
            id_company_seller_selected: event.target.value,
        })
        this.loadDataBarangSeller(event.target.value)
    }

    filterSellerOnConfirm = (event) => {
        this.setState({
            id_company_seller_selected_onconfirm: event.target.value,
        })
        if (event.target.value === '0') {
            this.loadDataBarangSellerOnConfirmWithoutId()
        }
        else {
            this.loadDataBarangSellerOnConfirm(event.target.value)
        }
    }

    searchChange = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    }

    searchChangeOnConfirm = (e) => {
        this.setState({
            searchValueOnConfirm: e.target.value
        })
    }

    filterBarang = (e, kategori) => {
        if (e === 'S') {
            this.setState({
                statusFilter: false,
                selectedFilter: 'Semua'
            })
        } else {
            this.setState({
                statusFilter: true,
                allfilteredDataBarang: this.state.tmpfilteredDataBarang.filter(tmpfilteredDataBarang => tmpfilteredDataBarang.filterby === e),
                allfilteredDataBarangOnConfirm: this.state.tmpfilteredDataBarangOnConfirm.filter(tmpfilteredDataBarangOnConfirm => tmpfilteredDataBarangOnConfirm.filterby === e),
                allfilteredDataBarangOnConfirmWithoutId: this.state.tmpfilteredDataBarangOnConfirmWithoutId.filter(tmpfilteredDataBarangOnConfirmWithoutId => tmpfilteredDataBarangOnConfirmWithoutId.filterby === e),
                selectedFilter: kategori
            })
        }
    }

    handleCompanySeller = () => {
        this.setState({
            isOpenSeller: !this.state.isOpenSeller
        })
    }

    handleFilter = () => {
        this.setState({
            isOpenFilter: !this.state.isOpenFilter
        })
    }

    handleDetailBarang = async (id) => {
        this.handleModalDetail()
        let passquerydetail = encrypt("select gcm_list_barang.id, gcm_list_barang.status, gcm_list_barang.barang_id, gcm_list_barang.price, gcm_list_barang.price_terendah," +
            "gcm_list_barang.company_id, " +
            "case when gcm_list_barang.flag_foto = 'Y' then  (select concat('assets/images/product', gcm_list_barang.company_id,'/',gcm_list_barang.kode_barang,'.png'))" +
            "else 'assets/images/no_image.png' end as foto, " +
            " gcm_list_barang.deskripsi, gcm_list_barang.update_by, to_char(gcm_list_barang.update_date, 'DD/MM/YYYY') update_date, " +
            "gcm_master_barang.nama, gcm_master_category.nama as kategori, gcm_master_barang.category_id, gcm_master_barang.berat, " +
            "gcm_master_barang.volume, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias, gcm_list_barang.jumlah_min_beli, gcm_list_barang.jumlah_min_nego, gcm_master_barang.status as status_master, " +
            "gcm_list_barang.persen_nego_1, gcm_list_barang.persen_nego_2, gcm_list_barang.persen_nego_3, gcm_list_barang.kode_barang, gcm_listing_kurs.nominal " +
            "from gcm_list_barang " +
            "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
            "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
            "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
            "inner join gcm_listing_kurs on gcm_list_barang.company_id = gcm_listing_kurs.company_id " +
            " where gcm_list_barang.id=" + id + " and now() between gcm_listing_kurs.tgl_start and gcm_listing_kurs.tgl_end")
        const resdetail = await this.props.getDataDetailedBarangAPI({ query: passquerydetail }).catch(err => err)
        if (resdetail) {
            this.setState({
                detailed_id_list_barang: decrypt(resdetail.id),
                detailed_status: resdetail.status,
                detailed_status_master: resdetail.status_master,
                detailed_barang_id: decrypt(resdetail.barang_id),
                detailed_price: resdetail.price,
                detailed_price_terendah: resdetail.price_terendah,
                detailed_foto: resdetail.foto,
                detailed_deskripsi: resdetail.deskripsi,
                detailed_update_by: resdetail.update_by,
                detailed_update_date: resdetail.update_date,
                detailed_nama: resdetail.nama,
                detailed_kategori: resdetail.kategori,
                detailed_berat: resdetail.berat,
                detailed_volume: resdetail.volume,
                detailed_nama_satuan: resdetail.nama_alias,
                detailed_nama_singkat_satuan: resdetail.alias,
                detailed_minimum_pembelian: resdetail.minimum_pembelian,
                detailed_minimum_nego: resdetail.minimum_nego,
                detailed_persen_nego_pertama: resdetail.persen_nego_1,
                detailed_persen_nego_kedua: resdetail.persen_nego_2,
                detailed_persen_nego_ketiga: resdetail.persen_nego_3,
                detailed_kode_barang_distributor: resdetail.kode_barang,
                detailed_nominal_kurs: resdetail.nominal
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

    handleDetailBarangOnConfirm = async (id) => {
        this.handleModalDetailOnConfirm()
        let passquerydetailonconfirm = encrypt("select gcm_list_barang.id, gcm_list_barang.status, gcm_list_barang.barang_id, gcm_list_barang.price, gcm_list_barang.price_terendah, " +
            "gcm_list_barang.company_id, gcm_master_company.nama_perusahaan, " +
            "case when gcm_list_barang.flag_foto = 'Y' then  (select concat('assets/images/product', gcm_list_barang.company_id,'/',gcm_list_barang.kode_barang,'.png'))" +
            "else 'assets/images/no_image.png' end as foto, " +
            " gcm_list_barang.deskripsi, gcm_list_barang.update_by, to_char(gcm_list_barang.update_date, 'DD/MM/YYYY') update_date, " +
            "gcm_master_barang.nama, gcm_master_category.nama as kategori, gcm_master_barang.category_id, gcm_master_barang.berat, " +
            "gcm_master_barang.volume, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias, gcm_list_barang.jumlah_min_beli, gcm_list_barang.jumlah_min_nego, " +
            "gcm_master_barang.id as id_from_master, gcm_master_barang.status as status_master, gcm_listing_kurs.nominal, " +
            "gcm_list_barang.persen_nego_1, gcm_list_barang.persen_nego_2, gcm_list_barang.persen_nego_3, gcm_list_barang.kode_barang " +
            "from gcm_list_barang " +
            "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
            "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
            "inner join gcm_master_company on gcm_list_barang.company_id = gcm_master_company.id " +
            "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
            "inner join gcm_listing_kurs on gcm_list_barang.company_id = gcm_listing_kurs.company_id " +
            " where gcm_list_barang.id=" + id + " and now() between gcm_listing_kurs.tgl_start and gcm_listing_kurs.tgl_end")
        const resdetailonconfirm = await this.props.getDataDetailedBarangSuperAdminOnConfirmAPI({ query: passquerydetailonconfirm }).catch(err => err)
        if (resdetailonconfirm) {
            this.setState({
                detailed_id_list_barang_onconfirm_from_master: decrypt(resdetailonconfirm.id_from_master),
                detailed_id_list_barang_onconfirm: decrypt(resdetailonconfirm.id),
                detailed_status_onconfirm: resdetailonconfirm.status,
                detailed_barang_id_onconfirm: decrypt(resdetailonconfirm.barang_id),
                detailed_price_onconfirm: resdetailonconfirm.price,
                detailed_price_terendah_onconfirm: resdetailonconfirm.price_terendah,
                detailed_foto_onconfirm: resdetailonconfirm.foto,
                detailed_deskripsi_onconfirm: resdetailonconfirm.deskripsi,
                detailed_update_by_onconfirm: resdetailonconfirm.update_by,
                detailed_update_date_onconfirm: resdetailonconfirm.update_date,
                detailed_nama_onconfirm: resdetailonconfirm.nama,
                detailed_kategori_onconfirm: resdetailonconfirm.kategori,
                detailed_berat_onconfirm: resdetailonconfirm.berat,
                detailed_volume_onconfirm: resdetailonconfirm.volume,
                detailed_company_onconfirm: resdetailonconfirm.nama_perusahaan,
                detailed_nama_satuan_onconfirm: resdetailonconfirm.nama_alias,
                detailed_nama_singkat_satuan_onconfirm: resdetailonconfirm.alias,
                detailed_minimum_pembelian_onconfirm: resdetailonconfirm.minimum_pembelian,
                detailed_minimum_nego_onconfirm: resdetailonconfirm.minimum_nego,
                detailed_status_onconfirm_from_master: resdetailonconfirm.status_master,
                detailed_persen_nego_pertama_onconfirm: resdetailonconfirm.persen_nego_1,
                detailed_persen_nego_kedua_onconfirm: resdetailonconfirm.persen_nego_2,
                detailed_persen_nego_ketiga_onconfirm: resdetailonconfirm.persen_nego_3,
                detailed_kode_barang_distributor_onconfirm: resdetailonconfirm.kode_barang,
                detailed_nominal_kurs_onconfirm: resdetailonconfirm.nominal
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

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    handleModalDetailOnConfirm = () => {
        this.setState({
            isOpenOnConfirm: !this.state.isOpenOnConfirm
        })
    }

    handleModalConfirm = async (stat) => {
        // await this.checkStatusMasterBarang()
        if (this.state.detailed_status_onconfirm_from_master === 'A') {
            await this.setState({
                isOpenConfirm: !this.state.isOpenConfirm,
                flag_from_master_barang: 'A'
            })
            if (stat === 'A') {
                this.setState({
                    confirmmessage: 'Konfirmasi pengajuan barang ini?',
                    status_for_confirm: stat
                })
            } else {
                this.setState({
                    confirmmessage: 'Tolak pengajuan barang ini?',
                    status_for_confirm: stat
                })
            }
        } else if (this.state.detailed_status_onconfirm_from_master === 'C') {
            await this.setState({
                isOpenConfirm: !this.state.isOpenConfirm,
                flag_from_master_barang: 'C'
            })
            if (stat === 'A') {
                this.setState({
                    confirmmessage: 'Sistem mendeteksi barang ini belum diaktifkan pada master barang. Konfirmasi pengajuan barang ini akan mengaktifkan ' +
                        'status barang pada master barang secara otomatis. Tetap lanjutkan konfirmasi pengajuan barang ini?',
                    status_for_confirm: stat
                })
            } else {
                this.setState({
                    confirmmessage: 'Sistem mendeteksi barang ini belum diaktifkan pada master barang. Harap periksa status barang pada menu manajemen master barang. ' +
                        'Lanjutkan aksi untuk menolak pengajuan barang ini?',
                    status_for_confirm: stat
                })
            }
        } else {
            await this.setState({
                isOpenConfirm: !this.state.isOpenConfirm,
                flag_from_master_barang: 'I'
            })
            if (stat === 'A') {
                this.setState({
                    confirmmessage: 'Sistem mendeteksi barang ini dinonaktifkan pada master barang. Harap aktifkan status barang pada menu manajemen master barang. ' +
                        'Tetap lanjutkan konfirmasi pengajuan barang ini?',
                    status_for_confirm: stat
                })
            } else {
                this.setState({
                    confirmmessage: 'Sistem mendeteksi barang ini dinonaktifkan pada master barang. Harap aktifkan status barang pada menu manajemen master barang. ' +
                        'Lanjutkan aksi untuk menolak pengajuan barang ini?',
                    status_for_confirm: stat
                })
            }
        }
    }

    // checkStatusMasterBarang = async() => {
    //     let passcheckstatusmaster = encrypt("select gcm_master_barang.status as status_master from gcm_master_barang where id="+this.state.detailed_id_list_barang_onconfirm_from_master)
    //     const rescheckstatusmaster = await this.props.getDataStatusMasterBarangAPI({query:passcheckstatusmaster}).catch(err => err)
    //     if(rescheckstatusmaster) {
    //         this.setState({pembanding_status_master_barang:rescheckstatusmaster.status_master})
    //     } else {
    //         swal({
    //             title: "Kesalahan 503!",
    //             text: "Harap periksa koneksi internet!",
    //             icon: "error",
    //             buttons: {
    //                 confirm: "Oke"
    //                 }
    //             }).then(()=> {
    //                 const res = this.props.logoutAPI();
    //                 if (res) {
    //                     this.props.history.push('/admin')
    //                     window.location.reload()
    //                 }
    //             });
    //     }
    // }

    confirmActionForPengajuan = async () => {
        Toast.loading('Loading...');
        let passquerypertama = ""
        let passquerykedua = ""
        if (this.state.flag_from_master_barang === 'C') {
            if (this.state.status_for_confirm === 'R') {
                passquerykedua = "update gcm_list_barang set status='" + this.state.status_for_confirm + "', update_by='" +
                    this.state.id_pengguna_login + "', update_date=now() where id=" + this.state.detailed_id_list_barang_onconfirm + " returning update_date;"
            } else {
                passquerypertama = "with new_order as (update gcm_master_barang set status='A', update_by='" + this.state.id_pengguna_login +
                    "', update_date=now() where id=" + this.state.detailed_id_list_barang_onconfirm_from_master + ") "
                passquerykedua = "update gcm_list_barang set status='" + this.state.status_for_confirm + "', update_by='" +
                    this.state.id_pengguna_login + "', update_date=now() where id=" + this.state.detailed_id_list_barang_onconfirm + " returning update_date;"
            }
        } else {
            passquerykedua = "update gcm_list_barang set status='" + this.state.status_for_confirm + "', update_by='" +
                this.state.id_pengguna_login + "', update_date=now() where id=" + this.state.detailed_id_list_barang_onconfirm + " returning update_date;"
        }
        let passqueryupdatepengajuan = encrypt(passquerypertama.concat(passquerykedua))
        const resupdatepengajuan = await this.props.updateBarangStatus({ query: passqueryupdatepengajuan }).catch(err => err)
        Toast.hide();
        if (resupdatepengajuan) {
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
    }

    handlePageChange = (pageNumber) => {
        this.setState({ activePage: pageNumber })
        this.controlDataPagination(pageNumber)
    }

    controlDataPagination = (pgnm) => {
        this.setState({ slicex: (pgnm * 8) - 8, slicey: pgnm * 8 })
    }

    render() {
        const statusFilter = this.state.statusFilter
        const showAllDataBarang =
            this.state.allDataBarang.filter((value) => {
                return value.nama.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1
            })
        const showFilteredDataBarang =
            this.state.allfilteredDataBarang.filter((value) => {
                return value.nama.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) !== -1
            })
        const showAllDataBarangOnConfirm =
            this.state.allDataBarangOnConfirm.filter((value) => {
                return value.nama.toLowerCase().indexOf(this.state.searchValueOnConfirm.toLowerCase()) !== -1
            })
        const showFilteredDataBarangOnConfirm =
            this.state.allfilteredDataBarangOnConfirm.filter((value) => {
                return value.nama.toLowerCase().indexOf(this.state.searchValueOnConfirm.toLowerCase()) !== -1
            })
        const showAllDataBarangOnConfirmWithoutId =
            this.state.allDataBarangOnConfirmWithoutId.filter((value) => {
                return value.nama.toLowerCase().indexOf(this.state.searchValueOnConfirm.toLowerCase()) !== -1
            })
        const showFilteredDataBarangOnConfirmWithoutId =
            this.state.allfilteredDataBarangOnConfirmWithoutId.filter((value) => {
                return value.nama.toLowerCase().indexOf(this.state.searchValueOnConfirm.toLowerCase()) !== -1
            })
        const showAllDataBarangPagination = showAllDataBarang.slice(this.state.slicex, this.state.slicey)
        const showFilteredDataBarangPagination = showFilteredDataBarang.slice(this.state.slicex, this.state.slicey)
        const showAllDataBarangOnConfirmPagination = showAllDataBarangOnConfirm.slice(this.state.slicex, this.state.slicey)
        const showFilteredDataBarangOnConfirmPagination = showFilteredDataBarangOnConfirm.slice(this.state.slicex, this.state.slicey)
        const showAllDataBarangOnConfirmWithoutIdPagination = showAllDataBarangOnConfirmWithoutId.slice(this.state.slicex, this.state.slicey)
        const showFilteredDataBarangOnConfirmWithoutIdPagination = showFilteredDataBarangOnConfirmWithoutId.slice(this.state.slicex, this.state.slicey)
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-server icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Barang
                                    <div className="page-title-subheading">Daftar barang yang dijual oleh setiap perusahaan pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                <ButtonDropdown direction="left" isOpen={this.state.isOpenFilter} toggle={this.handleFilter}>
                                    <DropdownToggle caret color="primary" title="Filter berdasarkan kategori barang">
                                        <i className="fa fa-fw" aria-hidden="true"></i>
                                        &nbsp;&nbsp;{this.state.selectedFilter}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => this.filterBarang('S')}>Semua</DropdownItem>
                                        {
                                            this.state.allCategory.map(allCategory => {
                                                return <DropdownItem onClick={() => this.filterBarang(allCategory.id, allCategory.nama)}>{allCategory.nama}</DropdownItem>
                                            })
                                        }
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <div className="card-header card-header-tab-animation">
                                    <ul className="nav nav-justified">
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-0-barang" className="active nav-link">Terdaftar</a></li>
                                        <li className="nav-item"><a data-toggle="tab" href="#tab-eg115-1-barang" className="nav-link">Proses Pengajuan</a></li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="tab-eg115-0-barang" role="tabpanel" >
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="inputGroupPrepend">
                                                        <i className="pe-7s-search"> </i>
                                                    </span>
                                                </div>
                                                <Input type="text" className="form-control" id="searchValue" style={{ marginRight: "1%" }}
                                                    placeholder="Cari Barang" aria-describedby="inputGroupPrepend" onChange={this.searchChange}></Input>
                                                <div className="input-group-prepend" style={{ marginLeft: "1%" }}>
                                                    <span className="input-group-text" id="inputGroupPrepend">
                                                        <i className="pe-7s-portfolio"> </i>
                                                    </span>
                                                </div>
                                                <select name="select" id="exampleSelect" className="form-control" onChange={this.filterSeller}>
                                                    <option value="0" disabled selected="true">Pilih perusahaan</option>
                                                    {
                                                        this.state.allCompanySeller.map(allCompanySeller => {
                                                            return <option value={allCompanySeller.id}>
                                                                {allCompanySeller.nama_perusahaan}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="row" style={{ marginTop: "3%" }}>
                                                {
                                                    (statusFilter === true && showFilteredDataBarangPagination.length !== 0) ?
                                                        showFilteredDataBarangPagination.map(showFilteredDataBarangPagination => {
                                                            return <BarangSuperAdminComponent key={showFilteredDataBarangPagination.id}
                                                                data={showFilteredDataBarangPagination}
                                                                // kurs_now={this.state.kurs_now}
                                                                // kurs_now={this.state.kurs_now_manual}
                                                                detail={this.handleDetailBarang} />
                                                        }) : (statusFilter === false && showAllDataBarangPagination.length !== 0) ?
                                                            showAllDataBarangPagination.map(showAllDataBarangPagination => {
                                                                return <BarangSuperAdminComponent key={showAllDataBarangPagination.id}
                                                                    data={showAllDataBarangPagination}
                                                                    // kurs_now={this.state.kurs_now}
                                                                    // kurs_now={this.state.kurs_now_manual}
                                                                    detail={this.handleDetailBarang} />
                                                            }) : (statusFilter === true) ?
                                                                showFilteredDataBarang.map(showFilteredDataBarang => {
                                                                    return <BarangSuperAdminComponent key={showFilteredDataBarang.id}
                                                                        data={showFilteredDataBarang}
                                                                        // kurs_now={this.state.kurs_now}
                                                                        // kurs_now={this.state.kurs_now_manual}
                                                                        detail={this.handleDetailBarang}
                                                                    />
                                                                }) : (statusFilter === false) ?
                                                                    showAllDataBarang.map(showAllDataBarang => {
                                                                        return <BarangSuperAdminComponent key={showAllDataBarang.id}
                                                                            data={showAllDataBarang}
                                                                            // kurs_now={this.state.kurs_now}
                                                                            // kurs_now={this.state.kurs_now_manual}
                                                                            detail={this.handleDetailBarang}
                                                                        />
                                                                    }) : (this.state.id_company_seller_selected === '0') ? false :
                                                                        (showAllDataBarangPagination.length === 0 || showFilteredDataBarangPagination.length === 0) ? false :
                                                                            false
                                                }
                                            </div>
                                            <div style={{ width: '100%' }}>
                                                <div style={{ margin: '0 auto', display: 'table' }}>
                                                    {
                                                        ((showFilteredDataBarang.length !== 0 || showAllDataBarang.length !== 0) && this.state.id_company_seller_selected !== '0') ?
                                                            <Pagination
                                                                prevPageText='Previous'
                                                                nextPageText='Next'
                                                                activePage={this.state.activePage}
                                                                itemsCountPerPage={8}
                                                                totalItemsCount={(statusFilter) ? showFilteredDataBarang.length : showAllDataBarang.length}
                                                                pageRangeDisplayed={5}
                                                                onChange={this.handlePageChange}
                                                            />
                                                            : ((showFilteredDataBarang.length === 0 || showAllDataBarang.length === 0) && this.state.id_company_seller_selected !== '0') ?
                                                                <p> Data tidak ditemukan </p>
                                                                : (this.state.id_company_seller_selected === '0') ?
                                                                    null
                                                                    : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane" id="tab-eg115-1-barang" role="tabpanel">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="inputGroupPrepend">
                                                        <i className="pe-7s-search"> </i>
                                                    </span>
                                                </div>
                                                <Input type="text" className="form-control" id="searchValue" style={{ marginRight: "1%" }}
                                                    placeholder="Cari Barang" aria-describedby="inputGroupPrepend" onChange={this.searchChangeOnConfirm}></Input>
                                                <div className="input-group-prepend" style={{ marginLeft: "1%" }}>
                                                    <span className="input-group-text" id="inputGroupPrepend">
                                                        <i className="pe-7s-portfolio"> </i>
                                                    </span>
                                                </div>
                                                <select name="select" id="exampleSelect" className="form-control" onChange={this.filterSellerOnConfirm}>
                                                    <option disabled selected hidden>Pilih perusahaan</option>
                                                    <option value="0">Semua</option>
                                                    {
                                                        this.state.allCompanySeller.map(allCompanySeller => {
                                                            return <option value={allCompanySeller.id}>
                                                                {allCompanySeller.nama_perusahaan}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className="row" style={{ marginTop: "3%" }}>
                                                {
                                                    (statusFilter === false && this.state.id_company_seller_selected_onconfirm === '0' && showAllDataBarangOnConfirmWithoutIdPagination.length !== 0) ?
                                                        showAllDataBarangOnConfirmWithoutIdPagination.map(showAllDataBarangOnConfirmWithoutIdPagination => {
                                                            return <BarangSuperAdminComponent key={showAllDataBarangOnConfirmWithoutIdPagination.id}
                                                                data={showAllDataBarangOnConfirmWithoutIdPagination}
                                                                // kurs_now={this.state.kurs_now}
                                                                kurs_now={this.state.kurs_now_manual}
                                                                detail={this.handleDetailBarangOnConfirm} />
                                                        }) :
                                                        (statusFilter === true && this.state.id_company_seller_selected_onconfirm === '0' && showFilteredDataBarangOnConfirmWithoutIdPagination.length !== 0) ?
                                                            showFilteredDataBarangOnConfirmWithoutIdPagination.map(showFilteredDataBarangOnConfirmWithoutIdPagination => {
                                                                return <BarangSuperAdminComponent key={showFilteredDataBarangOnConfirmWithoutIdPagination.id}
                                                                    data={showFilteredDataBarangOnConfirmWithoutIdPagination}
                                                                    // kurs_now={this.state.kurs_now}
                                                                    kurs_now={this.state.kurs_now_manual}
                                                                    detail={this.handleDetailBarangOnConfirm} />
                                                            }) :
                                                            (statusFilter === false && this.state.id_company_seller_selected_onconfirm === '0') ?
                                                                showAllDataBarangOnConfirmWithoutId.map(showAllDataBarangOnConfirmWithoutId => {
                                                                    return <BarangSuperAdminComponent key={showAllDataBarangOnConfirmWithoutId.id}
                                                                        data={showAllDataBarangOnConfirmWithoutId}
                                                                        // kurs_now={this.state.kurs_now}
                                                                        kurs_now={this.state.kurs_now_manual}
                                                                        detail={this.handleDetailBarangOnConfirm} />
                                                                }) :
                                                                (statusFilter === true && this.state.id_company_seller_selected_onconfirm === '0') ?
                                                                    showFilteredDataBarangOnConfirmWithoutIdPagination.map(showFilteredDataBarangOnConfirmWithoutId => {
                                                                        return <BarangSuperAdminComponent key={showFilteredDataBarangOnConfirmWithoutId.id}
                                                                            data={showFilteredDataBarangOnConfirmWithoutId}
                                                                            // kurs_now={this.state.kurs_now}
                                                                            kurs_now={this.state.kurs_now_manual}
                                                                            detail={this.handleDetailBarangOnConfirm} />
                                                                    }) :
                                                                    (statusFilter === true && this.state.id_company_seller_selected_onconfirm !== '0' && showFilteredDataBarangOnConfirmPagination.length !== 0) ?
                                                                        showFilteredDataBarangOnConfirmPagination.map(showFilteredDataBarangOnConfirmPagination => {
                                                                            return <BarangSuperAdminComponent key={showFilteredDataBarangOnConfirmPagination.id}
                                                                                data={showFilteredDataBarangOnConfirmPagination}
                                                                                // kurs_now={this.state.kurs_now}
                                                                                kurs_now={this.state.kurs_now_manual}
                                                                                detail={this.handleDetailBarangOnConfirm} />
                                                                        }) : (statusFilter === false && this.state.id_company_seller_selected_onconfirm !== '0' && showAllDataBarangOnConfirmPagination.length !== 0) ?
                                                                            showAllDataBarangOnConfirmPagination.map(showAllDataBarangOnConfirmPagination => {
                                                                                return <BarangSuperAdminComponent key={showAllDataBarangOnConfirmPagination.id}
                                                                                    data={showAllDataBarangOnConfirmPagination}
                                                                                    // kurs_now={this.state.kurs_now}
                                                                                    kurs_now={this.state.kurs_now_manual}
                                                                                    detail={this.handleDetailBarangOnConfirm} />
                                                                            }) : (statusFilter === true && this.state.id_company_seller_selected_onconfirm !== '0') ?
                                                                                showFilteredDataBarangOnConfirm.map(showFilteredDataBarangOnConfirm => {
                                                                                    return <BarangSuperAdminComponent key={showFilteredDataBarangOnConfirm.id}
                                                                                        data={showFilteredDataBarangOnConfirm}
                                                                                        // kurs_now={this.state.kurs_now}
                                                                                        kurs_now={this.state.kurs_now_manual}
                                                                                        detail={this.handleDetailBarangOnConfirm} />
                                                                                }) : (statusFilter === false && this.state.id_company_seller_selected_onconfirm !== '0') ?
                                                                                    showAllDataBarangOnConfirm.map(showAllDataBarangOnConfirm => {
                                                                                        return <BarangSuperAdminComponent key={showAllDataBarangOnConfirm.id}
                                                                                            data={showAllDataBarangOnConfirm}
                                                                                            // kurs_now={this.state.kurs_now}
                                                                                            kurs_now={this.state.kurs_now_manual}
                                                                                            detail={this.handleDetailBarangOnConfirm} />
                                                                                    }) :
                                                                                    (statusFilter === false && this.state.id_company_seller_selected_onconfirm === '0' && showAllDataBarangOnConfirmWithoutIdPagination.length === 0) ||
                                                                                        (statusFilter === true && this.state.id_company_seller_selected_onconfirm === '0' && showFilteredDataBarangOnConfirmWithoutIdPagination.length === 0)
                                                                                        ? false : null
                                                }
                                            </div>
                                            <div style={{ width: '100%' }}>
                                                <div style={{ margin: '0 auto', display: 'table' }}>
                                                    {
                                                        (showAllDataBarangOnConfirmWithoutId.length === 0 && this.state.id_company_seller_selected_onconfirm !== '0' && showAllDataBarangOnConfirm.length !== 0 && showFilteredDataBarangOnConfirm.length !== 0) ?
                                                            <p> Data tidak ditemukan </p> :
                                                            (showFilteredDataBarangOnConfirmWithoutId.length === 0 && this.state.id_company_seller_selected_onconfirm !== '0' && showAllDataBarangOnConfirm.length !== 0 && showFilteredDataBarangOnConfirm.length !== 0) ?
                                                                <p> Data tidak ditemukan </p> :
                                                                (showFilteredDataBarangOnConfirm.length === 0 && this.state.id_company_seller_selected_onconfirm !== '0' && showAllDataBarangOnConfirmWithoutId.length === 0 && showFilteredDataBarangOnConfirmWithoutId.length === 0) ?
                                                                    <p> Data tidak ditemukan </p> :
                                                                    (showAllDataBarangOnConfirm.length === 0 && this.state.id_company_seller_selected_onconfirm !== '0' && showAllDataBarangOnConfirmWithoutId.length === 0 && showFilteredDataBarangOnConfirmWithoutId.length === 0) ?
                                                                        <p> Data tidak ditemukan </p> :
                                                                        (showAllDataBarangOnConfirmWithoutId.length !== 0 && this.state.id_company_seller_selected_onconfirm === '0') ?
                                                                            <Pagination
                                                                                prevPageText='Previous'
                                                                                nextPageText='Next'
                                                                                activePage={this.state.activePage}
                                                                                itemsCountPerPage={8}
                                                                                totalItemsCount={showAllDataBarangOnConfirmWithoutId.length}
                                                                                pageRangeDisplayed={5}
                                                                                onChange={this.handlePageChange}
                                                                            />
                                                                            : (showFilteredDataBarangOnConfirmWithoutId.length !== 0 && this.state.id_company_seller_selected_onconfirm === '0') ?
                                                                                <Pagination
                                                                                    prevPageText='Previous'
                                                                                    nextPageText='Next'
                                                                                    activePage={this.state.activePage}
                                                                                    itemsCountPerPage={8}
                                                                                    totalItemsCount={showFilteredDataBarangOnConfirmWithoutId.length}
                                                                                    pageRangeDisplayed={5}
                                                                                    onChange={this.handlePageChange}
                                                                                />
                                                                                : (showFilteredDataBarangOnConfirm.length !== 0 && this.state.id_company_seller_selected_onconfirm !== '0') ?
                                                                                    <Pagination
                                                                                        prevPageText='Previous'
                                                                                        nextPageText='Next'
                                                                                        activePage={this.state.activePage}
                                                                                        itemsCountPerPage={8}
                                                                                        totalItemsCount={showFilteredDataBarangOnConfirm.length}
                                                                                        pageRangeDisplayed={5}
                                                                                        onChange={this.handlePageChange}
                                                                                    />
                                                                                    : (showAllDataBarangOnConfirm.length !== 0 && this.state.id_company_seller_selected_onconfirm !== '0') ?
                                                                                        <Pagination
                                                                                            prevPageText='Previous'
                                                                                            nextPageText='Next'
                                                                                            activePage={this.state.activePage}
                                                                                            itemsCountPerPage={8}
                                                                                            totalItemsCount={showAllDataBarangOnConfirm.length}
                                                                                            pageRangeDisplayed={5}
                                                                                            onChange={this.handlePageChange}
                                                                                        />
                                                                                        : <p> Data tidak ditemukan </p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal PopUp */}
                <Modal size="lg" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Detail Barang</ModalHeader>
                    <ModalBody>
                        <div className="card-body">
                            <div style={{ marginTop: '3%' }}>
                                <div style={{ width: '50%', float: 'left', paddingRight: '3%' }}>
                                    <img src={this.state.detailed_foto} alt="" style={{ width: "50%" }} />
                                    <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '5%' }}> Kode Barang Distributor</p>
                                    <p className="mb-0">{((this.state.detailed_kode_barang_distributor === null) || (this.state.detailed_kode_barang_distributor === '')) ? 'Tidak ada kode barang' : this.state.detailed_kode_barang_distributor} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kurs Berlaku</p>
                                    <NumberFormat value={Number(this.state.detailed_nominal_kurs)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'  IDR '}></NumberFormat>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Deskripsi Barang</p>
                                    <p className="mb-0">{((this.state.detailed_deskripsi === null) || (this.state.detailed_deskripsi === '')) ? 'Tidak ada deskripsi' : this.state.detailed_deskripsi} </p>
                                </div>
                                <div style={{ width: '50%', float: 'right' }}>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Barang</p>
                                    <p className="mb-0">{this.state.detailed_nama} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kategori Barang</p>
                                    <p className="mb-0">{this.state.detailed_kategori} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Berat / Volume Barang</p>
                                    <p className="mb-0">{this.state.detailed_berat} / {this.state.detailed_volume}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.detailed_nama_singkat_satuan === '') ? 'Jumlah Minimum Pembelian' : 'Jumlah Minimum Pembelian (@' + this.state.detailed_nama_singkat_satuan + ') '}</p>
                                    <p className="mb-0">{Number(this.state.detailed_minimum_pembelian)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.detailed_nama_singkat_satuan === '') ? 'Jumlah Minimum Nego' : 'Jumlah Minimum Nego (@' + this.state.detailed_nama_singkat_satuan + ') '}</p>
                                    <p className="mb-0">{Number(this.state.detailed_minimum_nego)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nominal Persen Nego 1 ( % )</p>
                                    <p className="mb-0">{Number(this.state.detailed_persen_nego_pertama)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nominal Persen Nego 2 ( % )</p>
                                    <p className="mb-0">{Number(this.state.detailed_persen_nego_kedua)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nominal Persen Nego 3 ( % )</p>
                                    <p className="mb-0">{Number(this.state.detailed_persen_nego_ketiga)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Harga Terendah Barang</p>
                                    <Badge color="warning" style={{ fontWeight: "bold" }}>
                                        <NumberFormat value={this.state.detailed_price_terendah}
                                            displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                    </Badge>
                                    {/* <NumberFormat value={(this.state.detailed_price * this.state.kurs_now).toFixed(0)}
                                            displayType={'text'} thousandSeparator={true} prefix={'   IDR '}></NumberFormat> */}
                                    {/* <NumberFormat value={Math.ceil(this.state.detailed_price_terendah * this.state.kurs_now_manual)}
                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan} */}
                                    <NumberFormat value={Math.ceil(this.state.detailed_price_terendah * this.state.detailed_nominal_kurs)}
                                        displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi Barang
                                    </p>
                                    <Badge color="warning" style={{ fontWeight: "bold" }}>
                                        <NumberFormat value={this.state.detailed_price}
                                            displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                    </Badge>
                                    {/* <NumberFormat value={(this.state.detailed_price * this.state.kurs_now).toFixed(0)}
                                            displayType={'text'} thousandSeparator={true} prefix={'   IDR '}></NumberFormat> */}
                                    {/* <NumberFormat value={Math.ceil(this.state.detailed_price * this.state.kurs_now_manual)}
                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat>  / {this.state.detailed_nama_singkat_satuan} */}
                                    <NumberFormat value={Math.ceil(this.state.detailed_price * this.state.detailed_nominal_kurs)}
                                        displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat>  / {this.state.detailed_nama_singkat_satuan}
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Barang</p>
                                    <p className="mb-0">{this.state.detailed_status === 'A' ? 'Tersedia' : 'Tidak Tersedia'} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Status di Master Barang</p>
                                    <p className="mb-0">{this.state.detailed_status_master === 'A' ? 'Aktif'
                                        : this.state.detailed_status_master === 'I' ? 'Nonaktif'
                                            : 'Proses Pengajuan'} </p>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal PopUp OnConfirm*/}
                <Modal size="lg" toggle={this.handleModalDetailOnConfirm} isOpen={this.state.isOpenOnConfirm} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailOnConfirm}>Detail Barang</ModalHeader>
                    <ModalBody>
                        <div className="card-body">
                            <div style={{ marginTop: '3%' }}>
                                <div style={{ width: '50%', float: 'left', paddingRight: '3%' }}>
                                    <img src={this.state.detailed_foto_onconfirm} alt="" style={{ width: "50%" }} />
                                    <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '5%' }}>Diajukan Oleh</p>
                                    <p className="mb-0">{this.state.detailed_company_onconfirm}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Barang Distributor</p>
                                    <p className="mb-0">{((this.state.detailed_kode_barang_distributor_onconfirm === null) || (this.state.detailed_kode_barang_distributor_onconfirm === '')) ? 'Tidak ada kode barang' : this.state.detailed_kode_barang_distributor_onconfirm} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kurs Berlaku</p>
                                    <NumberFormat value={Number(this.state.detailed_nominal_kurs_onconfirm)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'  IDR '}></NumberFormat>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Deskripsi Barang</p>
                                    <p className="mb-0">{((this.state.detailed_deskripsi_onconfirm === null) || (this.state.detailed_deskripsi_onconfirm === '')) ? 'Tidak ada deskripsi' : this.state.detailed_deskripsi_onconfirm} </p>
                                </div>
                                <div style={{ width: '50%', float: 'right' }}>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Barang</p>
                                    <p className="mb-0">{this.state.detailed_nama_onconfirm} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kategori Barang</p>
                                    <p className="mb-0">{this.state.detailed_kategori_onconfirm} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Berat / Volume Barang</p>
                                    <p className="mb-0">{this.state.detailed_berat_onconfirm} / {this.state.detailed_volume_onconfirm}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.detailed_nama_singkat_satuan_onconfirm === '') ? 'Jumlah Minimum Pembelian' : 'Jumlah Minimum Pembelian (@' + this.state.detailed_nama_singkat_satuan_onconfirm + ') '}</p>
                                    <p className="mb-0">{Number(this.state.detailed_minimum_pembelian_onconfirm)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.detailed_nama_singkat_satuan_onconfirm === '') ? 'Jumlah Minimum Nego' : 'Jumlah Minimum Nego (@' + this.state.detailed_nama_singkat_satuan_onconfirm + ') '}</p>
                                    <p className="mb-0">{Number(this.state.detailed_minimum_nego_onconfirm)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nominal Persen Nego 1 ( % )</p>
                                    <p className="mb-0">{Number(this.state.detailed_persen_nego_pertama_onconfirm)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nominal Persen Nego 2 ( % )</p>
                                    <p className="mb-0">{Number(this.state.detailed_persen_nego_kedua_onconfirm)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Nominal Persen Nego 3 ( % )</p>
                                    <p className="mb-0">{Number(this.state.detailed_persen_nego_ketiga_onconfirm)}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Harga Terendah Barang</p>
                                    <Badge color="warning" style={{ fontWeight: "bold" }}>
                                        <NumberFormat value={this.state.detailed_price_terendah_onconfirm}
                                            displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                    </Badge>
                                    {/* <NumberFormat value={(this.state.detailed_price_onconfirm * this.state.kurs_now).toFixed(0)}
                                            displayType={'text'} thousandSeparator={true} prefix={'   IDR '}></NumberFormat> */}
                                    {/* <NumberFormat value={Math.ceil(this.state.detailed_price_terendah_onconfirm * this.state.kurs_now_manual)}
                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan_onconfirm} */}
                                    <NumberFormat value={Math.ceil(this.state.detailed_price_terendah_onconfirm * this.state.detailed_nominal_kurs_onconfirm)}
                                        displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan_onconfirm}
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        Harga Tertinggi Barang
                                    </p>
                                    <Badge color="warning" style={{ fontWeight: "bold" }}>
                                        <NumberFormat value={this.state.detailed_price_onconfirm}
                                            displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                    </Badge>
                                    {/* <NumberFormat value={Math.ceil(this.state.detailed_price_onconfirm * this.state.kurs_now_manual)}
                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat>  / {this.state.detailed_nama_singkat_satuan_onconfirm} */}
                                    <NumberFormat value={Math.ceil(this.state.detailed_price_onconfirm * this.state.detailed_nominal_kurs_onconfirm)}
                                        displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat>  / {this.state.detailed_nama_singkat_satuan_onconfirm}
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Barang</p>
                                    <p className="mb-0">{this.state.detailed_status_onconfirm === 'C' ? 'Proses Konfirmasi' : 'Ditolak'} </p>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    {
                        (this.state.detailed_status_onconfirm === 'C') ?
                            <ModalFooter>
                                <Button color="primary" onClick={() => this.handleModalConfirm('A')}>Konfirmasi</Button>
                                <Button color="danger" onClick={() => this.handleModalConfirm('R')}>Tolak</Button>
                            </ModalFooter>
                            : false
                    }
                </Modal>

                {/* Modal Confirm Update*/}
                <Modal size="sm" toggle={this.handleModalConfirm} isOpen={this.state.isOpenConfirm} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirm}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>{this.state.confirmmessage}</label>
                        </div>
                    </ModalBody>
                    {
                        (this.state.status_for_confirm === 'A') ?
                            <ModalFooter>
                                <Button color="primary" onClick={this.confirmActionForPengajuan}>Konfirmasi</Button>
                                <Button color="secondary" onClick={this.handleModalConfirm}>Batal</Button>
                            </ModalFooter>
                            :
                            <ModalFooter>
                                <Button color="danger" onClick={this.confirmActionForPengajuan}>Tolak</Button>
                                <Button color="secondary" onClick={this.handleModalConfirm}>Batal</Button>
                            </ModalFooter>
                    }
                </Modal>
            </div>
        )
    }
}
const reduxState = (state) => ({
    userData: state.userData
})

const reduxDispatch = (dispatch) => ({
    getKursAPIManual: (data) => dispatch(getKursAPIManual(data)),
    getDataCategoryAPI: (data) => dispatch(getDataCategoryAPI(data)),
    getDataSellerAPI: (data) => dispatch(getDataSellerAPI(data)),
    getDataBarangSellerAPI: (data) => dispatch(getDataBarangSellerAPI(data)),
    getDataBarangAPI: (data) => dispatch(getDataBarangAPI(data)),
    getDataStatusMasterBarangAPI: (data) => dispatch(getDataStatusMasterBarangAPI(data)),
    getDataDetailedBarangAPI: (data) => dispatch(getDataDetailedBarangAPI(data)),
    getDataDetailedBarangSuperAdminOnConfirmAPI: (data) => dispatch(getDataDetailedBarangSuperAdminOnConfirmAPI(data)),
    updateBarangStatus: (data) => dispatch(updateBarangStatus(data)),
    getKursAPI: () => dispatch(getKursAPI()),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentBarangSuperAdmin));