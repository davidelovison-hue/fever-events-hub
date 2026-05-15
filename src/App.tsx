import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './App.css'
import { PACHA_EVENTS, PACHA_HIGHLIGHT_EVENTS, type PachaEventRow } from './pachaEventsData'
import { PachaLogoHero } from './PachaLogoHero'
import { PachaArtistsCarousel } from './PachaArtistsCarousel'
import { PachaFooter } from './PachaFooter'
import { PachaResidenciesBlock } from './PachaResidenciesBlock'
import { PACHA_ARTISTS } from './pachaArtistsData'
import { getEventSignal } from './pachaEventSignal'
import { PACHA_FAVICON_SRC } from './pachaAssets'
import { useLenis } from './useLenis'

const formatPrice = (n: number) => n.toFixed(2).replace('.', ',') + ' €'

type Month = 'all' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct'

type ProductTab = 'entrada' | 'vip'

type EventItem = PachaEventRow & { tag?: 'low' }

/** Demo list from pachaEventsData. */
const EVENTS: EventItem[] = PACHA_EVENTS.map((e) => {
  const signal = getEventSignal(e)
  return {
    ...e,
    soldOut: Boolean(e.soldOut) || signal === 'soldOut',
    tag: signal === 'low' ? 'low' : undefined,
  }
})

function vipForEntrada(entradaId: string): EventItem | undefined {
  const e = EVENTS.find((x) => x.id === entradaId)
  if (!e || e.vipPrice == null || e.vipPrice <= 0) return undefined
  return { ...e, id: `vip-${e.id}`, price: e.vipPrice }
}

const MONTHS: { key: Month; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'June' },
  { key: 'jul', label: 'July' },
  { key: 'aug', label: 'August' },
  { key: 'sep', label: 'September' },
  { key: 'oct', label: 'October' },
]

const easeOut = [0.22, 1, 0.36, 1] as const

/** Primary row — matches https://pacha.com/events pill nav. */
const PACHA_TOP_PRIMARY: { label: string; href: string; external?: boolean }[] = [
  { label: 'Buy Tickets', href: '#eventos' },
  { label: 'Book VIP Zone', href: 'https://pacha.com/vip-events', external: true },
  { label: 'Restaurant', href: 'https://pacha.com/restaurant', external: true },
  { label: 'Pacha Collection', href: 'https://pachashop.com/', external: true },
]

/** Full-screen drawer — same items as Pacha mobile menu on /events. */
const PACHA_TOP_DRAWER: { label: string; href: string; external?: boolean }[] = [
  { label: 'Buy Tickets', href: '#eventos' },
  { label: 'Book VIP Zone', href: 'https://pacha.com/vip-events', external: true },
  { label: 'Artists', href: 'https://pacha.com/artists', external: true },
  { label: 'Restaurant', href: 'https://pacha.com/restaurant', external: true },
  { label: 'Gallery', href: 'https://pacha.com/gallery', external: true },
  { label: 'Shop', href: 'https://pachashop.com/', external: true },
  { label: 'Location & Contact Us', href: 'https://pacha.com/contact-us', external: true },
  { label: 'Work with us', href: 'https://pacha.com/work-with-us', external: true },
  { label: 'Shuttle Information', href: 'https://pacha.com/shuttle-information', external: true },
]

export default function App() {
  const reduce = useReducedMotion() ?? false
  const [selectedProduct, setSelectedProduct] = useState<ProductTab>('entrada')
  const [month, setMonth] = useState<Month>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [topNavOpen, setTopNavOpen] = useState(false)
  const filterSectionRef = useRef<HTMLElement>(null)
  const eventsSectionRef = useRef<HTMLElement>(null)
  const monthTabsRef = useRef<HTMLDivElement>(null)

  const lenisRef = useLenis()

  const scrollToEl = (
    el: HTMLElement | null,
    offset = -12,
    opts?: { duration?: number; onComplete?: () => void },
  ) => {
    const l = lenisRef.current
    if (!l || !el) return
    l.scrollTo(el, {
      offset,
      duration: opts?.duration ?? 1.05,
      onComplete: opts?.onComplete,
    })
  }

  const list = useMemo(() => {
    return month === 'all' ? EVENTS : EVENTS.filter((e) => e.month === month)
  }, [month])

  const filtersActive = month !== 'all'

  const clearFilters = () => {
    setMonth('all')
  }

  useEffect(() => {
    if (selectedId && !list.some((e) => e.id === selectedId)) setSelectedId(null)
  }, [list, selectedId])

  useEffect(() => {
    if (!topNavOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [topNavOpen])

  useEffect(() => {
    if (!topNavOpen) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTopNavOpen(false)
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [topNavOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onMq = () => {
      if (mq.matches) setTopNavOpen(false)
    }
    mq.addEventListener('change', onMq)
    return () => mq.removeEventListener('change', onMq)
  }, [])

  const stagger = reduce ? 0 : 0.052

  const listVariants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: { staggerChildren: stagger },
      },
    }),
    [stagger],
  )

  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: reduce ? { duration: 0.01 } : { duration: 0.5, ease: easeOut },
      },
    }),
    [reduce],
  )

  const pickCardProduct = (entradaId: string, product: ProductTab) => {
    const row = EVENTS.find((e) => e.id === entradaId)
    if (row?.soldOut) return
    setSelectedId(entradaId)
    setSelectedProduct(product)
    const vip = vipForEntrada(entradaId)
    const price = product === 'vip' ? vip?.price : row?.price
    if (row && price != null) {
      window.alert(`${formatPrice(price)} · ${row.title}`)
    }
  }

  const transQuick = reduce ? { duration: 0.01 } : { duration: 0.5, ease: easeOut }

  const onTopLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      setTopNavOpen(false)
      if (href === '#eventos') scrollToEl(eventsSectionRef.current, -56)
      if (href === '#filtros') scrollToEl(filterSectionRef.current, -8)
    }
  }

  return (
    <>
      <motion.header
        className="pachaTopBanner"
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transQuick}
      >
        <nav className="pachaTopBanner__nav" aria-label="Primary">
          <a className="pachaTopBanner__logo" href="https://pacha.com/" aria-label="Logo">
            <img src={PACHA_FAVICON_SRC} alt="" width={36} height={36} decoding="async" />
          </a>

          <ul className="pachaTopBanner__desk">
            {PACHA_TOP_PRIMARY.map((item) => (
              <li key={item.href + item.label} className="pachaTopBanner__deskItem">
                <a
                  className="pachaTopBanner__link underline-animate"
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={(e) => onTopLinkClick(e, item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <span className="pachaTopBanner__navEnd" aria-hidden />

          <button
            type="button"
            className="pachaTopBanner__burger"
            aria-label={topNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={topNavOpen}
            onClick={() => setTopNavOpen((o) => !o)}
          >
            <span
              className={`pachaTopBanner__burgerBox ${topNavOpen ? 'pachaTopBanner__burgerBox--open' : ''}`}
            >
              <span className="pachaTopBanner__burgerLine pachaTopBanner__burgerLine--a" />
              <span className="pachaTopBanner__burgerLine pachaTopBanner__burgerLine--b" />
            </span>
          </button>
        </nav>
      </motion.header>

      <div
        className={`pachaTopBanner__overlay ${topNavOpen ? 'pachaTopBanner__overlay--open' : ''}`}
        aria-hidden={!topNavOpen}
        onClick={() => setTopNavOpen(false)}
      >
        <motion.div
          className="pachaTopBanner__drawer"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="pachaTopBanner__drawerList">
            {PACHA_TOP_DRAWER.map((item) => (
              <li key={item.label + item.href} className="pachaTopBanner__drawerItem">
                <span className="pachaTopBanner__drawerItemInner">
                  <a
                    className="pachaTopBanner__drawerLink underline-animate"
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    onClick={(e) => onTopLinkClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <main className="whlMain">
        <div className="app">
          <PachaLogoHero
            reduce={reduce}
            highlights={PACHA_HIGHLIGHT_EVENTS}
            onHighlightClick={(ev) => {
              scrollToEl(eventsSectionRef.current, -56)
              setSelectedId(ev.id)
              setSelectedProduct('entrada')
            }}
          />
          <PachaArtistsCarousel
            artists={PACHA_ARTISTS}
            reduce={reduce}
            onArtistClick={(artist) => {
              scrollToEl(eventsSectionRef.current, -56)
              setSelectedId(artist.eventId)
              setSelectedProduct('entrada')
            }}
          />
          <motion.section
            ref={filterSectionRef}
            id="filtros"
            className="filterBar"
            aria-label="Month"
            tabIndex={-1}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reduce ? { duration: 0.01 } : { duration: 0.55, ease: easeOut }}
          >
            <div className="filterBarHead">
              <div className="filterBarTitles">
                <h2 className="filterHeading">
                  {list.length} {list.length === 1 ? 'event' : 'events'}
                </h2>
              </div>
              {filtersActive && (
                <motion.button
                  type="button"
                  className="btnFilterClear"
                  onClick={clearFilters}
                  whileTap={reduce ? undefined : { scale: 0.96 }}
                >
                  All
                </motion.button>
              )}
            </div>
            <div className="filterControls">
              <div className="filterMonthsBlock">
                <div ref={monthTabsRef} className="filterPills" role="tablist" aria-label="Month">
                  {MONTHS.map((m) => (
                    <motion.button
                      key={m.key}
                      type="button"
                      role="tab"
                      aria-selected={month === m.key}
                      className={`pill ${month === m.key ? 'pillActive' : ''}`}
                      onClick={() => setMonth(m.key)}
                      whileTap={reduce ? undefined : { scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 30 }}
                    >
                      {m.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <section ref={eventsSectionRef} id="eventos" className="eventsBlock" aria-label="Events">
            <motion.div
              key={month}
              className="grid"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {list.length === 0 ? (
                <p className="emptyState" role="status">
                  No results.{' '}
                  <button type="button" className="emptyStateLink" onClick={clearFilters}>
                    Show all
                  </button>
                </p>
              ) : (
                list.map((ev) => {
                  const vipEv = vipForEntrada(ev.id)
                  const isCardSelected = selectedId === ev.id
                  const doorsLabel = ev.doors ?? '23:45'
                  return (
                    <motion.article
                      key={ev.id}
                      variants={cardVariants}
                      className={`eventCard ${isCardSelected ? 'eventCard--selected' : ''} ${ev.soldOut ? 'eventCard--soldOut' : ''}`}
                    >
                      <button
                        type="button"
                        className="eventCard__open"
                        onClick={() => {
                          if (selectedId === ev.id) setSelectedId(null)
                          else {
                            setSelectedId(ev.id)
                            setSelectedProduct('entrada')
                          }
                        }}
                      >
                        <div className="eventCard__visual">
                          <img className="eventCard__photo" src={ev.image} alt="" loading="lazy" />
                          <div className="eventCard__shade" aria-hidden />
                          {!ev.soldOut && ev.tag === 'low' && (
                            <span className="eventCard__pill">Last tickets</span>
                          )}
                          {ev.soldOut && (
                            <div className="eventCard__soldOut" aria-hidden>
                              <span className="eventCard__soldOutBand">Sold out</span>
                            </div>
                          )}
                        </div>
                        <div className="eventCard__meta">
                          <p className="eventCard__name">{ev.title}</p>
                          <p className="eventCard__when">
                            {ev.date} · {doorsLabel}
                          </p>
                        </div>
                      </button>
                      <div className="eventCard__tickets" role="group" aria-label="Tickets">
                        <button
                          type="button"
                          disabled={ev.soldOut}
                          aria-pressed={isCardSelected && selectedProduct === 'entrada'}
                          className={`eventCard__pick eventCard__pick--entrada ${isCardSelected && selectedProduct === 'entrada' ? 'eventCard__pick--on' : ''}`}
                          aria-label={
                            ev.soldOut
                              ? `Sold out · ${ev.title}`
                              : `Ticket · ${ev.title} · from ${formatPrice(ev.price)}`
                          }
                          onClick={() => pickCardProduct(ev.id, 'entrada')}
                        >
                          <span className="eventCard__pickLead">
                            <span className="eventCard__pickLabel">Ticket</span>
                          </span>
                          <span className="eventCard__pickAside">
                            <span
                              className={`eventCard__pickPrice ${ev.soldOut ? 'eventCard__pickPrice--empty' : ''}`}
                              aria-hidden={ev.soldOut}
                            >
                              {!ev.soldOut ? `from ${formatPrice(ev.price)}` : '\u00a0'}
                            </span>
                            <span className="eventCard__pickChevron" aria-hidden>
                              ›
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          disabled={ev.soldOut}
                          aria-pressed={isCardSelected && selectedProduct === 'vip'}
                          className={`eventCard__pick eventCard__pick--vip ${isCardSelected && selectedProduct === 'vip' ? 'eventCard__pick--onVip' : ''}`}
                          aria-label={
                            ev.soldOut
                              ? `Sold out · ${ev.title}`
                              : vipEv
                                ? `VIP · ${ev.title} · from ${formatPrice(vipEv.price)}`
                                : `VIP · ${ev.title}`
                          }
                          onClick={() => pickCardProduct(ev.id, 'vip')}
                        >
                          <span className="eventCard__pickLead">
                            <span className="eventCard__pickLabel">VIP</span>
                          </span>
                          <span className="eventCard__pickAside">
                            <span
                              className={`eventCard__pickPrice ${ev.soldOut ? 'eventCard__pickPrice--empty' : ''}`}
                              aria-hidden={ev.soldOut}
                            >
                              {!ev.soldOut ? (vipEv ? `from ${formatPrice(vipEv.price)}` : '—') : '\u00a0'}
                            </span>
                            <span className="eventCard__pickChevron" aria-hidden>
                              ›
                            </span>
                          </span>
                        </button>
                      </div>
                    </motion.article>
                  )
                })
              )}
            </motion.div>
          </section>

          <PachaResidenciesBlock
            reduce={reduce}
            month={month}
            onMonthChange={setMonth}
            onShowMore={() => {
              setMonth('all')
              scrollToEl(filterSectionRef.current, -8)
            }}
          />

          <PachaFooter reduce={reduce} />
        </div>
      </main>
    </>
  )
}
