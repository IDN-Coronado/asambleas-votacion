import { useState } from "react";
import firebase from "firebase/app";

import { Link } from 'react-router-dom';

import dayjs from '../../lib/dayjs';

const AssemblyInfo = ({ id, title, description, initialDate, endDate, onSaveInfo }) => {
  const [ isEditInfo, setIsEditInfo ] = useState(false);
  const [ info, setInfo ] = useState({title, description, initialDate, endDate});
  
  const onInfoEditToggle = () =>
    setIsEditInfo(!isEditInfo);

  const onInfoChange = e => {
    const el = e.currentTarget;
    const type = el.dataset.type;
    setInfo({
      ...info,
      [type]: el.value,
    })
  }

  const onDateChange = e => {
    const el = e.currentTarget;
    const type = el.dataset.type;
    const date = new Date(el.value);
    const timestamp = new firebase.firestore.Timestamp.fromDate(date);
    setInfo({
      ...info,
      [type]: timestamp,
    })
  }

  const onInfoSave = () => {
    onInfoEditToggle();
    onSaveInfo(info);
  };

  const onInfoCancel = () => {
    onInfoEditToggle();
    setInfo({title, description, initialDate, endDate, onSaveInfo});
  };

  const startDate = info.initialDate.toDate();
  const finalDate = info.endDate.toDate();
  const startTime = dayjs(startDate).format('YYYY-MM-DDTHH:mm');
  const formatedStartTime = dayjs(startDate).format('D MMMM YYYY, h:mmA');
  const endTime = dayjs(finalDate).format('YYYY-MM-DDTHH:mm');
  const formatedEndTime = dayjs(finalDate).format('D MMMM YYYY, h:mmA');
  return <>
  <div className="message">
    <header className="message-header assemblies-info-header">
      <h1>Información de Asamblea</h1>
      <div>
        {!isEditInfo && <button className="button is-light icon-text has-text-info edit-button" onClick={onInfoEditToggle}>
          <span className="has-text-dark">Editar</span>
          <span className="icon has-text-dark"><i className="fas fa-pen"></i></span>
        </button>}
        <Link className="button is-light icon-text has-text-info assembly-members-button" to={`/resultados/${id}`}>
          <span className="has-text-dark">Resultados</span>
          <span className="icon has-text-dark"><i className="fas fa-poll"></i></span>
        </Link>
        <Link className="button is-light icon-text has-text-info assembly-members-button" to={`/asambleas/${id}/miembros`}>
          <span className="has-text-dark">Ver lista de miembros</span>
          <span className="icon has-text-dark"><i className="fas fa-users"></i></span>
        </Link>
      </div>
    </header>
    <div className="block message-body">
      <div className="block assemblies-title assemblies-block">
        <div className="columns is-flex-direction-column">
          <div className="column is-12">
            {!isEditInfo && <div className="field is-grouped is-flex">
              <h1 className="title is-4 assemblies-label">{title}</h1>
            </div>}
            {isEditInfo && <div className="block">
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <label>Título</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Título"
                    data-type="title"
                    value={info.title}
                    onChange={onInfoChange}
                  />
                </div>
              </div>
            </div>}
          </div>
          <div className="column is-12">
            {!isEditInfo && <div className="field is-flex">
              <p className="description assemblies-label">{description}</p>
            </div>}
            {isEditInfo && <div className="block">
              <div className="field">
                <div className="control block">
                  <label>Descripción</label>
                  <textarea
                    className="textarea"
                    placeholder="Descripción"
                    data-type="description"
                    value={info.description}
                    onChange={onInfoChange}
                  />
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>
      <div className="block assemblies-dates assemblies-block">
        <div className="columns">
          <div className="column is-6">
            {!isEditInfo && <div className="field">
              <p className="label">Fecha y hora inicial</p>
              <p className="date assemblies-label">{formatedStartTime}</p>
            </div>}
            {isEditInfo && <div className="block">
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <label>Fecha Inicial</label>
                  <input
                    className="input"
                    type="datetime-local"
                    placeholder="Fecha Inicial"
                    data-type="initialDate"
                    value={startTime}
                    onChange={onDateChange}
                  />
                </div>
              </div>
            </div>}
          </div>
          <div className="column is-6">
            {!isEditInfo && <div className="field">
              <p className="label">Fecha y hora final</p>
              <p className="date assemblies-label">{formatedEndTime}</p>
            </div>}
            {isEditInfo && <div className="block">
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <label>Fecha Final</label>
                  <input
                    className="input"
                    type="datetime-local"
                    placeholder="Fecha Final"
                    data-type="endDate"
                    value={endTime}
                    onChange={onDateChange}
                  />
                </div>
              </div>
            </div>}
          </div>
        </div>
        {isEditInfo && <div className="columns">
          <div className="column is-2">
            <div className="control">
              <button className="button is-primary is-fullwidth" onClick={onInfoSave}>
                <span>Guardar</span>
              </button>
            </div>
          </div>
          <div className="column is-2">
            <button className="button is-danger is-fullwidth" onClick={onInfoCancel}>
              <span>Cancelar</span>
            </button>
          </div>
        </div>}
      </div>
    </div>
  </div>
  </>
};

export default AssemblyInfo;