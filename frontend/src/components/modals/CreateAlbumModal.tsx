'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import { AlbumService } from '@/services/album.service';
import { ArtistService } from '@/services/artist.service';
import { CreateAlbumRequest } from '@/core/types/album';
import { Artist } from '@/core/types/artist';
import { Upload, X, Check, Plus, ImageIcon } from 'lucide-react';

interface CoverPreview {
    file: File;
    preview: string;
}

interface CreateAlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateAlbumModal({ isOpen, onClose, onSuccess }: CreateAlbumModalProps) {
    const [formData, setFormData] = useState<CreateAlbumRequest>({
        title: '',
        description: '',
        releaseYear: new Date().getFullYear(),
        artistIds: [],
    });
    const [artists, setArtists] = useState<Artist[]>([]);
    const [coverPreviews, setCoverPreviews] = useState<CoverPreview[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadArtists();
        }
    }, [isOpen]);

    const loadArtists = async () => {
        try {
            const resp = await ArtistService.getAll({ page: 0, size: 100, sorts: [{ field: 'name', direction: 'asc' }] });
            setArtists(resp.content);
        } catch (err) {
            console.error('Failed to load artists', err);
        }
    };

    const processFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const validFiles: CoverPreview[] = [];

        fileArray.forEach(file => {
            if (!file.type.startsWith('image/')) {
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Cada imagem deve ter no máximo 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreviews(prev => [...prev, { file, preview: reader.result as string }]);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
        // Reset input so the same file can be selected again
        e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
    };

    const removeCover = (index: number) => {
        setCoverPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const toggleArtist = (id: string) => {
        const currentIds = [...formData.artistIds];
        const index = currentIds.indexOf(id);
        if (index > -1) {
            currentIds.splice(index, 1);
        } else {
            currentIds.push(id);
        }
        setFormData({ ...formData, artistIds: currentIds });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.artistIds.length === 0) {
            setError('Selecione pelo menos um artista');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const files = coverPreviews.map(cp => cp.file);
            await AlbumService.create(formData, files.length > 0 ? files : undefined);
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                title: '',
                description: '',
                releaseYear: new Date().getFullYear(),
                artistIds: [],
            });
            setCoverPreviews([]);
        } catch (err: any) {
            setError(err.message || 'Erro ao criar álbum');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            setError(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Novo Álbum" maxWidth="lg">
            <form onSubmit={handleSubmit} className="flex flex-col" style={{ maxHeight: '80vh' }}>
                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 pr-2 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Multiple Covers Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Capas do Álbum
                            <span className="text-xs text-gray-500 ml-2">(múltiplas permitidas)</span>
                        </label>

                        {/* Drop Zone */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${isDragging
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                                }`}
                        >
                            {/* Cover Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {/* Existing Covers */}
                                {coverPreviews.map((cover, index) => (
                                    <div
                                        key={index}
                                        className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 ring-2 ring-transparent hover:ring-purple-500 transition-all"
                                    >
                                        <img
                                            src={cover.preview}
                                            alt={`Cover ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {index === 0 && (
                                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-md">
                                                Principal
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeCover(index)}
                                            className="absolute top-1 right-1 p-1.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:scale-110"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                            <span className="text-white text-xs font-medium">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Add More Button */}
                                <label
                                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-gray-800/50 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                                >
                                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                    <span className="text-xs text-gray-400 group-hover:text-purple-500 mt-1 font-medium">Adicionar</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleCoverChange}
                                    />
                                </label>
                            </div>

                            {/* Empty State */}
                            {coverPreviews.length === 0 && (
                                <div className="text-center py-6">
                                    <ImageIcon className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        Arraste imagens aqui ou clique em <strong>Adicionar</strong>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        A primeira imagem será a capa principal
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
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

                    {/* Artists Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Artistas *
                        </label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl">
                            {artists.map(artist => (
                                <button
                                    key={artist.id}
                                    type="button"
                                    onClick={() => toggleArtist(artist.id)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${formData.artistIds.includes(artist.id)
                                        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <span className="truncate">{artist.name}</span>
                                    {formData.artistIds.includes(artist.id) && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Release Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ano *
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

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descrição
                            </label>
                            <input
                                type="text"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                placeholder="Breve desc..."
                            />
                        </div>
                    </div>
                </div>

                {/* Fixed Footer with Actions */}
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
                        {isSubmitting ? 'Criando...' : 'Criar Álbum'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
