import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import { useAssembly } from "../../hooks/useAssembly";
import { useMember } from "../../hooks/useMember";

import './ResultsPage.css';

const round = num =>
  Math.round((num + Number.EPSILON) * 100) / 100

const ResultsPage = () => {
  const assemblyHook = useAssembly();
  const memberHook = useMember();
  const params = useParams();
  const history = useHistory();

  const [ assembly, setAssembly ] = useState({});

  const goBack = () =>
    history.goBack();

  useEffect(() => {
    setAssembly(assemblyHook.get(params.assemblyId));
  }, [ assemblyHook, params.assemblyId ])

  return assembly.id ? <div className="results-page container">
    <div className="is-flex is-justify-content-end mb-5">
      <button className="button is-info" onClick={goBack}>
        <span className="icon">
          <i className="fa fa-arrow-alt-circle-left"></i>
        </span>
        <span>Volver a la asamblea</span>
      </button>
    </div>
    <div className="block is-flex is-justify-content-space-between">
      <div>
        <h1 className="title is-5">{assembly.title}</h1>
        <p className="subtitle is-6">{assembly.description}</p>
      </div>
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
            <p className="title">{assembly.votes.length}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Porcentaje de votos realizados</p>
            <p className="title">{round(assembly.votes.length / memberHook.members.length * 100)}%</p>
          </div>
        </div>
      </div>
    </div>
    <div className="columns">
      <div className="column">
        <div className="block">
          {assembly?.sections?.map(section => (
            <div className="message" key={section.id}>
              <div className="message-header">
                <p>{section.title}{section.options.length === 1 ? `: ${section.options[0].title}` : ''}</p>
              </div>
              <div className="message-body">
                {section.options.length > 1
                  ? <div>
                      <div className="level is-flex is-flex-wrap-wrap">
                        {section.options.map(option => (
                          <div className="results-section-option level-item has-text-centered mr-5 mb-5 p-3 is-flex-grow-1" key={option.id}>
                            <div>
                              <p className="heading is-size-5">{option.title}</p>
                              <p className="title is-3 mb-5">{option.votes.length} votos</p>
                              <p className="heading">Porcentaje</p>
                              <p className="title is-6">{round(option.votes.length / memberHook.members.length * 100)}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>
                  : <div>
                      <div className="level">
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading is-size-5">Sí</p>
                            <p className="title is-3">{section.options[0].votes.length} votos</p>
                          </div>
                        </div>
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading is-size-5">No</p>
                            <p className="title is-3">{assembly.votes.length - section.options[0].votes.length} votos</p>
                          </div>
                        </div>
                      </div>
                      <div className="level">
                        <div className="level-item has-text-centered">
                          <div>
                            <p className="heading">Porcentaje</p>
                            <p className="title is-5">{round(section.options[0].votes.length / memberHook.members.length * 100)}%</p>
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