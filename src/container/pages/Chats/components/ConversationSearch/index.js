import React from 'react';
import './ConversationSearch.css';

const ConversationSearch = props => {
  return (
    <div className="conversation-search">
      <input
        type="search"
        className="conversation-search-input"
        placeholder="Search Messages"
        value={props.value}
        onChange={props.handler}
      />
    </div>
  );
}

export default ConversationSearch