import { useState } from 'react';
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";

import { useAssembly } from '../../hooks/useAssembly';
import dayjs from '../../lib/dayjs';

import AssemblyTile from '../../components/AssemblyTile/AssemblyTile';
import Spinner from '../../components/Spinner/Spinner';

import './AssembliesPage.css';

const AssembliesPage = () => {
  const assembly = useAssembly();
  const history = useHistory();

  const [ isCreateModalActive, setIsCreateModalActive ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ initialDate, setInitialDate ] = useState(new firebase.firestore.Timestamp.fromDate(new Date()));
  const [ endDate, setEndDate ] = useState(new firebase.firestore.Timestamp.fromDate(new Date()));

  const onToggleCreateModal = () =>
    setIsCreateModalActive(!isCreateModalActive);

  const onCreateAssembly = () => {
    onToggleCreateModal();
    setIsLoading(true);
    assembly.create({
      title,
      description,
      initialDate,
      endDate,
    })
      .then(({ id }) => {
        setIsLoading(false);
        history.push(`/asambleas/${id}`)
      })
  }

  const onDeleteAssembly = id => {
    setIsLoading(true);
    assembly.remove(id)
      .then(() => {
        setIsLoading(false);
      })
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
    const date = new Date(_initialDate);
    const timestamp = new firebase.firestore.Timestamp.fromDate(date);
    setInitialDate(timestamp);
  }

  const onEndDateChange = e => {
    const _endDate = e.currentTarget.value;
    const date = new Date(_endDate);
    const timestamp = new firebase.firestore.Timestamp.fromDate(date);
    setEndDate(timestamp);
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

  const startDate = initialDate.toDate();
  const finalDate = endDate.toDate();
  const startTime = dayjs(startDate).format('YYYY-MM-DDTHH:mm');
  const endTime = dayjs(finalDate).format('YYYY-MM-DDTHH:mm');

  return <>
    {isLoading && <Spinner screen />}
    <div className="assemblies-page">
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
                    <label className="label">T??tulo</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="T??tulo"
                        value={title}
                        onChange={onTitleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="block">
                  <div className="field">
                    <label className="label">Descripci??n</label>
                    <div className="control">
                      <textarea
                        rows="5"
                        className="textarea"
                        placeholder="Descripci??n"
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
                        value={startTime}
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
                        value={endTime}
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
    </div>
  </>
}

export default AssembliesPage;