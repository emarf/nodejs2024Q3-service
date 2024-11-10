import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/albums/interfaces/album.interface';
import { Artist } from 'src/artists/interfaces/artists.interface';
import { DatabaseService } from 'src/database/database.service';
import {
  FavoriteAlbum,
  FavoriteArtist,
  FavoriteTrack,
} from 'src/favorites/interfaces/favorite.interface';
import { Track } from 'src/tracks/interfaces/track.interface';

@Injectable()
export class FavoritesService {
  constructor(private databaseService: DatabaseService) {}

  async findAll() {
    try {
      const trackIds = await this.databaseService.getAll<FavoriteTrack>(
        'favoritesTracks',
      );
      const albumIds = await this.databaseService.getAll<FavoriteAlbum>(
        'favoritesAlbums',
      );
      const artistIds = await this.databaseService.getAll<FavoriteArtist>(
        'favoritesArtists',
      );

      const tracks = await Promise.all(
        trackIds.map((id) => this.databaseService.getOne<Track>('tracks', id)),
      );
      const albums = await Promise.all(
        albumIds.map((id) => this.databaseService.getOne<Album>('albums', id)),
      );
      const artists = await Promise.all(
        artistIds.map((id) =>
          this.databaseService.getOne<Artist>('artists', id),
        ),
      );

      return {
        tracks: tracks.filter(Boolean),
        albums: albums.filter(Boolean),
        artists: artists.filter(Boolean),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get favorites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addTrack(trackId: string) {
    try {
      const track = await this.databaseService.getOne<Track>('tracks', trackId);

      if (!track) {
        throw new HttpException(
          'Track does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.databaseService.create<FavoriteTrack>(
        'favoritesTracks',
        trackId,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to add track',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addAlbum(albumId: string) {
    try {
      const album = await this.databaseService.getOne<Album>('albums', albumId);

      if (!album) {
        throw new HttpException(
          'Album does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.databaseService.create<FavoriteAlbum>(
        'favoritesAlbums',
        albumId,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to add album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addArtist(artistId: string) {
    try {
      const artist = await this.databaseService.getOne<Artist>(
        'artists',
        artistId,
      );

      if (!artist) {
        throw new HttpException(
          'Artist does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.databaseService.create<FavoriteArtist>(
        'favoritesArtists',
        artistId,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to add artist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeTrackFromFavorites(trackId: string) {
    try {
      const tracks = await this.databaseService.getAll<FavoriteTrack>(
        'favoritesTracks',
      );

      if (!tracks.some((track) => track === trackId)) {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      }

      await this.databaseService.deleteTest('favoritesTracks', trackId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to remove track',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeAlbumFromFavorites(albumId: string) {
    try {
      const albums = await this.databaseService.getAll<FavoriteAlbum>(
        'favoritesAlbums',
      );

      if (!albums.some((album) => album === albumId)) {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }

      await this.databaseService.deleteTest('favoritesAlbums', albumId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to remove album',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeArtistFromFavorites(artistId: string) {
    try {
      const artists = await this.databaseService.getAll<FavoriteArtist>(
        'favoritesArtists',
      );

      if (!artists.some((artist) => artist === artistId)) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }

      await this.databaseService.deleteTest('favoritesArtists', artistId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to remove artist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeTrack(trackId: string) {
    await this.databaseService.deleteTest('favoritesTracks', trackId);
  }

  async removeAlbum(albumId: string) {
    await this.databaseService.deleteTest('favoritesAlbums', albumId);
  }

  async removeArtist(artistId: string) {
    await this.databaseService.deleteTest('favoritesArtists', artistId);
  }
}
