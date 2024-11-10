import { Injectable } from '@nestjs/common';

type Fields =
  | 'artists'
  | 'albums'
  | 'tracks'
  | 'users'
  | 'favoritesTracks'
  | 'favoritesAlbums'
  | 'favoritesArtists';

@Injectable()
export class DatabaseService {
  private data: Record<Fields, any[]> = {
    artists: [],
    albums: [],
    tracks: [],
    users: [],
    favoritesTracks: [],
    favoritesAlbums: [],
    favoritesArtists: [],
  };

  async getAll<T>(field: Fields): Promise<T[]> {
    return this.data[field] as T[];
  }

  async getOne<T>(field: Fields, id: string): Promise<T> {
    const item = this.data[field].find((item) => item.id === id);

    if (!item) {
      return null;
    }

    return item as T;
  }

  async create<T>(field: Fields, dto: T): Promise<T> {
    this.data[field].push(dto);
    return dto;
  }

  async update<T>(field: Fields, id: string, dto: Partial<T>): Promise<T> {
    const index = this.data[field].findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    this.data[field][index] = { ...this.data[field][index], ...dto };
    return this.data[field][index] as T;
  }

  async delete(field: Fields, id: string): Promise<boolean> {
    const index = this.data[field].findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    this.data[field].splice(index, 1);
    return true;
  }

  async deleteTest(field: Fields, id: string): Promise<boolean> {
    const index = this.data[field].findIndex((item) => item === id);

    if (index === -1) {
      return null;
    }

    this.data[field].splice(index, 1);
    return true;
  }
}
