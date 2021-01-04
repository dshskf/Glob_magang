import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getDataPaymentAPI, insertMasterPayment, getDataDetailedMasterPaymentAPI, updateMasterPayment, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, FormFeedback } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import Toast from 'light-toast';

class ContentMasterPaymentSuperAdmin extends Component {
    state = {
        id_pengguna_login: '',
        company_id: '',
        company_name: '',
        tipe_bisnis: '',
        allPayment: [],
        isOpen: false,
        isOpenInsert: false,
        isOpenConfirmInsert: false,
        isOpenConfirmUpdate: false,
        empty_nama_payment_inserted: false,
        empty_nama_payment_selected: false,
        empty_deskripsi_payment_inserted: false,
        empty_deskripsi_payment_selected: false,
        empty_durasi_payment_selected: false,
        empty_durasi_payment_inserted: false,
        nama_payment_inserted: '',
        deskripsi_payment_inserted: '',
        durasi_payment_inserted: '',
        id_payment_selected: '',
        nama_payment_selected: '',
        deskripsi_payment_selected: '',
        durasi_payment_selected: '',
        isBtnUpdate: true,
        isBtnInsert: true
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.setState({
            id_pengguna_login: decrypt(userData.id),
            company_id: decrypt(userData.company_id),
            company_name: decrypt(userData.company_name),
            tipe_bisnis: decrypt(userData.tipe_bisnis)
        })
        this.loadPayment()
    }

    loadPayment = async () => {
        const respayment = await this.props.getDataPaymentAPI().catch(err => err)
        if (respayment) {
            respayment.map((user, index) => {
                return (
                    respayment[index].durasi =
                    <p className="mb-0 text-center"> {user.durasi}</p>,
                    respayment[index].keterangan =
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailPayment(e, respayment[index].id)}> Detail</button>
                    </center>
                )
            })
            this.setState({
                allPayment: respayment
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
            isBtnInsert: true,
            empty_deskripsi_payment_inserted: false,
            empty_nama_payment_inserted: false,
            empty_durasi_payment_inserted: false,
            nama_payment_inserted: '',
            deskripsi_payment_inserted: '',
            durasi_payment_inserted: ''
        })
    }

    handleChange = (event) => {
        if (event.target.name === 'nama_payment_selected') {
            this.check_field_nama_payment_edited(event.target.value)
        }
        if (event.target.name === 'deskripsi_payment_selected') {
            this.check_field_deskripsi_payment_edited(event.target.value)
        }
        if (event.target.name === 'nama_payment_inserted') {
            this.check_field_nama_payment(event.target.value)
        }
        if (event.target.name === 'deskripsi_payment_inserted') {
            this.check_field_deskripsi_payment(event.target.value)
        }
        if (event.target.name === 'durasi_payment_inserted') {
            if (isNaN(Number(event.target.value))) {
                return;
            } else {
                this.check_field_durasi_payment(event.target.value)
            }
        }
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    check_field_nama_payment_edited = (e) => {
        if (e === '') {
            this.setState({ empty_nama_payment_selected: true, isBtnUpdate: true })
        } else {
            this.setState({ empty_nama_payment_selected: false })
            if (this.state.deskripsi_payment_selected !== '') {
                this.setState({ isBtnUpdate: false })
            }
        }
    }

    check_field_deskripsi_payment_edited = (e) => {
        if (e === '') {
            this.setState({ empty_deskripsi_payment_selected: true, isBtnUpdate: true })
        } else {
            this.setState({ empty_deskripsi_payment_selected: false })
            if (this.state.nama_payment_selected !== '') {
                this.setState({ isBtnUpdate: false })
            }
        }
    }

    check_field_nama_payment = (e) => {
        if (e === '') {
            this.setState({ empty_nama_payment_inserted: true, isBtnInsert: true })
        } else {
            this.setState({ empty_nama_payment_inserted: false })
            if (this.state.deskripsi_payment_inserted !== '' && this.state.durasi_payment_inserted !== '') {
                this.setState({ isBtnInsert: false })
            }
        }
    }

    check_field_deskripsi_payment = (e) => {
        if (e === '') {
            this.setState({ empty_deskripsi_payment_inserted: true, isBtnInsert: true })
        } else {
            this.setState({ empty_deskripsi_payment_inserted: false })
            if (this.state.nama_payment_inserted !== '' && this.state.durasi_payment_inserted !== '') {
                this.setState({ isBtnInsert: false })
            }
        }
    }

    check_field_durasi_payment = (e) => {
        if (e === '') {
            this.setState({ empty_durasi_payment_inserted: true, isBtnInsert: true })
        } else {
            this.setState({ empty_durasi_payment_inserted: false })
            if (this.state.nama_payment_inserted !== '' && this.state.deskripsi_payment_inserted !== '') {
                this.setState({ isBtnInsert: false })
            }
        }
    }

    handleWhiteSpace = (e) => {
        if (e.which === 32 && !e.target.value.length) {
            e.preventDefault()
        }
    }

    handleModalConfirmInsert = () => {
        this.setState({
            isOpenConfirmInsert: !this.state.isOpenConfirmInsert
        })
    }

    confirmActionInsertPayment = async () => {
        Toast.loading('Loading...');
        const resinsertMasterPayment = await this.props.insertMasterPayment({
            payment_name: this.state.nama_payment_inserted,
            description: this.state.deskripsi_payment_inserted,
            duration: this.state.durasi_payment_inserted
        }).catch(err => err)
        Toast.hide();
        if (resinsertMasterPayment) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalConfirmInsert()
                this.handleModalInsert()
                this.loadPayment()
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

    handleDetailPayment = async (e, id) => {
        this.handleModalDetail()
        e.stopPropagation()
        const resdetail = await this.props.getDataDetailedMasterPaymentAPI({ id: id }).catch(err => err)
        if (resdetail) {
            this.setState({
                id_payment_selected: id,
                nama_payment_selected: resdetail.nama_payment,
                deskripsi_payment_selected: resdetail.deskripsi_payment,
                durasi_payment_selected: resdetail.durasi_payment
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
            empty_deskripsi_payment_selected: false,
            empty_nama_payment_selected: false,
            empty_durasi_payment_selected: false,
            isBtnUpdate: true
        })
    }

    handleModalConfirm = () => {
        this.setState({
            isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
        })
    }

    confirmActionUpdatePayment = async () => {
        Toast.loading('Loading...');        
        const resupdateMasterPayment = await this.props.updateMasterPayment({
            payment_name: this.state.nama_payment_selected,
            description: this.state.deskripsi_payment_selected,
            id: this.state.id_payment_selected
        }).catch(err => err)
        Toast.hide();
        if (resupdateMasterPayment) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.handleModalConfirm()
                this.handleModalDetail()
                this.loadPayment()
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

    handleWhiteSpaceNumber = (e) => {
        if ((e.which === 32 && !e.target.value.length) || e.which === 32) {
            e.preventDefault()
        }
    }

    render() {
        const data = {
            columns: [
                {
                    label: 'Nama Payment',
                    field: 'payment_name',
                    width: 100
                },
                {
                    label: 'Deskripsi Payment',
                    field: 'deskripsi',
                    width: 100
                },
                {
                    label: 'Durasi Payment (Hari)',
                    field: 'durasi',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
            rows: this.state.allPayment
        }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-cash icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Master Payment
                                    <div className="page-title-subheading">Daftar master payment pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">

                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Tambah metode payment" onClick={this.handleModalInsert}>
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

                {/* Modal Insert Payment Method */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Metode Payment</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Payment</p>
                                <Input type="text" name="nama_payment_inserted" id="nama_payment_inserted"
                                    placeholder="Nama Payment" onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    value={this.state.nama_payment_inserted}
                                    invalid={this.state.empty_nama_payment_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Deskripsi Payment</p>
                                <Input type="text" name="deskripsi_payment_inserted" id="deskripsi_payment_inserted"
                                    value={this.state.deskripsi_payment_inserted}
                                    placeholder="Deskripsi Payment" onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_deskripsi_payment_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Durasi Payment (Hari)</p>
                                <Input type="text" name="durasi_payment_inserted" id="durasi_payment_inserted"
                                    value={this.state.durasi_payment_inserted}
                                    placeholder="Durasi Payment" onChange={this.handleChange} onKeyPress={this.handleWhiteSpaceNumber}
                                    invalid={this.state.empty_durasi_payment_inserted} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={this.state.isBtnInsert}>Tambah</Button>
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
                        <Button color="primary" onClick={this.confirmActionInsertPayment}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Payment */}
                <Modal size="md" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Detail Payment</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Nama Payment</p>
                                <Input type="text" name="nama_payment_selected" id="nama_payment_selected"
                                    placeholder="Nama Payment" value={this.state.nama_payment_selected} onChange={this.handleChange}
                                    onKeyPress={this.handleWhiteSpace}
                                    disabled={true}
                                    invalid={this.state.empty_nama_payment_selected} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Deskripsi Payment</p>
                                <Input type="textarea" name="deskripsi_payment_selected" id="deskripsi_payment_selected"
                                    placeholder="Deskripsi Payment" value={this.state.deskripsi_payment_selected} onChange={this.handleChange}
                                    onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_deskripsi_payment_selected} />
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <p className="mb-0" style={{ fontWeight: 'bold' }}>Durasi Payment</p>
                                <Input type="text" name="durasi_payment_selected" id="durasi_payment_selected"
                                    placeholder="Durasi Payment" value={this.state.durasi_payment_selected} onChange={this.handleChange}
                                    onKeyPress={this.handleWhiteSpace}
                                    disabled={true}
                                    invalid={this.state.empty_durasi_payment_selected} />
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
                        <Button color="primary" onClick={this.confirmActionUpdatePayment}>Perbarui</Button>
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
    getDataPaymentAPI: (data) => dispatch(getDataPaymentAPI(data)),
    getDataDetailedMasterPaymentAPI: (data) => dispatch(getDataDetailedMasterPaymentAPI(data)),
    insertMasterPayment: (data) => dispatch(insertMasterPayment(data)),
    updateMasterPayment: (data) => dispatch(updateMasterPayment(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentMasterPaymentSuperAdmin));