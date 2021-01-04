import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getDataCategoryAPI, insertMasterCategory, getDataDetailedMasterCategoryAPI, updateMasterCategory, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, FormFeedback } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import Toast from 'light-toast';

class ContentMasterKategoriSuperAdmin extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        allCategory: [],
        isOpen: false,
        isOpenInsert: false,
        isOpenConfirmInsert: false,
        isOpenConfirmUpdate: false,
        empty_nama_kategori_inserted: false,
        empty_nama_kategori_selected: false,
        nama_kategori_inserted: '',
        id_kategori_selected: '',
        nama_kategori_selected: '',
        pembanding_nama_kategori_selected: '',
        isBtnUpdate: true
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
    }

    loadCategory = async () => {
        const rescategory = await this.props.getDataCategoryAPI().catch(err => err)
        if (rescategory) {
            rescategory.map((user, index) => {
                return (
                    rescategory[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailCategory(e, rescategory[index].id)}> Detail</button>
                    </center>
                )
            })
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
            })
        }
    }

    handleModalInsert = () => {
        this.setState({
            isOpenInsert: !this.state.isOpenInsert,
            nama_kategori_inserted: '',
            empty_nama_kategori_inserted: false
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'nama_kategori_inserted') {
            this.check_field(event.target.value)
        }
        if (event.target.name === 'nama_kategori_selected') {
            this.check_field_edited(event.target.value)
        }
    }

    check_field = (e) => {
        if (e === '') {
            this.setState({ empty_nama_kategori_inserted: true })
        } else {
            this.setState({ empty_nama_kategori_inserted: false })
        }
    }

    check_field_edited = (e) => {
        if (e === '') {
            this.setState({ empty_nama_kategori_selected: true, isBtnUpdate: true })
        } else if (e !== '') {
            this.setState({ empty_nama_kategori_selected: false })
        }
        if (e !== '' && e === this.state.pembanding_nama_kategori_selected) {
            this.setState({ empty_nama_kategori_selected: false, isBtnUpdate: true })
        } else if (e !== '' && e !== this.state.pembanding_nama_kategori_selected) {
            this.setState({ empty_nama_kategori_selected: false, isBtnUpdate: false })
        }
    }

    handleWhiteSpace = (e) => {
        if (e.which === 32 && !e.target.value.length) {
            e.preventDefault()
        }
    }

    handleModalConfirmInsert = () => {
        if (this.state.nama_kategori_inserted === '') { this.setState({ empty_nama_kategori_inserted: true }) }
        if (this.state.nama_kategori_inserted !== '') {
            this.setState({
                isOpenConfirmInsert: !this.state.isOpenConfirmInsert
            })
        }
    }

    confirmActionInsertCategory = async () => {
        Toast.loading('Loading...');
        const resinsertMasterCategory = await this.props.insertMasterCategory({ nama: this.state.nama_kategori_inserted }).catch(err => err)
        Toast.hide();

        if (resinsertMasterCategory) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalConfirmInsert()
                this.handleModalInsert()
                this.loadCategory()
            });
        } else {
            swal({
                title: "Gagal!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            })
        }
    }

    handleDetailCategory = async (e, id) => {
        this.handleModalDetail()
        e.stopPropagation()
        const resdetail = await this.props.getDataDetailedMasterCategoryAPI({ id: id }).catch(err => err)
        if (resdetail) {
            this.setState({
                id_kategori_selected: id,
                nama_kategori_selected: resdetail.nama,
                pembanding_nama_kategori_selected: resdetail.nama
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            })
        }
    }

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            empty_nama_kategori_selected: false,
            isBtnUpdate: true
        })
    }

    handleModalConfirm = () => {
        if (this.state.nama_kategori_selected === '') { this.setState({ empty_nama_kategori_selected: true }) }
        if (this.state.nama_kategori_selected !== '') {
            this.setState({
                isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
            })
        }
    }

    confirmActionUpdateCategory = async () => {
        Toast.loading('Loading...');
        const resupdateMasterCategory = await this.props.updateMasterCategory({
            nama: this.state.nama_kategori_selected,
            id: this.state.id_kategori_selected
        }).catch(err => err)
        Toast.hide();

        if (resupdateMasterCategory) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalConfirm()
                this.handleModalDetail()
                this.loadCategory()
            });
        } else {
            swal({
                title: "Gagal!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                }
            })
        }
    }

    render() {
        const data = {
            columns: [
                {
                    label: 'Nama Kategori',
                    field: 'nama',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allCategory
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-photo-gallery icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Master Kategori
                                    <div className="page-title-subheading">Daftar master kategori pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">

                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Tambah kategori" onClick={this.handleModalInsert}>
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
                                            data={data}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Insert Category */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Kategori</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Kategori</p>
                                <Input type="text" name="nama_kategori_inserted" id="nama_kategori_inserted"
                                    placeholder="Nama Kategori" onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_kategori_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={(this.state.nama_kategori_inserted !== '') ? false : "disabled"}>Tambah</Button>
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
                        <Button color="primary" onClick={this.confirmActionInsertCategory}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Kategori */}
                <Modal size="md" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Detail Kategori</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Kategori</p>
                                <Input type="text" name="nama_kategori_selected" id="nama_kategori_selected"
                                    placeholder="Nama Kategori" value={this.state.nama_kategori_selected} onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_kategori_selected} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirm} disabled={this.state.isBtnUpdate}>Perbarui</Button>
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
                        <Button color="primary" onClick={this.confirmActionUpdateCategory}>Perbarui</Button>
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
    getDataCategoryAPI: (data) => dispatch(getDataCategoryAPI(data)),
    getDataDetailedMasterCategoryAPI: (data) => dispatch(getDataDetailedMasterCategoryAPI(data)),
    insertMasterCategory: (data) => dispatch(insertMasterCategory(data)),
    updateMasterCategory: (data) => dispatch(updateMasterCategory(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentMasterKategoriSuperAdmin));