import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { logoutUserAPI, navigationHandler, postQuery } from '../../../config/redux/action';
import { encrypt, decrypt } from '../../../config/lib';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { firebaseApp } from '../../../config/firebase/index'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Notifications } from 'react-push-notification';
import addNotification from 'react-push-notification';

import 'react-notifications/lib/notifications.css';

import '@firebase/messaging';


class Header extends Component {
    state = {
        username: '',
        role: '',
        user_id: '',
        company_id: ''
    }

    async componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userData'));
        navigator.serviceWorker.addEventListener("message", (message) => {

            // console.log(JSON.parse(message.data.firebaseMessaging.payload.data.notification))
            if (message.data.firebaseMessaging) {
                console.log(message.data.firebaseMessaging.payload.data)
            } else {
                console.log(message.data)
            }

            addNotification({
                title: 'Warning',
                subtitle: 'This is a subtitle',
                message: 'This is a very long message',
                theme: 'darkblue',
                native: true // when using native, your OS will handle theming.
            });

            NotificationManager.success('Success message', 'New Nego!');
            return message
        });


        const messaging = firebaseApp.messaging()
        messaging.requestPermission()
            .then(() => messaging.getToken())
            .then(token => {
                console.log(token);
            })
            .catch(err => {
                console.log(err)
            })

        this.setState({
            username: decrypt(userData.username),
            role: decrypt(userData.role),
            user_id: decrypt(userData.id),
            company_id: decrypt(userData.company_id),
        })
    }

    Logout = async () => {
        const res = await this.props.logoutAPI();
        if (res) {
            this.setState({
                username: '',
                role: ''
            })
            this.props.history.push('/admin')
            window.location.reload()
        }
    }

    handleLogout = async () => {
        if (localStorage.getItem('user_token') !== null) {
            var userToken = JSON.parse(localStorage.getItem('user_token'))
            const passquery = encrypt(`
                delete from gcm_notification_token
                where user_id=${this.state.user_id} and company_id=${this.state.company_id} and token='${userToken}'
                returning *;
            `)
            const post = await this.props.postData({ query: passquery }).catch(err => err)
            if (post) {
                this.Logout()
            }
        }
        else {
            this.Logout()
        }
    }

    clickHandler = () => {
        this.props.clickChanger(this.props.isShown === "hiding" ? "showing" : "hiding")
    }

    render() {
        return (
            <div>
                <Notifications />
                <NotificationContainer />
                <div className="app-header header-shadow">
                    <div className="app-header__logo">
                        {/* <div className="logo-src"></div> */}
                        <img src="../admin/assets/images/inverse.png" style={{ width: '97px', height: '25px', marginRight: '1rem' }} alt="" />
                        {/* <img className="logo-src" src={require('../../../component/assets/img/inverse.png')} style={{ width: '97px', height: '25px', marginRight: '1rem' }} /> */}
                        <div className="header__pane ml-auto">
                            <div>
                                <button type="button" className={`hamburger close-sidebar-btn hamburger--elastic ${this.props.isShown === "hiding" ? "" : "is-active"}`} data-class="closed-sidebar" onClick={this.clickHandler}>
                                    <span className="hamburger-box">
                                        <span className="hamburger-inner"></span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="app-header__mobile-menu">
                        <div>
                            <button type="button" className={`hamburger hamburger--elastic mobile-toggle-nav ${this.props.isShown === "hiding" ? "" : "is-active"}`} onClick={this.clickHandler}>
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
                    <div className="app-header__content">
                        <div className="app-header-right">
                            <div className="header-btn-lg pr-0">
                                <div className="widget-content p-0">
                                    <div className="widget-content-wrapper">
                                        <div className="widget-content-left">
                                            <div className="btn-group" >
                                                <button data-toggle="dropdown" aria-expanded="false" className="p-0 btn">
                                                    {/* local */}
                                                    {/* <img style={{width:'60%'}} className="rounded-circle" src="../assets/images/avatars/user.png" alt=""></img> */}
                                                    {/* server */}
                                                    <img style={{ width: '60%' }} className="rounded-circle" src="../admin/assets/images/avatars/user.png" alt=""></img>
                                                    <i className="fa fa-angle-down ml-2 opacity-8"></i>
                                                </button>
                                                <div tabIndex="-1" role="menu" className="dropdown-menu dropdown-menu-right">
                                                    <Link to="/admin/profil" className="dropdown-item" style={{ tabIndex: '0' }}>Edit Profil</Link>
                                                    <div tabIndex="-1" className="dropdown-divider"></div>
                                                    <button tabIndex="0" className="dropdown-item" data-toggle="modal" data-target="#exampleModal" data-backdrop="static" data-keyboard="false">Keluar</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="widget-content-left  ml-3 header-user-info">
                                            <div className="widget-heading">
                                                {this.state.username}
                                            </div>
                                            <div className="widget-subheading">
                                                {this.state.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-sm" role="document" style={{ backdropFilter: 'static' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Konfirmasi</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-0">Keluar dari akun {this.state.username}?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleLogout}>Keluar</button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Batal</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const reduxState = (state) => ({
    isShown: state.isShown
})

const reduxDispatch = (dispatch) => ({
    logoutAPI: () => dispatch(logoutUserAPI()),
    clickChanger: (data) => dispatch(navigationHandler(data)),
    postData: (data) => dispatch(postQuery(data))
})


export default withRouter(connect(reduxState, reduxDispatch)(Header));


