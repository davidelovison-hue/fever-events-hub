import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { PachaEventRow } from './pachaEventsData'
import { PACHA_CHERRY_SRC } from './pachaAssets'

const easeOut = [0.22, 1, 0.36, 1] as const

const formatPrice = (n: number) => n.toFixed(2).replace('.', ',') + ' €'

const AUTO_ADVANCE_MS = 6000

type Props = {
  reduce: boolean
  highlights: PachaEventRow[]
  onHighlightClick?: (event: PachaEventRow) => void
}

export function PachaLogoHero({ reduce, highlights, onHighlightClick }: Props) {
  const [index, setIndex] = useState(0)
  const count = highlights.length
  const active = highlights[index] ?? highlights[0]

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return
      setIndex((i) => (i + delta + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (reduce || count <= 1) return
    const id = window.setInterval(() => go(1), AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [reduce, count, go])

  useEffect(() => {
    if (index >= count) setIndex(0)
  }, [index, count])

  const container = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: reduce ? 0 : 0.08,
          delayChildren: reduce ? 0 : 0.04,
        },
      },
    }),
    [reduce],
  )

  const cherry = useMemo(
    () => ({
      hidden: { opacity: 0, scale: reduce ? 1 : 0.9 },
      show: {
        opacity: 1,
        scale: 1,
        transition: reduce
          ? { duration: 0.01 }
          : { type: 'spring' as const, stiffness: 120, damping: 16 },
      },
    }),
    [reduce],
  )

  const bannerItem = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { duration: reduce ? 0.01 : 0.5, ease: easeOut },
      },
    }),
    [reduce],
  )

  if (!active) return null

  return (
    <motion.section
      className={`nightHero ${reduce ? 'nightHero--static' : ''}`}
      aria-labelledby="page-heading"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reduce ? { duration: 0.01 } : { duration: 0.5, ease: easeOut }}
    >
      <div className="nightHero__floor" aria-hidden />
      <motion.div
        className="nightHero__fade"
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0.01 } : { duration: 0.6, ease: easeOut }}
      />

      <motion.div
        className="nightHero__content"
        variants={container}
        initial={reduce ? false : 'hidden'}
        animate="show"
      >
        <h1 id="page-heading" className="nightHero__sr">
          Pacha Ibiza Tickets
        </h1>

        <motion.div className="nightHero__brand" variants={cherry}>
          <motion.a
            href="https://pacha.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="nightHero__cherryLink"
            aria-label="Pacha Ibiza — official website"
            whileHover={reduce ? undefined : { scale: 1.05 }}
            whileTap={reduce ? undefined : { scale: 0.96 }}
          >
            <span className="nightHero__cherryGlow" aria-hidden />
            <motion.img
              className="nightHero__cherry"
              src={PACHA_CHERRY_SRC}
              alt=""
              width={120}
              height={120}
              decoding="async"
            />
          </motion.a>
        </motion.div>

        <motion.div
          className="nightHero__banner"
          variants={bannerItem}
          role="region"
          aria-label="Featured event"
          aria-roledescription="carousel"
        >
          <div className="nightHero__bannerViewport">
            <AnimatePresence mode="wait" initial={false}>
              <motion.button
                key={active.id}
                type="button"
                className="nightHero__bannerSlide"
                onClick={() => onHighlightClick?.(active)}
                disabled={active.soldOut}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: reduce ? 0.01 : 0.45, ease: easeOut }}
              >
                <span className="nightHero__bannerMedia" aria-hidden>
                  <img
                    className="nightHero__bannerImg"
                    src={active.image}
                    alt=""
                    loading="eager"
                    decoding="async"
                  />
                </span>
                <span className="nightHero__bannerVeil" aria-hidden />
                <span className="nightHero__bannerBody">
                  <span className="nightHero__bannerVenue">{active.venue}</span>
                  <span className="nightHero__bannerTitle">{active.title}</span>
                  <span className="nightHero__bannerMeta">
                    {active.date}
                    {active.doors ? ` · ${active.doors}` : ''}
                  </span>
                  {!active.soldOut ? (
                    <span className="nightHero__bannerPrice">From {formatPrice(active.price)}</span>
                  ) : (
                    <span className="nightHero__bannerSold">Sold out</span>
                  )}
                  {!active.soldOut && (
                    <span className="nightHero__bannerCta">View tickets</span>
                  )}
                </span>
              </motion.button>
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  className="nightHero__bannerArrow nightHero__bannerArrow--prev"
                  aria-label="Previous event"
                  onClick={() => go(-1)}
                >
                  <span aria-hidden>‹</span>
                </button>
                <button
                  type="button"
                  className="nightHero__bannerArrow nightHero__bannerArrow--next"
                  aria-label="Next event"
                  onClick={() => go(1)}
                >
                  <span aria-hidden>›</span>
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <motion.div
              className="nightHero__bannerFoot"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0.01 } : { duration: 0.4, delay: 0.1 }}
            >
              <button
                type="button"
                className="nightHero__bannerNav"
                onClick={() => go(-1)}
              >
                Previous
              </button>
              <p className="nightHero__bannerStatus" aria-live="polite">
                <span className="nightHero__sr">Slide </span>
                {index + 1} of {count}
              </p>
              <button
                type="button"
                className="nightHero__bannerNav"
                onClick={() => go(1)}
              >
                Next
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
