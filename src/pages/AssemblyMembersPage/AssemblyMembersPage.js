import { useRef, useEffect } from "react";
import { useAssembly } from "../../hooks/useAssembly";
import { useMember } from "../../hooks/useMember";
import { useParams } from "react-router";

import { Link } from "react-router-dom";

const AssemblyMembersPage = () => {
  const assemblyHook = useAssembly();
  const memberHook = useMember();
  const params = useParams();

  let currentAssembly = useRef(assemblyHook.get(params.id));

  useEffect(() => {
    currentAssembly.current = assemblyHook.get(params.id);
  }, [ assemblyHook, params.id ])

  return <div className="container">
    <div className="columns">
      <div className="column is-12">
        <h1>Lista de miembors para <strong>{currentAssembly.current.title}</strong></h1>
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
                <tr>
                  <td>{member.name}</td>
                  <td>
                    <Link to={`/votacion/${currentAssembly.current.id}/${member.id}`}>
                      {`${window.location.protocol}://${window.location.host}/${`votacion/${currentAssembly.current.id}/${member.id}`}`}
                    </Link>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      </div>
  </div>
}

export default AssemblyMembersPage;