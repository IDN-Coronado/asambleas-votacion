import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

import { useAssembly } from "../../hooks/useAssembly";

import Ballot from "../../components/Ballot/Ballot";

const AssemblyDetailPage = () => {
  const assembly = useAssembly();
  const params = useParams();
  let currentAssembly = useRef(assembly.get(params.id));
  
  const [ isEditTitle, setIsEditTitle ] = useState(false);
  const [ isEditDescription, setIsEditDescription ] = useState(false);
  const [ isEditDates, setIsEditDates ] = useState(false);
  const [ title, setTitle ] = useState(currentAssembly.current.title);
  const [ description, setDescription ] = useState(currentAssembly.current.description);
  const [ initialDate, setInitialDate ] = useState(currentAssembly.current.initialDate);
  const [ endDate, setEndDate ] = useState(currentAssembly.current.initialDate);

  const setStates = () => {
    setTitle(currentAssembly.current.title);
    setDescription(currentAssembly.current.description);
    setInitialDate(currentAssembly.current.initialDate);
    setEndDate(currentAssembly.current.endDate);
  }

  const onTitleEditToggle = () =>
    setIsEditTitle(!isEditTitle);

  const onDescriptionEditToggle = () =>
    setIsEditDescription(!isEditDescription);

  const onDatesEditToggle = () =>
    setIsEditDates(!isEditDates);

  const onTitleChange = e =>
    setTitle(e.currentTarget.value);

  const onDescriptionChange = e =>
    setDescription(e.currentTarget.value);

  const onInitialDateChange = e =>
    setInitialDate(e.currentTarget.value);

  const onEndDateChange = e =>
    setEndDate(e.currentTarget.value);

  useEffect(() => {
    currentAssembly.current = assembly.get(params.id);
    setStates()
  }, [ assembly, params.id ])

  return <>
    {currentAssembly && <div className="assemblies-page assemblies-detail">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="block box assemblies-title assemblies-block">
              {!isEditTitle && <h1 className="field is-grouped">
                <span className="title is-4 assemblies-label">{title}</span>
                <button className="button is-outlined icon-text has-text-info edit-button" onClick={onTitleEditToggle}>
                  <span className="has-text-dark">Editar</span>
                  <span className="icon has-text-dark"><i className="fas fa-pen"></i></span>
                </button>
              </h1>}
              {isEditTitle && <div className="block">
                <div className="field is-grouped">
                  <div className="control is-expanded">
                    <input
                      className="input"
                      type="text"
                      placeholder="Título"
                      value={title}
                      onChange={onTitleChange}
                    />
                  </div>
                  <div className="control">
                    <button className="button is-primary" onClick={onTitleEditToggle}>
                      <span>Correcto</span>
                    </button>
                  </div>
                </div>
              </div>}
            </div>
            <div className="block box assemblies-description assemblies-block">
              {!isEditDescription && <h1 className="field">
                <p className="description assemblies-label">{description}</p>
                <button className="button is-outline icon-text has-text-info edit-button" onClick={onDescriptionEditToggle}>
                  <span className="has-text-dark">Editar</span>
                  <span className="icon has-text-dark"><i className="fas fa-pen"></i></span>
                </button>
              </h1>}
              {isEditDescription && <div className="block">
                <div className="field">
                  <div className="control block">
                    <textarea
                      className="textarea"
                      placeholder="Descripción"
                      value={description}
                      onChange={onDescriptionChange}
                    />
                  </div>
                  <div className="control">
                    <button className="button is-primary" onClick={onDescriptionEditToggle}>
                      <span>Correcto</span>
                    </button>
                  </div>
                </div>
              </div>}
            </div>
            <div className="block box assemblies-dates assemblies-block">
              <div className="columns">
                <div className="column is-6">
                  {!isEditDates && <div className="field">
                    <p className="label">Fecha y hora inicial</p>
                    <p className="date assemblies-label">{initialDate}</p>
                  </div>}
                  {isEditDates && <div className="block">
                    <div className="field is-grouped">
                      <div className="control is-expanded">
                        <input
                          className="input"
                          type="datetime-local"
                          placeholder="Fecha Inicial"
                          value={initialDate}
                          onChange={onInitialDateChange}
                        />
                      </div>
                    </div>
                  </div>}
                </div>
                <div className="column is-6">
                  {!isEditDates && <div className="field">
                    <p className="label">Fecha y hora final</p>
                    <p className="date assemblies-label">{endDate}</p>
                  </div>}
                  {isEditDates && <div className="block">
                    <div className="field is-grouped">
                      <div className="control is-expanded">
                        <input
                          className="input"
                          type="datetime-local"
                          placeholder="Fecha Final"
                          value={endDate}
                          onChange={onEndDateChange}
                        />
                      </div>
                    </div>
                  </div>}
                </div>
              </div>
              <div className="columns">
                <div className="column is-12">
                  {!isEditDates && <button className="button is-outline icon-text has-text-info edit-button" onClick={onDatesEditToggle}>
                    <span className="has-text-dark">Editar</span>
                    <span className="icon has-text-dark"><i className="fas fa-pen"></i></span>
                  </button>}
                  {isEditDates && <div className="control">
                    <button className="button is-primary" onClick={onDatesEditToggle}>
                      <span>Correcto</span>
                    </button>
                  </div>}
                </div>
              </div>
            </div>
            <div className="block box assemblies-sections assemblies-block">
              <Ballot />
            </div>
          </div>
        </div>
      </div>
    </div>}
  </>
}

export default AssemblyDetailPage;