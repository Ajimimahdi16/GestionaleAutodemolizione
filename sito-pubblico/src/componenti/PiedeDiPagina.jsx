import { azienda } from '../dati/azienda.js'

const annoCorrente = new Date().getFullYear()

export default function PiedeDiPagina() {
  return (
    <footer className="piede">
      <div className="contenitore piede-dentro">
        <img className="piede-marchio" src="/logo.jpg" alt={azienda.nome} width="512" height="326" loading="lazy" />
        <div>
          <strong>{azienda.ragioneSociale}</strong>
          <span>{azienda.indirizzo}, {azienda.citta} · P.IVA {azienda.partitaIva}</span>
        </div>
        <div className="piede-contatti">
          <a href={azienda.telefonoUfficio.link}>Ufficio {azienda.telefonoUfficio.mostra}</a>
          <a href={azienda.telefonoCarrista.link}>Carrista {azienda.telefonoCarrista.mostra}</a>
        </div>
        <small>© {annoCorrente} {azienda.nome}. Tutti i diritti riservati.</small>
      </div>
    </footer>
  )
}
