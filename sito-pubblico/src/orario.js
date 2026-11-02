import { useEffect, useState } from 'react'
import { orari } from './dati/azienda.js'

const giorniInglesi = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
const formato = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})

const inMinuti = testo => {
  const [ore, minuti] = testo.split(':').map(Number)
  return ore * 60 + minuti
}

// Giorno della settimana e minuti trascorsi dalla mezzanotte, sempre secondo l'ora di Torino.
function adesso() {
  const parti = Object.fromEntries(formato.formatToParts(new Date()).map(parte => [parte.type, parte.value]))
  return { giorno: giorniInglesi[parti.weekday], minuti: Number(parti.hour) * 60 + Number(parti.minute) }
}

export function calcolaStato({ giorno, minuti }) {
  const oggi = orari[giorno].fasce
  const fasciaAttuale = oggi.find(([apre, chiude]) => minuti >= inMinuti(apre) && minuti < inMinuti(chiude))
  if (fasciaAttuale) return { aperto: true, testo: `Aperto ora · chiude alle ${fasciaAttuale[1]}` }

  const prossimaOggi = oggi.find(([apre]) => inMinuti(apre) > minuti)
  if (prossimaOggi) return { aperto: false, testo: `Chiuso · riapre oggi alle ${prossimaOggi[0]}` }

  for (let passo = 1; passo <= 7; passo += 1) {
    const indice = (giorno + passo) % 7
    if (orari[indice].fasce.length) {
      const quando = passo === 1 ? 'domani' : orari[indice].giorno.toLowerCase()
      return { aperto: false, testo: `Chiuso · riapre ${quando} alle ${orari[indice].fasce[0][0]}` }
    }
  }
  return { aperto: false, testo: 'Chiuso' }
}

// Stato di apertura aggiornato ogni minuto.
export function useStatoApertura() {
  const [stato, setStato] = useState(() => ({ ...calcolaStato(adesso()), giorno: adesso().giorno }))
  useEffect(() => {
    const aggiorna = () => {
      const ora = adesso()
      setStato({ ...calcolaStato(ora), giorno: ora.giorno })
    }
    const timer = window.setInterval(aggiorna, 60 * 1000)
    return () => window.clearInterval(timer)
  }, [])
  return stato
}
