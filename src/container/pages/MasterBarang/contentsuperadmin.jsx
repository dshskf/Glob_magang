import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { decrypt, encrypt } from '../../../config/lib';
import {
    getDataBarangSuperAdminAPI, getDataDetailedBarangSuperAdminAPI, getKursAPI, getDataSatuanAPI, getDataCategoryAPI,
    uploadGambarBarang, updateBarangStatus, insertMasterBarang, logoutUserAPI
} from '../../../config/redux/action';
import { MDBDataTable } from 'mdbreact';
import swal from 'sweetalert'
import {
    Modal, ModalHeader, ModalBody, ModalFooter, Button, ButtonDropdown, DropdownItem,
    DropdownMenu, DropdownToggle, Input, FormGroup, FormFeedback
} from 'reactstrap'
import Toast from 'light-toast';

class ContentMasterBarangSuperAdmin extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        allCategory: [],
        allDataBarang: [],
        allSatuan: [],
        tmpfilteredDataBarang: [],
        allfilteredDataBarang: [],
        isOpen: false,
        isOpenFilter: false,
        isOpenKategori: false,
        isOpenStatusBarang: false,
        isOpenConfirmUpdate: false,
        isOpenInsert: false,
        isOpenConfirmInsert: false,
        isOpenPeringatan: false,
        isOpenSatuan: false,
        statusFilter: false,
        selectedFilter: 'Semua',
        id_barang_selected: '',
        nama_barang_selected: '',
        id_category_barang_selected: '',
        nama_category_barang_selected: '',
        berat_barang_selected: '',
        volume_barang_selected: '',
        ex_barang_selected: '',
        status_barang_selected: '',
        pembanding_status_barang_selected: '',
        isBtnConfirmUpdate: true,
        empty_nama_barang_selected: false,
        empty_berat_barang_selected: false,
        empty_volume_barang_selected: false,
        empty_ex_barang_selected: false,
        empty_status_barang_selected: false,
        empty_nama_barang_inserted: false,
        empty_berat_barang_inserted: false,
        empty_volume_barang_inserted: false,
        empty_ex_barang_inserted: false,
        empty_status_barang_inserted: false,
        nama_barang_inserted: '',
        id_category_barang_inserted: '',
        nama_category_barang_inserted: '',
        berat_barang_inserted: '',
        volume_barang_inserted: '',
        ex_barang_inserted: '',
        status_barang_inserted: 'A',
        id_satuan_barang_inserted: '0',
        satuan_barang_inserted: '',
        alias_satuan_barang_inserted: '',
        id_satuan_barang_selected: '0',
        pembanding_id_satuan_barang_selected: '',
        satuan_barang_selected: '',
        alias_satuan_barang_selected: '',
        isBtnConfirmInsert: true,
        feedback_berat_barang_inserted: '',
        feedback_volume_barang_inserted: '',
        feedback_berat_barang_selected: '',
        feedback_volume_barang_selected: '',
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.setState({
            id_pengguna_login: decrypt(userData.id),
            company_id: decrypt(userData.company_id),
            company_name: decrypt(userData.company_name),
            tipe_bisnis: decrypt(userData.tipe_bisnis)
        })
        this.loadCategory()
        this.loadSatuan()
    }

    componentDidMount() {
        this.loadDataBarang()
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

    handleFilter = () => {
        this.setState({
            isOpenFilter: !this.state.isOpenFilter
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

    loadDataBarang = async () => {
        let passquery = encrypt("select gcm_master_barang.id, gcm_master_barang.nama, gcm_master_barang.category_id, " +
            "gcm_master_category.nama as nama_kategori, gcm_master_barang.status, gcm_master_barang.ex " +
            "from gcm_master_barang " +
            "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
            "order by gcm_master_barang.id")
        const res = await this.props.getDataBarangSuperAdminAPI({ query: passquery }).catch(err => err)
        if (res) {
            res.map((user, index) => {
                return (
                    res[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailBarang(e, res[index].id)}>Detail</button>
                    </center>
                )
            })
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

    handleDetailBarang = async (e, id) => {
        this.handleModalDetail()
        e.stopPropagation()
        let passquerydetail = encrypt("select gcm_master_barang.nama, gcm_master_barang.category_id, gcm_master_category.nama as nama_kategori, " +
            "gcm_master_barang.berat, gcm_master_barang.volume, gcm_master_barang.ex, gcm_master_barang.status, " +
            "gcm_master_barang.create_date, gcm_master_barang.update_date, gcm_master_barang.satuan, gcm_master_satuan.nama as nama_alias, gcm_master_satuan.alias from gcm_master_barang " +
            "inner join gcm_master_category on gcm_master_barang.category_id = gcm_master_category.id " +
            "inner join gcm_master_satuan on gcm_master_satuan.id = gcm_master_barang.satuan " +
            "where gcm_master_barang.id=" + id)
        const resdetail = await this.props.getDataDetailedBarangSuperAdminAPI({ query: passquerydetail }).catch(err => err)
        if (resdetail) {
            this.setState({
                id_barang_selected: id,
                nama_barang_selected: resdetail.nama,
                id_category_barang_selected: resdetail.id_kategori,
                nama_category_barang_selected: resdetail.nama_kategori,
                berat_barang_selected: resdetail.berat,
                volume_barang_selected: resdetail.volume,
                ex_barang_selected: resdetail.ex,
                status_barang_selected: resdetail.status,
                pembanding_status_barang_selected: resdetail.status,
                id_satuan_barang_selected: resdetail.id_satuan_barang_selected,
                pembanding_id_satuan_barang_selected: resdetail.id_satuan_barang_selected,
                satuan_barang_selected: resdetail.satuan_barang_selected,
                alias_satuan_barang_selected: resdetail.alias_satuan_barang_selected
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
            isOpen: !this.state.isOpen,
            empty_nama_barang_selected: false,
            empty_berat_barang_selected: false,
            empty_volume_barang_selected: false,
            empty_ex_barang_selected: false,
            empty_status_barang_selected: false,
            feedback_berat_barang_selected: '',
            feedback_volume_barang_selected: '',
            isBtnConfirmUpdate: true
        })
    }

    handleKategoriBarang = () => {
        this.setState({
            isOpenKategori: !this.state.isOpenKategori
        })
    }

    handleStatusBarang = () => {
        this.setState({
            isOpenStatusBarang: !this.state.isOpenStatusBarang
        })
    }

    handleModalInsert = () => {
        this.setState({
            isOpenInsert: !this.state.isOpenInsert,
            empty_nama_barang_inserted: false,
            empty_berat_barang_inserted: false,
            empty_volume_barang_inserted: false,
            empty_ex_barang_inserted: false,
            empty_status_barang_inserted: false,
            nama_barang_inserted: '',
            id_category_barang_inserted: '0',
            id_satuan_barang_inserted: '0',
            satuan_barang_inserted: '',
            nama_category_barang_inserted: '',
            berat_barang_inserted: '',
            volume_barang_inserted: '',
            ex_barang_inserted: '',
            status_barang_inserted: 'A',
            isBtnConfirmInsert: true
        })
    }

    handleChange = (event) => {
        if (event.target.name === 'nama_barang_inserted') {
            this.check_field_nama_inserted(event.target.value)
        }
        if (event.target.name === 'berat_barang_inserted') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_field_berat_inserted(event.target.value)
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
                this.check_field_volume_inserted(event.target.value)
            }
        }
        if (event.target.name === 'ex_barang_inserted') {
            this.check_field_ex_inserted(event.target.value)
        }
        if (event.target.name === 'nama_barang_selected') {
            this.check_field_nama_selected(event.target.value)
        }
        if (event.target.name === 'berat_barang_selected') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_field_berat_selected(event.target.value)
            }
        }
        if (event.target.name === 'volume_barang_selected') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                const reg = /^0+/gi;
                if (event.target.value.match(reg)) {
                    event.target.value = event.target.value.replace(reg, '');
                }
                this.check_field_volume_selected(event.target.value)
            }
        }
        if (event.target.name === 'ex_barang_selected') {
            this.check_field_ex_selected(event.target.value)
        }
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    check_field_nama_inserted = (e) => {
        if (e === '') {
            this.setState({ empty_nama_barang_inserted: true, isBtnConfirmInsert: true })
        } else {
            this.setState({ empty_nama_barang_inserted: false })
            if ((this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0') &&
                ((this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0')) &&
                this.state.ex_barang_inserted !== '' && this.state.id_category_barang_inserted !== '0' && this.state.id_satuan_barang_inserted !== '0') {
                this.setState({ isBtnConfirmInsert: false })
            }
        }
    }

    check_field_berat_inserted = (e) => {
        if (e === '') {
            this.setState({ empty_berat_barang_inserted: true, feedback_berat_barang_inserted: 'Kolom ini wajib diisi', isBtnConfirmInsert: true })
        } else {
            if (e === '0') {
                this.setState({ empty_berat_barang_inserted: true, feedback_berat_barang_inserted: 'Berat barang tidak boleh bernilai 0', isBtnConfirmInsert: true })
            } else {
                this.setState({ empty_berat_barang_inserted: false, feedback_berat_barang_inserted: '' })
                if (this.state.nama_barang_inserted !== '' &&
                    ((this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0')) &&
                    this.state.ex_barang_inserted !== '' && this.state.id_category_barang_inserted !== '0' && this.state.id_satuan_barang_inserted !== '0') {
                    this.setState({ isBtnConfirmInsert: false })
                }
            }
        }
    }

    check_field_volume_inserted = (e) => {
        if (e === '') {
            this.setState({ empty_volume_barang_inserted: true, feedback_volume_barang_inserted: 'Kolom ini wajib diisi', isBtnConfirmInsert: true })
        } else {
            if (e === '0') {
                this.setState({ empty_volume_barang_inserted: true, feedback_volume_barang_inserted: 'Volume barang tidak boleh bernilai 0', isBtnConfirmInsert: true })
            } else {
                this.setState({ empty_volume_barang_inserted: false })
                if (this.state.nama_barang_inserted !== '' &&
                    ((this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0')) &&
                    this.state.ex_barang_inserted !== '' && this.state.id_category_barang_inserted !== '0' && this.state.id_satuan_barang_inserted !== '0') {
                    this.setState({ isBtnConfirmInsert: false })
                }
            }
        }
    }

    check_field_ex_inserted = (e) => {
        if (e === '') {
            this.setState({ empty_ex_barang_inserted: true, isBtnConfirmInsert: true })
        } else {
            this.setState({ empty_ex_barang_inserted: false })
            if (this.state.nama_barang_inserted !== '' &&
                ((this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0')) &&
                ((this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0')) &&
                this.state.id_category_barang_inserted !== '0' && this.state.id_satuan_barang_inserted !== '0') {
                this.setState({ isBtnConfirmInsert: false })
            }
        }
    }

    check_field_nama_selected = (e) => {
        if (e === '') {
            this.setState({ empty_nama_barang_selected: true, isBtnConfirmUpdate: true })
        } else {
            this.setState({ empty_nama_barang_selected: false })
            if ((this.state.berat_barang_selected !== '' && this.state.berat_barang_selected !== '0') &&
                this.state.ex_barang_selected !== '' && this.state.id_category_barang_selected !== '0' && this.state.id_satuan_barang_selected !== '0') {
                this.setState({ isBtnConfirmUpdate: false })
            }
        }
    }

    check_field_berat_selected = (e) => {
        if (e === '') {
            this.setState({ empty_berat_barang_selected: true, feedback_berat_barang_selected: 'Kolom ini wajib diisi', isBtnConfirmUpdate: true })
        } else {
            if (e === '0') {
                this.setState({ empty_berat_barang_selected: true, feedback_berat_barang_selected: 'Berat barang tidak boleh bernilai 0', isBtnConfirmUpdate: true })
            } else {
                this.setState({ empty_berat_barang_selected: false, feedback_berat_barang_selected: '' })
                if (this.state.nama_barang_selected !== '' &&
                    ((this.state.volume_barang_selected !== '' && this.state.volume_barang_selected !== '0')) &&
                    this.state.ex_barang_selected !== '' && this.state.id_category_barang_selected !== '0' && this.state.id_satuan_barang_selected !== '0') {
                    this.setState({ isBtnConfirmUpdate: false })
                }
            }
        }
    }

    check_field_volume_selected = (e) => {
        if (e === '') {
            this.setState({ empty_volume_barang_selected: true, feedback_volume_barang_selected: 'Kolom ini wajib diisi', isBtnConfirmUpdate: true })
        } else {
            if (e === '0') {
                this.setState({ empty_volume_barang_selected: true, feedback_volume_barang_selected: 'Volume barang tidak boleh bernilai 0', isBtnConfirmUpdate: true })
            } else {
                this.setState({ empty_volume_barang_selected: false, feedback_volume_barang_selected: '' })
                if (this.state.nama_barang_selected !== '' &&
                    ((this.state.berat_barang_selected !== '' && this.state.berat_barang_selected !== '0')) &&
                    this.state.ex_barang_selected !== '' && this.state.id_category_barang_selected !== '0' && this.state.id_satuan_barang_selected !== '0') {
                    this.setState({ isBtnConfirmUpdate: false })
                }
            }
        }
    }

    check_field_ex_selected = (e) => {
        if (e === '') {
            this.setState({ empty_ex_barang_selected: true, isBtnConfirmUpdate: true })
        } else {
            this.setState({ empty_ex_barang_selected: false })
            if (this.state.nama_barang_selected !== '' &&
                ((this.state.berat_barang_selected !== '' && this.state.berat_barang_selected !== '0')) &&
                this.state.id_category_barang_selected !== '0' && this.state.id_satuan_barang_selected !== '0') {
                this.setState({ isBtnConfirmUpdate: false })
            }
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

    changeCategorySelected = (id, kategori) => {
        this.setState({
            id_category_barang_selected: id,
            nama_category_barang_selected: kategori
        })
    }

    handleSatuanBarang = () => {
        this.setState({
            isOpenSatuan: !this.state.isOpenSatuan
        })
    }

    changeSatuanInserted = (id, satuan, alias) => {
        this.setState({
            id_satuan_barang_inserted: id,
            satuan_barang_inserted: satuan,
            alias_satuan_barang_inserted: alias
        })
        if (this.state.nama_barang_inserted !== '' &&
            ((this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0')) &&
            ((this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0')) &&
            this.state.id_category_barang_inserted !== '0') {
            this.setState({ isBtnConfirmInsert: false })
        }
    }

    handleSatuanBarangSelected = () => {
        this.setState({
            isOpenSatuanSelected: !this.state.isOpenSatuanSelected
        })
    }

    changeSatuanSelected = (id, satuan, alias) => {
        this.setState({
            id_satuan_barang_selected: id,
            satuan_barang_selected: satuan,
            alias_satuan_barang_selected: alias,
            isBtnConfirmUpdate: false
        })

    }

    changeStatusBarang = (e) => {
        this.setState({
            status_barang_selected: e,
            isBtnConfirmUpdate: false
        })

    }

    changeCategoryInserted = (id, kategori) => {
        this.setState({
            id_category_barang_inserted: id,
            nama_category_barang_inserted: kategori
        })
        if (this.state.nama_barang_inserted !== '' &&
            ((this.state.volume_barang_inserted !== '' && this.state.volume_barang_inserted !== '0')) &&
            ((this.state.berat_barang_inserted !== '' && this.state.berat_barang_inserted !== '0')) &&
            this.state.id_satuan_barang_inserted !== '0') {
            this.setState({ isBtnConfirmInsert: false })
        }
    }

    changeStatusBarangInserted = (e) => {
        this.setState({
            status_barang_inserted: e
        })
    }

    handleModalConfirm = () => {
        if (this.state.nama_barang_selected === '') { this.setState({ empty_nama_barang_selected: true }) }
        if (this.state.berat_barang_selected === '') { this.setState({ empty_berat_barang_selected: true }) }
        if (this.state.volume_barang_selected === '') { this.setState({ empty_volume_barang_selected: true }) }
        if (this.state.ex_barang_selected === '') { this.setState({ empty_ex_barang_selected: true }) }
        if (this.state.nama_barang_selected !== '' && this.state.berat_barang_selected !== ''
            && this.state.volume_barang_selected && this.state.ex_barang_selected) {
            this.setState({
                isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
            })
        }
    }

    confirmActionUpdateBarang = async () => {
        let passqueryupdatemasterbarang = encrypt("update gcm_master_barang set nama='" + this.state.nama_barang_selected + "', " +
            "category_id='" + this.state.id_category_barang_selected + "', berat='" + this.state.berat_barang_selected + "', " +
            "volume='" + this.state.volume_barang_selected + "', ex='" + this.state.ex_barang_selected + "', update_by=" + this.state.id_pengguna_login +
            ", update_date=now(), status='" + this.state.status_barang_selected + "', satuan='" + this.state.id_satuan_barang_selected + "' where id=" + this.state.id_barang_selected + " returning update_date;")
        Toast.loading('Loading...');
        const resupdateMasterBarang = await this.props.updateBarangStatus({ query: passqueryupdatemasterbarang }).catch(err => err)
        Toast.hide();
        if (resupdateMasterBarang) {
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

    handleModalConfirmInsert = () => {
        if (this.state.nama_barang_inserted === '') { this.setState({ empty_nama_barang_inserted: true }) }
        if (this.state.berat_barang_inserted === '') { this.setState({ empty_berat_barang_inserted: true }) }
        if (this.state.volume_barang_inserted === '') { this.setState({ empty_volume_barang_inserted: true }) }
        if (this.state.ex_barang_inserted === '') { this.setState({ empty_ex_barang_inserted: true }) }
        if (this.state.id_category_barang_inserted === '0') { this.setState({ errormessage: 'Harap pilih kategori barang!', isOpenPeringatan: !this.state.isOpenPeringatan }) }
        if (this.state.nama_barang_inserted !== '' && this.state.berat_barang_inserted !== ''
            && this.state.volume_barang_inserted && this.state.ex_barang_inserted && this.state.id_category_barang_inserted !== '0') {
            this.setState({
                isOpenConfirmInsert: !this.state.isOpenConfirmInsert
            })
        }
    }

    confirmActionInsertBarang = async () => {
        let passqueryinsertmasterbarang = encrypt("insert into gcm_master_barang (nama, category_id, berat, " +
            "volume, ex, create_by, create_date, update_by, update_date, status, satuan) values ('" + this.state.nama_barang_inserted + "', " +
            "'" + this.state.id_category_barang_inserted + "', '" + this.state.berat_barang_inserted + "', '" + this.state.volume_barang_inserted + "', " +
            "'" + this.state.ex_barang_inserted + "', '" + this.state.id_pengguna_login + "', now(), '" + this.state.id_pengguna_login + "', " +
            "now(), '" + this.state.status_barang_inserted + "', '" + this.state.id_satuan_barang_inserted + "') returning create_date;")
        Toast.loading('Loading...');
        const resinsertMasterBarang = await this.props.insertMasterBarang({ query: passqueryinsertmasterbarang }).catch(err => err)
        Toast.hide();
        if (resinsertMasterBarang) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.this.loadDataBarang()
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

    render() {
        const statusFilter = this.state.statusFilter
        const data = {
            columns: [
                {
                    label: 'Nama Barang',
                    field: 'nama',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Ex.',
                    field: 'ex',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'Kategori',
                    field: 'nama_kategori',
                    width: 150
                },
                {
                    label: 'Status',
                    field: 'status',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: (statusFilter) ? this.state.allfilteredDataBarang : this.state.allDataBarang
        }
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
                                <div>Manajemen Master Barang
                                    <div className="page-title-subheading">Daftar master barang pada {this.state.company_name}
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
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Tambah master barang" onClick={this.handleModalInsert}>
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
                                            data={data}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Detail Barang */}
                <Modal size="md" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Detail Barang</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Barang</p>
                                <Input type="text" name="nama_barang_selected" id="nama_barang_selected"
                                    value={this.state.nama_barang_selected} onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_barang_selected} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Kategori Barang</p>
                                        <ButtonDropdown isOpen={this.state.isOpenKategori} toggle={this.handleKategoriBarang}>
                                            <DropdownToggle caret color="light">
                                                {this.state.nama_category_barang_selected}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {
                                                    this.state.allCategory.map(allCategory => {
                                                        return <DropdownItem onClick={() => this.changeCategorySelected(allCategory.id, allCategory.nama)}>{allCategory.nama}</DropdownItem>
                                                    })
                                                }
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Status Barang</p>
                                        <ButtonDropdown isOpen={this.state.isOpenStatusBarang} toggle={this.handleStatusBarang}>
                                            <DropdownToggle caret color={this.state.status_barang_selected === 'A' ? "success" : this.state.status_barang_selected === 'C' ? "primary" : "danger"}>
                                                {this.state.status_barang_selected === 'A' ? 'Aktif' : this.state.status_barang_selected === 'C' ? 'Konfirmasi' : 'Nonaktif'}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {this.state.status_barang_selected === 'C' ? <DropdownItem disabled>Konfirmasi</DropdownItem> : false}
                                                <DropdownItem onClick={() => this.changeStatusBarang('A')}>Aktif</DropdownItem>
                                                <DropdownItem onClick={() => this.changeStatusBarang('I')}>Nonaktif</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Satuan Barang</p>
                                        <ButtonDropdown isOpen={this.state.isOpenSatuanSelected} toggle={this.handleSatuanBarangSelected}>
                                            <DropdownToggle caret color="light">
                                                {(this.state.id_satuan_barang_selected === '0') ? 'Pilih satuan' : this.state.satuan_barang_selected + ' (' + this.state.alias_satuan_barang_selected + ')'}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem disabled>Pilih satuan</DropdownItem>
                                                {
                                                    this.state.allSatuan.map(allSatuan => {
                                                        return <DropdownItem onClick={() => this.changeSatuanSelected(allSatuan.id, allSatuan.nama, allSatuan.alias)}>{allSatuan.nama} ({allSatuan.alias})</DropdownItem>
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
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Berat Barang</p>
                                        <Input type="text" name="berat_barang_selected" id="berat_barang_selected" className="form-control"
                                            value={this.state.berat_barang_selected} onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            invalid={this.state.empty_berat_barang_selected} />
                                        <FormFeedback>{this.state.feedback_berat_barang_selected}</FormFeedback>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Volume Barang</p>
                                        <Input type="text" name="volume_barang_selected" id="volume_barang_selected" className="form-control"
                                            value={this.state.volume_barang_selected} onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            invalid={this.state.empty_volume_barang_selected} />
                                        <FormFeedback>{this.state.feedback_volume_barang_selected}</FormFeedback>
                                    </div>
                                </div>
                            </div>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Ex.</p>
                                <Input type="text" name="ex_barang_selected" id="ex_barang_selected"
                                    value={this.state.ex_barang_selected} onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_ex_barang_selected} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnConfirmUpdate}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalDetail}>Batal</Button>
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
                        <Button color="primary" onClick={this.confirmActionUpdateBarang}>Perbarui</Button>
                        <Button color="danger" onClick={this.handleModalConfirm}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Insert Barang */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Master Barang</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Barang</p>
                                <Input type="text" name="nama_barang_inserted" id="nama_barang_inserted"
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_barang_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                            <div className="form-row">
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Kategori Barang</p>
                                        <ButtonDropdown isOpen={this.state.isOpenKategori} toggle={this.handleKategoriBarang}>
                                            <DropdownToggle caret color="light">
                                                {(this.state.nama_category_barang_inserted === '') ? 'Pilih kategori' : this.state.nama_category_barang_inserted}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem disabled>Pilih kategori</DropdownItem>
                                                {
                                                    this.state.allCategory.map(allCategory => {
                                                        return <DropdownItem onClick={() => this.changeCategoryInserted(allCategory.id, allCategory.nama)}>{allCategory.nama}</DropdownItem>
                                                    })
                                                }
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Status Barang</p>
                                        <ButtonDropdown isOpen={this.state.isOpenStatusBarang} toggle={this.handleStatusBarang}>
                                            <DropdownToggle caret color={this.state.status_barang_inserted === 'A' ? "success" : "danger"}>
                                                {this.state.status_barang_inserted === 'A' ? 'Aktif' : 'Nonaktif'}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => this.changeStatusBarangInserted('A')}>Aktif</DropdownItem>
                                                <DropdownItem onClick={() => this.changeStatusBarangInserted('I')}>Nonaktif</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
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
                                                    this.state.allSatuan.map(allSatuan => {
                                                        return <DropdownItem onClick={() => this.changeSatuanInserted(allSatuan.id, allSatuan.nama, allSatuan.alias)}>{allSatuan.nama} ({allSatuan.alias})</DropdownItem>
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
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Berat Barang</p>
                                        <Input type="text" name="berat_barang_inserted" id="berat_barang_inserted" className="form-control"
                                            value={this.state.berat_barang_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            invalid={this.state.empty_berat_barang_inserted} />
                                        <FormFeedback>{this.state.feedback_berat_barang_inserted}</FormFeedback>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="position-relative form-group">
                                        <p className="mb-0" style={{ fontWeight: 'bold' }}>Volume Barang</p>
                                        <Input type="text" name="volume_barang_inserted" id="volume_barang_inserted" className="form-control"
                                            value={this.state.volume_barang_inserted}
                                            onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                            invalid={this.state.empty_volume_barang_inserted} />
                                        <FormFeedback>{this.state.feedback_volume_barang_inserted}</FormFeedback>
                                    </div>
                                </div>
                            </div>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Ex.</p>
                                <Input type="text" name="ex_barang_inserted" id="ex_barang_inserted"
                                    onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_ex_barang_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsert}
                            disabled={this.state.isBtnConfirmInsert}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalInsert}>Batal</Button>
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
                        <Button color="primary" onClick={this.confirmActionInsertBarang}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Peringatan Insert Picture Kosong */}
                <Modal size="sm" toggle={this.handleModalConfirmInsert} isOpen={this.state.isOpenPeringatan} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmInsert}>Peringatan!</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>{this.state.errormessage}</label>
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
    getDataBarangSuperAdminAPI: (data) => dispatch(getDataBarangSuperAdminAPI(data)),
    getDataDetailedBarangSuperAdminAPI: (data) => dispatch(getDataDetailedBarangSuperAdminAPI(data)),
    getDataCategoryAPI: (data) => dispatch(getDataCategoryAPI(data)),
    getDataSatuanAPI: (data) => dispatch(getDataSatuanAPI(data)),
    insertMasterBarang: (data) => dispatch(insertMasterBarang(data)),
    uploadGambarBarang: (data) => dispatch(uploadGambarBarang(data)),
    updateBarangStatus: (data) => dispatch(updateBarangStatus(data)),
    getKursAPI: () => dispatch(getKursAPI()),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentMasterBarangSuperAdmin));