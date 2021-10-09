import firebase from "firebase/app";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { useHistory } from "react-router-dom";

import { useAssembly } from "../../hooks/useAssembly";
import { useMember } from "../../hooks/useMember";

const AssemblyMembersPage = () => {
  const assemblyHook = useAssembly();
  const memberHook = useMember();
  const params = useParams();
  const history = useHistory();

  const [ assembly, setAssembly ] = useState({});
  const [ waMessage, setWaMessage ] = useState(`Hola *{nombre}*! Ya es hora de elegir, sigue este link para realizar tu voto: {link}.`);

  const getVotedStatus = memberId => assembly.votes.includes(memberId);

  const goBack = () =>
    history.goBack();

  const getMemberVotingUrl = member => {
    const localUrl = `${window.location.protocol}//${window.location.host}/${`votacion/${assembly.id}/${member.id}`}`;
    return member.urls ? member.urls[assembly.id] ? member.urls[assembly.id] : localUrl : localUrl;
  }

  const generateMessage = (message, member) => {
    let newMessage = message.replace('{nombre}', member.name.trim());
    newMessage = newMessage.replace('{link}', member.urls[assembly.id])
    return newMessage;
  }

  const sendMessage = member => {
    const sendSMSMessage = firebase.functions().httpsCallable('sendSMSMessage');
    sendSMSMessage({
      assemblyId: assembly.id,
      memberId: member.id,
      message: generateMessage(waMessage, member)
    })
  }

  const handleMessageChange = e => {
    setWaMessage(e.currentTarget.value);
  }

  useEffect(() => {
    setAssembly(assemblyHook.get(params.id));
  }, [ assemblyHook, params.id ])

  return assembly.id ? <div className="container assemly-members-page">
    <div className="columns">
      <div className="column is-12">
        <div className="block is-flex is-justify-content-space-between">
          <h1 className="title is-5">Lista de miembros para {assembly.title}</h1>
          <button className="button is-info" onClick={goBack}>
            <span className="icon">
              <i className="fa fa-arrow-alt-circle-left"></i>
            </span>
            <span>Volver a la asamblea</span>
          </button>
        </div>
      </div>
    </div>
    <div className="columns">
      <div className="column">
      <div className="field">
        <label className="label">Mensaje de whatsapp</label>
        <div className="control">
          <input className="input" value={waMessage} type="text" onChange={handleMessageChange} />
        </div>
        <p className="help">{`Use {nombre} para el nombre de la persona y {link} para el link de la asamblea.`}</p>
      </div>
      </div>
    </div>
    <div className="columns">
      <div className="column table-container">
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th className="has-text-centered">Nombre</th>
              <th className="has-text-centered">Link de votación</th>
              <th className="has-text-centered">Voto</th>
              <th className="has-text-centered">Enviar Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {
              memberHook.members.map(member => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>
                    <a href={getMemberVotingUrl(member)} target="_blank" rel="noreferrer">
                      {getMemberVotingUrl(member)}
                    </a>
                  </td>
                  <td className="has-text-centered">{getVotedStatus(member.id) ? 
                    <span className="icon has-text-success">
                      <i className="fa fa-check-circle"></i>
                    </span> :
                    <span className="icon has-text-danger">
                      <i className="fa fa-times-circle"></i>
                    </span>
                  }</td>
                  <td className="has-text-centered">
                    <a
                      className="button is-success"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://wa.me/${member.phone}?text=${generateMessage(waMessage, member)}`}
                    >
                      <span className="icon is-small">
                        <i className="fa fa-whatsapp"></i>
                      </span>
                      <span>Save</span>
                    </a>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      </div>
  </div> : <div className="spinner" />
}

export default AssemblyMembersPage;