import React, { Component } from 'react';
import Sidebar from '../../templates/Sidebar';
import SidebarAdmin from '../../templates/Sidebar/indexadmin';
import SidebarSuperAdmin from '../../templates/Sidebar/indexsuperadmin';
import { decrypt } from '../../../config/lib'

class Beranda extends Component {
    state = {
        role: decrypt(JSON.parse(localStorage.getItem('userData')).role),
        sa_role: decrypt(JSON.parse(localStorage.getItem('userData')).sa_role)
    }

    render(){
        const role = this.state.role
        const sa_role = this.state.sa_role
        return (
            <div>
                {(role === 'admin' && sa_role === 'admin') ? <SidebarAdmin page='beranda'></SidebarAdmin> :
                    (role === 'admin') ? <Sidebar page='beranda'></Sidebar> : 
                    <SidebarSuperAdmin page='beranda'></SidebarSuperAdmin>}
            </div>
            // <Sidebar page='beranda'></Sidebar>
        )
    }
}

export default Beranda;