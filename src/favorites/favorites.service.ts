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
import { DB_Field } from 'src/types';

@Injectable()
export class FavoritesService {
  constructor(private databaseService: DatabaseService) {}

  async findAll() {
    try {
      const trackIds = await this.databaseService.getAll<FavoriteTrack>(
        DB_Field.FAVORITES_TRACKS,
      );
      const albumIds = await this.databaseService.getAll<FavoriteAlbum>(
        DB_Field.FAVORITES_ALBUMS,
      );
      const artistIds = await this.databaseService.getAll<FavoriteArtist>(
        DB_Field.FAVORITES_ARTISTS,
      );

      const tracks = await Promise.all(
        trackIds.map((id) =>
          this.databaseService.getOne<Track>(DB_Field.TRACKS, id),
        ),
      );
      const albums = await Promise.all(
        albumIds.map((id) =>
          this.databaseService.getOne<Album>(DB_Field.ALBUMS, id),
        ),
      );
      const artists = await Promise.all(
        artistIds.map((id) =>
          this.databaseService.getOne<Artist>(DB_Field.ARTISTS, id),
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
      const track = await this.databaseService.getOne<Track>(
        DB_Field.TRACKS,
        trackId,
      );

      if (!track) {
        throw new HttpException(
          'Track does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.databaseService.create<FavoriteTrack>(
        DB_Field.FAVORITES_TRACKS,
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
      const album = await this.databaseService.getOne<Album>(
        DB_Field.ALBUMS,
        albumId,
      );

      if (!album) {
        throw new HttpException(
          'Album does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.databaseService.create<FavoriteAlbum>(
        DB_Field.FAVORITES_ALBUMS,
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
        DB_Field.ARTISTS,
        artistId,
      );

      if (!artist) {
        throw new HttpException(
          'Artist does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      await this.databaseService.create<FavoriteArtist>(
        DB_Field.FAVORITES_ARTISTS,
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
        DB_Field.FAVORITES_TRACKS,
      );

      if (!tracks.some((track) => track === trackId)) {
        throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
      }

      await this.databaseService.deleteFromFavorites(
        DB_Field.FAVORITES_TRACKS,
        trackId,
      );
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
        DB_Field.FAVORITES_ALBUMS,
      );

      if (!albums.some((album) => album === albumId)) {
        throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
      }

      await this.databaseService.deleteFromFavorites(
        DB_Field.FAVORITES_ALBUMS,
        albumId,
      );
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
        DB_Field.FAVORITES_ARTISTS,
      );

      if (!artists.some((artist) => artist === artistId)) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      }

      await this.databaseService.deleteFromFavorites(
        DB_Field.FAVORITES_ARTISTS,
        artistId,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Failed to remove artist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeTrack(trackId: string) {
    await this.databaseService.deleteFromFavorites(
      DB_Field.FAVORITES_TRACKS,
      trackId,
    );
  }

  async removeAlbum(albumId: string) {
    await this.databaseService.deleteFromFavorites(
      DB_Field.FAVORITES_ALBUMS,
      albumId,
    );
  }

  async removeArtist(artistId: string) {
    await this.databaseService.deleteFromFavorites(
      DB_Field.FAVORITES_ARTISTS,
      artistId,
    );
  }
}
