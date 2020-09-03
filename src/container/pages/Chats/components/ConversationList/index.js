import React, { useState, useEffect } from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { firebaseApp } from '../../../../../config/firebase/index'
import { postQuery } from '../../../../../config/redux/action'
import { encrypt, decrypt } from '../../../../../config/lib';

import './ConversationList.css';

const ConversationList = props => {
  const [userData, setUserData] = useState(null)
  const [userDataFiltered, setUserDataFiltered] = useState(null)
  const [inputSearch, setInputSearch] = useState('')

  useEffect(() => {
    getUserList()
  }, [])


  const matchUserArray = (input, order) => {
    let temp = {
      user: [],
      msg: []
    }

    order.map(order => {
      // Matching User
      input.user.map((user, index) => {
        if (parseInt(input.user[index].company_id) === parseInt(order.id)) {
          temp.user.push(input.user[index])
        }
        return null
      })

      // Matching Message
      input.msg.map((msg, index) => {
        if (parseInt(input.msg[index][0].sender) === parseInt(order.id)) {
          temp.msg.push(input.msg[index])
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
      let keyCollection = []
      snapshot.forEach(function (child) {
        keyCollection.push(child.key)
      })

      let passQuery = `select gmu.*,gmc.nama_perusahaan from gcm_master_user gmu 
        join gcm_master_company gmc on gmc.id=gmu.company_id
        where 
      `

      const valueArr = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]); //Convert Object to array
      let messageArr = []
      let receiverArr = []

      // Adding query
      valueArr.map((data, index) => {
        if (index === valueArr.length - 1) {
          passQuery += `gmu.id = ${data.user_id_buyer};`
        } else {
          passQuery += `gmu.id = ${data.user_id_buyer} or `
        }

        messageArr.push(Object.keys(data.message).map((key) => data.message[key])) // Push message on room
        receiverArr.push({ id: data.company_id_buyer, time: data.last_timestamp })
      })

      let user = await props.getUserList({ query: encrypt(passQuery) }).catch(err => err)

      let matchArray = matchUserArray({ user: user, msg: messageArr }, receiverArr)

      user = matchArray.user
      messageArr = matchArray.msg

      user = user.map((data, index) => ({
        id: data.id,
        nama: data.nama_perusahaan,
        roomId: keyCollection[index],
        last_message: messageArr[index][messageArr[index].length - 1] ? messageArr[index][messageArr[index].length - 1].contain : null,
        receiver: receiverArr[index].id
      }))

      setUserData(user)
    })
  }

  const inputHandler = (e) => {
    const input = e.target.value

    if (input === '' || !input) {      
      setUserDataFiltered(null)
    }

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