import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AppBar from './AppBar'

// Mock Child Components
vi.mock('./UserMenu', () => ({
    default: () => <div data-testid="user-menu">UserMenu</div>
}))

vi.mock('./SessionTimer', () => ({
    default: () => <div data-testid="session-timer">SessionTimer</div>
}))

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Menu: () => <span>Menu</span>,
    Bell: () => <span>Bell</span>,
    Search: () => <span>Search</span>,
    Sun: () => <span>Sun</span>,
    Moon: () => <span>Moon</span>,
}))

describe('AppBar', () => {
    const defaultProps = {
        toggleDrawer: vi.fn(),
        isDarkMode: false,
        toggleDarkMode: vi.fn(),
    }

    it('renders correctly', () => {
        render(<AppBar {...defaultProps} />)
        expect(screen.getByText('Musica App')).toBeInTheDocument()
        expect(screen.getByTestId('user-menu')).toBeInTheDocument()
        expect(screen.getByTestId('session-timer')).toBeInTheDocument()
    })

    it('calls toggleDrawer when menu button is clicked', () => {
        render(<AppBar {...defaultProps} />)
        fireEvent.click(screen.getByLabelText('Toggle menu'))
        expect(defaultProps.toggleDrawer).toHaveBeenCalled()
    })

    it('calls toggleDarkMode when theme toggle is clicked', () => {
        render(<AppBar {...defaultProps} />)
        fireEvent.click(screen.getByLabelText('Toggle dark mode'))
        expect(defaultProps.toggleDarkMode).toHaveBeenCalled()
    })

    it('displays correct theme icon', () => {
        const { rerender } = render(<AppBar {...defaultProps} isDarkMode={false} />)
        expect(screen.getByText('Moon')).toBeInTheDocument()

        rerender(<AppBar {...defaultProps} isDarkMode={true} />)
        expect(screen.getByText('Sun')).toBeInTheDocument()
    })
})
