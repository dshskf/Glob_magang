import React, { useState, useEffect } from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { firebaseApp } from '../../../../../config/firebase/index'
import { postQuery } from '../../../../../config/redux/action'
import { encrypt, decrypt } from '../../../../../config/lib';
import sortArray from 'sort-array'

import './ConversationList.css';

const ConversationList = props => {
  const [userData, setUserData] = useState(null)
  const [userDataFiltered, setUserDataFiltered] = useState(null)
  const [inputSearch, setInputSearch] = useState('')

  useEffect(() => {
    getUserList()
  }, [])


  const matchUserArray = (user, order) => {
    let temp = []

    order.map(order => {
      user.map(user_data => {
        if (parseInt(user_data.company_id) === parseInt(order.receiver_id)) {
          temp.push(user_data)
        }
        return null
      })
      return null
    })

    return temp
  }

  const getUserList = () => {
    let user_id = parseInt(decrypt(JSON.parse(localStorage.getItem('userData')).company_id))

    firebaseApp.database().ref().orderByChild('company_id_seller').equalTo(user_id).on("value", async snapshot => {
      if (!snapshot.val()) {
        return
      }
      // Get Room Id
      let keyCollection = []
      snapshot.forEach(function (child) {
        keyCollection.push(child.key)
      })

      let passQuery = `select gmu.*,gmc.nama_perusahaan from gcm_master_user gmu 
        join gcm_master_company gmc on gmc.id=gmu.company_id
        where 
      `

      const roomData = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]); //Convert Object to array      
      let chatDataArr = []


      // Adding query
      roomData.map((data, index) => {
        if (index === roomData.length - 1) {
          passQuery += `gmu.id = ${data.user_id_buyer};`
        } else {
          passQuery += `gmu.id = ${data.user_id_buyer} or `
        }

        let convert_msg_objToArray = Object.keys(data.message).map((key) => data.message[key])

        chatDataArr.push({
          receiver_id: data.company_id_buyer,
          time: data.last_timestamp,
          msg: convert_msg_objToArray,
          roomId: keyCollection[index]
        })
      })

      // Sort user list by last_timestamp
      chatDataArr = await sortArray(chatDataArr, {
        by: 'time',
        order: 'desc'
      })

      let user = await props.getUserList({ query: encrypt(passQuery) }).catch(err => err)
      user = matchUserArray(user, chatDataArr)

      user = user.map((data, index) => {
        return {
          id: data.id,
          nama: data.nama_perusahaan,
          roomId: chatDataArr[index].roomId,
          last_message: chatDataArr[index].msg[chatDataArr[index].msg.length - 1].contain,
          receiver: chatDataArr[index].receiver_id
        }
      })

      setUserData(user)
    })
  }

  const inputHandler = (e) => {
    const input = e.target.value

    let user = userData.filter(data => {
      return data.nama.toLowerCase().includes(input.toLowerCase())
    })

    setUserDataFiltered(user)
    setInputSearch(input)
  }

  let userToFetch = userDataFiltered ? userDataFiltered : userData


  return (
    <div className="conversation-list">
      <ConversationSearch handler={inputHandler} value={inputSearch} />
      {
        userToFetch ?
          userToFetch.map(data =>
            <ConversationListItem
              key={data.id}
              data={data}
            />
          )
          :
          null
      }
    </div>
  );
}

const reduxState = (state) => ({
})

const reduxDispatch = (dispatch) => ({
  getUserList: data => dispatch(postQuery(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(ConversationList));