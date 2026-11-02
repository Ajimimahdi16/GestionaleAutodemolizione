import { useEffect, useRef, useState } from 'react'

// Fa comparire il contenuto con un'animazione quando entra nella schermata.
export default function Rivela({ children, ritardo = 0, className = '' }) {
  const elemento = useRef(null)
  const [visibile, setVisibile] = useState(false)

  useEffect(() => {
    const nodo = elemento.current
    if (!nodo || typeof IntersectionObserver === 'undefined') {
      setVisibile(true)
      return undefined
    }
    const osservatore = new IntersectionObserver(([voce]) => {
      if (voce.isIntersecting) {
        setVisibile(true)
        osservatore.disconnect()
      }
    }, { threshold: 0.12 })
    osservatore.observe(nodo)
    return () => osservatore.disconnect()
  }, [])

  return <div ref={elemento} className={`rivela ${visibile ? 'visibile' : ''} ${className}`} style={{ transitionDelay: `${ritardo}ms` }}>{children}</div>
}
