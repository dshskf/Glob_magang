import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ContentBerandaSuperAdmin from './../../pages/Beranda/contentsuperadmin';
import ContentBarangSuperAdmin from './../../pages/Barang/contentsuperadmin'
import ContentPenggunaSuperAdmin from './../../pages/Pengguna/contentsuperadmin'
import ContentTransaksiSuperAdmin from './../../pages/Transaksi/contentsuperadmin'
import ContentNegosiasiSuperAdmin from './../../pages/Negosiasi/contentsuperadmin'
import ContentMasterBarangSuperAdmin from './../../pages/MasterBarang/contentsuperadmin'
import ContentMasterKategoriSuperAdmin from './../../pages/MasterKategori/contentsuperadmin'
import ContentMasterBlacklistSuperAdmin from './../../pages/MasterBlacklist/contentsuperadmin'
import ContentMasterSatuanSuperAdmin from './../../pages/MasterSatuan/contentsuperadmin'
import ContentMasterPaymentSuperAdmin from './../../pages/MasterPayment/contentsuperadmin'
import ContentMasterReasonSuperAdmin from './../../pages/MasterReason/contentsuperadmin'
import ContentProfilSuperAdmin from './../../pages/Profil/contentsuperadmin'
import ContentPaymentSuperAdmin from './../../pages/Payment/contentsuperadmin'
import ContentMasterKalenderLibur from './../../pages/MasterKalenderLibur/contentsuperadmin'
import ContentMasterBanner from './../../pages/MasterBanner/contentsuperadmin'
import Footer from '../Footer';
import HeaderSuperAdmin from '../Header';

import { getNotificationNumber } from '../../../config/redux/action';
import { encrypt, decrypt } from '../../../config/lib';

class SidebarSuperAdmin extends Component {
    state = {
        totalNotification: 0,
        scrollBottom: false
    }

    async componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const query = encrypt(`select count(*) from gcm_notification_nego where seller_id=${decrypt(userData.id)}`)

        const post = await this.props.getNumber({ query: query }).catch(err => err)
        this.setState({ totalNotification: post[0].count })
    }

    handleScrollPosition = () => this.setState({ scrollBottom: !this.state.scrollBottom })

    render() {
        const page = this.props.page;
        return (
            <div className={`app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header ${this.props.isShown === "hiding" ? "closed-sidebar" : ""}`} >
                <HeaderSuperAdmin></HeaderSuperAdmin>
                <div className="app-main">
                    <div className={`app-sidebar sidebar-shadow ${this.props.isShown}`}>
                        <div className="app-header__logo">
                            <div className="logo-src"></div>
                            <div className="header__pane ml-auto">
                                <div>
                                    <button type="button" className="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
                                        <span className="hamburger-box">
                                            <span className="hamburger-inner"></span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="app-header__mobile-menu">
                            <div>
                                <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav">
                                    <span className="hamburger-box">
                                        <span className="hamburger-inner"></span>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="app-header__menu">
                            <span>
                                <button type="button" className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                                    <span className="btn-icon-wrapper">
                                        <i className="fa fa-ellipsis-v fa-w-6"></i>
                                    </span>
                                </button>
                            </span>
                        </div>
                        <div id="scrollbar-sidebar-scroll" className="scrollbar-sidebar">
                            <div id="app-sidebar__inner-scroll" className="app-sidebar__inner">
                                <ul className="vertical-nav-menu">
                                    <li className="app-sidebar__heading">Menu Utama</li>
                                    {
                                        !this.state.scrollBottom && <React.Fragment>
                                            {
                                                page === 'beranda' ? (
                                                    <li>
                                                        <Link to="/admin/beranda" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-home">
                                                            </i>Beranda
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/beranda">
                                                            <i className="metismenu-icon pe-7s-home">
                                                            </i>Beranda
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'pengguna' ? (
                                                    <li>
                                                        <Link to="/admin/pengguna" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-users">
                                                            </i>Manajemen Penjual
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/pengguna">
                                                            <i className="metismenu-icon pe-7s-users">
                                                            </i>Manajemen Penjual
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'barang' ? (
                                                    <li>
                                                        <Link to="/admin/barang" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-server">
                                                            </i>Manajemen Barang
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/barang">
                                                            <i className="metismenu-icon pe-7s-server">
                                                            </i>Manajemen Barang
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'negosiasi' ? (
                                                    <li>
                                                        <Link to="/admin/negosiasi" className="mm-active">
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center'

                                                            }}>
                                                                <i className="metismenu-icon pe-7s-comment" />
                                                                <p>Manajemen Negosiasi</p>
                                                                {/* <p style={{ color: '#B81F44', marginLeft: '3.5rem', fontWeight: 'bold' }}>{this.state.totalNotification}</p> */}
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/negosiasi">
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center'

                                                            }}>
                                                                <i className="metismenu-icon pe-7s-comment" />
                                                                <p>Manajemen Negosiasi</p>
                                                                {/* <p style={{ color: '#B81F44', marginLeft: '3.5rem', fontWeight: 'bold' }}>{this.state.totalNotification}</p> */}
                                                            </div>
                                                        </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'transaksi' ? (
                                                    <li>
                                                        <Link to="/admin/transaksi" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-graph2">
                                                            </i>Manajemen Transaksi
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/transaksi">
                                                            <i className="metismenu-icon pe-7s-graph2">
                                                            </i>Manajemen Transaksi
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'payment' ? (
                                                    <li>
                                                        <Link to="/admin/payment" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-wallet">
                                                            </i>Manajemen Payment
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/payment">
                                                            <i className="metismenu-icon pe-7s-wallet">
                                                            </i>Manajemen Payment
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'masterbarang' ? (
                                                    <li>
                                                        <Link to="/admin/masterbarang" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-server">
                                                            </i>Manajemen Master Barang
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/masterbarang">
                                                            <i className="metismenu-icon pe-7s-server">
                                                            </i>Manajemen Master Barang
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'masterkategori' ? (
                                                    <li>
                                                        <Link to="/admin/masterkategori" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-photo-gallery">
                                                            </i>Manajemen Master Kategori
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/masterkategori">
                                                            <i className="metismenu-icon pe-7s-photo-gallery">
                                                            </i>Manajemen Master Kategori
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'mastersatuan' ? (
                                                    <li>
                                                        <Link to="/admin/mastersatuan" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-box2">
                                                            </i>Manajemen Master Satuan
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/mastersatuan">
                                                            <i className="metismenu-icon pe-7s-box2">
                                                            </i>Manajemen Master Satuan
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'masterpayment' ? (
                                                    <li>
                                                        <Link to="/admin/masterpayment" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-cash">
                                                            </i>Manajemen Master Payment
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/masterpayment">
                                                            <i className="metismenu-icon pe-7s-cash">
                                                            </i>Manajemen Master Payment
                                                </Link>
                                                    </li>
                                            }
                                        </React.Fragment>
                                    }


                                    {
                                        this.state.scrollBottom && <React.Fragment>
                                            {
                                                page === 'masterreason' ? (
                                                    <li>
                                                        <Link to="/admin/masterreason" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-note">
                                                            </i>Manajemen Master Reason
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/masterreason">
                                                            <i className="metismenu-icon pe-7s-note">
                                                            </i>Manajemen Master Reason
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'masternonaktif' ? (
                                                    <li>
                                                        <Link to="/admin/masternonaktif" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-attention">
                                                            </i>Manajemen Master Nonaktif
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/masternonaktif">
                                                            <i className="metismenu-icon pe-7s-attention">
                                                            </i>Manajemen Master Nonaktif
                                                </Link>
                                                    </li>
                                            }
                                            {
                                                page === 'masterkalenderlibur' ? (
                                                    <li>
                                                        <Link to="/admin/masterkalenderlibur" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-sun">
                                                            </i>Manajemen Kalender Libur
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/masterkalenderlibur">
                                                            <i className="metismenu-icon pe-7s-sun">
                                                            </i>Manajemen Kalender Libur
                                                </Link>
                                                    </li>
                                            }
                                            {/* {
                                                page === 'masterbanner' ? (
                                                    <li>
                                                        <Link to="/admin/masterbanner" className="mm-active">
                                                            <i className="metismenu-icon pe-7s-photo">
                                                            </i>Manajemen Banner
                                                </Link>
                                                    </li>
                                                ) :
                                                    <li>
                                                        <Link to="/admin/masterbanner">
                                                            <i className="metismenu-icon pe-7s-photo">
                                                            </i>Manajemen Banner
                                                </Link>
                                                    </li>
                                            } */}
                                        </React.Fragment>
                                    }

                                    <div id="scroll-down-sidebar">
                                        {
                                            this.state.scrollBottom ?

                                                <i className="metismenu-icon pe-7s-angle-up" onClick={this.handleScrollPosition} />
                                                :
                                                <i className="metismenu-icon pe-7s-angle-down" onClick={this.handleScrollPosition} />
                                        }

                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {
                        page === 'beranda' ? (
                            <ContentBerandaSuperAdmin></ContentBerandaSuperAdmin>
                        ) : page === 'barang' ? (
                            <ContentBarangSuperAdmin></ContentBarangSuperAdmin>
                        ) : page === 'negosiasi' ? (
                            <ContentNegosiasiSuperAdmin></ContentNegosiasiSuperAdmin>
                        ) : page === 'pengguna' ? (
                            <ContentPenggunaSuperAdmin></ContentPenggunaSuperAdmin>
                        ) : page === 'transaksi' ? (
                            <ContentTransaksiSuperAdmin></ContentTransaksiSuperAdmin>
                        ) : page === 'masterbarang' ? (
                            <ContentMasterBarangSuperAdmin></ContentMasterBarangSuperAdmin>
                        ) : page === 'masterkategori' ? (
                            <ContentMasterKategoriSuperAdmin></ContentMasterKategoriSuperAdmin>
                        ) : page === 'masternonaktif' ? (
                            <ContentMasterBlacklistSuperAdmin></ContentMasterBlacklistSuperAdmin>
                        ) : page === 'mastersatuan' ? (
                            <ContentMasterSatuanSuperAdmin></ContentMasterSatuanSuperAdmin>
                        ) : page === 'masterpayment' ? (
                            <ContentMasterPaymentSuperAdmin></ContentMasterPaymentSuperAdmin>
                        ) : page === 'masterreason' ? (
                            <ContentMasterReasonSuperAdmin></ContentMasterReasonSuperAdmin>
                        ) : page === 'masterkalenderlibur' ? (
                            <ContentMasterKalenderLibur></ContentMasterKalenderLibur>
                        ) : page === 'masterbanner' ? (
                            <ContentMasterBanner></ContentMasterBanner>
                        ) : page === 'profil' ? (
                            <ContentProfilSuperAdmin></ContentProfilSuperAdmin>
                        ) : page === 'payment' ? (
                            <ContentPaymentSuperAdmin></ContentPaymentSuperAdmin>
                        ) : null
                    }
                </div>
                <div className="app-wrapper-footer">
                    <Footer></Footer>
                </div>
            </div>
        )
    }
}

const reduxState = (state) => ({
    isShown: state.isShown
})

const reduxDispatch = (dispatch) => ({
    getNumber: data => dispatch(getNotificationNumber(data))
})

export default connect(reduxState, reduxDispatch)(SidebarSuperAdmin);