import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
import { MDBDataTable } from 'mdbreact';
import { getDataPaymentAdminAPI, getDataPaymentAPI, insertPaymentListingSeller, getDataDetailedPaymentSuperAdminAPI, 
    getDataCheckedIdPayment, updateStatusPayment, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import Toast from 'light-toast';

class ContentPaymentSuperAdmin extends Component {
    state = {
        id_pengguna_login:'',
        company_id:'',
        company_name:'',
        tipe_bisnis:'',
        allPaymentListing:[],
        isOpen: false,
        isOpenInsert: false,
        isBtnInsert: true,
        isOpenConfirmInsert: false,
        nama_company_payment:'',
        id_payment: '',
        nama_payment:'',
        deskripsi_payment:'',
        status_payment:'',
        status_payment_updated:'',
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
            tipe_bisnis: decrypt(userData.tipe_bisnis)
        })
    }
    
    componentDidMount() {
        this.loadPaymentListing()
    }

    loadPaymentListing = async() => {
        let passquerypaymentlisting = encrypt("select gcm_master_company.nama_perusahaan,"+
            "gcm_master_payment.payment_name, gcm_seller_payment_listing.status, "+
            "gcm_seller_payment_listing.id "+
                "from gcm_seller_payment_listing "+
            "inner join gcm_master_payment on gcm_seller_payment_listing.payment_id = gcm_master_payment.id "+
            "inner join gcm_master_company on gcm_seller_payment_listing.seller_id = gcm_master_company.id "+
            "where gcm_seller_payment_listing.status='C' or gcm_seller_payment_listing.status='R'")
        const respaymentlisting = await this.props.getDataPaymentAdminAPI({query:passquerypaymentlisting}).catch(err => err)
        if (respaymentlisting) {
            respaymentlisting.map((user, index) => {
                return (
                    respaymentlisting[index].keterangan = 
                    <center>
                        <button className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                            onClick={(e) => this.handleDetailPayment(e, respaymentlisting[index].id)}> Lihat Detail</button>
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

    handleDetailPayment = async(e, id) => {
        this.handleModalDetailPayment()
        e.stopPropagation()
        let passquerydetailpayment = encrypt("select gcm_master_payment.payment_name, gcm_master_payment.deskripsi, "+
            "gcm_seller_payment_listing.status, gcm_seller_payment_listing.id, gcm_master_company.nama_perusahaan "+
            "from gcm_seller_payment_listing "+
                "inner join gcm_master_payment on gcm_master_payment.id = gcm_seller_payment_listing.payment_id "+
                "inner join gcm_master_company on gcm_seller_payment_listing.seller_id = gcm_master_company.id "+
            "where gcm_seller_payment_listing.id="+id)
        const resdetailpayment = await this.props.getDataDetailedPaymentSuperAdminAPI({query:passquerydetailpayment}).catch(err => err)
        if (resdetailpayment) {
            await this.setState({
                nama_company_payment: resdetailpayment.nama_perusahaan,
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
            status_payment_updated:'',
            isbtnupdatepayment: true
        })
    }

    handleModalConfirmStatusPayment = async(stat) => {
        await this.setState({isOpenConfirmStatusPayment: !this.state.isOpenConfirmStatusPayment, status_payment_updated: stat })
    }

    confirmActionChangeStatusPayment = async() => {
        Toast.loading('Loading...');
        let passquerychangestatuspayment = encrypt("update gcm_seller_payment_listing set status='"+this.state.status_payment_updated+"' "+
            "where id="+this.state.id_payment+" returning status")            
        const resupdatestatuspayment = await this.props.updateStatusPayment({query:passquerychangestatuspayment}).catch(err => err)
        Toast.hide();
        
        if (resupdatestatuspayment) {
            swal({
                title: "Sukses!",
                text: "Metode payment disimpan!",
                icon: "success",
                button: false,
                timer: "2500"
            }).then(()=> {
                window.location.reload()
            });
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
                    label: 'Nama Perusahaan',
                    field: 'nama_perusahaan',
                    width: 100
                },
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
                                    <div className="page-title-subheading">Daftar metode payment setiap perusahaan pada {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                
                            </div>
                        </div>
                    </div>
                    <div style={{textAlign: "right"}}>
                        
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

                {/* Modal DetailedPayment */}
                <Modal size="md" toggle={this.handleModalDetailPayment} isOpen={this.state.isOpen} backdrop="static" keyboard={false}>
                    <ModalHeader toggle={this.handleModalDetailPayment}>Detail Informasi Payment</ModalHeader>
                    <ModalBody>
                        {/* <div className="position-relative form-group" style={{marginTop:'3%'}}> */}
                        <div style={{marginTop:'3%'}} className="row">                                        
                            <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                <p className="mb-0" style={{fontWeight:'bold'}}>Nama Perusahaan</p>
                                <p className="mb-0"> {this.state.nama_company_payment}</p>
                                <p className="mb-0" style={{fontWeight:'bold'}}> Nama Payment</p>
                                <p className="mb-0"> {this.state.nama_payment}</p>
                            </div>
                            <div style={{width:'50%', float:'right', paddingLeft:'3%', paddingRight:'3%'}}>
                                <p className="mb-0" style={{fontWeight:'bold'}}> Status Payment</p>
                                {
                                    (this.state.status_payment === 'C') ? 
                                        <div className='mb-2 mr-2 badge badge-primary'>Proses Konfirmasi</div>
                                    : (this.state.status_payment === 'R') ? 
                                        <div className='mb-2 mr-2 badge badge-warning'>Ditolak</div>
                                    : null                                        
                                }                                
                                <p className="mb-0" style={{fontWeight:'bold'}}> Deskripsi Payment</p>
                                <p className="mb-0"> {this.state.deskripsi_payment}</p>
                            </div>
                        </div>
                    </ModalBody>
                    {
                        (this.state.status_payment !== 'R') ?
                            <ModalFooter>
                                <Button color="primary" onClick={() => this.handleModalConfirmStatusPayment('A')}>Konfirmasi</Button>
                                <Button color="danger" onClick={() =>this.handleModalConfirmStatusPayment('R')}>Tolak</Button>
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
                                {
                                    (this.state.status_payment_updated === 'A') ? 'Konfirmasi metode pembayaran ini?' : 'Tolak metode pembayaran ini?'
                                }
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
    getDataDetailedPaymentSuperAdminAPI: (data) => dispatch(getDataDetailedPaymentSuperAdminAPI(data)),
    insertPaymentListingSeller: (data) => dispatch(insertPaymentListingSeller(data)),
    updateStatusPayment: (data) => dispatch(updateStatusPayment(data)),
    getDataCheckedIdPayment: (data) => dispatch(getDataCheckedIdPayment(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter( connect(reduxState, reduxDispatch)(ContentPaymentSuperAdmin) );