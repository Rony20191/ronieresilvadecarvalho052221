import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('handles click events', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Click me</Button>)
        fireEvent.click(screen.getByRole('button', { name: /click me/i }))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders disabled state', () => {
        render(<Button disabled>Disabled</Button>)
        expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled()
    })

    it('applies variant classes', () => {
        render(<Button variant="destructive">Delete</Button>)
        const button = screen.getByRole('button', { name: /delete/i })
        expect(button).toHaveClass('bg-red-500')
    })
})
