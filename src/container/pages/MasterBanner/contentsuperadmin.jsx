import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { encrypt } from '../../../config/lib';
import { uploadGambarBanner, postQuery } from '../../../config/redux/action';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup } from 'reactstrap'
import Resizer from './react-file-image-resizer';
import swal from 'sweetalert';
import Toast from 'light-toast';

class ContentMasterBanner extends Component {
    state = {
        isUpdateOpen: false,
        isDeleteOpen: false,
        isInsertOpen: false,
        imageData: null,
        imageShow: null,
        bannerData: null,
        selectedBannerData: null
    }

    async componentDidMount() {
        this.loadMasterBannerData()
    }

    loadMasterBannerData = async () => {
        const passquery = encrypt(`select * from gcm_master_banner`)
        const banner = await this.props.postData({ query: passquery }).catch(err => err)

        const bannerList = banner.map(data => ({
            id: data.id,
            foto: data.foto,
            nama: data.nama,
            action: <center>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-primary" name={data.id} onClick={this.handleOpenUpdateBanner} value="update"> Edit</button>
                <button className="mb-2 mr-2 btn-transition btn btn-outline-danger" name={data.id} onClick={this.handleOpenDeleteBanner} value="delete"> Delete</button>
            </center>
        }))

        this.setState({ bannerData: bannerList })
    }

    resizeImage = (imgData, width, height) => {
        const fileName = imgData.name
        const fileExtension = fileName.split(".")[1]
        if (imgData) {
            Resizer.imageFileResizer(
                imgData,
                width,
                height,
                fileExtension,
                100,
                0,
                uri => {
                    const img = {
                        tmp: uri.blobImg,
                        tmpPict: fileName
                    }
                    this.setState({ imageData: img, imageShow: uri.base64Img })
                }
                ,
                'base64'
            );
        }
    }

    handleFileInput = async (e) => {
        const scope = this
        const file = e.target.files[0]
        const img = new Image()

        img.src = window.URL.createObjectURL(e.target.files[0])
        img.onload = function () {
            scope.resizeImage(file, this.width, this.height)
        }
    }

    handleOpenTambahBanner = () => {
        const { isInsertOpen } = this.state
        this.setState({ isInsertOpen: !isInsertOpen, imageData: null, imageShow: null })
    }

    handleOpenUpdateBanner = (e) => {
        const { isUpdateOpen } = this.state

        if (!isUpdateOpen) {
            let banner = this.state.bannerData.filter(data => data.id === e.target.name)
            banner = banner[0]

            this.setState({
                imageShow: banner.foto,
                selectedBannerData: banner
            })
        }
        this.setState({ isUpdateOpen: isUpdateOpen ? false : true })
    }

    handleOpenDeleteBanner = (e) => {
        const { isDeleteOpen } = this.state
        if (!isDeleteOpen) {
            let banner = this.state.bannerData.filter(data => data.id === e.target.name)
            banner = banner[0]

            this.setState({
                imageShow: banner.foto,
                selectedBannerData: banner
            })
        }
        this.setState({ isDeleteOpen: isDeleteOpen ? false : true })
    }

    confirmAction = async (method) => {
        Toast.loading('Loading...');
        let resupload = null
        let passQuery = ''

        if (method !== "D") {
            resupload = await this.props.uploadGambarBanner(this.state.imageData).catch(err => err)
        }

        // C-> Create, U-> Update, D-> Delete

        if (resupload || method === "D") {
            if (method === "C") {
                const fileName = this.state.imageData.tmpPict
                passQuery = encrypt(`insert into gcm_master_banner(foto,nama) values('${resupload}','${fileName}') returning *`)
            } else if (method === "U") {
                const fileName = this.state.imageData.tmpPict
                passQuery = encrypt(`update gcm_master_banner set foto='${resupload}',nama='${fileName}' where id=${this.state.selectedBannerData.id} returning *`)
            } else {
                passQuery = encrypt(`delete from gcm_master_banner where id=${this.state.selectedBannerData.id} returning *`)
            }

            const insertBanner = await this.props.postData({ query: passQuery }).catch(err => err)

            if (insertBanner) {
                swal({
                    title: "Sukses!",
                    text: "Perubahan disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(() => {
                    if (method === 'C') {
                        this.handleOpenTambahBanner()
                    } else if (method === 'U') {
                        this.handleOpenUpdateBanner()
                    } else {
                        this.handleOpenDeleteBanner()
                    }
                    this.loadMasterBannerData()
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

        Toast.hide();
    }

    render() {
        const dataBanner = {
            columns: [
                {
                    label: 'Nama Gambar',
                    field: 'nama',
                },
                {
                    label: 'Action',
                    field: 'action',
                }
            ],
            rows: this.state.bannerData
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
                        <button className="sm-2 mr-2 btn btn-primary" title="Perbarui data ongkir" onClick={this.handleOpenTambahBanner}>
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
                    {/* ADD */}
                    <Modal size="md" toggle={this.handleOpenTambahBanner} isOpen={this.state.isInsertOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleOpenTambahBanner}>Unggah Banner</ModalHeader>
                        <ModalBody>
                            {
                                this.state.imageShow && <img style={{ width: '100%' }} src={this.state.imageShow} alt="" />
                            }

                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <FormGroup>
                                    <Input type="file" accept=".png, .jpg, .jpeg"
                                        onChange={this.handleFileInput} style={{ marginTop: '5%' }}></Input>
                                </FormGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={this.state.imageData ? false : true} onClick={() => this.confirmAction("C")}>Tambah</Button>
                            <Button color="danger" onClick={this.handleOpenTambahBanner}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    {/* UPDATE */}
                    <Modal size="md" toggle={this.handleOpenUpdateBanner} isOpen={this.state.isUpdateOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleOpenUpdateBanner}>Edit Banner</ModalHeader>
                        <ModalBody>
                            {
                                this.state.imageShow && <img style={{ width: '100%' }} src={this.state.imageShow} alt="" />
                            }
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <FormGroup>
                                    <Input type="file" accept=".png, .jpg, .jpeg"
                                        onChange={this.handleFileInput} style={{ marginTop: '5%' }}></Input>
                                </FormGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={this.state.imageData ? false : true} onClick={() => this.confirmAction("U")}>Perbarui</Button>
                            <Button color="danger" onClick={this.handleOpenUpdateBanner}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    {/* DELETE */}
                    <Modal size="md" toggle={this.handleOpenDeleteBanner} isOpen={this.state.isDeleteOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleOpenDeleteBanner}>Edit Banner</ModalHeader>
                        <ModalBody>
                            {
                                this.state.imageShow && <img style={{ width: '100%' }} src={this.state.imageShow} alt="" />
                            }
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <label>Apakah yakin akan melakukan aksi ini?</label>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.confirmAction("D")}>Delete</Button>
                            <Button color="danger" onClick={this.handleOpenDeleteBanner}>Batal</Button>
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

export default withRouter(connect(reduxState, reduxDispatch)(ContentMasterBanner));
