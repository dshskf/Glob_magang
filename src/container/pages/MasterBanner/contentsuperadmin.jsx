import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { encrypt } from '../../../config/lib';
import { queryKalenderData } from '../../../config/redux/action';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, FormFeedback, Label } from 'reactstrap'
import swal from 'sweetalert';


class ContentMasterBanner extends Component {
    state = {
        isUpdateOpen: false,
        isDeleteOpen: false,
        isInsertOpen: false,
        itemData: null,
        isUpdate: false,
        fileData: null
    }

    handleFileInput = () => {

    }

    confirmInsertForm = () => {
        // const passQuery =
    }


    render() {
        const dataBanner = {
            columns: [
                {
                    label: 'Nama Gambar',
                    field: 'nama_gambar',
                },
                {
                    label: 'Action',
                    field: 'action',
                }
            ],
            rows: [
                {
                    nama_gambar: 'super',
                    action: <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary" value="update"> Edit</button>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-danger" value="delete"> Delete</button>
                    </center>
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
                                    <i className="pe-7s-photo icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Banner
                                <div className="page-title-subheading">Daftar Banner
                                </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Perbarui data ongkir" onClick={() => this.setState({ isInsertOpen: true })}>
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
                                            data={dataBanner}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal size="md" toggle={() => this.setState({ isInsertOpen: false })} isOpen={this.state.isInsertOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={() => this.setState({ isInsertOpen: false })}>Unggah Banner</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <FormGroup>
                                    <Input type="file" accept=".png, .jpg, .jpeg"
                                        onChange={this.handleFileInput} style={{ marginTop: '5%' }}></Input>
                                </FormGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={this.state.fileData ? false : true} onClick={this.confirmInsertForm}>Perbarui</Button>
                            <Button color="danger" onClick={() => this.setState({ isInsertOpen: false })}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal size="md" toggle={() => this.setState({ isUpdateOpen: false })} isOpen={this.state.isUpdateOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={() => this.setState({ isUpdateOpen: false })}>Edit Banner</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <FormGroup>
                                    <Input type="file" accept=".png, .jpg, .jpeg"
                                        onChange={this.handleFileInput} style={{ marginTop: '5%' }}></Input>
                                </FormGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={this.state.fileData ? false : true} onClick={this.confirmInsertForm}>Perbarui</Button>
                            <Button color="danger" onClick={() => this.setState({ isUpdateOpen: false })}>Batal</Button>
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
    // queryKalender: (data) => dispatch(queryKalenderData(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentMasterBanner));
