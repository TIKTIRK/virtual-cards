import { useEffect, useState } from 'react'
import { useAuth } from '../../auth.jsx'
import Logo from '../../components/Logo/Logo.jsx'
import { login as verifyLogin } from '../../api/index.js'

const STORE = 'virtual_cards_demo_v1'
const readCards = userId => {
  try { return JSON.parse(localStorage.getItem(`${STORE}_${userId}`)) || [] }
  catch { return [] }
}
const money = value => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD' }).format(value)
const makeNumber = () => Array.from({ length: 4 }, () => String(Math.floor(1000 + Math.random() * 9000))).join(' ')
const brandName = type => type === 'visa' ? 'VISA' : 'mastercard'

function CardVisual({ card, revealed }) {
  return <div className={`pcard cabinet-virtual-card ${card.status === 'blocked' ? 'is-blocked' : ''}`} aria-label={revealed ? `Виртуальная карта ${card.number}` : 'Скрытые данные виртуальной карты'}>
    <div className="pt">
      <span className="pbrand"><Logo />Виртуальные карты</span>
      <small>{brandName(card.type)}</small>
    </div>
    <div className="chip" aria-hidden="true" />
    <div className="pn">{revealed ? card.number : '•••• •••• •••• ••••'}</div>
    <div className="pb">
      <div><small>Владелец</small>{revealed ? card.holder.toUpperCase() : '••••••••'}</div>
      <div><small>Срок</small>{revealed ? card.expiry : '••/••'}</div>
      <b>{card.currency}</b>
    </div>
    {card.status === 'blocked' && <span className="blocked-stamp">ЗАБЛОКИРОВАНА</span>}
  </div>
}

function Icon({ name }) {
  const paths = {
    card: <><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 10h20M6 16h4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function Cabinet() {
  const { user } = useAuth()
  const [cards, setCards] = useState(() => readCards(user.id))
  const [modal, setModal] = useState(false)
  const [holder, setHolder] = useState(user.fullName || '')
  const [type, setType] = useState('visa')
  const [currency, setCurrency] = useState('USD')
  const [confirmId, setConfirmId] = useState(null)
  const [openMenuCardId, setOpenMenuCardId] = useState(null)
  const [revealedIds, setRevealedIds] = useState([])
  const [passwordCardId, setPasswordCardId] = useState(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordBusy, setPasswordBusy] = useState(false)

  useEffect(() => { document.title = 'Личный кабинет — Виртуальные карты' }, [])
  useEffect(() => { localStorage.setItem(`${STORE}_${user.id}`, JSON.stringify(cards)) }, [cards, user.id])

  const issue = event => {
    event.preventDefault()
    const name = holder.trim()
    if (!name) return
    const card = { id: crypto.randomUUID(), number: makeNumber(), holder: name, type, currency, expiry: `${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getFullYear() + 4).slice(-2)}`, status: 'active', createdAt: new Date().toISOString() }
    setCards(current => [card, ...current])
    setModal(false)
  }
  const toggleCard = card => {
    const nextStatus = card.status === 'active' ? 'blocked' : 'active'
    setCards(current => current.map(item => item.id === card.id ? { ...item, status: nextStatus } : item))
    setConfirmId(null)
    setRevealedIds(current => current.filter(id => id !== card.id))
  }

  const showCardPasswordForm = cardId => {
    setPasswordCardId(cardId)
    setPassword('')
    setShowPassword(false)
    setPasswordError('')
  }

  const verifyCardPassword = async event => {
    event.preventDefault()
    setPasswordBusy(true)
    setPasswordError('')
    try {
      await verifyLogin({ login: user.email || user.phone, password })
      setRevealedIds(current => [...current.filter(id => id !== passwordCardId), passwordCardId])
      setPasswordCardId(null)
      setPassword('')
    } catch {
      setPasswordError('Неверный пароль. Попробуйте ещё раз.')
    } finally {
      setPasswordBusy(false)
    }
  }

  const activeCards = cards.filter(card => card.status === 'active')
  const blockedCards = cards.filter(card => card.status === 'blocked')
  const renderCard = card => <article className="managed-card" key={card.id}>
    <CardVisual card={card} revealed={revealedIds.includes(card.id)}/>
    <div className="managed-card-info">
      <div className="managed-card-title"><b>{brandName(card.type)} · {card.currency}</b><span className={`status-pill ${card.status}`}>{card.status === 'active' ? '● Активна' : '● Заблокирована'}</span></div>
      <div className="managed-card-actions">
        {card.status === 'active' ? <>
          <div className="card-primary-actions">
            <button type="button" className="text-action">Пополнить</button>
            <button type="button" className="text-action">Оплатить</button>
          </div>
          <div className="card-menu-wrap" onMouseLeave={() => setOpenMenuCardId(null)}>
            <button type="button" className="card-menu-trigger" aria-label="Действия с картой" aria-expanded={openMenuCardId === card.id} onClick={() => setOpenMenuCardId(current => current === card.id ? null : card.id)}><Icon name="more"/></button>
            {openMenuCardId === card.id && <div className="card-menu">
              {confirmId === card.id ? <>
                <button type="button" className="danger" onClick={() => { toggleCard(card); setOpenMenuCardId(null) }}>Подтвердить блокировку</button>
                <button type="button" onClick={() => setConfirmId(null)}>Отмена</button>
              </> : <>
                {revealedIds.includes(card.id)
                  ? <button type="button" onClick={() => { setRevealedIds(current => current.filter(id => id !== card.id)); setOpenMenuCardId(null) }}><Icon name="lock"/>Скрыть данные</button>
                  : <button type="button" onClick={() => { showCardPasswordForm(card.id); setOpenMenuCardId(null) }}><Icon name="lock"/>Показать данные</button>}
                <button type="button" className="danger" onClick={() => { setRevealedIds(current => current.filter(id => id !== card.id)); setConfirmId(card.id) }}><Icon name="lock"/>Заблокировать</button>
              </>}
            </div>}
          </div>
        </> : <button type="button" className="text-action" onClick={() => toggleCard(card)}>Разблокировать</button>}
      </div>
    </div>
  </article>

  return <main id="main" className="cab wrap cabinet-page" tabIndex="-1">
    <div className="cabinet-heading"><div><div className="cabinet-eyebrow">ПРОСТОЕ УПРАВЛЕНИЕ ФИНАНСАМИ</div><h1>Личный кабинет</h1><p className="sub">Здравствуйте, {user.fullName}. Здесь собраны ваши виртуальные карты.</p></div><div className="profile-chip"><span className="profile-avatar">{(user.fullName || 'П').trim().charAt(0).toUpperCase()}</span><span><b>{user.fullName}</b><small>{user.email || user.phone}</small></span></div></div>

    <section className="cabinet-cards-section">
      <div className="cabinet-section-head"><div><div className="cabinet-eyebrow">ВАШИ ПЛАТЁЖНЫЕ СРЕДСТВА</div><h2>Мои карты</h2><p>Выпускайте новые карты и управляйте их статусом.</p></div><button className="btn cabinet-primary" type="button" onClick={() => { setHolder(user.fullName || ''); setModal(true) }}><Icon name="plus" /> Выпустить карту</button></div>
      {cards.length === 0 ? <div className="cabinet-empty"><div className="empty-illustration"><Icon name="card" /></div><h3>У вас пока нет виртуальных карт</h3><p>Выпустите первую карту — это займёт всего несколько секунд.</p></div> : <div className="cabinet-card-groups">{activeCards.length > 0 && <div className="cabinet-card-grid">{activeCards.map(renderCard)}</div>}{blockedCards.length > 0 && <details className="blocked-cards-dropdown"><summary><span>Заблокированные карты</span><span className="blocked-count">{blockedCards.length}</span><span className="dropdown-chevron"><Icon name="arrow" /></span></summary><div className="cabinet-card-grid">{blockedCards.map(renderCard)}</div></details>}</div>}
    </section>


    {passwordCardId && <div className="cabinet-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPasswordCardId(null) }}><section className="cabinet-modal password-modal" role="dialog" aria-modal="true" aria-labelledby="password-title"><div className="modal-head"><div><div className="cabinet-eyebrow">ПОДТВЕРЖДЕНИЕ ЛИЧНОСТИ</div><h2 id="password-title">Показать данные карты</h2></div><button type="button" className="modal-close" onClick={() => setPasswordCardId(null)} aria-label="Закрыть"><Icon name="close" /></button></div><p className="modal-description">Введите пароль от аккаунта, чтобы временно показать номер карты и остальные данные.</p><form className="issue-form" onSubmit={verifyCardPassword}><label>Пароль<span className="password-input-wrap"><input type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" autoFocus required /><button type="button" className="password-visibility" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>{showPassword ? 'Скрыть' : 'Показать'}</button></span></label>{passwordError && <p className="password-error" role="alert">{passwordError}</p>}<div className="modal-actions"><button type="button" className="btn g" onClick={() => setPasswordCardId(null)}>Отмена</button><button type="submit" className="btn" disabled={passwordBusy}>{passwordBusy ? 'Проверка…' : 'Показать данные'}</button></div></form></section></div>}

    {modal && <div className="cabinet-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setModal(false) }}><section className="cabinet-modal" role="dialog" aria-modal="true" aria-labelledby="issue-title"><div className="modal-head"><div><div className="cabinet-eyebrow">НОВАЯ КАРТА</div><h2 id="issue-title">Выпуск виртуальной карты</h2></div><button type="button" className="modal-close" onClick={() => setModal(false)} aria-label="Закрыть"><Icon name="close" /></button></div><p className="modal-description">Укажите параметры карты. После выпуска она появится в списке ваших карт.</p><form onSubmit={issue} className="issue-form"><label>Имя держателя<input value={holder} onChange={event => setHolder(event.target.value)} required maxLength={60} placeholder="Имя Фамилия" /></label><div className="issue-form-row"><label>Платёжная система<select value={type} onChange={event => setType(event.target.value)}><option value="visa">Visa</option><option value="mastercard">Mastercard</option></select></label><label>Валюта<select value={currency} onChange={event => setCurrency(event.target.value)}><option value="USD">USD</option><option value="EUR">EUR</option></select></label></div><div className="modal-actions"><button type="button" className="btn g" onClick={() => setModal(false)}>Отмена</button><button type="submit" className="btn">Выпустить карту <Icon name="arrow" /></button></div></form></section></div>}
  </main>
}
