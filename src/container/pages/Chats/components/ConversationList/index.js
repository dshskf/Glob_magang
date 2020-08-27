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

  useEffect(() => {
    getUserList()
  }, [])

  const getUserList = () => {
    let user_id = parseInt(decrypt(JSON.parse(localStorage.getItem('userData')).company_id))

    firebaseApp.database().ref().orderByChild('company_id_seller').equalTo(user_id).on("value", async snapshot => {
      let passQuery = `select gmu.*,gmc.nama_perusahaan from gcm_master_user gmu 
      join gcm_master_company gmc on gmc.id=gmu.company_id
      where `
      let keyCollection = []
      snapshot.forEach(function (child) {
        keyCollection.push(child.key)
      })

      const valueArr = Object.keys(snapshot.val()).map((key) => snapshot.val()[key]);
      let messageArr = []
      let receiverArr = []

      valueArr.map((data, index) => {
        if (index === valueArr.length - 1) {
          passQuery += `gmu.id = ${data.user_id_buyer};`
        } else {
          passQuery += `gmu.id = ${data.user_id_buyer} or `
        }
        messageArr.push(Object.keys(data.message).map((key) => data.message[key]))
        receiverArr.push(data.company_id_buyer)
      })

      let user = await props.getUserList({ query: encrypt(passQuery) }).catch(err => err)
      
      user = user.map((data, index) => ({
        id: data.id,
        nama: data.nama_perusahaan,
        roomId: keyCollection[index],
        last_message: messageArr[index][messageArr[index].length - 1] ? messageArr[index][messageArr[index].length - 1].contain : null,
        receiver: receiverArr[index]
      }))

      setUserData(user)
    })
  }

  return (
    <div className="conversation-list">
      <ConversationSearch />
      {
        userData ?
          userData.map(data =>
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