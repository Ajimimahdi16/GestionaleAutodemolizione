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
  return (
    <>
      <Intestazione />
      <main>
        <Eroe />
        <Scorrimento />
        <Ricerca />
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
