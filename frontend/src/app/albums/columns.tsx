"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2, User, Users, ImageIcon } from "lucide-react"
import { Album } from "@/core/types/album"
import Image from "next/image"

interface ColumnsProps {
    onEdit: (album: Album) => void;
    onDelete: (album: Album) => void;
}

export const getColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Album>[] => [
    {
        accessorKey: "covers",
        header: "Capa",
        cell: ({ row }) => {
            const covers = row.original.covers
            const primaryCover = covers?.find(c => c.primary) || covers?.[0]
            const url = primaryCover?.presignedUrl
            const coverCount = covers?.length || 0

            return (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 group">
                    {url ? (
                        <Image
                            src={url}
                            alt={row.getValue("title")}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-purple-300" />
                        </div>
                    )}
                    {coverCount > 1 && (
                        <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                            {coverCount}
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "title",
        header: "Título",
        cell: ({ row }) => (
            <span className="font-semibold text-gray-900 dark:text-white">{row.getValue("title")}</span>
        )
    },
    {
        accessorKey: "artists",
        header: "Artistas",
        cell: ({ row }) => {
            const artists = row.original.artists || []
            const artistNames = artists.map(a => a.name)
            const hasMultipleArtists = artists.length > 1

            if (artists.length === 0) {
                return <span className="text-gray-400 text-sm italic">Sem artistas</span>
            }

            return (
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        {hasMultipleArtists ? (
                            <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        ) : (
                            <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        )}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm truncate max-w-[180px]">
                        {artistNames.length <= 2
                            ? artistNames.join(' & ')
                            : (
                                <>
                                    {artistNames.slice(0, 2).join(', ')}{' '}
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                                        +{artistNames.length - 2}
                                    </span>
                                </>
                            )
                        }
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "releaseYear",
        header: "Lançamento",
        cell: ({ row }) => (
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                {row.getValue("releaseYear")}
            </span>
        )
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(row.original)}
                        className="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        title="Editar"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(row.original)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Excluir"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )
        },
    },
]
