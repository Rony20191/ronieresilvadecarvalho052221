import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Modal from './Modal'

vi.mock('lucide-react', () => ({
    X: () => <span data-testid="x-icon">X</span>
}))

describe('Modal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        title: 'Test Modal',
        children: <div>Modal Content</div>
    }

    it('does not render when closed', () => {
        render(<Modal {...defaultProps} isOpen={false} />)
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    })

    it('renders correctly when open', () => {
        render(<Modal {...defaultProps} />)
        expect(screen.getByText('Test Modal')).toBeInTheDocument()
        expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', () => {
        render(<Modal {...defaultProps} />)
        fireEvent.click(screen.getByRole('button'))
        expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('calls onClose when escape key is pressed', () => {
        render(<Modal {...defaultProps} />)
        fireEvent.keyDown(document, { key: 'Escape' })
        expect(defaultProps.onClose).toHaveBeenCalled()
    })
})