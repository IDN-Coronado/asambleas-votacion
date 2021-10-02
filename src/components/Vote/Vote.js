import { useState, useEffect } from "react";

import usePrevious from "../../hooks/usePrevious";
import VoteOption from "./VoteOption";

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

  const onSectionVote = (optionId, value) => {
    let _selectedOptions = [ ...selectedOptions ];
    const isInList = selectedOptions.includes(optionId);
    if (isInList) {
      if (value) return;
      _selectedOptions.splice(_selectedOptions.indexOf(optionId), 1);
    } else {
      if (limit && limit > 1) {
        if (_selectedOptions.length < limit + 1) {
          _selectedOptions.push(optionId);
        }
      } else {
        _selectedOptions = [ optionId ];
      }
    }
    setSelectedOptions(_selectedOptions);
  }

  const isDisabled = selectedOptions.length >= limit + 1;
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
        <>
          <VoteOption
            key={options[0].id}
            option={options[0]}
            totalOptions={options.length}
            onOptionVote={onSectionVote}
            selectedOptions={selectedOptions}
            isSingleOption
            isDisabled={isDisabled}
          />
        </> :
        <div className="block options is-flex is-flex-wrap-wrap">
          {options.map(option => <VoteOption
            key={option.id}
            option={option}
            totalOptions={options.length}
            onOptionVote={onSectionVote}
            selectedOptions={selectedOptions}
            isDisabled={isDisabled}
          />)}
        </div>}
      </div>
    </div>
  </div>
}

export default Vote;