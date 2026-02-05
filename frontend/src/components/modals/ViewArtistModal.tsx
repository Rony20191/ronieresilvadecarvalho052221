'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Artist } from '@/core/types/artist';
import { User, Calendar, FileText, Clock } from 'lucide-react';
import { ArtistTypeLabels } from '@/core/types/enums';



interface ViewArtistModalProps {
    isOpen: boolean;
    onClose: () => void;
    artist: Artist | null;
}

export default function ViewArtistModal({ isOpen, onClose, artist }: ViewArtistModalProps) {
    if (!artist) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Artista" maxWidth="md">
            <div className="space-y-6">
                {/* Header with Avatar */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                        {artist.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{artist.name}</h2>
                        <span className="inline-block mt-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                            {ArtistTypeLabels[artist.type] || artist.type}
                        </span>
                    </div>
                </div>

                {/* Details */}
                <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Ano de Formação</span>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {artist.formationYear || 'Não informado'}
                            </p>
                        </div>
                    </div>

                    {artist.biography && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Biografia</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {artist.biography}
                            </p>
                        </div>
                    )}

                    {artist.createdAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>Criado em: {new Date(artist.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </Modal>
    );
}
