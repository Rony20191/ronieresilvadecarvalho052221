import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EditAlbumModal from './EditAlbumModal'
import { AlbumService } from '@/services/album.service'
import { ArtistService } from '@/services/artist.service'
import { ArtistType } from '@/core/types/enums'

vi.mock('@/services/album.service', () => ({
    AlbumService: {
        update: vi.fn(),
    },
}))

vi.mock('@/services/artist.service', () => ({
    ArtistService: {
        getAll: vi.fn().mockResolvedValue({ content: [] }),
        update: vi.fn(),
    },
}))

const mockAlbum = {
    id: '100',
    title: 'Old Album',
    description: 'Desc',
    releaseYear: 2000,
    artists: [{
        id: '1',
        name: 'Artist A',
        type: ArtistType.SOLO,
        formationYear: 2000,
        biography: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        albums: []
    }],
    covers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}

describe('EditAlbumModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
        album: mockAlbum
    }

    beforeEach(() => {
        ArtistService.getAll.mockResolvedValue({
            content: [{ id: '1', name: 'Artist A' }]
        })
    })

    it('pre-fills form data', () => {
        render(<EditAlbumModal {...defaultProps} />)
        expect(screen.getByDisplayValue('Old Album')).toBeInTheDocument()
    })

    it('submits updates', async () => {
        render(<EditAlbumModal {...defaultProps} />)

        fireEvent.change(screen.getByDisplayValue('Old Album'), { target: { value: 'New Title' } })

        fireEvent.click(screen.getByText('Salvar Alterações'))

        await waitFor(() => {
            expect(AlbumService.update).toHaveBeenCalledWith('100', expect.objectContaining({
                title: 'New Title'
            }))
        })
    })
})