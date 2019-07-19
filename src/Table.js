import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map(item => (
      <div className="table-row" key={item.objectID}>
        <h1>{item.title}</h1>
        <button
          style={{ marginLeft: '4px' }}
          onClick={() => onDismiss(item.objectID)}
        >
          dismiss <FontAwesomeIcon icon="trash-alt" />
        </button>
      </div>
    ))}
  </div>
);

export default Table;
