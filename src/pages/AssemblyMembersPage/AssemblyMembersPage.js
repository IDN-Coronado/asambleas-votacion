import { useState, useEffect } from "react";
import { useAssembly } from "../../hooks/useAssembly";
import { useMember } from "../../hooks/useMember";
import { useParams } from "react-router";

import { Link } from "react-router-dom";

const AssemblyMembersPage = () => {
  const assemblyHook = useAssembly();
  const memberHook = useMember();
  const params = useParams();

  const [ assembly, setAssembly ] = useState({})

  useEffect(() => {
    setAssembly(assemblyHook.get(params.id));
  }, [ assemblyHook, params.id ])

  return assembly ? <div className="container assemly-members-page">
    <div className="columns">
      <div className="column is-12">
        <div className="block is-flex is-justify-content-space-between">
          <h1 className="title is-5">Lista de miembors para {assembly.title}</h1>
          <Link className="button is-info" to={`/asambleas/${assembly.id}`}>
            <span class="icon">
              <i class="fa fa-arrow-alt-circle-left"></i>
            </span>
            <span>Volver a la asamblea</span>
          </Link>
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
            </tr>
          </thead>
          <tbody>
            {
              memberHook.members.map(member => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>
                    <Link to={`/votacion/${assembly.id}/${member.id}`}>
                      {`${window.location.protocol}://${window.location.host}/${`votacion/${assembly.id}/${member.id}`}`}
                    </Link>
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