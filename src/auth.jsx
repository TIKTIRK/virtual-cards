import { createContext, useContext, useEffect, useState } from 'react'
import * as api from './api/index.js'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [ready, setReady] = useState(false)

	useEffect(() => {
		let alive = true
		api
			.me()
			.then(u => alive && setUser(u))
			.catch(() => {})
			.finally(() => alive && setReady(true))
		return () => {
			alive = false
		}
	}, [])

	const login = async data => setUser(await api.login(data))
	const register = async data => setUser(await api.register(data))
	const logout = async () => {
		try {
			await api.logout()
		} finally {
			setUser(null)
		}
	}

	return (
		<AuthContext.Provider value={{ user, ready, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	)
}
