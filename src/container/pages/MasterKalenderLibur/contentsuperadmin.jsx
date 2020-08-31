import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { encrypt } from '../../../config/lib';
import { queryKalenderData } from '../../../config/redux/action';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, FormFeedback, Label } from 'reactstrap'
import swal from 'sweetalert';
import readXlsxFile from 'read-excel-file'
import Toast from 'light-toast';

class ContentMasterKalenderLibur extends Component {
    state = {
        kalenderData: null,
        isUpdateOpen: false,
        isDeleteOpen: false,
        isInsertOpen: false,
        itemData: null,
        isUpdate: false,
        fileData: null
    }

    async componentDidMount() {
        let tempData = []

        let passquery = encrypt("select * from gcm_kalender_libur")
        const getData = await this.props.queryKalender({ query: passquery }).catch(err => err)

        getData.map(data => {

            const actionButton =
                <center>
                    <button className="mb-2 mr-2 btn-transition btn btn-outline-primary" value="update" name={data.id} onClick={this.handleModalOpen}> Edit</button>
                    <button className="mb-2 mr-2 btn-transition btn btn-outline-danger" value="delete" name={data.id} onClick={this.handleModalOpen}> Delete</button>
                </center>

            tempData.push({
                id: data.id,
                tanggal: data.tanggal.split("T")[0],
                keterangan: data.keterangan,
                action: actionButton
            })
            return
        })

        this.setState({ kalenderData: tempData })
    }

    filterData = (id) => {
        return this.state.kalenderData.filter(data => {
            if (data.id === id) {
                return data
            }
            return
        })
    }

    handleModalOpen = e => {
        const { name, value } = e.target
        const selected_date = this.filterData(name)[0]
        const dataToPass = {
            id: selected_date.id,
            date: selected_date.tanggal,
            keterangan: selected_date.keterangan
        }

        if (value === "update") {
            this.setState({
                isUpdateOpen: true,
                itemData: dataToPass
            })
        } else {
            this.setState({
                isDeleteOpen: true,
                itemData: dataToPass
            })
        }

    }

    handleModalClose = () => {
        this.setState({
            isUpdateOpen: false,
            isDeleteOpen: false
        })
    }


    inputHandler = e => {
        const { name, value } = e.target
        if (name === "updateDate") {
            this.setState({ itemData: { ...this.state.itemData, date: value }, isUpdate: true })
        }
        else {
            this.setState({ itemData: { ...this.state.itemData, keterangan: value }, isUpdate: true })
        }

    }

    updateKalender = async () => {
        Toast.loading('Loading...');

        const { id, date, keterangan } = this.state.itemData

        let passquery = encrypt(`
            update gcm_kalender_libur set 
            tanggal= '${date}', keterangan= '${keterangan}'
            where id=${id} returning *;
        `)

        const getData = await this.props.queryKalender({ query: passquery }).catch(err => err)
        Toast.hide();

        if (getData[0]) {
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

    deleteKalender = async () => {
        Toast.loading('Loading...');
        const { id } = this.state.itemData

        let passquery = encrypt(`
            delete from gcm_kalender_libur            
            where id=${id} returning *;
        `)

        const getData = await this.props.queryKalender({ query: passquery }).catch(err => err)
        Toast.hide();

        if (getData[0]) {
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

    inputFileHandler = async (e) => {
        let temp = []
        await readXlsxFile(e.target.files[0]).then((rows) => {
            rows.map((data, index) => {
                if (index > 1) {
                    temp.push({
                        date: data[0],
                        keterangan: data[1]
                    })
                }
                return
            })
        })

        this.setState({ fileData: temp })
    }

    handleInsertForm = async () => {
        Toast.loading('Loading...');
        let passquery = `insert into gcm_kalender_libur(tanggal,keterangan) values`

        this.state.fileData.map((data, index) => {
            if (index > 0) {
                if (index === this.state.fileData.length - 1) {
                    passquery += `('${data.date}','${data.keterangan}') returning * ;`
                }
                else {
                    passquery += `('${data.date}','${data.keterangan}'),`
                }

            }
            return

        })

        const insertData = await this.props.queryKalender({ query: encrypt(passquery) }).catch(err => err)
        Toast.hide();
        if (insertData[0]) {
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

    render() {
        const dataLibur = {
            columns: [
                {
                    label: 'Tanggal',
                    field: 'tanggal',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                },
                {
                    label: 'Action',
                    field: 'action'
                }
            ],
            rows: this.state.kalenderData
        }


        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-car icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Kalender Libur
                                    <div className="page-title-subheading">Daftar Kalender ContentMasterKalenderLibur
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
                        <button className="sm-2 mr-2 btn btn-danger" >
                            <Link
                                to="admin/assets/files/TemplateKalenderLibur.xlsx"
                                target="_blank"
                                download
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    padding: '5px'
                                }}
                            >Unduh template</Link>
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
                                            data={dataLibur}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal size="md" toggle={this.handleModalClose} isOpen={this.state.isUpdateOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleModalClose}>Update Kalender</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <FormGroup>
                                    <Label style={{ fontWeight: 'bold' }} for="Date">Tanggal</Label>
                                    <Input
                                        type="date"
                                        name="updateDate"
                                        id="Date"
                                        placeholder="date placeholder"
                                        value={this.state.isUpdateOpen ? this.state.itemData.date : null}
                                        onChange={this.inputHandler}
                                        invalid={this.state.isUpdateOpen ?
                                            this.state.itemData.date === "" ? true : false
                                            :
                                            false
                                        }
                                    />
                                    <FormFeedback>Kolom ini wajib diisi</FormFeedback>

                                    <Label style={{ fontWeight: 'bold' }} for="Date">Keterangan</Label>
                                    <Input
                                        type="text"
                                        name="updateKeterangan"
                                        id="keterangan"
                                        placeholder="Keterangan"
                                        onChange={this.inputHandler}
                                        value={this.state.isUpdateOpen ? this.state.itemData.keterangan : null}
                                        invalid={this.state.isUpdateOpen ?
                                            this.state.itemData.keterangan === "" ? true : false
                                            :
                                            false
                                        }
                                    />
                                    <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                                </FormGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={
                                this.state.isUpdateOpen ?
                                    this.state.itemData.date !== "" && this.state.itemData.keterangan !== "" ?
                                        this.state.isUpdate ? false : true
                                        :
                                        true
                                    :
                                    false
                            } onClick={this.updateKalender}>Update</Button>
                            <Button color="danger" onClick={this.handleModalClose}>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal size="md" toggle={this.handleModalClose} isOpen={this.state.isDeleteOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={this.handleModalClose}>Delete Kalender</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <FormGroup>
                                    <Label style={{ fontWeight: 'bold' }} for="Date">Tanggal</Label>
                                    <Input
                                        type="date"
                                        name="updateDate"
                                        id="Date"
                                        placeholder="date placeholder"
                                        value={this.state.isDeleteOpen ? this.state.itemData.date : null}
                                        onChange={this.inputHandler}
                                        disabled
                                    />

                                    <Label style={{ fontWeight: 'bold' }} for="Date">Keterangan</Label>
                                    <Input
                                        type="text"
                                        name="updateKeterangan"
                                        id="keterangan"
                                        placeholder="Keterangan"
                                        onChange={this.inputHandler}
                                        value={this.state.isDeleteOpen ? this.state.itemData.keterangan : null}
                                        disabled
                                    />
                                </FormGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.deleteKalender}>Delete</Button>
                            <Button color="danger" onClick={this.handleModalClose}>Batal</Button>
                        </ModalFooter>
                    </Modal>


                    <Modal size="md" toggle={() => this.setState({ isInsertOpen: false })} isOpen={this.state.isInsertOpen} backdrop="static" keyboard={false}>
                        <ModalHeader toggle={() => this.setState({ isInsertOpen: false })}>Perbarui Kalender Libur</ModalHeader>
                        <ModalBody>
                            <div className="position-relative form-group" style={{ marginTop: '3%' }}>
                                <div className="alert alert-danger fade show text-center" role="alert">
                                    <center>
                                        <p className="mb-0">Pastikan berkas yang diunggah sesuai dengan </p>
                                        <p className="mb-0">Format berkas jadwal libur yang ditentukan oleh GLOB.</p>
                                    </center>
                                </div>
                                <FormGroup>
                                    <p className="mb-0" style={{ fontWeight: 'bold' }}>Unggah Kalender Libur (.xlsx)</p>
                                    <Input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        onChange={this.inputFileHandler} style={{ marginTop: '5%' }}></Input>
                                </FormGroup>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={this.state.fileData ? false : true} onClick={this.handleInsertForm}>Perbarui</Button>
                            <Button color="danger" onClick={() => this.setState({ isInsertOpen: false })}>Batal</Button>
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
    queryKalender: (data) => dispatch(queryKalenderData(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(ContentMasterKalenderLibur));
