"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { getColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { albumsStore, AlbumsState } from "@/state/albums/albums.store"
import { Pagination } from "@/components/ui/pagination-controls"
import { Search, ChevronDown, Music, Plus, Edit, Trash2, Wifi, WifiOff } from "lucide-react"

import Image from "next/image"

import { AlbumSlider } from "./album-slider"
import { LayoutGrid, List } from "lucide-react"
import CreateAlbumModal from "@/components/modals/CreateAlbumModal"
import EditAlbumModal from "@/components/modals/EditAlbumModal"
import { Album } from "@/core/types/album"
import { AlbumService } from "@/services/album.service"
import { useAlbumUpdates, useWebSocket } from "@/hooks/useWebSocket"

export default function AlbumsPage() {
    const [state, setState] = useState<AlbumsState>(albumsStore.snapshot)
    const [viewMode, setViewMode] = useState<'slider' | 'table'>('slider')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
    const [notification, setNotification] = useState<string | null>(null)
    const { isConnected } = useWebSocket()

    // WebSocket handlers for real-time updates
    const handleAlbumCreated = useCallback(() => {
        setNotification('Novo álbum adicionado!')
        albumsStore.loadAlbums()
        setTimeout(() => setNotification(null), 3000)
    }, [])

    const handleAlbumUpdated = useCallback(() => {
        setNotification('Álbum atualizado!')
        albumsStore.loadAlbums()
        setTimeout(() => setNotification(null), 3000)
    }, [])

    const handleAlbumDeleted = useCallback(() => {
        setNotification('Álbum removido!')
        albumsStore.loadAlbums()
        setTimeout(() => setNotification(null), 3000)
    }, [])

    // Subscribe to album updates via WebSocket
    useAlbumUpdates(handleAlbumCreated, handleAlbumUpdated, handleAlbumDeleted)

    useEffect(() => {
        const subscription = albumsStore.state$.subscribe(newState => {
            setState(newState)
        })
        albumsStore.loadAlbums()
        return () => subscription.unsubscribe()
    }, [])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        albumsStore.setSearch(e.target.value)
    }

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, direction] = e.target.value.split("-")
        albumsStore.setSort(field, direction as "asc" | "desc")
    }

    const handleEdit = (album: Album) => {
        setSelectedAlbum(album)
        setIsEditModalOpen(true)
    }

    const handleDelete = async (album: Album) => {
        if (window.confirm(`Tem certeza que deseja excluir o álbum "${album.title}"?`)) {
            try {
                await AlbumService.delete(album.id)
                albumsStore.loadAlbums()
            } catch (error) {
                alert('Erro ao excluir álbum')
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

            {/* Header with WebSocket Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isConnected ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            <Wifi className="w-3 h-3" />
                            Tempo real
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            <WifiOff className="w-3 h-3" />
                            Offline
                        </span>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-4 z-30 rounded-3xl p-4 shadow-xl border border-white/20 dark:border-gray-700/50 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar álbum..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-all"
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1.5 rounded-2xl mr-2">
                        <button
                            onClick={() => setViewMode('slider')}
                            className={`p-2 px-4 rounded-xl flex items-center gap-2 transition-all ${viewMode === 'slider' ? 'bg-white dark:bg-gray-800 shadow-md text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="text-sm font-bold">Slider</span>
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 px-4 rounded-xl flex items-center gap-2 transition-all ${viewMode === 'table' ? 'bg-white dark:bg-gray-800 shadow-md text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <List className="w-4 h-4" />
                            <span className="text-sm font-bold">Tabela</span>
                        </button>
                    </div>

                    <div className="relative flex-1 lg:w-auto">
                        <select
                            className="w-full lg:w-52 appearance-none pl-5 pr-12 py-3 bg-gray-100 dark:bg-gray-900/50 rounded-2xl border-none focus:ring-2 focus:ring-purple-500 text-gray-700 dark:text-gray-200 cursor-pointer font-semibold transition-all"
                            onChange={handleSort}
                        >
                            <option value="title-asc">Título (A-Z)</option>
                            <option value="title-desc">Título (Z-A)</option>
                            <option value="releaseYear-asc">Ano (Crescente)</option>
                            <option value="releaseYear-desc">Ano (Decrescente)</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Content */}
            {state.loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-100 border-t-purple-600"></div>
                        <Music className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-600 animate-pulse" />
                    </div>
                    <p className="mt-6 text-gray-500 font-medium tracking-wide">Sincronizando álbuns...</p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                    {viewMode === 'slider' ? (
                        <div className="space-y-10">
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Music className="w-6 h-6 text-purple-500" />
                                        Destaques
                                    </h2>
                                </div>
                                <AlbumSlider albums={state.data} />
                            </section>

                            {/* Complementary cards for mobile or extra info */}
                            <div className="md:hidden space-y-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lista Completa</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {state.data.map(album => {
                                        const primaryCover = album.covers?.find(c => c.primary) || album.covers?.[0];
                                        const url = primaryCover?.presignedUrl;
                                        const artistNames = album.artists?.map(a => a.name) || [];
                                        const coverCount = album.covers?.length || 0;

                                        return (
                                            <div key={album.id} className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-lg flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-purple-50 flex-shrink-0">
                                                    {url ? (
                                                        <Image src={url} alt={album.title} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-purple-500">
                                                            <Music className="w-8 h-8 opacity-20" />
                                                        </div>
                                                    )}
                                                    {coverCount > 1 && (
                                                        <div className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                            {coverCount}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 pr-2 flex-1">
                                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{album.title}</h3>
                                                    {artistNames.length > 0 && (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                            {artistNames.length <= 2
                                                                ? artistNames.join(' & ')
                                                                : `${artistNames[0]} +${artistNames.length - 1}`
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-500 font-medium">{album.releaseYear}</p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <button onClick={() => handleEdit(album)} className="p-1 text-gray-400 hover:text-purple-600"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(album)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 p-2">
                            <DataTable columns={columns} data={state.data} />
                        </div>
                    )}

                    <div className="mt-12 flex justify-center">
                        <Pagination
                            currentPage={state.pageRequest.page}
                            totalPages={state.totalPages}
                            onPageChange={(page) => albumsStore.setPage(page)}
                        />
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-110 z-40"
                aria-label="Criar novo álbum"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Create Album Modal */}
            <CreateAlbumModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => albumsStore.loadAlbums()}
            />

            {/* Edit Album Modal */}
            <EditAlbumModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => albumsStore.loadAlbums()}
                album={selectedAlbum}
            />
        </div>
    )
}

