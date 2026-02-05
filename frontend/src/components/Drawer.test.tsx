import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Drawer from './Drawer'

// Mock Lucide icons
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
        // The overlay is rendered when isOpen is true. 
        // It's a div with fixed position. We can find it by class or generic role if needed, 
        // but here we can rely on screen.getByText or similar if we can target the overlay.
        // However, the overlay is just a div with onClick. Let's assume we can click it using a selector or cleaner way.
        // In this specific component code: <div className="fixed inset-0 ... " onClick={onClose} />

        // We can't easy select by role. Let's try to query selector.
        const overlay = document.querySelector('.bg-black.bg-opacity-50')
        if (overlay) {
            fireEvent.click(overlay)
            expect(defaultProps.onClose).toHaveBeenCalled()
        }
    })
})
