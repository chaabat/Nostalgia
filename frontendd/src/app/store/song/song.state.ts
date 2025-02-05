import { Song } from '../../core/models/song.model';

export interface SongState {
  songs: Song[];
  currentSong: Song | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export const initialState: SongState = {
  songs: [],
  currentSong: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  loading: false,
  error: null
}; 