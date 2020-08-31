import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getDataPaymentAdminAPI, getDataPaymentAPI, insertPaymentListingSeller, getDataDetailedPaymentAPI, 
    getDataCheckedIdPayment, updateStatusPayment, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup,
        ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import Toast from 'light-toast';

class ContentPayment extends Component {
    state = {
        id_pengguna_login:'',
        company_id:'',
        company_name:'',
        tipe_bisnis:'',
        sa_role: '',
        sa_divisi: '',
        id_sales_registered: '',
        id_company_registered: '',
        allPaymentListing:[],
        allPaymentFromMaster:[],
        allPaymentChecked:[],
        deskripsi_payment_inserted:'Tidak ada deskripsi payment',
        id_payment_inserted:'',
        isOpen: false,
        isOpenInsert: false,
        isBtnInsert: true,
        isOpenConfirmInsert: false,
        id_payment: '',
        nama_payment:'',
        deskripsi_payment:'',
        status_payment:'',
        pembanding_status_payment:'',
        isOpenStatusPayment: false,
        isbtnupdatepayment: true,
        isOpenConfirmStatusPayment: false
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        this.setState({
            id_pengguna_login: decrypt(userData.id),
            company_id: decrypt(userData.company_id),
            company_name: decrypt(userData.company_name),
            tipe_bisnis: decrypt(userData.tipe_bisnis),
            sa_role: decrypt(userData.sa_role),
            sa_divisi: decrypt(userData.sa_divisi),
            id_sales_registered: decrypt(userData.id_sales_registered),
            id_company_registered: decrypt(userData.id_company_registered)
        })
    }
    
    componentDidMount() {
        this.loadPaymentListing()
        this.loadPaymentFromMaster()
    }

    loadPaymentListing = async() => {
        let passquerypaymentlisting = encrypt("select gcm_master_payment.payment_name, gcm_seller_payment_listing.status, gcm_seller_payment_listing.id "+
                "from gcm_seller_payment_listing "+
            "inner join gcm_master_payment on gcm_seller_payment_listing.payment_id = gcm_master_payment.id "+
            "where seller_id="+this.state.company_id)
        const respaymentlisting = await this.props.getDataPaymentAdminAPI({query:passquerypaymentlisting}).catch(err => err)
        if (respaymentlisting) {
            respaymentlisting.map((user, index) => {
                return (
                    respaymentlisting[index].keterangan = 
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailPayment(e, respaymentlisting[index].id)}>Lihat Detail</button>
                    </center>
                )
            })
            this.setState({
                allPaymentListing:respaymentlisting
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

    loadPaymentFromMaster = async() =>{
        let passquerypaymentmaster = encrypt("select gcm_master_payment.id, gcm_master_payment.payment_name, gcm_master_payment.deskripsi "+
                "from gcm_master_payment "+
            "where not exists "+
            "(select * from gcm_seller_payment_listing "+
                "where gcm_seller_payment_listing.payment_id = gcm_master_payment.id and gcm_seller_payment_listing.seller_id="+
                this.state.company_id+")")
        const respaymentmaster = await this.props.getDataPaymentAPI({query:passquerypaymentmaster}).catch(err => err)
        if (respaymentmaster) {
            this.setState({
                allPaymentFromMaster:respaymentmaster
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

    loadCheckingPayment = async() => {
        let passqueryidpayment = encrypt("select gcm_seller_payment_listing.payment_id from gcm_seller_payment_listing where seller_id="+this.state.company_id)
        const residpaymentchecked = await this.props.getDataCheckedIdPayment({query:passqueryidpayment}).catch(err => err)
        if (residpaymentchecked) {
            this.setState({
                allPaymentChecked: residpaymentchecked
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
            isBtnInsert: true,
            id_payment_inserted:'',
            deskripsi_payment_inserted:'Tidak ada deskripsi payment'
        })
    }

    handleChange = async(event) => {
        if (event.target.name === 'id_payment_inserted'){
            // this.setState({
                //     deskripsi_payment_inserted: this.state.allPaymentFromMaster[event.target.value].deskripsi
                // })
            this.setState({id_payment_inserted : event.target.value})
            let arr = this.state.allPaymentFromMaster.filter
                (arr_id => {return arr_id.id === event.target.value });
            this.setState({deskripsi_payment_inserted: arr[0].deskripsi})
            await this.setState({id_payment_inserted: event.target.value})
            if (this.state.id_payment_inserted !== '') {
                this.setState({isBtnInsert: false})
                }    
            }
        // this.setState({[event.target.name] : event.target.value})
    }

    handleModalConfirmInsert = async() => {
        await this.loadCheckingPayment()
        let check_id_payment_registered = this.state.allPaymentChecked.filter(input_id => {return input_id.payment_id === this.state.id_payment_inserted });
        if (check_id_payment_registered !== '' && check_id_payment_registered.length === 0){
            this.setState({isOpenConfirmInsert: !this.state.isOpenConfirmInsert})
        } else {
            swal({
                title: "Kesalahan!",
                text: "Metode payment telah terdaftar",
                icon: "info",
                buttons: {
                    confirm: "Oke"
                    }
                }).then(()=> {
                    window.location.reload()
                });
        }
    }

    confirmActionInsertPayment = async() => {
        Toast.loading('Loading...');
        // let passqueryinsertpayment = encrypt("insert into gcm_seller_payment_listing (seller_id, payment_id, status) "+
        //     "values ('"+this.state.company_id+"', '"+this.state.id_payment_inserted+"', 'C') returning status;")
        let passqueryinsertpayment = encrypt("insert into gcm_seller_payment_listing (seller_id, payment_id, status) "+
            "values ('"+this.state.company_id+"', '"+this.state.id_payment_inserted+"', 'A') returning status;")
        const resinsertpayment = await this.props.insertPaymentListingSeller({query:passqueryinsertpayment}).catch(err => err)
        Toast.hide();
        if (resinsertpayment) {
            swal({
                title: "Sukses!",
                text: "Metode payment berhasil ditambahkan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(()=> {
                window.location.reload()
            });
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

    handleDetailPayment = async(e, id) => {
        this.handleModalDetailPayment()
        e.stopPropagation()
        let passquerydetailpayment = encrypt("select gcm_master_payment.payment_name, gcm_master_payment.deskripsi, gcm_seller_payment_listing.status, gcm_seller_payment_listing.id "+
            "from gcm_seller_payment_listing "+
                "inner join gcm_master_payment on gcm_master_payment.id = gcm_seller_payment_listing.payment_id "+
            "where gcm_seller_payment_listing.id="+id)
        const resdetailpayment = await this.props.getDataDetailedPaymentAPI({query:passquerydetailpayment}).catch(err => err)
        if (resdetailpayment) {
            await this.setState({
                id_payment: resdetailpayment.id,
                nama_payment:resdetailpayment.nama,
                deskripsi_payment:resdetailpayment.deskripsi,
                status_payment:resdetailpayment.status,
                pembanding_status_payment:resdetailpayment.status
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

    handleModalDetailPayment = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            id_payment: '',
            nama_payment:'',
            deskripsi_payment:'',
            status_payment:'',
            pembanding_status_payment:'',
            isbtnupdatepayment: true
        })
    }

    handleStatusPayment = () => {
        this.setState({
            isOpenStatusPayment: !this.state.isOpenStatusPayment
        })
    }

    changeStatusPayment = async(e) => {
        if (e === this.state.pembanding_status_payment) {
            await this.setState({status_payment: e, isbtnupdatepayment: true})
        } else {
            await this.setState({
                status_payment: e,
                isbtnupdatepayment: false
            })
        }
    }

    handleModalConfirmStatusPayment = () => {
        this.setState({isOpenConfirmStatusPayment: !this.state.isOpenConfirmStatusPayment})
    }

    confirmActionChangeStatusPayment = async() => {
        Toast.loading('Loading...');
        let passquerychangestatuspayment = ""
        if (this.state.status_payment === 'R') {
            passquerychangestatuspayment = encrypt("update gcm_seller_payment_listing set status='C' "+
                "where id="+this.state.id_payment+" returning status")
        } else {
            passquerychangestatuspayment = encrypt(
                "with new_order as ("+
                    "update gcm_seller_payment_listing set status='"+this.state.status_payment+"' "+
                    "where id="+this.state.id_payment+" returning status) "+
                "update gcm_payment_listing set status='"+this.state.status_payment+"' "+
                    "where payment_id="+this.state.id_payment+" and seller_id="+this.state.company_id+" returning status;"
                )
        }
        const resupdatestatuspayment = await this.props.updateStatusPayment({query:passquerychangestatuspayment}).catch(err => err)
        Toast.hide();
        if (resupdatestatuspayment) {
            if(this.state.status_payment === 'R') {
                swal({
                    title: "Sukses!",
                    text: "Pengajuan metode payment berhasil disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(()=> {
                    window.location.reload()
                });    
            } else {
                swal({
                    title: "Sukses!",
                    text: "Perubahan metode payment berhasil disimpan!",
                    icon: "success",
                    button: false,
                    timer: "2500"
                }).then(()=> {
                    window.location.reload()
                });
            }
        } 
        else {
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
        const dataPaymentListing = {
            columns: [
                {
                    label: 'Nama Payment',
                    field: 'payment_name',
                    width: 100
                },
                {
                    label: 'Status Payment',
                    field: 'status',
                    width: 100
                },
                {
                    label: 'Keterangan',
                    field: 'keterangan',
                    width: 150
                }],
                rows: this.state.allPaymentListing
            }
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-wallet icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Manajemen Payment
                                    <div className="page-title-subheading">Daftar metode payment yang tersedia pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                
                            </div>
                        </div>
                    </div>
                    <div style={{textAlign: "right"}}>
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
                                            order={['id', 'asc' ]}
                                            sorting="false"
                                            data={dataPaymentListing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Insert Payment */}
                <Modal size="md" toggle={this.handleModalInsert} isOpen={this.state.isOpenInsert} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalInsert}>Tambah Metode Payment</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <p className="mb-0" style={{fontWeight:'bold'}}>Nama Payment</p>
                            <Input type="select" name="id_payment_inserted" id="id_payment_inserted" 
                                value={this.state.id_payment_inserted}
                                onChange={this.handleChange}>
                                <option value="" disabled selected>Pilih Metode Payment</option>
                                {
                                    // this.state.allPaymentFromMaster.map((allPaymentFromMaster, index)=>{
                                    //     return <option value={index}>{allPaymentFromMaster.payment_name}</option>
                                    // })
                                    this.state.allPaymentFromMaster.map((allPaymentFromMaster)=>{
                                        return <option value={allPaymentFromMaster.id}>{allPaymentFromMaster.payment_name}</option>
                                    })
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <p className="mb-0" style={{fontWeight:'bold'}}>Deskripsi Payment</p>
                            <p className="mb-0">{this.state.deskripsi_payment_inserted}</p>
                        </FormGroup>
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

                {/* Modal DetailedPayment */}
                <Modal size="md" toggle={this.handleModalDetailPayment} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailPayment}>Detail Informasi Payment</ModalHeader>
                    <ModalBody>
                        {/* <div className="position-relative form-group" style={{marginTop:'3%'}}> */}
                        <div style={{marginTop:'3%'}} className="row">                                        
                            <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                <p className="mb-0" style={{fontWeight:'bold'}}> Nama Payment</p>
                                <p className="mb-0"> {this.state.nama_payment}</p>
                                <p className="mb-0" style={{fontWeight:'bold'}}> Status Payment</p>
                                {
                                    (this.state.status_payment === 'C') ? 
                                        <div className='mb-2 mr-2 badge badge-primary'>Proses Konfirmasi</div>
                                    : (this.state.status_payment === 'R') ? 
                                        <div className='mb-2 mr-2 badge badge-warning'>Ditolak</div>
                                    :
                                        <ButtonDropdown isOpen={this.state.isOpenStatusPayment} toggle={this.handleStatusPayment}>
                                            <DropdownToggle caret color={this.state.status_payment === 'A' ? "success" : "danger"}>
                                                {this.state.status_payment === 'A' ? 'Aktif' : 'Nonaktif'}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => this.changeStatusPayment('A')}>Aktif</DropdownItem>
                                                <DropdownItem onClick={() => this.changeStatusPayment('I')}>Nonaktif</DropdownItem>
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                }                                
                            </div>
                            <div style={{width:'50%', float:'right', paddingLeft:'3%', paddingRight:'3%'}}>
                                <p className="mb-0" style={{fontWeight:'bold'}}> Deskripsi Payment</p>
                                <p className="mb-0"> {this.state.deskripsi_payment}</p>
                            </div>
                        </div>
                    </ModalBody>
                    {
                        (this.state.status_payment === 'A' || this.state.status_payment === 'I') ?
                            <ModalFooter>
                                <Button color="primary" onClick={this.handleModalConfirmStatusPayment} disabled={this.state.isbtnupdatepayment}>Konfirmasi</Button>
                                <Button color="danger" onClick={this.handleModalDetailPayment}>Batal</Button>
                            </ModalFooter>
                        : (this.state.status_payment === 'R') ?
                        <ModalFooter>
                            <Button color="primary" onClick={this.handleModalConfirmStatusPayment}>Ajukan lagi</Button>
                            <Button color="danger" onClick={this.handleModalDetailPayment}>Batal</Button>
                        </ModalFooter>
                        : null
                    }
                </Modal>

                {/* Modal Confirm Status Payment*/}
                <Modal size="sm" toggle={this.handleModalConfirmStatusPayment} isOpen={this.state.isOpenConfirmStatusPayment} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalConfirmStatusPayment}>Konfirmasi Aksi</ModalHeader>
                    <ModalBody>
                        <div className="position-relative form-group">
                            <label>
                                { (this.state.status_payment === 'R') ? 'Ajukan ulang metode payment ini?' : 'Simpan perubahan ini? Harap perhatikan metode payment setiap perusahaan yang berlangganan!'}
                            </label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.confirmActionChangeStatusPayment}>Konfirmasi</Button>
                        <Button color="danger" onClick={this.handleModalConfirmStatusPayment}>Batal</Button>
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
    getDataPaymentAdminAPI: (data) => dispatch(getDataPaymentAdminAPI(data)),
    getDataDetailedPaymentAPI: (data) => dispatch(getDataDetailedPaymentAPI(data)),
    insertPaymentListingSeller: (data) => dispatch(insertPaymentListingSeller(data)),
    updateStatusPayment: (data) => dispatch(updateStatusPayment(data)),
    getDataCheckedIdPayment: (data) => dispatch(getDataCheckedIdPayment(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter( connect(reduxState, reduxDispatch)(ContentPayment) );