import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CreateAlbumModal from './CreateAlbumModal'
import { AlbumService } from '@/services/album.service'
import { ArtistService } from '@/services/artist.service'

vi.mock('@/services/album.service', () => ({
    AlbumService: {
        create: vi.fn(),
    },
}))

vi.mock('@/services/artist.service', () => ({
    ArtistService: {
        getAll: vi.fn(),
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

vi.mock('lucide-react', () => ({
    Upload: () => <span>Upload</span>,
    X: () => <span>Remove</span>,
    Check: () => <span>Check</span>,
    Plus: () => <span>Add</span>,
    ImageIcon: () => <span>ImageIcon</span>,
}))

describe('CreateAlbumModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    }

    beforeEach(() => {
        ArtistService.getAll.mockResolvedValue({
            content: [
                { id: '1', name: 'Artist A' },
                { id: '2', name: 'Artist B' }
            ]
        })
    })

    it('loads artists on open', async () => {
        render(<CreateAlbumModal {...defaultProps} />)
        await waitFor(() => {
            expect(screen.getByText('Artist A')).toBeInTheDocument()
        })
    })

    it('submits form with selected artist', async () => {
        render(<CreateAlbumModal {...defaultProps} />)

        fireEvent.change(screen.getByPlaceholderText('Ex: Abbey Road'), { target: { value: 'New Album' } })

        await waitFor(() => screen.getByText('Artist A'))
        fireEvent.click(screen.getByText('Artist A'))

        fireEvent.click(screen.getByText('Criar Álbum'))

        await waitFor(() => {
            expect(AlbumService.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'New Album',
                    artistIds: ['1']
                }),
                undefined // no files
            )
        })
    })
})