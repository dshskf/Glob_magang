import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getDataBlacklistAPI, insertMasterBlacklist, getDataDetailedMasterBlacklistAPI, updateMasterBlacklist, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, FormFeedback } from 'reactstrap'
import { withRouter } from 'react-router-dom';

class ContentMasterBlacklistSuperAdmin extends Component {
    state = {
        id_pengguna_login:'',
        company_id:'',
        company_name:'',
        tipe_bisnis:'',
        isOpen: false,
        isOpenInsert: false,
        isOpenConfirmInsert: false,
        isOpenConfirmUpdate: false,
        empty_nama_blacklist_inserted: false,
        empty_nama_blacklist_selected: false,
        allDataBlacklist:[],
        pembanding_nama_blacklist_selected: '',
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
        this.loadBlacklist()
    }

    loadBlacklist = async() => {
        let passqueryblacklist = encrypt("select * from gcm_master_type_blacklist order by gcm_master_type_blacklist.id;")
        const resblacklist = await this.props.getDataBlacklistAPI({query:passqueryblacklist}).catch(err => err)
        if (resblacklist) {
            resblacklist.map((user, index) => {
                return (
                    resblacklist[index].keterangan = 
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailBlacklist(e, resblacklist[index].id)}> Detail</button>
                    </center>
                )
            })
            this.setState({
                allDataBlacklist:resblacklist
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    const res = this.props.logoutAPI();
                    if (res) {
                        this.props.history.push('/admin')
                        window.location.reload()
                    }
                });
        }
    }

    handleModalInsert = () => {
        this.setState({
            isOpenInsert: !this.state.isOpenInsert,
            nama_blacklist_inserted:'',
            empty_nama_blacklist_inserted:false
        })
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name] : event.target.value
        })
        if (event.target.name === 'nama_blacklist_inserted') {
            this.check_field(event.target.value)
        }
        if (event.target.name === 'nama_blacklist_selected') {
            this.check_field_edited(event.target.value)
        }
    }

    check_field = (e) => {
        if (e === '') {
            this.setState({empty_nama_blacklist_inserted: true})
        } else {
            this.setState({empty_nama_blacklist_inserted: false})
        }
    }
    
    check_field_edited = (e) => {
        if (e === '') {
            this.setState({empty_nama_blacklist_selected: true, isBtnUpdate: true})
        } else if (e !== ''){
            this.setState({empty_nama_blacklist_selected: false})
        }
        if (e!== '' && e === this.state.pembanding_nama_blacklist_selected) {
            this.setState({empty_nama_blacklist_selected: false, isBtnUpdate: true})
        } else if (e!== '' && e !== this.state.pembanding_nama_blacklist_selected) {
            this.setState({empty_nama_blacklist_selected: false, isBtnUpdate: false})
        }
    }

    handleWhiteSpace = (e) => {
        if (e.which === 32 &&  !e.target.value.length) {
            e.preventDefault()
        }
    }

    handleModalConfirmInsert = () => {
        if(this.state.nama_blacklist_inserted === '') { this.setState({ empty_nama_blacklist_inserted: true }) }
        if (this.state.nama_blacklist_inserted !== '') {
                this.setState({
                    isOpenConfirmInsert: !this.state.isOpenConfirmInsert
                })
        }
    }

    confirmActionInsertBlacklist = async() => {
        let passqueryinsertblacklist = encrypt("insert into gcm_master_type_blacklist (nama) values ('"+this.state.nama_blacklist_inserted+"') "+
            " returning nama;")
        const resinsertMasterblacklist = await this.props.insertMasterBlacklist({query:passqueryinsertblacklist}).catch(err => err)
        if (resinsertMasterblacklist) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(()=> {
                this.loadBlacklist()
                window.location.reload()
            });
        } else {
            swal({
                title: "Gagal!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                button: false,
                timer: "2500"
              }).then(()=> {
                window.location.reload()
            });
        }
    }

    handleDetailBlacklist = async(e, id) => {
        this.handleModalDetail()
        e.stopPropagation()
        let passquerydetail = encrypt("select gcm_master_type_blacklist.id, gcm_master_type_blacklist.nama from gcm_master_type_blacklist "+
            "where gcm_master_type_blacklist.id="+id)
        const resdetail = await this.props.getDataDetailedMasterBlacklistAPI({query:passquerydetail}).catch(err => err)
        if (resdetail) {
            this.setState({
                id_blacklist_selected: id,
                nama_blacklist_selected: resdetail.nama,
                pembanding_nama_blacklist_selected: resdetail.nama
            })
        } else {
            swal({
                title: "Kesalahan 503!",
                text: "Harap periksa koneksi internet!",
                icon: "error",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
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
            empty_nama_blacklist_selected:false
        })
    }

    handleModalConfirm = () => {
        if(this.state.nama_blacklist_selected === '') { this.setState({ empty_nama_blacklist_selected: true }) }
        if (this.state.nama_blacklist_selected !== '') {
                this.setState({
                    isOpenConfirmUpdate: !this.state.isOpenConfirmUpdate
                })
        }
    }

    confirmActionUpdateBlacklist = async() => {
        let passqueryupdatemasterblacklist = encrypt("update gcm_master_type_blacklist set nama='"+this.state.nama_blacklist_selected+"' "+
            " where id="+this.state.id_blacklist_selected+" returning nama;")
        const resupdateMasterblacklist = await this.props.updateMasterBlacklist({query:passqueryupdatemasterblacklist}).catch(err => err)
        if (resupdateMasterblacklist) {
            swal({
                title: "Sukses!",
                text: "Perubahan disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(()=> {
                this.loadBlacklist()
                window.location.reload()
            });
        } else {
            swal({
                title: "Gagal!",
                text: "Tidak ada perubahan disimpan!",
                icon: "error",
                button: false,
                timer: "2500"
              }).then(()=> {
                window.location.reload()
            });
        }
    }

    render(){
        const data = {
            columns: [
                {
                    label: 'Nama Master Nonaktif',
                    field: 'nama',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
                rows: this.state.allDataBlacklist
            }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-attention icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Master Nonaktif
                                    <div className="page-title-subheading">Daftar master alasan nonaktif pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                
                            </div>
                        </div>
                    </div>
                    <div style={{textAlign: "right"}}>
                        <button className="sm-2 mr-2 btn btn-primary" title="Tambah Blacklist" onClick={this.handleModalInsert}>
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
                                            order={['id', 'asc' ]}
                                            sorting="false"
                                            data={data}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Insert Blacklist */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Master Nonaktif</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{marginTop:'3%'}}>
                            <FormGroup>
                                <p className="mb-0" style={{fontWeight:'bold'}}>Nama Master Nonaktif</p>
                                <Input type="text" name="nama_blacklist_inserted" id="nama_blacklist_inserted" 
                                    placeholder="Nama Master Nonaktif" onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_blacklist_inserted}/>
                                <FormFeedback>Kolom ini wajib diisi</FormFeedback>
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleModalConfirmInsert} disabled={(this.state.nama_blacklist_inserted !== '') ? false : "disabled"}>Tambah</Button>
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
                        <Button color="primary" onClick={this.confirmActionInsertBlacklist}>Tambah</Button>
                        <Button color="danger" onClick={this.handleModalConfirmInsert}>Batal</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Barang */}
                <Modal size="md" toggle={this.handleModalDetail} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetail}>Detail Master Nonaktif</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group" style={{marginTop:'3%'}}>
                            <FormGroup>
                                <p className="mb-0" style={{fontWeight:'bold'}}>Nama Master Nonaktif</p>
                                <Input type="text" name="nama_blacklist_selected" id="nama_blacklist_selected" 
                                    placeholder="Nama Master Nonaktif" value={this.state.nama_blacklist_selected} onChange={this.handleChange} onKeyPress={this.handleWhiteSpace}
                                    invalid={this.state.empty_nama_blacklist_selected}/>
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
                        <Button color="primary" onClick={this.confirmActionUpdateBlacklist}>Perbarui</Button>
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
    getDataBlacklistAPI: (data) => dispatch(getDataBlacklistAPI(data)),
    getDataDetailedMasterBlacklistAPI: (data) => dispatch(getDataDetailedMasterBlacklistAPI(data)),
    insertMasterBlacklist: (data) => dispatch(insertMasterBlacklist(data)),
    updateMasterBlacklist: (data) => dispatch(updateMasterBlacklist(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter( connect(reduxState, reduxDispatch)(ContentMasterBlacklistSuperAdmin) );