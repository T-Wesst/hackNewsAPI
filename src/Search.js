import React from 'react';

const Search = props => {
  const { value, onChange, children, onSubmit } = props;
  return (
    <form onSubmit={onSubmit}>
      <input value={value} onChange={onChange} type="text" />
      <button type="submit">{children}</button>
    </form>
  );
};

export default Search;
