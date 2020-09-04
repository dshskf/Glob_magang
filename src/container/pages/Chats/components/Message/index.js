import React from 'react';
import moment from 'moment';
import './Message.css';

export default function Message(props) {
  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp,
    isLastMessage
  } = props;

  const friendlyTimestamp = moment(data.timestamp).format('LLLL');
  return (
    <div className={[
      'message',
      `${isMine ? 'mine' : ''}`,
      `${startsSequence ? 'start' : ''}`,
      `${endsSequence ? 'end' : ''}`
    ].join(' ')}
      ref={isLastMessage}
    >
      {
        showTimestamp
        &&
        <div className="timestamp">
          {friendlyTimestamp.split('pukul')[0]}
        </div>
      }

      <div className="bubble-container">
        {
          isMine ?
            <React.Fragment>
              <div className="bubble-time">
                {
                  data.status ?
                    <img src={require('../../../../../component/assets/img/read-true.png')} alt="" />
                    :
                    <img src={require('../../../../../component/assets/img/read-false.png')} alt="" />
                }

                {data.time_label}
              </div>
              <div className={`bubble ${data.status ? 'bubble-read' : null}`} title={friendlyTimestamp}>
                {data.message}
              </div>
            </React.Fragment>
            :
            <React.Fragment>
              <div className="bubble" title={friendlyTimestamp}>
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