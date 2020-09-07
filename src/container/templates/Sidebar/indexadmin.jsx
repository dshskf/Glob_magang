import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../../../config/firebase/index'

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

import { getNotificationNumber } from '../../../config/redux/action';
import { encrypt, decrypt } from '../../../config/lib';

class SidebarAdmin extends Component {
    state = {
        totalNotification: 0,
        totalUnreadMessages: 0
    }

    async componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userData'))
        const query = encrypt(`
        select count (*) from gcm_notification_nego gnn 
        where seller_id = ${decrypt(userData.company_id)} and buyer_id in (
            select buyer_id from gcm_company_listing_sales gcls 
            where seller_id = ${decrypt(userData.company_id)} and id_sales = ${decrypt(userData.id)} and status = 'A')
        `)
        const post = await this.props.getNumber({ query: query }).catch(err => err)

        let user_id = parseInt(decrypt(userData.company_id))
        firebaseApp.database().ref().orderByChild('company_id_seller').equalTo(user_id).on("value", async snapshot => {
            const roomData = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]); //Convert Object to array
            let count_unread = 0

            roomData.map(data => {
                let isAdd = false

                Object.keys(data.message).map((key) => {
                    if (data.message[key].read === false && parseInt(data.message[key].receiver) === parseInt(user_id)) {
                        isAdd = true
                    }

                })

                if (isAdd) {
                    count_unread += 1
                }
                return null;
            })


            this.setState({ totalUnreadMessages: count_unread })

        })

        this.setState({ totalNotification: post[0].count })
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
                                                        <p style={{ color: '#B81F44', marginLeft: '1.5rem', fontWeight: 'bold', fontSize: '10px' }}>{
                                                            parseInt(this.state.totalNotification) > 99 ?
                                                                "99+"
                                                                :
                                                                this.state.totalNotification
                                                        }</p>
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
                                                        <p style={{ color: '#B81F44', marginLeft: '1.5rem', fontWeight: 'bold', fontSize: '10px' }}>{
                                                            parseInt(this.state.totalNotification) > 99 ?
                                                                "99+"
                                                                :
                                                                this.state.totalNotification
                                                        }</p>
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
                                                        <p style={{ color: '#B81F44', marginLeft: '1.5rem', fontWeight: 'bold', fontSize: '10px' }}>{this.state.totalUnreadMessages}</p>
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
                                                        <p style={{ color: '#B81F44', marginLeft: '1.5rem', fontWeight: 'bold', fontSize: '10px' }}>{this.state.totalUnreadMessages}</p>
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
    isShown: state.isShown
})

const reduxDispatch = (dispatch) => ({
    getNumber: data => dispatch(getNotificationNumber(data))
})

export default connect(reduxState, reduxDispatch)(SidebarAdmin);