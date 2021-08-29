import { useEffect, useState } from "react";
import { useParams } from "react-router";
import firebase from "firebase/app";

import Vote from "../../components/Vote/Vote";

import "./VotingPage.css";

const VotingPage = () => {
  const { assemblyId, memberId } = useParams();
  const [ pageData, setPageData ] = useState();
  const [ pageError, setPageError ] = useState();
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isModalActive, setIsModalActive ] = useState(false);
  const [ sectionVotes, setSectionVotes ] = useState({})

  const onVoteSectionUpdate = (id, options) => {
    setSectionVotes({
      ...sectionVotes,
      [id]: options
    })
  }

  const onToggleModal = () => setIsModalActive(!isModalActive);

  const onFinalizeVote = () => {
    const vote = firebase.functions().httpsCallable('vote');
    vote({ assemblyId, memberId, sectionVotes })
      .then(() => {
        setPageError('voted')
        onToggleModal();
      })
  }

  const getErrorImage = () => {
    switch (pageError) {
      case 'expired':
        return 'empty'
      case 'voted':
        return 'voted'
      default:
        return 'empty'
    }
  }

  const getErrorMessage = () => {
    switch (pageError) {
      case 'expired':
        return 'Esta votación ya expiró.'
      case 'voted':
        return 'Ya realizaste tu voto'
      default:
        return 'Ha ocurrido un error'
    }
  }

  useEffect(() => {
    const getVoting = firebase.functions().httpsCallable('getVoting');
    getVoting({ assemblyId, memberId })
      .then(({ data }) => {
        setPageData({ ...data.payload });
        setIsLoading(false)
      })
      .catch(error => {
        if (error.message === 'Assembly expired') {
          setPageError('expired');
          setIsLoading(false)
        }
        else if (error.message === 'User already voted') {
          setPageError('voted');
          setIsLoading(false)
        }
        else setPageError(error.message);
      })
    document.querySelector('body').classList.add('headless');
  }, [assemblyId, memberId]);

  return <div className={`voting-page${pageError ? ' has-background' : ''}`}>
    {isLoading ? <div>Loading</div> : !pageError ?
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="message is-primary">
              <header className="message-header">
                <h1 className="title has-text-light is-5">Hola {pageData.member.name}</h1>
              </header>
              <div className="block message-body">
                <div className="block">
                  <h2 className="subtitle is-6"><strong>{pageData.assembly.title}</strong></h2>
                  <p className="has-text-dark">{pageData.assembly.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h3 className="title is-6">Votaciones</h3>
            {pageData.assembly.sections.map(section => <Vote key={section.id} {...section} onVoteUpdate={onVoteSectionUpdate} />)}
          </div>
        </div>
        <div className="columns">
          <div className="column is-10 is-offset-1 has-text-centered">
            <div className="block">
              <p>Aprieta este botón cuando estés seguro que deseas finalizar la votación.</p>
              <p>Después de finalizar la votación no habrá opción de cambiarla de nuevo.</p>
            </div>
            <div className="button is-large is-success" onClick={onToggleModal}>FINALIZAR VOTACIÓN</div>
          </div>
        </div>
      </div>
    : <div className="empty" style={{
      backgroundImage: `url('${process.env.PUBLIC_URL}/images/${getErrorImage()}.jpeg')`
    }}>
      <section className="container hero">
        <div className="hero-body">
          <p className="title">
            Hola
          </p>
          <p className="subtitle">
            {getErrorMessage()}
          </p>
        </div>
      </section>
    </div>
    }
    <div className={`modal${isModalActive ? ' is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Una vez más</p>
            <button className="delete" aria-label="close" onClick={onToggleModal}></button>
          </header>
          <section className="modal-card-body">
            <p>¿Estás seguro que deseas realizar tu votación?</p>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={onFinalizeVote}>Votar</button>
            <button className="button" onClick={onToggleModal}>Volver</button>
          </footer>
        </div>
      </div>
  </div>
}

export default VotingPage;