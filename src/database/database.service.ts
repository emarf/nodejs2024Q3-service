import { Injectable } from '@nestjs/common';
import { DB_Field } from 'src/types';

@Injectable()
export class DatabaseService {
  private data: Record<DB_Field, any[]> = {
    artists: [],
    albums: [],
    tracks: [],
    users: [],
    favoritesTracks: [],
    favoritesAlbums: [],
    favoritesArtists: [],
  };

  async getAll<T>(field: DB_Field): Promise<T[]> {
    return this.data[field] as T[];
  }

  async getOne<T>(field: DB_Field, id: string): Promise<T> {
    const item = this.data[field].find((item) => item.id === id);

    if (!item) {
      return null;
    }

    return item as T;
  }

  async create<T>(field: DB_Field, dto: T): Promise<T> {
    this.data[field].push(dto);
    return dto;
  }

  async update<T>(field: DB_Field, id: string, dto: Partial<T>): Promise<T> {
    const index = this.data[field].findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    this.data[field][index] = { ...this.data[field][index], ...dto };
    return this.data[field][index] as T;
  }

  async delete(field: DB_Field, id: string): Promise<boolean> {
    const index = this.data[field].findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    this.data[field].splice(index, 1);
    return true;
  }

  async deleteFromFavorites(field: DB_Field, id: string): Promise<boolean> {
    const index = this.data[field].findIndex((item) => item === id);

    if (index === -1) {
      return null;
    }

    this.data[field].splice(index, 1);
    return true;
  }
}
