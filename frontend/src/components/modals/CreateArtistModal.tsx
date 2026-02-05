'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { ArtistService } from '@/services/artist.service';
import { CreateArtistRequest } from '@/core/types/artist';
import { ArtistType, ArtistTypeLabels } from '@/core/types/enums';

interface CreateArtistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateArtistModal({ isOpen, onClose, onSuccess }: CreateArtistModalProps) {
    const [formData, setFormData] = useState<CreateArtistRequest>({
        name: '',
        type: ArtistType.SOLO,
        formationYear: new Date().getFullYear(),
        biography: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await ArtistService.create(formData);
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                name: '',
                type: ArtistType.SOLO,
                formationYear: new Date().getFullYear(),
                biography: '',
            });
        } catch (err: any) {
            setError(err.message || 'Erro ao criar artista');
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
        <Modal isOpen={isOpen} onClose={handleClose} title="Novo Artista" maxWidth="lg">
            <form onSubmit={handleSubmit} className="flex flex-col" style={{ maxHeight: '70vh' }}>
                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 pr-2 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nome do Artista *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                            placeholder="Ex: The Beatles"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tipo *
                        </label>
                        <select
                            required
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as ArtistType })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                        >
                            {Object.values(ArtistType).map((type) => (
                                <option key={type} value={type}>
                                    {ArtistTypeLabels[type]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Formation Year */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ano de Formação
                        </label>
                        <input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={formData.formationYear || ''}
                            onChange={(e) => setFormData({ ...formData, formationYear: parseInt(e.target.value) || undefined })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                            placeholder="Ex: 1960"
                        />
                    </div>

                    {/* Biography */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Biografia
                        </label>
                        <textarea
                            rows={3}
                            value={formData.biography || ''}
                            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
                            placeholder="Conte um pouco sobre o artista..."
                        />
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
                        {isSubmitting ? 'Criando...' : 'Criar Artista'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
