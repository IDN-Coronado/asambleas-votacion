import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { useMember } from "../../hooks/useMember";

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

  const onInfoChange = e => {
    const el = e.currentTarget;
    const type = el.dataset.type;
    setMemberData({ ...memberData, [type]: e.type === 'birthday' ? el.valueAsDate : el.value });
  }

  const onMemberSave = () => {
    if (!memberData.name) return;
    memberHook.create({ ...memberData, church: auth.user.church })
      .then(() => setMemberData(memberTemplate))
  }

  return <div className="members-page">
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
                </tr>
              </thead>
              <tbody>
                {memberHook.members.map(member => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.phone || '---'}</td>
                    <td>{member.email || '---'}</td>
                    <td>{member.birthday || '---'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default MembersPage;