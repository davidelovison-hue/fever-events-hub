import { motion } from 'framer-motion'
import { PACHA_CHERRY_SRC } from './pachaAssets'
import { PACHA_RESIDENCES } from './pachaResidencesData'

const easeOut = [0.22, 1, 0.36, 1] as const

export type ResidenceMonth = 'all' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct'

const END_MONTHS: { key: ResidenceMonth; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'may', label: 'MAY' },
  { key: 'jun', label: 'JUN' },
  { key: 'jul', label: 'JUL' },
  { key: 'aug', label: 'AUG' },
  { key: 'sep', label: 'SEP' },
  { key: 'oct', label: 'OCT' },
]

type PachaResidenciesBlockProps = {
  reduce?: boolean
  month: ResidenceMonth
  onMonthChange: (month: ResidenceMonth) => void
  onShowMore?: () => void
}

export function PachaResidenciesBlock({
  reduce = false,
  month,
  onMonthChange,
  onShowMore,
}: PachaResidenciesBlockProps) {
  const duplicated = [...PACHA_RESIDENCES, ...PACHA_RESIDENCES]

  return (
    <motion.section
      className="pachaResidences"
      aria-label="2026 residencies"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={reduce ? { duration: 0.01 } : { duration: 0.55, ease: easeOut }}
    >
      <div className="pachaResidences__track" role="list">
        {duplicated.map((res, i) => (
          <a
            key={`${res.slug}-${i}`}
            className="pachaResidenceCard"
            role="listitem"
            href={res.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="pachaResidenceCard__media">
              <img
                className="pachaResidenceCard__img"
                src={res.image}
                alt=""
                width={280}
                height={380}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className="pachaResidenceCard__name">{res.name}</span>
          </a>
        ))}
      </div>

      <div className="pachaResidences__filters">
        <div className="pachaResidences__months" role="tablist" aria-label="Month">
          {END_MONTHS.map((m) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={month === m.key}
              className={`pachaResidences__month ${month === m.key ? 'pachaResidences__month--active' : ''}`}
              onClick={() => onMonthChange(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <a
          className="pachaResidences__logo"
          href="https://pacha.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pacha Ibiza"
        >
          <img src={PACHA_CHERRY_SRC} alt="" width={36} height={36} decoding="async" />
        </a>
      </div>

      <div className="pachaResidences__moreWrap">
        <button type="button" className="pachaResidences__more" onClick={onShowMore}>
          SHOW MORE
        </button>
      </div>
    </motion.section>
  )
}
