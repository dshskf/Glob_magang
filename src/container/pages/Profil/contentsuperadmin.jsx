import React, { Component } from 'react';
import { connect } from 'react-redux';
import { encrypt, decrypt } from '../../../config/lib';
// import { MDBDataTable } from 'mdbreact';
import { getDataDetailedAccountInfoAPI, getDataDetailedCompanyInfoSuperAdminAPI, logoutUserAPI }
    from '../../../config/redux/action';
import swal from 'sweetalert';
import { Col, CardTitle, Card } from 'reactstrap'
import { withRouter } from 'react-router-dom';

class ContentProfilSuperAdmin extends Component {
    state = {
        id_pengguna_login:'',
        company_id:'',
        company_name:'',
        tipe_bisnis:'',
        company_info_name:'',
        company_info_telepon:'',
        company_info_email:'',
        account_info_username:'',
        account_info_nama:'',
        account_info_ktp:'',
        account_info_telepon:'',
        account_info_email:'',
        account_info_status:''
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
        this.loadAccountInfo()
        this.loadCompanyInfo()
    }

    loadAccountInfo = async() => {
        let passqueryaccountinfo = encrypt("select gcm_master_user.username, gcm_master_user.nama, gcm_master_user.no_ktp, "+
            "gcm_master_user.no_hp, gcm_master_user.email, gcm_master_user.password, gcm_master_user.status "+
            "from gcm_master_user where gcm_master_user.id ="+this.state.id_pengguna_login)
        const resaccountinfo = await this.props.getDataDetailedAccountInfoAPI({query:passqueryaccountinfo}).catch(err => err)
        if (resaccountinfo) {
            this.setState({
                account_info_username:resaccountinfo.username,
                account_info_nama:resaccountinfo.nama,
                account_info_ktp:resaccountinfo.no_ktp,
                account_info_telepon:resaccountinfo.no_hp,
                account_info_email:resaccountinfo.email,
                account_info_status:resaccountinfo.status
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

    loadCompanyInfo = async() => {
        let passquerycompanyinfo = encrypt("select gcm_master_company.nama_perusahaan, gcm_master_company.no_telp, gcm_master_company.email "+
            "from gcm_master_company "+
            "where gcm_master_company.id ="+this.state.company_id)
        const rescompanyinfo = await this.props.getDataDetailedCompanyInfoSuperAdminAPI({query:passquerycompanyinfo}).catch(err => err)
        if (rescompanyinfo) {
            this.setState({
                company_info_name:rescompanyinfo.nama_perusahaan,
                company_info_telepon:rescompanyinfo.no_telp,
                company_info_email:rescompanyinfo.email
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

    render(){
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <div className="app-page-title">
                        <div className="page-title-wrapper">
                            <div className="page-title-heading">
                                <div className="page-title-icon">
                                    <i className="pe-7s-user icon-gradient bg-mean-fruit">
                                    </i>
                                </div>
                                <div>Profil
                                    <div className="page-title-subheading">Profil {this.state.company_name}
                                    </div>
                                </div>
                            </div>
                            <div className="page-title-actions">
                                
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <Col md="6">
                            {/* <div style={{textAlign: "right"}}>
                                <button className="sm-2 mr-2 btn btn-primary" title="Edit Informasi Akun" onClick="">
                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                </button>
                            </div> */}
                            <Card body outline color="primary">
                                <CardTitle>Informasi Akun</CardTitle>
                                    <div className="row">
                                        <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nama Pengguna</p>
                                            <p className="mb-0">{this.state.account_info_username}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nama Lengkap</p>
                                            <p className="mb-0">{this.state.account_info_nama}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nomor KTP</p>
                                            <p className="mb-0">{this.state.account_info_ktp}</p>
                                        </div>
                                        <div style={{width:'50%', float:'right', paddingLeft:'3%'}}>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nomor Telepon</p>
                                            <p className="mb-0">{this.state.account_info_telepon}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Email</p>
                                            <p className="mb-0">{this.state.account_info_email}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Status Pengguna</p>
                                            <p className="mb-0">
                                                {(this.state.account_info_status === 'A' ) ? 'Aktif' : 'Nonaktif'}
                                            </p>
                                        </div>
                                    </div>
                            </Card>
                        </Col>
                        <Col md="6">
                            {/* <div style={{textAlign: "right"}}>
                                <button className="sm-2 mr-2 btn btn-primary" title="Edit Informasi Perusahaan" onClick="">
                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                </button>
                            </div> */}
                            <Card body outline color="primary">
                                <CardTitle>Informasi Perusahaan</CardTitle>
                                <div className="row">
                                        <div style={{width:'50%', float:'left', paddingLeft:'3%'}}>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Nama Perusahaan</p>
                                            <p className="mb-0">{this.state.company_info_name}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Telepon Perusahaan</p>
                                            <p className="mb-0">{this.state.company_info_telepon}</p>
                                            <p className="mb-0" style={{fontWeight:'bold'}}>Email Perusahaan</p>
                                            <p className="mb-0">{this.state.company_info_email}</p>
                                        </div>
                                    </div>
                            </Card>
                        </Col>
                    </div>
                </div>

                
            </div>
        )
    }
}
const reduxState = (state) => ({
    userData: state.userData
})

const reduxDispatch = (dispatch) => ({
    getDataDetailedAccountInfoAPI: (data) => dispatch(getDataDetailedAccountInfoAPI(data)),
    getDataDetailedCompanyInfoSuperAdminAPI: (data) => dispatch(getDataDetailedCompanyInfoSuperAdminAPI(data)),
    logoutAPI: () => dispatch(logoutUserAPI())
})

export default withRouter( connect(reduxState, reduxDispatch)(ContentProfilSuperAdmin) );