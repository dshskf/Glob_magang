import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { encrypt, decrypt } from '../../../../../../config/lib';
import { postQuery } from '../../../../../../config/redux/action';
import NumberFormat from 'react-number-format';

import './Message.css';

const MessageWithBarang = (props) => {
  const [barang, setBarang] = useState('')

  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp,
    barang_id
  } = props;

  const friendlyTimestamp = moment(data.timestamp).format('LLLL');

  useEffect(() => {
    const fetchBarang = async () => {
      const passQuery = `select a.id, b.nama, a.foto, a.price, c.nominal as kurs, d.alias as satuan 
      from gcm_list_barang a 
      inner join gcm_master_barang b on a.barang_id = b.id 
      inner join gcm_listing_kurs c on a.company_id = c.company_id 
      inner join gcm_master_satuan d on b.satuan = d.id 
      where a.id in (${barang_id}) and now() between c.tgl_start and c.tgl_end`

      let getBarangData = await props.getBarang({ query: encrypt(passQuery) }).catch(err => err)
      getBarangData = getBarangData[0]


      getBarangData.price = (parseFloat(getBarangData.kurs) * parseFloat(getBarangData.price)).toString()

      setBarang(getBarangData)
    }

    if (barang_id) {
      fetchBarang()
    }
  }, [barang_id])



  return (
    <div className={[
      'message',
      `${isMine ? 'mine' : ''}`,
      `${startsSequence ? 'start' : ''}`,
      `${endsSequence ? 'end' : ''}`
    ].join(' ')}>
      {
        showTimestamp &&
        <div className="timestamp">
          {friendlyTimestamp.split('pukul')[0]}
        </div>
      }

      <div className="bubble-container">
        {
          isMine ?
            <React.Fragment>
              <div className="bubble-time">
                {data.time_label}
              </div>
              <div className="bubble" title={friendlyTimestamp}>

                {
                  barang ?
                    <div className="bubble-barang">
                      <img src={barang.foto} />
                      <div className="bubble-barang-detail">
                        <p className={barang.nama.length > 30 ? "bubble-bd-long" : ""} >{barang.nama}</p>
                        <NumberFormat value={barang.price} displayType={'text'} thousandSeparator={true} prefix={'IDR'} />
                      </div>
                    </div>
                    : null
                }
                {data.message}
              </div>
            </React.Fragment>
            :
            <React.Fragment>
              <div className="bubble" title={friendlyTimestamp}>
                {
                  barang ?
                    <div className="bubble-barang">
                      <img src={barang.foto} />
                      <div className="bubble-barang-detail">
                        <p className={barang.nama.length > 30 ? "bubble-bd-long" : ""} >{barang.nama}</p>
                        <NumberFormat value={barang.price} displayType={'text'} thousandSeparator={true} prefix={'IDR '} />
                      </div>
                    </div>
                    : null
                }
                {data.message}
              </div>
              <div className="bubble-time">
                {data.time_label}
              </div>
            </React.Fragment>
        }

      </div>
    </div>
  );
}

const reduxState = (state) => ({
})

const reduxDispatch = (dispatch) => ({
  getBarang: data => dispatch(postQuery(data))
})

export default withRouter(connect(reduxState, reduxDispatch)(MessageWithBarang));