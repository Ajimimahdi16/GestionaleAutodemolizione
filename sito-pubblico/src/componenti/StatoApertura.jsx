import { useStatoApertura } from '../orario.js'

export default function StatoApertura() {
  const stato = useStatoApertura()
  return (
    <span className={`stato-apertura ${stato.aperto ? 'aperto' : 'chiuso'}`} role="status">
      <i aria-hidden="true" /> {stato.testo}
    </span>
  )
}
