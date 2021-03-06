import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getDataReasonAPI, insertMasterReason, getDataDetailedMasterReasonAPI, updateMasterReason, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, FormFeedback } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import Toast from 'light-toast';

class ContentMasterReasonSuperAdmin extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        isOpen: false,
        isOpenInsert: false,
        isOpenConfirmInsert: false,
        isOpenConfirmUpdate: false,
        empty_nama_reason_inserted: false,
        empty_nama_reason_selected: false,
        allDataReason: [],
        pembanding_nama_reason_selected: '',
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
        this.loadReason()
    }

    loadReason = async () => {
        const resreason = await this.props.getDataReasonAPI().catch(err => err)
        if (resreason) {
            resreason.map((user, index) => {
                return (
                    resreason[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailReason(e, resreason[index].id)}> Detail</button>
                    </center>
                )
            })
            this.setState({
                allDataReason: resreason
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
            nama_reason_inserted: '',
            empty_nama_reason_inserted: false
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.name === 'nama_reason_inserted') {
            this.check_field(event.target.value)
        }
        if (event.target.name === 'nama_reason_selected') {
            this.check_field_edited(event.target.value)
        }
    }

    check_field = (e) => {
        if (e === '') {
            this.setState({ empty_nama_reason_inserted: true })
        } else {
            this.setState({ empty_nama_reason_inserted: false })
        }
    }

    check_field_edited = (e) => {
        if (e === '') {
            this.setState({ empty_nama_reason_selected: true, isBtnUpdate: true })
        } else if (e !== '') {
            this.setState({ empty_nama_reason_selected: false })
        }
        if (e !== '' && e === this.state.pembanding_nama_reason_selected) {
            this.setState({ empty_nama_reason_selected: false, isBtnUpdate: true })
        } else if (e !== '' && e !== this.state.pembanding_nama_reason_selected) {
            this.setState({ empty_nama_reason_selected: false, isBtnUpdate: false })
        }
    }

    handleWhiteSpace = (e) => {
        if (e.which === 32 && !e.target.value.length) {
            e.preventDefault()
        }
    }

    handleModalConfirmInsert = () => {
        if (this.state.nama_reason_inserted === '') { this.setState({ empty_nama_reason_inserted: true }) }
        if (this.state.nama_reason_inserted !== '') {
            this.setState({
                isOpenConfirmInsert: !this.state.isOpenConfirmInsert
            })
        }
    }

    confirmActionInsertReason = async () => {
        Toast.loading('Loading...');
        const resinsertMasterReason = await this.props.insertMasterReason({
            nama: this.state.nama_reason_inserted
        }).catch(err => err)
        Toast.hide();

        if (resinsertMasterReason) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalConfirmInsert()
                this.handleModalInsert()
                this.loadReason()
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

    handleDetailReason = async (e, id) => {
        this.handleModalDetail()
        e.stopPropagation()
        const resdetail = await this.props.getDataDetailedMasterReasonAPI({ id: id }).catch(err => err)
        if (resdetail) {
            this.setState({
                id_reason_selected: id,
                nama_reason_selected: resdetail.nama,
                pembanding_nama_reason_selected: resdetail.nama
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
            empty_nama_reason_selected: false
        })
    }

    handleModalConfirm = () => {
        if (this.state.nama_reason_selected === '') { this.setState({ empty_nama_reason_selected: true }) }
        if (this.state.nama_reason_selected !== '') {
            this.setState({
                isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
            })
        }
    }

    confirmActionUpdateReason = async () => {
        Toast.loading('Loading...');
        const resupdateMasterReason = await this.props.updateMasterReason({
            nama: this.state.nama_reason_selected,
            id: this.state.id_reason_selected
        }).catch(err => err)
        Toast.hide();

        if (resupdateMasterReason) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalConfirm()
                this.handleModalDetail()
                this.loadReason()
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
                    label: 'Nama Master Reason',
                    field: 'nama',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allDataReason
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-note icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Master Reason
                                    <div className="page-title-subheading">Daftar master reason pembatalan transaksi pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">

                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Tambah Reason" onClick={this.handleModalInsert}>
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

                {/* Modal Insert Reason */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Master Reason</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Master Reason</p>
                                <Input type="text" name="nama_reason_inserted" id="nama_reason_inserted"
                                    placeholder="Nama Master Reason" onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_reason_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={(this.state.nama_reason_inserted !== '') ? false : "disabled"}>Tambah</Button>
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
                        <Button color="primary" onClick={this.confirmActionInsertReason}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Barang */}
                <Modal size="md" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Detail Master Reason</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Master Reason</p>
                                <Input type="text" name="nama_reason_selected" id="nama_reason_selected"
                                    placeholder="Nama Master Reason" value={this.state.nama_reason_selected} onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_reason_selected} />
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
                        <Button color="primary" onClick={this.confirmActionUpdateReason}>Perbarui</Button>
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
    getDataReasonAPI: (data) => dispatch(getDataReasonAPI(data)),
    getDataDetailedMasterReasonAPI: (data) => dispatch(getDataDetailedMasterReasonAPI(data)),
    insertMasterReason: (data) => dispatch(insertMasterReason(data)),
    updateMasterReason: (data) => dispatch(updateMasterReason(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentMasterReasonSuperAdmin));