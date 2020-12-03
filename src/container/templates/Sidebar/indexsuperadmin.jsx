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
import ContentMasterBank from './../../pages/MasterBank/contentsuperadmin'

import Footer from '../Footer';
import HeaderSuperAdmin from '../Header';

import { getNotificationNumber } from '../../../config/redux/action';
import { encrypt, decrypt } from '../../../config/lib';

class SidebarSuperAdmin extends Component {
    state = {
        totalNotification: 0,
        itemPerPage: 0,
        pageNumber: 1,
        pageConfig: [
            { route: 'beranda', title: 'Beranda', icon: 'home' },
            { route: 'pengguna', title: 'Manajemen Penjual', icon: 'users' },
            { route: 'barang', title: 'Manajemen Barang', icon: 'server' },
            { route: 'negosiasi', title: 'Manajemen Negosiasi', icon: 'comment' },
            { route: 'transaksi', title: 'Manajemen Transaksi', icon: 'graph2' },
            { route: 'payment', title: 'Manajemen Payment', icon: 'wallet' },
            { route: 'masterbarang', title: 'Manajemen Master Barang', icon: 'server' },
            { route: 'masterkategori', title: 'Manajemen Master Kategori', icon: 'photo-gallery' },
            { route: 'mastersatuan', title: 'Manajemen Master Satuan', icon: 'box2' },
            { route: 'masterbank', title: 'Manajemen Master Bank', icon: 'cash' },
            { route: 'masterpayment', title: 'Manajemen Master Payment', icon: 'culture' },
            { route: 'masterreason', title: 'Manajemen Master Reason', icon: 'note' },
            { route: 'masternonaktif', title: 'Manajemen Master Nonaktif', icon: 'attention' },
            { route: 'masterkalenderlibur', title: 'Manajemen Kalender Libur', icon: 'sun' },
            { route: 'masterbanner', title: 'Manajemen Banner', icon: 'photo' },
        ],

    }

    async componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const query = encrypt(`select count(*) from gcm_notification_nego where seller_id=${decrypt(userData.id)}`)

        const post = await this.props.getNumber({ query: query }).catch(err => err)
        this.calculateScreenHeight()
        this.setState({
            totalNotification: post[0].count,
        })

        // window.addEventListener('resize', () => this.calculateScreenHeight())
    }

    calculateScreenHeight = () => {
        // menu-height: 60px, sidebar-title: 30px              
        const items_per_page = (window.innerHeight - 90) / 50
        const pageIndex = this.state.pageConfig.filter((page, index) => {
            if (this.props.page === page.route) {
                page.index = index
                return page
            }
        })[0]

        if (pageIndex.index > items_per_page) {
            const currentPage = Math.ceil(pageIndex.index / items_per_page)
            this.setState({
                pageNumber: currentPage
            })
        }

        return this.setState({
            itemPerPage: items_per_page
        })
    }

    handleScrollPosition = () => {
        if (this.state.itemPerPage * this.state.pageNumber > this.state.pageConfig.length) {
            this.setState({ pageNumber: this.state.pageNumber - 1 })
        } else {
            this.setState({ pageNumber: this.state.pageNumber + 1 })
        }
    }

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

                                        this.state.pageConfig.map((pageData, index) => {
                                            const { route, title, icon } = pageData;
                                            return (index > (this.state.pageNumber - 1) * this.state.itemPerPage && index < this.state.pageNumber * this.state.itemPerPage) && (
                                                page === route ?
                                                    (
                                                        <li>
                                                            <Link to={`/admin/${route}`} className="mm-active">
                                                                <i className={`metismenu-icon pe-7s-${icon}`}>
                                                                </i>{title}
                                                            </Link>
                                                        </li>
                                                    ) :
                                                    <li>
                                                        <Link to={`/admin/${route}`}>
                                                            <i className={`metismenu-icon pe-7s-${icon}`}>
                                                            </i>{title}
                                                        </Link>
                                                    </li>
                                            )
                                        })
                                    }

                                    <div id="scroll-down-sidebar">
                                        {
                                            this.state.itemPerPage * this.state.pageNumber < this.state.pageConfig.length - 1 ?
                                                <i className="metismenu-icon pe-7s-angle-down" onClick={this.handleScrollPosition} />
                                                :
                                                this.state.itemPerPage < this.state.pageConfig.length - 1 &&
                                                <i className="metismenu-icon pe-7s-angle-up" onClick={this.handleScrollPosition} />
                                        }

                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.itemPerPage > 0 &&
                            page === 'beranda' ? (
                                <ContentBerandaSuperAdmin />
                            ) : page === 'barang' ? (
                                <ContentBarangSuperAdmin />
                            ) : page === 'negosiasi' ? (
                                <ContentNegosiasiSuperAdmin />
                            ) : page === 'pengguna' ? (
                                <ContentPenggunaSuperAdmin />
                            ) : page === 'transaksi' ? (
                                <ContentTransaksiSuperAdmin />
                            ) : page === 'masterbarang' ? (
                                <ContentMasterBarangSuperAdmin />
                            ) : page === 'masterkategori' ? (
                                <ContentMasterKategoriSuperAdmin />
                            ) : page === 'masternonaktif' ? (
                                <ContentMasterBlacklistSuperAdmin />
                            ) : page === 'mastersatuan' ? (
                                <ContentMasterSatuanSuperAdmin />
                            ) : page === 'masterpayment' ? (
                                <ContentMasterPaymentSuperAdmin />
                            ) : page === 'masterreason' ? (
                                <ContentMasterReasonSuperAdmin />
                            ) : page === 'masterkalenderlibur' ? (
                                <ContentMasterKalenderLibur />
                            ) : page === 'masterbanner' ? (
                                <ContentMasterBanner />
                            ) : page === 'masterbank' ? (
                                <ContentMasterBank />
                            ) : page === 'profil' ? (
                                <ContentProfilSuperAdmin />
                            ) : page === 'payment' ? (
                                <ContentPaymentSuperAdmin />
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