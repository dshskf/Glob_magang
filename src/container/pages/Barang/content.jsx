import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Select from 'react-select';
import { decrypt, encrypt } from '../../../config/lib';
import swal from 'sweetalert';
import {
    getDataBarangAPI, getDataDetailedBarangAPI, getKursAPI, getKursAPIManual, getKursActiveAPIManual, getDataCheckedBarang, getDataCategoryAPI, getDataSatuanAPI, insertMasterBarangFromSeller,
    getDivisi, uploadGambarBarang, updateBarangStatus, getDataBarangCanInsert, getDataCheckedNego, getDataCheckedKodeBarang,
    getPPNBarang, insertListBarang, logoutUserAPI
} from '../../../config/redux/action';
import BarangComponent from '../../../component/molecules/BarangComponent';
import NumberFormat from 'react-number-format';
import Pagination from "react-js-pagination";
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, ButtonDropdown, DropdownItem,
    DropdownMenu, DropdownToggle, Input, Badge, FormFeedback, FormGroup, Label
} from 'reactstrap';
import { MDBDataTable } from 'mdbreact'
import ButtonCustom from '../../../component/atom/Button';
import Resizer from './react-file-image-resizer';

class ContentBarang extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        nama_tipe_bisnis: '',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        nama_divisi: '',
        allDataBarang: [],
        tmpfilteredDataBarang: [],
        allfilteredDataBarang: [],
        allCategory: [],
        allCategoryKhusus: [],
        allSatuan: [],
        allRegisteredBarang: [],
        allCheckedRegisteredBarang: [],
        riwayatHargaBarang: null,
        allCheckedNego: 0,
        allCheckedKodeBarang: 0,
        kurs_now: '',
        kurs_now_manual: '',
        isOpen: false,
        isOpenFilter: false,
        isOpenStatus: false,
        isOpenConfirm: false,
        isOpenInsert: false,
        isOpenConfirmInsert: false,
        isOpenConfirmInsertKedua: false,
        isOpenBarang: false,
        isOpenCurrencyInsertBarang: false,
        isOpenCurrencyInsertBarangTerendah: false,
        isOpenCurrencyUpdateBarang: false,
        isOpenCurrencyUpdateBarangTerendah: false,
        isOpenCurrencyInsertMasterBarang: false,
        isOpenCurrencyInsertMasterBarangTerendah: false,
        isOpenModalInsertMasterBarang: false,
        isOpenConfirmInsertMaster: false,
        isOpenKategori: false,
        isOpenAttentionNego: false,
        isOpenAttentionKodeBarang: false,
        isOpenSatuan: false,
        isOpenPictureInserted: false,
        statusFilter: false,
        statusBarangFilter: false,
        insertGambarBarang: false,
        editGambarBarang: false,
        selectedFilter: 'Semua',
        detailed_id_list_barang: '',
        detailed_status: '',
        detailed_status_master: '',
        pembanding_detailed_status: '',
        detailed_status_for_reject: '',
        detailed_barang_id: '',
        detailed_price: '',
        show_detailed_price: '',
        detailed_price_in_rupiah: '',
        show_detailed_price_in_rupiah: '',
        empty_detailed_price: false,
        empty_detailed_deskripsi: false,
        empty_detailed_minimum_pembelian: false,
        empty_detailed_minimum_nego: false,
        empty_detailed_kode_barang_distributor: false,
        feedback_detailed_kode_barang_distributor: '',
        detailed_foto: '',
        detailed_foto_baru: '',
        detailed_foto_baru_url: '',
        detailed_deskripsi: '',
        pembanding_detailed_deskripsi: '',
        detailed_update_by: '',
        detailed_update_date: '',
        detailed_nama: '',
        detailed_kategori: '',
        detailed_berat: '',
        detailed_volume: '',
        detailed_nama_singkat_satuan: '',
        detailed_nama_satuan: '',
        detailed_minimum_pembelian: '',
        detailed_minimum_nego: '',
        detailed_kode_barang_distributor: '',
        show_detailed_minimum_pembelian: '',
        show_detailed_minimum_nego: '',
        show_detailed_price_terendah: '',
        detailed_price_in_rupiah_terendah: '',
        show_detailed_price_in_rupiah_terendah: '',
        detailed_price_terendah: '',
        pembanding_detailed_kode_barang_distributor: '',
        tmp: '',
        tmpPict: '',
        searchValue: '',
        insert_deskripsi: '',
        insert_minimum_pembelian: '',
        insert_minimum_nego: '',
        insert_price: '',
        insert_price_terendah: '',
        empty_insert_price: false,
        insert_kode_barang_distributor: '',
        insert_foto: '',
        insert_foto_baru: '',
        insert_foto_baru_url: '',
        id_barang_registered_insert: '0',
        id_kategori_barang_registered_insert: '',
        nama_barang_registered_insert: '',
        berat_barang_registered_insert: '',
        volume_barang_registered_insert: '',
        kategori_barang_registered_insert: '',
        nama_satuan_barang_registered_insert: '',
        nama_singkat_satuan_barang_registered_insert: '',
        empty_insert_deskripsi: false,
        errormessage: '',
        errormessageterendah: '',
        default_currency: 'USD',
        default_currency_terendah: 'USD',
        default_currency_update: 'USD',
        default_currency_update_terendah: 'USD',
        default_currency_master_barang: 'USD',
        default_currency_master_barang_terendah: 'USD',
        nama_barang_inserted: '',
        id_category_barang_inserted: '',
        nama_category_barang_inserted: '',
        satuan_barang_inserted: '',
        insert_master_minimum_pembelian: '',
        insert_master_minimum_nego: '',
        insert_master_kode_barang_distributor: '',
        insert_price_master_barang: '',
        insert_price_master_barang_terendah: '',
        berat_barang_inserted: '',
        volume_barang_inserted: '',
        ex_barang_inserted: '',
        insert_foto_master: '',
        insert_foto_master_baru: '',
        insert_foto_master_baru_url: '',
        insert_deskripsi_master_barang: '',
        insertGambarBarangMaster: false,
        status_barang_inserted: 'C',
        empty_nama_barang_inserted: false,
        empty_berat_barang_inserted: false,
        empty_volume_barang_inserted: false,
        empty_ex_barang_inserted: false,
        empty_insert_minimum_pembelian: false,
        empty_insert_minimum_nego: false,
        empty_insert_kode_barang_distributor: false,
        empty_insert_price_master_barang: false,
        empty_deskripsi_master_barang: false,
        empty_insert_master_minimum_pembelian: false,
        empty_insert_master_minimum_nego: false,
        empty_insert_master_kode_barang_distributor: false,
        id_hasil_insert_master_barang: '',
        isBtnConfirmUpdate: true,
        isBtnConfirmInsert: true,
        isBtnConfirmInsertMaster: true,
        errormessageinsert: '',
        errormessageinsertterendah: '',
        warningharga: '',
        warningshowhargaterendah: '',
        warningshowhargatertinggi: '',
        warningberikutshowharga: '',
        activePage: 1,
        slicex: '0',
        slicey: '8',
        inputValue: 'Pilih barang',
        id_satuan_barang_inserted: '0',
        alias_satuan_barang_inserted: '',
        feedback_detailed_minimum_nego: '',
        feedback_detailed_minimum_pembelian: '',
        feedback_insert_minimum_nego: '',
        feedback_insert_minimum_pembelian: '',
        feedback_insert_kode_barang_distributor: '',
        feedback_insert_master_kode_barang_distributor: '',
        disable_insert_minimum_pembelian: true,
        disable_insert_minimum_nego: true,
        disable_insert_price: true,
        disable_insert_price_terendah: true,
        disable_insert_kode_barang_distributor: true,
        disable_insert_deskripsi: true,
        feedback_insert_master_minimum_nego: '',
        feedback_insert_master_minimum_pembelian: '',
        feedback_insert_master_berat: '',
        feedback_insert_master_volume: '',
        disable_insert_master_price: true,
        disable_insert_master_price_terendah: true,
        disable_insert_master_minimum_nego: true,
        disable_insert_master_minimum_pembelian: true,
        detailed_nominal_persen_nego_pertama: '',
        feedback_detailed_nominal_persen_nego_pertama: '',
        empty_detailed_nominal_persen_nego_pertama: false,
        detailed_nominal_persen_nego_kedua: '',
        feedback_detailed_nominal_persen_nego_kedua: '',
        empty_detailed_nominal_persen_nego_kedua: false,
        detailed_nominal_persen_nego_ketiga: '',
        feedback_detailed_nominal_persen_nego_ketiga: '',
        empty_detailed_nominal_persen_nego_ketiga: false,
        insert_nominal_persen_nego_pertama: '',
        feedback_insert_nominal_persen_nego_pertama: '',
        empty_insert_nominal_persen_nego_pertama: false,
        insert_nominal_persen_nego_kedua: '',
        feedback_insert_nominal_persen_nego_kedua: '',
        empty_insert_nominal_persen_nego_kedua: false,
        insert_nominal_persen_nego_ketiga: '',
        feedback_insert_nominal_persen_nego_ketiga: '',
        empty_insert_nominal_persen_nego_ketiga: false,
        feedback_insert_deskripsi: '',
        feedback_detailed_deskripsi: '',
        isCheckedInsertNominalPersen: false,
        isbtnConfirmInsertKedua: false,
        disable_insert_persen_nego_kedua: true,
        disable_insert_persen_nego_ketiga: true,
        isbtnConfirmInsertMasterKedua: false,
        disable_insert_master_persen_nego_kedua: true,
        disable_insert_master_persen_nego_ketiga: true,
        isCheckedInsertMasterNominalPersen: false,
        feedback_insert_master_nama_barang: '',
        insert_master_nominal_persen_nego_pertama: '',
        feedback_insert_master_nominal_persen_nego_pertama: '',
        empty_insert_master_nominal_persen_nego_pertama: false,
        insert_master_nominal_persen_nego_kedua: '',
        feedback_insert_master_nominal_persen_nego_kedua: '',
        empty_insert_master_nominal_persen_nego_kedua: false,
        insert_master_nominal_persen_nego_ketiga: '',
        feedback_insert_master_nominal_persen_nego_ketiga: '',
        empty_insert_master_nominal_persen_nego_ketiga: false,
        isOpenConfirmInsertKeduaMaster: false,
        flag_status_insert_price: false,
        flag_status_insert_master_price: false,
        flag_status_update_price: false,
        flag_status_update_price_tertinggi: false,
        flag_status_insert_price_tertinggi: false,
        flag_status_insert_master_price_tertinggi: false,
        attentionmessage: '',
        isOpenAttention: false,
        isOpenAttentionTerdaftar: false,
        disable_btnconfirminsertkeduamasterbarang: false,
        disable_btnconfirminsertkeduabarang: false,
        disable_btnconfirmupdate: false,
        isOpenAttentionKodeBarangConfirmKedua: false,
        company_info_ppn: '',
        tmp_company_info_ppn: '',
        updated_ppn: '',
        isOpenPPN: false,
        empty_updated_ppn: false,
        feedback_updated_ppn: '',
        isBtnUpdatePPN: true,
        isOpenConfirmUpdatePPN: false,
        isRiwayatHargaOpen: false,
        startDateRiwayatHarga: null,
        endDateRiwayatHarga: null,
        filterDataRiwayatHarga: null
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        this.setState({
            id_pengguna_login: decrypt(userData.id),
            company_id: decrypt(userData.company_id),
            company_name: decrypt(userData.company_name),
            tipe_bisnis: decrypt(userData.tipe_bisnis),
            nama_tipe_bisnis: decrypt(userData.nama_tipe_bisnis),
            sa_role: decrypt(userData.sa_role),
            sa_divisi: decrypt(userData.sa_divisi),
            id_sales_registered: decrypt(userData.id_sales_registered),
            id_company_registered: decrypt(userData.id_company_registered)
        })
        // this.loadKurs()
        this.loadCategory()
        this.loadSatuan()
    }

    async componentDidMount() {
        await this.loadKursManual()
        await this.loadDivisi()
        await this.loadCategoryKhusus()
        await this.loadRegisteredBarang()
        await this.loadDataBarang()
        await this.loadPPNBarang()
    }



    loadPPNBarang = async () => {
        let passqueryppn = encrypt("select ppn_seller from gcm_master_company where id =" + this.state.company_id)
        const resppn = await this.props.getPPNBarang({ query: passqueryppn }).catch(err => err)
        if (resppn) {
            this.setState({
                company_info_ppn: Number(resppn.ppn_seller),
                tmp_company_info_ppn: Number(resppn.ppn_seller)
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

    handlePPN = () => {
        this.setState({
            isOpenPPN: !this.state.isOpenPPN
        })
    }

    handleModalPPN = () => {
        this.setState({
            isOpenModalPPN: !this.state.isOpenModalPPN,
            updated_ppn: this.state.tmp_company_info_ppn,
            empty_updated_ppn: false,
            feedback_updated_ppn: ''
        })
    }

    handleModalConfirmPPN = () => {
        this.setState({
            isOpenConfirmUpdatePPN: !this.state.isOpenConfirmUpdatePPN,
        })
    }

    confirmActionUpdatePPN = async () => {
        let passqueryupdateppn = encrypt("update gcm_master_company set ppn_seller='" + this.state.updated_ppn + "' " +
            " where id=" + this.state.company_id + " returning ppn_seller;")
        const resupdateppn = await this.props.updateBarangStatus({ query: passqueryupdateppn }).catch(err => err)
        if (resupdateppn) {
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

    loadCategoryKhusus = async () => {
        let passquerycategorykhusus = encrypt("select * from gcm_master_category where id=" + this.state.sa_divisi + " or id=5")
        const rescategorykhusus = await this.props.getDataCategoryAPI({ query: passquerycategorykhusus }).catch(err => err)
        if (rescategorykhusus) {
            this.setState({
                allCategoryKhusus: rescategorykhusus
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

    loadSatuan = async () => {
        let passquerysatuan = encrypt("select * from gcm_master_satuan;")
        const ressatuan = await this.props.getDataSatuanAPI({ query: passquerysatuan }).catch(err => err)
        if (ressatuan) {
            this.setState({
                allSatuan: ressatuan
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

    loadRegisteredBarang = async () => {
        let passqueryregisteredbarang = ""
        if (this.state.tipe_bisnis === '1' && this.state.sa_divisi === '1') {
            passqueryregisteredbarang = encrypt("select gcm_master_barang.id, gcm_master_barang.nama, gcm_master_barang.berat, " +
                "gcm_master_barang.volume, gcm_master_category.nama as nama_kategori, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias " +
                "from gcm_master_barang inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
                "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
                "where " +
                "not exists (select * from gcm_list_barang " +
                "where gcm_master_barang.id = gcm_list_barang.barang_id and gcm_list_barang.company_id="
                + this.state.company_id + ") and gcm_master_barang.status='A'")
        } else if (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') {
            // passqueryregisteredbarang = encrypt("select gcm_master_barang.id, gcm_master_barang.nama, gcm_master_barang.berat, "+
            //     "gcm_master_barang.volume, gcm_master_category.nama as nama_kategori, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias "+
            //     "from gcm_master_barang inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id "+
            //     "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id "+
            //     "where gcm_master_barang.category_id="+this.state.sa_divisi+
            //         "and not exists (select * from gcm_list_barang "+
            //             "where gcm_master_barang.id = gcm_list_barang.barang_id and gcm_list_barang.company_id="
            //             +this.state.company_id+") and gcm_master_barang.status='A'")
            passqueryregisteredbarang = encrypt("select gcm_master_barang.id, gcm_master_barang.nama, gcm_master_barang.berat, " +
                "gcm_master_barang.volume, gcm_master_category.nama as nama_kategori, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias " +
                "from gcm_master_barang inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
                "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
                "where (gcm_master_barang.category_id=" + this.state.sa_divisi + " or gcm_master_barang.category_id=5) " +
                "and not exists (select * from gcm_list_barang " +
                "where gcm_master_barang.id = gcm_list_barang.barang_id and gcm_list_barang.company_id="
                + this.state.company_id + ") and gcm_master_barang.status='A'")
        } else {
            // passqueryregisteredbarang = encrypt("select gcm_master_barang.id, gcm_master_barang.nama, gcm_master_barang.berat, "+
            //     "gcm_master_barang.volume, gcm_master_category.nama as nama_kategori, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias " +
            //     "from gcm_master_barang inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id "+
            //     "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id "+
            //         "where gcm_master_barang.category_id="+this.state.tipe_bisnis+
            //             "and not exists (select * from gcm_list_barang "+
            //                 "where gcm_master_barang.id = gcm_list_barang.barang_id and gcm_list_barang.company_id="
            //                 +this.state.company_id+") and gcm_master_barang.status='A'")
            passqueryregisteredbarang = encrypt("select gcm_master_barang.id, gcm_master_barang.nama, gcm_master_barang.berat, " +
                "gcm_master_barang.volume, gcm_master_category.id as id_kategori, gcm_master_category.nama as nama_kategori, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias " +
                "from gcm_master_barang inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
                "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
                "where (gcm_master_barang.category_id=" + this.state.tipe_bisnis + " or gcm_master_barang.category_id=5) " +
                "and not exists (select * from gcm_list_barang " +
                "where gcm_master_barang.id = gcm_list_barang.barang_id and gcm_list_barang.company_id="
                + this.state.company_id + ") and gcm_master_barang.status='A'")
        }
        const resregisteredbarang = await this.props.getDataBarangCanInsert({ query: passqueryregisteredbarang }).catch(err => err)
        if (resregisteredbarang) {
            // this.setState({
            //     allRegisteredBarang:resregisteredbarang
            // })
            let userList = [];
            let list = [];
            list = resregisteredbarang;
            for (var i = 0; i < list.length; i++) {
                userList.push({
                    label: list[i].nama,
                    value: list[i].id,
                    berat: list[i].berat,
                    volume: list[i].volume,
                    id_kategori: list[i].id_kategori,
                    nama_kategori: list[i].nama_kategori,
                    alias: list[i].alias,
                    nama_alias: list[i].nama_alias
                });
            }
            this.setState({
                allRegisteredBarang: userList
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

    loadKurs = async () => {
        const reskurs = await this.props.getKursAPI().catch(err => err)
        if (reskurs) {
            this.setState({
                kurs_now: reskurs
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

    loadDivisi = async () => {
        let passquerydivisi = encrypt("select gcm_master_category.nama as nama_divisi from gcm_master_category where id=" + this.state.sa_divisi)
        const resdivisi = await this.props.getDivisi({ query: passquerydivisi }).catch(err => err)
        if (resdivisi) {
            this.setState({
                nama_divisi: resdivisi.nama_divisi
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

    loadDataBarang = async () => {
        let passquery = ""
        if (this.state.sa_divisi !== '1') {
            passquery = encrypt("select	gcm_list_barang.id, gcm_list_barang.status, gcm_master_barang.status as status_master, gcm_list_barang.barang_id, gcm_list_barang.price, " +
                "gcm_list_barang.company_id, gcm_list_barang.foto, gcm_list_barang.update_by, to_char(gcm_list_barang.update_date, 'DD/MM/YYYY') update_date, " +
                "gcm_master_barang.nama, gcm_master_category.nama as kategori, gcm_master_barang.category_id, gcm_master_barang.berat, gcm_master_barang.volume, " +
                "gcm_master_user.nama as nama_alias, gcm_master_satuan.alias " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
                "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
                "left join gcm_master_user on gcm_list_barang.update_by = gcm_master_user.id " +
                "where gcm_list_barang.company_id = " + this.state.company_id + " " +
                "and gcm_master_barang.category_id = " + this.state.sa_divisi + " or gcm_master_barang.category_id = 5 " +
                "order by gcm_list_barang.update_date desc, gcm_master_barang.category_id asc, gcm_master_barang.nama asc")
        } else {
            passquery = encrypt("select	gcm_list_barang.id, gcm_list_barang.status, gcm_master_barang.status as status_master, gcm_list_barang.barang_id, gcm_list_barang.price, " +
                "gcm_list_barang.company_id, gcm_list_barang.foto, gcm_list_barang.update_by, to_char(gcm_list_barang.update_date, 'DD/MM/YYYY') update_date, " +
                "gcm_master_barang.nama, gcm_master_category.nama as kategori, gcm_master_barang.category_id, gcm_master_barang.berat, gcm_master_barang.volume, " +
                "gcm_master_user.nama as nama_alias, gcm_master_satuan.alias " +
                "from gcm_list_barang " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
                "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
                "left join gcm_master_user on gcm_list_barang.update_by = gcm_master_user.id " +
                "where gcm_list_barang.company_id = " + this.state.company_id + " " +
                "order by gcm_list_barang.update_date desc, gcm_master_barang.category_id asc, gcm_master_barang.nama asc")
        }
        const res = await this.props.getDataBarangAPI({ query: passquery }).catch(err => err)

        if (res) {
            this.setState({
                allDataBarang: res,
                tmpfilteredDataBarang: res
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

    changeBarangDropdown = (val) => {
        this.setState({
            id_barang_registered_insert: val.value,
            nama_barang_registered_insert: val.label,
            berat_barang_registered_insert: val.berat,
            volume_barang_registered_insert: val.volume,
            id_kategori_barang_registered_insert: val.id_kategori,
            kategori_barang_registered_insert: val.nama_kategori,
            nama_satuan_barang_registered_insert: val.nama_alias,
            nama_singkat_satuan_barang_registered_insert: val.alias,
            disable_insert_minimum_pembelian: false,
            disable_insert_minimum_nego: false,
            disable_insert_price: false,
            disable_insert_price_terendah: false,
            disable_insert_deskripsi: false,
            disable_insert_kode_barang_distributor: false
        })
    }

    handleFilter = () => {
        this.setState({
            isOpenFilter: !this.state.isOpenFilter
        })
    }

    handleDropDownBarang = () => {
        this.setState({
            isOpenBarang: !this.state.isOpenBarang
        })
    }

    handleDropDownCurrencyInsertBarang = () => {
        this.setState({
            isOpenCurrencyInsertBarang: !this.state.isOpenCurrencyInsertBarang
        })
    }

    handleDropDownCurrencyInsertBarangTerendah = () => {
        this.setState({
            isOpenCurrencyInsertBarangTerendah: !this.state.isOpenCurrencyInsertBarangTerendah
        })
    }

    handleDropDownCurrencyInsertMasterBarang = () => {
        this.setState({
            isOpenCurrencyInsertMasterBarang: !this.state.isOpenCurrencyInsertMasterBarang
        })
    }

    handleDropDownCurrencyInsertMasterBarangTerendah = () => {
        this.setState({
            isOpenCurrencyInsertMasterBarangTerendah: !this.state.isOpenCurrencyInsertMasterBarangTerendah
        })
    }

    handleDropDownCurrencyUpdateBarang = () => {
        this.setState({
            isOpenCurrencyUpdateBarang: !this.state.isOpenCurrencyUpdateBarang
        })
    }

    handleDropDownCurrencyUpdateBarangTerendah = () => {
        this.setState({
            isOpenCurrencyUpdateBarangTerendah: !this.state.isOpenCurrencyUpdateBarangTerendah
        })
    }

    filterBarang = (e, kategori) => {
        if (e === 'S') {
            this.loadDataBarang()
            this.setState({
                statusFilter: false,
                selectedFilter: 'Semua'
            })
        } else {
            this.setState({
                statusFilter: true,
                allfilteredDataBarang: this.state.tmpfilteredDataBarang.filter(tmpfilteredDataBarang => tmpfilteredDataBarang.filterby === e),
                selectedFilter: kategori
            })
        }
    }

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            empty_detailed_price: false,
            default_currency_update: 'USD',
            default_currency_update_terendah: 'USD',
            empty_detailed_deskripsi: false,
            empty_detailed_minimum_pembelian: false,
            empty_detailed_minimum_nego: false,
            empty_detailed_nominal_persen_nego_pertama: false,
            empty_detailed_nominal_persen_nego_kedua: false,
            empty_detailed_nominal_persen_nego_ketiga: false,
            empty_detailed_kode_barang_distributor: false,
            feedback_detailed_minimum_nego: '',
            feedback_detailed_minimum_pembelian: '',
            feedback_detailed_nominal_persen_nego_pertama: '',
            feedback_detailed_nominal_persen_nego_kedua: '',
            feedback_detailed_nominal_persen_nego_ketiga: '',
            feedback_detailed_kode_barang_distributor: '',
            feedback_detailed_deskripsi: '',
            flag_status_update_price: false,
            flag_status_update_price_tertinggi: false,
            isBtnConfirmUpdate: true,
            disable_btnconfirmupdate: false,
            allCheckedKodeBarang: 0,
        })
    }

    handleDetailBarang = async (id) => {
        this.handleModalDetail()
        let passquerydetail = encrypt("select gcm_list_barang.id, gcm_list_barang.status, gcm_list_barang.barang_id, gcm_list_barang.price, gcm_list_barang.price_terendah, " +
            "gcm_list_barang.company_id, gcm_list_barang.foto, gcm_list_barang.deskripsi, gcm_list_barang.update_by, to_char(gcm_list_barang.update_date, 'DD/MM/YYYY') update_date, " +
            "gcm_master_barang.nama, gcm_master_category.nama as kategori, gcm_master_barang.category_id, gcm_master_barang.berat, " +
            "gcm_master_barang.volume, gcm_list_barang.jumlah_min_beli, gcm_list_barang.jumlah_min_nego, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias, gcm_master_barang.status as status_master, " +
            "gcm_list_barang.persen_nego_1, gcm_list_barang.persen_nego_2, gcm_list_barang.persen_nego_3, gcm_list_barang.kode_barang " +
            "from gcm_list_barang " +
            "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
            "inner join gcm_master_satuan on gcm_master_barang.satuan = gcm_master_satuan.id " +
            "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
            "where gcm_list_barang.company_id =" + this.state.company_id + " and gcm_list_barang.id=" + id)
        const resdetail = await this.props.getDataDetailedBarangAPI({ query: passquerydetail }).catch(err => err)
      
        let riwayatHargaQuery = encrypt(`select * from gcm_listing_harga_barang where barang_id='${decrypt(resdetail.id)}'`)
        const reqRiwayatHarga = await this.props.getDataBarangAPI({ query: riwayatHargaQuery }).catch(err => err)

        const riwayatHargaRow = reqRiwayatHarga.map((data, index) => {
            return {
                id: data.id,
                harga: data.price.props.value,
                harga_terendah: data.price_terendah,
                start_date: data.start_date.split("T")[0],
                // end_date: data.end_date ?
                // data.end_date.split("T")[0]
                // :
                // "berlaku sekarang"
                end_date: data.end_date ?
                    data.end_date.split("T")[0]
                    :
                    index + 1 < reqRiwayatHarga.length ? reqRiwayatHarga[index + 1].start_date.split("T")[0] : "berlaku sekarang"
            }
        })

        if (resdetail) {
            this.setState({
                detailed_id_list_barang: decrypt(resdetail.id),
                detailed_status: resdetail.status,
                detailed_status_master: resdetail.status_master,
                pembanding_detailed_status: resdetail.status,
                detailed_status_for_reject: resdetail.status,
                detailed_barang_id: decrypt(resdetail.barang_id),
                detailed_price: Number(resdetail.price),
                show_detailed_price: Number(resdetail.price),
                // detailed_price_in_rupiah: parseInt(resdetail.price * this.state.kurs_now).toFixed(0),
                // show_detailed_price_in_rupiah: parseInt(resdetail.price * this.state.kurs_now).toFixed(0),
                // detailed_price_in_rupiah: parseInt(resdetail.price * this.state.kurs_now_manual).toFixed(0),
                // show_detailed_price_in_rupiah: parseInt(resdetail.price * this.state.kurs_now_manual).toFixed(0),
                detailed_price_in_rupiah: Number(Math.ceil(resdetail.price * this.state.kurs_now_manual)),
                show_detailed_price_in_rupiah: Number(Math.ceil(resdetail.price * this.state.kurs_now_manual)),
                detailed_price_terendah: Number(resdetail.price_terendah),
                show_detailed_price_terendah: Number(resdetail.price_terendah),
                // detailed_price_in_rupiah_terendah: parseInt(resdetail.price_terendah * this.state.kurs_now).toFixed(0),
                // show_detailed_price_in_rupiah_terendah: parseInt(resdetail.price_terendah * this.state.kurs_now).toFixed(0),
                // detailed_price_in_rupiah_terendah: parseInt(resdetail.price_terendah * this.state.kurs_now_manual).toFixed(0),
                // show_detailed_price_in_rupiah_terendah: parseInt(resdetail.price_terendah * this.state.kurs_now_manual).toFixed(0),
                detailed_price_in_rupiah_terendah: Number(Math.ceil(resdetail.price_terendah * this.state.kurs_now_manual)),
                show_detailed_price_in_rupiah_terendah: Number(Math.ceil(resdetail.price_terendah * this.state.kurs_now_manual)),
                detailed_foto: resdetail.foto,
                detailed_deskripsi: resdetail.deskripsi,
                pembanding_detailed_deskripsi: resdetail.deskripsi,
                detailed_update_by: resdetail.update_by,
                detailed_update_date: resdetail.update_date,
                detailed_nama: resdetail.nama,
                detailed_kategori: resdetail.kategori,
                detailed_berat: resdetail.berat,
                detailed_volume: resdetail.volume,
                detailed_nama_satuan: resdetail.nama_alias,
                detailed_nama_singkat_satuan: resdetail.alias,
                detailed_minimum_pembelian: Number(resdetail.minimum_pembelian),
                detailed_minimum_nego: Number(resdetail.minimum_nego),
                show_detailed_minimum_pembelian: Number(resdetail.minimum_pembelian),
                show_detailed_minimum_nego: Number(resdetail.minimum_nego),
                detailed_nominal_persen_nego_pertama: Number(resdetail.persen_nego_1),
                detailed_nominal_persen_nego_kedua: Number(resdetail.persen_nego_2),
                detailed_nominal_persen_nego_ketiga: Number(resdetail.persen_nego_3),
                detailed_kode_barang_distributor: resdetail.kode_barang,
                pembanding_detailed_kode_barang_distributor: resdetail.kode_barang,
                riwayatHargaBarang: riwayatHargaRow,
                filterDataRiwayatHarga: riwayatHargaRow
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

    handleChange = (event) => {
        if (event.target.name === 'updated_ppn') {
            if (Number(event.target.value) <= 100) {
                this.check_field_ppn(event.target.value)
            } else {
                return;
            }
        }
        if (event.target.name === 'detailed_price') {
            this.check_field_harga(event.target.value)
        }
        if (event.target.name === 'detailed_price_in_rupiah') {
            this.check_field_harga_rupiah(event.target.value)
        }
        if (event.target.name === 'detailed_price_terendah') {
            this.check_field_harga_terendah(event.target.value)
        }
        if (event.target.name === 'detailed_price_in_rupiah_terendah') {
            this.check_field_harga_terendah_rupiah(event.target.value)
        }
        if (event.target.name === 'detailed_deskripsi') {
            this.check_deskripsi(event.target.value)
        }
        if (event.target.name === 'detailed_kode_barang_distributor') {
            if (event.keyCode !== 32) {
                this.check_kode_barang_distributor(event.target.value)
            }
        }
        if (event.target.name === 'detailed_minimum_pembelian') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_minimum_pembelian(event.target.value)
            }
        }
        if (event.target.name === 'detailed_minimum_nego') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_minimum_nego(event.target.value)
            }
        }
        if (event.target.name === 'detailed_nominal_persen_nego_pertama') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg) && event.target.value.length > 1) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                if (Number(event.target.value) <= 100) {
                    this.check_persen_nego_pertama(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'detailed_nominal_persen_nego_kedua') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg) && event.target.value.length > 1) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                if (Number(event.target.value) <= Number(this.state.detailed_nominal_persen_nego_pertama) && Number(event.target.value) <= 100) {
                    this.check_persen_nego_kedua(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'detailed_nominal_persen_nego_ketiga') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg) && event.target.value.length > 1) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                if (Number(event.target.value) <= Number(this.state.detailed_nominal_persen_nego_kedua) && Number(event.target.value) <= 100) {
                    this.check_persen_nego_ketiga(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'insert_price') {
            this.check_field_harga_insert(event.target.value)
        }
        if (event.target.name === 'insert_price_terendah') {
            this.check_field_harga_insert_terendah(event.target.value)
        }
        if (event.target.name === 'insert_deskripsi') {
            this.check_deskripsi_insert(event.target.value)
        }
        if (event.target.name === 'insert_kode_barang_distributor') {
            this.check_kode_barang_distributor_insert(event.target.value)
        }
        if (event.target.name === 'insert_minimum_pembelian') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_field_minimum_pembelian(event.target.value)
            }
        }
        if (event.target.name === 'insert_minimum_nego') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_field_minimum_nego(event.target.value)
            }
        }
        if (event.target.name === 'insert_nominal_persen_nego_pertama') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg) && event.target.value.length > 1) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                if (Number(event.target.value) <= 100) {
                    this.check_insert_persen_nego_pertama(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'insert_nominal_persen_nego_kedua') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg) && event.target.value.length > 1) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                if (Number(event.target.value) <= Number(this.state.insert_nominal_persen_nego_pertama) && Number(event.target.value) <= 100) {
                    this.check_insert_persen_nego_kedua(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'insert_nominal_persen_nego_ketiga') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg) && event.target.value.length > 1) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                if (Number(event.target.value) <= Number(this.state.insert_nominal_persen_nego_kedua) && Number(event.target.value) <= 100) {
                    this.check_insert_persen_nego_ketiga(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'nama_barang_inserted') {
            this.check_field_nama_barang_inserted(event.target.value)
        }
        if (event.target.name === 'insert_price_master_barang') {
            this.check_field_harga_insert_master(event.target.value)
        }
        if (event.target.name === 'insert_price_master_barang_terendah') {
            this.check_field_harga_insert_master_terendah(event.target.value)
        }
        if (event.target.name === 'berat_barang_inserted') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_field_berat_insert_master(event.target.value)
            }
        }
        if (event.target.name === 'volume_barang_inserted') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_field_volume_insert_master(event.target.value)
            }
        }
        if (event.target.name === 'ex_barang_inserted') {
            this.check_field_ex_insert_master(event.target.value)
        }
        if (event.target.name === 'insert_deskripsi_master_barang') {
            this.check_field_deskripsi_insert_master(event.target.value)
        }
        if (event.target.name === 'insert_master_kode_barang_distributor') {
            this.check_field_kode_barang_insert_master(event.target.value)
        }
        if (event.target.name === 'insert_master_minimum_pembelian') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_field_minimum_pembelian_insert_master(event.target.value)
            }
        }
        if (event.target.name === 'insert_master_minimum_nego') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_field_minimum_nego_insert_master(event.target.value)
            }
        }
        if (event.target.name === 'insert_master_nominal_persen_nego_pertama') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg) && event.target.value.length > 1) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                if (Number(event.target.value) <= 100) {
                    this.check_insert_master_persen_nego_pertama(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'insert_master_nominal_persen_nego_kedua') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg) && event.target.value.length > 1) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                if (Number(event.target.value) <= Number(this.state.insert_master_nominal_persen_nego_pertama) && Number(event.target.value) <= 100) {
                    this.check_insert_master_persen_nego_kedua(event.target.value)
                } else {
                    return;
                }
            }
        }
        if (event.target.name === 'insert_master_nominal_persen_nego_ketiga') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg) && event.target.value.length > 1) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                if (Number(event.target.value) <= Number(this.state.insert_master_nominal_persen_nego_kedua) && Number(event.target.value) <= 100) {
                    this.check_insert_master_persen_nego_ketiga(event.target.value)
                } else {
                    return;
                }
            }
        }
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    check_field_ppn = (x) => {
        if (x === '') {
            this.setState({ empty_updated_ppn: true, feedback_updated_ppn: 'Kolom ini wajib diisi', isBtnUpdatePPN: true })
        } else {
            this.setState({ empty_updated_ppn: false, feedback_updated_ppn: '', isBtnUpdatePPN: false })
        }
    }

    check_field_harga = async (x) => {
        if (x === '') {
            await this.setState({ isBtnConfirmUpdate: true })
            document.getElementById('errorharga').style.display = 'block'
            await this.setState({ empty_detailed_price: true, errormessage: 'Kolom ini wajib diisi', flag_status_update_price_tertinggi: false })
        } else if (x !== '') {
            if (x === '0') {
                await this.setState({ isBtnConfirmUpdate: true })
                document.getElementById('errorharga').style.display = 'block'
                await this.setState({ empty_detailed_price: true, errormessage: 'Harga tertinggi tidak boleh bernilai 0', flag_status_update_price_tertinggi: false })
            } else {
                let hargaterendah = this.state.detailed_price_terendah.toString().split(',').join('')
                let hargatertinggi = x.split(',').join('')
                if (this.state.default_currency_update_terendah === 'USD') { // default_currency_update_terendah USD
                    if (Number(hargatertinggi) < Number(hargaterendah)) {
                        await this.setState({ isBtnConfirmUpdate: true })
                        document.getElementById('errorharga').style.display = 'block'
                        await this.setState({ empty_detailed_price: true, errormessage: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_update_price_tertinggi: false })
                    } else {
                        document.getElementById('errorharga').style.display = 'none'
                        await this.setState({ empty_detailed_price: false, errormessage: '' })
                        if (Number(hargatertinggi) >= Number(hargaterendah)) {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_detailed_price: true, errormessageterendah: '', flag_status_update_price_tertinggi: true })
                            if (Number(hargaterendah) <= Number(hargatertinggi)) {
                                await this.setState({ flag_status_update_price: true })
                            }
                        }
                    }
                } else { // default_currency_update_terendah IDR
                    let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                    let b = Math.round(a.split(',').join('.'))
                    let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
                    if (Number(hargatertinggi) < Number(hargaterendah)) {
                        await this.setState({ isBtnConfirmUpdate: true })
                        document.getElementById('errorharga').style.display = 'block'
                        await this.setState({ empty_detailed_price: true, errormessage: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_update_price_tertinggi: false })
                    } else {
                        document.getElementById('errorharga').style.display = 'none'
                        await this.setState({ empty_detailed_price: false, errormessage: '' })
                        if (Number(hargatertinggi) >= Number(hargaterendah)) {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_detailed_price: true, errormessageterendah: '', flag_status_update_price_tertinggi: true })
                            if (Number(hargaterendah) <= Number(hargatertinggi)) {
                                await this.setState({ flag_status_update_price: true })
                            }
                        }
                    }
                }



                // if (Number(x) < Number(this.state.detailed_price_terendah)) {
                //     this.setState({isBtnConfirmUpdate: true})
                //     document.getElementById('errorharga').style.display='block'
                //     this.setState({empty_detailed_price: true, errormessage:'Harga tertinggi harus lebih tinggi dari harga terendah'})
                // } else {
                //     document.getElementById('errorharga').style.display='none'
                //     this.setState({empty_detailed_price: false, errormessage:''})
                //     if (Number(x) > Number(this.state.detailed_price_terendah)) {
                //         document.getElementById('errorhargaterendah').style.display='none'
                //         this.setState({empty_detailed_price: true, errormessageterendah:''})
                //     }
                // }

                //handle button
                if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
                    (this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
                    (this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0' && this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true) &&
                    (this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0' && this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true) &&
                    this.state.detailed_deskripsi !== '' &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' &&
                    this.state.detailed_nominal_persen_nego_kedua !== '' &&
                    this.state.detailed_nominal_persen_nego_ketiga !== '' &&
                    this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
                    this.setState({ isBtnConfirmUpdate: false })
                }
            }
        }
    }


    check_field_harga_terendah = async (x) => {
        if (x === '') {
            await this.setState({ isBtnConfirmUpdate: true })
            document.getElementById('errorhargaterendah').style.display = 'block'
            await this.setState({ empty_detailed_price: true, errormessageterendah: 'Kolom ini wajib diisi', flag_status_update_price: false })
        } else if (x !== '') {
            if (x === '0') {
                await this.setState({ isBtnConfirmUpdate: true })
                document.getElementById('errorhargaterendah').style.display = 'block'
                await this.setState({ empty_detailed_price: true, errormessageterendah: 'Harga terendah tidak boleh bernilai 0', flag_status_update_price: false })
            } else {
                let hargaterendah = x.split(',').join('')
                if (this.state.default_currency_update === 'USD') {
                    let hargatertinggi = this.state.detailed_price.toString().split(',').join('')
                    if (Number(hargaterendah) > Number(hargatertinggi)) {
                        await this.setState({ isBtnConfirmUpdate: true })
                        document.getElementById('errorhargaterendah').style.display = 'block'
                        await this.setState({ empty_detailed_price: true, errormessageterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_update_price: false })
                    } else {
                        document.getElementById('errorhargaterendah').style.display = 'none'
                        await this.setState({ empty_detailed_price: false, errormessageterendah: '' })
                        if (Number(hargaterendah) <= Number(hargatertinggi)) {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_detailed_price: true, errormessage: '', flag_status_update_price: true })
                            if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                await this.setState({ flag_status_update_price_tertinggi: true })
                            }
                        }
                    }
                } else { // default_currency_update === 'IDR'
                    let a = this.state.detailed_price_in_rupiah.toString().split('.').join('')
                    let b = Math.round(a.split(',').join('.'))
                    // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                    let hargatertinggi = (b / this.state.kurs_now_manual).toFixed(2)
                    if (Number(hargaterendah) > Number(hargatertinggi)) {
                        await this.setState({ isBtnConfirmUpdate: true })
                        document.getElementById('errorhargaterendah').style.display = 'block'
                        await this.setState({ empty_detailed_price: true, errormessageterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_update_price: false })
                    } else {
                        document.getElementById('errorhargaterendah').style.display = 'none'
                        await this.setState({ empty_detailed_price: false, errormessageterendah: '' })
                        if (Number(hargaterendah) <= Number(hargatertinggi)) {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_detailed_price: true, errormessage: '', flag_status_update_price: true })
                            if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                await this.setState({ flag_status_update_price_tertinggi: true })
                            }
                        }
                    }
                }

                // handle button
                if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
                    (this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
                    (this.state.detailed_price !== '' && this.state.detailed_price !== '0' && this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true) &&
                    (this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0' && this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true) &&
                    this.state.detailed_deskripsi !== '' &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' &&
                    this.state.detailed_nominal_persen_nego_kedua !== '' &&
                    this.state.detailed_nominal_persen_nego_ketiga !== '' &&
                    this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
                    this.setState({ isBtnConfirmUpdate: false })
                }

            }
        }
    }

    check_field_harga_rupiah = async (x) => {
        if (x === '') {
            await this.setState({ isBtnConfirmUpdate: true })
            document.getElementById('errorharga').style.display = 'block'
            await this.setState({ empty_detailed_price: true, errormessage: 'Kolom ini wajib diisi', flag_status_update_price_tertinggi: false })
        } else if (x !== '') {
            if (x === '0') {
                await this.setState({ isBtnConfirmUpdate: true })
                document.getElementById('errorharga').style.display = 'block'
                await this.setState({ empty_detailed_price: true, errormessage: 'Harga tertinggi tidak boleh bernilai 0', flag_status_update_price_tertinggi: false })
            } else {
                let a = x.split('.').join('')
                let b = Math.round(a.split(',').join('.'))
                let hargatertinggi = (b / this.state.kurs_now_manual).toFixed(2)
                if (this.state.default_currency_update_terendah === 'USD') { // default_currency_update_terendah USD
                    let hargaterendah = this.state.detailed_price_terendah.toString().split(',').join('')
                    if (Number(hargatertinggi) < Number(hargaterendah)) {
                        await this.setState({ isBtnConfirmUpdate: true })
                        document.getElementById('errorharga').style.display = 'block'
                        await this.setState({ empty_detailed_price: true, errormessage: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_update_price_tertinggi: false })
                    } else {
                        document.getElementById('errorharga').style.display = 'none'
                        await this.setState({ empty_detailed_price: false, errormessage: '' })
                        if (Number(hargatertinggi) >= Number(hargaterendah)) {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_detailed_price: true, errormessageterendah: '', flag_status_update_price_tertinggi: true })
                            if (Number(hargaterendah) <= Number(hargatertinggi)) {
                                await this.setState({ flag_status_update_price: true })
                            }
                        }
                    }
                } else { // default_currency_update_terendah IDR
                    let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                    let b = Math.round(a.split(',').join('.'))
                    let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
                    if (Number(hargatertinggi) < Number(hargaterendah)) {
                        await this.setState({ isBtnConfirmUpdate: true })
                        document.getElementById('errorharga').style.display = 'block'
                        await this.setState({ empty_detailed_price: true, errormessage: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_update_price_tertinggi: false })
                    } else {
                        document.getElementById('errorharga').style.display = 'none'
                        await this.setState({ empty_detailed_price: false, errormessage: '' })
                        if (Number(hargatertinggi) >= Number(hargaterendah)) {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_detailed_price: true, errormessageterendah: '', flag_status_update_price_tertinggi: true })
                            if (Number(hargaterendah) <= Number(hargatertinggi)) {
                                await this.setState({ flag_status_update_price: true })
                            }
                        }
                    }
                }



                // if (Number(x.split('.').join('')) < Number(this.state.detailed_price_in_rupiah_terendah.split('.').join(''))) {
                //     this.setState({isBtnConfirmUpdate: true})
                //     document.getElementById('errorharga').style.display='block'
                //     this.setState({empty_detailed_price: true, errormessage:'Harga tertinggi harus lebih tinggi dari harga terendah'})
                // } else {
                //     document.getElementById('errorharga').style.display='none'
                //     this.setState({empty_detailed_price: false, errormessage:''})
                //     if (Number(x.split('.').join('')) > Number(this.state.detailed_price_in_rupiah_terendah.split('.').join(''))) {
                //         document.getElementById('errorhargaterendah').style.display='none'
                //         this.setState({empty_detailed_price: true, errormessageterendah:''})
                //     }
                // }

                // handle button
                if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
                    (this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
                    (this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0' && this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true) &&
                    (this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0' && this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true) &&
                    this.state.detailed_deskripsi !== '' &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' &&
                    this.state.detailed_nominal_persen_nego_kedua !== '' &&
                    this.state.detailed_nominal_persen_nego_ketiga !== '' &&
                    this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
                    this.setState({ isBtnConfirmUpdate: false })
                }
            }
        }
    }

    check_field_harga_terendah_rupiah = async (x) => {
        if (x === '') {
            await this.setState({ isBtnConfirmUpdate: true })
            document.getElementById('errorhargaterendah').style.display = 'block'
            await this.setState({ empty_detailed_price: true, errormessageterendah: 'Kolom ini wajib diisi', flag_status_update_price: false })
        } else if (x !== '') {
            if (x === '0') {
                await this.setState({ isBtnConfirmUpdate: true })
                document.getElementById('errorhargaterendah').style.display = 'block'
                await this.setState({ empty_detailed_price: true, errormessageterendah: 'Harga terendah tidak boleh bernilai 0', flag_status_update_price: false })
            } else {
                let a = x.split('.').join('')
                let b = Math.round(a.split(',').join('.'))
                // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
                if (this.state.default_currency_update === 'USD') {
                    let hargatertinggi = this.state.detailed_price.toString().split(',').join('')
                    if (Number(hargaterendah) > Number(hargatertinggi)) {
                        await this.setState({ isBtnConfirmUpdate: true })
                        document.getElementById('errorhargaterendah').style.display = 'block'
                        await this.setState({ empty_detailed_price: true, errormessageterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_update_price: false })
                    } else {
                        document.getElementById('errorhargaterendah').style.display = 'none'
                        await this.setState({ empty_detailed_price: false, errormessageterendah: '' })
                        if (Number(hargaterendah) <= Number(hargatertinggi)) {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_detailed_price: true, errormessage: '', flag_status_update_price: true })
                            if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                await this.setState({ flag_status_update_price_tertinggi: true })
                            }
                        }
                    }
                } else { // default_currency_update === 'IDR'
                    let a = this.state.detailed_price_in_rupiah.toString().split('.').join('')
                    let b = Math.round(a.split(',').join('.'))
                    // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                    let hargatertinggi = (b / this.state.kurs_now_manual).toFixed(2)
                    if (Number(hargaterendah) > Number(hargatertinggi)) {
                        await this.setState({ isBtnConfirmUpdate: true })
                        document.getElementById('errorhargaterendah').style.display = 'block'
                        await this.setState({ empty_detailed_price: true, errormessageterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_update_price: false })
                    } else {
                        document.getElementById('errorhargaterendah').style.display = 'none'
                        await this.setState({ empty_detailed_price: false, errormessageterendah: '' })
                        if (Number(hargaterendah) <= Number(hargatertinggi)) {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_detailed_price: true, errormessage: '', flag_status_update_price: true })
                            if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                await this.setState({ flag_status_update_price_tertinggi: true })
                            }
                        }
                    }
                }



                // if (Number(x.split('.').join('')) > Number(this.state.detailed_price_in_rupiah.split('.').join(''))) {
                //     this.setState({isBtnConfirmUpdate: true})
                //     document.getElementById('errorhargaterendah').style.display='block'
                //     this.setState({empty_detailed_price: true, errormessageterendah:'Harga terendah harus lebih rendah dari harga tertinggi'})
                // } else {
                //     document.getElementById('errorhargaterendah').style.display='none'
                //     this.setState({empty_detailed_price: false, errormessageterendah:''})
                //     if (Number(x.split('.').join('')) < Number(this.state.detailed_price_in_rupiah.split('.').join(''))) {
                //         document.getElementById('errorharga').style.display='none'
                //         this.setState({empty_detailed_price: true, errormessage:''})
                //     }
                // }

                // handle button
                if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
                    (this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
                    (this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0' && this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true) &&
                    (this.state.detailed_price !== '' && this.state.detailed_price !== '0' && this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true) &&
                    this.state.detailed_deskripsi !== '' &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' &&
                    this.state.detailed_nominal_persen_nego_kedua !== '' &&
                    this.state.detailed_nominal_persen_nego_ketiga !== '' &&
                    this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
                    this.setState({ isBtnConfirmUpdate: false })
                }
            }
        }
    }

    check_field_harga_insert = async (x) => {
        if (x === '') {
            await this.setState({ isBtnConfirmInsert: true })
            document.getElementById('errorharga').style.display = 'block'
            await this.setState({ empty_insert_price: true, errormessageinsert: 'Kolom ini wajib diisi', flag_status_insert_price_tertinggi: false })
        } else if (x !== '') {
            if (x === '0') {
                await this.setState({ isBtnConfirmInsert: true })
                document.getElementById('errorharga').style.display = 'block'
                await this.setState({ empty_insert_price: true, errormessageinsert: 'Harga tertinggi tidak boleh bernilai 0', flag_status_insert_price_tertinggi: false })
            } else {
                let temp = x.split(',').join('')
                if (this.state.default_currency_terendah === 'IDR') { // harga_terendah IDR
                    let a = this.state.insert_price_terendah.split('.').join('')
                    let b = Math.round(a.split(',').join('.'))
                    // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                    let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
                    if (this.state.default_currency === 'IDR') { // harga_tertinggi IDR
                        let c = x.split('.').join('')
                        let d = Math.round(c.split(',').join('.'))
                        // let hargatertinggi = Math.ceil(d / this.state.kurs_now_manual)
                        let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                        if (Number(hargatertinggi) < Number(hargaterendah)) {
                            this.setState({ isBtnConfirmInsert: true })
                            document.getElementById('errorharga').style.display = 'block'
                            await this.setState({ empty_insert_price: true, errormessageinsert: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_insert_price_tertinggi: false })
                        } else {
                            document.getElementById('errorharga').style.display = 'none'
                            this.setState({ empty_insert_price: false, errormessageinsert: '' })
                            if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                document.getElementById('errorhargaterendah').style.display = 'none'
                                await this.setState({ empty_insert_price: true, errormessageinsertterendah: '', flag_status_insert_price_tertinggi: true })
                                if (Number(hargaterendah) <= Number(hargatertinggi)) {
                                    await this.setState({ flag_status_insert_price: true })
                                }
                            }
                        }
                    } else {  // harga_tertinggi USD
                        if (Number(temp) < Number(hargaterendah)) {
                            await this.setState({ isBtnConfirmInsert: true })
                            document.getElementById('errorharga').style.display = 'block'
                            await this.setState({ empty_insert_price: true, errormessageinsert: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_insert_price_tertinggi: false })
                        } else {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_insert_price: false, errormessageinsert: '' })
                            if (Number(temp) >= Number(hargaterendah)) {
                                document.getElementById('errorhargaterendah').style.display = 'none'
                                await this.setState({ empty_insert_price: true, errormessageinsertterendah: '', flag_status_insert_price_tertinggi: true })
                                if (Number(hargaterendah) <= Number(temp)) {
                                    await this.setState({ flag_status_insert_price: true })
                                }
                            }
                        }
                    }
                } else { // harga_terendah USD
                    let temp = x.split(',').join('')
                    if (this.state.default_currency === 'IDR') {  // harga_tertinggi IDR
                        let a = x.split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        // let hargatertinggi = Math.ceil(b / this.state.kurs_now_manual)
                        let hargatertinggi = (b / this.state.kurs_now_manual).toFixed(2)
                        let hargaterendah = this.state.insert_price_terendah.split(',').join('')
                        if (Number(hargatertinggi) < Number(hargaterendah)) {
                            await this.setState({ isBtnConfirmInsert: true })
                            document.getElementById('errorharga').style.display = 'block'
                            await this.setState({ empty_insert_price: true, errormessageinsert: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_insert_price_tertinggi: false })
                        } else {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_insert_price: false, errormessageinsert: '' })
                            if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                document.getElementById('errorhargaterendah').style.display = 'none'
                                await this.setState({ empty_insert_price: true, errormessageinsertterendah: '', flag_status_insert_price_tertinggi: true })
                                if (Number(hargaterendah) <= Number(hargatertinggi)) {
                                    await this.setState({ flag_status_insert_price: true })
                                }
                            }
                        }
                    } else {  // harga_tertinggi USD
                        let hargaterendah = this.state.insert_price_terendah.split(',').join('')
                        if (Number(temp) < Number(hargaterendah)) {
                            await this.setState({ isBtnConfirmInsert: true })
                            document.getElementById('errorharga').style.display = 'block'
                            await this.setState({ empty_insert_price: true, errormessageinsert: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_insert_price_tertinggi: false })
                        } else {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_insert_price: false, errormessageinsert: '' })
                            if (Number(temp) >= Number(hargaterendah)) {
                                document.getElementById('errorhargaterendah').style.display = 'none'
                                await this.setState({ empty_insert_price: true, errormessageinsertterendah: '', flag_status_insert_price_tertinggi: true })
                                if (Number(hargaterendah) <= Number(temp)) {
                                    await this.setState({ flag_status_insert_price: true })
                                }
                            }
                        }
                    }
                }



                // if (Number(x) < Number(this.state.insert_price_terendah)) {
                //     this.setState({isBtnConfirmInsert: true})
                //     document.getElementById('errorharga').style.display='block'
                //     this.setState({empty_insert_price: true, errormessageinsert:'Harga tertinggi harus lebih tinggi dari harga terendah'})
                // } else {
                //     document.getElementById('errorharga').style.display='none'
                //     this.setState({empty_insert_price: false, errormessageinsert:''})
                //     if (Number(x) > Number(this.state.insert_price)) {
                //         document.getElementById('errorhargaterendah').style.display='none'
                //         this.setState({empty_insert_price: true, errormessageinsertterendah:''})
                //     }
                // handle button
                // if ((this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
                //     (this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && Number(this.state.insert_minimum_pembelian) % Number(this.state.berat_barang_registered_insert) === 0) &&
                //     (this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0') && (Number(x) > Number(this.state.insert_price_terendah)) &&
                //     this.state.insert_deskripsi !== '' && this.state.insert_foto !== '') {
                //     this.setState({isBtnConfirmInsert: false})
                // }
                if ((this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
                    (this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && Number(this.state.insert_minimum_pembelian) % Number(this.state.berat_barang_registered_insert) === 0) &&
                    (this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                    this.state.insert_deskripsi !== '' && this.state.insert_foto !== '' && this.state.insert_kode_barang_distributor !== '') {
                    this.setState({ isBtnConfirmInsert: false })
                }
            }
        }
    }

    check_field_harga_insert_terendah = async (x) => {
        if (x === '') {
            await this.setState({ isBtnConfirmInsert: true })
            document.getElementById('errorhargaterendah').style.display = 'block'
            await this.setState({ empty_insert_price: true, errormessageinsertterendah: 'Kolom ini wajib diisi', flag_status_insert_price: false })
        } else if (x !== '') {
            if (x === '0') {
                await this.setState({ isBtnConfirmInsert: true })
                document.getElementById('errorhargaterendah').style.display = 'block'
                await this.setState({ empty_insert_price: true, errormessageinsertterendah: 'Harga terendah tidak boleh bernilai 0', flag_status_insert_price: false })
            } else {
                if (this.state.default_currency_terendah === 'IDR') { // harga_terendah IDR
                    let a = x.split('.').join('')
                    let b = Math.round(a.split(',').join('.'))
                    // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                    let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
                    if (this.state.default_currency === 'IDR') { // harga_tertinggi IDR
                        let c = this.state.insert_price.split('.').join('')
                        let d = Math.round(c.split(',').join('.'))
                        // let hargatertinggi = Math.ceil(d / this.state.kurs_now_manual)
                        let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                        if (Number(hargaterendah) > Number(hargatertinggi)) {
                            await this.setState({ isBtnConfirmInsert: true })
                            document.getElementById('errorhargaterendah').style.display = 'block'
                            await this.setState({ empty_insert_price: true, errormessageinsertterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_insert_price: false })
                        } else {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_insert_price: false, errormessageinsertterendah: '' })
                            if (Number(hargaterendah) < Number(hargatertinggi)) {
                                document.getElementById('errorharga').style.display = 'none'
                                await this.setState({ empty_insert_price: true, errormessageinsert: '', flag_status_insert_price: true })
                                if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                    await this.setState({ flag_status_insert_price_tertinggi: true })
                                }
                            }
                        }
                    } else { // harga_tertinggi USD
                        let hargatertinggi = this.state.insert_price.split(',').join('')
                        if (Number(hargaterendah) > Number(hargatertinggi)) {
                            await this.setState({ isBtnConfirmInsert: true })
                            document.getElementById('errorhargaterendah').style.display = 'block'
                            await this.setState({ empty_insert_price: true, errormessageinsertterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_insert_price: false })
                        } else {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_insert_price: false, errormessageinsertterendah: '' })
                            if (Number(hargaterendah) < Number(hargatertinggi)) {
                                document.getElementById('errorharga').style.display = 'none'
                                await this.setState({ empty_insert_price: true, errormessageinsert: '', flag_status_insert_price: true })
                                if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                    await this.setState({ flag_status_insert_price_tertinggi: true })
                                }
                            }
                        }
                    }
                } else { // harga_terendah USD
                    let a = x.split(',').join('')
                    if (this.state.default_currency === 'IDR') { // harga_tertinggi IDR
                        let c = this.state.insert_price.split('.').join('')
                        let d = Math.round(c.split(',').join('.'))
                        // let hargatertinggi = Math.ceil(d / this.state.kurs_now_manual)
                        let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                        if (Number(a) > Number(hargatertinggi)) {
                            this.setState({ isBtnConfirmInsert: true })
                            document.getElementById('errorhargaterendah').style.display = 'block'
                            await this.setState({ empty_insert_price: true, errormessageinsertterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_insert_price: false })
                        } else {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_insert_price: false, errormessageinsertterendah: '' })
                            if (Number(a) < Number(hargatertinggi)) {
                                document.getElementById('errorharga').style.display = 'none'
                                await this.setState({ empty_insert_price: true, errormessageinsert: '', flag_status_insert_price: true })
                                if (Number(hargatertinggi) >= Number(a)) {
                                    await this.setState({ flag_status_insert_price_tertinggi: true })
                                }
                            }
                        }
                    } else { // harga_tertinggi USD
                        let hargatertinggi = this.state.insert_price.split(',').join('')
                        if (Number(a) > Number(hargatertinggi)) {
                            await this.setState({ isBtnConfirmInsert: true })
                            document.getElementById('errorhargaterendah').style.display = 'block'
                            await this.setState({ empty_insert_price: true, errormessageinsertterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_insert_price: false })
                        } else {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_insert_price: false, errormessageinsertterendah: '' })
                            if (Number(a) < Number(hargatertinggi)) {
                                document.getElementById('errorharga').style.display = 'none'
                                await this.setState({ empty_insert_price: true, errormessageinsert: '', flag_status_insert_price: true })
                                if (Number(hargatertinggi) >= Number(a)) {
                                    await this.setState({ flag_status_insert_price_tertinggi: true })
                                }
                            }
                        }
                    }
                }
                // if (Number(x) > Number(this.state.insert_price)) {
                //     this.setState({isBtnConfirmInsert: true})
                //     document.getElementById('errorhargaterendah').style.display='block'
                //     this.setState({empty_insert_price: true, errormessageinsertterendah:'Harga terendah harus lebih rendah dari harga tertinggi'})
                // } else {
                //     document.getElementById('errorhargaterendah').style.display='none'
                //     this.setState({empty_insert_price: false, errormessageinsertterendah:''})
                //     if (Number(x) < Number(this.state.insert_price)) {
                //         document.getElementById('errorharga').style.display='none'
                //         this.setState({empty_insert_price: true, errormessageinsert:''})
                //     }
                // handle button
                //     if ((this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
                //         (this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && Number(this.state.insert_minimum_pembelian) % Number(this.state.berat_barang_registered_insert) === 0) &&
                //         (this.state.insert_price !== '' && this.state.insert_price !== '0') && (Number(x) < Number(this.state.insert_price)) &&
                //         this.state.insert_deskripsi !== '' && this.state.insert_foto !== '') {
                //         this.setState({isBtnConfirmInsert: false})
                //     }

                if ((this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
                    (this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && Number(this.state.insert_minimum_pembelian) % Number(this.state.berat_barang_registered_insert) === 0) &&
                    (this.state.insert_price !== '' && this.state.insert_price !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                    this.state.insert_deskripsi !== '' && this.state.insert_foto !== '' && this.state.insert_kode_barang_distributor !== '') {
                    this.setState({ isBtnConfirmInsert: false })
                }
            }
        }
    }

    check_deskripsi = (x) => {
        if (x === '') {
            this.setState({ empty_detailed_deskripsi: true, feedback_detailed_deskripsi: 'Kolom ini wajib diisi', isBtnConfirmUpdate: true })
        } else if (x !== '') {
            this.setState({ empty_detailed_deskripsi: false, feedback_detailed_deskripsi: '' })

            if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
                (this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
                ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
                Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                this.state.detailed_nominal_persen_nego_pertama !== '' &&
                this.state.detailed_nominal_persen_nego_kedua !== '' &&
                this.state.detailed_nominal_persen_nego_ketiga !== '' &&
                this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
                this.setState({ isBtnConfirmUpdate: false })
            }
        }
    }

    check_kode_barang_distributor = (x) => {
        if (x === '') {
            this.setState({ empty_detailed_kode_barang_distributor: true, feedback_detailed_kode_barang_distributor: 'Kolom ini wajib diisi', isBtnConfirmUpdate: true })
        } else if (x !== '') {
            this.setState({ empty_detailed_kode_barang_distributor: false, feedback_detailed_kode_barang_distributor: '' })
            if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
                ((this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0)) &&
                ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
                Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                this.state.detailed_nominal_persen_nego_pertama !== '' &&
                this.state.detailed_nominal_persen_nego_kedua !== '' &&
                this.state.detailed_nominal_persen_nego_ketiga !== '') {
                this.setState({ isBtnConfirmUpdate: false })
            }
        }
    }

    check_minimum_nego = (x) => {
        if (x === '') {
            this.setState({ empty_detailed_minimum_nego: true, feedback_detailed_minimum_nego: 'Kolom ini wajib diisi', isBtnConfirmUpdate: true })
        } else if (x !== '') {
            if (x === '0') {
                this.setState({ empty_detailed_minimum_nego: true, feedback_detailed_minimum_nego: 'Jumlah minimum nego harus lebih dari 0', isBtnConfirmUpdate: true })
            } else if (Number(x) % Number(this.state.detailed_berat) === 0) {
                this.setState({ empty_detailed_minimum_nego: false, feedback_detailed_minimum_nego: '' })
                if ((this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
                    ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                    ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                    ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                    ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                    this.state.detailed_deskripsi !== '' &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' &&
                    this.state.detailed_nominal_persen_nego_kedua !== '' &&
                    this.state.detailed_nominal_persen_nego_ketiga !== '' &&
                    this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
                    this.setState({ isBtnConfirmUpdate: false })
                }
            } else {
                this.setState({ empty_detailed_minimum_nego: true, feedback_detailed_minimum_nego: 'Jumlah minimum nego harus kelipatan dari berat barang', isBtnConfirmUpdate: true })
            }
        }
    }

    check_minimum_pembelian = (x) => {
        if (x === '') {
            this.setState({ empty_detailed_minimum_pembelian: true, feedback_detailed_minimum_pembelian: 'Kolom ini wajib diisi', isBtnConfirmUpdate: true })
        } else if (x !== '') {
            if (x === '0') {
                this.setState({ empty_detailed_minimum_pembelian: true, feedback_detailed_minimum_pembelian: 'Jumlah minimum pembelian harus lebih dari 0', isBtnConfirmUpdate: true })
            } else if (Number(x) % Number(this.state.detailed_berat) === 0) {
                this.setState({ empty_detailed_minimum_pembelian: false, feedback_detailed_minimum_pembelian: '' })
                if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
                    ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                    ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                    ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                    ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                    this.state.detailed_deskripsi !== '' &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' &&
                    this.state.detailed_nominal_persen_nego_kedua !== '' &&
                    this.state.detailed_nominal_persen_nego_ketiga !== '' &&
                    this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
                    this.setState({ isBtnConfirmUpdate: false })
                }
            } else {
                this.setState({ empty_detailed_minimum_pembelian: true, feedback_detailed_minimum_pembelian: 'Jumlah minimum pembelian harus kelipatan dari berat barang', isBtnConfirmUpdate: true })
            }
        }
    }

    check_persen_nego_pertama = (x) => {
        if (x === '') {
            this.setState({
                empty_detailed_nominal_persen_nego_pertama: true,
                feedback_detailed_nominal_persen_nego_pertama: 'Kolom ini wajib diisi', isBtnConfirmUpdate: true
            })
        } else if (x !== '') {
            this.setState({
                empty_detailed_nominal_persen_nego_pertama: false,
                feedback_detailed_nominal_persen_nego_pertama: '',
                isBtnConfirmUpdate: false
            })
            if (Number(x) <= 100) {
                if (Number(x) < Number(this.state.detailed_nominal_persen_nego_kedua)) {
                    this.setState({
                        empty_detailed_nominal_persen_nego_pertama: true,
                        feedback_detailed_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2', isBtnConfirmUpdate: true
                    })
                    if (Number(x) < Number(this.state.detailed_nominal_persen_nego_ketiga)) {
                        this.setState({
                            empty_detailed_nominal_persen_nego_pertama: true,
                            feedback_detailed_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2 dan 3', isBtnConfirmUpdate: true
                        })
                    } else {
                        this.setState({
                            empty_detailed_nominal_persen_nego_pertama: true,
                            feedback_detailed_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2', isBtnConfirmUpdate: true
                        })
                    }
                }
                if (Number(x) < Number(this.state.detailed_nominal_persen_nego_ketiga)) {
                    this.setState({
                        empty_detailed_nominal_persen_nego_pertama: true,
                        feedback_detailed_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 3', isBtnConfirmUpdate: true
                    })
                    if (Number(x) < Number(this.state.detailed_nominal_persen_nego_kedua)) {
                        this.setState({
                            empty_detailed_nominal_persen_nego_pertama: true,
                            feedback_detailed_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2 dan 3', isBtnConfirmUpdate: true
                        })
                    } else {
                        this.setState({
                            empty_detailed_nominal_persen_nego_pertama: true,
                            feedback_detailed_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 3', isBtnConfirmUpdate: true
                        })
                    }
                }
                if ((Number(x) >= Number(this.state.detailed_nominal_persen_nego_kedua)) &&
                    (Number(x) >= Number(this.state.detailed_nominal_persen_nego_ketiga)) && Number(x) <= 100 &&
                    (Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga)) &&
                    this.state.detailed_nominal_persen_nego_kedua !== '' && this.state.detailed_nominal_persen_nego_ketiga !== '') {
                    this.setState({
                        empty_detailed_nominal_persen_nego_pertama: false,
                        feedback_detailed_nominal_persen_nego_pertama: '',
                        empty_detailed_nominal_persen_nego_kedua: false,
                        feedback_detailed_nominal_persen_nego_kedua: '',
                        empty_detailed_nominal_persen_nego_ketiga: false,
                        feedback_detailed_nominal_persen_nego_ketiga: ''
                    })
                }
            } else {
                this.setState({
                    empty_detailed_nominal_persen_nego_pertama: true,
                    feedback_detailed_nominal_persen_nego_pertama: 'Nominal persen nego 1 maksimal bernilai 100%', isBtnConfirmUpdate: true
                })
            }
            // handle button
            if ((this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
                ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0)) &&
                ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                this.state.detailed_deskripsi !== '' &&
                (this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null)) {
                if ((Number(x) >= Number(this.state.detailed_nominal_persen_nego_kedua) && Number(x) <= 100) &&
                    (Number(x) >= Number(this.state.detailed_nominal_persen_nego_ketiga)) &&
                    this.state.detailed_nominal_persen_nego_kedua !== '' && this.state.detailed_nominal_persen_nego_ketiga !== '') {
                    this.setState({ isBtnConfirmUpdate: false })
                } else {
                    this.setState({ isBtnConfirmUpdate: true })
                }
            }
        }
    }

    check_persen_nego_kedua = (x) => {
        if (x === '') {
            this.setState({
                empty_detailed_nominal_persen_nego_kedua: true,
                feedback_detailed_nominal_persen_nego_kedua: 'Kolom ini wajib diisi', isBtnConfirmUpdate: true
            })
        } else if (x !== '') {
            this.setState({
                empty_detailed_nominal_persen_nego_kedua: false,
                feedback_detailed_nominal_persen_nego_kedua: '', isBtnConfirmUpdate: false
            })
            if (Number(x) <= 100) {
                if (Number(x) < Number(this.state.detailed_nominal_persen_nego_ketiga)) {
                    this.setState({
                        empty_detailed_nominal_persen_nego_kedua: true,
                        feedback_detailed_nominal_persen_nego_kedua: 'Nominal persen nego 2 harus lebih tinggi dari nominal persen nego 3', isBtnConfirmUpdate: true
                    })
                    if (Number(x) > Number(this.state.detailed_nominal_persen_nego_pertama) && Number(this.state.detailed_nominal_persen_nego_pertama) <= 100) {
                        this.setState({
                            empty_detailed_nominal_persen_nego_kedua: true,
                            feedback_detailed_nominal_persen_nego_kedua: 'Nominal persen nego 2 harus lebih rendah dari nominal persen nego 1', isBtnConfirmUpdate: true
                        })
                    }
                }
                if (Number(x) > Number(this.state.detailed_nominal_persen_nego_pertama)) {
                    this.setState({
                        empty_detailed_nominal_persen_nego_kedua: true,
                        feedback_detailed_nominal_persen_nego_kedua: 'Nominal persen nego 2 harus lebih rendah dari nominal persen nego 1', isBtnConfirmUpdate: true
                    })
                }
                if ((Number(x) <= Number(this.state.detailed_nominal_persen_nego_pertama)) &&
                    (Number(x) >= Number(this.state.detailed_nominal_persen_nego_ketiga)) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' && this.state.detailed_nominal_persen_nego_ketiga !== '') {
                    this.setState({
                        empty_detailed_nominal_persen_nego_kedua: false,
                        feedback_detailed_nominal_persen_nego_kedua: '',
                        empty_detailed_nominal_persen_nego_pertama: false,
                        feedback_detailed_nominal_persen_nego_pertama: '',
                        empty_detailed_nominal_persen_nego_ketiga: false,
                        feedback_detailed_nominal_persen_nego_ketiga: ''
                    })
                }
            } else {
                this.setState({
                    empty_detailed_nominal_persen_nego_kedua: true,
                    feedback_detailed_nominal_persen_nego_kedua: 'Nominal persen nego 2 maksimal bernilai 100%', isBtnConfirmUpdate: true
                })
            }
            // handle button
            if ((this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
                (this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
                ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                this.state.detailed_deskripsi !== '' &&
                (this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null)) {
                if ((Number(x) <= Number(this.state.detailed_nominal_persen_nego_pertama)) &&
                    (Number(x) >= Number(this.state.detailed_nominal_persen_nego_ketiga)) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' && this.state.detailed_nominal_persen_nego_ketiga !== '') {
                    this.setState({ isBtnConfirmUpdate: false })
                } else {
                    this.setState({ isBtnConfirmUpdate: true })
                }
            }
        }
    }

    check_persen_nego_ketiga = (x) => {
        if (x === '') {
            this.setState({
                empty_detailed_nominal_persen_nego_ketiga: true,
                feedback_detailed_nominal_persen_nego_ketiga: 'Kolom ini wajib diisi', isBtnConfirmUpdate: true
            })
        } else if (x !== '') {
            this.setState({
                empty_detailed_nominal_persen_nego_ketiga: false,
                feedback_detailed_nominal_persen_nego_ketiga: '', isBtnConfirmUpdate: false
            })
            if (Number(x) <= 100) {
                if (Number(x) > Number(this.state.detailed_nominal_persen_nego_pertama)) {
                    this.setState({
                        empty_detailed_nominal_persen_nego_ketiga: true,
                        feedback_detailed_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 1', isBtnConfirmUpdate: true
                    })
                    if (Number(x) > Number(this.state.detailed_nominal_persen_nego_kedua)) {
                        this.setState({
                            empty_detailed_nominal_persen_nego_ketiga: true,
                            feedback_detailed_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 1 dan 2', isBtnConfirmUpdate: true
                        })
                    }
                }
                if (Number(x) > Number(this.state.detailed_nominal_persen_nego_kedua)) {
                    this.setState({
                        empty_detailed_nominal_persen_nego_ketiga: true,
                        feedback_detailed_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 2', isBtnConfirmUpdate: true
                    })
                    if (Number(x) > Number(this.state.detailed_nominal_persen_nego_pertama)) {
                        this.setState({
                            empty_detailed_nominal_persen_nego_ketiga: true,
                            feedback_detailed_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 1 dan 2', isBtnConfirmUpdate: true
                        })
                    }
                }
                if ((Number(x) <= Number(this.state.detailed_nominal_persen_nego_pertama)) &&
                    (Number(x) <= Number(this.state.detailed_nominal_persen_nego_kedua)) &&
                    Number(this.state.detailed_nominal_persen_nego_kedua) <= Number(this.state.detailed_nominal_persen_nego_pertama) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' && this.state.detailed_nominal_persen_nego_kedua !== '') {
                    this.setState({
                        empty_detailed_nominal_persen_nego_ketiga: false,
                        feedback_detailed_nominal_persen_nego_ketiga: '',
                        empty_detailed_nominal_persen_nego_pertama: false,
                        feedback_detailed_nominal_persen_nego_pertama: '',
                        empty_detailed_nominal_persen_nego_kedua: false,
                        feedback_detailed_nominal_persen_nego_kedua: ''
                    })
                }
            } else {
                this.setState({
                    empty_detailed_nominal_persen_nego_ketiga: true,
                    feedback_detailed_nominal_persen_nego_ketiga: 'Nominal persen nego 3 maksimal bernilai 100%', isBtnConfirmUpdate: true
                })
            }
            // handle button
            if ((this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
                (this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
                ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
                this.state.detailed_deskripsi !== '' &&
                (this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null)) {
                if ((Number(x) <= Number(this.state.detailed_nominal_persen_nego_pertama) &&
                    (Number(x) <= Number(this.state.detailed_nominal_persen_nego_kedua)) &&
                    Number(this.state.detailed_nominal_persen_nego_kedua) <= Number(this.state.detailed_nominal_persen_nego_pertama) &&
                    Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
                    this.state.detailed_nominal_persen_nego_pertama !== '' && this.state.detailed_nominal_persen_nego_kedua !== '')) {
                    this.setState({ isBtnConfirmUpdate: false })
                } else {
                    this.setState({ isBtnConfirmUpdate: true })
                }
            }
        }
    }

    check_insert_persen_nego_pertama = (x) => {
        if (x === '') {
            this.setState({
                empty_insert_nominal_persen_nego_pertama: true,
                feedback_insert_nominal_persen_nego_pertama: 'Kolom ini wajib diisi', isbtnConfirmInsertKedua: true,
                empty_insert_nominal_persen_nego_kedua: false, feedback_insert_nominal_persen_nego_kedua: '',
                empty_insert_nominal_persen_nego_ketiga: false, feedback_insert_nominal_persen_nego_ketiga: '',
                disable_insert_persen_nego_kedua: true, insert_nominal_persen_nego_kedua: '',
                disable_insert_persen_nego_ketiga: true, insert_nominal_persen_nego_ketiga: ''
            })
        } else if (x !== '') {
            this.setState({
                empty_insert_nominal_persen_nego_pertama: false,
                feedback_insert_nominal_persen_nego_pertama: '',
                disable_insert_persen_nego_kedua: false,
                empty_insert_nominal_persen_nego_kedua: false, feedback_insert_nominal_persen_nego_kedua: ''
            })
            if (Number(x) <= 100) {
                if (Number(x) < Number(this.state.insert_nominal_persen_nego_kedua)) {
                    this.setState({
                        empty_insert_nominal_persen_nego_pertama: true,
                        feedback_insert_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2', isbtnConfirmInsertKedua: true
                    })
                    if (Number(x) < Number(this.state.insert_nominal_persen_nego_ketiga)) {
                        this.setState({
                            empty_insert_nominal_persen_nego_pertama: true,
                            feedback_insert_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2 dan 3', isbtnConfirmInsertKedua: true
                        })
                    } else {
                        this.setState({
                            empty_insert_nominal_persen_nego_pertama: true,
                            feedback_insert_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2', isbtnConfirmInsertKedua: true
                        })
                    }
                }
                if (Number(x) < Number(this.state.insert_nominal_persen_nego_ketiga)) {
                    this.setState({
                        empty_insert_nominal_persen_nego_pertama: true,
                        feedback_insert_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 3', isbtnConfirmInsertKedua: true
                    })
                    if (Number(x) < Number(this.state.insert_nominal_persen_nego_kedua)) {
                        this.setState({
                            empty_insert_nominal_persen_nego_pertama: true,
                            feedback_insert_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2 dan 3', isbtnConfirmInsertKedua: true
                        })
                    } else {
                        this.setState({
                            empty_insert_nominal_persen_nego_pertama: true,
                            feedback_insert_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 3', isbtnConfirmInsertKedua: true
                        })
                    }
                }
                if ((Number(x) >= Number(this.state.insert_nominal_persen_nego_kedua)) &&
                    (Number(x) >= Number(this.state.insert_nominal_persen_nego_ketiga)) &&
                    (Number(this.state.insert_nominal_persen_nego_kedua) >= Number(this.state.insert_nominal_persen_nego_ketiga)) &&
                    Number(x) <= 100 && this.state.insert_nominal_persen_nego_kedua !== '' && this.state.insert_nominal_persen_nego_ketiga !== '') {
                    this.setState({
                        empty_insert_nominal_persen_nego_pertama: false,
                        feedback_insert_nominal_persen_nego_pertama: '',
                        empty_insert_nominal_persen_nego_kedua: false,
                        feedback_insert_nominal_persen_nego_kedua: '',
                        empty_insert_nominal_persen_nego_ketiga: false,
                        feedback_insert_nominal_persen_nego_ketiga: '',
                        isbtnConfirmInsertKedua: false
                    })
                }
            } else {
                this.setState({
                    empty_insert_nominal_persen_nego_pertama: true,
                    feedback_insert_nominal_persen_nego_pertama: 'Nominal persen nego 1 maksimal bernilai 100%', isbtnConfirmInsertKedua: true
                })
            }
            // handle button
            if (Number(x) >= Number(this.state.insert_nominal_persen_nego_kedua) &&
                Number(x) >= Number(this.state.insert_nominal_persen_nego_ketiga) &&
                Number(this.state.insert_nominal_persen_nego_kedua) >= Number(this.state.insert_nominal_persen_nego_ketiga) &&
                this.state.insert_nominal_persen_nego_kedua !== '' && this.state.insert_nominal_persen_nego_ketiga !== '') {
                this.setState({ isbtnConfirmInsertKedua: false })
            }
        }
    }

    check_insert_persen_nego_kedua = (x) => {
        if (x === '') {
            this.setState({
                empty_insert_nominal_persen_nego_kedua: true,
                feedback_insert_nominal_persen_nego_kedua: 'Kolom ini wajib diisi', isbtnConfirmInsertKedua: true,
                disable_insert_persen_nego_ketiga: true, empty_insert_nominal_persen_nego_ketiga: false,
                feedback_insert_nominal_persen_nego_ketiga: '', insert_nominal_persen_nego_ketiga: ''
            })
        } else if (x !== '') {
            this.setState({
                empty_insert_nominal_persen_nego_kedua: false,
                feedback_insert_nominal_persen_nego_kedua: '',
                disable_insert_persen_nego_ketiga: false,
                empty_insert_nominal_persen_nego_ketiga: false, feedback_insert_nominal_persen_nego_ketiga: ''
            })
            if (Number(x) <= 100) {
                if (Number(x) < Number(this.state.insert_nominal_persen_nego_ketiga)) {
                    this.setState({
                        empty_insert_nominal_persen_nego_kedua: true,
                        feedback_insert_nominal_persen_nego_kedua: 'Nominal persen nego 2 harus lebih tinggi dari nominal persen nego 3', isbtnConfirmInsertKedua: true
                    })
                    if (Number(x) > Number(this.state.insert_nominal_persen_nego_pertama) && Number(this.state.insert_nominal_persen_nego_pertama) <= 100) {
                        this.setState({
                            empty_insert_nominal_persen_nego_kedua: true,
                            feedback_insert_nominal_persen_nego_kedua: 'Nominal persen nego 2 harus lebih rendah dari nominal persen nego 1', isbtnConfirmInsertKedua: true
                        })
                    }
                }
                if (Number(x) > Number(this.state.insert_nominal_persen_nego_pertama)) {
                    this.setState({
                        empty_insert_nominal_persen_nego_kedua: true,
                        feedback_insert_nominal_persen_nego_kedua: 'Nominal persen nego 2 harus lebih rendah dari nominal persen nego 1', isbtnConfirmInsertKedua: true
                    })
                }
                if ((Number(x) <= Number(this.state.insert_nominal_persen_nego_pertama)) &&
                    (Number(x) >= Number(this.state.insert_nominal_persen_nego_ketiga)) &&
                    Number(this.state.insert_nominal_persen_nego_pertama) <= 100 &&
                    this.state.insert_nominal_persen_nego_pertama !== '' && this.state.insert_nominal_persen_nego_ketiga !== '') {
                    this.setState({
                        empty_insert_nominal_persen_nego_kedua: false,
                        feedback_insert_nominal_persen_nego_kedua: '',
                        empty_insert_nominal_persen_nego_pertama: false,
                        feedback_insert_nominal_persen_nego_pertama: '',
                        empty_insert_nominal_persen_nego_ketiga: false,
                        feedback_insert_nominal_persen_nego_ketiga: '',
                        isbtnConfirmInsertKedua: false
                    })
                }
            } else {
                this.setState({
                    empty_insert_nominal_persen_nego_kedua: true,
                    feedback_insert_nominal_persen_nego_kedua: 'Nominal persen nego 2 maksimal bernilai 100%', isbtnConfirmInsertKedua: true
                })
            }
            // handle button
            if (Number(x) <= Number(this.state.insert_nominal_persen_nego_pertama) &&
                Number(x) >= Number(this.state.insert_nominal_persen_nego_ketiga) &&
                Number(this.state.insert_nominal_persen_nego_pertama) >= Number(this.state.insert_nominal_persen_nego_ketiga) &&
                this.state.insert_nominal_persen_nego_ketiga !== '') {
                this.setState({ isbtnConfirmInsertKedua: false })
            }
        }
    }

    check_insert_persen_nego_ketiga = (x) => {
        if (x === '') {
            this.setState({
                empty_insert_nominal_persen_nego_ketiga: true,
                feedback_insert_nominal_persen_nego_ketiga: 'Kolom ini wajib diisi', isbtnConfirmInsertKedua: true
            })
        } else if (x !== '') {
            this.setState({
                empty_insert_nominal_persen_nego_ketiga: false,
                feedback_insert_nominal_persen_nego_ketiga: ''
            })
            if (Number(x) <= 100) {
                if (Number(x) > Number(this.state.insert_nominal_persen_nego_pertama)) {
                    this.setState({
                        empty_insert_nominal_persen_nego_ketiga: true,
                        feedback_insert_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 1', isbtnConfirmInsertKedua: true
                    })
                    if (Number(x) > Number(this.state.insert_nominal_persen_nego_kedua)) {
                        this.setState({
                            empty_insert_nominal_persen_nego_ketiga: true,
                            feedback_insert_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 1 dan 2', isbtnConfirmInsertKedua: true
                        })
                    }
                }
                if (Number(x) > Number(this.state.insert_nominal_persen_nego_kedua)) {
                    this.setState({
                        empty_insert_nominal_persen_nego_ketiga: true,
                        feedback_insert_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 2', isbtnConfirmInsertKedua: true
                    })
                    if (Number(x) > Number(this.state.insert_nominal_persen_nego_pertama)) {
                        this.setState({
                            empty_insert_nominal_persen_nego_ketiga: true,
                            feedback_insert_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 1 dan 2', isbtnConfirmInsertKedua: true
                        })
                    }
                }
                if ((Number(x) <= Number(this.state.insert_nominal_persen_nego_pertama)) &&
                    (Number(x) <= Number(this.state.insert_nominal_persen_nego_kedua)) &&
                    Number(this.state.insert_nominal_persen_nego_kedua) <= Number(this.state.insert_nominal_persen_nego_pertama) &&
                    Number(this.state.insert_nominal_persen_nego_pertama) <= 100 &&
                    this.state.insert_nominal_persen_nego_pertama !== '' && this.state.insert_nominal_persen_nego_kedua !== '') {
                    this.setState({
                        empty_insert_nominal_persen_nego_ketiga: false,
                        feedback_insert_nominal_persen_nego_ketiga: '',
                        empty_insert_nominal_persen_nego_pertama: false,
                        feedback_insert_nominal_persen_nego_pertama: '',
                        empty_insert_nominal_persen_nego_kedua: false,
                        feedback_insert_nominal_persen_nego_kedua: '',
                        isbtnConfirmInsertKedua: false
                    })
                }
            } else {
                this.setState({
                    empty_insert_nominal_persen_nego_ketiga: true,
                    feedback_insert_nominal_persen_nego_ketiga: 'Nominal persen nego 3 maksimal bernilai 100%', isbtnConfirmInsertKedua: true
                })
            }
            // handle button
            if (Number(x) <= Number(this.state.insert_nominal_persen_nego_pertama) &&
                Number(x) <= Number(this.state.insert_nominal_persen_nego_kedua) &&
                Number(this.state.insert_nominal_persen_nego_pertama) >= Number(this.state.insert_nominal_persen_nego_kedua)) {
                this.setState({ isbtnConfirmInsertKedua: false })
            }
        }
    }


    check_deskripsi_insert = (x) => {
        if (x === '') {
            this.setState({ empty_insert_deskripsi: true, feedback_insert_deskripsi: 'Kolom ini wajib diisi', isBtnConfirmInsert: true })
        } else if (x !== '') {
            this.setState({ empty_insert_deskripsi: false, feedback_insert_deskripsi: '' })
            if ((this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && Number(this.state.insert_minimum_pembelian) % Number(this.state.berat_barang_registered_insert) === 0) &&
                (this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
                (this.state.insert_price !== '' && this.state.insert_price !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                (this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                this.state.insert_foto !== '' && this.state.insert_kode_barang_distributor !== '') {
                this.setState({ isBtnConfirmInsert: false })
            }
        }
    }

    check_kode_barang_distributor_insert = (x) => {
        if (x === '') {
            this.setState({ empty_insert_kode_barang_distributor: true, feedback_insert_kode_barang_distributor: 'Kolom ini wajib diisi', isBtnConfirmInsert: true })
        } else if (x !== '') {
            this.setState({ empty_insert_kode_barang_distributor: false, feedback_insert_kode_barang_distributor: '' })
            if ((this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && Number(this.state.insert_minimum_pembelian) % Number(this.state.berat_barang_registered_insert) === 0) &&
                (this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
                (this.state.insert_price !== '' && this.state.insert_price !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                (this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                this.state.insert_foto !== '') {
                this.setState({ isBtnConfirmInsert: false })
            }
        }
    }

    check_field_minimum_pembelian = (x) => {
        if (x === '') {
            this.setState({ empty_insert_minimum_pembelian: true, feedback_insert_minimum_pembelian: 'Kolom ini wajib diisi', isBtnConfirmInsert: true })
        } else if (x !== '') {
            if (this.state.berat_barang_registered_insert === '') {
                this.setState({ empty_insert_minimum_pembelian: true, feedback_insert_minimum_pembelian: 'Mohon pilih barang terlebih dahulu', isBtnConfirmInsert: true })
            } else {
                if (x === '0') {
                    this.setState({ empty_insert_minimum_pembelian: true, feedback_insert_minimum_pembelian: 'Jumlah minimum pembelian harus lebih dari 0', isBtnConfirmInsert: true })
                } else if (Number(x) % Number(this.state.berat_barang_registered_insert) === 0) {
                    this.setState({ empty_insert_minimum_pembelian: false, feedback_insert_minimum_pembelian: '' })
                    // if ((this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
                    //     (this.state.insert_price !== '' && this.state.insert_price !== '0') &&
                    //     (this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0') &&
                    //     (Number(this.state.insert_price_terendah) < Number(this.state.insert_price)) &&
                    //     (Number(this.state.insert_price) > Number(this.state.insert_price_terendah)) &&
                    //     this.state.insert_deskripsi !== '' && this.state.insert_foto !== '') {
                    //         this.setState({isBtnConfirmInsert: false})
                    // }
                    if ((this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
                        (this.state.insert_price !== '' && this.state.insert_price !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                        (this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                        this.state.insert_deskripsi !== '' && this.state.insert_foto !== '' && this.state.insert_kode_barang_distributor !== '') {
                        this.setState({ isBtnConfirmInsert: false })
                    }
                } else {
                    this.setState({ empty_insert_minimum_pembelian: true, feedback_insert_minimum_pembelian: 'Jumlah minimum pembelian harus kelipatan dari berat barang', isBtnConfirmInsert: true })
                }
            }
        }
    }

    check_field_minimum_nego = (x) => {
        if (x === '') {
            this.setState({ empty_insert_minimum_nego: true, feedback_insert_minimum_nego: 'Kolom ini wajib diisi', isBtnConfirmInsert: true })
        } else if (x !== '') {
            if (this.state.berat_barang_registered_insert === '') {
                this.setState({ empty_insert_minimum_nego: true, feedback_insert_minimum_nego: 'Mohon pilih barang terlebih dahulu', isBtnConfirmInsert: true })
            } else {
                if (x === '0') {
                    this.setState({ empty_insert_minimum_nego: true, feedback_insert_minimum_nego: 'Jumlah minimum nego harus lebih dari 0', isBtnConfirmInsert: true })
                } else if (Number(x) % Number(this.state.berat_barang_registered_insert) === 0) {
                    this.setState({ empty_insert_minimum_nego: false, feedback_insert_minimum_nego: '' })
                    // if ((this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && this.state.insert_minimum_pembelian % this.state.berat_barang_registered_insert === 0) &&
                    //     (this.state.insert_price !== '' && this.state.insert_price !== '0') &&
                    //     (this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0') &&
                    //     (Number(this.state.insert_price_terendah) < Number(this.state.insert_price)) &&
                    //     (Number(this.state.insert_price) > Number(this.state.insert_price_terendah)) &&
                    //     this.state.insert_deskripsi !== '' && this.state.insert_foto !== '') {
                    //         this.setState({isBtnConfirmInsert: false})
                    // }
                    if ((this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && this.state.insert_minimum_pembelian % this.state.berat_barang_registered_insert === 0) &&
                        (this.state.insert_price !== '' && this.state.insert_price !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                        (this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
                        this.state.insert_deskripsi !== '' && this.state.insert_foto !== '' && this.state.insert_kode_barang_distributor !== '') {
                        this.setState({ isBtnConfirmInsert: false })
                    }
                } else {
                    this.setState({ empty_insert_minimum_nego: true, feedback_insert_minimum_nego: 'Jumlah minimum nego harus kelipatan dari berat barang', isBtnConfirmInsert: true })
                }
            }
        }
    }

    check_field_nama_barang_inserted = (e) => {
        if (e === '') {
            this.setState({ empty_nama_barang_inserted: true, feedback_insert_master_nama_barang: 'Kolom ini wajib diisi', isBtnConfirmInsertMaster: true })
        } else {
            this.setState({ empty_nama_barang_inserted: false, feedback_insert_master_nama_barang: '' })
            if (this.state.id_category_barang_inserted !== '0' &&
                this.state.id_satuan_barang_inserted !== '0' &&
                (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
                (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
                (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
                (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
                (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted !== '' &&
                this.state.insert_foto_master !== '' && this.state.insert_master_kode_barang_distributor !== '') {
                this.setState({ isBtnConfirmInsertMaster: false })
            }
        }
    }

    check_field_harga_insert_master = async (e) => {
        if (e === '') {
            this.setState({ isBtnConfirmInsertMaster: true })
            document.getElementById('errorharga').style.display = 'block'
            this.setState({ empty_insert_price_master_barang: true, errormessageinsert: 'Kolom harga tertinggi wajib diisi', flag_status_insert_master_price_tertinggi: false })
        } else if (e !== '') {
            if (e === '0') {
                this.setState({ isBtnConfirmInsertMaster: true })
                document.getElementById('errorharga').style.display = 'block'
                this.setState({ empty_insert_price_master_barang: true, errormessageinsert: 'Harga tertinggi tidak boleh bernilai 0', flag_status_insert_master_price_tertinggi: false })
            } else {
                let temp = e.split(',').join('')
                if (this.state.default_currency_master_barang_terendah === 'IDR') { // harga_terendah IDR
                    let a = this.state.insert_price_master_barang_terendah.split('.').join('')
                    let b = Math.round(a.split(',').join('.'))
                    // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                    let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
                    if (this.state.default_currency_master_barang === 'IDR') { // harga_tertinggi IDR
                        let c = e.split('.').join('')
                        let d = Math.round(c.split(',').join('.'))
                        // let hargatertinggi = Math.ceil(d / this.state.kurs_now_manual)
                        let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                        if (Number(hargatertinggi) < Number(hargaterendah)) {
                            this.setState({ isBtnConfirmInsertMaster: true })
                            document.getElementById('errorharga').style.display = 'block'
                            await this.setState({ empty_insert_price_master_barang: true, errormessageinsert: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_insert_master_price_tertinggi: false })
                        } else {
                            document.getElementById('errorharga').style.display = 'none'
                            this.setState({ empty_insert_price_master_barang: false, errormessageinsert: '' })
                            if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                document.getElementById('errorhargaterendah').style.display = 'none'
                                await this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: '', flag_status_insert_master_price_tertinggi: true })
                                if (Number(hargaterendah) <= Number(hargatertinggi)) {
                                    await this.setState({ flag_status_insert_master_price: true })
                                }
                            }
                        }
                    } else {  // harga_tertinggi USD
                        if (Number(temp) < Number(hargaterendah)) {
                            await this.setState({ isBtnConfirmInsertMaster: true })
                            document.getElementById('errorharga').style.display = 'block'
                            await this.setState({ empty_insert_price_master_barang: true, errormessageinsert: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_insert_master_price_tertinggi: false })
                        } else {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_insert_price_master_barang: false, errormessageinsert: '' })
                            if (Number(temp) >= Number(hargaterendah)) {
                                document.getElementById('errorhargaterendah').style.display = 'none'
                                await this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: '', flag_status_insert_master_price_tertinggi: true })
                                if (Number(hargaterendah) <= Number(temp)) {
                                    await this.setState({ flag_status_insert_master_price: true })
                                }
                            }
                        }
                    }
                } else { // harga_terendah USD
                    let temp = e.split(',').join('')
                    if (this.state.default_currency_master_barang === 'IDR') {  // harga_tertinggi IDR
                        let a = e.split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        // let hargatertinggi = Math.ceil(b / this.state.kurs_now_manual)
                        let hargatertinggi = (b / this.state.kurs_now_manual).toFixed(2)
                        let hargaterendah = this.state.insert_price_master_barang_terendah.split(',').join('')
                        if (Number(hargatertinggi) < Number(hargaterendah)) {
                            await this.setState({ isBtnConfirmInsertMaster: true })
                            document.getElementById('errorharga').style.display = 'block'
                            await this.setState({ empty_insert_price_master_barang: true, errormessageinsert: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_insert_master_price_tertinggi: false })
                        } else {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_insert_price_master_barang: false, errormessageinsert: '' })
                            if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                document.getElementById('errorhargaterendah').style.display = 'none'
                                await this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: '', flag_status_insert_master_price_tertinggi: true })
                                if (Number(hargaterendah) <= Number(hargatertinggi)) {
                                    await this.setState({ flag_status_insert_master_price: true })
                                }
                            }
                        }
                    } else {  // harga_tertinggi USD
                        let hargaterendah = this.state.insert_price_master_barang_terendah.split(',').join('')
                        if (Number(temp) < Number(hargaterendah)) {
                            await this.setState({ isBtnConfirmInsertMaster: true })
                            document.getElementById('errorharga').style.display = 'block'
                            await this.setState({ empty_insert_price_master_barang: true, errormessageinsert: 'Harga tertinggi harus lebih tinggi dari harga terendah', flag_status_insert_master_price_tertinggi: false })
                        } else {
                            document.getElementById('errorharga').style.display = 'none'
                            await this.setState({ empty_insert_price_master_barang: false, errormessageinsert: '' })
                            if (Number(temp) >= Number(hargaterendah)) {
                                document.getElementById('errorhargaterendah').style.display = 'none'
                                await this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: '', flag_status_insert_master_price_tertinggi: true })
                                if (Number(hargaterendah) <= Number(temp)) {
                                    await this.setState({ flag_status_insert_master_price: true })
                                }
                            }
                        }
                    }
                }
                // handlebutton
                if (this.state.nama_barang_inserted !== '' &&
                    this.state.id_category_barang_inserted !== '0' &&
                    this.state.id_satuan_barang_inserted !== '0' &&
                    (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
                    (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
                    (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                    this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted &&
                    this.state.insert_foto_master !== '' && this.state.insert_master_kode_barang_distributor !== '') {
                    this.setState({ isBtnConfirmInsertMaster: false })
                }
            }

            // if (Number(e) < Number(this.state.insert_price_master_barang_terendah)) {
            //     this.setState({isBtnConfirmInsertMaster: true})
            //     document.getElementById('errorharga').style.display='block'
            //     this.setState({empty_insert_price_master_barang: true, errormessageinsert:'Harga tertinggi harus lebih tinggi dari harga terendah'})
            // } else {
            //     document.getElementById('errorharga').style.display='none'
            //     this.setState({empty_insert_price_master_barang: false, errormessageinsert:''})
            //     if (Number(e) > Number(this.state.insert_price_master_barang_terendah)) {
            //         document.getElementById('errorhargaterendah').style.display='none'
            //         this.setState({empty_insert_price_master_barang: true, errormessageinsertterendah:''})
            //     }
            //     if (this.state.nama_barang_inserted !== '' &&
            //         this.state.id_category_barang_inserted !== '0' &&
            //         this.state.id_satuan_barang_inserted !== '0' &&
            //         (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
            //         (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
            //         (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0') &&
            //         (Number(e) > this.state.insert_price_master_barang_terendah) &&
            //         (Number(this.state.insert_price_master_barang_terendah) < Number(e)) &&
            //         this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted &&
            //         this.state.insert_foto_master !== '') {
            //             this.setState({isBtnConfirmInsertMaster: false})
            //     }
            // }
        }

    }

    check_field_harga_insert_master_terendah = async (e) => {
        if (e === '') {
            this.setState({ isBtnConfirmInsertMaster: true })
            document.getElementById('errorhargaterendah').style.display = 'block'
            this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: 'Kolom harga terendah wajib diisi', flag_status_insert_master_price: false })
        } else if (e !== '') {
            if (e === '0') {
                this.setState({ isBtnConfirmInsertMaster: true })
                document.getElementById('errorhargaterendah').style.display = 'block'
                this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: 'Harga terendah tidak boleh bernilai 0', flag_status_insert_master_price: false })
            } else {
                if (this.state.default_currency_master_barang_terendah === 'IDR') { // harga_terendah IDR
                    let a = e.split('.').join('')
                    let b = Math.round(a.split(',').join('.'))
                    // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                    let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
                    if (this.state.default_currency_master_barang === 'IDR') { // harga_tertinggi IDR
                        let c = this.state.insert_price_master_barang.split('.').join('')
                        let d = Math.round(c.split(',').join('.'))
                        // let hargatertinggi = Math.ceil(d / this.state.kurs_now_manual)
                        let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                        if (Number(hargaterendah) > Number(hargatertinggi)) {
                            await this.setState({ isBtnConfirmInsertMaster: true })
                            document.getElementById('errorhargaterendah').style.display = 'block'
                            await this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_insert_master_price: false })
                        } else {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_insert_price_master_barang: false, errormessageinsertterendah: '' })
                            if (Number(hargaterendah) < Number(hargatertinggi)) {
                                document.getElementById('errorharga').style.display = 'none'
                                await this.setState({ empty_insert_price_master_barang: true, errormessageinsert: '', flag_status_insert_master_price: true })
                                if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                    await this.setState({ flag_status_insert_master_price_tertinggi: true })
                                }
                            }
                        }
                    } else { // harga_tertinggi USD
                        let hargatertinggi = this.state.insert_price_master_barang.split(',').join('')
                        if (Number(hargaterendah) > Number(hargatertinggi)) {
                            await this.setState({ isBtnConfirmInsertMaster: true })
                            document.getElementById('errorhargaterendah').style.display = 'block'
                            await this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_insert_master_price: false })
                        } else {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_insert_price_master_barang: false, errormessageinsertterendah: '' })
                            if (Number(hargaterendah) < Number(hargatertinggi)) {
                                document.getElementById('errorharga').style.display = 'none'
                                await this.setState({ empty_insert_price_master_barang: true, errormessageinsert: '', flag_status_insert_master_price: true })
                                if (Number(hargatertinggi) >= Number(hargaterendah)) {
                                    await this.setState({ flag_status_insert_master_price_tertinggi: true })
                                }
                            }
                        }
                    }
                } else { // harga_terendah USD
                    let a = e.split(',').join('')
                    if (this.state.default_currency_master_barang === 'IDR') { // harga_tertinggi IDR
                        let c = this.state.insert_price_master_barang.split('.').join('')
                        let d = Math.round(c.split(',').join('.'))
                        // let hargatertinggi = Math.ceil(d / this.state.kurs_now_manual)
                        let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                        if (Number(a) > Number(hargatertinggi)) {
                            this.setState({ isBtnConfirmInsertMaster: true })
                            document.getElementById('errorhargaterendah').style.display = 'block'
                            await this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_insert_master_price: false })
                        } else {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_insert_price_master_barang: false, errormessageinsertterendah: '' })
                            if (Number(a) < Number(hargatertinggi)) {
                                document.getElementById('errorharga').style.display = 'none'
                                await this.setState({ empty_insert_price_master_barang: true, errormessageinsert: '', flag_status_insert_master_price: true })
                                if (Number(hargatertinggi) >= Number(a)) {
                                    await this.setState({ flag_status_insert_master_price_tertinggi: true })
                                }
                            }
                        }
                    } else { // harga_tertinggi USD
                        let hargatertinggi = this.state.insert_price_master_barang.split(',').join('')
                        if (Number(a) > Number(hargatertinggi)) {
                            await this.setState({ isBtnConfirmInsertMaster: true })
                            document.getElementById('errorhargaterendah').style.display = 'block'
                            await this.setState({ empty_insert_price_master_barang: true, errormessageinsertterendah: 'Harga terendah harus lebih rendah dari harga tertinggi', flag_status_insert_master_price: false })
                        } else {
                            document.getElementById('errorhargaterendah').style.display = 'none'
                            await this.setState({ empty_insert_price_master_barang: false, errormessageinsertterendah: '' })
                            if (Number(a) < Number(hargatertinggi)) {
                                document.getElementById('errorharga').style.display = 'none'
                                await this.setState({ empty_insert_price_master_barang: true, errormessageinsert: '', flag_status_insert_master_price: true })
                                if (Number(hargatertinggi) >= Number(a)) {
                                    await this.setState({ flag_status_insert_master_price_tertinggi: true })
                                }
                            }
                        }
                    }
                }
                // handle button
                if (this.state.nama_barang_inserted !== '' &&
                    this.state.id_category_barang_inserted !== '0' &&
                    this.state.id_satuan_barang_inserted !== '0' &&
                    (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
                    (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
                    (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.flag_status_insert_master_price === true && this.flag_status_insert_master_price_tertinggi === true) &&
                    this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted &&
                    this.state.insert_foto_master !== '' && this.state.insert_master_kode_barang_distributor !== '') {
                    this.setState({ isBtnConfirmInsertMaster: false })
                }
            }
        }
        // if (Number(e) > Number(this.state.insert_price_master_barang)) {
        //     this.setState({isBtnConfirmInsertMaster: true})
        //     document.getElementById('errorhargaterendah').style.display='block'
        //     this.setState({empty_insert_price_master_barang: true, errormessageinsertterendah:'Harga terendah harus lebih rendah dari harga tertinggi'})
        // } else {
        //     document.getElementById('errorhargaterendah').style.display='none'
        //     this.setState({empty_insert_price_master_barang: false, errormessageinsertterendah:''})
        //     if (Number(e) < Number(this.state.insert_price_master_barang)) {
        //         document.getElementById('errorharga').style.display='none'
        //         this.setState({empty_insert_price_master_barang: true, errormessageinsert:''})
        //     }
        //     // hati2
        //     if (this.state.nama_barang_inserted !== '' &&
        //         this.state.id_category_barang_inserted !== '0' &&
        //         this.state.id_satuan_barang_inserted !== '0' &&
        //         (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
        //         (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
        //         (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0') &&
        //         (Number(e) < this.state.insert_price_master_barang) &&
        //         (Number(this.state.insert_price_master_barang) > Number(e)) &&
        //         this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted &&
        //         this.state.insert_foto_master !== '') {
        //             this.setState({isBtnConfirmInsertMaster: false})
        //     }
        // }
        // }
    }


    check_field_berat_insert_master = async (e) => {
        if (e === '') {
            this.setState({
                empty_berat_barang_inserted: true,
                disable_insert_master_minimum_nego: true,
                disable_insert_master_minimum_pembelian: true,
                insert_master_minimum_nego: '',
                insert_master_minimum_pembelian: '',
                empty_insert_master_minimum_nego: false,
                feedback_insert_master_minimum_nego: '',
                empty_insert_master_minimum_pembelian: false,
                feedback_insert_master_minimum_pembelian: '',
                feedback_insert_master_berat: 'Kolom ini wajib diisi',
                isBtnConfirmInsertMaster: true
            })
        } else {
            if (e === '0') {
                this.setState({
                    empty_berat_barang_inserted: true,
                    disable_insert_master_minimum_nego: true,
                    disable_insert_master_minimum_pembelian: true,
                    insert_master_minimum_nego: '',
                    insert_minimum_pembelian: '',
                    empty_insert_master_minimum_nego: false,
                    feedback_insert_master_minimum_nego: '',
                    empty_insert_master_minimum_pembelian: false,
                    feedback_insert_master_minimum_pembelian: '',
                    feedback_insert_master_berat: 'Berat barang tidak boleh bernilai 0',
                    isBtnConfirmInsertMaster: true
                })
            } else {
                this.setState({
                    empty_berat_barang_inserted: false,
                    feedback_insert_master_berat: '',
                    disable_insert_master_minimum_nego: false,
                    disable_insert_master_minimum_pembelian: false
                })

                if (this.state.insert_master_minimum_nego.length > 0) {
                    if (Number(this.state.insert_master_minimum_nego) % Number(e) !== 0) {
                        await this.setState({
                            insert_master_minimum_nego: '', isBtnConfirmInsertMaster: true,
                            empty_insert_master_minimum_nego: true, feedback_insert_master_minimum_nego: 'Jumlah minimum nego harus kelipatan dari berat barang'
                        })
                    }
                }

                if (this.state.insert_master_minimum_pembelian.length > 0) {
                    if (Number(this.state.insert_master_minimum_pembelian) % Number(e) !== 0) {
                        await this.setState({
                            insert_master_minimum_pembelian: '', isBtnConfirmInsertMaster: true,
                            empty_insert_master_minimum_pembelian: true, feedback_insert_master_minimum_pembelian: 'Jumlah minimum pembelian harus kelipatan dari berat barang'
                        })
                    }
                }

                // handlebutton
                if (this.state.nama_barang_inserted !== '' &&
                    this.state.id_category_barang_inserted !== '0' &&
                    this.state.id_satuan_barang_inserted !== '0' &&
                    (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(e) === 0) &&
                    (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(e) === 0) &&
                    (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                    (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                    this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted &&
                    this.state.insert_foto_master !== '' && this.state.insert_master_kode_barang_distributor !== '') {
                    this.setState({ isBtnConfirmInsertMaster: false })
                }
            }
        }
    }

    check_field_volume_insert_master = (e) => {
        if (e === '') {
            this.setState({ empty_volume_barang_inserted: true, feedback_insert_master_volume: 'Kolom ini wajib diisi', isBtnConfirmInsertMaster: true })
        } else {
            if (e === '0') {
                this.setState({ empty_volume_barang_inserted: true, feedback_insert_master_volume: 'Volume barang tidak boleh bernilai 0', isBtnConfirmInsertMaster: true })
            } else {
                this.setState({ empty_volume_barang_inserted: false, feedback_insert_master_volume: '' })
                // handle button
                if (this.state.nama_barang_inserted !== '' &&
                    this.state.id_category_barang_inserted !== '0' &&
                    this.state.id_satuan_barang_inserted !== '0' &&
                    (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
                    (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
                    (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % (this.state.berat_barang_inserted) === 0) &&
                    (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                    (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                    this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted &&
                    this.state.insert_foto_master !== '' && this.state.insert_master_kode_barang_distributor !== '') {
                    this.setState({ isBtnConfirmInsertMaster: false })
                }
            }
        }
    }

    check_field_ex_insert_master = (e) => {
        if (e === '') {
            this.setState({ empty_ex_barang_inserted: true, isBtnConfirmInsertMaster: true })
        } else {
            this.setState({ empty_ex_barang_inserted: false })
            // handle button
            if (this.state.nama_barang_inserted !== '' &&
                this.state.id_category_barang_inserted !== '0' &&
                this.state.id_satuan_barang_inserted !== '0' &&
                (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
                (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
                (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
                (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
                (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                this.state.insert_deskripsi_master_barang !== '' && this.state.insert_foto_master !== '' && this.state.insert_master_kode_barang_distributor !== '') {
                this.setState({ isBtnConfirmInsertMaster: false })
            }
        }
    }

    check_field_deskripsi_insert_master = (e) => {
        if (e === '') {
            this.setState({ empty_deskripsi_master_barang: true, isBtnConfirmInsertMaster: true })
        } else {
            this.setState({ empty_deskripsi_master_barang: false })
            // handle button
            if (this.state.nama_barang_inserted !== '' &&
                this.state.id_category_barang_inserted !== '0' &&
                this.state.id_satuan_barang_inserted !== '0' &&
                (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
                (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
                (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
                (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
                (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                this.state.ex_barang_inserted !== '' && this.state.insert_foto_master !== '' && this.state.insert_master_kode_barang_distributor !== '') {
                this.setState({ isBtnConfirmInsertMaster: false })
            }
        }
    }

    check_field_kode_barang_insert_master = (e) => {
        if (e === '') {
            this.setState({ empty_insert_master_kode_barang_distributor: true, feedback_insert_master_kode_barang_distributor: 'Kolom ini wajib diisi', isBtnConfirmInsertMaster: true })
        } else {
            this.setState({ empty_insert_master_kode_barang_distributor: false, feedback_insert_master_kode_barang_distributor: '' })
            // handle button
            if (this.state.nama_barang_inserted !== '' &&
                this.state.id_category_barang_inserted !== '0' &&
                this.state.id_satuan_barang_inserted !== '0' &&
                (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
                (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
                (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
                (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
                (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                this.state.ex_barang_inserted !== '' && this.state.insert_foto_master !== '') {
                this.setState({ isBtnConfirmInsertMaster: false })
            }
        }
    }

    check_field_minimum_pembelian_insert_master = (e) => {
        if (e === '') {
            this.setState({ empty_insert_master_minimum_pembelian: true, feedback_insert_master_minimum_pembelian: 'Kolom ini wajib diisi', isBtnConfirmInsertMaster: true })
        } else if (e !== '') {
            if (this.state.berat_barang_inserted === '') {
                this.setState({ empty_insert_master_minimum_pembelian: true, feedback_insert_master_minimum_pembelian: 'Mohon isi berat barang terlebih dahulu', isBtnConfirmInsertMaster: true })
            } else {
                if (e === '0') {
                    this.setState({ empty_insert_master_minimum_pembelian: true, feedback_insert_master_minimum_pembelian: 'Jumlah minimum pembelian harus lebih dari 0', isBtnConfirmInsertMaster: true })
                } else if (Number(e) % Number(this.state.berat_barang_inserted) === 0) {
                    this.setState({ empty_insert_master_minimum_pembelian: false, feedback_insert_master_minimum_pembelian: '' })
                    if (this.state.nama_barang_inserted !== '' &&
                        this.state.id_category_barang_inserted !== '0' &&
                        this.state.id_satuan_barang_inserted !== '0' &&
                        (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
                        (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
                        (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
                        (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                        (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                        this.state.ex_barang_inserted !== '' && this.state.insert_master_kode_barang_distributor !== '' &&
                        this.state.insert_deskripsi_master_barang !== '' && this.state.insert_foto_master !== '') {
                        this.setState({ isBtnConfirmInsertMaster: false })
                    }
                } else {
                    this.setState({ empty_insert_master_minimum_pembelian: true, feedback_insert_master_minimum_pembelian: 'Jumlah minimum pembelian harus kelipatan dari berat barang', isBtnConfirmInsertMaster: true })
                }
            }
        }
    }

    check_field_minimum_nego_insert_master = (e) => {
        if (e === '') {
            this.setState({ empty_insert_master_minimum_nego: true, feedback_insert_master_minimum_nego: 'Kolom ini wajib diisi', isBtnConfirmInsertMaster: true })
        } else if (e !== '') {
            if (this.state.berat_barang_inserted === '') {
                this.setState({
                    empty_insert_master_minimum_nego: true,
                    feedback_insert_master_minimum_nego: 'Mohon isi berat barang terlebih dahulu', isBtnConfirmInsertMaster: true
                })
            } else {
                if (e === '0') {
                    this.setState({ empty_insert_minimum_nego: true, feedback_insert_master_minimum_nego: 'Jumlah minimum nego harus lebih dari 0', isBtnConfirmInsertMaster: true })
                } else if (Number(e) % Number(this.state.berat_barang_inserted) === 0) {
                    this.setState({ empty_insert_master_minimum_nego: false, feedback_insert_master_minimum_nego: '' })
                    if (this.state.nama_barang_inserted !== '' &&
                        this.state.id_category_barang_inserted !== '0' &&
                        this.state.id_satuan_barang_inserted !== '0' &&
                        (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
                        (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
                        (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
                        (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                        (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
                        this.state.ex_barang_inserted !== '' && this.state.insert_master_kode_barang_distributor !== '' &&
                        this.state.insert_deskripsi_master_barang !== '' && this.state.insert_foto_master !== '') {
                        this.setState({ isBtnConfirmInsertMaster: false })
                    }
                } else {
                    this.setState({ empty_insert_master_minimum_nego: true, feedback_insert_master_minimum_nego: 'Jumlah minimum nego harus kelipatan dari berat barang', isBtnConfirmInsertMaster: true })
                }
            }
        }
    }

    check_insert_master_persen_nego_pertama = (x) => {
        if (x === '') {
            this.setState({
                empty_insert_master_nominal_persen_nego_pertama: true,
                feedback_insert_master_nominal_persen_nego_pertama: 'Kolom ini wajib diisi', isbtnConfirmInsertMasterKedua: true,
                empty_insert_master_nominal_persen_nego_kedua: false, feedback_insert_master_nominal_persen_nego_kedua: '',
                empty_insert_master_nominal_persen_nego_ketiga: false, feedback_insert_master_nominal_persen_nego_ketiga: '',
                disable_insert_master_persen_nego_kedua: true, insert_master_nominal_persen_nego_kedua: '',
                disable_insert_master_persen_nego_ketiga: true, insert_master_nominal_persen_nego_ketiga: ''
            })
        } else if (x !== '') {
            this.setState({
                empty_insert_master_nominal_persen_nego_pertama: false,
                feedback_insert_master_nominal_persen_nego_pertama: '',
                disable_insert_master_persen_nego_kedua: false,
                empty_insert_master_nominal_persen_nego_kedua: false, feedback_insert_master_nominal_persen_nego_kedua: ''
            })
            if (Number(x) <= 100) {
                if (Number(x) < Number(this.state.insert_master_nominal_persen_nego_kedua)) {
                    this.setState({
                        empty_insert_master_nominal_persen_nego_pertama: true,
                        feedback_insert_master_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2', isbtnConfirmInsertMasterKedua: true
                    })
                    if (Number(x) < Number(this.state.insert_master_nominal_persen_nego_ketiga)) {
                        this.setState({
                            empty_insert_master_nominal_persen_nego_pertama: true,
                            feedback_insert_master_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2 dan 3', isbtnConfirmInsertMasterKedua: true
                        })
                    } else {
                        this.setState({
                            empty_insert_master_nominal_persen_nego_pertama: true,
                            feedback_insert_master_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2', isbtnConfirmInsertMasterKedua: true
                        })
                    }
                }
                if (Number(x) < Number(this.state.insert_master_nominal_persen_nego_ketiga)) {
                    this.setState({
                        empty_insert_master_nominal_persen_nego_pertama: true,
                        feedback_insert_master_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 3', isbtnConfirmInsertMasterKedua: true
                    })
                    if (Number(x) < Number(this.state.insert_master_nominal_persen_nego_kedua)) {
                        this.setState({
                            empty_insert_master_nominal_persen_nego_pertama: true,
                            feedback_insert_master_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 2 dan 3', isbtnConfirmInsertMasterKedua: true
                        })
                    } else {
                        this.setState({
                            empty_insert_master_nominal_persen_nego_pertama: true,
                            feedback_insert_master_nominal_persen_nego_pertama: 'Nominal persen nego 1 harus lebih tinggi dari nominal persen nego 3', isbtnConfirmInsertMasterKedua: true
                        })
                    }
                }
                if ((Number(x) >= Number(this.state.insert_master_nominal_persen_nego_kedua)) &&
                    (Number(x) >= Number(this.state.insert_master_nominal_persen_nego_ketiga)) &&
                    (Number(this.state.insert_master_nominal_persen_nego_kedua) >= Number(this.state.insert_master_nominal_persen_nego_ketiga)) &&
                    Number(x) <= 100 && this.state.insert_master_nominal_persen_nego_kedua !== '' && this.state.insert_master_nominal_persen_nego_ketiga !== '') {
                    this.setState({
                        empty_insert_master_nominal_persen_nego_pertama: false,
                        feedback_insert_master_nominal_persen_nego_pertama: '',
                        empty_insert_master_nominal_persen_nego_kedua: false,
                        feedback_insert_master_nominal_persen_nego_kedua: '',
                        empty_insert_master_nominal_persen_nego_ketiga: false,
                        feedback_insert_master_nominal_persen_nego_ketiga: '',
                        isbtnConfirmInsertMasterKedua: false
                    })
                }
            } else {
                this.setState({
                    empty_insert_master_nominal_persen_nego_pertama: true,
                    feedback_insert_master_nominal_persen_nego_pertama: 'Nominal persen nego 1 maksimal bernilai 100%', isbtnConfirmInsertMasterKedua: true
                })
            }
            // handle button
            if (Number(x) >= Number(this.state.insert_master_nominal_persen_nego_kedua) &&
                Number(x) >= Number(this.state.insert_master_nominal_persen_nego_ketiga) &&
                Number(this.state.insert_master_nominal_persen_nego_kedua) >= Number(this.state.insert_master_nominal_persen_nego_ketiga) &&
                this.state.insert_master_nominal_persen_nego_kedua !== '' && this.state.insert_master_nominal_persen_nego_ketiga !== '') {
                this.setState({ isbtnConfirmInsertMasterKedua: false })
            }
        }
    }

    check_insert_master_persen_nego_kedua = (x) => {
        if (x === '') {
            this.setState({
                empty_insert_master_nominal_persen_nego_kedua: true,
                feedback_insert_master_nominal_persen_nego_kedua: 'Kolom ini wajib diisi', isbtnConfirmInsertMasterKedua: true,
                disable_insert_master_persen_nego_ketiga: true, empty_insert_master_nominal_persen_nego_ketiga: false,
                feedback_insert_master_nominal_persen_nego_ketiga: '', insert_master_nominal_persen_nego_ketiga: ''
            })
        } else if (x !== '') {
            this.setState({
                empty_insert_master_nominal_persen_nego_kedua: false,
                feedback_insert_master_nominal_persen_nego_kedua: '',
                disable_insert_master_persen_nego_ketiga: false,
                empty_insert_master_nominal_persen_nego_ketiga: false, feedback_insert_master_nominal_persen_nego_ketiga: ''
            })
            if (Number(x) <= 100) {
                if (Number(x) < Number(this.state.insert_master_nominal_persen_nego_ketiga)) {
                    this.setState({
                        empty_insert_master_nominal_persen_nego_kedua: true,
                        feedback_insert_master_nominal_persen_nego_kedua: 'Nominal persen nego 2 harus lebih tinggi dari nominal persen nego 3', isbtnConfirmInsertMasterKedua: true
                    })
                    if (Number(x) > Number(this.state.insert_master_nominal_persen_nego_pertama) && Number(this.state.insert_master_nominal_persen_nego_pertama) <= 100) {
                        this.setState({
                            empty_insert_master_nominal_persen_nego_kedua: true,
                            feedback_insert_master_nominal_persen_nego_kedua: 'Nominal persen nego 2 harus lebih rendah dari nominal persen nego 1', isbtnConfirmInsertMasterKedua: true
                        })
                    }
                }
                if (Number(x) > Number(this.state.insert_master_nominal_persen_nego_pertama)) {
                    this.setState({
                        empty_insert_master_nominal_persen_nego_kedua: true,
                        feedback_insert_master_nominal_persen_nego_kedua: 'Nominal persen nego 2 harus lebih rendah dari nominal persen nego 1', isbtnConfirmInsertMasterKedua: true
                    })
                }
                if ((Number(x) <= Number(this.state.insert_master_nominal_persen_nego_pertama)) &&
                    (Number(x) >= Number(this.state.insert_master_nominal_persen_nego_ketiga)) &&
                    Number(this.state.insert_master_nominal_persen_nego_pertama) <= 100 &&
                    this.state.insert_master_nominal_persen_nego_pertama !== '' && this.state.insert_master_nominal_persen_nego_ketiga !== '') {
                    this.setState({
                        empty_insert_master_nominal_persen_nego_kedua: false,
                        feedback_insert_master_nominal_persen_nego_kedua: '',
                        empty_insert_master_nominal_persen_nego_pertama: false,
                        feedback_insert_master_nominal_persen_nego_pertama: '',
                        empty_insert_master_nominal_persen_nego_ketiga: false,
                        feedback_insert_master_nominal_persen_nego_ketiga: '',
                        isbtnConfirmInsertMasterKedua: false
                    })
                }
            } else {
                this.setState({
                    empty_insert_master_nominal_persen_nego_kedua: true,
                    feedback_insert_master_nominal_persen_nego_kedua: 'Nominal persen nego 2 maksimal bernilai 100%', isbtnConfirmInsertMasterKedua: true
                })
            }
            // handle button
            if (Number(x) <= Number(this.state.insert_master_nominal_persen_nego_pertama) &&
                Number(x) >= Number(this.state.insert_master_nominal_persen_nego_ketiga) &&
                Number(this.state.insert_master_nominal_persen_nego_pertama) >= Number(this.state.insert_master_nominal_persen_nego_ketiga) &&
                this.state.insert_master_nominal_persen_nego_ketiga !== '') {
                this.setState({ isbtnConfirmInsertMasterKedua: false })
            }
        }
    }

    check_insert_master_persen_nego_ketiga = (x) => {
        if (x === '') {
            this.setState({
                empty_insert_master_nominal_persen_nego_ketiga: true,
                feedback_insert_master_nominal_persen_nego_ketiga: 'Kolom ini wajib diisi', isbtnConfirmInsertMasterKedua: true
            })
        } else if (x !== '') {
            this.setState({
                empty_insert_master_nominal_persen_nego_ketiga: false,
                feedback_insert_master_nominal_persen_nego_ketiga: ''
            })
            if (Number(x) <= 100) {
                if (Number(x) > Number(this.state.insert_master_nominal_persen_nego_pertama)) {
                    this.setState({
                        empty_insert_master_nominal_persen_nego_ketiga: true,
                        feedback_insert_master_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 1', isbtnConfirmInsertMasterKedua: true
                    })
                    if (Number(x) > Number(this.state.insert_master_nominal_persen_nego_kedua)) {
                        this.setState({
                            empty_insert_master_nominal_persen_nego_ketiga: true,
                            feedback_insert_master_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 1 dan 2', isbtnConfirmInsertMasterKedua: true
                        })
                    }
                }
                if (Number(x) > Number(this.state.insert_master_nominal_persen_nego_kedua)) {
                    this.setState({
                        empty_insert_master_nominal_persen_nego_ketiga: true,
                        feedback_insert_master_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 2', isbtnConfirmInsertMasterKedua: true
                    })
                    if (Number(x) > Number(this.state.insert_master_nominal_persen_nego_pertama)) {
                        this.setState({
                            empty_insert_master_nominal_persen_nego_ketiga: true,
                            feedback_insert_master_nominal_persen_nego_ketiga: 'Nominal persen nego 3 harus lebih rendah dari nominal persen nego 1 dan 2', isbtnConfirmInsertMasterKedua: true
                        })
                    }
                }
                if ((Number(x) <= Number(this.state.insert_master_nominal_persen_nego_pertama)) &&
                    (Number(x) <= Number(this.state.insert_master_nominal_persen_nego_kedua)) &&
                    Number(this.state.insert_master_nominal_persen_nego_kedua) <= Number(this.state.insert_master_nominal_persen_nego_pertama) &&
                    Number(this.state.insert_master_nominal_persen_nego_pertama) <= 100 &&
                    this.state.insert_master_nominal_persen_nego_pertama !== '' && this.state.insert_master_nominal_persen_nego_kedua !== '') {
                    this.setState({
                        empty_insert_master_nominal_persen_nego_ketiga: false,
                        feedback_insert_master_nominal_persen_nego_ketiga: '',
                        empty_insert_master_nominal_persen_nego_pertama: false,
                        feedback_insert_master_nominal_persen_nego_pertama: '',
                        empty_insert_master_nominal_persen_nego_kedua: false,
                        feedback_insert_master_nominal_persen_nego_kedua: '',
                        isbtnConfirmInsertMasterKedua: false
                    })
                }
            } else {
                this.setState({
                    empty_insert_master_nominal_persen_nego_ketiga: true,
                    feedback_insert_master_nominal_persen_nego_ketiga: 'Nominal persen nego 3 maksimal bernilai 100%', isbtnConfirmInsertMasterKedua: true
                })
            }
            // handle button
            if (Number(x) <= Number(this.state.insert_master_nominal_persen_nego_pertama) &&
                Number(x) <= Number(this.state.insert_master_nominal_persen_nego_kedua) &&
                Number(this.state.insert_master_nominal_persen_nego_pertama) >= Number(this.state.insert_master_nominal_persen_nego_kedua)) {
                this.setState({ isbtnConfirmInsertMasterKedua: false })
            }
        }
    }

    handleStatusBarang = () => {
        this.setState({
            isOpenStatus: !this.state.isOpenStatus
        })
    }

    changeStatus = (e) => {
        this.setState({
            detailed_status: e
        })
        if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
            (this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
            ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') &&
                (this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0')) &&
            ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') &&
                (this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0')) &&
            this.state.detailed_deskripsi !== '') {
            this.setState({ isBtnConfirmUpdate: false })
        }
    }

    handleModalConfirm = async () => {
        //hmc
        console.log("hello")
        await this.setState({ warningharga: '', warningberikutshowharga: '', warningshowhargaterendah: '', warningshowhargatertinggi: '' })
        // if (this.state.detailed_price !== '' && this.state.detailed_foto !== '') {
        //     if (this.state.default_currency_update === 'IDR') {
        //         let x = this.state.detailed_price_in_rupiah.split('.').join('')
        //         let y = Math.round(x.split(',').join('.'))
        // if (y < this.state.show_detailed_price_in_rupiah && y > this.state.show_detailed_price_in_rupiah-this.state.kurs_now) {
        // if (y < this.state.show_detailed_price_in_rupiah && y > this.state.show_detailed_price_in_rupiah-this.state.kurs_now_manual) {
        // this.setState({warningharga: 'Tidak akan ada perubahan harga karena harga tertinggi yang Anda masukkan dalam rentang kurs yang sama. '})
        // } else if (y > this.state.show_detailed_price_in_rupiah && y < this.state.show_detailed_price_in_rupiah+this.state.kurs_now) {
        //     } else if (y > this.state.show_detailed_price_in_rupiah && y < this.state.show_detailed_price_in_rupiah+this.state.kurs_now_manual) {
        //         this.setState({warningharga: 'Harga tertinggi yang Anda masukkan akan disesuaikan dengan nilai kurs saat ini. '})
        //     } else {
        //         this.setState({warningharga: ''})
        //     }
        // }
        // if (this.state.default_currency_update_terendah === 'IDR') {
        //     let a = this.state.detailed_price_in_rupiah_terendah.split('.').join('')
        //     let b = Math.round(a.split(',').join('.'))
        // if (b < this.state.show_detailed_price_in_rupiah_terendah && b > this.state.show_detailed_price_in_rupiah_terendah-this.state.kurs_now) {
        // if (b < this.state.show_detailed_price_in_rupiah_terendah && b > this.state.show_detailed_price_in_rupiah_terendah-this.state.kurs_now_manual) {
        // this.setState({warninghargaterendah: 'Tidak akan ada perubahan harga karena harga terendah yang Anda masukkan dalam rentang kurs yang sama. '})
        // } else if (b > this.state.show_detailed_price_in_rupiah_terendah && b < this.state.show_detailed_price_in_rupiah_terendah+this.state.kurs_now) {
        //         } else if (b > this.state.show_detailed_price_in_rupiah_terendah && b < this.state.show_detailed_price_in_rupiah_terendah+this.state.kurs_now_manual) {
        //             this.setState({warninghargaterendah: 'Harga terendah yang Anda masukkan akan disesuaikan dengan nilai kurs saat ini. '})
        //         } else {
        //             this.setState({warninghargaterendah: ''})
        //         }
        //     }
        //     this.setState({
        //         isOpenConfirm: !this.state.isOpenConfirm,
        //     })
        // }
        if (this.state.default_currency_update_terendah === 'IDR') { // harga_terendah IDR
            console.log("in here idr")
            let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
            let b = Math.round(a.split(',').join('.'))
            // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
            let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
            if (this.state.default_currency_update === 'USD') {
                let hargatertinggi = this.state.detailed_price.toString().split(',').join('')
                this.setState({
                    warningharga: 'Sistem mendeteksi penggunaan mata uang Rupiah untuk harga terendah. ' +
                        'Harga terendah akan dikonversi sesuai kurs USD yang berlaku saat ini. ',
                    warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                    warningshowhargaterendah:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargaterendah)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                        </div>,
                    warningshowhargatertinggi:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargatertinggi)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                        </div>
                })
            } else {
                let c = this.state.detailed_price_in_rupiah.toString().split('.').join('')
                let d = Math.round(c.split(',').join('.'))
                // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                this.setState({
                    warningharga: 'Sistem mendeteksi penggunaan mata uang Rupiah untuk harga terendah dan harga tertinggi. ' +
                        'Harga terendah dan harga tertinggi akan dikonversi sesuai kurs USD yang berlaku saat ini. ',
                    warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                    warningshowhargaterendah:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargaterendah)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                        </div>,
                    warningshowhargatertinggi:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargatertinggi)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                        </div>
                })
            }
        } else { // harga_terendah USD            
            let hargaterendah = this.state.detailed_price_terendah.toString().split(',').join('')
            console.log(hargaterendah)
            if (this.state.default_currency_update === 'USD') {
                console.log("in here usd 1")
                let hargatertinggi = this.state.detailed_price.toString().split(',').join('')
                this.setState({
                    warningharga: '',
                    warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                    warningshowhargaterendah:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargaterendah)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                        </div>,
                    warningshowhargatertinggi:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargatertinggi)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                        </div>
                })
            } else {
                let c = this.state.detailed_price_in_rupiah.toString().split('.').join('')
                let d = Math.round(c.split(',').join('.'))
                // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                this.setState({
                    warningharga: 'Sistem mendeteksi penggunaan mata uang Rupiah untuk harga tertinggi. ' +
                        'Harga tertinggi akan dikonversi sesuai kurs USD yang berlaku saat ini. ',
                    warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                    warningshowhargaterendah:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargaterendah)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                        </div>,
                    warningshowhargatertinggi:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargatertinggi)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                        </div>
                })
            }
        }
        // await check nego di sini
        await this.loadCheckingNego()
        await this.loadCheckingKodeBarang(this.state.detailed_kode_barang_distributor)
        if (Number(this.state.allCheckedNego) > 0) {
            this.handleModalAttentionNego()
        } else {
            if (this.state.detailed_kode_barang_distributor === this.state.pembanding_detailed_kode_barang_distributor &&
                Number(this.state.allCheckedKodeBarang) === 1) {
                this.setState({
                    isOpenConfirm: !this.state.isOpenConfirm,
                })
            } else {
                if (Number(this.state.allCheckedKodeBarang) > 0) {
                    this.handleModalAttentionKodeBarang()
                } else {
                    this.setState({
                        isOpenConfirm: !this.state.isOpenConfirm,
                    })
                }
            }
        }
    }

    loadCheckingNego = async () => {
        let passquerycheckingnego = encrypt("select count(gcm_master_cart.id) as total from gcm_master_cart " +
            "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
            "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 " +
            "and gcm_master_cart.barang_id=" + this.state.detailed_id_list_barang)
        const residchecked = await this.props.getDataCheckedNego({ query: passquerycheckingnego }).catch(err => err)
        if (residchecked) {
            await this.setState({
                allCheckedNego: Number(residchecked.total)
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

    handleModalAttentionNego = () => {
        this.setState({ isOpenAttentionNego: !this.state.isOpenAttentionNego })
    }

    loadCheckingKodeBarang = async (kd_brg) => {
        let passquerycheckingkodebarang = encrypt("select count(gcm_list_barang.id) as total from gcm_list_barang " +
            "where gcm_list_barang.company_id=" + this.state.company_id + " and gcm_list_barang.kode_barang='" + kd_brg + "'")
        const reskodebarang = await this.props.getDataCheckedKodeBarang({ query: passquerycheckingkodebarang }).catch(err => err)
        if (reskodebarang) {
            await this.setState({
                allCheckedKodeBarang: Number(reskodebarang.total)
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

    handleModalAttentionKodeBarang = () => {
        this.setState({ isOpenAttentionKodeBarang: !this.state.isOpenAttentionKodeBarang })
    }

    handleModalConfirmInsert = async () => {
        await this.setState({ warningharga: '', warningberikutshowharga: '', warningshowhargaterendah: '', warningshowhargatertinggi: '' })
        if (this.state.id_barang_registered_insert === '0' && this.state.insert_price === '' && this.state.insert_foto === '') {
            this.setState({
                isOpenPictureInserted: !this.state.isOpenPictureInserted,
                errormessage: 'Harap pilih barang yang akan dimasukkan, gambar barang, dan harga barang!',
                empty_insert_price: true
            })
        } else if (this.state.insert_foto === '' && this.state.id_barang_registered_insert === '0') {
            this.setState({
                isOpenPictureInserted: !this.state.isOpenPictureInserted,
                errormessage: 'Harap pilih barang yang akan dimasukkan beserta gambar barang!'
            })
        } else if (this.state.insert_foto === '' && this.state.insert_price === '') {
            this.setState({
                isOpenPictureInserted: !this.state.isOpenPictureInserted,
                errormessage: 'Harap pilih gambar barang yang akan dimasukkan beserta harga barang!',
                empty_insert_price: true
            })
        } else if (this.state.id_barang_registered_insert === '0' && this.state.insert_price === '') {
            this.setState({
                isOpenPictureInserted: !this.state.isOpenPictureInserted,
                errormessage: 'Harap pilih barang yang akan dimasukkan beserta harga barang!',
                empty_insert_price: true
            })
        } else if (this.state.insert_foto === '') {
            this.setState({
                isOpenPictureInserted: !this.state.isOpenPictureInserted,
                errormessage: 'Harap pilih gambar barang!'
            })
        } else if (this.state.id_barang_registered_insert === '0') {
            this.setState({
                isOpenPictureInserted: !this.state.isOpenPictureInserted,
                errormessage: 'Harap pilih barang yang akan dimasukkan!'
            })
        } else if (this.state.insert_price === '') {
            this.setState({
                empty_insert_price: true
            })
        }
        // await di sini
        await this.loadCheckingBarang()
        await this.loadCheckingKodeBarang(this.state.insert_kode_barang_distributor)
        let check_id_barang_registered = this.state.allCheckedRegisteredBarang.filter(input_id => { return input_id.barang_id === this.state.id_barang_registered_insert });
        if (check_id_barang_registered !== '' && check_id_barang_registered.length === 0) {
            // sini
            if (this.state.default_currency_terendah === 'IDR') { // harga_terendah IDR
                let a = this.state.insert_price_terendah.toString().split('.').join('')
                let b = Math.round(a.split(',').join('.'))
                // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
                if (this.state.default_currency === 'USD') {
                    let hargatertinggi = this.state.insert_price.toString().split(',').join('')
                    this.setState({
                        warningharga: 'Sistem mendeteksi penggunaan mata uang Rupiah untuk harga terendah. ' +
                            'Harga terendah akan dikonversi sesuai kurs USD yang berlaku saat ini. ',
                        warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                        warningshowhargaterendah:
                            <div>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                                <Badge color="warning" style={{ fontWeight: "bold" }}>
                                    <NumberFormat value={Number(hargaterendah)}
                                        displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                </Badge>
                                {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                                <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.nama_singkat_satuan_barang_registered_insert}
                            </div>,
                        warningshowhargatertinggi:
                            <div>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                                <Badge color="warning" style={{ fontWeight: "bold" }}>
                                    <NumberFormat value={Number(hargatertinggi)}
                                        displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                </Badge>
                                {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                                <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.nama_singkat_satuan_barang_registered_insert}
                            </div>
                    })
                } else {
                    let c = this.state.insert_price.toString().split('.').join('')
                    let d = Math.round(c.split(',').join('.'))
                    // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                    let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                    this.setState({
                        warningharga: 'Sistem mendeteksi penggunaan mata uang Rupiah untuk harga terendah dan harga tertinggi. ' +
                            'Harga terendah dan harga tertinggi akan dikonversi sesuai kurs USD yang berlaku saat ini. ',
                        warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                        warningshowhargaterendah:
                            <div>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                                <Badge color="warning" style={{ fontWeight: "bold" }}>
                                    <NumberFormat value={Number(hargaterendah)}
                                        displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                </Badge>
                                {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                                <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.nama_singkat_satuan_barang_registered_insert}
                            </div>,
                        warningshowhargatertinggi:
                            <div>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                                <Badge color="warning" style={{ fontWeight: "bold" }}>
                                    <NumberFormat value={Number(hargatertinggi)}
                                        displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                </Badge>
                                {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                                <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.nama_singkat_satuan_barang_registered_insert}
                            </div>
                    })
                }
            } else { // harga_terendah USD
                let hargaterendah = this.state.insert_price_terendah.toString().split(',').join('')
                if (this.state.default_currency === 'USD') {
                    let hargatertinggi = this.state.insert_price.toString().split(',').join('')
                    this.setState({
                        warningharga: '',
                        warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                        warningshowhargaterendah:
                            <div>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                                <Badge color="warning" style={{ fontWeight: "bold" }}>
                                    <NumberFormat value={Number(hargaterendah)}
                                        displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                </Badge>
                                {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                                <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.nama_singkat_satuan_barang_registered_insert}
                            </div>,
                        warningshowhargatertinggi:
                            <div>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                                <Badge color="warning" style={{ fontWeight: "bold" }}>
                                    <NumberFormat value={Number(hargatertinggi)}
                                        displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                </Badge>
                                {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                                <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.nama_singkat_satuan_barang_registered_insert}
                            </div>
                    })
                } else {
                    let c = this.state.insert_price.toString().split('.').join('')
                    let d = Math.round(c.split(',').join('.'))
                    // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                    let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                    this.setState({
                        warningharga: 'Sistem mendeteksi penggunaan mata uang Rupiah untuk harga tertinggi. ' +
                            'Harga tertinggi akan dikonversi sesuai kurs USD yang berlaku saat ini. ',
                        warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                        warningshowhargaterendah:
                            <div>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                                <Badge color="warning" style={{ fontWeight: "bold" }}>
                                    <NumberFormat value={Number(hargaterendah)}
                                        displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                </Badge>
                                {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                                <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.nama_singkat_satuan_barang_registered_insert}
                            </div>,
                        warningshowhargatertinggi:
                            <div>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                                <Badge color="warning" style={{ fontWeight: "bold" }}>
                                    <NumberFormat value={Number(hargatertinggi)}
                                        displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                </Badge>
                                {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                                <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                    displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.nama_singkat_satuan_barang_registered_insert}
                            </div>
                    })
                }
            }
            if (Number(this.state.allCheckedKodeBarang) > 0) {
                this.handleModalAttentionKodeBarang()
            } else {
                await this.setState({
                    isOpenConfirmInsert: !this.state.isOpenConfirmInsert,
                    empty_insert_nominal_persen_nego_pertama: false,
                    empty_insert_nominal_persen_nego_kedua: false,
                    empty_insert_nominal_persen_nego_ketiga: false,
                    feedback_insert_nominal_persen_nego_pertama: '',
                    feedback_insert_nominal_persen_nego_kedua: '',
                    feedback_insert_nominal_persen_nego_ketiga: '',
                    insert_nominal_persen_nego_pertama: '0',
                    insert_nominal_persen_nego_kedua: '0',
                    insert_nominal_persen_nego_ketiga: '0',
                    isCheckedInsertNominalPersen: false,
                    isbtnConfirmInsertKedua: false
                })
            }
        } else {
            this.handleModalAttentionTerdaftar()
        }
    }

    loadCheckingBarang = async () => {
        let passquerycheckingbarang = encrypt("select gcm_list_barang.barang_id from gcm_list_barang where gcm_list_barang.company_id=" + this.state.company_id)
        const residchecked = await this.props.getDataCheckedBarang({ query: passquerycheckingbarang }).catch(err => err)
        if (residchecked) {
            this.setState({
                allCheckedRegisteredBarang: residchecked
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

    handleModalConfirmInsertKedua = async () => {
        await this.loadCheckingBarang()
        await this.loadCheckingKodeBarang(this.state.insert_kode_barang_distributor)
        let check_id_barang_registered = this.state.allCheckedRegisteredBarang.filter(input_id => { return input_id.barang_id === this.state.id_barang_registered_insert });
        if (check_id_barang_registered !== '' && check_id_barang_registered.length === 0) {
            if (Number(this.state.allCheckedKodeBarang) > 0) {
                this.handleModalAttentionKodeBarangConfirmKedua()
            } else {
                this.setState({ isOpenConfirmInsertKedua: !this.state.isOpenConfirmInsertKedua })
            }
        } else {
            this.handleModalAttentionTerdaftar()
        }
    }

    handleModalConfirmInsertKeduaMasterBarang = async () => {
        await this.loadCheckingKodeBarang(this.state.insert_master_kode_barang_distributor)
        if (Number(this.state.allCheckedKodeBarang) > 0) {
            this.handleModalAttentionKodeBarangConfirmKedua()
        } else {
            this.setState({
                isOpenConfirmInsertKeduaMaster: !this.state.isOpenConfirmInsertKeduaMaster
            })
        }
    }

    handleGambarEdit = (e) => {
        if (e.target.value !== '' && (this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
            (this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
            ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
            Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
            Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
            Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
            this.state.detailed_nominal_persen_nego_pertama !== '' &&
            this.state.detailed_nominal_persen_nego_kedua !== '' &&
            this.state.detailed_nominal_persen_nego_ketiga !== '' &&
            this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
            this.resizeImage(e.target.files[0], "edit-1")
        } else if (e.target.value !== '') {
            this.resizeImage(e.target.files[0], "edit-2")
        }
        else if (e.target.value === '') {
            this.setState({
                detailed_foto: '',
                detailed_foto_baru: '',
                editGambarBarang: true,
                errormessage: 'Harap pilih gambar barang yang akan dimasukkan!',
                isOpenPictureInserted: !this.state.isOpenPictureInserted,
                isBtnConfirmUpdate: true
            })
        }
    }

    confirmAction = async () => {
        this.setState({ disable_btnconfirmupdate: true })
        await this.loadCheckingKodeBarang(this.state.detailed_kode_barang_distributor)
        if (Number(this.state.allCheckedKodeBarang) > 1) {
            this.handleModalAttentionKodeBarangConfirmKedua()
        } else {
            if (this.state.editGambarBarang) {
                this.uploadGambarBarang()
            } else {
                this.updateBarang()
            }
        }
    }

    uploadGambarBarang = async () => {
        if (this.state.editGambarBarang) {
            let temp = this.state.detailed_foto_baru
            let tempPict = temp.name
            const data = {
                tmp: temp,
                tmpPict: tempPict
            }

            const resupload = await this.props.uploadGambarBarang(data).catch(err => err)
            if (resupload) {
                await this.setState({
                    detailed_foto_baru_url: resupload
                })
                this.updateBarang()
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
        } else if (this.state.insertGambarBarang) {
            let temp = this.state.insert_foto_baru
            let tempPict = temp.name
            const data = {
                tmp: temp,
                tmpPict: tempPict
            }
            console.log(data)
            // komentar
            const resupload = await this.props.uploadGambarBarang(data).catch(err => err)
            if (resupload) {
                await this.setState({
                    insert_foto_baru_url: resupload
                })
                this.insertBarang()
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
            let temp = this.state.insert_foto_master_baru
            let tempPict = temp.name
            const data = {
                tmp: temp,
                tmpPict: tempPict
            }
            // komentar
            const resupload = await this.props.uploadGambarBarang(data).catch(err => err)
            if (resupload) {
                await this.setState({
                    insert_foto_master_baru_url: resupload
                })
                this.insertMasterBarang()
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

    insertBarang = async () => {
        let passqueryinsertlistbarang = ""

        if (this.state.default_currency === 'IDR') {
            let x = this.state.insert_price.split('.').join('')
            let y = Math.round(x.split(',').join('.'))
            // let harga = Math.ceil(y / this.state.kurs_now)
            // let harga = Math.ceil(y / this.state.kurs_now_manual)
            let harga = (y / this.state.kurs_now_manual).toFixed(2)
            let a = this.state.insert_price_terendah.split('.').join('')
            let b = Math.round(a.split(',').join('.'))
            // let harga_terendah = Math.ceil(b / this.state.kurs_now)
            // let harga_terendah = Math.ceil(b / this.state.kurs_now_manual)
            let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
            if (this.state.default_currency_terendah === 'IDR') { // default_currency_terendah = IDR
                passqueryinsertlistbarang = "with new_insert as ( insert into gcm_list_barang (barang_id, price, company_id, " +
                    "foto, deskripsi, status, create_by, update_by, price_terendah, jumlah_min_beli, jumlah_min_nego, persen_nego_1, persen_nego_2, persen_nego_3, kode_barang) values ('" + this.state.id_barang_registered_insert + "', '" +
                    harga + "', '" + this.state.company_id + "', '" + this.state.insert_foto_baru_url + "', '" +
                    this.state.insert_deskripsi + "', 'C', '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "', '" + harga_terendah + "', '" + this.state.insert_minimum_pembelian + "', '" + this.state.insert_minimum_nego + "', '" +
                    this.state.insert_nominal_persen_nego_pertama + "', '" + this.state.insert_nominal_persen_nego_kedua + "', '" + this.state.insert_nominal_persen_nego_ketiga + "', '" + this.state.insert_kode_barang_distributor + "') returning id)"
                    +
                    `insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                    values ((select id from new insert),${this.state.company_id},${harga},
                    ${harga_terendah},${this.state.id_pengguna_login},
                    ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *
                    `

            } else { // default_currency_terendah = USD
                passqueryinsertlistbarang =
                    "with new_insert as ( insert into gcm_list_barang (barang_id, price, company_id, " +
                    "foto, deskripsi, status, create_by, update_by, price_terendah, jumlah_min_beli, jumlah_min_nego, persen_nego_1, persen_nego_2, persen_nego_3, kode_barang) values ('" + this.state.id_barang_registered_insert + "', '" +
                    harga + "', '" + this.state.company_id + "', '" + this.state.insert_foto_baru_url + "', '" +
                    this.state.insert_deskripsi + "', 'C', '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "', '" + this.state.insert_price_terendah.split(',').join('') + "', '" + this.state.insert_minimum_pembelian + "', '" + this.state.insert_minimum_nego + "', '" +
                    this.state.insert_nominal_persen_nego_pertama + "', '" + this.state.insert_nominal_persen_nego_kedua + "', '" + this.state.insert_nominal_persen_nego_ketiga + "', '" + this.state.insert_kode_barang_distributor + "') returning id)"
                    +
                    `insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                    values ((select id from new insert),${this.state.company_id},${harga},
                    ${this.state.insert_price_terendah.split(',').join('')},${this.state.id_pengguna_login},
                    ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *
                    `

            }
        } else { // default_currency = USD
            let a = this.state.insert_price_terendah.split('.').join('')
            let b = Math.round(a.split(',').join('.'))
            // let harga_terendah = Math.ceil(b / this.state.kurs_now)
            // let harga_terendah = Math.ceil(b / this.state.kurs_now_manual)
            let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
            if (this.state.default_currency_terendah === 'USD') { // default_currency_terendah = USD
                passqueryinsertlistbarang =
                    "with new_insert as ( insert into gcm_list_barang (barang_id, price, company_id, " +
                    "foto, deskripsi, status, create_by, update_by, price_terendah, jumlah_min_beli, jumlah_min_nego, persen_nego_1, persen_nego_2, persen_nego_3, kode_barang) values ('" + this.state.id_barang_registered_insert + "', '" +
                    (this.state.insert_price.split(',').join('')) + "', '" + this.state.company_id + "', '" + this.state.insert_foto_baru_url + "', '" +
                    this.state.insert_deskripsi + "', 'C', '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "', '" + (this.state.insert_price_terendah.split(',').join('')) + "', '" + this.state.insert_minimum_pembelian + "', '" + this.state.insert_minimum_nego + "', '" +
                    this.state.insert_nominal_persen_nego_pertama + "', '" + this.state.insert_nominal_persen_nego_kedua + "', '" + this.state.insert_nominal_persen_nego_ketiga + "', '" + this.state.insert_kode_barang_distributor + "') returning id)"
                    +
                    `insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                    values ((select id from new insert),${this.state.company_id},${(this.state.insert_price.split(',').join(''))},
                    ${(this.state.insert_price_terendah.split(',').join(''))},${this.state.id_pengguna_login},
                    ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *
                    `
                    
            } else { // default_currency_terendah = IDR
                passqueryinsertlistbarang =
                    "with new_insert as ( insert into gcm_list_barang (barang_id, price, company_id, " +
                    "foto, deskripsi, status, create_by, update_by, price_terendah, jumlah_min_beli, jumlah_min_nego, persen_nego_1, persen_nego_2, persen_nego_3, kode_barang) values ('" + this.state.id_barang_registered_insert + "', '" +
                    (this.state.insert_price.split(',').join('')) + "', '" + this.state.company_id + "', '" + this.state.insert_foto_baru_url + "', '" +
                    this.state.insert_deskripsi + "', 'C', '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "', '" + harga_terendah + "', '" + this.state.insert_minimum_pembelian + "', '" + this.state.insert_minimum_nego + "', '" +
                    this.state.insert_nominal_persen_nego_pertama + "', '" + this.state.insert_nominal_persen_nego_kedua + "', '" + this.state.insert_nominal_persen_nego_ketiga + "', '" + this.state.insert_kode_barang_distributor + "') returning id)"
                    +
                    `insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                    values ((select id from new insert),${this.state.company_id},${(this.state.insert_price.split(',').join(''))},
                    ${harga_terendah},${this.state.id_pengguna_login},
                    ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *
                    `
            }
        }

        //komentar
        const resinsertlistbarang = await this.props.insertListBarang({ query: encrypt(passqueryinsertlistbarang) }).catch(err => err)
        if (resinsertlistbarang) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.loadDataBarang()
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

    insertMasterBarang = async () => {
        let passqueryinsertmasterbarang = ""
        passqueryinsertmasterbarang = encrypt("insert into gcm_master_barang (nama, category_id, berat, " +
            "volume, ex, create_by, create_date, update_by, update_date, status, satuan) values ('" + this.state.nama_barang_inserted + "', " +
            "'" + this.state.id_category_barang_inserted + "', '" + this.state.berat_barang_inserted + "', '" + this.state.volume_barang_inserted + "', " +
            "'" + this.state.ex_barang_inserted + "', '" + this.state.id_pengguna_login + "', now(), '" + this.state.id_pengguna_login + "', " +
            "now(), 'C', '" + this.state.id_satuan_barang_inserted + "') returning id;")
        // komentar
        const resinsertMasterBarang = await this.props.insertMasterBarangFromSeller({ query: passqueryinsertmasterbarang }).catch(err => err)

        if (resinsertMasterBarang) {
            await this.setState({
                id_hasil_insert_master_barang: resinsertMasterBarang.id
            })

            let passqueryinsertlistbarang = ""

            if (this.state.default_currency_master_barang === 'IDR') {
                let x = this.state.insert_price_master_barang.split('.').join('')
                let y = Math.round(x.split(',').join('.'))
                let harga = (y / this.state.kurs_now_manual).toFixed(2)
                let a = this.state.insert_price_master_barang_terendah.split('.').join('')
                let b = Math.round(a.split(',').join('.'))
                let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                if (this.state.default_currency_master_barang_terendah === 'IDR') { // jika semua IDR
                    passqueryinsertlistbarang =
                        "with new_insert as ( insert into gcm_list_barang (barang_id, price, company_id, " +
                        "foto, deskripsi, status, create_by, update_by, price_terendah, jumlah_min_beli, jumlah_min_nego, persen_nego_1, persen_nego_2, persen_nego_3, kode_barang) values ('" + this.state.id_hasil_insert_master_barang + "', '" +
                        harga + "', '" + this.state.company_id + "', '" + this.state.insert_foto_master_baru_url + "', '" +
                        this.state.insert_deskripsi_master_barang + "', 'C', '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "', '" + harga_terendah + "', '" + this.state.insert_master_minimum_pembelian + "', '" + this.state.insert_master_minimum_nego + "', '" +
                        this.state.insert_master_nominal_persen_nego_pertama + "', '" + this.state.insert_master_nominal_persen_nego_kedua + "', '" + this.state.insert_master_nominal_persen_nego_ketiga + "', '" +
                        this.state.insert_master_kode_barang_distributor + "') returning id)"
                        +
                        `insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                        values ((select id from new_insert),${this.state.company_id},${harga},
                        ${harga_terendah},${this.state.id_pengguna_login},
                        ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *
                        `

                } else { // jika default_currency_master_barang = IDR dan default_currency_master_barang_terendah = USD
                    passqueryinsertlistbarang =
                        "with new_insert as ( insert into gcm_list_barang (barang_id, price, company_id, " +
                        "foto, deskripsi, status, create_by, update_by, price_terendah, jumlah_min_beli, jumlah_min_nego, persen_nego_1, persen_nego_2, persen_nego_3, kode_barang) values ('" + this.state.id_hasil_insert_master_barang + "', '" +
                        harga + "', '" + this.state.company_id + "', '" + this.state.insert_foto_master_baru_url + "', '" +
                        this.state.insert_deskripsi_master_barang + "', 'C', '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "', '" + this.state.insert_price_master_barang_terendah.split(',').join('') + "', '" + this.state.insert_master_minimum_pembelian + "', '" + this.state.insert_master_minimum_nego + "', '" +
                        this.state.insert_master_nominal_persen_nego_pertama + "', '" + this.state.insert_master_nominal_persen_nego_kedua + "', '" + this.state.insert_master_nominal_persen_nego_ketiga + "', '" +
                        this.state.insert_master_kode_barang_distributor + "') returning id)"
                        +
                        `insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                        values ((select id from new_insert),${this.state.company_id},${harga},
                        ${this.state.insert_price_master_barang_terendah.split(',').join('')},${this.state.id_pengguna_login},
                        ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *
                        `

                }
            } else { // default_currency_master_barang = USD
                let a = this.state.insert_price_master_barang_terendah.split('.').join('')
                let b = Math.round(a.split(',').join('.'))
                let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                if (this.state.default_currency_master_barang_terendah === 'USD') { // default_currency_master_barang_terendah = USD
                    passqueryinsertlistbarang =
                        "with new_insert as ( insert into gcm_list_barang (barang_id, price, company_id, " +
                        "foto, deskripsi, status, create_by, update_by, price_terendah, jumlah_min_beli, jumlah_min_nego, persen_nego_1, persen_nego_2, persen_nego_3, kode_barang) values ('" + this.state.id_hasil_insert_master_barang + "', '" +
                        (this.state.insert_price_master_barang.split(',').join('')) + "', '" + this.state.company_id + "', '" + this.state.insert_foto_master_baru_url + "', '" +
                        this.state.insert_deskripsi_master_barang + "', 'C', '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "', '" + (this.state.insert_price_master_barang_terendah.split(',').join('')) + "', '" + this.state.insert_master_minimum_pembelian + "', '" + this.state.insert_master_minimum_nego + "', '" +
                        this.state.insert_master_nominal_persen_nego_pertama + "', '" + this.state.insert_master_nominal_persen_nego_kedua + "', '" + this.state.insert_master_nominal_persen_nego_ketiga + "', '" +
                        this.state.insert_master_kode_barang_distributor + "') returning id)"
                        +
                        `insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                        values ((select id from new_insert),${this.state.company_id},${(this.state.insert_price_master_barang.split(',').join(''))},
                        ${(this.state.insert_price_master_barang_terendah.split(',').join(''))},${this.state.id_pengguna_login},
                        ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *
                        `

                } else { // default_currency_master_barang_terendah = IDR
                    passqueryinsertlistbarang =
                        "with new_insert as ( insert into gcm_list_barang (barang_id, price, company_id, " +
                        "foto, deskripsi, status, create_by, update_by, price_terendah, jumlah_min_beli, jumlah_min_nego, persen_nego_1, persen_nego_2, persen_nego_3, kode_barang) values ('" + this.state.id_hasil_insert_master_barang + "', '" +
                        (this.state.insert_price_master_barang.split(',').join('')) + "', '" + this.state.company_id + "', '" + this.state.insert_foto_master_baru_url + "', '" +
                        this.state.insert_deskripsi_master_barang + "', 'C', '" + this.state.id_pengguna_login + "', '" + this.state.id_pengguna_login + "', '" + harga_terendah + "', '" + this.state.insert_master_minimum_pembelian + "', '" + this.state.insert_master_minimum_nego + "', '" +
                        this.state.insert_master_nominal_persen_nego_pertama + "', '" + this.state.insert_master_nominal_persen_nego_kedua + "', '" + this.state.insert_master_nominal_persen_nego_ketiga + "', '" +
                        this.state.insert_master_kode_barang_distributor + "') returning id)"
                        +
                        `insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                        values ((select id from new_insert),${this.state.company_id},${(this.state.insert_price_master_barang.split(',').join(''))},
                        ${harga_terendah},${this.state.id_pengguna_login},
                        ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *
                        `
                }
            }

            const resinsertlistbarang = await this.props.insertListBarang({ query: encrypt(passqueryinsertlistbarang) }).catch(err => err)
            if (resinsertlistbarang) {
                swal({
                    title: "Sukses!",
                    text: "Perubahan disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.loadDataBarang()
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
                    // window.location.reload()
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
                // window.location.reload()
            });
        }
    }

    updateBarang = async () => {

        let passqueryupdatebarang = ""

        const is_harga_terendah_change = parseFloat(this.state.detailed_price_terendah) === parseFloat(this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].harga_terendah)
        const is_harga_change = parseFloat(this.state.detailed_price) === parseFloat(this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].harga)

        const is_update = is_harga_terendah_change && is_harga_change ? true : false
        console.log(is_update)

        if (this.state.editGambarBarang) {
            console.log("1")
            if (this.state.detailed_status_for_reject === 'R') {
                console.log("1-1")
                let status = 'C'
                if (this.state.default_currency_update === 'IDR') {
                    let x = this.state.detailed_price_in_rupiah.toString().split('.').join('')
                    let y = Math.round(x.split(',').join('.'))
                    // let harga = Math.ceil(y / this.state.kurs_now)
                    // let harga = Math.ceil(y / this.state.kurs_now_manual)
                    let harga = (y / this.state.kurs_now_manual).toFixed(2)
                    // let harga = Math.ceil((this.state.detailed_price_in_rupiah.split('.').join('')) / this.state.kurs_now)
                    if (this.state.default_currency_update_terendah === 'IDR') {
                        let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        // let harga_terendah = Math.ceil(b / this.state.kurs_now)
                        // let harga_terendah = Math.ceil(b / this.state.kurs_now_manual)
                        let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${harga},
                            ${harga_terendah},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set foto='" + this.state.detailed_foto_baru_url + "', " +
                            "price=" + harga + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + status + "', update_by=" + this.state.id_pengguna_login +
                            ", price_terendah='" + harga_terendah + "', jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update)
                    }
                    else {
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${harga},
                            ${(this.state.detailed_price_terendah.toString().split(',').join(''))},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set foto='" + this.state.detailed_foto_baru_url + "', " +
                            "price=" + harga + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + status + "', update_by=" + this.state.id_pengguna_login +
                            ", price_terendah=" + (this.state.detailed_price_terendah.toString().split(',').join('')) + ", jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                } else {
                    if (this.state.default_currency_update_terendah === 'IDR') {
                        let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        // let harga_terendah = Math.ceil(b / this.state.kurs_now)
                        // let harga_terendah = Math.ceil(b / this.state.kurs_now_manual)
                        let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${(this.state.detailed_price.toString().split(',').join(''))},
                            ${harga_terendah},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set foto='" + this.state.detailed_foto_baru_url + "', " +
                            "price=" + (this.state.detailed_price.toString().split(',').join('')) + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + status + "', update_by=" + this.state.id_pengguna_login +
                            ", price_terendah='" + harga_terendah + "', jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                    else {
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${(this.state.detailed_price.toString().split(',').join(''))},
                            ${(this.state.detailed_price_terendah.toString().split(',').join(''))},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set foto='" + this.state.detailed_foto_baru_url + "', " +
                            "price=" + (this.state.detailed_price.toString().split(',').join('')) + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + status + "', update_by=" + this.state.id_pengguna_login +
                            ", price_terendah=" + (this.state.detailed_price_terendah.toString().split(',').join('')) + ", jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                }
            }
            else {
                if (this.state.default_currency_update === 'IDR') {
                    let x = this.state.detailed_price_in_rupiah.toString().split('.').join('')
                    let y = Math.round(x.split(',').join('.'))
                    let harga = (y / this.state.kurs_now_manual).toFixed(2)
                    if (this.state.default_currency_update_terendah === 'IDR') {
                        let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${harga},
                            ${harga_terendah},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set foto='" + this.state.detailed_foto_baru_url + "', " +
                            "price=" + harga + ", deskripsi='" + this.state.detailed_deskripsi + "', status='" + this.state.detailed_status + "', update_by=" + this.state.id_pengguna_login +
                            ", price_terendah='" + harga_terendah + "', jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                    else {
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${harga},
                            ${(this.state.detailed_price_terendah.toString().split(',').join(''))},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set foto='" + this.state.detailed_foto_baru_url + "', " +
                            "price=" + harga + ", deskripsi='" + this.state.detailed_deskripsi + "', status='" + this.state.detailed_status + "', update_by=" + this.state.id_pengguna_login +
                            ", price_terendah=" + (this.state.detailed_price_terendah.toString().split(',').join('')) + ", jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                } else {
                    if (this.state.default_currency_update_terendah === 'IDR') {
                        let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${(this.state.detailed_price.toString().split(',').join(''))},
                            ${harga_terendah},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set foto='" + this.state.detailed_foto_baru_url + "', " +
                            "price=" + (this.state.detailed_price.toString().split(',').join('')) + ", deskripsi='" + this.state.detailed_deskripsi + "', status='" + this.state.detailed_status + "', update_by=" + this.state.id_pengguna_login +
                            ", price_terendah='" + harga_terendah + "', jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                    else {
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${(this.state.detailed_price.toString().split(',').join(''))},
                            ${(this.state.detailed_price_terendah.toString().split(',').join(''))},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set foto='" + this.state.detailed_foto_baru_url + "', " +
                            "price=" + (this.state.detailed_price.toString().split(',').join('')) + ", deskripsi='" + this.state.detailed_deskripsi + "', status='" + this.state.detailed_status + "', update_by=" + this.state.id_pengguna_login +
                            ", price_terendah=" + (this.state.detailed_price_terendah.toString().split(',').join('')) + ", jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                }
            }

            const resupdateBarang = await this.props.updateBarangStatus({ query: encrypt(passqueryupdatebarang) }).catch(err => err)
            if (resupdateBarang) {
                swal({
                    title: "Sukses!",
                    text: "Perubahan disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.loadDataBarang()
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
            if (this.state.detailed_status_for_reject === 'R') {
                console.log("in 2-1")
                let status = 'C'
                if (this.state.default_currency_update === 'IDR') {
                    let x = this.state.detailed_price_in_rupiah.toString().split('.').join('')
                    let y = Math.round(x.split(',').join('.'))
                    let harga = (y / this.state.kurs_now_manual).toFixed(2)
                    if (this.state.default_currency_update_terendah === 'IDR') {
                        let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${harga},
                            ${harga_terendah},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set price=" + harga + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + status + "', update_by=" + this.state.id_pengguna_login + ", price_terendah='" + harga_terendah +
                            "', jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`,
                            is_update
                        )
                    }
                    else {
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${harga},
                            ${(this.state.detailed_price_terendah.toString().split(',').join(''))},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set price=" + harga + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + status + "', update_by=" + this.state.id_pengguna_login + ", price_terendah=" + (this.state.detailed_price_terendah.toString().split(',').join('')) +
                            ", jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                } else {
                    if (this.state.default_currency_update_terendah === 'IDR') {
                        let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${(this.state.detailed_price.toString().split(',').join(''))},
                            ${harga_terendah},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set price=" + (this.state.detailed_price.toString().split(',').join('')) + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + status + "', update_by=" + this.state.id_pengguna_login + ", price_terendah='" + harga_terendah +
                            "', jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                    else {
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${(this.state.detailed_price.toString().split(',').join(''))},
                            ${(this.state.detailed_price_terendah.toString().split(',').join(''))},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set price=" + (this.state.detailed_price.toString().split(',').join('')) + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + status + "', update_by=" + this.state.id_pengguna_login + ", price_terendah=" + (this.state.detailed_price_terendah.toString().split(',').join('')) +
                            ", jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                }
            } else {
                if (this.state.default_currency_update === 'IDR') {
                    let x = this.state.detailed_price_in_rupiah.toString().split('.').join('')
                    let y = Math.round(x.split(',').join('.'))
                    let harga = (y / this.state.kurs_now_manual).toFixed(2)
                    if (this.state.default_currency_update_terendah === 'IDR') {
                        let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${harga},
                            ${harga_terendah},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set price=" + harga + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + this.state.detailed_status + "', update_by=" + this.state.id_pengguna_login + ", price_terendah='" + harga_terendah +
                            "', jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                    else {
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${harga},
                            ${(this.state.detailed_price_terendah.toString().split(',').join(''))},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set price=" + harga + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + this.state.detailed_status + "', update_by=" + this.state.id_pengguna_login + ", price_terendah=" + (this.state.detailed_price_terendah.toString().split(',').join('')) +
                            ", jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                } else {
                    if (this.state.default_currency_update_terendah === 'IDR') {
                        console.log("in 2-2-2-1")
                        let a = this.state.detailed_price_in_rupiah_terendah.toString().split('.').join('')
                        let b = Math.round(a.split(',').join('.'))
                        let harga_terendah = (b / this.state.kurs_now_manual).toFixed(2)
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${(this.state.detailed_price.toString().split(',').join(''))},
                            ${harga_terendah},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set price=" + (this.state.detailed_price.toString().split(',').join('')) + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + this.state.detailed_status + "', update_by=" + this.state.id_pengguna_login + ", price_terendah='" + harga_terendah +
                            "', jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                    else {
                        passqueryupdatebarang = this.handleUpdateListingHargaBarang(
                            `with new_insert as ( insert into gcm_listing_harga_barang (barang_id, company_id, price, price_terendah, create_by, update_by, start_date, end_date) 
                            values (${this.state.detailed_id_list_barang},${this.state.company_id},${(this.state.detailed_price.toString().split(',').join(''))},
                            ${(this.state.detailed_price_terendah.toString().split(',').join(''))},${this.state.id_pengguna_login},
                            ${this.state.id_pengguna_login},to_timestamp(${Date.now()} / 1000.0),${null}) RETURNING *),
                            `
                            ,
                            "update gcm_list_barang set price=" + (this.state.detailed_price.toString().split(',').join('')) + ", deskripsi='" + this.state.detailed_deskripsi +
                            "', status='" + this.state.detailed_status + "', update_by=" + this.state.id_pengguna_login + ", price_terendah=" + (this.state.detailed_price_terendah.toString().split(',').join('')) +
                            ", jumlah_min_beli='" + this.state.detailed_minimum_pembelian + "', jumlah_min_nego='" + this.state.detailed_minimum_nego + "', " +
                            "persen_nego_1='" + this.state.detailed_nominal_persen_nego_pertama + "', persen_nego_2='" + this.state.detailed_nominal_persen_nego_kedua + "', persen_nego_3='" + this.state.detailed_nominal_persen_nego_ketiga + "', " +
                            "kode_barang='" + this.state.detailed_kode_barang_distributor + "'" +
                            " where id=" + this.state.detailed_id_list_barang + " returning update_date"
                            ,
                            `update gcm_listing_harga_barang set end_date=now() 
                            where id=${this.state.riwayatHargaBarang[this.state.riwayatHargaBarang.length - 1].id} returning end_date`
                            ,
                            is_update
                        )
                    }
                }
            }
            console.log("2")
            const resupdateBarang = await this.props.updateBarangStatus({ query: encrypt(passqueryupdatebarang) }).catch(err => err)

            if (resupdateBarang) {
                swal({
                    title: "Sukses!",
                    text: "Perubahan disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    this.loadDataBarang()
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
    }

    handleUpdateListingHargaBarang = (q_insert_harga, q_update_barang, q_update_harga, isChange) => {
        return isChange ?
            q_update_barang
            :
            q_insert_harga + "update_barang as (" + q_update_barang + ")" + q_update_harga
    }

    searchChange = (e) => {
        this.setState({
            searchValue: e.target.value,
        })
    }

    handleModalInsert = async () => {
        await this.loadRegisteredBarang()
        this.setState({
            isOpenInsert: !this.state.isOpenInsert,
            insert_foto: '',
            insert_price: '',
            insert_price_terendah: '',
            insert_foto_baru: '',
            insert_deskripsi: '',
            insert_kode_barang_distributor: '',
            id_barang_registered_insert: '0',
            kategori_barang_registered_insert: '',
            berat_barang_registered_insert: '',
            default_currency: 'USD',
            default_currency_terendah: 'USD',
            flag_status_insert_price: false,
            flag_status_insert_price_tertinggi: false,
            nama_satuan_barang_registered_insert: '',
            nama_singkat_satuan_barang_registered_insert: '',
            volume_barang_registered_insert: '',
            insert_minimum_nego: '',
            insert_minimum_pembelian: '',
            empty_insert_price: false,
            empty_insert_deskripsi: false,
            empty_insert_minimum_nego: false,
            empty_insert_minimum_pembelian: false,
            empty_insert_kode_barang_distributor: false,
            disable_insert_minimum_pembelian: true,
            disable_insert_minimum_nego: true,
            disable_insert_price: true,
            disable_insert_price_terendah: true,
            disable_insert_deskripsi: true,
            disable_insert_kode_barang_distributor: true,
            isBtnConfirmInsert: true,
            disable_btnconfirminsertkeduabarang: false,
            allCheckedKodeBarang: 0,
        })
        this.populateBarang('N')
    }


    resizeImage = (imgData, condition) => {
        const fileName = imgData.name
        const fileExtension = fileName.split(".")[1]
        if (imgData) {
            Resizer.imageFileResizer(
                imgData,
                400,
                400,
                fileExtension,
                100,
                0,
                uri => {
                    let data = null
                    let randNum = Math.round(Math.random() * 10000000) + 1
                    randNum = randNum * (Math.round(Math.random() * 10000000) + 1)
                    uri.blobImg.name = randNum.toString() + "." + fileExtension

                    if (condition.split("-")[0] === "insert") {
                        data = {
                            insert_foto: uri.base64Img,
                            insert_foto_baru: uri.blobImg
                        }
                        data.insertGambarBarang = true
                        if (condition.split("-")[1] === "1") {
                            data.isBtnConfirmInsert = false
                        }
                    }
                    if (condition.split("-")[0] === "edit") {
                        data = {
                            detailed_foto: uri.base64Img,
                            detailed_foto_baru: uri.blobImg
                        }
                        data.editGambarBarang = true
                        if (condition.split("-")[1] === "1") {
                            data.isBtnConfirmUpdate = false
                        }
                    }

                    if (condition.split("-")[0] === "iMaster") {
                        data = {
                            insert_foto_master: uri.base64Img,
                            insert_foto_master_baru: uri.blobImg
                        }
                        data.insertGambarBarangMaster = true
                        if (condition.split("-")[1] === "1") {
                            data.isBtnConfirmInsertMaster = false
                        }
                    }
                    this.setState(data)
                }
                ,
                'base64'
            );
        }
    }

    handleGambarInsert = (e) => {
        if (e.target.value !== '' &&
            this.state.id_barang_registered_insert !== '0' &&
            this.state.insert_deskripsi !== '' && this.state.insert_kode_barang_distributor !== '' &&
            (this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && Number(this.state.insert_minimum_pembelian) % Number(this.state.berat_barang_registered_insert) === 0) &&
            (this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
            (this.state.insert_price !== '' && this.state.insert_price !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
            (this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0' && this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true)) {

            this.resizeImage(e.target.files[0], "insert-1")
        } else if (e.target.value !== '') {
            this.resizeImage(e.target.files[0], "insert-2")
        } else if (e.target.value === '') {
            this.setState({
                insert_foto: '',
                insert_foto_baru: '',
                insertGambarBarang: false,
                errormessage: 'Harap pilih gambar barang yang akan dimasukkan!',
                isOpenPictureInserted: !this.state.isOpenPictureInserted,
                isBtnConfirmInsert: true
            })
        }
    }

    handleGambarInsertMaster = (e) => {
        if (e.target.value !== '' &&
            this.state.nama_barang_inserted !== '' &&
            this.state.id_category_barang_inserted !== '0' &&
            this.state.id_satuan_barang_inserted !== '0' &&
            (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
            (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted !== '' && this.state.insert_master_kode_barang_distributor !== '') {
            this.resizeImage(e.target.files[0], "iMaster-1")
        } else if (e.target.value !== '') {
            this.resizeImage(e.target.files[0], "iMaster-2")
        } else {
            this.setState({
                insert_foto_master: '',
                insert_foto_master_baru: '',
                insertGambarBarangMaster: false,
                errormessage: 'Harap pilih gambar barang yang akan dimasukkan!',
                isOpenPictureInserted: !this.state.isOpenPictureInserted,
                isBtnConfirmInsertMaster: true
            })
        }
    }

    confirmActionInsert = () => {
        this.setState({ disable_btnconfirminsertkeduabarang: true })
        this.uploadGambarBarang()
    }

    populateBarang = (id, nama, berat, volume, kategori) => {
        if (id === 'N') {
            this.setState({
                id_barang_registered_insert: '0',
                nama_barang_registered_insert: 'Pilih Barang'
            })
        } else {
            this.setState({
                id_barang_registered_insert: id,
                nama_barang_registered_insert: nama,
                berat_barang_registered_insert: berat,
                volume_barang_registered_insert: volume,
                kategori_barang_registered_insert: kategori
            })
        }
        if (this.state.insert_foto !== '' && this.state.insert_price !== '' && id !== 'N' && this.state.insert_deskripsi !== '') {
            this.setState({ isBtnConfirmInsert: false })
            document.getElementById('errorharga').style.display = 'none'
            this.setState({ empty_insert_price: false })
        } else {
            this.setState({ isBtnConfirmInsert: true })
        }
    }

    changeCurrency = async (x) => {
        this.setState({
            default_currency: x
        })
        if (this.state.insert_price.length > 0) {
            await this.setState({ insert_price: '', isBtnConfirmInsert: true })
        }
        if (x === 'IDR') {
            this.setState({ attentionmessage: 'Harga akan otomatis dikonversi sesuai kurs USD yang berlaku. Konversi menggunakan pembulatan nominal ke atas dua angka di belakang koma.' })
            this.handleModalAttention()
        }
        if ((this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
            (this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && Number(this.state.insert_minimum_pembelian) % Number(this.state.berat_barang_registered_insert) === 0) &&
            (this.state.insert_price !== '' && this.state.insert_price !== '0' && this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0' &&
                this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
            this.state.insert_deskripsi !== '' && this.state.insert_foto !== '') {
            this.setState({ isBtnConfirmInsert: false })
        }
    }

    changeCurrencyTerendah = async (x) => {
        this.setState({
            default_currency_terendah: x
        })
        if (this.state.insert_price_terendah.length > 0) {
            await this.setState({ insert_price_terendah: '', isBtnConfirmInsert: true })
        }
        if (x === 'IDR') {
            this.setState({ attentionmessage: 'Harga akan otomatis dikonversi sesuai kurs USD yang berlaku. Konversi menggunakan pembulatan nominal ke atas dua angka di belakang koma.' })
            this.handleModalAttention()
        }
        if ((this.state.insert_minimum_nego !== '' && this.state.insert_minimum_nego !== '0' && Number(this.state.insert_minimum_nego) % Number(this.state.berat_barang_registered_insert) === 0) &&
            (this.state.insert_minimum_pembelian !== '' && this.state.insert_minimum_pembelian !== '0' && Number(this.state.insert_minimum_pembelian) % Number(this.state.berat_barang_registered_insert) === 0) &&
            (this.state.insert_price !== '' && this.state.insert_price !== '0' && this.state.insert_price_terendah !== '' && this.state.insert_price_terendah !== '0' &&
                this.state.flag_status_insert_price === true && this.state.flag_status_insert_price_tertinggi === true) &&
            this.state.insert_deskripsi !== '' && this.state.insert_foto !== '') {
            this.setState({ isBtnConfirmInsert: false })
        }
    }

    changeCurrencyUpdate = (x) => {
        this.setState({
            default_currency_update: x,
        })
        if (this.state.detailed_price === '') {
            this.setState({ detailed_price: this.state.show_detailed_price })
        } else {
            this.setState({ detailed_price: this.state.show_detailed_price })
        }
        if (this.state.detailed_price_in_rupiah === '') {
            this.setState({ detailed_price_in_rupiah: this.state.show_detailed_price_in_rupiah })
        } else {
            this.setState({ detailed_price_in_rupiah: this.state.show_detailed_price_in_rupiah })
        }
        if (this.state.detailed_price !== '' || this.state.detailed_price_in_rupiah !== '') {
            document.getElementById('errorharga').style.display = 'none'
            this.setState({ empty_detailed_price: false })
        }
        if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
            (this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
            ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            this.state.detailed_deskripsi !== '' &&
            Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
            Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
            Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
            Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
            (this.state.detailed_nominal_persen_nego_pertama !== '') &&
            this.state.detailed_nominal_persen_nego_kedua !== '' &&
            this.state.detailed_nominal_persen_nego_ketiga !== '' &&
            this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
            this.setState({ isBtnConfirmUpdate: false })
        }
    }

    changeCurrencyUpdateTerendah = (x) => {
        this.setState({
            default_currency_update_terendah: x,
        })
        if (this.state.detailed_price_terendah === '') {
            this.setState({ detailed_price_terendah: this.state.show_detailed_price_terendah })
        } else {
            this.setState({ detailed_price_terendah: this.state.show_detailed_price_terendah })
        }
        if (this.state.detailed_price_in_rupiah_terendah === '') {
            this.setState({ detailed_price_in_rupiah_terendah: this.state.show_detailed_price_in_rupiah_terendah })
        } else {
            this.setState({ detailed_price_in_rupiah_terendah: this.state.show_detailed_price_in_rupiah_terendah })
        }
        if (this.state.detailed_price_terendah !== '' || this.state.detailed_price_in_rupiah_terendah !== '') {
            document.getElementById('errorhargaterendah').style.display = 'none'
            this.setState({ empty_detailed_price: false })
        }
        if ((this.state.detailed_minimum_nego !== '' && this.state.detailed_minimum_nego !== '0' && Number(this.state.detailed_minimum_nego) % Number(this.state.detailed_berat) === 0) &&
            (this.state.detailed_minimum_pembelian !== '' && this.state.detailed_minimum_pembelian !== '0' && Number(this.state.detailed_minimum_pembelian) % Number(this.state.detailed_berat) === 0) &&
            ((this.state.detailed_price_terendah !== '' && this.state.detailed_price_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            ((this.state.detailed_price_in_rupiah_terendah !== '' && this.state.detailed_price_in_rupiah_terendah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            ((this.state.detailed_price !== '' && this.state.detailed_price !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            ((this.state.detailed_price_in_rupiah !== '' && this.state.detailed_price_in_rupiah !== '0') || (this.state.flag_status_update_price === true && this.state.flag_status_update_price_tertinggi === true)) &&
            this.state.detailed_deskripsi !== '' &&
            Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_kedua) &&
            Number(this.state.detailed_nominal_persen_nego_pertama) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
            Number(this.state.detailed_nominal_persen_nego_kedua) >= Number(this.state.detailed_nominal_persen_nego_ketiga) &&
            Number(this.state.detailed_nominal_persen_nego_pertama) <= 100 &&
            this.state.detailed_nominal_persen_nego_pertama !== '' &&
            this.state.detailed_nominal_persen_nego_kedua !== '' &&
            this.state.detailed_nominal_persen_nego_ketiga !== '' &&
            this.state.detailed_kode_barang_distributor !== '' && this.state.detailed_kode_barang_distributor !== null) {
            this.setState({ isBtnConfirmUpdate: false })
        }
    }

    handleModalInsertMasterBarang = () => {
        this.handleModalInsert()
        this.setState({
            isOpenModalInsertMasterBarang: !this.state.isOpenModalInsertMasterBarang,
            empty_nama_barang_inserted: false,
            empty_berat_barang_inserted: false,
            empty_volume_barang_inserted: false,
            empty_ex_barang_inserted: false,
            empty_insert_price_master_barang: false,
            empty_insert_master_minimum_nego: false,
            empty_insert_master_minimum_pembelian: false,
            empty_insert_master_kode_barang_distributor: false,
            nama_barang_inserted: '',
            id_category_barang_inserted: '0',
            nama_category_barang_inserted: '',
            berat_barang_inserted: '',
            volume_barang_inserted: '',
            ex_barang_inserted: '',
            insert_foto_master: '',
            satuan_barang_inserted: '',
            alias_satuan_barang_inserted: '',
            insert_price_master_barang: '',
            insert_price_master_barang_terendah: '',
            insert_foto_master_baru: '',
            insert_master_minimum_nego: '',
            insert_master_minimum_pembelian: '',
            insert_deskripsi_master_barang: '',
            insert_master_kode_barang_distributor: '',
            default_currency_master_barang_terendah: 'USD',
            default_currency_master_barang: 'USD',
            feedback_insert_master_nama_barang: '',
            feedback_insert_master_minimum_nego: '',
            feedback_insert_master_minimum_pembelian: '',
            disable_insert_master_price: true,
            disable_insert_master_price_terendah: true,
            disable_insert_master_minimum_nego: true,
            disable_insert_master_minimum_pembelian: true,
            flag_status_insert_master_price: false,
            flag_status_insert_master_price_tertinggi: false,
            isBtnConfirmInsertMaster: true
        })
        // komentar
        // if (this.state.tipe_bisnis === '1') {
        //     this.setState({ id_category_barang_inserted:'0'})
        //     if (this.state.sa_divisi !== '1') {
        //         this.setState({ id_category_barang_inserted:this.state.sa_divisi})
        //     }
        // } else {
        //     this.setState({
        //         id_category_barang_inserted: this.state.tipe_bisnis
        //     })
        // }
    }

    handleDisposeModalInsertMasterBarang = () => {
        this.setState({
            isOpenModalInsertMasterBarang: !this.state.isOpenModalInsertMasterBarang
        })
    }

    changeCategoryInserted = async (id, kategori) => {
        await this.setState({
            id_category_barang_inserted: id,
            nama_category_barang_inserted: kategori
        })
        if (this.state.nama_barang_inserted !== '' &&
            this.state.id_category_barang_inserted !== '0' &&
            this.state.id_satuan_barang_inserted !== '0' &&
            (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
            (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
            (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            this.state.ex_barang_inserted !== '' && this.state.insert_deskripsi_master_barang !== '' &&
            this.state.insert_foto_master !== '' && this.state.insert_master_kode_barang_distributor !== '') {
            this.setState({ isBtnConfirmInsertMaster: false })
        }
    }

    handleKategoriBarang = () => {
        this.setState({
            isOpenKategori: !this.state.isOpenKategori
        })
    }

    changeSatuanInserted = async (id, satuan, alias) => {
        await this.setState({
            id_satuan_barang_inserted: id,
            satuan_barang_inserted: satuan,
            alias_satuan_barang_inserted: alias,
            disable_insert_master_price: false,
            disable_insert_master_price_terendah: false
        })
        if (this.state.nama_barang_inserted !== '' &&
            this.state.id_category_barang_inserted !== '0' &&
            this.state.id_satuan_barang_inserted !== '0' &&
            (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
            (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
            (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            this.state.ex_barang_inserted !== '' && this.state.insert_deskripsi_master_barang !== '' &&
            this.state.insert_foto_master !== '' && this.state.insert_master_kode_barang_distributor !== '') {
            this.setState({ isBtnConfirmInsertMaster: false })
        }
    }

    handleSatuanBarang = () => {
        this.setState({
            isOpenSatuan: !this.state.isOpenSatuan
        })
    }

    changeCurrencyMasterBarang = async (x) => {
        this.setState({
            default_currency_master_barang: x
        })
        if (this.state.insert_price_master_barang.length > 0) {
            await this.setState({ insert_price_master_barang: '', isBtnConfirmInsertMaster: true })
        }
        if (x === 'IDR') {
            this.setState({ attentionmessage: 'Harga akan otomatis dikonversi sesuai kurs USD yang berlaku. Konversi menggunakan pembulatan nominal ke atas dua angka di belakang koma.' })
            this.handleModalAttention()
        }
        // handle button
        if (this.state.nama_barang_inserted !== '' &&
            this.state.id_category_barang_inserted !== '0' &&
            this.state.id_satuan_barang_inserted !== '0' &&
            (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
            (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
            (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted !== '' && this.state.insert_foto_master !== '') {
            this.setState({ isBtnConfirmInsertMaster: false })
        }
    }

    changeCurrencyMasterBarangTerendah = async (x) => {
        this.setState({
            default_currency_master_barang_terendah: x
        })
        if (this.state.insert_price_master_barang_terendah.length > 0) {
            await this.setState({ insert_price_master_barang_terendah: '', isBtnConfirmInsertMaster: true })
        }
        if (x === 'IDR') {
            this.setState({ attentionmessage: 'Harga akan otomatis dikonversi sesuai kurs USD yang berlaku. Konversi menggunakan pembulatan nominal ke atas dua angka di belakang koma.' })
            this.handleModalAttention()
        }
        // handle button
        if (this.state.nama_barang_inserted !== '' &&
            this.state.id_category_barang_inserted !== '0' &&
            this.state.id_satuan_barang_inserted !== '0' &&
            (this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
            (this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0') &&
            (this.state.insert_master_minimum_nego !== '' && this.state.insert_master_minimum_nego !== '0' && Number(this.state.insert_master_minimum_nego) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_master_minimum_pembelian !== '' && this.state.insert_master_minimum_pembelian !== '0' && Number(this.state.insert_master_minimum_pembelian) % Number(this.state.berat_barang_inserted) === 0) &&
            (this.state.insert_price_master_barang !== '' && this.state.insert_price_master_barang !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            (this.state.insert_price_master_barang_terendah !== '' && this.state.insert_price_master_barang_terendah !== '0' && this.state.flag_status_insert_master_price === true && this.state.flag_status_insert_master_price_tertinggi === true) &&
            this.state.insert_deskripsi_master_barang !== '' && this.state.ex_barang_inserted !== '' && this.state.insert_foto_master !== '') {
            this.setState({ isBtnConfirmInsertMaster: false })
        }
    }


    handleModalConfirmInsertMasterBarang = async () => {
        await this.setState({ warningharga: '', warningberikutshowharga: '', warningshowhargaterendah: '', warningshowhargatertinggi: '' })
        if (this.state.nama_barang_inserted === '') { this.setState({ empty_nama_barang_inserted: true }) }
        if (this.state.insert_price_master_barang === '') { this.setState({ empty_insert_price_master_barang: true }) }
        if (this.state.berat_barang_inserted === '') { this.setState({ empty_berat_barang_inserted: true }) }
        if (this.state.volume_barang_inserted === '') { this.setState({ empty_volume_barang_inserted: true }) }
        if (this.state.ex_barang_inserted === '') { this.setState({ empty_ex_barang_inserted: true }) }
        if (this.state.id_category_barang_inserted === '0') {
            this.setState({
                errormessage: 'Harap pilih kategori barang!',
                isOpenPictureInserted: !this.state.isOpenPictureInserted
            })
        }
        if (this.state.insert_foto_master === '' && this.state.id_category_barang_inserted === '0') {
            this.setState({
                errormessage: 'Harap pilih kategori barang dan gambar barang yang akan dimasukkan!',
                isOpenPictureInserted: !this.state.isOpenPictureInserted
            })
        }
        if (this.state.insert_foto_master === '') {
            this.setState({
                errormessage: 'Harap pilih gambar barang yang akan dimasukkan!',
                isOpenPictureInserted: !this.state.isOpenPictureInserted
            })
        }

        if (this.state.default_currency_master_barang_terendah === 'IDR') { // harga_terendah IDR
            let a = this.state.insert_price_master_barang_terendah.toString().split('.').join('')
            let b = Math.round(a.split(',').join('.'))
            // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
            let hargaterendah = (b / this.state.kurs_now_manual).toFixed(2)
            if (this.state.default_currency_master_barang === 'USD') {
                let hargatertinggi = this.state.insert_price_master_barang.toString().split(',').join('')
                this.setState({
                    warningharga: 'Sistem mendeteksi penggunaan mata uang Rupiah untuk harga terendah. ' +
                        'Harga terendah akan dikonversi sesuai kurs USD yang berlaku saat ini. ',
                    warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                    warningshowhargaterendah:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargaterendah)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.alias_satuan_barang_inserted}
                        </div>,
                    warningshowhargatertinggi:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargatertinggi)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.alias_satuan_barang_inserted}
                        </div>
                })
            } else {
                let c = this.state.insert_price_master_barang.toString().split('.').join('')
                let d = Math.round(c.split(',').join('.'))
                // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                this.setState({
                    warningharga: 'Sistem mendeteksi penggunaan mata uang Rupiah untuk harga terendah dan harga tertinggi. ' +
                        'Harga terendah dan harga tertinggi akan dikonversi sesuai kurs USD yang berlaku saat ini. ',
                    warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                    warningshowhargaterendah:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargaterendah)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.alias_satuan_barang_inserted}
                        </div>,
                    warningshowhargatertinggi:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargatertinggi)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.alias_satuan_barang_inserted}
                        </div>
                })
            }
        } else { // harga_terendah USD
            let hargaterendah = this.state.insert_price_master_barang_terendah.toString().split(',').join('')
            if (this.state.default_currency_master_barang === 'USD') {
                let hargatertinggi = this.state.insert_price_master_barang.toString().split(',').join('')
                this.setState({
                    warningharga: '',
                    warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                    warningshowhargaterendah:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargaterendah)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.alias_satuan_barang_inserted}
                        </div>,
                    warningshowhargatertinggi:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargatertinggi)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.alias_satuan_barang_inserted}
                        </div>
                })
            } else {
                let c = this.state.insert_price_master_barang.toString().split('.').join('')
                let d = Math.round(c.split(',').join('.'))
                // let hargaterendah = Math.ceil(b / this.state.kurs_now_manual)
                let hargatertinggi = (d / this.state.kurs_now_manual).toFixed(2)
                this.setState({
                    warningharga: 'Sistem mendeteksi penggunaan mata uang Rupiah untuk harga tertinggi. ' +
                        'Harga tertinggi akan dikonversi sesuai kurs USD yang berlaku saat ini. ',
                    warningberikutshowharga: 'Berikut harga yang akan disimpan :',
                    warningshowhargaterendah:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Terendah : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargaterendah)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargaterendah * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargaterendah * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.alias_satuan_barang_inserted}
                        </div>,
                    warningshowhargatertinggi:
                        <div>
                            <p className="mb-0" style={{ fontWeight: 'bold' }}>Harga Tertinggi : </p>
                            <Badge color="warning" style={{ fontWeight: "bold" }}>
                                <NumberFormat value={Number(hargatertinggi)}
                                    displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                            </Badge>
                            {/* <NumberFormat value={parseInt(hargatertinggi * this.state.kurs_now_manual).toFixed(0)} */}
                            <NumberFormat value={Math.ceil(hargatertinggi * this.state.kurs_now_manual)}
                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.alias_satuan_barang_inserted}
                        </div>
                })
            }
        }

        await this.loadCheckingKodeBarang(this.state.insert_master_kode_barang_distributor)
        if (Number(this.state.allCheckedKodeBarang) > 0) {
            this.handleModalAttentionKodeBarang()
        } else {
            await this.setState({
                isOpenConfirmInsertMaster: !this.state.isOpenConfirmInsertMaster,
                empty_insert_master_nominal_persen_nego_pertama: false,
                empty_insert_master_nominal_persen_nego_kedua: false,
                empty_insert_master_nominal_persen_nego_ketiga: false,
                feedback_insert_master_nominal_persen_nego_pertama: '',
                feedback_insert_master_nominal_persen_nego_kedua: '',
                feedback_insert_master_nominal_persen_nego_ketiga: '',
                insert_master_nominal_persen_nego_pertama: '0',
                insert_master_nominal_persen_nego_kedua: '0',
                insert_master_nominal_persen_nego_ketiga: '0',
                isCheckedInsertMasterNominalPersen: false,
                isbtnConfirmInsertMasterKedua: false,
                disable_btnconfirminsertkeduamasterbarang: false
            })
        }

    }

    confirmActionInsertMaster = () => {
        this.setState({ disable_btnconfirminsertkeduamasterbarang: true })
        this.uploadGambarBarang()
    }

    handleWhiteSpaceSearchField = (e) => {
        if (e.which === 32 && !this.state.searchValue.length) {
            e.preventDefault()
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

    handlePageChange = (pageNumber) => {
        this.setState({ activePage: pageNumber })
        this.controlDataPagination(pageNumber)
    }

    controlDataPagination = (pgnm) => {
        this.setState({ slicex: (pgnm * 8) - 8, slicey: pgnm * 8 })
    }

    toggleChangeInsertNominalPersen = async () => {
        await this.setState({
            isCheckedInsertNominalPersen: !this.state.isCheckedInsertNominalPersen,
            empty_insert_nominal_persen_nego_pertama: false,
            empty_insert_nominal_persen_nego_kedua: false,
            empty_insert_nominal_persen_nego_ketiga: false,
            feedback_insert_nominal_persen_nego_pertama: '',
            feedback_insert_nominal_persen_nego_kedua: '',
            feedback_insert_nominal_persen_nego_ketiga: '',
            insert_nominal_persen_nego_pertama: '',
            insert_nominal_persen_nego_kedua: '',
            insert_nominal_persen_nego_ketiga: '',
            disable_insert_persen_nego_kedua: true,
            disable_insert_persen_nego_ketiga: true
        })
        if (this.state.isCheckedInsertNominalPersen === true) {
            document.getElementById('field_insert_nominal_persen_nego_pertama').style.display = 'block'
            document.getElementById('field_insert_nominal_persen_nego_kedua').style.display = 'block'
            document.getElementById('field_insert_nominal_persen_nego_ketiga').style.display = 'block'
            this.setState({ isbtnConfirmInsertKedua: true })
        } else {
            document.getElementById('field_insert_nominal_persen_nego_pertama').style.display = 'none'
            document.getElementById('field_insert_nominal_persen_nego_kedua').style.display = 'none'
            document.getElementById('field_insert_nominal_persen_nego_ketiga').style.display = 'none'
            await this.setState({
                isbtnConfirmInsertKedua: false,
                insert_nominal_persen_nego_pertama: '0',
                insert_nominal_persen_nego_kedua: '0',
                insert_nominal_persen_nego_ketiga: '0'
            })
        }
    }

    toggleChangeInsertMasterNominalPersen = async () => {
        await this.setState({
            isCheckedInsertMasterNominalPersen: !this.state.isCheckedInsertMasterNominalPersen,
            empty_insert_master_nominal_persen_nego_pertama: false,
            empty_insert_master_nominal_persen_nego_kedua: false,
            empty_insert_master_nominal_persen_nego_ketiga: false,
            feedback_insert_master_nominal_persen_nego_pertama: '',
            feedback_insert_master_nominal_persen_nego_kedua: '',
            feedback_insert_master_nominal_persen_nego_ketiga: '',
            insert_master_nominal_persen_nego_pertama: '',
            insert_master_nominal_persen_nego_kedua: '',
            insert_master_nominal_persen_nego_ketiga: '',
            disable_insert_master_persen_nego_kedua: true,
            disable_insert_master_persen_nego_ketiga: true
        })
        if (this.state.isCheckedInsertMasterNominalPersen === true) {
            document.getElementById('field_insert_master_nominal_persen_nego_pertama').style.display = 'block'
            document.getElementById('field_insert_master_nominal_persen_nego_kedua').style.display = 'block'
            document.getElementById('field_insert_master_nominal_persen_nego_ketiga').style.display = 'block'
            this.setState({ isbtnConfirmInsertMasterKedua: true })
        } else {
            document.getElementById('field_insert_master_nominal_persen_nego_pertama').style.display = 'none'
            document.getElementById('field_insert_master_nominal_persen_nego_kedua').style.display = 'none'
            document.getElementById('field_insert_master_nominal_persen_nego_ketiga').style.display = 'none'
            await this.setState({
                isbtnConfirmInsertMasterKedua: false,
                insert_master_nominal_persen_nego_pertama: '0',
                insert_master_nominal_persen_nego_kedua: '0',
                insert_master_nominal_persen_nego_ketiga: '0'
            })
        }
    }

    handleModalAttention = () => {
        this.setState({ isOpenAttention: !this.state.isOpenAttention })
    }

    handleModalAttentionTerdaftar = () => {
        this.setState({ isOpenAttentionTerdaftar: !this.state.isOpenAttentionTerdaftar })
    }

    handleWindowReload = () => {
        window.location.reload()
    }

    handleModalAttentionKodeBarangConfirmKedua = () => {
        this.setState({ isOpenAttentionKodeBarangConfirmKedua: !this.state.isOpenAttentionKodeBarangConfirmKedua })
    }

    dateFilterHandler = e => {
        const { name, value } = e.target

        if (name === "start_date") {
            this.setState({ startDateRiwayatHarga: value })
        } else {
            this.setState({ endDateRiwayatHarga: value })
        }


    }

    dateFilterSubmit = () => {
        const start = new Date(this.state.startDateRiwayatHarga)
        const end = new Date(this.state.endDateRiwayatHarga)

        if (this.state.startDateRiwayatHarga !== "" && this.state.endDateRiwayatHarga !== "") {
            const newHarga = this.state.riwayatHargaBarang.filter(data => {
                const startData = new Date(data.start_date)
                const endData = new Date(data.end_date)

                if (startData >= start && endData <= end) {
                    return data
                }
            })

            this.setState({ filterDataRiwayatHarga: newHarga })
        }
        else {
            this.setState({ filterDataRiwayatHarga: this.state.riwayatHargaBarang })
        }

        // this.state.filterDataRiwayatHarga
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
        const showAllDataBarangPagination = showAllDataBarang.slice(this.state.slicex, this.state.slicey)
        const showFilteredDataBarangPagination = showFilteredDataBarang.slice(this.state.slicex, this.state.slicey)
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
                                    <div className="page-title-subheading">Daftar barang yang terdaftar pada {this.state.company_name}</div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                <div className="row">
                                    {
                                        this.state.kurs_now_manual === undefined ?
                                            <button className="mr-2 btn btn-danger active">Tidak ada kurs berlaku</button>
                                            :
                                            <button className="mr-2 btn btn-success active">Kurs berlaku :
                                            <NumberFormat value={Number(this.state.kurs_now_manual)} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'  IDR '}></NumberFormat>
                                            </button>
                                    }
                                </div>
                                <div className="row" style={{ paddingTop: '2%' }}>
                                    {
                                        (this.state.sa_role === 'admin') ?
                                            <ButtonDropdown direction="left" isOpen={this.state.isOpenPPN} toggle={this.handlePPN}>
                                                <DropdownToggle caret color="danger" title="PPN Transaksi">
                                                    &nbsp;&nbsp;PPN Transaksi : {this.state.company_info_ppn}%
                                            </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem disabled>PPN Transaksi :&nbsp;&nbsp;{this.state.company_info_ppn}%</DropdownItem>
                                                    <DropdownItem onClick={this.handleModalPPN}>Perbarui </DropdownItem>
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                            : <button className="mr-2 btn btn-danger">PPN Transaksi : {this.state.company_info_ppn}%</button>
                                    }
                                </div>
                                <div className="row" style={{ paddingTop: '2%' }}>
                                    {
                                        (this.state.tipe_bisnis === '1' && this.state.sa_divisi === '1') ?
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
                                            :
                                            // false
                                            <ButtonDropdown direction="left" isOpen={this.state.isOpenFilter} toggle={this.handleFilter}>
                                                <DropdownToggle caret color="primary" title="Filter berdasarkan kategori barang">
                                                    <i className="fa fa-fw" aria-hidden="true"></i>
                                                &nbsp;&nbsp;{this.state.selectedFilter}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => this.filterBarang('S')}>Semua</DropdownItem>
                                                    {
                                                        this.state.allCategoryKhusus.map(allCategoryKhusus => {
                                                            return <DropdownItem onClick={() => this.filterBarang(allCategoryKhusus.id, allCategoryKhusus.nama)}>{allCategoryKhusus.nama}</DropdownItem>
                                                        })
                                                    }
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main-card mb-3 card">
                        <div className="no-gutters row">
                            <div className="col-md-12">
                                <div className="widget-content">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupPrepend">
                                                <i className="pe-7s-search"> </i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control" id="searchValue"
                                            placeholder="Cari Barang" aria-describedby="inputGroupPrepend" onKeyPress={this.handleWhiteSpaceSearchField} onChange={this.searchChange}></Input>
                                        {
                                            (this.state.sa_role === 'admin') ?
                                                <button className="sm-2 mr-2 btn btn-primary" style={{ marginLeft: '2%' }} title="Tambah barang" onClick={this.handleModalInsert}>
                                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                                </button>
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {
                            (statusFilter && showFilteredDataBarangPagination.length !== 0) ?
                                showFilteredDataBarangPagination.map(showFilteredDataBarangPagination => {
                                    return <BarangComponent key={showFilteredDataBarangPagination.id}
                                        data={showFilteredDataBarangPagination}
                                        // kurs_now={this.state.kurs_now}
                                        kurs_now={this.state.kurs_now_manual}
                                        detail={this.handleDetailBarang}
                                        sa_role={this.state.sa_role}
                                    />
                                }) : (!statusFilter && showAllDataBarangPagination.length !== 0) ?
                                    showAllDataBarangPagination.map(showAllDataBarangPagination => {
                                        return <BarangComponent key={showAllDataBarangPagination.id}
                                            data={showAllDataBarangPagination}
                                            // kurs_now={this.state.kurs_now}
                                            kurs_now={this.state.kurs_now_manual}
                                            detail={this.handleDetailBarang}
                                            sa_role={this.state.sa_role}
                                        />
                                    }) : (statusFilter) ?
                                        showFilteredDataBarang.map(showFilteredDataBarang => {
                                            return <BarangComponent key={showFilteredDataBarang.id}
                                                data={showFilteredDataBarang}
                                                // kurs_now={this.state.kurs_now}
                                                kurs_now={this.state.kurs_now_manual}
                                                detail={this.handleDetailBarang}
                                                sa_role={this.state.sa_role}
                                            />
                                        }) :
                                        showAllDataBarang.map(showAllDataBarang => {
                                            return <BarangComponent key={showAllDataBarang.id}
                                                data={showAllDataBarang}
                                                // kurs_now={this.state.kurs_now}
                                                kurs_now={this.state.kurs_now_manual}
                                                detail={this.handleDetailBarang}
                                                sa_role={this.state.sa_role}
                                            />
                                        })
                        }
                    </div>
                    <div style={{ width: '100%' }}>
                        <div style={{ margin: '0 auto', display: 'table' }}>
                            {
                                (showFilteredDataBarang.length === 0 && statusFilter === true) ?
                                    <p> Data tidak ditemukan </p>
                                    : (showFilteredDataBarang.length !== 0) ?
                                        <Pagination
                                            prevPageText='Previous'
                                            nextPageText='Next'
                                            activePage={this.state.activePage}
                                            itemsCountPerPage={8}
                                            totalItemsCount={(statusFilter) ? showFilteredDataBarang.length : showAllDataBarang.length}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange}
                                        />
                                        : (showAllDataBarang.length !== 0) ?
                                            <Pagination
                                                prevPageText='Previous'
                                                nextPageText='Next'
                                                activePage={this.state.activePage}
                                                itemsCountPerPage={8}
                                                totalItemsCount={(statusFilter) ? showFilteredDataBarang.length : showAllDataBarang.length}
                                                pageRangeDisplayed={5}
                                                onChange={this.handlePageChange}
                                            />
                                            : <p> Data tidak ditemukan </p>
                            }
                        </div>
                    </div>
                </div>

                {/* Modal PopUp */}
                <Modal size="lg" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>
                        {/* { (this.state.detailed_status === 'R') ? 'Edit Pengajuan Barang' 
                            : (this.state.detailed_status === 'C' && this.state.detailed_status_master === 'I') ? 'Detail Pengajuan Barang' 
                            : (this.state.detailed_status !== 'C') ? 'Edit Barang' 
                            : 'Detail Pengajuan Barang'
                        } */}
                        {(this.state.detailed_status === 'R' && this.state.sa_role === 'admin') ? 'Edit Pengajuan Barang'
                            : (this.state.detailed_status === 'C' && this.state.detailed_status_master === 'I') ? 'Detail Pengajuan Barang'
                                : (this.state.detailed_status !== 'C' && this.state.sa_role === 'admin') ? 'Edit Barang'
                                    : (this.state.detailed_status === 'R' && this.state.sa_role !== 'admin') ? 'Detail Pengajuan Barang'
                                        : (this.state.detailed_status === 'C' && this.state.detailed_status_master === 'I') ? 'Detail Pengajuan Barang'
                                            : (this.state.detailed_status !== 'C' && this.state.sa_role !== 'admin') ? 'Detail Barang'
                                                : 'Detail Pengajuan Barang'
                        }
                    </ModalHeader>
                    <ModalBody>
                        <div className="card-body">
                            <div style={{ marginTop: '3%' }}>
                                <div style={{ width: '50%', float: 'left', paddingRight: '3%' }}>
                                    <img src={(this.state.detailed_foto === '') ? "assets/images/default_image_not_found.jpg" : this.state.detailed_foto} alt="" style={{ width: "50%" }} />
                                    {
                                        (this.state.detailed_status !== 'C') && (this.state.sa_role === 'admin') ?
                                            <div>
                                                <Input type="file" accept="image/*" className="insert-gambar"
                                                    onChange={this.handleGambarEdit} style={{ marginTop: '5%' }} />
                                            </div>
                                            : false
                                    }
                                    <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '5%' }}> Kode Barang Distributor</p>
                                    {
                                        (this.state.detailed_status === 'C') || (this.state.sa_role !== 'admin') ?
                                            <p className="mb-0">
                                                {((this.state.detailed_kode_barang_distributor === null) || (this.state.detailed_kode_barang_distributor === '')) ? 'Tidak ada kode barang' : this.state.detailed_kode_barang_distributor} </p>
                                            :
                                            <Input type="text" name="detailed_kode_barang_distributor" id="detailed_kode_barang_distributor" className="form-control"
                                                onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                value={this.state.detailed_kode_barang_distributor}
                                                invalid={this.state.empty_detailed_kode_barang_distributor}
                                            // disabled={this.state.disable_insert_}
                                            />
                                    }
                                    <FormFeedback>{this.state.feedback_detailed_kode_barang_distributor}</FormFeedback>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Deskripsi Barang</p>
                                    {
                                        // (this.state.detailed_status === 'C') ?
                                        (this.state.detailed_status === 'C') || (this.state.sa_role !== 'admin') ?
                                            <p className="mb-0">{((this.state.detailed_deskripsi === null) || (this.state.detailed_deskripsi === '')) ? 'Tidak ada deskripsi' : this.state.detailed_deskripsi} </p>
                                            :
                                            <Input type="textarea" name="detailed_deskripsi" rows="4"
                                                value={(this.state.detailed_deskripsi === null) || (this.state.detailed_deskripsi === '') ? '' : this.state.detailed_deskripsi}
                                                invalid={this.state.empty_detailed_deskripsi}
                                                onChange={this.handleChange}
                                                maxLength="100"
                                                onKeyPress={this.handleWhiteSpace} />
                                    }
                                    <FormFeedback>{this.state.feedback_detailed_deskripsi}</FormFeedback>
                                </div>

                                {/* ---------------------------------------------------------------------------------------------------- */}
                                {/* ---------------------------------------------------------------------------------------------------- */}
                                {/* ---------------------------------------------------------------------------------------------------- */}


                                <div style={{ width: '50%', float: 'right' }}>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Barang</p>
                                    <p className="mb-0">{this.state.detailed_nama} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kategori Barang</p>
                                    <p className="mb-0">{this.state.detailed_kategori} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Berat / Volume Barang</p>
                                    <p className="mb-0">{this.state.detailed_berat} / {this.state.detailed_volume}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Satuan Barang</p>
                                    <p className="mb-0">{(this.state.detailed_nama_satuan === '') ? '-' : this.state.detailed_nama_satuan}
                                        {(this.state.detailed_nama_singkat_satuan === '') ? ' ' : ' (' + this.state.detailed_nama_singkat_satuan + ') '}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.detailed_nama_singkat_satuan === '') ? 'Jumlah Minimum Pembelian' : 'Jumlah Minimum Pembelian (@' + this.state.detailed_nama_singkat_satuan + ') '}
                                    </p>
                                    {
                                        // (this.state.detailed_status !== 'C') ?
                                        (this.state.detailed_status !== 'C') && (this.state.sa_role === 'admin') ?
                                            <div>
                                                <Input type="text" name="detailed_minimum_pembelian" id="detailed_minimum_pembelian" className="form-control"
                                                    onChange={this.handleChange}
                                                    onKeyPress={this.handleWhiteSpaceNumber}
                                                    invalid={this.state.empty_detailed_minimum_pembelian}
                                                    value={this.state.detailed_minimum_pembelian}
                                                />
                                                <FormFeedback>{this.state.feedback_detailed_minimum_pembelian}</FormFeedback>
                                            </div>
                                            : <p className="mb-0">{Number(this.state.detailed_minimum_pembelian)}</p>
                                    }

                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.detailed_nama_singkat_satuan === '') ? 'Jumlah Minimum Nego' : 'Jumlah Minimum Nego (@' + this.state.detailed_nama_singkat_satuan + ') '}
                                    </p>
                                    {
                                        // (this.state.detailed_status !== 'C') ?
                                        (this.state.detailed_status !== 'C') && (this.state.sa_role === 'admin') ?
                                            <div>
                                                <Input type="text" name="detailed_minimum_nego" id="detailed_minimum_nego" className="form-control"
                                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                    invalid={this.state.empty_detailed_minimum_nego}
                                                    value={this.state.detailed_minimum_nego} />
                                                <FormFeedback>{this.state.feedback_detailed_minimum_nego}</FormFeedback>
                                            </div>
                                            : <p className="mb-0">{Number(this.state.detailed_minimum_nego)}</p>
                                    }
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nominal Persen Nego 1 ( % )</p>
                                    {
                                        // (this.state.detailed_status !== 'C') ?
                                        (this.state.detailed_status !== 'C') && (this.state.sa_role === 'admin') ?
                                            <div>
                                                <Input type="text" name="detailed_nominal_persen_nego_pertama" id="detailed_nominal_persen_nego_pertama" className="form-control"
                                                    onChange={this.handleChange}
                                                    onKeyPress={this.handleWhiteSpaceNumber}
                                                    invalid={this.state.empty_detailed_nominal_persen_nego_pertama}
                                                    value={this.state.detailed_nominal_persen_nego_pertama}
                                                />
                                                <FormFeedback>{this.state.feedback_detailed_nominal_persen_nego_pertama}</FormFeedback>
                                            </div>
                                            : <p className="mb-0">{Number(this.state.detailed_nominal_persen_nego_pertama)}</p>
                                    }
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nominal Persen Nego 2 ( % )</p>
                                    {
                                        // (this.state.detailed_status !== 'C') ?
                                        (this.state.detailed_status !== 'C') && (this.state.sa_role === 'admin') ?
                                            <div>
                                                <Input type="text" name="detailed_nominal_persen_nego_kedua" id="detailed_nominal_persen_nego_kedua" className="form-control"
                                                    onChange={this.handleChange}
                                                    onKeyPress={this.handleWhiteSpaceNumber}
                                                    invalid={this.state.empty_detailed_nominal_persen_nego_kedua}
                                                    value={this.state.detailed_nominal_persen_nego_kedua}
                                                />
                                                <FormFeedback>{this.state.feedback_detailed_nominal_persen_nego_kedua}</FormFeedback>
                                            </div>
                                            : <p className="mb-0">{Number(this.state.detailed_nominal_persen_nego_kedua)}</p>
                                    }
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nominal Persen Nego 3 ( % )</p>
                                    {
                                        // (this.state.detailed_status !== 'C') ?
                                        (this.state.detailed_status !== 'C') && (this.state.sa_role === 'admin') ?
                                            <div>
                                                <Input type="text" name="detailed_nominal_persen_nego_ketiga" id="detailed_nominal_persen_nego_ketiga" className="form-control"
                                                    onChange={this.handleChange}
                                                    onKeyPress={this.handleWhiteSpaceNumber}
                                                    invalid={this.state.empty_detailed_nominal_persen_nego_ketiga}
                                                    value={this.state.detailed_nominal_persen_nego_ketiga}
                                                />
                                                <FormFeedback>{this.state.feedback_detailed_nominal_persen_nego_ketiga}</FormFeedback>
                                            </div>
                                            : <p className="mb-0">{Number(this.state.detailed_nominal_persen_nego_ketiga)}</p>
                                    }

                                    {/* <p className="mb-0" style={{fontWeight:'bold'}}>{(this.state.detailed_status === 'C') ? 'Harga Terendah Barang ' : 'Harga Terendah Barang (@'+this.state.detailed_nama_singkat_satuan+')'}</p> */}
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>{(this.state.detailed_status === 'C') || (this.state.sa_role !== 'admin') ? 'Harga Terendah Barang ' : 'Harga Terendah Barang (@' + this.state.detailed_nama_singkat_satuan + ')'}</p>
                                    <div className="input-group">
                                        <div className="input-group-prepend" style={{ width: '100%' }}>
                                            {
                                                // (this.state.detailed_status !== 'C') ?
                                                (this.state.detailed_status !== 'C') && (this.state.sa_role === 'admin') ?
                                                    <ButtonDropdown isOpen={this.state.isOpenCurrencyUpdateBarangTerendah}
                                                        toggle={this.handleDropDownCurrencyUpdateBarangTerendah} style={{ width: '100%' }}>
                                                        <DropdownToggle caret color="light" title="Daftar mata uang yang tersedia">
                                                            {this.state.default_currency_update_terendah}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem onClick={() => this.changeCurrencyUpdateTerendah('USD')}>USD</DropdownItem>
                                                            <DropdownItem onClick={() => this.changeCurrencyUpdateTerendah('IDR')}>IDR</DropdownItem>
                                                        </DropdownMenu>
                                                    </ButtonDropdown>
                                                    :
                                                    <div>
                                                        <Badge color="warning" style={{ fontWeight: "bold" }}>
                                                            <NumberFormat value={Number(this.state.detailed_price_terendah)}
                                                                displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                                        </Badge>
                                                        {/* <NumberFormat value={parseInt(this.state.detailed_price_terendah * this.state.kurs_now).toFixed(0)}
                                                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> */}
                                                        {/* <NumberFormat value={parseInt(this.state.detailed_price_terendah * this.state.kurs_now_manual).toFixed(0)}
                                                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan} */}
                                                        <NumberFormat value={this.state.detailed_price_in_rupiah_terendah}
                                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                                                    </div>
                                            }
                                            {
                                                // (this.state.detailed_status !== 'C' && this.state.default_currency_update_terendah === 'IDR') ?
                                                (this.state.detailed_status !== 'C' && this.state.default_currency_update_terendah === 'IDR' && this.state.sa_role === 'admin') ?
                                                    // <Input type="number" placeholder="Harga" name="detailed_price"
                                                    //     value={this.state.detailed_price} onChange={ this.handleChange} required 
                                                    //     className="form-control" invalid={this.state.empty_detailed_price} />
                                                    <NumberFormat allowNegative={false} value={this.state.detailed_price_in_rupiah_terendah} thousandSeparator='.' decimalSeparator=',' decimalScale={2}
                                                        name="detailed_price_in_rupiah_terendah" id="detailed_price_in_rupiah_terendah" onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                        className="form-control"></NumberFormat> :
                                                    // (this.state.detailed_status !== 'C' && this.state.default_currency_update_terendah === 'USD') ?
                                                    (this.state.detailed_status !== 'C' && this.state.default_currency_update_terendah === 'USD' && this.state.sa_role === 'admin') ?
                                                        <NumberFormat allowNegative={false} value={this.state.detailed_price_terendah} thousandSeparator=',' decimalSeparator='.' decimalScale={2}
                                                            name="detailed_price_terendah" id="detailed_price_terendah" onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                            className="form-control"></NumberFormat> :
                                                        false
                                            }
                                        </div>
                                        <div id="errorhargaterendah" style={{ display: 'none' }}>
                                            <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.errormessageterendah}</p>
                                        </div>
                                        <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                    </div>
                                    {/* <p className="mb-0" style={{fontWeight:'bold'}}>{(this.state.detailed_status === 'C') ? 'Harga Tertinggi Barang' : 'Harga Tertinggi Barang (@'+this.state.detailed_nama_singkat_satuan+')'}</p> */}
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>{(this.state.detailed_status === 'C') || (this.state.sa_role !== 'admin') ? 'Harga Tertinggi Barang' : 'Harga Tertinggi Barang (@' + this.state.detailed_nama_singkat_satuan + ')'}</p>
                                    <div className="input-group">
                                        <div className="input-group-prepend" style={{ width: '100%' }}>
                                            {
                                                // (this.state.detailed_status !== 'C') ?
                                                (this.state.detailed_status !== 'C') && (this.state.sa_role === 'admin') ?
                                                    <ButtonDropdown isOpen={this.state.isOpenCurrencyUpdateBarang} toggle={this.handleDropDownCurrencyUpdateBarang} style={{ width: '100%' }}>
                                                        <DropdownToggle caret color="light" title="Daftar mata uang yang tersedia">
                                                            {this.state.default_currency_update}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem onClick={() => this.changeCurrencyUpdate('USD')}>USD</DropdownItem>
                                                            <DropdownItem onClick={() => this.changeCurrencyUpdate('IDR')}>IDR</DropdownItem>
                                                        </DropdownMenu>
                                                    </ButtonDropdown>
                                                    :
                                                    <div>
                                                        <Badge color="warning" style={{ fontWeight: "bold" }}>
                                                            <NumberFormat value={this.state.detailed_price}
                                                                displayType={'text'} style={{ fontWeight: "bold" }} thousandSeparator={true} prefix={'USD '}></NumberFormat>
                                                        </Badge>
                                                        {/* <NumberFormat value={parseInt(this.state.detailed_price * this.state.kurs_now).toFixed(0)}
                                                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> */}
                                                        {/* <NumberFormat value={parseInt(this.state.detailed_price * this.state.kurs_now_manual).toFixed(0)}
                                                                displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan} */}
                                                        <NumberFormat value={this.state.detailed_price_in_rupiah}
                                                            displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'   IDR '}></NumberFormat> / {this.state.detailed_nama_singkat_satuan}
                                                    </div>
                                            }
                                            {
                                                // (this.state.detailed_status !== 'C' && this.state.default_currency_update === 'IDR') ?
                                                (this.state.detailed_status !== 'C' && this.state.default_currency_update === 'IDR' && this.state.sa_role === 'admin') ?
                                                    // <Input type="number" placeholder="Harga" name="detailed_price"
                                                    //     value={this.state.detailed_price} onChange={ this.handleChange} required 
                                                    //     className="form-control" invalid={this.state.empty_detailed_price} />
                                                    <NumberFormat allowNegative={false} value={this.state.detailed_price_in_rupiah} thousandSeparator='.' decimalSeparator=','
                                                        name="detailed_price_in_rupiah" id="detailed_price_in_rupiah" onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                                        decimalScale={2}
                                                        className="form-control"></NumberFormat> :
                                                    // (this.state.detailed_status !== 'C' && this.state.default_currency_update === 'USD') ?
                                                    (this.state.detailed_status !== 'C' && this.state.default_currency_update === 'USD' && this.state.sa_role === 'admin') ?
                                                        <NumberFormat allowNegative={false} value={this.state.detailed_price} thousandSeparator=',' decimalSeparator='.'
                                                            name="detailed_price" id="detailed_price" onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber} decimalScale={2}
                                                            className="form-control"></NumberFormat> :
                                                        false
                                            }
                                        </div>
                                        <div id="errorharga" style={{ display: 'none' }}>
                                            <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.errormessage}</p>
                                        </div>
                                        <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                    </div>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Status Barang</p>
                                    {
                                        // (this.state.detailed_status !== 'C' && this.state.detailed_status !== 'R' && this.state.detailed_status_master !== 'I') ?
                                        (this.state.detailed_status !== 'C' && this.state.detailed_status !== 'R' && this.state.detailed_status_master !== 'I' && this.state.sa_role === 'admin') ?
                                            <ButtonDropdown isOpen={this.state.isOpenStatus} toggle={this.handleStatusBarang}>
                                                <DropdownToggle caret color={this.state.detailed_status === 'A' ? "success" : "danger"}>
                                                    {this.state.detailed_status === 'A' ? 'Tersedia' : 'Tidak Tersedia'}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => this.changeStatus('A')}>Tersedia</DropdownItem>
                                                    <DropdownItem onClick={() => this.changeStatus('I')}>Tidak Tersedia</DropdownItem>
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                            : (this.state.detailed_status_master === 'I') ?
                                                <p className="mb-0">Dinonaktifkan oleh GLOB</p>
                                                : <p className="mb-0">
                                                    {(this.state.detailed_status === 'C') ? 'Proses Konfirmasi' :
                                                        (this.state.detailed_status === 'R') ? 'Ditolak' :
                                                            (this.state.detailed_status === 'A') ? 'Tersedia' : 'Tidak Tersedia'}</p>
                                    }
                                    <Button color="danger" style={{ float: "right" }} onClick={() => this.setState({ isRiwayatHargaOpen: true })}>Riwayat Harga</Button>
                                    {
                                        <Modal size="lg" toggle={this.handleModalConfirm} isOpen={this.state.isRiwayatHargaOpen} backdrop="static" keyboard={false} >
                                            <ModalHeader >Riwayat Harga</ModalHeader>
                                            <ModalBody style={{ padding: "2rem" }}>
                                                <FormGroup style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    marginBottom: "1rem"
                                                }}>
                                                    <div style={{ width: '30%', marginRight: '1rem' }}>
                                                        <Label for="starteDate">Start Date</Label>
                                                        <Input
                                                            type="date"
                                                            name="start_date"
                                                            id="startDate"
                                                            placeholder="start date placeholder"
                                                            onChange={this.dateFilterHandler}
                                                        />
                                                    </div>
                                                    <div style={{ width: '30%', marginRight: '1rem' }}>
                                                        <Label for="exampleDate">End Date</Label>
                                                        <Input
                                                            type="date"
                                                            name="end_date"
                                                            id="endDate"
                                                            placeholder="end date placeholder"
                                                            onChange={this.dateFilterHandler}
                                                        />
                                                    </div>
                                                    <Button color="primary" onClick={this.dateFilterSubmit}>Filter</Button>
                                                </FormGroup>
                                                <MDBDataTable
                                                    bordered
                                                    striped
                                                    responsive
                                                    hover
                                                    data={{
                                                        columns: [
                                                            {
                                                                label: 'Harga(USD)',
                                                                field: 'harga'
                                                            },
                                                            {
                                                                label: 'Harga Terendah(USD)',
                                                                field: 'harga_terendah'
                                                            },
                                                            {
                                                                label: "Tanggal Mulai Berlaku",
                                                                field: "start_date"
                                                            },
                                                            {
                                                                label: "Tanggal Berakhir",
                                                                field: "end_date"
                                                            }
                                                        ],
                                                        rows: this.state.filterDataRiwayatHarga

                                                    }}
                                                />
                                                <Button color="danger" style={{ float: "right" }} onClick={() => this.setState({ isRiwayatHargaOpen: false })}>Close</Button>
                                            </ModalBody>

                                        </Modal>
                                    }
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    {
                        // (this.state.detailed_status === 'R') ?
                        (this.state.detailed_status === 'R' && this.state.sa_role === 'admin') ?
                            <ModalFooter>
                                <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnConfirmUpdate}>Ajukan Ulang</Button>
                                <Button color="danger" onClick={this.handleModalDetail}>Batal</Button>
                            </ModalFooter>
                            // : (this.state.detailed_status !== 'C') ?
                            : (this.state.detailed_status !== 'C' && this.state.sa_role === 'admin') ?
                                <ModalFooter>
                                    <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnConfirmUpdate}>Perbarui</Button>
                                    <Button color="danger" onClick={this.handleModalDetail}>Batal</Button>
                                </ModalFooter>
                                : false
                    }

                </Modal>



                {/* Modal Confirm Update*/}
                <Modal size="md" toggle={this.handleModalConfirm} isOpen={this.state.isOpenConfirm} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={(this.state.disable_btnconfirmupdate === false) ? this.handleModalConfirm : false}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <div>
                                <label>
                                    {/* {
                                        (this.state.warningharga !== '' && this.state.warninghargaterendah === '') ?
                                            this.state.warningharga
                                        : (this.state.warningharga === '' && this.state.warninghargaterendah !== '') ?
                                            this.state.warninghargaterendah
                                        : ""
                                    } */}
                                    {this.state.warningharga}
                                    {this.state.warningberikutshowharga}
                                </label>
                            </div>
                            <label>
                                {this.state.warningshowhargaterendah}
                                {this.state.warningshowhargatertinggi}
                            </label>
                            <div>
                                <label>Apakah yakin akan melakukan aksi ini?</label>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button color="primary" onClick={this.confirmAction}>Perbarui</Button> */}
                        <ButtonCustom onClick={this.confirmAction} title={
                            (this.state.detailed_status === 'R' && this.state.sa_role === 'admin') ?
                                "Ajukan ulang" : "Perbarui"
                        } loading={this.props.isLoading}></ButtonCustom>
                        <Button color="danger" onClick={this.handleModalConfirm} disabled={this.state.disable_btnconfirmupdate}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal PopUp Insert */}
                <Modal size="lg" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Barang</ModalHeader>
                    <ModalBody>
                        <div className="card-body">
                            <div style={{ marginTop: '3%' }}>
                                <div style={{ width: '50%', float: 'left', paddingRight: '3%' }}>
                                    <img src={(this.state.insert_foto === '') ? "assets/images/default_image_not_found.jpg" : this.state.insert_foto} alt="" style={{ width: "50%" }} />
                                    <Input type="file" accept="image/*" className="insert-gambar"
                                        onChange={this.handleGambarInsert} style={{ marginTop: '5%' }}></Input>
                                    <p className="mb-0" style={{ fontWeight: 'bold', marginTop: '5%' }}> Kode Barang Distributor</p>
                                    <Input type="text" name="insert_kode_barang_distributor" id="insert_kode_barang_distributor" className="form-control"
                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                        value={this.state.insert_kode_barang_distributor}
                                        invalid={this.state.empty_insert_kode_barang_distributor}
                                        disabled={this.state.disable_insert_kode_barang_distributor}
                                    />
                                    <FormFeedback>{this.state.feedback_insert_kode_barang_distributor}</FormFeedback>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Deskripsi Barang</p>
                                    <Input type="textarea" name="insert_deskripsi"
                                        invalid={this.state.empty_insert_deskripsi} rows="4"
                                        maxLength="100"
                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpace} required
                                        disabled={this.state.disable_insert_deskripsi} />
                                    <FormFeedback>{this.state.feedback_insert_deskripsi}</FormFeedback>
                                </div>
                                <div style={{ width: '50%', float: 'right', paddingRight: '3%' }}>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Nama Barang</p>
                                    {/* <ButtonDropdown isOpen={this.state.isOpenBarang} toggle={this.handleDropDownBarang} style={{width:'100%'}}>
                                        <DropdownToggle caret color="light" title="Daftar barang yang tersedia">
                                            {(this.state.nama_barang_registered_insert === '') ? 'Pilih Barang' : this.state.nama_barang_registered_insert}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => this.populateBarang('N')} disabled>
                                                        Pilih Barang</DropdownItem>
                                            {
                                                this.state.allRegisteredBarang.map(allRegisteredBarang=>{
                                                    return <DropdownItem onClick={() => this.populateBarang(allRegisteredBarang.id, allRegisteredBarang.nama,
                                                                allRegisteredBarang.berat, allRegisteredBarang.volume, allRegisteredBarang.nama_kategori)}>
                                                                    {allRegisteredBarang.nama}</DropdownItem>
                                                })
                                            }
                                        </DropdownMenu>
                                    </ButtonDropdown> */}
                                    <Select
                                        // value={this.state.id_barang_registered_insert}
                                        options={this.state.allRegisteredBarang}
                                        onChange={this.changeBarangDropdown}
                                    />
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Kategori Barang</p>
                                    <p className="mb-0">{(this.state.kategori_barang_registered_insert === '') ? '-' : this.state.kategori_barang_registered_insert} </p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Berat / Volume Barang</p>
                                    <p className="mb-0">{(this.state.berat_barang_registered_insert === '') ? '-' : this.state.berat_barang_registered_insert}
                                        {(this.state.volume_barang_registered_insert === '') ? ' ' : ' / ' + this.state.volume_barang_registered_insert}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}> Satuan Barang</p>
                                    <p className="mb-0">{(this.state.nama_satuan_barang_registered_insert === '') ? '-' : this.state.nama_satuan_barang_registered_insert}
                                        {(this.state.nama_singkat_satuan_barang_registered_insert === '') ? ' ' : ' (' + this.state.nama_singkat_satuan_barang_registered_insert + ') '}</p>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.nama_singkat_satuan_barang_registered_insert === '') ? 'Jumlah Minimum Pembelian' : 'Jumlah Minimum Pembelian (@' + this.state.nama_singkat_satuan_barang_registered_insert + ') '}
                                    </p>
                                    <Input type="text" name="insert_minimum_pembelian" id="insert_minimum_pembelian" className="form-control"
                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                        invalid={this.state.empty_insert_minimum_pembelian}
                                        value={this.state.insert_minimum_pembelian}
                                        disabled={this.state.disable_insert_minimum_pembelian} />
                                    <FormFeedback>{this.state.feedback_insert_minimum_pembelian}</FormFeedback>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.nama_singkat_satuan_barang_registered_insert === '') ? 'Jumlah Minimum Nego' : 'Jumlah Minimum Nego (@' + this.state.nama_singkat_satuan_barang_registered_insert + ') '}
                                    </p>
                                    <Input type="text" name="insert_minimum_nego" id="insert_minimum_nego" className="form-control"
                                        onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                        value={this.state.insert_minimum_nego}
                                        invalid={this.state.empty_insert_minimum_nego}
                                        disabled={this.state.disable_insert_minimum_nego} />
                                    <FormFeedback>{this.state.feedback_insert_minimum_nego}</FormFeedback>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.nama_singkat_satuan_barang_registered_insert === '') ? 'Harga Terendah Barang' : 'Harga Terendah Barang (@' + this.state.nama_singkat_satuan_barang_registered_insert + ') '}
                                    </p>
                                    <div className="input-group">
                                        <div className="input-group-prepend" style={{ width: '100%' }}>
                                            <ButtonDropdown isOpen={this.state.isOpenCurrencyInsertBarangTerendah} toggle={this.handleDropDownCurrencyInsertBarangTerendah} style={{ width: '100%' }}>
                                                <DropdownToggle caret color="light" title="Daftar mata uang yang tersedia">
                                                    {this.state.default_currency_terendah}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => this.changeCurrencyTerendah('USD')}>USD</DropdownItem>
                                                    <DropdownItem onClick={() => this.changeCurrencyTerendah('IDR')}>IDR</DropdownItem>
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                            {
                                                (this.state.default_currency_terendah === 'IDR') ?
                                                    <NumberFormat thousandSeparator='.' allowNegative={false} decimalSeparator=','
                                                        name="insert_price_terendah" id="insert_price_terendah" onChange={this.handleChange}
                                                        disabled={this.state.disable_insert_price_terendah} className="form-control"
                                                        decimalScale={2}
                                                        value={this.state.insert_price_terendah}></NumberFormat>
                                                    :
                                                    <NumberFormat thousandSeparator=',' allowNegative={false} decimalSeparator='.'
                                                        name="insert_price_terendah" id="insert_price_terendah" onChange={this.handleChange}
                                                        disabled={this.state.disable_insert_price_terendah} className="form-control"
                                                        decimalScale={2}
                                                        value={this.state.insert_price_terendah}></NumberFormat>
                                            }
                                        </div>
                                        <div id="errorhargaterendah" style={{ display: 'none' }}>
                                            <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.errormessageinsertterendah}</p>
                                        </div>
                                    </div>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>
                                        {(this.state.nama_singkat_satuan_barang_registered_insert === '') ? 'Harga Tertinggi Barang' : 'Harga Tertinggi Barang (@' + this.state.nama_singkat_satuan_barang_registered_insert + ') '}
                                    </p>
                                    <div className="input-group">
                                        <div className="input-group-prepend" style={{ width: '100%' }}>
                                            <ButtonDropdown isOpen={this.state.isOpenCurrencyInsertBarang} toggle={this.handleDropDownCurrencyInsertBarang} style={{ width: '100%' }}>
                                                <DropdownToggle caret color="light" title="Daftar mata uang yang tersedia">
                                                    {this.state.default_currency}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => this.changeCurrency('USD')}>USD</DropdownItem>
                                                    <DropdownItem onClick={() => this.changeCurrency('IDR')}>IDR</DropdownItem>
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                            {/* <Input type="number" placeholder="Harga" name="insert_price"
                                                onChange={this.handleChange} required className="form-control" invalid={this.state.empty_insert_price} /> */}
                                            {
                                                (this.state.default_currency === 'IDR') ?
                                                    <NumberFormat thousandSeparator='.' allowNegative={false} decimalSeparator=','
                                                        name="insert_price" id="insert_price" onChange={this.handleChange}
                                                        decimalScale={2}
                                                        disabled={this.state.disable_insert_price} className="form-control"
                                                        value={this.state.insert_price}></NumberFormat>
                                                    :
                                                    <NumberFormat thousandSeparator=',' allowNegative={false} decimalSeparator='.'
                                                        name="insert_price" id="insert_price" onChange={this.handleChange}
                                                        decimalScale={2}
                                                        disabled={this.state.disable_insert_price} className="form-control"
                                                        value={this.state.insert_price}></NumberFormat>
                                            }
                                        </div>
                                        <div id="errorharga" style={{ display: 'none' }}>
                                            <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.errormessageinsert}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Link onClick={this.handleModalInsertMasterBarang}> Barang tidak tersedia? </Link>
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={this.state.isBtnConfirmInsert}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Insert */}
                <Modal size="md" toggle={this.handleModalConfirmInsert} isOpen={this.state.isOpenConfirmInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsert}>Konfirmasi Fitur Nego Otomatis</ModalHeader>
                    <ModalBody>
                        <div>
                            <label>
                                {this.state.warningharga}
                                {this.state.warningberikutshowharga}
                            </label>
                        </div>
                        <label>
                            {this.state.warningshowhargaterendah}
                            {this.state.warningshowhargatertinggi}
                        </label>
                        <Label>
                            Sistem menyediakan fitur nego secara otomatis. Fitur nego otomatis ini bersifat tidak wajib.
                        </Label>
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox"
                                    checked={this.state.isCheckedInsertNominalPersen}
                                    onChange={this.toggleChangeInsertNominalPersen} />Aktifkan fitur nego otomatis
                            </Label>
                        </FormGroup>
                        <div style={{ display: 'none', marginTop: '3%' }} id="field_insert_nominal_persen_nego_pertama">
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nominal Persen Nego 1 ( % )</p>
                            <Input type="text" name="insert_nominal_persen_nego_pertama" id="insert_nominal_persen_nego_pertama" className="form-control"
                                onChange={this.handleChange}
                                onKeyPress={this.handleWhiteSpaceNumber}
                                invalid={this.state.empty_insert_nominal_persen_nego_pertama}
                                value={this.state.insert_nominal_persen_nego_pertama}
                            />
                            <FormFeedback>{this.state.feedback_insert_nominal_persen_nego_pertama}</FormFeedback>
                        </div>
                        <div style={{ display: 'none' }} id="field_insert_nominal_persen_nego_kedua">
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nominal Persen Nego 2 ( % )</p>
                            <Input type="text" name="insert_nominal_persen_nego_kedua" id="insert_nominal_persen_nego_kedua" className="form-control"
                                onChange={this.handleChange}
                                onKeyPress={this.handleWhiteSpaceNumber}
                                invalid={this.state.empty_insert_nominal_persen_nego_kedua}
                                value={this.state.insert_nominal_persen_nego_kedua}
                                disabled={this.state.disable_insert_persen_nego_kedua}
                            />
                            <FormFeedback>{this.state.feedback_insert_nominal_persen_nego_kedua}</FormFeedback>
                        </div>
                        <div style={{ display: 'none' }} id="field_insert_nominal_persen_nego_ketiga">
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nominal Persen Nego 3 ( % )</p>
                            <Input type="text" name="insert_nominal_persen_nego_ketiga" id="insert_nominal_persen_nego_ketiga" className="form-control"
                                onChange={this.handleChange}
                                onKeyPress={this.handleWhiteSpaceNumber}
                                invalid={this.state.empty_insert_nominal_persen_nego_ketiga}
                                value={this.state.insert_nominal_persen_nego_ketiga}
                                disabled={this.state.disable_insert_persen_nego_ketiga}
                            />
                            <FormFeedback>{this.state.feedback_insert_nominal_persen_nego_ketiga}</FormFeedback>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsertKedua} disabled={this.state.isbtnConfirmInsertKedua}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Insert Kedua*/}
                <Modal size="sm" toggle={this.handleModalConfirmInsertKedua} isOpen={this.state.isOpenConfirmInsertKedua} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsertKedua}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button color="primary" onClick={this.confirmActionInsert}>Tambah</Button> */}
                        <ButtonCustom onClick={this.confirmActionInsert} title="Tambah" loading={this.props.isLoading}></ButtonCustom>
                        <Button color="danger" onClick={this.handleModalConfirmInsertKedua} disabled={this.state.disable_btnconfirminsertkeduabarang}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Peringatan Insert Picture Kosong */}
                <Modal size="sm" toggle={this.handleModalConfirmInsert} isOpen={this.state.isOpenPictureInserted} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsert}>Peringatan!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>{this.state.errormessage}</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Perhatian Harga */}
                <Modal size="sm" toggle={this.handleModalAttention} isOpen={this.state.isOpenAttention} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAttention}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>{this.state.attentionmessage}</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Perhatian ID sudah terdaftar */}
                <Modal size="sm" toggle={this.handleModalAttentionTerdaftar} isOpen={this.state.isOpenAttentionTerdaftar} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleWindowReload}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, barang ini telah dalam proses pengajuan beberapa saat yang lalu. Silakan lakukan muat ulang halaman untuk melihat status pengajuan barang ini.</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Popup Insert Master Barang */}
                <Modal size="lg" toggle={this.handleModalInsertMasterBarang} isOpen={this.state.isOpenModalInsertMasterBarang} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleDisposeModalInsertMasterBarang}>Tambah Master Barang</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}> Kode Barang Distributor</p>
                                <Input type="text" name="insert_master_kode_barang_distributor" id="insert_master_kode_barang_distributor" className="form-control"
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                    value={this.state.insert_master_kode_barang_distributor}
                                    invalid={this.state.empty_insert_master_kode_barang_distributor}
                                // disabled={this.state.disable_insert_}
                                />
                                <FormFeedback>{this.state.feedback_insert_master_kode_barang_distributor}</FormFeedback>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Barang</p>
                                <Input type="text" name="nama_barang_inserted" id="nama_barang_inserted"
                                    maxLength="255"
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_barang_inserted} />
                                <FormFeedback>{this.state.feedback_insert_master_nama_barang}</FormFeedback>
                            </FormGroup>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Kategori Barang</p>
                                        <ButtonDropdown isOpen={this.state.isOpenKategori} toggle={this.handleKategoriBarang}>
                                            {
                                                (this.state.tipe_bisnis === '1' && this.state.sa_divisi === '1') ?
                                                    <DropdownToggle caret color="light">
                                                        {(this.state.nama_category_barang_inserted === '') ? 'Pilih kategori' : this.state.nama_category_barang_inserted}
                                                    </DropdownToggle>
                                                    : (this.state.tipe_bisnis === '1' && this.state.sa_divisi !== '1') ?
                                                        <DropdownToggle caret color="light">
                                                            {/* {this.state.nama_divisi} */}
                                                            {(this.state.nama_category_barang_inserted === '') ? 'Pilih kategori' : this.state.nama_category_barang_inserted}
                                                        </DropdownToggle>
                                                        : <DropdownToggle caret color="light">
                                                            {/* {this.state.nama_tipe_bisnis} */}
                                                            {(this.state.nama_category_barang_inserted === '') ? 'Pilih kategori' : this.state.nama_category_barang_inserted}
                                                        </DropdownToggle>
                                            }
                                            {
                                                (this.state.tipe_bisnis === '1' && this.state.sa_divisi === '1') ?
                                                    <DropdownMenu>
                                                        <DropdownItem disabled>Pilih kategori</DropdownItem>
                                                        {
                                                            this.state.allCategory.map(allCategory => {
                                                                return <DropdownItem onClick={() => this.changeCategoryInserted(allCategory.id, allCategory.nama)}>{allCategory.nama}</DropdownItem>
                                                            })
                                                        }
                                                    </DropdownMenu>
                                                    :
                                                    // false
                                                    <DropdownMenu>
                                                        <DropdownItem disabled>Pilih kategori</DropdownItem>
                                                        {
                                                            this.state.allCategoryKhusus.map(allCategoryKhusus => {
                                                                return <DropdownItem onClick={() => this.changeCategoryInserted(allCategoryKhusus.id, allCategoryKhusus.nama)}>{allCategoryKhusus.nama}</DropdownItem>
                                                            })
                                                        }
                                                    </DropdownMenu>
                                            }
                                        </ButtonDropdown>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Satuan Barang</p>
                                        <ButtonDropdown isOpen={this.state.isOpenSatuan} toggle={this.handleSatuanBarang}>
                                            <DropdownToggle caret color="light">
                                                {(this.state.satuan_barang_inserted === '') ? 'Pilih satuan' : this.state.satuan_barang_inserted + ' (' + this.state.alias_satuan_barang_inserted + ')'}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem disabled>Pilih satuan</DropdownItem>
                                                {
                                                    this.state.allSatuan.map((allSatuan, index) => {
                                                        return <DropdownItem key={index} onClick={() => this.changeSatuanInserted(allSatuan.id, allSatuan.nama, allSatuan.alias)}>{allSatuan.nama} ({allSatuan.alias})</DropdownItem>
                                                    })
                                                }
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>{this.state.alias_satuan_barang_inserted === '' ? 'Harga Terendah Barang' : 'Harga Terendah Barang (@' + this.state.alias_satuan_barang_inserted + ')'}</p>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <ButtonDropdown isOpen={this.state.isOpenCurrencyInsertMasterBarangTerendah} toggle={this.handleDropDownCurrencyInsertMasterBarangTerendah} style={{ width: '100%' }}>
                                                    <DropdownToggle caret color="light" title="Daftar mata uang yang tersedia">
                                                        {this.state.default_currency_master_barang_terendah}
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem onClick={() => this.changeCurrencyMasterBarangTerendah('USD')}>USD</DropdownItem>
                                                        <DropdownItem onClick={() => this.changeCurrencyMasterBarangTerendah('IDR')}>IDR</DropdownItem>
                                                    </DropdownMenu>
                                                </ButtonDropdown>
                                                {
                                                    (this.state.default_currency_master_barang_terendah === 'IDR') ?
                                                        <NumberFormat thousandSeparator='.' allowNegative={false} decimalSeparator=','
                                                            name="insert_price_master_barang_terendah" id="insert_price_master_barang_terendah"
                                                            decimalScale={2}
                                                            disabled={this.state.disable_insert_master_price_terendah}
                                                            onChange={this.handleChange} className="form-control" value={this.state.insert_price_master_barang_terendah}></NumberFormat>
                                                        :
                                                        <NumberFormat thousandSeparator=',' allowNegative={false} decimalSeparator='.'
                                                            name="insert_price_master_barang_terendah" id="insert_price_master_barang_terendah"
                                                            decimalScale={2}
                                                            disabled={this.state.disable_insert_master_price_terendah}
                                                            value={this.state.insert_price_master_barang_terendah} onChange={this.handleChange} className="form-control"></NumberFormat>
                                                }
                                            </div>
                                            <div id="errorhargaterendah" style={{ display: 'none' }}>
                                                <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.errormessageinsertterendah}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>{this.state.alias_satuan_barang_inserted === '' ? 'Harga Tertinggi Barang' : 'Harga Tertinggi Barang (@' + this.state.alias_satuan_barang_inserted + ')'}</p>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <ButtonDropdown isOpen={this.state.isOpenCurrencyInsertMasterBarang} toggle={this.handleDropDownCurrencyInsertMasterBarang} style={{ width: '100%' }}>
                                                    <DropdownToggle caret color="light" title="Daftar mata uang yang tersedia">
                                                        {this.state.default_currency_master_barang}
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem onClick={() => this.changeCurrencyMasterBarang('USD')}>USD</DropdownItem>
                                                        <DropdownItem onClick={() => this.changeCurrencyMasterBarang('IDR')}>IDR</DropdownItem>
                                                    </DropdownMenu>
                                                </ButtonDropdown>
                                                {/* <Input type="number" placeholder="Harga" name="insert_price_master_barang"
                                                    onChange={this.handleChange} required className="form-control" invalid={this.state.empty_insert_price_master_barang} /> */}
                                                {
                                                    (this.state.default_currency_master_barang === 'IDR') ?
                                                        <NumberFormat thousandSeparator='.' allowNegative={false} decimalSeparator=','
                                                            name="insert_price_master_barang" id="insert_price_master_barang" onChange={this.handleChange}
                                                            decimalScale={2}
                                                            className="form-control" value={this.state.insert_price_master_barang}
                                                            disabled={this.state.disable_insert_master_price}></NumberFormat>
                                                        :
                                                        <NumberFormat thousandSeparator=',' allowNegative={false} decimalSeparator='.' name="insert_price_master_barang"
                                                            decimalScale={2}
                                                            id="insert_price_master_barang" onChange={this.handleChange} value={this.state.insert_price_master_barang}
                                                            disabled={this.state.disable_insert_master_price} className="form-control"></NumberFormat>
                                                }
                                            </div>
                                            <div id="errorharga" style={{ display: 'none' }}>
                                                <p style={{ color: '#d92550', fontSize: '8pt' }}>{this.state.errormessageinsert}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Berat Barang</p>
                                        <Input type="text" name="berat_barang_inserted" id="berat_barang_inserted" className="form-control"
                                            value={this.state.berat_barang_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            invalid={this.state.empty_berat_barang_inserted} />
                                        <FormFeedback>{this.state.feedback_insert_master_berat}</FormFeedback>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Volume Barang</p>
                                        <Input type="text" name="volume_barang_inserted" id="volume_barang_inserted" className="form-control"
                                            value={this.state.volume_barang_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            invalid={this.state.empty_volume_barang_inserted} />
                                        <FormFeedback>{this.state.feedback_insert_master_volume}</FormFeedback>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>{this.state.alias_satuan_barang_inserted === '' ? 'Jumlah Minimum Pembelian' : 'Jumlah Minimum Pembelian (@' + this.state.alias_satuan_barang_inserted + ')'}</p>
                                        <Input type="text" name="insert_master_minimum_pembelian" id="insert_master_minimum_pembelian" className="form-control"
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            value={this.state.insert_master_minimum_pembelian}
                                            disabled={this.state.disable_insert_master_minimum_pembelian}
                                            invalid={this.state.empty_insert_master_minimum_pembelian} />
                                        <FormFeedback>{this.state.feedback_insert_master_minimum_pembelian}</FormFeedback>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>{this.state.alias_satuan_barang_inserted === '' ? 'Jumlah Minimum Nego' : 'Jumlah Minimum Nego (@' + this.state.alias_satuan_barang_inserted + ')'}</p>
                                        <Input type="text" name="insert_master_minimum_nego" id="insert_master_minimum_nego" className="form-control"
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            value={this.state.insert_master_minimum_nego}
                                            disabled={this.state.disable_insert_master_minimum_nego}
                                            invalid={this.state.empty_insert_master_minimum_nego} />
                                        <FormFeedback>{this.state.feedback_insert_master_minimum_nego}</FormFeedback>
                                    </div>
                                </div>
                            </div>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Ex.</p>
                                <Input type="text" name="ex_barang_inserted" id="ex_barang_inserted"
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    maxLength="100"
                                    invalid={this.state.empty_ex_barang_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Gambar Barang</p>
                                        <img src={(this.state.insert_foto_master === '') ? "assets/images/default_image_not_found.jpg" : this.state.insert_foto_master} alt="" style={{ width: "50%" }} />
                                        <Input type="file" accept="image/*" className="insert-gambar"
                                            onChange={this.handleGambarInsertMaster} style={{ marginTop: '5%' }}></Input>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Deskripsi Barang</p>
                                        <Input type="textarea" name="insert_deskripsi_master_barang" rows="4" maxLength="100"
                                            invalid={this.state.empty_deskripsi_master_barang} onChange={this.handleChange} onKeyPress={this.handleWhiteSpace} required />
                                        <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsertMasterBarang} disabled={this.state.isBtnConfirmInsertMaster}>Tambah</Button>
                        <Button color="danger" onClick={this.handleDisposeModalInsertMasterBarang}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Insert Master*/}
                <Modal size="md" toggle={this.handleModalConfirmInsertMasterBarang} isOpen={this.state.isOpenConfirmInsertMaster} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsertMasterBarang}>Konfirmasi Fitur Nego Otomatis</ModalHeader>
                    <ModalBody>
                        <div>
                            <label>
                                {this.state.warningharga}
                                {this.state.warningberikutshowharga}
                            </label>
                        </div>
                        <label>
                            {this.state.warningshowhargaterendah}
                            {this.state.warningshowhargatertinggi}
                        </label>
                        <Label>
                            Sistem menyediakan fitur nego secara otomatis. Fitur nego otomatis ini bersifat tidak wajib.
                        </Label>
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox"
                                    checked={this.state.isCheckedInsertMasterNominalPersen}
                                    onChange={this.toggleChangeInsertMasterNominalPersen} />Aktifkan fitur nego otomatis
                            </Label>
                        </FormGroup>
                        <div style={{ display: 'none', marginTop: '3%' }} id="field_insert_master_nominal_persen_nego_pertama">
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nominal Persen Nego 1 ( % )</p>
                            <Input type="text" name="insert_master_nominal_persen_nego_pertama" id="insert_master_nominal_persen_nego_pertama" className="form-control"
                                onChange={this.handleChange}
                                onKeyPress={this.handleWhiteSpaceNumber}
                                invalid={this.state.empty_insert_master_nominal_persen_nego_pertama}
                                value={this.state.insert_master_nominal_persen_nego_pertama}
                            />
                            <FormFeedback>{this.state.feedback_insert_master_nominal_persen_nego_pertama}</FormFeedback>
                        </div>
                        <div style={{ display: 'none' }} id="field_insert_master_nominal_persen_nego_kedua">
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nominal Persen Nego 2 ( % )</p>
                            <Input type="text" name="insert_master_nominal_persen_nego_kedua" id="insert_master_nominal_persen_nego_kedua" className="form-control"
                                onChange={this.handleChange}
                                onKeyPress={this.handleWhiteSpaceNumber}
                                invalid={this.state.empty_insert_master_nominal_persen_nego_kedua}
                                value={this.state.insert_master_nominal_persen_nego_kedua}
                                disabled={this.state.disable_insert_master_persen_nego_kedua}
                            />
                            <FormFeedback>{this.state.feedback_insert_master_nominal_persen_nego_kedua}</FormFeedback>
                        </div>
                        <div style={{ display: 'none' }} id="field_insert_master_nominal_persen_nego_ketiga">
                            <p className="mb-0" style={{ fontWeight: 'bold' }}> Nominal Persen Nego 3 ( % )</p>
                            <Input type="text" name="insert_master_nominal_persen_nego_ketiga" id="insert_master_nominal_persen_nego_ketiga" className="form-control"
                                onChange={this.handleChange}
                                onKeyPress={this.handleWhiteSpaceNumber}
                                invalid={this.state.empty_insert_master_nominal_persen_nego_ketiga}
                                value={this.state.insert_master_nominal_persen_nego_ketiga}
                                disabled={this.state.disable_insert_master_persen_nego_ketiga}
                            />
                            <FormFeedback>{this.state.feedback_insert_master_nominal_persen_nego_ketiga}</FormFeedback>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsertKeduaMasterBarang} disabled={this.state.isbtnConfirmInsertMasterKedua}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsertMasterBarang}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Insert Kedua Master*/}
                <Modal size="sm" toggle={this.handleModalConfirmInsertKeduaMasterBarang} isOpen={this.state.isOpenConfirmInsertKeduaMaster} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsertKeduaMasterBarang}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button color="primary" onClick={this.confirmActionInsertMaster}>Tambah</Button> */}
                        <ButtonCustom onClick={this.confirmActionInsertMaster} title="Tambah" loading={this.props.isLoading}></ButtonCustom>
                        <Button color="danger" onClick={this.handleModalConfirmInsertKeduaMasterBarang} disabled={this.state.disable_btnconfirminsertkeduamasterbarang}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Perhatian ada nego aktif */}
                <Modal size="sm" toggle={this.handleModalAttentionNego} isOpen={this.state.isOpenAttentionNego} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAttentionNego}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, terdapat negosiasi aktif untuk barang ini. Perubahan data barang hanya dapat dilakukan jika tidak ada negosiasi aktif untuk barang ini.</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Perhatian Kode Barang Terdaftar */}
                <Modal size="sm" toggle={this.handleModalAttentionKodeBarang} isOpen={this.state.isOpenAttentionKodeBarang} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalAttentionKodeBarang}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, sistem mendeteksi kesamaan kode barang ini dengan kode barang lain yang telah terdaftar. Mohon ubah kode barang distributor untuk barang ini.</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Perhatian Kode Barang Terdaftar Confirm Kedua*/}
                <Modal size="sm" toggle={this.handleModalAttentionKodeBarangConfirmKedua} isOpen={this.state.isOpenAttentionKodeBarangConfirmKedua} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleWindowReload}>Perhatian!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Maaf, sistem mendeteksi kesamaan kode barang ini dengan kode barang lain yang telah terdaftar.
                                Harap ulangi proses ini.</label>
                        </div>
                    </ModalBody>
                </Modal>

                {/* Modal Detail PPN */}
                <Modal size="md" toggle={this.handleModalPPN} isOpen={this.state.isOpenModalPPN} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalPPN}>Detail PPN Transaksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>PPN Tiap Transaksi</p>
                                <Input type="text" name="updated_ppn" id="updated_ppn" className="form-control"
                                    onChange={this.handleChange}
                                    onKeyPress={this.handleWhiteSpaceNumber}
                                    invalid={this.state.empty_updated_ppn}
                                    value={this.state.updated_ppn}
                                />
                                <FormFeedback>{this.state.feedback_updated_ppn}</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmPPN} disabled={this.state.isBtnUpdatePPN}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalPPN}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirm Update PPN*/}
                <Modal size="sm" toggle={this.handleModalConfirmPPN} isOpen={this.state.isOpenConfirmUpdatePPN} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmPPN}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>Apakah yakin akan melakukan aksi ini?</label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionUpdatePPN}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirm}>Batal</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
const reduxState = (state) => ({
    isLoading: state.isLoading,
    userData: state.userData
})

const reduxDispatch = (dispatch) => ({
    getKursAPIManual: (data) => dispatch(getKursAPIManual(data)),
    getKursActiveAPIManual: (data) => dispatch(getKursActiveAPIManual(data)),
    getDataBarangAPI: (data) => dispatch(getDataBarangAPI(data)),
    getDataDetailedBarangAPI: (data) => dispatch(getDataDetailedBarangAPI(data)),
    getDataCheckedBarang: (data) => dispatch(getDataCheckedBarang(data)),
    getDataCheckedNego: (data) => dispatch(getDataCheckedNego(data)),
    getDataCheckedKodeBarang: (data) => dispatch(getDataCheckedKodeBarang(data)),
    getDataCategoryAPI: (data) => dispatch(getDataCategoryAPI(data)),
    getDataSatuanAPI: (data) => dispatch(getDataSatuanAPI(data)),
    uploadGambarBarang: (data) => dispatch(uploadGambarBarang(data)),
    updateBarangStatus: (data) => dispatch(updateBarangStatus(data)),
    insertListBarang: (data) => dispatch(insertListBarang(data)),
    insertMasterBarangFromSeller: (data) => dispatch(insertMasterBarangFromSeller(data)),
    getDataBarangCanInsert: (data) => dispatch(getDataBarangCanInsert(data)),
    getKursAPI: () => dispatch(getKursAPI()),
    getDivisi: (data) => dispatch(getDivisi(data)),
    getPPNBarang: (data) => dispatch(getPPNBarang(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentBarang));