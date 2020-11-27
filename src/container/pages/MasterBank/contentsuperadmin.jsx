import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { decrypt, encrypt } from '../../../config/lib';
import { uploadGambarBanner, postQuery } from '../../../config/redux/action';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup } from 'reactstrap'
// import Resizer from './react-file-image-resizer';
import swal from 'sweetalert';
import Toast from 'light-toast';

class ContentMasterBank extends Component {
    state = {
        isUpdateOpen: false,
        isDeleteOpen: false,
        isInsertOpen: false,
        bankInput: '',
        bankData: null,
        selectedbankData: null
    }

    async componentDidMount() {
        this.fetchMasterBank()
    }

    fetchMasterBank = async () => {
        const passquery = encrypt(`select * from gcm_master_bank`)
        const bank = await this.props.postData({ query: passquery }).catch(err => err)

        const bankList = bank.map(data => ({
            id: data.id,
            nama: data.nama,
            statue: data.status,
            create_by: data.create_by,
            action: <center>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-primary" name={data.id} onClick={this.handleOpenUpdatebank} value="update"> Edit</button>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-danger" name={data.id} onClick={this.handleOpenDeletebank} value="delete"> Delete</button>
            </center>
        }))

        this.setState({ bankData: bankList })
    }



    handleInput = async (e) => {
        this.setState({ bankInput: e.target.value })
    }

    handleOpenTambahbank = () => {
        const { isInsertOpen } = this.state
        this.setState({ isInsertOpen: isInsertOpen ? false : true, imageData: null, imageShow: null, bankInput: '' })
    }

    handleOpenUpdatebank = (e) => {
        const { isUpdateOpen } = this.state

        if (!isUpdateOpen) {
            let bank = this.state.bankData.filter(data => data.id === e.target.name)
            bank = bank[0]

            this.setState({
                selectedbankData: bank,
                bankInput: bank.nama
            })
        }
        this.setState({ isUpdateOpen: isUpdateOpen ? false : true })
    }

    handleOpenDeletebank = (e) => {
        const { isDeleteOpen } = this.state
        if (!isDeleteOpen) {
            let bank = this.state.bankData.filter(data => data.id === e.target.name)
            bank = bank[0]

            this.setState({
                selectedbankData: bank,
                bankInput: bank.nama
            })
        }
        this.setState({ isDeleteOpen: isDeleteOpen ? false : true })
    }

    confirmAction = async (method) => {
        Toast.loading('Loading...');
        const userData = JSON.parse(localStorage.getItem('userData'))
        let passQuery = ''

        // C-> Create, U-> Update, D-> Delete


        if (method === "C") {
            passQuery = encrypt(`
                    insert into gcm_master_bank(nama,status,create_by,create_date,update_by,update_date) 
                    values('${this.state.bankInput}','A',${decrypt(userData.company_id)},now(),${decrypt(userData.company_id)},now()) 
                    returning *
                `)
        } else if (method === "U") {
            passQuery = encrypt(`
                update gcm_master_bank set nama='${this.state.bankInput}',status='I',
                update_by=${decrypt(userData.company_id)},update_date=now()
                where id=${this.state.selectedbankData.id} returning *
            `)
        } else {
            passQuery = encrypt(`delete from gcm_master_bank where id=${this.state.selectedbankData.id} returning *`)
        }

        const insertbank = await this.props.postData({ query: passQuery }).catch(err => err)

        if (insertbank) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(() => {
                this.closeModal()
                this.fetchMasterBank()
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


        Toast.hide();
    }

    closeModal = () => {
        this.setState({
            isInsertOpen: false,
            isUpdateOpen: false,
            isDeleteOpen: false,
            bankInput: '',
        })
        this.fetchMasterBank()
    }

    render() {
        const databank = {
            columns: [
                {
                    label: 'Nama Bank',
                    field: 'nama',
                },
                {
                    label: 'Action',
                    field: 'action',
                }
            ],
            rows: this.state.bankData
        }

        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-photo icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen bank
                                <div className="page-title-subheading">Daftar bank
                                </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Perbarui data ongkir" onClick={this.handleOpenTambahbank}>
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
                                            data={databank}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ADD */}
                    <Modal size="md" toggle={this.handleOpenTambahbank} isOpen={this.state.isInsertOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleOpenTambahbank}>Tambah bank</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <FormGroup>
                                    <Input type="text" onChange={this.handleInput} style={{ marginTop: '5%' }} value={this.state.bankInput} />
                                </FormGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={this.state.bankInput === ''} onClick={() => this.confirmAction("C")}>Tambah</Button>
                            <Button color="danger" onClick={this.handleOpenTambahbank}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    {/* UPDATE */}
                    <Modal size="md" toggle={this.handleOpenUpdatebank} isOpen={this.state.isUpdateOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleOpenUpdatebank}>Edit bank</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <FormGroup>
                                    <Input type="text" onChange={this.handleInput} style={{ marginTop: '5%' }} value={this.state.bankInput} />
                                </FormGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={this.state.bankInput === ''} onClick={() => this.confirmAction("U")}>Perbarui</Button>
                            <Button color="danger" onClick={this.handleOpenUpdatebank}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    {/* DELETE */}
                    <Modal size="md" toggle={this.handleOpenDeletebank} isOpen={this.state.isDeleteOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleOpenDeletebank}>Hapus bank</ModalHeader>
                        <ModalBody>
                            {
                                this.state.imageShow && <img style={{ width: '100%' }} src={this.state.imageShow} alt="" />
                            }
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <label>Apakah yakin akan melakukan aksi ini?</label>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.confirmAction("D")}>Hapus</Button>
                            <Button color="danger" onClick={this.handleOpenDeletebank}>Batal</Button>
                        </ModalFooter>
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
    uploadGambarBanner: (data) => dispatch(uploadGambarBanner(data)),
    postData: (data) => dispatch(postQuery(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentMasterBank));
