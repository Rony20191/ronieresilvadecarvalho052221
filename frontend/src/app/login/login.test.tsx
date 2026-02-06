import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from './page'
import { authStore } from '@/state/auth/auth.store'
import { useRouter } from 'next/navigation'

vi.mock('@/state/auth/auth.store', () => ({
    authStore: {
        login: vi.fn(),
    },
}))

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}))

vi.mock('lucide-react', () => ({
    Music: () => <span>Music</span>,
    Lock: () => <span>Lock</span>,
    User: () => <span>User</span>,
}))

describe('LoginPage', () => {
    const mockPush = vi.fn()

    beforeEach(() => {
        useRouter.mockReturnValue({ push: mockPush })
    })

    it('renders correctly', () => {
        render(<LoginPage />)
        expect(screen.getByText('Catálogo Musical')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
    })

    it('handles login success', async () => {
        authStore.login.mockResolvedValue(true)

        render(<LoginPage />)

        fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'testuser' } })
        fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password' } })
        fireEvent.click(screen.getByText('Entrar'))

        expect(screen.getByText('Entrando...')).toBeInTheDocument()

        await waitFor(() => {
            expect(authStore.login).toHaveBeenCalledWith('testuser', 'password')
            expect(mockPush).toHaveBeenCalledWith('/')
        })
    })

    it('handles login failure', async () => {
        authStore.login.mockRejectedValue(new Error('Auth failed'))

        render(<LoginPage />)

        fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'wrong' } })
        fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'wrong' } })
        fireEvent.click(screen.getByText('Entrar'))

        await waitFor(() => {
            expect(screen.getByText('Auth failed')).toBeInTheDocument()
        })
    })
})