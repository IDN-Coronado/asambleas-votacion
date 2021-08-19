import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";

import { useAssembly } from "../../hooks/useAssembly";

import VoteSection from "../../components/VoteSection/VoteSection";
import AssemblyInfo from "../../components/AssemblyInfo/AssemblyInfo";

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
  const [ sections, setSections ] = useState(currentAssembly.current.sections);

  const setStates = () => {
    setTitle(currentAssembly.current.title);
    setDescription(currentAssembly.current.description);
    setInitialDate(currentAssembly.current.initialDate);
    setEndDate(currentAssembly.current.endDate);
    setSections(currentAssembly.current.sections);
  }

  const onCreateOptionSection = () =>
    setSections(sections.concat({}));

  const onSectionDelete = i =>
    setSections(sections.filter((o, k) => i !== k))

  const onSectionSave = (index, section) =>
    setSections([ ...sections ].splice(index, 1, section));

  const onInfoSave = (info) => {
    setTitle(info.title);
    setDescription(info.description);
    setInitialDate(info.initialDate);
    setEndDate(info.endDate);
  }

  useEffect(() => {
    currentAssembly.current = assembly.get(params.id);
    setStates()
  }, [ assembly, params.id ])

  return <>
    {currentAssembly && <div className="assemblies-page assemblies-detail">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            {title && !!title.length && <AssemblyInfo 
              onSaveInfo={onInfoSave}
              title={title}
              description={description}
              initialDate={initialDate}
              endDate={endDate}
              />
            }
            <div className="block box assemblies-sections assemblies-block">
              <div className="panel">
                <header className="panel-heading">
                  <p className="title is-6">Cédula de votación</p>
                </header>
                <section className="modal-card-body">
                  {sections && !!sections.length && <div className="message">
                    {sections.map((section, k) => <VoteSection
                      key={k}
                      index={k}
                      onVoteSave={onSectionSave}
                      onVoteDelete={onSectionDelete}
                      {...section}
                    />)}
                  </div>}
                  <div className="tile is-parent">
                    <button className="button tile is-child has-text-left is-light is-info" onClick={onCreateOptionSection}>
                      <p className="title is-6">
                      <span>Crear sección</span>
                      <span className="icon"><i className="fas fa-plus-square"/></span></p>
                    </button>
                  </div>
                </section>
                <div className="panel-block">
                  <button className="button is-fullwidth is-primary">Guardar nómina</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>}
  </>
}

export default AssemblyDetailPage;