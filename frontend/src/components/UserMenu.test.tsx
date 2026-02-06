import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UserMenu from './UserMenu'
import { authStore } from '@/state/auth/auth.store'
import { BehaviorSubject } from 'rxjs'

vi.mock('lucide-react', () => ({
    User: () => <span>UserIcon</span>,
    Settings: () => <span>SettingsIcon</span>,
    LogOut: () => <span>LogOutIcon</span>,
    ChevronDown: () => <span>ChevronDown</span>,
}))

const { subject } = vi.hoisted(() => {
    const { BehaviorSubject } = require('rxjs')
    return {
        subject: new BehaviorSubject({
            isAuthenticated: true,
            user: { username: 'TestUser' }
        })
    }
})

vi.mock('@/state/auth/auth.store', () => ({
    authStore: {
        state$: subject.asObservable(),
        logout: vi.fn(),
        snapshot: { isAuthenticated: true, user: { username: 'TestUser' } }
    }
}))

const mockLocation = { href: '' }
Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true
})

describe('UserMenu', () => {
    it('renders user name', () => {
        render(<UserMenu />)
        expect(screen.getByText('TestUser')).toBeInTheDocument()
    })

    it('toggles menu on click', () => {
        render(<UserMenu />)
        const button = screen.getByText('TestUser').closest('button')

        fireEvent.click(button!)
        expect(screen.getByText('Meu Perfil')).toBeInTheDocument()

        fireEvent.click(button!)
        expect(screen.queryByText('Meu Perfil')).not.toBeInTheDocument()
    })

    it('calls logout and redirects', async () => {
        render(<UserMenu />)
        const button = screen.getByText('TestUser').closest('button')
        fireEvent.click(button!) // Open menu

        const logoutBtn = screen.getByText('Sair da Conta')
        fireEvent.click(logoutBtn)

        expect(authStore.logout).toHaveBeenCalled()
        await waitFor(() => {
            expect(window.location.href).toBe('/login')
        })
    })
})