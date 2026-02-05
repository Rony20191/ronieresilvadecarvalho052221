"use client"

import { Album, AlbumCover } from "@/core/types/album"
import { Music, ChevronLeft, ChevronRight, User, Users } from "lucide-react"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

interface AlbumSliderProps {
    albums: Album[]
}

interface CoverCarouselProps {
    covers: AlbumCover[]
    albumTitle: string
}

function CoverCarousel({ covers, albumTitle }: CoverCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    // Auto-rotate covers when hovering
    useEffect(() => {
        if (!isHovering || covers.length <= 1) return

        const interval = setInterval(() => {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % covers.length)
                setIsAnimating(false)
            }, 300)
        }, 2000)

        return () => clearInterval(interval)
    }, [isHovering, covers.length])

    if (!covers || covers.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-purple-400">
                <Music className="w-16 h-16 mb-2 opacity-20" />
                <span className="text-xs font-medium uppercase tracking-widest opacity-40">Sem Capa</span>
            </div>
        )
    }

    const currentCover = covers[currentIndex]
    const url = currentCover?.presignedUrl

    return (
        <div
            className="relative w-full h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false)
                // Reset to primary cover when mouse leaves
                const primaryIndex = covers.findIndex(c => c.primary)
                setCurrentIndex(primaryIndex >= 0 ? primaryIndex : 0)
            }}
        >
            {/* Main Cover Image */}
            <div className={`absolute inset-0 transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {url ? (
                    <Image
                        src={url}
                        alt={albumTitle}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-purple-400 bg-purple-50 dark:bg-purple-900/20">
                        <Music className="w-12 h-12 opacity-20" />
                    </div>
                )}
            </div>

            {/* Cover Indicators - Only show if multiple covers */}
            {covers.length > 1 && (
                <>
                    {/* Dots Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {covers.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCurrentIndex(idx)
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? 'bg-white w-4 shadow-lg'
                                        : 'bg-white/50 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Cover Count Badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-full z-10">
                        {currentIndex + 1}/{covers.length}
                    </div>

                    {/* Navigation Arrows (visible on hover) */}
                    <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setCurrentIndex(prev => (prev - 1 + covers.length) % covers.length)
                            }}
                            className="p-1 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setCurrentIndex(prev => (prev + 1) % covers.length)
                            }}
                            className="p-1 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export function AlbumSlider({ albums }: AlbumSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }

    if (albums.length === 0) return null

    return (
        <div className="relative group">
            {/* Navigation Buttons */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
            >
                <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
            >
                <ChevronRight className="w-6 h-6 text-purple-600" />
            </button>

            {/* Slider Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 -mx-2 px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {albums.map((album) => {
                    const artistNames = album.artists?.map(a => a.name) || []
                    const hasMultipleArtists = artistNames.length > 1

                    return (
                        <div
                            key={album.id}
                            className="flex-none w-[280px] snap-start"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-xl border border-gray-50 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group/card">
                                {/* Cover Image Area */}
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-purple-50 dark:bg-purple-900/20">
                                    <CoverCarousel covers={album.covers || []} albumTitle={album.title} />

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end justify-center pb-10">
                                        <button className="bg-white text-purple-600 p-3 rounded-full hover:scale-110 transition-transform shadow-lg">
                                            <Music className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Album Info */}
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate mb-1">{album.title}</h3>

                                {/* Artists Section */}
                                {artistNames.length > 0 && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex-shrink-0">
                                            {hasMultipleArtists ? (
                                                <Users className="w-4 h-4 text-purple-500" />
                                            ) : (
                                                <User className="w-4 h-4 text-purple-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
                                            {artistNames.length <= 2
                                                ? artistNames.join(' & ')
                                                : `${artistNames.slice(0, 2).join(', ')} +${artistNames.length - 2}`
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* Year and Badge */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{album.releaseYear}</span>
                                    <div className="flex items-center gap-1.5">
                                        {(album.covers?.length || 0) > 1 && (
                                            <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 rounded-full font-semibold">
                                                {album.covers?.length} capas
                                            </span>
                                        )}
                                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    )
}
