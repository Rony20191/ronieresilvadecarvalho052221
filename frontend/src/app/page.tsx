"use client"

import { Music, Disc3, Users, Album as AlbumIcon, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

const exampleData = [
  { artist: "Serj Tankian", albums: ["Harakiri", "Black Blooms", "The Rough Dog"] },
  { artist: "Mike Shinoda", albums: ["The Rising Tied", "Post Traumatic", "Post Traumatic EP", "Where'd You Go"] },
  { artist: "Michel Teló", albums: ["Bem Sertanejo", "Bem Sertanejo - O Show (Ao Vivo)", "Bem Sertanejo - (1ª Temporada) - EP"] },
  { artist: "Guns N' Roses", albums: ["Use Your Illusion I", "Use Your Illusion II", "Greatest Hits"] },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Music className="w-40 h-40" />
        </div>
        <div className="absolute bottom-0 left-0 p-8 opacity-10">
          <Disc3 className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">Projeto Prático</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
            Implementação Full Stack Sênior
            <span className="block text-purple-100 text-xl md:text-2xl font-bold mt-2">Java + Angular/React</span>
          </h1>
          <p className="text-purple-50 max-w-2xl text-base md:text-lg opacity-90 leading-relaxed">
            Neste projeto o(a) candidato(a) implementar uma solução fullstack que possibilite o
            <strong className="font-semibold text-white"> gerenciamento de artistas e seus álbuns</strong> conforme
            exemplo a seguir:
          </p>
        </div>
      </div>

      {/* Example Data Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
              <AlbumIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            Exemplo de Dados (Nome / Álbuns)
          </h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {exampleData.map((item, index) => (
            <div
              key={index}
              className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                  {item.artist.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    {item.artist}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.albums.map((album, albumIndex) => (
                      <span
                        key={albumIndex}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-default"
                      >
                        <Disc3 className="w-3.5 h-3.5" />
                        "{album}"
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/artists"
          className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
              <Users className="w-8 h-8" />
            </div>
            <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Artistas</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie os artistas do catálogo musical
          </p>
        </Link>

        <Link
          href="/albums"
          className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-4 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl text-white shadow-lg shadow-pink-500/30">
              <Disc3 className="w-8 h-8" />
            </div>
            <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Álbuns</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Explore e gerencie a coleção de álbuns
          </p>
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Funcionalidades Implementadas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "CRUD Artistas" },
            { icon: Disc3, label: "CRUD Álbuns" },
            { icon: AlbumIcon, label: "Upload de Capas" },
            { icon: Music, label: "Múltiplas Capas" },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl mb-3">
                <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}