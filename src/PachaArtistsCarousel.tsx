import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { PachaArtist } from './pachaArtistsData'
import { signalLabel } from './pachaEventSignal'

const easeOut = [0.22, 1, 0.36, 1] as const

function ArtistChipAvatar({ artist }: { artist: PachaArtist }) {
  const [src, setSrc] = useState(artist.image)

  useEffect(() => {
    setSrc(artist.image)
  }, [artist.id, artist.image])

  return (
    <img
      className="artistChip__img"
      src={src}
      alt=""
      width={72}
      height={72}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (src !== artist.fallbackImage) setSrc(artist.fallbackImage)
      }}
    />
  )
}

type PachaArtistsCarouselProps = {
  artists: PachaArtist[]
  reduce?: boolean
  onArtistClick?: (artist: PachaArtist) => void
}

export function PachaArtistsCarousel({
  artists,
  reduce = false,
  onArtistClick,
}: PachaArtistsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  if (artists.length === 0) return null

  return (
    <motion.section
      className="artistsCarousel"
      aria-label="Lineup artists"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={reduce ? { duration: 0.01 } : { duration: 0.5, ease: easeOut }}
    >
      <div className="artistsCarousel__head">
        <h2 className="artistsCarousel__title">Artists</h2>
        <p className="artistsCarousel__hint">Swipe for more</p>
      </div>
      <motion.div
        ref={trackRef}
        className="artistsCarousel__track"
        role="list"
        tabIndex={0}
      >
        {artists.map((artist, i) => {
          const signalText = artist.signal ? signalLabel(artist.signal) : null
          return (
          <motion.button
            key={artist.id}
            type="button"
            role="listitem"
            className={`artistChip${artist.signal === 'soldOut' ? ' artistChip--soldOut' : ''}${artist.signal === 'low' ? ' artistChip--low' : ''}`}
            aria-label={
              signalText
                ? `${artist.name}, ${artist.date}, ${signalText}`
                : `${artist.name}, ${artist.date}`
            }
            onClick={() => onArtistClick?.(artist)}
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={
              reduce
                ? { duration: 0.01 }
                : { duration: 0.4, delay: Math.min(i * 0.03, 0.24), ease: easeOut }
            }
            whileTap={reduce ? undefined : { scale: 0.96 }}
          >
            <span className="artistChip__avatar">
              <ArtistChipAvatar artist={artist} />
              {artist.signal && (
                <span
                  className={`artistChip__signal artistChip__signal--${artist.signal}`}
                  aria-hidden
                >
                  {signalText}
                </span>
              )}
            </span>
            <span className="artistChip__name">{artist.name}</span>
            <span className="artistChip__date">{artist.date}</span>
          </motion.button>
          )
        })}
      </motion.div>
    </motion.section>
  )
}
