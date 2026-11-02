import { IconaSpunta } from './Icone.jsx'

// Scheda di un pezzo disponibile: nessun prezzo, solo i dati utili a riconoscerlo.
export default function SchedaPezzo({ pezzo }) {
  const dettagli = [pezzo.colore, pezzo.lato, pezzo.posizione, pezzo.condizione].filter(Boolean)
  return (
    <article className="scheda-pezzo">
      <div className="scheda-foto">
        {pezzo.foto
          ? <img src={pezzo.foto} alt={`${pezzo.tipo} ${pezzo.marca} ${pezzo.modello}`} loading="lazy" />
          : <span className="scheda-senza-foto">Foto in arrivo</span>}
        <span className="badge-disponibile"><IconaSpunta /> Disponibile</span>
      </div>
      <div className="scheda-corpo">
        <h3>{pezzo.tipo}</h3>
        <p>{pezzo.marca} <b>{pezzo.modello}</b> · {pezzo.anno}</p>
        <ul>{dettagli.map(dettaglio => <li key={dettaglio}>{dettaglio}</li>)}</ul>
      </div>
    </article>
  )
}
