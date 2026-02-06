
import { Artist } from "@/core/types/artist";
import { PageRequest } from "@/core/types/page";
import { ArtistService } from "@/services/artist.service";
import { BehaviorSubject } from "rxjs";

export interface ArtistsState {
    data: Artist[];
    totalPages: number;
    totalElements: number;
    loading: boolean;
    error: string | null;
    pageRequest: PageRequest;
    search: string;
}

const initialState: ArtistsState = {
    data: [],
    totalPages: 0,
    totalElements: 0,
    loading: false,
    error: null,
    pageRequest: {
        page: 0,
        size: 5,
        sorts: [{ field: "name", direction: "asc" }],
    },
    search: "",
};

class ArtistsStore {
    private subject = new BehaviorSubject<ArtistsState>(initialState);
    readonly state$ = this.subject.asObservable();

    get snapshot(): ArtistsState {
        return this.subject.getValue();
    }

    private setState(partial: Partial<ArtistsState>) {
        this.subject.next({ ...this.snapshot, ...partial });
    }

    async loadArtists() {
        this.setState({ loading: true, error: null });
        try {
            const { pageRequest, search } = this.snapshot;
            const response = await ArtistService.getAll(pageRequest, search);
            this.setState({
                data: response.content,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                loading: false,
            });
        } catch (error) {
            this.setState({ loading: false, error: "Failed to load artists" });
        }
    }

    setPage(page: number) {
        const { pageRequest } = this.snapshot;
        this.setState({ pageRequest: { ...pageRequest, page } });
        this.loadArtists();
    }

    setSearch(search: string) {
        const { pageRequest } = this.snapshot;
        this.setState({
            search,
            pageRequest: { ...pageRequest, page: 0 }
        });
        this.loadArtists();
    }

    setSort(field: string, direction: "asc" | "desc") {
        const { pageRequest } = this.snapshot;
        this.setState({
            pageRequest: {
                ...pageRequest,
                sorts: [{ field, direction }]
            }
        });
        this.loadArtists();
    }
}

export const artistsStore = new ArtistsStore();