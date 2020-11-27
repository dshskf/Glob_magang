import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { firebaseApp } from '../../../../../config/firebase/index'
import { decrypt } from '../../../../../config/lib';

import Message from '../Message';
import MessageWithBarang from '../Message/withBarang/index'

import { changeChatScreen } from '../../../../../config/redux/action/index'
import './MessageList.css';

const MessageList = (props) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [msgComponent, setMsgComponent] = useState(null)

  const user_id = parseInt(decrypt(JSON.parse(localStorage.getItem('userData')).company_id))
  const roomData = props.userIdToFecth

  const lastMessageRef = useRef(null)
  const firebase = useRef(null)
  const isOpenMessage = useRef(true)

  useEffect(() => {
    return () => {
      if (firebase.current) {
        firebase.current.off('value')
      }
    }
  }, [])

  useEffect(() => {
    isOpenMessage.current = props.boolChatSceen
    if (!props.boolChatSceen) {
      getMessages()
    }
  }, [props.boolChatSceen])

  useEffect(() => {
    renderMessages()
  }, [messages])

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [msgComponent])

  const getMessages = () => {
    firebase.current = firebaseApp.database().ref(roomData.roomId)
    firebase.current.on("value", async snapshot => {
      let update_read_flag_key = []

      let result = Object.keys(snapshot.val().message).map((key) => {
        if (!snapshot.val().message[key].read && snapshot.val().message[key].receiver === parseInt(user_id)) {

          update_read_flag_key.push(key);
        }
        return snapshot.val().message[key]
      });

      result = result.map((data, index) => ({
        id: data.id,
        author: data.sender,
        message: data.contain,
        barang_id: data.barang_id,
        timestamp: data.timestamp.time,
        time_label: moment(data.timestamp.time).format("HH:mm"),
        status: data.read
      }))

      if (!isOpenMessage.current) {
        update_read_flag_key.map(msg_key => firebaseApp.database().ref(`/${roomData.roomId}/message/${msg_key}`).update({ read: true }))
      }


      setMessages(result)
    })
  }


  const renderMessages = () => {
    let tempMessages = [];
    let i = 0;
    let messageCount = messages.length;

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === user_id;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;
      let lastMessage = false;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as('day') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('day') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      lastMessage = i === messages.length - 1 ? lastMessageRef : null;
      // console.log(current)
      tempMessages.push(
        messages[i].barang_id ?
          <MessageWithBarang
            key={i}
            isMine={isMine}
            startsSequence={startsSequence}
            endsSequence={endsSequence}
            showTimestamp={showTimestamp}
            data={current}
            barang_id={messages[i].barang_id}
            isLastMessage={lastMessage}
          />
          :
          <Message
            key={i}
            isMine={isMine}
            startsSequence={startsSequence}
            endsSequence={endsSequence}
            showTimestamp={showTimestamp}
            data={current}
            isLastMessage={lastMessage}
          />
      );

      // Proceed to the next message.
      i += 1;
    }

    setMsgComponent(tempMessages)
  }

  const inputHandler = e => setInput(e.target.value)

  const submitMessage = () => {
    let sendMsg = firebaseApp.database().ref(`/${roomData.roomId}/message`)
    let updateTimestamp = firebaseApp.database().ref(`/${roomData.roomId}`)
    const d = new Date()

    updateTimestamp.update({
      last_timestamp: Date.now()
    })
    sendMsg.push({
      contain: input,
      read: false,
      sender: parseInt(user_id),
      receiver: parseInt(roomData.receiver_id),
      timestamp: {
        'date': d.getDate(),
        'day': d.getDay(),
        'hours': d.getHours(),
        'minutes': d.getMinutes(),
        'month': d.getMonth(),
        'seconds': d.getSeconds(),
        'time': Date.now(),
        'timezoneOffset': d.getTimezoneOffset(),
        'year': d.getFullYear()
      },
      type: 'text'
    }).then(snap => {
      firebaseApp.database().ref(`/${roomData.roomId}/message/${snap.key}`).update({
        uid: snap.key
      })
    })
    setInput('')
  }

  const keyDownHandler = (e) => {
    if (e.key === 'Enter') {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
      submitMessage()
    }
  }

  const handleChangeScreen = () => {
    props.changeChatScreen(true)
  }

  return (

    !props.boolChatSceen &&
    <div className="message-list-box">
      {
        msgComponent &&
        <div className="message-list" style={{ display: roomData ? 'block' : 'none' }}>
          <div className="message-list-header">
            <h1 onClick={handleChangeScreen}>X</h1>
            {props.userIdToFecth ? props.userIdToFecth.nama : null}
          </div>
          <div className="message-list-container">{msgComponent && msgComponent}</div>
          {/* <div className="message-list-last" ref={lastMessageRef}></div> */}
        </div>
      }

      {
        props.userIdToFecth &&
        <div className="message-input">
          <input
            type="text"
            value={input}
            onChange={inputHandler}
            onKeyDown={keyDownHandler}
            placeholder="Enter text here..."
          />
          <i className="metismenu-icon pe-7s-angle-right" onClick={submitMessage}></i>
        </div>
      }


    </div>


  );
}

const reduxState = (state) => ({
  userIdToFecth: state.fetchChatUserId,
  boolChatSceen: state.isContactListScreen
})

const reduxDispatch = (dispatch) => ({
  changeChatScreen: (data) => dispatch(changeChatScreen(data))
})

export default connect(reduxState, reduxDispatch)(MessageList);