import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './config/redux'
import Login from './container/pages/Login'
import Beranda from './container/pages/Beranda'
import Barang from './container/pages/Barang'
import Pengguna from './container/pages/Pengguna'
import Transaksi from './container/pages/Transaksi'
import Negosiasi from './container/pages/Negosiasi'
import PrivateRoute from './config/routing/index'
import history from './config/routing/history'
import MasterBarang from './container/pages/MasterBarang'
import MasterKategori from './container/pages/MasterKategori'
import MasterBlacklist from './container/pages/MasterBlacklist'
import MasterSatuan from './container/pages/MasterSatuan'
import MasterPayment from './container/pages/MasterPayment'
import MasterReason from './container/pages/MasterReason'
import MasterKalenderLibur from './container/pages/MasterKalenderLibur'
import MasterBanner from './container/pages/MasterBanner'
import Profil from './container/pages/Profil'
import Sales from './container/pages/Sales'
import Payment from './container/pages/Payment'
import Ongkir from './container/pages/Ongkir'
import Kurs from './container/pages/Kurs'
import Chats from './container/pages/Chats'

import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Notifications } from 'react-push-notification';
import addNotification from 'react-push-notification';

function App() {

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then(function (registration) {
        console.log("Registration successful, scope is:", registration.scope);
      })
      .catch(function (err) {
        console.log("Service worker registration failed, error:", err);
      });
  }

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (message) => {
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
  }, [])

  const state = {
    isLogin: localStorage.getItem('userData')
  }

  return (
    <Provider store={store}>
      <div id="page-wrapper">
        <Notifications />
        <NotificationContainer />
        <Router>
          <Switch>
            {!state.isLogin ? history.push('/admin') : false}
            <Route path="/admin" exact component={Login} />
            <PrivateRoute path="/admin/beranda" exact component={Beranda} />
            <PrivateRoute path="/admin/barang" exact component={Barang} />
            <PrivateRoute path="/admin/pengguna" exact component={Pengguna} />
            <PrivateRoute path="/admin/negosiasi" exact component={Negosiasi} />
            <PrivateRoute path="/admin/transaksi" exact component={Transaksi} />
            <PrivateRoute path="/admin/profil" exact component={Profil} />
            <PrivateRoute path="/admin/sales" exact component={Sales} />
            <PrivateRoute path="/admin/payment" exact component={Payment} />
            <PrivateRoute path="/admin/ongkir" exact component={Ongkir} />
            <PrivateRoute path="/admin/kurs" exact component={Kurs} />
            <PrivateRoute path="/admin/masterbarang" exact component={MasterBarang} />
            <PrivateRoute path="/admin/masterkategori" exact component={MasterKategori} />
            <PrivateRoute path="/admin/masternonaktif" exact component={MasterBlacklist} />
            <PrivateRoute path="/admin/mastersatuan" exact component={MasterSatuan} />
            <PrivateRoute path="/admin/masterpayment" exact component={MasterPayment} />
            <PrivateRoute path="/admin/masterreason" exact component={MasterReason} />
            <PrivateRoute path="/admin/masterkalenderlibur" exact component={MasterKalenderLibur} />
            <PrivateRoute path="/admin/masterbanner" exact component={MasterBanner} />
            <PrivateRoute path="/admin/chats" exact component={Chats} />
          </Switch>
        </Router>
      </div>
    </Provider>
  )

}

export default App;