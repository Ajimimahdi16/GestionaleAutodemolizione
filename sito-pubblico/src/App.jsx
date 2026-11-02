import { useState } from 'react'
import { useCatalogoPubblico } from './catalogo.js'
import BarraChiamata from './componenti/BarraChiamata.jsx'
import DoveSiamo from './componenti/DoveSiamo.jsx'
import Eroe from './componenti/Eroe.jsx'
import Intestazione from './componenti/Intestazione.jsx'
import Novita from './componenti/Novita.jsx'
import PiedeDiPagina from './componenti/PiedeDiPagina.jsx'
import Recensioni from './componenti/Recensioni.jsx'
import Ricerca from './componenti/Ricerca.jsx'
import Ritiro from './componenti/Ritiro.jsx'
import Scorrimento from './componenti/Scorrimento.jsx'
import Social from './componenti/Social.jsx'

export default function App() {
  const { filtri, disponibilita, caricamento } = useCatalogoPubblico()
  // Quando si tocca un punto dell'auto, la ricerca si compila e la pagina scorre ai risultati.
  const [richiesta, setRichiesta] = useState(null)

  function scegliParte(parte) {
    setRichiesta({ ids: parte.ids, etichetta: parte.etichetta })
    document.getElementById('cerca')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Intestazione />
      <main>
        <Eroe filtri={filtri} disponibilita={disponibilita} onScegliParte={scegliParte} />
        <Scorrimento />
        <Ricerca filtri={filtri} caricamentoFiltri={caricamento} richiesta={richiesta} />
        <Novita />
        <Ritiro />
        <Recensioni />
        <DoveSiamo />
        <Social />
      </main>
      <PiedeDiPagina />
      <BarraChiamata />
    </>
  )
}
