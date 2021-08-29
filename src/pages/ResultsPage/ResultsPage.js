import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { useAssembly } from "../../hooks/useAssembly";
import { useMember } from "../../hooks/useMember";
import { useVotes } from "../../hooks/useVotes";

import './ResultsPage.css';

const ResultsPage = () => {
  const assemblyHook = useAssembly();
  const memberHook = useMember();
  const votesHook = useVotes();
  const params = useParams();

  const [ assembly, setAssembly ] = useState({})

  useEffect(() => {
    setAssembly(assemblyHook.get(params.assemblyId));
  }, [ assemblyHook, params.assemblyId ])

  return assembly.id ? <div className="results-page container">
    <div className="columns">
      <div className="column">
        <div className="block is-flex is-justify-content-space-between">
          <div>
            <h1 className="title is-5">{assembly.title}</h1>
            <p className="subtitle is-6">{assembly.description}</p>
          </div>
          <Link className="button is-info" to={`/asambleas/${assembly.id}`}>
            <span class="icon">
              <i class="fa fa-arrow-alt-circle-left"></i>
            </span>
            <span>Volver a la asamblea</span>
          </Link>
        </div>
        <div className="block general-info">
          <div className="level">
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Total del miembros en padrón</p>
                <p className="title">{memberHook.members.length}</p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Total de votos realizados</p>
                <p className="title">{votesHook.votes.length}</p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Porcentaje de votos realizados</p>
                <p className="title">{votesHook.votes.length / memberHook.members.length * 100}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="columns">
      <div className="column">
        <div className="block">
          {assembly.sections.map(section => (
            <div className="message" key={section.id}>
              <div className="message-header">
                <p>{section.title}{section.options.length === 1 ? `: ${section.options[0].title}` : ''}</p>
              </div>
              <div className="message-body">
                {section.options.length > 1
                  ? <div>
                      <div className="level">
                        {section.options.map(option => (
                          <div className="level-item has-text-centered">
                            <div>
                              <p className="heading">{option.title}</p>
                              <p className="title is-5">{option.votes.length}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>
                  : <div>
                      <div className="level">
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">Sí</p>
                            <p className="title is-5">{section.options[0].votes.length}</p>
                          </div>
                        </div>
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">No</p>
                            <p className="title is-5">{votesHook.votes.length - section.options[0].votes.length}</p>
                          </div>
                        </div>
                      </div>
                  </div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div> : null
}

export default ResultsPage;