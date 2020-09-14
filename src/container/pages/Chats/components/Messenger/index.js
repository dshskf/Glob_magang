import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { changeChatScreen } from '../../../../../config/redux/action/index'

import ConversationList from '../ConversationList';
import MessageList from '../MessageList';

import './Messenger.css';

const Messenger = (props) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', () => setScreenWidth(window.innerWidth));//740
  }, [])


  return (
    <div className={`messenger ${screenWidth < 740 && 'messenger-full'}`}>
      {
        (props.boolChatSceen || screenWidth > 740) && <div className="scrollable sidebar">
          <ConversationList />
        </div>
      }

      {
        (!props.boolChatSceen || screenWidth > 740) && <div className="scrollable content">
          <MessageList />
        </div>
      }

    </div>
  );
}

const reduxState = (state) => ({
  boolChatSceen: state.isContactListScreen
})

const reduxDispatch = (dispatch) => ({
  changeChatScreen: (data) => dispatch(changeChatScreen(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(Messenger));