import React, { Component } from 'react';

class Footer extends Component {
    state = {
        
    }
    render(){
        return (
            <div className="app-footer">
                <div className="app-footer__inner">
                    <div className="app-footer-right">
                        <ul className="nav">
                            <li className="nav-item">
                                <p className="nav-link">
                                © GLOB • 2020
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;


