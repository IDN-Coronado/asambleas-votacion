import { Link } from "react-router-dom";

const AssemblyTile = props => {
  const { id, title, description, onToggleModal } = props;
  const { isModalActive, onDeleteAssembly } = props;

  const onDelete = () => {
    onDeleteAssembly(id);
  }

  return (
    <>
      <div key={id} className="card block is-child has-text-left">
        <div className="card-content">
          <p className="title is-5">
            <span className="has-text-weight-semibold is-capitalized">{title}</span>
          </p>
          <p className="subtitle is-6">
            <span className="has-text-weight-normal">{description}</span>
          </p>
        </div>
        <div className="card-footer">
          <Link to={`/asambleas/${id}`} className="card-footer-item button is-light is-primary">
            <span>Editar</span>
          </Link>
          <button className="card-footer-item button is-light is-danger" onClick={onToggleModal}>
            <span>Eliminar</span>
          </button>
        </div>
      </div>
      <div className={`modal${isModalActive ? ' is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Espera</p>
            <button className="delete" aria-label="close" onClick={onToggleModal}></button>
          </header>
          <section className="modal-card-body">
            <p>¿Estás seguro que deseas eliminar esta asamblea?</p>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={onDelete}>Aceptar</button>
            <button className="button" onClick={onToggleModal}>Volver</button>
          </footer>
        </div>
      </div>
    </>
  )
}

export default AssemblyTile;