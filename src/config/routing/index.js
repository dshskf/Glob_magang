import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
    {...rest}
    render={(props) => localStorage.getItem('userData')
      ? <Component {...props} />
        : <Redirect to='/admin' />}
  />
  )
}

const reduxState = (state) => ({
  isLogin:state.isLogin,
  userData: state.userData
})

export default connect(reduxState)(PrivateRoute);