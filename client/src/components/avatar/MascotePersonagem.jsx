export default function MascotePersonagem({ estagio = 1, size = 160 }) {
  const indice = Math.min(Math.max(estagio, 1), 6) - 1;
  const opacidadeCorpo = indice === 0 ? 0.55 : indice === 1 ? 0.8 : 1;
  const raioCorpo = 34 + indice * 8;

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`Mascote estágio ${indice + 1}`}>
      {indice >= 3 && <circle cx="100" cy="108" r="88" fill="var(--accent-gold)" opacity="0.16" />}

      <ellipse cx="100" cy="118" rx={raioCorpo} ry={raioCorpo * 0.92} fill="var(--mascote-verde)" opacity={opacidadeCorpo} />

      {indice === 0 && <ellipse cx="100" cy="60" rx="6" ry="10" fill="var(--mascote-verde)" opacity="0.6" />}
      {indice >= 1 && (
        <>
          <path d="M100 70 Q80 45 95 30 Q100 50 100 70 Z" fill="var(--mascote-verde)" />
          <path d="M100 70 Q120 45 105 30 Q100 50 100 70 Z" fill="var(--mascote-verde)" />
        </>
      )}
      {indice >= 4 && <circle cx="100" cy="32" r="6" fill="var(--accent-gold)" />}

      {indice >= 1 && (
        <>
          <circle cx="85" cy="112" r="6" fill="var(--bg-page)" />
          <circle cx="115" cy="112" r="6" fill="var(--bg-page)" />
        </>
      )}

      {indice >= 2 && (
        <path d="M88 135 Q100 145 112 135" stroke="var(--bg-page)" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}

      {indice >= 3 && (
        <>
          <circle cx="75" cy="128" r="6" fill="var(--accent-coral)" opacity="0.5" />
          <circle cx="125" cy="128" r="6" fill="var(--accent-coral)" opacity="0.5" />
        </>
      )}

      {indice === 5 && (
        <>
          <path d="M50 90 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" fill="var(--accent-gold)" />
          <path d="M150 100 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill="var(--accent-gold)" />
        </>
      )}
    </svg>
  );
}
