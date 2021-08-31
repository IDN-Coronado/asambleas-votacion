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

  const getVotedStatus = memberId => assembly.votes.includes(memberId);

  const goBack = () =>
    history.goBack();

  const getMemberVotingUrl = member => {
    const localUrl = `${window.location.protocol}://${window.location.host}/${`votacion/${assembly.id}/${member.id}`}`;
    return member.urls ? member.urls[assembly.id] : localUrl;
      
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
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Link de votación</th>
              <th>Voto</th>
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
                  <td>{getVotedStatus(member.id) ? 
                    <span className="icon has-text-success">
                      <i className="fa fa-check-circle"></i>
                    </span> :
                    <span className="icon has-text-danger">
                      <i className="fa fa-times-circle"></i>
                    </span>
                  }</td>
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