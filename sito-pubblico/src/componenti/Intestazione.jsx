import { azienda } from '../dati/azienda.js'
import { IconaTelefono } from './Icone.jsx'

export default function Intestazione() {
  return (
    <header className="intestazione">
      <div className="contenitore intestazione-dentro">
        <a className="marchio" href="#inizio" aria-label={`${azienda.nome}, inizio pagina`}>
          <img src="/logo.png" alt={azienda.nome} width="276" height="176" />
        </a>
        <nav className="menu-principale" aria-label="Sezioni del sito">
          <a href="#cerca">Cerca ricambi</a>
          <a href="#ritiro">Ritiro veicoli</a>
          <a href="#recensioni">Recensioni</a>
          <a href="#dove">Dove siamo</a>
        </nav>
        <a className="pulsante pulsante-giallo pulsante-piccolo" href={azienda.telefonoUfficio.link}>
          <IconaTelefono /> <span>{azienda.telefonoUfficio.mostra}</span>
        </a>
      </div>
    </header>
  )
}
