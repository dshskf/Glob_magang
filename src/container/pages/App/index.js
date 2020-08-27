import React, { Component } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../../../config/redux'
import Login from '../Login'
import Beranda from '../Beranda'
import Barang from '../Barang'
import Pengguna from '../Pengguna'
import Transaksi from '../Transaksi'
import Negosiasi from '../Negosiasi'
import PrivateRoute from './../../../config/routing/index'
import history from './../../../config/routing/history'
import MasterBarang from '../MasterBarang'
import MasterKategori from '../MasterKategori'
import MasterBlacklist from '../MasterBlacklist'
import MasterSatuan from '../MasterSatuan'
import MasterPayment from '../MasterPayment'
import MasterReason from '../MasterReason'
import MasterKalenderLibur from '../MasterKalenderLibur'
import Profil from '../Profil'
import Sales from '../Sales'
import Payment from '../Payment'
import Ongkir from '../Ongkir'
import Kurs from '../Kurs'

class App extends Component {
  state = {
    isLogin: localStorage.getItem('userData')
  }

  componentDidMount(){
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then(function (registration) {
          console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(function (err) {
          console.log("Service worker registration failed, error:", err);
        });
    }
  }

  render() {
    return (
      <Provider store={store}>
        <div id="page-wrapper">
          <Router>
            <Switch>
              {!this.state.isLogin ? history.push('/admin') : false}
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
            </Switch>
          </Router>
        </div>
      </Provider>
    )
  }
}

export default (App);