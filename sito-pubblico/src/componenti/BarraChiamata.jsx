import { azienda } from '../dati/azienda.js'
import { IconaTelefono } from './Icone.jsx'

// Barra fissa per chiamare con un tocco: compare solo sugli schermi stretti (telefoni).
export default function BarraChiamata() {
  return (
    <div className="barra-chiamata">
      <a className="pulsante pulsante-giallo" href={azienda.telefonoUfficio.link}><IconaTelefono /> Chiama l'ufficio</a>
    </div>
  )
}
