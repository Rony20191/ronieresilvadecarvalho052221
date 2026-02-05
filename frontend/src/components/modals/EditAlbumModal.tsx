'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import { AlbumService } from '@/services/album.service';
import { ArtistService } from '@/services/artist.service';
import { Album, AlbumCover, UpdateAlbumRequest } from '@/core/types/album';
import { Artist } from '@/core/types/artist';
import { X, Plus, Check, Upload, ImageIcon, Users, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface EditAlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    album: Album | null;
}

interface CoverPreview {
    file: File;
    preview: string;
    isNew: true;
}

interface ExistingCover {
    cover: AlbumCover;
    isNew: false;
    toRemove?: boolean;
}

type CoverItem = CoverPreview | ExistingCover;

export default function EditAlbumModal({ isOpen, onClose, onSuccess, album }: EditAlbumModalProps) {
    const [formData, setFormData] = useState<UpdateAlbumRequest>({
        title: '',
        description: '',
        releaseYear: new Date().getFullYear(),
    });
    const [allArtists, setAllArtists] = useState<Artist[]>([]);
    const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
    const [covers, setCovers] = useState<CoverItem[]>([]);
    const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'covers' | 'artists'>('info');

    useEffect(() => {
        if (isOpen) {
            loadArtists();
        }
    }, [isOpen]);

    useEffect(() => {
        if (album) {
            setFormData({
                title: album.title,
                description: album.description,
                releaseYear: album.releaseYear,
            });
            setSelectedArtistIds(album.artists?.map(a => a.id) || []);
            setCovers(album.covers?.map(c => ({ cover: c, isNew: false as const })) || []);
            setCurrentCoverIndex(0);
        }
    }, [album]);

    const loadArtists = async () => {
        try {
            const resp = await ArtistService.getAll({ page: 0, size: 100, sorts: [{ field: 'name', direction: 'asc' }] });
            setAllArtists(resp.content);
        } catch (err) {
            console.error('Failed to load artists', err);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                if (file.size > 5 * 1024 * 1024) {
                    setError('Cada imagem deve ter no máximo 5MB');
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCovers(prev => [...prev, { file, preview: reader.result as string, isNew: true }]);
                };
                reader.readAsDataURL(file);
            });
        }
        e.target.value = '';
    };

    const removeCover = (index: number) => {
        const item = covers[index];
        if (item.isNew) {
            setCovers(prev => prev.filter((_, i) => i !== index));
        } else {
            // Mark existing cover for removal
            setCovers(prev => prev.map((c, i) =>
                i === index && !c.isNew ? { ...c, toRemove: true } : c
            ));
        }
        if (currentCoverIndex >= index && currentCoverIndex > 0) {
            setCurrentCoverIndex(prev => prev - 1);
        }
    };

    const toggleArtist = (id: string) => {
        setSelectedArtistIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(artistId => artistId !== id);
            }
            return [...prev, id];
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!album) return;

        if (selectedArtistIds.length === 0) {
            setError('Selecione pelo menos um artista');
            setActiveTab('artists');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Update basic album info
            await AlbumService.update(album.id, formData);

            // Note: For full cover/artist management, backend endpoints would need to be extended
            // Current implementation updates basic info only

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar álbum');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            setError(null);
            setActiveTab('info');
        }
    };

    const visibleCovers = covers.filter(c => c.isNew || !(c as ExistingCover).toRemove);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Editar Álbum" maxWidth="xl">
            <form onSubmit={handleSubmit} className="flex flex-col" style={{ maxHeight: '80vh' }}>
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('info')}
                        className={`px-4 py-2 font-medium text-sm transition-all border-b-2 -mb-px ${activeTab === 'info'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Informações
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('covers')}
                        className={`px-4 py-2 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 ${activeTab === 'covers'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        Capas ({visibleCovers.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('artists')}
                        className={`px-4 py-2 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 ${activeTab === 'artists'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Artistas ({selectedArtistIds.length})
                    </button>
                </div>

                {error && (
                    <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Content */}
                <div className="overflow-y-auto flex-1 pr-2">
                    {/* Info Tab */}
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Título do Álbum *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                    placeholder="Ex: Abbey Road"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ano de Lançamento *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    value={formData.releaseYear}
                                    onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
                                    placeholder="Conte um pouco sobre o álbum..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Covers Tab */}
                    {activeTab === 'covers' && (
                        <div className="space-y-6">
                            {/* Cover Preview */}
                            {visibleCovers.length > 0 && (
                                <div className="relative">
                                    <div className="aspect-square max-w-[300px] mx-auto rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                                        {(() => {
                                            const current = visibleCovers[currentCoverIndex];
                                            if (!current) return null;
                                            const url = current.isNew ? current.preview : current.cover.presignedUrl;
                                            return url ? (
                                                <Image src={url} alt="Cover" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-16 h-16 text-gray-300" />
                                                </div>
                                            );
                                        })()}

                                        {/* Navigation */}
                                        {visibleCovers.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentCoverIndex(prev => (prev - 1 + visibleCovers.length) % visibleCovers.length)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentCoverIndex(prev => (prev + 1) % visibleCovers.length)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}

                                        {/* Delete button */}
                                        <button
                                            type="button"
                                            onClick={() => removeCover(covers.indexOf(visibleCovers[currentCoverIndex]))}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        {/* Page indicator */}
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                                            {currentCoverIndex + 1} / {visibleCovers.length}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-2">
                                {visibleCovers.map((item, index) => {
                                    const url = item.isNew ? item.preview : item.cover.presignedUrl;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setCurrentCoverIndex(index)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentCoverIndex ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-transparent'
                                                }`}
                                        >
                                            {url ? (
                                                <Image src={url} alt="" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
                                            )}
                                            {item.isNew && (
                                                <div className="absolute top-1 left-1 px-1 text-[10px] bg-green-500 text-white rounded">
                                                    Nova
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}

                                {/* Add button */}
                                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                                    <Plus className="w-6 h-6 text-gray-400" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleCoverChange}
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Artists Tab */}
                    {activeTab === 'artists' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Selecione os artistas associados a este álbum:
                            </p>
                            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto p-2">
                                {allArtists.map(artist => (
                                    <button
                                        key={artist.id}
                                        type="button"
                                        onClick={() => toggleArtist(artist.id)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${selectedArtistIds.includes(artist.id)
                                                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <span className="truncate">{artist.name}</span>
                                        {selectedArtistIds.includes(artist.id) && <Check className="w-4 h-4 flex-shrink-0" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-6 mt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
