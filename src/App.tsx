import { useState } from 'react'
import { Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import CharacterDetail from './pages/CharacterDetail'
import Rankings from './pages/Rankings'
import Watchlist from './pages/Watchlist'
import Compare from './pages/Compare'
import DfoPedia from './pages/DfoPedia'
import ItemDetail from './pages/ItemDetail'
import SetDetail from './pages/SetDetail'
import SkillGuide from './pages/SkillGuide'
import About from './pages/About'
import NotFound from './pages/NotFound'
import { useLanguage } from './i18n/useLanguage'
import './App.css'

function App() {
  const { t, toggle } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="app">
      <header className="site-header">
        <Link to="/" className="site-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-badge">DF</span>
          <span className="brand-name">{t('brand')}</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label={t('menuLabel')}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-bar" />
          <span className="menu-bar" />
          <span className="menu-bar" />
        </button>
        <nav className={`site-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('navHome')}
          </Link>
          <Link to="/rankings" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('navRankings')}
          </Link>
          <Link to="/items" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('navItems')}
          </Link>
          <Link to="/skills" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('navSkills')}
          </Link>
          <Link to="/watchlist" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('navWatchlist')}
          </Link>
          <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('navAbout')}
          </Link>
          <a className="nav-link" href="https://www.dfoneople.com/" target="_blank" rel="noreferrer">
            {t('navDownload')}
          </a>
          <a
            className="nav-link"
            href="https://www.dfoneople.com/developers/contents/apiDocs"
            target="_blank"
            rel="noreferrer"
          >
            {t('navApiDocs')}
          </a>
          <button
            type="button"
            className="lang-switch"
            onClick={toggle}
            aria-label={t('langSwitchLabel')}
          >
            {t('langSwitch')}
          </button>
        </nav>
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/character/:serverId/:characterId"
            element={<CharacterDetail />}
          />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/items" element={<DfoPedia />} />
          <Route path="/items/:itemId" element={<ItemDetail />} />
          <Route path="/sets/:setItemId" element={<SetDetail />} />
          <Route path="/skills" element={<SkillGuide />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <a
          className="footer-logo-link"
          href="https://www.dfoneople.com/developers"
          target="_blank"
          rel="noreferrer"
          aria-label="Neople Open API"
        >
          <img
            className="footer-logo"
            src="/Official logotype_color.png"
            alt="Neople Open API"
          />
        </a>
        <p className="footer-note">
          {t('footerNote')} · {t('footerDeveloper')}{' '}
          <a href="https://ebrazon.vecodess.com" target="_blank" rel="noreferrer">
            Eduir "Ruingin" Brazon
          </a>
          <br />
          {t('footerIndependent')}{' '}
          <a href="https://www.neople.co.kr" target="_blank" rel="noreferrer">
            {t('footerNeople')}
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App