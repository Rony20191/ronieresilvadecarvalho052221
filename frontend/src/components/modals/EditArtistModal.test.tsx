import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EditArtistModal from './EditArtistModal'
import { ArtistService } from '@/services/artist.service'
import { ArtistType } from '@/core/types/enums'

vi.mock('@/services/artist.service', () => ({
    ArtistService: {
        update: vi.fn(),
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

const mockArtist = {
    id: '123',
    name: 'Existing Artist',
    type: ArtistType.SOLO,
    formationYear: 1990,
    biography: 'Bio',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    albums: []
}

describe('EditArtistModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
        artist: mockArtist
    }

    it('pre-fills form with artist data', () => {
        render(<EditArtistModal {...defaultProps} />)
        expect(screen.getByDisplayValue('Existing Artist')).toBeInTheDocument()
        expect(screen.getByDisplayValue('1990')).toBeInTheDocument()
    })

    it('submits updated data', async () => {
        render(<EditArtistModal {...defaultProps} />)

        fireEvent.change(screen.getByPlaceholderText('Ex: The Beatles'), { target: { value: 'Updated Name' } })
        fireEvent.click(screen.getByText('Salvar Alterações'))

        await waitFor(() => {
            expect(ArtistService.update).toHaveBeenCalledWith('123', expect.objectContaining({
                name: 'Updated Name'
            }))
            expect(defaultProps.onSuccess).toHaveBeenCalled()
        })
    })
})