import React, { Component } from 'react';
import Messenger from './components/Messenger';
class ContentChats extends Component {
    render() {
        return (
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Messenger></Messenger>
                </div>
            </div>
        )
    }
}


export default ContentChats