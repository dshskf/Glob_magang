import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../../../config/firebase/index'
import io from 'socket.io-client'
import ContentBeranda from '../../pages/Beranda/content'
import ContentBarang from '../../pages/Barang/content'
import ContentNegosiasi from '../../pages/Negosiasi/content'
import ContentTransaksi from '../../pages/Transaksi/content'
import ContentPengguna from '../../pages/Pengguna/content'
import ContentProfil from '../../pages/Profil/content'
import ContentSales from '../../pages/Sales/content'
import ContentPayment from '../../pages/Payment/content'
import ContentOngkir from '../../pages/Ongkir/content'
import ContentKurs from '../../pages/Kurs/content'
import ContentChats from '../../pages/Chats/content'

import Footer from '../Footer';
import Header from '../Header';

import { socket_uri } from '../../../config/services/socket'
import { getNotificationNumber, checkRenderedSidebar, setSocketIOConnection } from '../../../config/redux/action';
import { encrypt, decrypt } from '../../../config/lib';

class SidebarAdmin extends Component {
    state = {
        totalNotification: 0,
        totalUnreadMessages: 0
    }

    async componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        let user_id = parseInt(decrypt(userData.id))
        let company_id = parseInt(decrypt(userData.company_id))
        let query

        if (userData.sa_role === 'sales') {
            query = encrypt("select count(*) " +
                "from gcm_master_cart " +
                "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                "inner join gcm_company_listing_sales on gcm_master_cart.company_id = gcm_company_listing_sales.buyer_id " +
                "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + decrypt(userData.company_id) +
                " and gcm_company_listing_sales.id_sales=" + decrypt(userData.id))
        } else {
            query = encrypt("select count(*) " +
                "from gcm_master_cart " +
                "inner join gcm_history_nego on gcm_master_cart.history_nego_id = gcm_history_nego.id " +
                "inner join gcm_master_company on gcm_master_cart.company_id = gcm_master_company.id " +
                "inner join gcm_list_barang on gcm_master_cart.barang_id = gcm_list_barang.id " +
                "inner join gcm_master_barang on gcm_list_barang.barang_id = gcm_master_barang.id " +
                "where gcm_master_cart.status='A' and gcm_master_cart.nego_count > 0 and gcm_history_nego.harga_final = 0 and gcm_list_barang.company_id=" + decrypt(userData.company_id))
        }

        if (!this.props.sidebarStatus) {
            const post = await this.props.getNumber({ query: query }).catch(err => err)
            this.setState({ totalNotification: post[0].count })
            this.props.checkRenderedSidebar(post[0].count)
        }



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
            const post = await this.props.getNumber({ query: query }).catch(err => err)
            this.setState({ totalNotification: post[0].count })
            this.props.checkRenderedSidebar(post[0].count)
        })

        const messaging = firebaseApp.messaging()
        messaging.requestPermission()
            .then(() => {
                return messaging.getToken()
            })
            .then(async token => {
                console.log(token)
            })

        // if (!this.props.io) {
        //     let socket = io(socket_uri)
        //     socket.emit('admin_room', {
        //         room_id: `${company_id}-${user_id}`
        //     })
            
        //     this.props.setSocketIOConnection(socket)
        // }
        // else {            
        //     let socket = this.props.io
        //     socket.on('transaction_from_user', (data) => {
        //         console.log(data)
        //     })
        // }
    }


    render() {
        const page = this.props.page;
        return (
            <div className={`app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header ${this.props.isShown === "hiding" ? "closed-sidebar" : ""}`} >
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

                        <div className={`scrollbar-sidebar`}>
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
                                        page === 'kurs' ? (
                                            <li>
                                                <Link to="/admin/kurs" className="mm-active">
                                                    <i className="metismenu-icon pe-7s-cash">
                                                    </i>Manajemen Kurs
                                                </Link>
                                            </li>
                                        ) :
                                            <li>
                                                <Link to="/admin/kurs">
                                                    <i className="metismenu-icon pe-7s-cash">
                                                    </i>Manajemen Kurs
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
                                                        alignItems: 'center',
                                                    }}>
                                                        <i className="metismenu-icon pe-7s-comment" />
                                                        <p>Manajemen Negosiasi</p>
                                                        <p style={{ color: '#B81F44', marginLeft: '1.5rem', fontWeight: 'bold', fontSize: '12px' }}>({
                                                            parseInt(this.state.totalNotification) > 99 ?
                                                                "99+"
                                                                :
                                                                this.state.totalNotification
                                                        })</p>
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
                                                        <p style={{ color: '#B81F44', marginLeft: '1.5rem', fontWeight: 'bold', fontSize: '12px' }}>({
                                                            parseInt(this.state.totalNotification) > 99 ?
                                                                "99+"
                                                                :
                                                                this.state.totalNotification
                                                        })</p>
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
                                        page === 'sales' ? (
                                            <li>
                                                <Link to="/admin/sales" className="mm-active">
                                                    <i className="metismenu-icon pe-7s-user">
                                                    </i>Manajemen Sales
                                                </Link>
                                            </li>
                                        ) :
                                            <li>
                                                <Link to="/admin/sales">
                                                    <i className="metismenu-icon pe-7s-user">
                                                    </i>Manajemen Sales
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
                                        page === 'ongkir' ? (
                                            <li>
                                                <Link to="/admin/ongkir" className="mm-active">
                                                    <i className="metismenu-icon pe-7s-car">
                                                    </i>Manajemen Ongkir
                                                </Link>
                                            </li>
                                        ) :
                                            <li>
                                                <Link to="/admin/ongkir">
                                                    <i className="metismenu-icon pe-7s-car">
                                                    </i>Manajemen Ongkir
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
                            <ContentNegosiasi></ContentNegosiasi>
                        ) : page === 'transaksi' ? (
                            <ContentTransaksi></ContentTransaksi>
                        ) : page === 'pengguna' ? (
                            <ContentPengguna></ContentPengguna>
                        ) : page === 'profil' ? (
                            <ContentProfil></ContentProfil>
                        ) : page === 'kurs' ? (
                            <ContentKurs></ContentKurs>
                        ) : page === 'sales' ? (
                            <ContentSales></ContentSales>
                        ) : page === 'payment' ? (
                            <ContentPayment></ContentPayment>
                        ) : page === 'ongkir' ? (
                            <ContentOngkir></ContentOngkir>
                        ) : page === 'chats' ? (
                            <ContentChats></ContentChats>
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
    sidebarStatus: state.isSidebarRendered,
    io: state.io
})

const reduxDispatch = (dispatch) => ({
    getNumber: data => dispatch(getNotificationNumber(data)),
    checkRenderedSidebar: data => dispatch(checkRenderedSidebar(data)),
    setSocketIOConnection: data => dispatch(setSocketIOConnection(data))
})

export default connect(reduxState, reduxDispatch)(SidebarAdmin);