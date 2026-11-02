import { useEffect, useState } from 'react'

const vuoto = { tipologie: [], marche: [], modelli: [] }

// Elenchi dei menu e pezzi disponibili per tipo, caricati una volta sola e condivisi dalle sezioni del sito.
export function useCatalogoPubblico() {
  const [filtri, setFiltri] = useState(vuoto)
  const [disponibilita, setDisponibilita] = useState(null)
  const [caricamento, setCaricamento] = useState(true)

  useEffect(() => {
    const controllo = new AbortController()
    const leggi = indirizzo => fetch(indirizzo, { signal: controllo.signal }).then(risposta => {
      if (!risposta.ok) throw new Error(indirizzo)
      return risposta.json()
    })
    const aggiornaDisponibilita = () => leggi('/api/pubblico/disponibilita').then(dati => setDisponibilita(dati.per_tipologia)).catch(() => {})
    leggi('/api/pubblico/filtri').then(setFiltri).catch(() => {}).finally(() => setCaricamento(false))
    aggiornaDisponibilita()

    // I pezzi cambiano mentre il sito è aperto: si rilegge ogni minuto e quando si torna sulla scheda del browser.
    const timer = window.setInterval(aggiornaDisponibilita, 60 * 1000)
    const alRitorno = () => { if (document.visibilityState === 'visible') aggiornaDisponibilita() }
    document.addEventListener('visibilitychange', alRitorno)
    return () => {
      controllo.abort()
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', alRitorno)
    }
  }, [])

  return { filtri, disponibilita, caricamento }
}

const normalizza = testo => testo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('it').trim()

// Collega i gruppi di ogni zona ai tipi di pezzo esistenti, con la disponibilità di ciascuno.
export function collegaZone(zone, tipologie, disponibilita) {
  const perNome = new Map(tipologie.map(voce => [normalizza(voce.nome), voce]))
  return zone.map(zona => {
    const gruppi = zona.gruppi.map(gruppo => {
      const visti = new Set()
      const voci = gruppo.nomi.flatMap(nome => {
        const tipo = perNome.get(normalizza(nome))
        if (!tipo || visti.has(tipo.id)) return []
        visti.add(tipo.id)
        return [{ id: tipo.id, nome: tipo.nome, disponibili: disponibilita ? (disponibilita[tipo.id] || 0) : null }]
      })
      return { titolo: gruppo.titolo, voci }
    }).filter(gruppo => gruppo.voci.length)
    // Pezzi disponibili nella zona: ogni tipo di pezzo si conta una volta sola, anche se è in più gruppi.
    const perId = new Map(gruppi.flatMap(gruppo => gruppo.voci).map(voce => [voce.id, voce.disponibili || 0]))
    const pezziDisponibili = [...perId.values()].reduce((somma, numero) => somma + numero, 0)
    return { ...zona, gruppi, pezziDisponibili: disponibilita ? pezziDisponibili : null }
  }).filter(zona => zona.gruppi.length)
}
