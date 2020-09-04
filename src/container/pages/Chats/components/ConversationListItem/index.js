import React from 'react';
import { connect } from 'react-redux';
import { changeFetchCartUserId } from '../../../../../config/redux/action'

// import shave from 'shave';

import './ConversationListItem.css';

const ConversationListItem = (props) => {

  const userClick = e => {
    props.changeUser({
      id: e.currentTarget.id.split('#')[0],
      roomId: e.currentTarget.id.split('#')[1],
      receiver_id: e.currentTarget.id.split('#')[2]
    })
  }

  const activeChatHandler = () => {
    if (props.userIdToFecth) {
      return props.data.id === props.userIdToFecth.id ? 'conversation-active' : null
    }
    return null
  }

  return (
    <div
      className={`conversation-list-item ${activeChatHandler()}`}
      id={`${props.data.id}#${props.data.roomId}#${props.data.receiver}`}
      onClick={userClick}
    >
      <img className="conversation-photo" src={require('../../../../../component/assets/img/user.png')} alt="conversation" />
      <div className="conversation-info">
        <h1 className="conversation-title">{props.data.nama}</h1>
        <p className="conversation-snippet">{props.data.last_message.length > 20 ? props.data.last_message.substring(0, 20)+"..." : props.data.last_message}</p>
      </div>
    </div>
  );
}


const reduxState = (state) => ({
  userIdToFecth: state.fetchChatUserId
})

const reduxDispatch = (dispatch) => ({
  changeUser: data => dispatch(changeFetchCartUserId(data))
})

export default connect(reduxState, reduxDispatch)(ConversationListItem);