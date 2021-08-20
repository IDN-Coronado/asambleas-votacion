import { useState } from 'react';
import { useHistory } from "react-router-dom";

import { useAuth } from '../../hooks/useAuth';
import { useAssembly } from '../../hooks/useAssembly';

import AssemblyTile from '../../components/AssemblyTile/AssemblyTile';

import './AssembliesPage.css';

const AssembliesPage = () => {
  const auth = useAuth();
  const assembly = useAssembly();
  const history = useHistory();

  const [ isCreateModalActive, setIsCreateModalActive ] = useState(false);
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ initialDate, setInitialDate ] = useState('');
  const [ endDate, setEndDate ] = useState('');

  const onToggleCreateModal = () =>
    setIsCreateModalActive(!isCreateModalActive);

  const onCreateAssembly = () => {
    assembly.create({
      title,
      description,
      church: auth.user.church,
      initialDate,
      endDate,
    })
      .then(assembly => {
        history.push(`/asambleas/${assembly.id}`)
      })
  }

  const onDeleteAssembly = id => {
    assembly.remove(id)
  }

  const onTitleChange = e => {
    const _title = e.currentTarget.value;
    setTitle(_title);
  }

  const onDescriptionChange = e => {
    const _description = e.currentTarget.value;
    setDescription(_description);
  }

  const onInitialDateChange = e => {
    const _initialDate = e.currentTarget.value;
    setInitialDate(_initialDate);
  }

  const onEndDateChange = e => {
    const _endDate = e.currentTarget.value;
    setEndDate(_endDate);
  }

  const renderTiles = () => (
    assembly.assemblies.map(as => (
      <AssemblyTile
        { ...as }
        key={as.id}
        onDeleteAssembly={onDeleteAssembly}
      />
    ))
  )

  return <div className="assemblies-page">
    <div className="container">
      <div className="block">
        <h1 className="title">Asambleas</h1>
        <p>Administra las asambleas de tu iglesia.</p>
      </div>
      <div className="tile is-vertical is-parent">
        <button className="button tile is-child is-primary has-text-left" onClick={onToggleCreateModal}>
          <p className="title is-6 has-text-light">
          <span>Nueva Asamblea</span>
          <span className="icon"><i className="fas fa-plus-square"/></span></p>
        </button>
        {renderTiles()}
      </div>
    </div>
    <div className={`modal${isCreateModalActive ? ' is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Modal title</p>
          <button className="delete" aria-label="close" onClick={onToggleCreateModal}></button>
        </header>
        <section className="modal-card-body">
          <div className="columns">
            <div className="column is-half">
              <div className="block">
                <div className="field">
                  <label className="label">Título</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="Título"
                      value={title}
                      onChange={onTitleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="block">
                <div className="field">
                  <label className="label">Descripción</label>
                  <div className="control">
                    <textarea
                      rows="5"
                      className="textarea"
                      placeholder="Descripción"
                      value={description}
                      onChange={onDescriptionChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="block">
                <div className="field">
                  <label className="label">Fecha Inicial</label>
                  <div className="control">
                    <input
                      className="input"
                      type="datetime-local"
                      placeholder="Fecha Inicial"
                      value={initialDate}
                      onChange={onInitialDateChange}
                    />
                  </div>
                </div>
              </div>
              <div className="block">
                <div className="field">
                  <label className="label">Fecha Final</label>
                  <div className="control">
                    <input
                      className="input"
                      type="datetime-local"
                      placeholder="Fecha Final"
                      value={endDate}
                      onChange={onEndDateChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={onCreateAssembly}>Crear Asamblea</button>
          <button className="button" onClick={onToggleCreateModal}>Cancelar</button>
        </footer>
      </div>
    </div>
  </div>;
}

export default AssembliesPage;