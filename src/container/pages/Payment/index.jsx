import React, { Component } from 'react';
import SidebarAdmin from '../../templates/Sidebar/indexadmin';
import SidebarSuperAdmin from '../../templates/Sidebar/indexsuperadmin';
import { decrypt } from '../../../config/lib';

class Payment extends Component {
    state = {
        role: decrypt(JSON.parse(localStorage.getItem('userData')).role),
        sa_role: decrypt(JSON.parse(localStorage.getItem('userData')).sa_role)
    }
    render(){
        const role = this.state.role
        const sa_role = this.state.sa_role
        return (
            <div>
                {(role === 'admin' && sa_role === 'admin') ? <SidebarAdmin page='payment'></SidebarAdmin> :
                 (role === 'admin') ? this.props.history.push('/admin') :
                <SidebarSuperAdmin page='payment'></SidebarSuperAdmin>}
            </div>
        )
    }
}

export default Payment;