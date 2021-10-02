import { useState } from "react";

const VoteOption = ({ option, totalOptions, onOptionVote, selectedOptions, isSingleOption, isDisabled }) => {
  const [ optionValue, setOptionValue ] = useState(selectedOptions.includes(option.id));
  const handleOptionChange = e => {
    const value = e.currentTarget.value === 'true';
    setOptionValue(value);
    onOptionVote(option.id, value);
  }
  return <div key={option.id} className={!isSingleOption ? 'is-flex is-flex-direction-column mr-5 mb-5' : ''}>
    {option.imageURL && (isSingleOption ? 
      <img className="single-option" src={option.imageURL} alt={option.title} /> :
      <div className="image-wrapper mb-2" style={{ backgroundImage: `url(${option.imageURL})`, minHeight: `${980 / totalOptions}px` }} /> )}
    <div className="radio-option">
      <label disabled={isDisabled}><input type="radio" name={option.id} value={true} onChange={handleOptionChange} checked={optionValue} disabled={isDisabled} /><span className="button is-dark" disabled={isDisabled} >Si</span></label>
      <label disabled={!optionValue && isDisabled}><input type="radio" name={option.id} value={false} onChange={handleOptionChange} checked={!optionValue} disabled={!optionValue && isDisabled} /><span className="button is-dark" disabled={!optionValue && isDisabled} >No</span></label>
    </div>
    <span className="is-subtitle is-text-dark">{option.title}</span>
  </div>
}
export default VoteOption;