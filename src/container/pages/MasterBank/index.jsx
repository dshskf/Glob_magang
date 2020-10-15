import React, { Component } from 'react';
import SidebarSuperAdmin from '../../templates/Sidebar/indexsuperadmin';
import { decrypt } from '../../../config/lib';

class MasterBank extends Component {
    state = {
        role: decrypt(JSON.parse(localStorage.getItem('userData')).role)
    }
    render() {
        const role = this.state.role
        return (
            <div>
                {(role === 'admin') ? this.props.history.push('/admin') : <SidebarSuperAdmin page='masterbank'></SidebarSuperAdmin>}
            </div>
        )
    }
}

export default MasterBank;