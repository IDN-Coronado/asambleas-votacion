import { useState } from "react";

import uid from "../../utils/uid";

const getOptionTemplate = () => ({
  id: uid(),
  title: '',
  description: '',
  options: []
})

const VoteSection = ({ title, description, limit, options, isNew, ...rest }) => {
  const { onVoteSave, onVoteDelete, index } = rest;
  const [ isDropdownActive, setIsDropdownActive ] = useState(false);
  const [ section, setSection ] = useState(!isNew ? { title, description, limit, options } : getOptionTemplate());
  const [ isEditing, setIsEditing ] = useState(isNew);
  const [ isConfirmDeleteActive, setIsConfirmDeleteActive ] = useState(false);

  const onDropdownToggle = () =>
    setIsDropdownActive(!isDropdownActive);
  
  const onSetSection = e => {
    const el = e.currentTarget;
    const type = el.dataset.type;
    setSection({
      ...section,
      [type]: el.value,
    })
  }

  const onOptionChange = (value, optionIndex) => {
    const options = section.options.map((op, k) => {
      if (k === optionIndex) {
        return { title: value };
      }
      return op;
    })
    setSection({
      ...section,
      options,
    })
  }

  const onOptionAdd = () => {
    const newSection = { ...section };
    newSection.options = (section.options || []).concat({ id: uid(), title: '', votes: [] });
    setSection(newSection);
  }

  const onOptionDelete = optionIndex => {
    const newSection = { ...section };
    newSection.options = section.options.filter((op, oi) => oi !== optionIndex)
    setSection(newSection);
  }

  const onLimitChange = e => {
    const el = e.currentTarget;
    const type = el.dataset.type;
    setSection({
      ...section,
      [type]: el.selectedIndex,
    })
  }

  const onEditToggle = () => {
    setIsEditing(!isEditing);
    !isEditing && onDropdownToggle()
  }

  const onToggleConfirmDeleteModal = () => {
    setIsConfirmDeleteActive(!isConfirmDeleteActive);
    isConfirmDeleteActive && onDropdownToggle();
  }

  const onCancel = () => {
    setSection({ title, description, limit, options })
    onEditToggle();
  }

  const onSaveVote = () => {
    onEditToggle();
    delete section.isNew;
    onVoteSave(index, section);
  }

  const getLimitWord = value => {
    if (value === 0) {
      return 'Opción única';
    }
    if (section.options.length - 1 === value ) {
      return 'Todas las opciones'
    }
    return `Vota ${value + 1} de ${section.options.length} opciones`
  }

  return <>
    <div className={`block vote-section${!isEditing ? ' is-stale' : ''}`}>
      <div className="message-header">
        {`Votación: ${section.title ? section.title : index + 1}`}
        <div className={`dropdown is-right${isDropdownActive ? ' is-active' : ''}`}>
          <div className="dropdown-trigger">
            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu2" onClick={onDropdownToggle}>
              <span className="icon is-small">
                <i className="fas fa-ellipsis-h" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu2" role="menu">
            <div className="dropdown-content">
              <div className="dropdown-item">
                <button className="button is-fullwidth" onClick={onEditToggle}>
                  <span>Editar</span>
                  <span className="icon">
                    <i className="fas fa-edit" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <hr className="dropdown-divider" />
              <div className="dropdown-item has-text-right">
                <button className="button is-fullwidth" onClick={onToggleConfirmDeleteModal}>
                  <span>Remover</span>
                  <span className="icon">
                    <i className="fas fa-trash-alt" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="message-body">
        <div className="ballot-sections">
          <div className="columns">
            <div className="column is-12">
              <div className="block">
                <div className="field">
                  <label className="label">Título</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input input-first"
                      data-type="title"
                      onChange={onSetSection}
                      value={section.title}  
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="columns">
            <div className="column is-12">
              <div className="block">
                <div className="field">
                  <label className="label">Descripción</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      data-type="description"
                      onChange={onSetSection}
                      value={section.description}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="columns">
            <div className="column is-12">
              <label className="label">Opciones</label>
              {section.options && section.options.length > 1 && <div className="block">
                <div className="control">
                <div className="select">
                  <select
                    onChange={onLimitChange}
                    value={section.limit}
                    data-type="limit"
                  >
                    {section.options.map((x, i) => <option key={i} value={i}>{getLimitWord(i)}</option>)}
                  </select>
                </div>
                </div>
              </div>}
              <table className="table">
                <tbody>
                  {section.options && section.options.map((option, j) => (
                    <tr key={j}>
                      <td>
                        <div className="field is-grouped">
                          <div className="control is-expanded">
                            <input
                              type="text"
                              className="input"
                              placeholder="Nombre"
                              onChange={e => onOptionChange(e.currentTarget.value, j)}
                              value={option.title}
                            />
                          </div>
                          {<div className="control">
                            <button className="button is-danger is-light" onClick={() => onOptionDelete(j)}>Remover opción</button>
                          </div>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="block is-flex is-justify-content-flex-end">
                  <tr>
                    <th>
                      <button className="button is-warning" onClick={onOptionAdd}>Añadir opción</button>
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        {isEditing && <div className="message-footer block columns">
          <div className="column is-6">
            <button className="button is-fullwidth is-warning is-light is-outlined" onClick={onCancel}>Cancelar</button>
          </div>
          <div className="column is-6">
            <button className="button is-fullwidth is-primary is-light is-outlined" onClick={onSaveVote}>Guardar Votación</button>
          </div>
        </div>}
      </div>
    </div>

    <div className={`modal${isConfirmDeleteActive ? ' is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Espera</p>
          <button className="delete" aria-label="close" onClick={onToggleConfirmDeleteModal}></button>
        </header>
        <section className="modal-card-body">
          <div className="columns">
            <p>¿Estás seguro que deseas remover <strong>{`Votación: ${section.title ? section.title : index + 1}`}</strong>?</p>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={() => onVoteDelete(index)}>Remover</button>
          <button className="button" onClick={onToggleConfirmDeleteModal}>Cancelar</button>
        </footer>
      </div>
    </div>
  </>
}

export default VoteSection;