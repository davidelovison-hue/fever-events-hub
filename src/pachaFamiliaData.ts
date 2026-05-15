export type PachaFamiliaBrand = {
  label: string
  href: string
  image: string
  external?: boolean
}

export const PACHA_FAMILIA_BRANDS: PachaFamiliaBrand[] = [
  {
    label: 'DESTINO FIVE IBIZA',
    href: 'https://destino.fivehotelsandresorts.com/',
    image:
      'https://pacha-production.s3.eu-west-1.amazonaws.com/assets/cdn-migration/695b3d899749efd97d32e277_Frame-68.avif',
    external: true,
  },
  {
    label: 'PACHA HOTEL',
    href: 'https://pachahotelibiza.com/',
    image:
      'https://pacha-production.s3.eu-west-1.amazonaws.com/assets/cdn-migration/695b3da9754a8115f2dfd4c1_Frame-69.avif',
    external: true,
  },
  {
    label: 'RESTAURANTE PACHA',
    href: 'https://pacha.com/restaurant',
    image:
      'https://pacha-production.s3.eu-west-1.amazonaws.com/assets/cdn-migration/695b3d9b0067a74e4625b76d_Frame-70.avif',
  },
  {
    label: 'PACHA ICONS',
    href: 'https://www.pachaicons.com/dubai/events',
    image:
      'https://pacha-production.s3.eu-west-1.amazonaws.com/assets/cdn-migration/695b3d898397337b445bb6bf_Frame-67.avif',
    external: true,
  },
  {
    label: 'PACHA COLLECTION',
    href: 'https://pachashop.com/',
    image:
      'https://pacha-production.s3.eu-west-1.amazonaws.com/assets/cdn-migration/695b3d89cb3dec584ee55c87_Frame-71.avif',
    external: true,
  },
]

export const PACHA_SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/pachaofficial/',
    icon: 'https://pacha.com/icons/instagram.svg',
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/user/pacha',
    icon: 'https://pacha.com/icons/spotify.svg',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@pachaibizaofficial',
    icon: 'https://pacha.com/icons/tiktok.svg',
  },
  {
    label: 'X',
    href: 'https://x.com/pacha',
    icon: 'https://pacha.com/icons/twitter.svg',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/c/pacha',
    icon: 'https://pacha.com/icons/youtube.svg',
  },
] as const

export const PACHA_LEGAL_LINKS = [
  { label: 'Cookies', href: 'https://pacha.com/cookies' },
  { label: 'Privacy', href: 'https://pacha.com/privacy' },
  { label: 'Terms & Conditions', href: 'https://pacha.com/terms-and-conditions' },
  { label: 'Foundation', href: 'https://www.pacha-foundation.com/', external: true },
  { label: 'Work with us', href: 'https://pacha.com/work-with-us' },
  { label: 'Whistleblowing Channel', href: 'https://pacha.com/whistleblowing' },
  { label: 'Locations & Contact Us', href: 'https://pacha.com/contact-us' },
  { label: 'Press', href: 'https://pacha.com/press' },
] as const

export const PACHA_CHERRY_ANIM_SRC =
  'https://pacha-media-uploads.s3.us-east-1.amazonaws.com/homepage/animated-logo.gif'
