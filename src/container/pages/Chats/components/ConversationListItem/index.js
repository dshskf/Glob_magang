import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { changeFetchCartUserId } from '../../../../../config/redux/action'

import shave from 'shave';

import './ConversationListItem.css';

const ConversationListItem = (props) => {
  const [active, setActive] = useState('')

  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

  const userClick = e => {
    props.changeUser({
      id: e.currentTarget.id.split('#')[0],
      roomId: e.currentTarget.id.split('#')[1],
      receiver_id: e.currentTarget.id.split('#')[2]
    })    
  }

  return (
    <div
      className={`conversation-list-item`}
      id={`${props.data.id}#${props.data.roomId}#${props.data.receiver}`}
      onClick={userClick}
    >
      <img className="conversation-photo" src={require('../../../../../component/assets/img/user.png')} alt="conversation" />
      <div className="conversation-info">
        <h1 className="conversation-title">{props.data.nama}</h1>
        <p className="conversation-snippet">{props.data.last_message}</p>
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