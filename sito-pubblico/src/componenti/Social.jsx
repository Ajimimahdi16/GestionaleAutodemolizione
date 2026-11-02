import { azienda } from '../dati/azienda.js'
import Rivela from './Rivela.jsx'
import { IconaFreccia, IconaInstagram, IconaTikTok } from './Icone.jsx'

export default function Social() {
  return (
    <section id="social" className="sezione sezione-social">
      <div className="contenitore">
        <Rivela>
          <p className="etichetta">SEGUICI</p>
          <h2>Guarda come lavoriamo.</h2>
          <p className="sezione-testo">Foto, video e novità dal nostro piazzale su Instagram e TikTok.</p>
        </Rivela>
        <div className="social-griglia">
          <Rivela ritardo={60}>
            <a className="social-scheda" href={azienda.instagram} target="_blank" rel="noreferrer noopener">
              <span className="social-icona"><IconaInstagram /></span>
              <strong>Instagram</strong>
              <span>@auto.demolizionericambitorino</span>
              <i><IconaFreccia /></i>
            </a>
          </Rivela>
          <Rivela ritardo={140}>
            <a className="social-scheda" href={azienda.tiktok} target="_blank" rel="noreferrer noopener">
              <span className="social-icona"><IconaTikTok /></span>
              <strong>TikTok</strong>
              <span>@autodemolizione_torino</span>
              <i><IconaFreccia /></i>
            </a>
          </Rivela>
        </div>
      </div>
    </section>
  )
}
