"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit, Trash2, Music, Calendar } from "lucide-react"
import { Artist } from "@/core/types/artist"
import { ArtistTypeLabels } from "@/core/types/enums"
import Link from "next/link";

interface ColumnsProps {
    onEdit: (artist: Artist) => void;
    onDelete: (artist: Artist) => void;
}



export const getColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Artist>[] => [
    {
        accessorKey: "name",
        header: "Nome",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {row.original.name.charAt(0)}
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{row.original.name}</span>
            </div>
        )
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => (
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                {ArtistTypeLabels[row.original.type] || row.original.type}
            </span>
        )
    },
    {
        accessorKey: "formationYear",
        header: "Ano de Formação",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{row.original.formationYear || '-'}</span>
            </div>
        )
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-1">
                    <Link
                        href={`/artists/${row.original.id}`}
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Visualizar"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
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

export const columns: ColumnDef<Artist>[] = getColumns({
    onEdit: (artist) => console.log("Edit", artist),
    onDelete: (artist) => console.log("Delete", artist),
});