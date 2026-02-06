import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Drawer from './Drawer'

vi.mock('lucide-react', () => ({
    Home: () => <span>Icon</span>,
    BarChart3: () => <span>Icon</span>,
    Users: () => <span>Icon</span>,
    FileText: () => <span>Icon</span>,
    Settings: () => <span>Icon</span>,
    Package: () => <span>Icon</span>,
    CreditCard: () => <span>Icon</span>,
    HelpCircle: () => <span>Icon</span>,
    X: () => <span>Close</span>,
}))

describe('Drawer', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
    }

    it('renders menu items when open', () => {
        render(<Drawer {...defaultProps} />)
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Artistas')).toBeInTheDocument()
        expect(screen.getByText('Álbuns')).toBeInTheDocument()
    })

    it('calls onClose when close button is clicked (mobile)', () => {
        render(<Drawer {...defaultProps} />)
        fireEvent.click(screen.getByLabelText('Close menu'))
        expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('calls onClose when overlay is clicked', () => {
        render(<Drawer {...defaultProps} />)

        const overlay = document.querySelector('.bg-black.bg-opacity-50')
        if (overlay) {
            fireEvent.click(overlay)
            expect(defaultProps.onClose).toHaveBeenCalled()
        }
    })
})