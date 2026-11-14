import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import Navbar from './layout/Navbar/Navbar.jsx'
import Footer from './layout/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Auth from './pages/Auth/Auth.jsx'
import Cabinet from './pages/Cabinet/Cabinet.jsx'

const HOME_TITLE = 'Виртуальные карты — оплата за рубежом'

function ScrollManager() {
	const { pathname, hash } = useLocation()
	useEffect(() => {
		if (pathname === '/') document.title = HOME_TITLE
		const el = hash && document.getElementById(hash.slice(1))
		if (el) el.scrollIntoView()
		else window.scrollTo({ top: 0, behavior: 'instant' })
	}, [pathname, hash])
	return null
}

function Private({ children }) {
	const { user } = useAuth()
	return user ? children : <Navigate to='/login' replace />
}

export default function App() {
	const { ready } = useAuth()
	if (!ready)
		return (
			<p className='boot' role='status'>
				Загрузка…
			</p>
		)
	return (
		<>
			<a className='skip' href='#main'>
				К основному содержимому
			</a>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Auth mode='login' />} />
				<Route path='/register' element={<Auth mode='register' />} />
				<Route
					path='/cabinet'
					element={
						<Private>
							<Cabinet />
						</Private>
					}
				/>
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			<ScrollManager />
			<Footer />
		</>
	)
}
