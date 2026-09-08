import type { JSX } from 'react'
import { useLanguage } from '../i18n/useLanguage'

type IconProps = { color: string; size?: number }

function YoutubeIcon({ color, size = 26 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function FacebookIcon({ color, size = 26 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function XIcon({ color, size = 26 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

function GithubIcon({ color, size = 26 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function PaypalIcon({ color, size = 26 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
    </svg>
  )
}

function GlobeIcon({ color, size = 26 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

interface SocialLink {
  label: string
  handle: string
  href: string
  color: string
  icon: (props: IconProps) => JSX.Element
}

function About() {
  const { t } = useLanguage()

  const socials: SocialLink[] = [
    {
      label: 'YouTube',
      handle: '@Ruingin',
      href: 'https://www.youtube.com/@Ruingin',
      color: '#ff0000',
      icon: YoutubeIcon,
    },
    {
      label: 'Facebook',
      handle: '/Ruingin',
      href: 'https://www.facebook.com/Ruingin',
      color: '#1877f2',
      icon: FacebookIcon,
    },
    {
      label: 'X (Twitter)',
      handle: '@Ruingin',
      href: 'https://x.com/Ruingin',
      color: '#ffffff',
      icon: XIcon,
    },
    {
      label: 'GitHub',
      handle: 'github.com/EduirBR/dfosome',
      href: 'https://github.com/EduirBR/dfosome',
      color: '#e6edf3',
      icon: GithubIcon,
    },
    {
      label: t('aboutPortfolio'),
      handle: 'ebrazon.vecodess.com',
      href: 'https://ebrazon.vecodess.com',
      color: 'var(--accent)',
      icon: GlobeIcon,
    },
  ]

  return (
    <div className="page-stack">
      <section className="panel about-hero">
        <h2>{t('aboutTitle')}</h2>
        <p className="panel-hint">{t('aboutIntro')}</p>
        <p className="panel-hint">{t('aboutText')}</p>
      </section>

      <section className="about-section">
        <h3>{t('aboutSocials')}</h3>
        <div className="about-grid">
          {socials.map((social) => (
            <a
              key={social.label}
              className="about-card"
              href={social.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="about-card-icon">
                {social.icon({ color: social.color })}
              </span>
              <span className="about-card-info">
                <span className="about-card-name">{social.label}</span>
                <span className="about-card-handle">{social.handle}</span>
              </span>
              <span className="about-card-arrow" aria-hidden="true">
                →
              </span>
              <span className="accessibly-hidden">{t('aboutVisit')}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h3>{t('aboutSupportTitle')}</h3>
        <a
          className="about-card about-support"
          href="https://paypal.me/Ruingin"
          target="_blank"
          rel="noreferrer"
        >
          <span className="about-card-icon">
            <PaypalIcon color="#0079c1" />
          </span>
          <span className="about-card-info">
            <span className="about-card-name">PayPal</span>
            <span className="about-card-handle">
              {t('aboutSupportText')} paypal.me/Ruingin
            </span>
          </span>
          <span className="about-card-arrow" aria-hidden="true">
            →
          </span>
          <span className="accessibly-hidden">{t('aboutVisit')}</span>
        </a>
      </section>
    </div>
  )
}

export default About