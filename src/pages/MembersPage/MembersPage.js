import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { useMember } from "../../hooks/useMember";

import Spinner from "../../components/Spinner/Spinner";

import './MembersPage.css';

const memberTemplate = {
  name: '',
  email: '',
  phone: '',
  birthday: ''
}

const MembersPage = () => {
  const memberHook = useMember();
  const auth = useAuth();

  const [memberData, setMemberData] = useState(memberTemplate);
  const [memberModalData, setMemberModalData] = useState(memberTemplate);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalActive, setIsUpdateModalActive] = useState(false);

  const onInfoChange = e => {
    const el = e.currentTarget;
    const type = el.dataset.type;
    setMemberData({ ...memberData, [type]: e.type === 'birthday' ? el.valueAsDate : el.value });
  }

  const onMemberSave = () => {
    if (!memberData.name) return;
    setIsLoading(true)
    memberHook.create({ ...memberData, church: auth.user.church })
      .then(() => {
        setMemberData(memberTemplate);
        setIsLoading(false);
      })
  }

  const onMemberDelete = id =>
    memberHook.remove(id)

  const onToggleModal = id => {
    const isModalOpen = !isUpdateModalActive;
    setIsUpdateModalActive(isModalOpen)
    if (isModalOpen) {
      const currentMemberData = memberHook.get(id);
      setMemberModalData({ ...currentMemberData })
    }
  }

  const onModalValueChange = e => {
    const el = e.currentTarget;
    setMemberModalData({
      ...memberModalData,
      [el.dataset.type]: el.value
    })
  }

  const onSaveMember = () => {
    setIsLoading(true);
    memberHook.update(memberModalData)
      .then(() => {
        setIsLoading(false)
        onToggleModal();
      })
  }

  return <>
    {isLoading && <Spinner screen />}
    <div className="members-page">
      <div className="container">
        <h2 className="title">Agregar nuevo miembro</h2>
        <div className="columns">
          <div className="column is-6">
            <div className="block">
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <label>Nombre<sup>*</sup></label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Miembro"
                    data-type="name"
                    value={memberData.name}
                    onChange={onInfoChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="column is-6">
            <div className="block">
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <label>Email</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    data-type="email"
                    value={memberData.email}
                    onChange={onInfoChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-6">
            <div className="block">
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <label>Teléfono</label>
                  <input
                    className="input"
                    type="phone"
                    placeholder="Teléfono"
                    data-type="phone"
                    value={memberData.phone}
                    onChange={onInfoChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="column is-6">
            <div className="block">
              <div className="field is-grouped">
                <div className="control is-expanded">
                  <label>Fecha de nacimiento</label>
                  <input
                    className="input"
                    type="date"
                    placeholder="Fecha de nacimiento"
                    data-type="birthday"
                    value={memberData.birthday}
                    onChange={onInfoChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-12">
            <div className="control is-flex is-flex-direction-row-reverse">
              <button {...(!memberData.name ? {disabled: true} : {}) } className="button is-primary" onClick={onMemberSave}>
                <span>Crear miembro</span>
              </button>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-12">
            <div className="member-list">
              <h2 className="subtitle">Lista de miembros</h2>
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Fecha de nacimiento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {memberHook.members.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.phone || '---'}</td>
                      <td>{member.email || '---'}</td>
                      <td>{member.birthday || '---'}</td>
                      <td className="actions-column">
                        <button className="button is-small is-info" onClick={() => onToggleModal(member.id)}>
                          <span className="icon is-small">
                            <i className="fas fa-pen"></i>
                          </span>
                        </button>
                        <button className="button is-small is-danger" onClick={() => onMemberDelete(member.id)}>
                          <span className="icon is-small">
                            <i className="fas fa-trash"></i>
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>;
    <div className={`modal${isUpdateModalActive ? ' is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Actualizar datos de miembro</p>
          <button className="delete" aria-label="close" onClick={onToggleModal}></button>
        </header>
        <section className="modal-card-body">
          <div className="columns">
            <div className="column is-half">
              <div className="block">
                <div className="field">
                  <label className="label">Nombre</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="Título"
                      data-type="name"
                      value={memberModalData.name}
                      onChange={onModalValueChange}
                    />
                  </div>
                </div>
              </div>
              <div className="block">
                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      className="input"
                      type="email"
                      placeholder="Correo electrónico"
                      data-type="email"
                      value={memberModalData.email}
                      onChange={onModalValueChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <div className="block">
                <div className="field">
                  <label className="label">Teléfono</label>
                  <div className="control">
                    <input
                      className="input"
                      type="phone"
                      placeholder="Teléfono"
                      data-type="phone"
                      value={memberModalData.phone}
                      onChange={onModalValueChange}
                    />
                  </div>
                </div>
              </div>
              <div className="block">
                <div className="field">
                  <label className="label">Fecha de nacimiento</label>
                  <div className="control">
                    <input
                      className="input"
                      type="date"
                      placeholder="Fecha de nacimiento"
                      data-type="birthday"
                      value={memberModalData.birthday}
                      onChange={onModalValueChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={onSaveMember}>Actualizar Miembro</button>
          <button className="button" onClick={onToggleModal}>Cancelar</button>
        </footer>
      </div>
    </div>
  </>
}

export default MembersPage;