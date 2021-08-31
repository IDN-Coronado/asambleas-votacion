import { useState, useEffect } from "react";

import usePrevious from "../../hooks/usePrevious";

const getLimit = (limit, options) => {
  switch (limit) {
    case (undefined || null):
      return 'SI o NO';
    case 0:
      return 'por una sola opción';
    default:
      return ` por ${limit + 1} de las ${options} opciones`
  }
}

const Vote = ({ id, title, description, limit, options, onVoteUpdate }) => {
  const [ selectedOptions, setSelectedOptions ] = useState([]);
  const prevSelectedOptions = usePrevious(selectedOptions);

  useEffect(() => {
    if (prevSelectedOptions !== selectedOptions) {
      onVoteUpdate(id, selectedOptions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ selectedOptions ]);

  const onSectionVote = e => {
    const value = e.currentTarget.value !== '0' ? e.currentTarget.value : null;
    let _selectedOptions = [ ...selectedOptions ];
    if (limit && limit > 1) {
      if (selectedOptions.length >= limit + 1) {
        _selectedOptions.shift();
      }
      _selectedOptions.push(value)
    } else {
      _selectedOptions = [ value ];
    }
    setSelectedOptions(_selectedOptions);
  }
  return <div className="message">
    <header className="message-header">
      <h4>{title}</h4>
    </header>
    <div className="message-body">
      <p className="subtitle is-6">{description}</p>
      <div>
        <p><strong>Instrucciones:</strong></p>
        <p className="subtitle is-6">Vote {
          getLimit(limit, options.length)
        }{
          (limit === undefined || limit === null) ? ` por ${options[0].title}` : ''
        }</p>
      </div>
      <div className="block options">{options.length === 1 ?
        <div className="radio-option">
          <label><input type="radio" name={id} value={options[0].id} onChange={onSectionVote} /><span className="button">Si</span></label>
          <label><input type="radio" name={id} value="0" onChange={onSectionVote} /><span className="button">No</span></label>
        </div> :
        <div className="block options">
          {options.map(option => (
            <label key={option.id}>
              <input type="checkbox" checked={selectedOptions.includes(option.id)} name={id} value={option.id} onChange={onSectionVote} />
              <span className="button">{option.title}</span>
            </label>
          ))}
        </div>}
      </div>
    </div>
  </div>
}

export default Vote;