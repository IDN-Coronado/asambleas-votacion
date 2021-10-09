import { useState } from "react";

const VoteOption = ({ option, totalOptions, onOptionVote, selectedOptions, isSingleOption, isDisabled }) => {
  const [ optionValue, setOptionValue ] = useState(selectedOptions.includes(option.id));
  const handleOptionChange = e => {
    const value = e.currentTarget.value === 'true';
    setOptionValue(value);
    onOptionVote(option.id, value);
  }
  return <div key={option.id} className={!isSingleOption ? 'is-flex is-flex-direction-column mr-5 mb-5 box' : ''}>
    <p className="is-subtitle is-text-dark is-size-4 has-text-weight-bold mb-4">{option.title}</p>
    {option.imageURL && (isSingleOption ? 
      <img className="single-option" src={option.imageURL} alt={option.title} /> :
      <div className="image-wrapper mb-2" style={{ backgroundImage: `url(${option.imageURL})`}} /> )}
    <div className={`radio-option ${isSingleOption ? '' : 'is-flex is-justify-content-space-between'}`}>
      <label disabled={isDisabled}><input type="radio" name={option.id} value={true} onChange={handleOptionChange} checked={optionValue} disabled={isDisabled} /><span className={`button is-dark ${isSingleOption ? '' : 'is-fullwidth'}`} disabled={isDisabled} >Si</span></label>
      <label disabled={!optionValue && isDisabled}><input type="radio" name={option.id} value={false} onChange={handleOptionChange} checked={!optionValue} disabled={!optionValue && isDisabled} /><span className={`button is-dark ${isSingleOption ? '' : 'is-fullwidth'}`} disabled={!optionValue && isDisabled} >No</span></label>
    </div>
  </div>
}
export default VoteOption;