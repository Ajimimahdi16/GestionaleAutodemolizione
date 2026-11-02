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
    leggi('/api/pubblico/filtri').then(setFiltri).catch(() => {}).finally(() => setCaricamento(false))
    leggi('/api/pubblico/disponibilita').then(dati => setDisponibilita(dati.per_tipologia)).catch(() => {})
    return () => controllo.abort()
  }, [])

  return { filtri, disponibilita, caricamento }
}

const normalizza = testo => testo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('it').trim()

// Collega ogni punto dell'auto ai tipi di pezzo esistenti e somma i pezzi disponibili.
export function collegaParti(parti, tipologie, disponibilita) {
  const perNome = new Map(tipologie.map(voce => [normalizza(voce.nome), voce.id]))
  return parti.flatMap(parte => {
    const ids = parte.nomi.map(nome => perNome.get(normalizza(nome))).filter(Boolean)
    if (!ids.length) return []
    const disponibili = disponibilita ? ids.reduce((somma, id) => somma + (disponibilita[id] || 0), 0) : null
    return [{ ...parte, ids, disponibili }]
  })
}
