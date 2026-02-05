import { Album } from "@/core/types/album";
import { PageRequest } from "@/core/types/page";
import { AlbumService } from "@/services/album.service";
import { BehaviorSubject } from "rxjs";

export interface AlbumsState {
    data: Album[];
    totalPages: number;
    totalElements: number;
    loading: boolean;
    error: string | null;
    pageRequest: PageRequest;
    search: string;
}

const initialState: AlbumsState = {
    data: [],
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
    pageRequest: {
        page: 0,
        size: 5,
        sorts: [{ field: "title", direction: "asc" }],
    },
    search: "",
};

class AlbumsStore {
    private subject = new BehaviorSubject<AlbumsState>(initialState);
    readonly state$ = this.subject.asObservable();

    get snapshot(): AlbumsState {
        return this.subject.getValue();
    }

    private setState(partial: Partial<AlbumsState>) {
        this.subject.next({ ...this.snapshot, ...partial });
    }

    async loadAlbums() {
        this.setState({ loading: true, error: null });
        try {
            const { pageRequest, search } = this.snapshot;
            const response = await AlbumService.getAll(pageRequest, search);
            this.setState({
                data: response.content,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                loading: false,
            });
        } catch (error) {
            this.setState({ loading: false, error: "Failed to load albums" });
        }
    }

    setPage(page: number) {
        const { pageRequest } = this.snapshot;
        this.setState({ pageRequest: { ...pageRequest, page } });
        this.loadAlbums();
    }

    setSearch(search: string) {
        const { pageRequest } = this.snapshot;
        this.setState({
            search,
            pageRequest: { ...pageRequest, page: 0 }
        });
        this.loadAlbums();
    }

    setSort(field: string, direction: "asc" | "desc") {
        const { pageRequest } = this.snapshot;
        this.setState({
            pageRequest: {
                ...pageRequest,
                sorts: [{ field, direction }]
            }
        });
        this.loadAlbums();
    }
}

export const albumsStore = new AlbumsStore();
