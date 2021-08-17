import { useState, useEffect } from "react"

const optionTemplate = {
  title: '',
  description: '',
  percentage: 0,
  options: [{
    title: ""
  }]
}

const Ballot = ({ isActive }) => {
  const [ percentage, setPercentage ] = useState('');
  const [ optionSections, setOptionSection ] = useState([optionTemplate]);

  const onCreateOptionSection = () => {
    setOptionSection([...optionSections, optionTemplate]);
  }

  const onOptionSectionDelete = i => {
    setOptionSection(optionSections.filter((o, k) => i !== k))
  }

  const onOptionAdd = sectionIndex => {
    const newSections = optionSections.map((section, i) => {
      if (i === sectionIndex) {
        section.options.push({ title: '' });
      }
      return section;
    })
    setOptionSection(newSections);
  }

  const onOptionDelete = (sectionIndex, optionIndex) => {
    const newSections = optionSections.map((section, i) => {
      const newSection = { ...section };
      if (i === sectionIndex) {
        newSection.options = section.options.filter((op, oi) => oi !== optionIndex)
      }
      return newSection;
    })
    setOptionSection(newSections);
  }

  const onSubmit = () => ({
    percentage,
    optionSections,
  });

  return <>
    <div className="panel">
      <header className="panel-heading">
        <p className="title is-6">Secciones</p>
      </header>
      <section className="modal-card-body">
        {!!optionSections.length && <div className="message">
          {optionSections.map((section, k) => (
            <div className="block">
              <div className="message-header">
                {section.title ? section.title : `Sección ${k + 1}`}
                <button className="delete" aria-label="delete" onClick={() => onOptionSectionDelete(k)}></button>
              </div>
              <div className={`message-body${section.isTemplate ? ' message-option' : ''}`}>
                <div className="ballot-sections">
                  <div className="columns">
                    <div className="column is-6">
                      <div className="block">
                        <div className="field">
                          <label className="label">Título</label>
                          <div className="control">
                            <input
                              type="text"
                              className="input input-first"
                              value={section.title}  
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="columns is-12">
                    <div className="column is-4">
                      <div className="block">
                        <div className="field">
                          <label className="label">Descripción</label>
                          <div className="control">
                            <textarea
                              className="textarea"
                              value={section.description}  
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column is-12">
                      <table className="table">
                        <tbody>
                          {section.options.map((option, j) => (
                            <tr>
                              <td>
                                <div className="field is-grouped">
                                  <div className="control is-expanded">
                                    <input
                                      type="text"
                                      className="input"
                                      placeholder="Nombre"
                                      value={option.title}
                                    />
                                  </div>
                                  {section.options.length === j + 1 ? <div className="control">
                                    <button className="button is-warning" onClick={() => onOptionAdd(k)}>Añadir opción</button>
                                  </div> : <div className="control">
                                    <button className="button is-danger is-light" onClick={() => onOptionDelete(k, j)}>Remover opción</button>
                                  </div>}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>}
        <div className="tile is-parent">
          <button className="button tile is-child is-primary has-text-left" onClick={onCreateOptionSection}>
            <p className="title is-6 has-text-light">
            <span>Crear sección</span>
            <span className="icon"><i className="fas fa-plus-square"/></span></p>
          </button>
        </div>
      </section>
      <footer className="modal-card-foot">
        <button className="button is-success" onClick={onSubmit}>Crear Opción</button>
      </footer>
    </div>
  </>
}

export default Ballot;
