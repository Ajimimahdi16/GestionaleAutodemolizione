import { useEffect, useMemo, useState } from 'react'
import { azienda } from '../dati/azienda.js'
import Menu from './Menu.jsx'
import Rivela from './Rivela.jsx'
import SchedaPezzo from './SchedaPezzo.jsx'
import { IconaInfo, IconaSpunta, IconaTelefono } from './Icone.jsx'

const filtriVuoti = { tipologie: [], marche: [], modelli: [] }

export default function Ricerca() {
  const [filtri, setFiltri] = useState(filtriVuoti)
  const [caricamentoFiltri, setCaricamentoFiltri] = useState(true)
  const [tipologia, setTipologia] = useState('')
  const [marca, setMarca] = useState('')
  const [modello, setModello] = useState('')
  const [risposta, setEsito] = useState({ stato: 'inattivo' })
  const ricercaAttiva = Boolean(tipologia || marca || modello)
  // Senza filtri scelti l'esito precedente non va mostrato.
  const esito = ricercaAttiva ? risposta : { stato: 'inattivo' }

  useEffect(() => {
    const controllo = new AbortController()
    fetch('/api/pubblico/filtri', { signal: controllo.signal })
      .then(risposta => { if (!risposta.ok) throw new Error('filtri'); return risposta.json() })
      .then(dati => setFiltri(dati))
      .catch(() => {})
      .finally(() => setCaricamentoFiltri(false))
    return () => controllo.abort()
  }, [])

  useEffect(() => {
    if (!ricercaAttiva) return undefined
    const controllo = new AbortController()
    const parametri = new URLSearchParams()
    if (tipologia) parametri.set('tipologia_id', tipologia)
    if (marca) parametri.set('marca', marca)
    if (modello) parametri.set('modello', modello)
    const timer = window.setTimeout(() => {
      setEsito({ stato: 'carico' })
      fetch(`/api/pubblico/pezzi?${parametri}`, { signal: controllo.signal })
        .then(risposta => { if (!risposta.ok) throw new Error('ricerca'); return risposta.json() })
        .then(dati => setEsito({ stato: 'ok', ...dati }))
        .catch(errore => { if (errore.name !== 'AbortError') setEsito({ stato: 'errore' }) })
    }, 200)
    return () => { window.clearTimeout(timer); controllo.abort() }
  }, [tipologia, marca, modello, ricercaAttiva])

  const opzioniTipologie = useMemo(() => filtri.tipologie.map(voce => ({ valore: String(voce.id), etichetta: voce.nome })), [filtri])
  const opzioniMarche = useMemo(() => filtri.marche.map(nome => ({ valore: nome, etichetta: nome })), [filtri])
  const opzioniModelli = useMemo(
    () => filtri.modelli.filter(voce => voce.marca === marca).map(voce => ({ valore: voce.modello, etichetta: voce.modello })),
    [filtri, marca],
  )

  function azzera() { setTipologia(''); setMarca(''); setModello('') }

  return (
    <section id="cerca" className="sezione sezione-ricerca">
      <div className="contenitore">
        <Rivela>
          <p className="etichetta">CERCA UN RICAMBIO</p>
          <h2>Scopri subito se ce l&apos;abbiamo.</h2>
          <p className="sezione-testo">Scegli il pezzo e, se vuoi, la marca e il modello del tuo veicolo: ti diciamo se è disponibile.</p>
        </Rivela>
        <Rivela ritardo={80}>
          <div className="pannello-ricerca">
            <div className="ricerca-campi">
              <Menu etichetta="PEZZO" segnaposto="Es. Paraurti anteriore" opzioni={opzioniTipologie} valore={tipologia} onChange={setTipologia} caricamento={caricamentoFiltri} />
              <Menu etichetta="MARCA" segnaposto="Tutte le marche" opzioni={opzioniMarche} valore={marca} onChange={valore => { setMarca(valore); setModello('') }} caricamento={caricamentoFiltri} />
              <Menu etichetta="MODELLO" segnaposto={marca ? 'Tutti i modelli' : 'Scegli prima la marca'} opzioni={opzioniModelli} valore={modello} onChange={setModello} disabilitato={!marca} />
            </div>
            {(tipologia || marca || modello) && <button type="button" className="ricerca-azzera" onClick={azzera}>Azzera la ricerca</button>}

            <div className="ricerca-esito" aria-live="polite">
              {esito.stato === 'inattivo' && (
                <p className="esito-invito"><IconaInfo /> Scegli almeno il pezzo o la marca per iniziare.</p>
              )}
              {esito.stato === 'carico' && <div className="esito-scheletro" aria-label="Ricerca in corso"><span /><span /><span /></div>}
              {esito.stato === 'errore' && (
                <p className="esito esito-ambra"><IconaInfo /> Non riusciamo a controllare ora la disponibilità. Chiamaci: <a href={azienda.telefonoUfficio.link}>{azienda.telefonoUfficio.mostra}</a></p>
              )}
              {esito.stato === 'ok' && esito.disponibile && (
                <>
                  <p className="esito esito-verde"><IconaSpunta /> <strong>Disponibile.</strong> {esito.totale === 1 ? 'Abbiamo 1 pezzo' : `Abbiamo ${esito.totale} pezzi`} in magazzino.</p>
                  <div className="risultati-griglia">
                    {esito.pezzi.map(pezzo => <SchedaPezzo key={pezzo.id} pezzo={pezzo} />)}
                  </div>
                  <p className="esito-nota">Per prenotarlo o verificare la compatibilità con il tuo veicolo, chiamaci.</p>
                </>
              )}
              {esito.stato === 'ok' && !esito.disponibile && (
                <p className="esito esito-ambra"><IconaInfo /> <span><strong>Al momento non disponibile.</strong> Contattaci per maggiori informazioni.</span></p>
              )}
              {esito.stato === 'ok' && (
                <div className="esito-contatti">
                  <a className="pulsante pulsante-giallo" href={azienda.telefonoUfficio.link}><IconaTelefono /> Ufficio · {azienda.telefonoUfficio.mostra}</a>
                </div>
              )}
            </div>
          </div>
        </Rivela>
      </div>
    </section>
  )
}
