import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ArtistsPage from './page'
import { artistsStore, ArtistsState } from '@/state/artists/artists.store'
import { BehaviorSubject } from 'rxjs'
import { ArtistType } from '@/core/types/enums'

const { stateSubject } = vi.hoisted(() => {
    const { BehaviorSubject } = require('rxjs')
    const subject = new BehaviorSubject({
        data: [],
        totalElements: 0,
        totalPages: 0,
        loading: false,
        error: null,
        pageRequest: { page: 0, size: 10, sorts: [] },
        search: ''
    })
    return { stateSubject: subject }
})

vi.mock('@/state/artists/artists.store', () => ({
    artistsStore: {
        state$: stateSubject.asObservable(),
        loadArtists: vi.fn(),
        setSearch: vi.fn(),
        setSort: vi.fn(),
        setPage: vi.fn(),
        snapshot: stateSubject.value
    },
}))

vi.mock('@/hooks/useWebSocket', () => ({
    useWebSocket: () => ({ isConnected: true }),
    useArtistUpdates: vi.fn()
}))

vi.mock('@/services/artist.service', () => ({
    ArtistService: {
        delete: vi.fn(),
    },
}))

vi.mock('@/components/ui/data-table', () => ({
    DataTable: () => <div data-testid="data-table">DataTable</div>
}))

vi.mock('@/components/ui/pagination-controls', () => ({
    Pagination: () => <div data-testid="pagination">Pagination</div>
}))

vi.mock('@/components/modals/CreateArtistModal', () => ({
    default: ({ isOpen }: any) => isOpen ? <div data-testid="create-modal">CreateModal</div> : null
}))

vi.mock('@/components/modals/EditArtistModal', () => ({
    default: ({ isOpen }: any) => isOpen ? <div data-testid="edit-modal">EditModal</div> : null
}))

vi.mock('lucide-react', () => ({
    Search: () => <span>Search</span>,
    ChevronDown: () => <span>Down</span>,
    Plus: () => <span>Plus</span>,
    Users: () => <span>Users</span>,
    Edit: () => <span>Edit</span>,
    Trash2: () => <span>Trash</span>,
    Eye: () => <span>Eye</span>,
    Wifi: () => <span>Wifi</span>,
    WifiOff: () => <span>WifiOff</span>,
}))

describe('ArtistsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        stateSubject.next({
            ...stateSubject.value,
            loading: false,
            data: []
        })
    })

    it('renders loading state', () => {
        stateSubject.next({ ...stateSubject.value, loading: true })
        render(<ArtistsPage />)
        expect(screen.getByText('Carregando artistas...')).toBeInTheDocument()
    })

    it('renders list of artists', () => {
        stateSubject.next({
            ...stateSubject.value,
            loading: false,
            data: [
                {
                    id: '1',
                    name: 'Artist 1',
                    type: ArtistType.SOLO,
                    formationYear: 2000,
                    biography: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    albums: []
                }
            ]
        })
        render(<ArtistsPage />)

        expect(screen.getByTestId('data-table')).toBeInTheDocument()

        expect(screen.getByText('Artist 1')).toBeInTheDocument()
    })

    it('handles search input', () => {
        render(<ArtistsPage />)
        const input = screen.getByPlaceholderText('Buscar por nome...')
        fireEvent.change(input, { target: { value: 'query' } })
        expect(artistsStore.setSearch).toHaveBeenCalledWith('query')
    })

    it('opens create modal', () => {
        render(<ArtistsPage />)
        fireEvent.click(screen.getByLabelText('Criar novo artista'))
        expect(screen.getByTestId('create-modal')).toBeInTheDocument()
    })
})