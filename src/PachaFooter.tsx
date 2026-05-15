import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PACHA_CHERRY_ANIM_SRC,
  PACHA_FAMILIA_BRANDS,
  PACHA_LEGAL_LINKS,
  PACHA_SOCIAL_LINKS,
} from './pachaFamiliaData'

const easeOut = [0.22, 1, 0.36, 1] as const

type PachaFooterProps = {
  reduce?: boolean
}

export function PachaFooter({ reduce = false }: PachaFooterProps) {
  const [activeBrand, setActiveBrand] = useState(0)
  const preview = PACHA_FAMILIA_BRANDS[activeBrand] ?? PACHA_FAMILIA_BRANDS[0]

  return (
    <motion.footer
      className="pachaFooter"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={reduce ? { duration: 0.01 } : { duration: 0.55, ease: easeOut }}
    >
      <div className="pachaFooter__inner">
        <div className="pachaFooter__familiaHead">
          <h2 className="pachaFooter__familiaTitle">La Familia</h2>
          <p className="pachaFooter__familiaTagline">BECOME A PART OF THE PACHA FAMILY</p>
          <img
            className="pachaFooter__cherryAnim"
            src={PACHA_CHERRY_ANIM_SRC}
            alt="Cherry Animation"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="pachaFooter__familiaBody">
          <nav className="pachaFooter__brands" aria-label="Pacha group">
            {PACHA_FAMILIA_BRANDS.map((brand, index) => {
              const isActive = activeBrand === index
              return (
                <a
                  key={brand.href}
                  className={`pachaFooter__brandLink${isActive ? ' pachaFooter__brandLink--active' : ''}`}
                  href={brand.href}
                  target={brand.external ? '_blank' : undefined}
                  rel={brand.external ? 'noopener noreferrer' : undefined}
                  onMouseEnter={() => setActiveBrand(index)}
                  onFocus={() => setActiveBrand(index)}
                >
                  <span className="pachaFooter__brandInner">
                    <span
                      className="pachaFooter__brandRule"
                      aria-hidden={!isActive}
                    />
                    <span className="pachaFooter__brandLabel">{brand.label}</span>
                  </span>
                </a>
              )
            })}
          </nav>

          <div className="pachaFooter__preview" aria-hidden>
            <div className="pachaFooter__previewFrame">
              {PACHA_FAMILIA_BRANDS.map((brand) => (
                <img
                  key={brand.href}
                  className="pachaFooter__previewImg"
                  src={brand.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  data-active={preview.image === brand.image}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pachaFooter__social">
          {PACHA_SOCIAL_LINKS.map((item) => (
            <a
              key={item.href}
              className="pachaFooter__socialLink"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
            >
              <img src={item.icon} alt="" width={32} height={32} decoding="async" />
            </a>
          ))}
        </div>

        <nav className="pachaFooter__legal" aria-label="Legal">
          {PACHA_LEGAL_LINKS.map((item) => (
            <a
              key={item.href}
              className="pachaFooter__legalLink underline-animate"
              href={item.href}
              target={'external' in item && item.external ? '_blank' : undefined}
              rel={'external' in item && item.external ? 'noopener noreferrer' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <p className="pachaFooter__copy">© 2026 Pacha Nightclub All Rights Reserved.</p>
      </div>
    </motion.footer>
  )
}
