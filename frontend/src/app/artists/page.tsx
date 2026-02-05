"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { artistsStore, ArtistsState } from "@/state/artists/artists.store"
import { Pagination } from "@/components/ui/pagination-controls"
import { Search, ChevronDown, Plus, Users, Edit, Trash2, Eye, Wifi, WifiOff } from "lucide-react"
import CreateArtistModal from "@/components/modals/CreateArtistModal"
import EditArtistModal from "@/components/modals/EditArtistModal"
import Link from "next/link"
import { Artist } from "@/core/types/artist"
import { ArtistService } from "@/services/artist.service"
import { useArtistUpdates, useWebSocket } from "@/hooks/useWebSocket"
import { ArtistTypeLabels } from "@/core/types/enums"



export default function ArtistsPage() {
    const [state, setState] = useState<ArtistsState>(artistsStore.snapshot)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    // const [isViewModalOpen, setIsViewModalOpen] = useState(false) // Removed
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
    const [notification, setNotification] = useState<string | null>(null)
    const { isConnected } = useWebSocket()

    // WebSocket handlers for real-time updates
    const handleArtistCreated = useCallback(() => {
        setNotification('Novo artista adicionado!')
        artistsStore.loadArtists()
        setTimeout(() => setNotification(null), 3000)
    }, [])

    const handleArtistUpdated = useCallback(() => {
        setNotification('Artista atualizado!')
        artistsStore.loadArtists()
        setTimeout(() => setNotification(null), 3000)
    }, [])

    const handleArtistDeleted = useCallback(() => {
        setNotification('Artista removido!')
        artistsStore.loadArtists()
        setTimeout(() => setNotification(null), 3000)
    }, [])

    // Subscribe to artist updates via WebSocket
    useArtistUpdates(handleArtistCreated, handleArtistUpdated, handleArtistDeleted)

    useEffect(() => {
        const subscription = artistsStore.state$.subscribe(newState => {
            setState(newState)
        })
        artistsStore.loadArtists()
        return () => subscription.unsubscribe()
    }, [])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        artistsStore.setSearch(e.target.value)
    }

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, direction] = e.target.value.split("-")
        if (field === 'name' || field === 'formationYear') {
            artistsStore.setSort(field, direction as 'asc' | 'desc')
        }
    }



    const handleEdit = (artist: Artist) => {
        setSelectedArtist(artist)
        setIsEditModalOpen(true)
    }

    const handleDelete = async (artist: Artist) => {
        if (window.confirm(`Tem certeza que deseja excluir o artista "${artist.name}"?`)) {
            try {
                await ArtistService.delete(artist.id)
                artistsStore.loadArtists()
            } catch (error) {
                alert('Erro ao excluir artista')
            }
        }
    }

    const columns = useMemo(() => getColumns({
        onEdit: handleEdit,
        onDelete: handleDelete
    }), [])

    return (
        <div className="space-y-8">
            {/* WebSocket Notification Toast */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        <span className="font-medium">{notification}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                {/* WebSocket Status Indicator */}
                <div className="absolute top-4 right-4">
                    {isConnected ? (
                        <span className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Wifi className="w-3 h-3" />
                            Tempo real
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <WifiOff className="w-3 h-3" />
                            Offline
                        </span>
                    )}
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Users className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black mb-3 tracking-tight">Catálogo de Artistas</h1>
                    <p className="text-blue-50 max-w-lg text-lg opacity-90">
                        Gerencie os artistas da sua coleção musical. Adicione, edite ou remova artistas.
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-4 z-30 rounded-3xl p-4 shadow-xl border border-white/20 dark:border-gray-700/50 flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-all"
                        onChange={handleSearch}
                    />
                </div>

                {/* Sort */}
                <div className="relative w-full lg:w-auto">
                    <select
                        className="w-full lg:w-52 appearance-none pl-5 pr-12 py-3 bg-gray-100 dark:bg-gray-900/50 rounded-2xl border-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:text-gray-200 cursor-pointer font-semibold transition-all"
                        onChange={handleSort}
                    >
                        <option value="name-asc">Nome (A-Z)</option>
                        <option value="name-desc">Nome (Z-A)</option>
                        <option value="formationYear-asc">Ano (Crescente)</option>
                        <option value="formationYear-desc">Ano (Decrescente)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
            </div>

            {/* Content */}
            {state.loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-100 border-t-purple-600"></div>
                        <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-600 animate-pulse" />
                    </div>
                    <p className="mt-6 text-gray-500 font-medium tracking-wide">Carregando artistas...</p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                    {/* Desktop: Table */}
                    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 p-2">
                        <DataTable columns={columns} data={state.data || []} />
                    </div>

                    {/* Mobile: Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                        {(state.data || []).map(artist => (
                            <div key={artist.id} className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {artist.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{artist.name}</h3>
                                        <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 rounded-full text-xs font-medium">
                                            {ArtistTypeLabels[artist.type] || artist.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Ano: <strong className="text-gray-900 dark:text-white">{artist.formationYear || '-'}</strong>
                                    </span>
                                    <div className="flex gap-1">
                                        <Link href={`/artists/${artist.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleEdit(artist)} className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(artist)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 flex justify-center">
                        <Pagination
                            currentPage={state.pageRequest.page}
                            totalPages={state.totalPages}
                            onPageChange={(page) => artistsStore.setPage(page)}
                        />
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-110 z-40"
                aria-label="Criar novo artista"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Modals */}
            <CreateArtistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => artistsStore.loadArtists()}
            />

            <EditArtistModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => artistsStore.loadArtists()}
                artist={selectedArtist}
            />

            {/* <ViewArtistModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                artist={selectedArtist}
            /> */}
        </div>
    )
}
