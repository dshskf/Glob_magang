import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ContentBeranda from './../../pages/Beranda/content'
import ContentBarang from './../../pages/Barang/content'
import ContentNegosiasi from './../../pages/Negosiasi/content'
import ContentTransaksi from './../../pages/Transaksi/content'
import ContentPengguna from './../../pages/Pengguna/content'
import ContentProfil from '../../pages/Profil/content'
import ContentChats from '../../pages/Chats/content'
import { firebaseApp } from '../../../config/firebase/index'

import Footer from '../Footer';
import Header from '../Header';

import { getNotificationNumber, checkRenderedSidebar } from '../../../config/redux/action';
import { encrypt, decrypt } from '../../../config/lib';

class Sidebar extends Component {
    state = {
        totalNotification: 0,
        totalUnreadMessages: 0
    }
    async componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        let user_id = parseInt(decrypt(userData.id))
        let company_id = parseInt(decrypt(userData.company_id))
        let dataToSubmit

        if (userData.sa_role === 'sales') {
            dataToSubmit = {
                company_id: company_id,
                id_sales: user_id,
                isSales: true
            }
        } else {
            dataToSubmit = {
                company_id: company_id,
                isSales: false
            }
        }

        if (!this.props.sidebarStatus) {
            const post = await this.props.getNumber({ ...dataToSubmit }).catch(err => err)
            this.setState({ totalNotification: post[0].count })
            this.props.checkRenderedSidebar(post[0].count)
        }

        const messaging = firebaseApp.messaging()
        messaging.requestPermission()
            .then(() => {
                return messaging.getToken()
            })
            .then(async token => token)

        
        firebaseApp.database().ref().orderByChild('user_id_seller').equalTo(user_id).on("value", async snapshot => {
            if (!snapshot.val()) {
                return
            }

            const roomData = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]); //Convert Object to array
            let count_unread = 0

            roomData.map(data => {
                let isAdd = false

                if (data.message) {
                    Object.keys(data.message).map((key) => {
                        if (data.message[key].read === false && parseInt(data.message[key].receiver) === parseInt(user_id)) {
                            isAdd = true
                        }
                    })
                }

                if (isAdd) {
                    count_unread += 1
                }
                return null;
            })


            this.setState({ totalUnreadMessages: count_unread })
        })


        if (this.props.sidebarStatus) {
            this.setState({ totalNotification: this.props.sidebarStatus })
        }

        navigator.serviceWorker.addEventListener("message", async (message) => {
            const post = await this.props.getNumber({ ...dataToSubmit }).catch(err => err)
            this.setState({ totalNotification: post[0].count })
            this.props.checkRenderedSidebar(post[0].count)
        })
    }


    render() {
        const page = this.props.page;
        return (
            <div className={`app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header ${this.props.isShown === "hiding" ? "closed-sidebar" : ""}`}>
                <Header></Header>
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
                        <div className="scrollbar-sidebar" >
                            <div className="app-sidebar__inner">
                                <ul className="vertical-nav-menu">
                                    <li className="app-sidebar__heading">Menu Utama</li>
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
                                                    </i>Manajemen Pembeli
                                                </Link>
                                            </li>
                                        ) :
                                            <li>
                                                <Link to="/admin/pengguna">
                                                    <i className="metismenu-icon pe-7s-users">
                                                    </i>Manajemen Pembeli
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
                                                        alignItems: 'center',
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
                                        page === 'chats' ? (
                                            <li>
                                                <Link to="/admin/chats" className="mm-active">
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}>
                                                        <i className="metismenu-icon pe-7s-chat" />
                                                        <p>Chats</p>
                                                        <p style={{ color: '#B81F44', marginLeft: '1.5rem', fontWeight: 'bold', fontSize: '12px' }}>({this.state.totalUnreadMessages})</p>
                                                    </div>
                                                </Link>

                                            </li>
                                        ) :
                                            <li>
                                                <Link to="/admin/chats" >
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}>
                                                        <i className="metismenu-icon pe-7s-chat" />
                                                        <p>Chats</p>
                                                        <p style={{ color: '#B81F44', marginLeft: '1.5rem', fontWeight: 'bold', fontSize: '12px' }}>({this.state.totalUnreadMessages})</p>
                                                    </div>
                                                </Link>

                                            </li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    {
                        page === 'beranda' ? (
                            <ContentBeranda></ContentBeranda>
                        ) : page === 'barang' ? (
                            <ContentBarang></ContentBarang>
                        ) : page === 'negosiasi' ? (
                            <ContentNegosiasi sockets={this.props.sockets}></ContentNegosiasi>
                        ) : page === 'transaksi' ? (
                            <ContentTransaksi></ContentTransaksi>
                        ) : page === 'pengguna' ? (
                            <ContentPengguna></ContentPengguna>
                        ) : page === 'chats' ? (
                            <ContentChats></ContentChats>
                        ) : page === 'profil' ? (
                            <ContentProfil></ContentProfil>
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
    isShown: state.isShown,
    sidebarStatus: state.isSidebarRendered
})

const reduxDispatch = (dispatch) => ({
    getNumber: data => dispatch(getNotificationNumber(data)),
    checkRenderedSidebar: data => dispatch(checkRenderedSidebar(data))
})

export default connect(reduxState, reduxDispatch)(Sidebar);