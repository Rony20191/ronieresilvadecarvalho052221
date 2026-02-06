import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SessionTimer from './SessionTimer'
import { authStore } from '@/state/auth/auth.store'
import { BehaviorSubject } from 'rxjs'

vi.mock('lucide-react', () => ({
    Clock: () => <span>Clock</span>,
    RefreshCw: () => <span>Refresh</span>,
}))

const { subject } = vi.hoisted(() => {
    const { BehaviorSubject } = require('rxjs')
    return { subject: new BehaviorSubject({ isAuthenticated: false }) }
})

vi.mock('@/state/auth/auth.store', () => ({
    authStore: {
        state$: subject.asObservable(),
        getTimeRemaining: vi.fn(),
        refreshToken: vi.fn(),
        setAuthState: (state: any) => subject.next(state)
    }
}))

describe('SessionTimer', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.clearAllMocks()
    })

    it('does not render when not authenticated', () => {
        authStore.setAuthState({ isAuthenticated: false })
        render(<SessionTimer />)
        expect(screen.queryByText('Clock')).not.toBeInTheDocument()
    })

    it('renders time when authenticated', async () => {
        authStore.getTimeRemaining.mockReturnValue({ minutes: 5, seconds: 0 })
        authStore.setAuthState({ isAuthenticated: true })

        render(<SessionTimer />)

        expect(screen.getByText('05:00')).toBeInTheDocument()
    })

    it('updates time every second', () => {
        authStore.getTimeRemaining.mockReturnValue({ minutes: 5, seconds: 0 })
        authStore.setAuthState({ isAuthenticated: true })

        render(<SessionTimer />)
        expect(screen.getByText('05:00')).toBeInTheDocument()

        authStore.getTimeRemaining.mockReturnValue({ minutes: 4, seconds: 59 })

        act(() => {
            vi.advanceTimersByTime(1000)
        })

        expect(screen.getByText('04:59')).toBeInTheDocument()
    })
})