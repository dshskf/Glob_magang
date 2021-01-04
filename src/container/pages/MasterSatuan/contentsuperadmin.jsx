import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getDataSatuanAPI, insertMasterSatuan, getDataDetailedMasterSatuanAPI, updateMasterSatuan, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, FormFeedback } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import Toast from 'light-toast';

class ContentMasterSatuanSuperAdmin extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        allSatuan: [],
        isOpen: false,
        isOpenInsert: false,
        isOpenConfirmInsert: false,
        isOpenConfirmUpdate: false,
        empty_nama_satuan_inserted: false,
        empty_nama_alias_satuan_inserted: false,
        empty_nama_satuan_selected: false,
        empty_nama_alias_satuan_selected: false,
        nama_satuan_inserted: '',
        nama_alias_satuan_inserted: '',
        id_satuan_selected: '',
        nama_satuan_selected: '',
        nama_alias_satuan_selected: '',
        pembanding_nama_satuan_selected: '',
        pembanding_nama_alias_satuan_selected: '',
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
        this.loadSatuan()
    }

    loadSatuan = async () => {
        const ressatuan = await this.props.getDataSatuanAPI().catch(err => err)
        if (ressatuan) {
            ressatuan.map((user, index) => {
                return (
                    ressatuan[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailSatuan(e, ressatuan[index].id)}> Detail</button>
                    </center>,
                    ressatuan[index].alias =
                    <center>
                        <p>{user.alias}</p>
                    </center>
                )
            })
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
                // const res = this.props.logoutAPI();
                // if (res) {
                //     this.props.history.push('/admin')
                //     window.location.reload()
                // }
            });
        }
    }

    handleModalInsert = () => {
        this.setState({
            isOpenInsert: !this.state.isOpenInsert,
            nama_satuan_inserted: '',
            nama_alias_satuan_inserted: '',
            empty_nama_satuan_inserted: false,
            empty_nama_alias_satuan_inserted: false
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'nama_satuan_inserted') {
            this.check_field(event.target.value)
        }
        if (event.target.name === 'nama_alias_satuan_inserted') {
            this.check_field_alias(event.target.value)
        }
        if (event.target.name === 'nama_satuan_selected') {
            this.check_field_edited(event.target.value)
        }
        if (event.target.name === 'nama_alias_satuan_selected') {
            this.check_field_edited_alias(event.target.value)
        }
    }

    check_field = (e) => {
        if (e === '') {
            this.setState({ empty_nama_satuan_inserted: true })
        } else {
            this.setState({ empty_nama_satuan_inserted: false })
        }
    }

    check_field_alias = (e) => {
        if (e === '') {
            this.setState({ empty_nama_alias_satuan_inserted: true })
        } else {
            this.setState({ empty_nama_alias_satuan_inserted: false })
        }
    }

    check_field_edited = (e) => {
        if (e === '') {
            this.setState({ empty_nama_satuan_selected: true, isBtnUpdate: true })
        } else if (e !== '') {
            this.setState({ empty_nama_satuan_selected: false })
        }
        if (e !== '' && e !== this.state.pembanding_nama_satuan_selected && this.state.nama_alias_satuan_selected !== '') {
            this.setState({ empty_nama_satuan_selected: false, isBtnUpdate: false })
        }
    }

    check_field_edited_alias = (e) => {
        if (e === '') {
            this.setState({ empty_nama_alias_satuan_selected: true, isBtnUpdate: true })
        } else if (e !== '') {
            this.setState({ empty_nama_alias_satuan_selected: false })
        }
        if (e !== '' && e !== this.state.pembanding_nama_alias_satuan_selected && this.state.nama_satuan_selected !== '') {
            this.setState({ empty_nama_alias_satuan_selected: false, isBtnUpdate: false })
        }
    }

    handleWhiteSpace = (e) => {
        if (e.which === 32 && !e.target.value.length) {
            e.preventDefault()
        }
    }

    handleModalConfirmInsert = () => {
        if (this.state.nama_satuan_inserted === '') { this.setState({ empty_nama_satuan_inserted: true }) }
        if (this.state.nama_alias_satuan_inserted === '') { this.setState({ empty_nama_alias_satuan_inserted: true }) }
        if (this.state.nama_satuan_inserted !== '' && this.state.nama_alias_satuan_inserted !== '') {
            this.setState({
                isOpenConfirmInsert: !this.state.isOpenConfirmInsert
            })
        }
    }

    confirmActionInsertSatuan = async () => {
        Toast.loading('Loading...');
        const resinsertMasterSatuan = await this.props.insertMasterSatuan({
            nama: this.state.nama_satuan_inserted,
            alias: this.state.nama_alias_satuan_inserted
        }).catch(err => err)
        Toast.hide();

        if (resinsertMasterSatuan) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalConfirmInsert()
                this.handleModalInsert()
                this.loadSatuan()
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

    handleDetailSatuan = async (e, id) => {
        this.handleModalDetail()
        e.stopPropagation()
        const resdetail = await this.props.getDataDetailedMasterSatuanAPI({ id: id }).catch(err => err)
        if (resdetail) {
            this.setState({
                id_satuan_selected: id,
                nama_satuan_selected: resdetail.nama,
                nama_alias_satuan_selected: resdetail.alias,
                pembanding_nama_satuan_selected: resdetail.nama,
                pembanding_nama_alias_satuan_selected: resdetail.alias
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

    handleModalDetail = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            empty_nama_satuan_selected: false,
            isBtnUpdate: true
        })
    }

    handleModalConfirm = () => {
        if (this.state.nama_satuan_selected === '') { this.setState({ empty_nama_satuan_selected: true }) }
        if (this.state.nama_alias_satuan_selected === '') { this.setState({ empty_nama_alias_satuan_selected: true }) }
        if (this.state.nama_satuan_selected !== '' && this.state.nama_alias_satuan_selected !== '') {
            this.setState({
                isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
            })
        }
    }

    confirmActionUpdateCategory = async () => {
        Toast.loading('Loading...');        
        const resupdateMasterSatuan = await this.props.updateMasterSatuan({
            id: this.state.id_satuan_selected,
            nama: this.state.nama_satuan_selected,
            alias: this.state.nama_alias_satuan_selected
        }).catch(err => err)
        Toast.hide();

        if (resupdateMasterSatuan) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalConfirm()
                this.handleModalDetail()
                this.loadSatuan()
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
                    label: 'Nama Satuan',
                    field: 'nama',
                    width: 100
                },
                {
                    label: 'Nama Alias Satuan',
                    field: 'alias',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allSatuan
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-box2 icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Master Satuan
                                    <div className="page-title-subheading">Daftar master satuan pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">

                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Tambah satuan" onClick={this.handleModalInsert}>
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

                {/* Modal Insert Satuan */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Satuan</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Satuan</p>
                                <Input type="text" name="nama_satuan_inserted" id="nama_satuan_inserted"
                                    placeholder="Nama Satuan" onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_satuan_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Alias Satuan</p>
                                <Input type="text" name="nama_alias_satuan_inserted" id="nama_alias_satuan_inserted"
                                    placeholder="Nama Alias Satuan" onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_alias_satuan_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={(this.state.nama_satuan_inserted !== '' && this.state.nama_alias_satuan_inserted !== '') ? false : true}>Tambah</Button>
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
                        <Button color="primary" onClick={this.confirmActionInsertSatuan}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Satuan */}
                <Modal size="md" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Detail Satuan</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Satuan</p>
                                <Input type="text" name="nama_satuan_selected" id="nama_satuan_selected"
                                    placeholder="Nama Satuan" value={this.state.nama_satuan_selected} onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_satuan_selected} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Alias Satuan</p>
                                <Input type="text" name="nama_alias_satuan_selected" id="nama_alias_satuan_selected"
                                    placeholder="Nama Alias Satuan" value={this.state.nama_alias_satuan_selected} onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_alias_satuan_selected} />
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
    getDataSatuanAPI: (data) => dispatch(getDataSatuanAPI(data)),
    getDataDetailedMasterSatuanAPI: (data) => dispatch(getDataDetailedMasterSatuanAPI(data)),
    insertMasterSatuan: (data) => dispatch(insertMasterSatuan(data)),
    updateMasterSatuan: (data) => dispatch(updateMasterSatuan(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentMasterSatuanSuperAdmin));