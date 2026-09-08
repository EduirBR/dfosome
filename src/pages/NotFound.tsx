import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'

function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="page-stack">
      <section className="panel">
        <h2>{t('notFoundTitle')}</h2>
        <p className="panel-hint">{t('notFoundText')}</p>
        <Link to="/" className="btn">
          {t('notFoundHome')}
        </Link>
      </section>
    </div>
  )
}

export default NotFound