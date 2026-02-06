import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CreateArtistModal from './CreateArtistModal'
import { ArtistService } from '@/services/artist.service'
import { ArtistType } from '@/core/types/enums'

vi.mock('@/services/artist.service', () => ({
    ArtistService: {
        create: vi.fn(),
    },
}))

vi.mock('@/components/ui/Modal', () => ({
    default: ({ isOpen, children, title }: any) => {
        return isOpen ? (
            <div data-testid="modal">
                <h1>{title}</h1>
                {children}
            </div>
        ) : null
    },
}))

describe('CreateArtistModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    }

    it('renders correctly', () => {
        render(<CreateArtistModal {...defaultProps} />)
        expect(screen.getByText('Novo Artista')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Ex: The Beatles')).toBeInTheDocument()
    })

    it('validates required fields', async () => {
        render(<CreateArtistModal {...defaultProps} />)
        const submitBtn = screen.getByText('Criar Artista')

        fireEvent.click(submitBtn)

        expect(ArtistService.create).not.toHaveBeenCalled()
    })

    it('submits form with valid data', async () => {
        render(<CreateArtistModal {...defaultProps} />)

        fireEvent.change(screen.getByPlaceholderText('Ex: The Beatles'), { target: { value: 'New Band' } })
        fireEvent.change(screen.getByRole('combobox'), { target: { value: ArtistType.BAND } })
        fireEvent.change(screen.getByPlaceholderText('Ex: 1960'), { target: { value: '2020' } })

        const submitBtn = screen.getByText('Criar Artista')
        fireEvent.click(submitBtn)

        await waitFor(() => {
            expect(ArtistService.create).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New Band',
                type: ArtistType.BAND,
                formationYear: 2020
            }))
            expect(defaultProps.onSuccess).toHaveBeenCalled()
            expect(defaultProps.onClose).toHaveBeenCalled()
        })
    })

    it('displays error message on failure', async () => {
        ArtistService.create.mockRejectedValueOnce(new Error('API Error'))
        render(<CreateArtistModal {...defaultProps} />)

        fireEvent.change(screen.getByPlaceholderText('Ex: The Beatles'), { target: { value: 'Fail Band' } })
        fireEvent.click(screen.getByText('Criar Artista'))

        await waitFor(() => {
            expect(screen.getByText('API Error')).toBeInTheDocument()
        })
    })
})