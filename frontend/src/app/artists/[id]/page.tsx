"use client"

import { useEffect, useState, use } from "react"
import { Artist } from "@/core/types/artist"
import { Album } from "@/core/types/album"
import { ArtistService } from "@/services/artist.service"
import { AlbumService } from "@/services/album.service"
import { ArtistTypeLabels } from "@/core/types/enums"
import { Calendar, FileText, Clock, ArrowLeft, Disc3, Music } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PageProps } from "@/core/types/page"

// Helper to safely unwrap params
function useIds(params: Promise<{ id: string }>) {
    const [id, setId] = useState<string | null>(null);
    useEffect(() => {
        params.then(p => setId(p.id));
    }, [params]);
    return id;
}

export default function ArtistPage({ params }: PageProps) {
    const id = useIds(params);
    const [artist, setArtist] = useState<Artist | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch artist details
                const artistData = await ArtistService.getById(id);
                setArtist(artistData);

                // Fetch albums for this artist
                // We request a larger size to get most albums. 
                // Ideally backend supports pagination for this view too, but we'll fetch first page with large size.
                const albumData = await AlbumService.getAll(
                    { page: 0, size: 50, sorts: [{ field: 'releaseYear', direction: 'desc' }] },
                    undefined,
                    id
                );
                setAlbums(albumData.content);

            } catch (err: any) {
                console.error("Failed to load artist details", err);
                setError("Erro ao carregar informações do artista.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (!id || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-100 border-t-purple-600"></div>
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-xl text-gray-500">{error || "Artista não encontrado"}</p>
                <Link href="/artists" className="text-purple-600 hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Voltar para lista
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Back Button */}
            <Link
                href="/artists"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Voltar</span>
            </Link>

            {/* Artist Header */}
            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Music className="w-64 h-64" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-5xl md:text-6xl font-black shadow-2xl ring-4 ring-white/30">
                        {artist.name.charAt(0)}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{artist.name}</h1>
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold uppercase tracking-wider border border-white/20">
                                {ArtistTypeLabels[artist.type] || artist.type}
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-purple-100 font-medium">
                            <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                <Calendar className="w-5 h-5 opacity-80" />
                                <span>Formado em {artist.formationYear || 'N/A'}</span>
                            </div>
                            {artist.createdAt && (
                                <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                    <Clock className="w-5 h-5 opacity-80" />
                                    <span>Adicionado em {new Date(artist.createdAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                            )}
                        </div>

                        {artist.biography && (
                            <div className="mt-6 max-w-2xl bg-black/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                                <div className="flex items-center gap-2 mb-2 opacity-80">
                                    <FileText className="w-4 h-4" />
                                    <span className="text-sm font-bold uppercase">Biografia</span>
                                </div>
                                <p className="leading-relaxed opacity-95 text-lg">
                                    {artist.biography}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Discography Section */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-2xl">
                        <Disc3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Discografia</h2>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full text-sm font-bold">
                        {albums.length}
                    </span>
                </div>

                {albums.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {albums.map((album) => {
                            const primaryCover = album.covers?.find(c => c.primary) || album.covers?.[0];
                            const coverUrl = primaryCover?.presignedUrl;

                            return (
                                <div key={album.id} className="group bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300">
                                    {/* Cover Image */}
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 mb-4 shadow-inner">
                                        {coverUrl ? (
                                            <Image
                                                src={coverUrl}
                                                alt={album.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-gray-300 dark:text-gray-600">
                                                <Music className="w-16 h-16" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
                                            {album.releaseYear}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate mb-1" title={album.title}>
                                            {album.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5em]">
                                            {album.description || "Sem descrição"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
                        <div className="inline-flex p-4 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
                            <Disc3 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nenhum álbum encontrado</h3>
                        <p className="text-gray-500">Este artista ainda não possui álbuns cadastrados.</p>
                    </div>
                )}
            </div>
        </div>
    )
}