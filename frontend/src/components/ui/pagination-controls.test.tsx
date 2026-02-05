import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from './pagination-controls'

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    ChevronLeft: () => <span>Prev</span>,
    ChevronRight: () => <span>Next</span>,
    ChevronsLeft: () => <span>First</span>,
    ChevronsRight: () => <span>Last</span>,
}))

describe('Pagination', () => {
    const defaultProps = {
        currentPage: 1,
        totalPages: 5,
        onPageChange: vi.fn(),
    }

    it('renders correctly', () => {
        render(<Pagination {...defaultProps} />)
        expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
    })

    it('disables previous buttons on first page', () => {
        render(<Pagination {...defaultProps} currentPage={0} />)
        // Assuming buttons are rendered in order: First, Prev, Next, Last
        // The content is 'First' (ChevronsLeft) and 'Prev' (ChevronLeft)
        // We can find by text "First" parent button
        expect(screen.getByText('First').closest('button')).toBeDisabled()
        expect(screen.getByText('Prev').closest('button')).toBeDisabled()
    })

    it('disables next buttons on last page', () => {
        render(<Pagination {...defaultProps} currentPage={4} />)
        expect(screen.getByText('Next').closest('button')).toBeDisabled()
        expect(screen.getByText('Last').closest('button')).toBeDisabled()
    })

    it('calls onPageChange with correct page', () => {
        render(<Pagination {...defaultProps} />)
        // Click Next
        fireEvent.click(screen.getByText('Next').closest('button')!)
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
    })
})
