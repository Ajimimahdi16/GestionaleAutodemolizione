import { useState } from 'react'
import { azienda } from '../dati/azienda.js'
import { conFermo, documentoMancante, documenti, senzaFermo } from '../dati/procedura.js'
import { IconaFreccia, IconaInfo, IconaPosizione, IconaSpunta, IconaTelefono } from './Icone.jsx'

const schede = [
  { id: 'senza', etichetta: 'Senza fermo amministrativo' },
  { id: 'con', etichetta: 'Con fermo amministrativo' },
]

// Spiega cosa serve per demolire il veicolo, distinguendo i casi con e senza fermo amministrativo.
export default function Procedura() {
  const [scheda, setScheda] = useState('senza')
  const contenuto = scheda === 'senza' ? senzaFermo : conFermo

  return (
    <div className="procedura">
      <div className="procedura-testa">
        <div>
          <p className="etichetta">COSA SERVE</p>
          <h3>Come funziona la demolizione.</h3>
        </div>
        <div className="procedura-schede" role="tablist" aria-label="Situazione del veicolo">
          {schede.map(voce => (
            <button key={voce.id} type="button" role="tab" id={`scheda-${voce.id}`} aria-selected={scheda === voce.id} aria-controls="procedura-pannello"
              className={scheda === voce.id ? 'attiva' : ''} onClick={() => setScheda(voce.id)}>
              {voce.etichetta}
            </button>
          ))}
        </div>
      </div>

      <div className="procedura-pannello" id="procedura-pannello" role="tabpanel" aria-labelledby={`scheda-${scheda}`} key={scheda}>
        <h4>{contenuto.titolo}</h4>
        <p className="procedura-intro">{contenuto.testo}</p>

        <h5>Documenti da portare</h5>
        <ul className="documenti">
          {documenti.map(documento => (
            <li key={documento.titolo}>
              <span className="documento-spunta"><IconaSpunta /></span>
              <div>
                <strong>{documento.titolo}</strong>
                {documento.nota && <small>{documento.nota}</small>}
              </div>
            </li>
          ))}
        </ul>
        <p className="documento-mancante"><IconaInfo /> {documentoMancante}</p>

        {scheda === 'con' && (
          <div className="residenza">
            {conFermo.residenti.map(gruppo => (
              <div className="residenza-scheda" key={gruppo.titolo}>
                <h5><IconaPosizione /> {gruppo.titolo}</h5>
                <ul>
                  {gruppo.opzioni.map(opzione => (
                    <li key={opzione.titolo}><strong>{opzione.titolo}</strong><span>{opzione.testo}</span></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="residenza-azioni">
              <a className="pulsante pulsante-giallo" href={azienda.telefonoUfficio.link}><IconaTelefono /> Chiamaci · {azienda.telefonoUfficio.mostra}</a>
              <a className="pulsante pulsante-bordo" href={azienda.vigiliTorino.mappa} target="_blank" rel="noreferrer noopener">Vigili municipali: {azienda.vigiliTorino.indirizzo} <IconaFreccia /></a>
            </div>
          </div>
        )}
        {scheda === 'senza' && (
          <div className="residenza-azioni">
            <a className="pulsante pulsante-giallo" href={azienda.telefonoCarrista.link}><IconaTelefono /> Prenota il ritiro · {azienda.telefonoCarrista.mostra}</a>
          </div>
        )}
      </div>
    </div>
  )
}
