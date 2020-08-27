import React, { Component } from 'react';
import SidebarAdmin from '../../templates/Sidebar/indexadmin';
import { decrypt } from '../../../config/lib';

class Kurs extends Component {
    state = {
        role: decrypt(JSON.parse(localStorage.getItem('userData')).role),
        sa_role: decrypt(JSON.parse(localStorage.getItem('userData')).sa_role)
    }

    
    
    render(){
        const role = this.state.role
        const sa_role = this.state.sa_role
        return (
            <div>
                { (role === 'admin' && sa_role === 'admin') ? 
                        <SidebarAdmin page='kurs'></SidebarAdmin> :
                    this.props.history.push('/admin')
                }
            </div>
            // <Sidebar page='sales'></Sidebar>
        )
    }
}

export default Kurs;