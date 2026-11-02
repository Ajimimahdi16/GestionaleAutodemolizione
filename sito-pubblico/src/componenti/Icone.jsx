// Icone semplici in linea, così il sito non carica librerie o immagini da altri siti.
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const IconaTelefono = () => <svg {...base}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
export const IconaPosizione = () => <svg {...base}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
export const IconaFreccia = () => <svg {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
export const IconaSpunta = () => <svg {...base}><path d="M20 6 9 17l-5-5" /></svg>
export const IconaInfo = () => <svg {...base}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
export const IconaCamion = () => <svg {...base}><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
export const IconaCerca = () => <svg {...base}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
export const IconaStella = ({ piena = true }) => <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill={piena ? '#ffc400' : 'none'} stroke="#ffc400" strokeWidth="1.6" strokeLinejoin="round"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
export const IconaInstagram = () => <svg {...base} strokeWidth={1.8}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" /></svg>
export const IconaTikTok = () => <svg {...base} strokeWidth={1.8}><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.6 2 4.4 5 4.6" /></svg>
