import React from 'react';
import { connect } from 'react-redux';
import { changeFetchCartUserId } from '../../../../../config/redux/action'

// import shave from 'shave';

import './ConversationListItem.css';

const ConversationListItem = (props) => {

  const userClick = e => {
    const getData = e.currentTarget.id.split('#')

    props.changeUser({
      id: getData[0],
      nama: getData[1],
      roomId: getData[2],
      receiver_id: getData[3]
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
      id={`${props.data.id}#${props.data.nama}#${props.data.roomId}#${props.data.receiver}`}
      onClick={userClick}
    >
      <img className="conversation-photo" src={require('../../../../../component/assets/img/user.png')} alt="conversation" />
      <div className="conversation-info">
        <h1 className="conversation-title">{props.data.nama}</h1>
        {
          props.data.last_message && <p className="conversation-snippet">
            {props.data.last_message.length > 20 ? props.data.last_message.substring(0, 20) + "..." : props.data.last_message}
          </p>
        }

      </div>

      {
        props.data.total_message_unread > 0 && <div className="conversation-badge">
          {props.data.total_message_unread}
        </div>
      }

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