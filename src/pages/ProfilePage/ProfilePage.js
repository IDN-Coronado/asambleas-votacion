import { useState, useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";
import { getCollection } from '../../lib/firestore';

import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditInfo, setIsEditInfo] = useState(false);
  const [info, setInfo] = useState({ displayName: user.displayName, email: user.email, church: user.church });
	const [churches, setChurches] = useState([]);

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

  const onInfoSave = () => {
    onInfoEditToggle();
    // onSaveInfo(info);
  };

  const onInfoCancel = () => {
    onInfoEditToggle();
    setInfo({ displayName: user.displayName, email: user.email, church: user.church });
  };

	useEffect(() => {
		getCollection('churches')
			.then(data => {
				setChurches(data);
			})
	}, [])

  const currentChurch = churches.filter(c => c.id === user.church).shift();

  return <div className="container profile-page">
    <div className="columns">
      <div className="column is-10 is-offset-1">
        <div className="message">
          <header className="message-header">
            <h1>Perfil</h1>
            {!isEditInfo && <button className="button is-light icon-text has-text-info edit-button" onClick={onInfoEditToggle}>
              <span className="has-text-dark">Editar</span>
              <span className="icon has-text-dark"><i className="fas fa-pen"></i></span>
            </button>}
          </header>
          <div className="block message-body">
            <div className="block">
              {!isEditInfo && 
                <h2 className="title is-5 assemblies-label">{info.displayName}</h2>
              }
              {isEditInfo && <div className="block">
                <div className="field is-grouped">
                  <div className="control is-expanded">
                    <label>Nombre</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Nombre"
                      data-type="displayName"
                      value={info.displayName}
                      onChange={onInfoChange}
                    />
                  </div>
                </div>
              </div>}
            </div>
            <div className="block">
              {!isEditInfo && <p>{info.email}</p>}
            </div>
            <div className="block">
              {!isEditInfo && currentChurch && <p>{currentChurch.name}</p>}
              {isEditInfo && !currentChurch && <div className="block">
                <div className="field">
                  <label className="label">Iglesia</label>
                  <div className="control has-icons-left">
                    <div className={`select${currentChurch === 'no-church' ? ' is-danger' : ''}`}>
                      <select onChange={onInfoChange} data-type="church">
                        <option value="no-church">Seleccione iglesia</option>
                        {churches && churches.map(church => (
                          <option key={church.id} value={church.id}>{church.name}</option>
                        ))}
                      </select>
                    </div>
                    <span className="icon is-left">
                      <i className="fas fa-globe"></i>
                    </span>
                  </div>
                </div>
              </div>}
            </div>
            <div className="block">
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
      </div>
    </div>
  </div>
}

export default ProfilePage;