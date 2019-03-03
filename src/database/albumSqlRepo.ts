import _ from "lodash";
import AlbumRepo from "../application/albums/albumRepo";
import Album from "../application/albums/album";
import { stringToTimestamp } from "../application/common/timestamp";
import Knex from "knex";
import Id from "../application/common/id";
import Song from "../application/albums/song";
import { generateId } from "../application/common/id";
import User from "../application/users/user";
import { DeleteObjects } from "../application/albums/upload";

export const ALBUM_TABLE = "albums";
export const SONG_TABLE = "songs";
export const LIKES_TABLE = "likes";

interface AlbumDTO {
    id?: Id;
    title: string;
    artist: string;
    image: string;
    added: string;
    user: Id;
}

interface SongDTO {
    id: Id;
    name: string;
    order: number;
    object: string;
    album: Id;
}

class AlbumSqlRepo extends AlbumRepo {
    private toEntity(data: AlbumDTO): Album {
        return { ..._.pick(data, ["id", "title", "artist", "image"]), added: stringToTimestamp(data.added) };
    }

    private toDTO(user: User, album: Album): AlbumDTO {
        return { ..._.pick(album, ["id", "title", "artist", "image"]), added: album.added.toString(), user: user.id };
    }

    // IMPORTANT: Await manually - Cannot Convert Bluebird to Promise

    private async update(album: AlbumDTO): Promise<any> {
        await this.client
            .update(album)
            .table(ALBUM_TABLE)
            .where({ id: album.id })
            .thenReturn();
    }

    private async insert(album: AlbumDTO, songs: SongDTO[]): Promise<any> {
        await this.client
            .transaction(async client => {
                await client
                    .insert(album)
                    .table(ALBUM_TABLE)
                    .where({ id: album.id })
                    .thenReturn();

                await client
                    .insert(songs)
                    .table(SONG_TABLE)
                    .thenReturn();
            })
            .thenReturn();
    }

    constructor(private readonly client: Knex, private readonly deleteObjects: DeleteObjects) {
        super();
    }

    public async find(id: Id, user?: User): Promise<Album | null> {
        const results = await this.client
            .select(["id", "title", "artist", "added", "user", "image"])
            .from(ALBUM_TABLE)
            .where(user ? { id, user: user.id } : { id });

        if (!results || results.length == 0) return null;
        return this.toEntity(results[0]);
    }

    public async delete(album: Album): Promise<any> {
        // TODO: Refactor
        const songs = await this.client
            .select(["object"])
            .table("songs")
            .where("album", album.id);

        console.log(songs);

        this.deleteObjects([...songs.map((s: any) => s.object), album.image]);

        await this.client
            .delete()
            .table(ALBUM_TABLE)
            .where({ id: album.id })
            .thenReturn();
    }

    public async save(user: User, album: Album, songs: Song[]): Promise<any> {
        const isNew = !album.id;
        if (!album.id) album.id = generateId();

        const albumDTO = this.toDTO(user, album);
        const songDTOs =
            songs === null
                ? null
                : songs.map(({ name, order, object }) => ({
                      id: generateId(),
                      name,
                      order,
                      object,
                      album: album.id
                  }));

        if (isNew) await this.insert(albumDTO, songDTOs);
        else await this.update(albumDTO);
    }

    public async like(user: User, album: Album): Promise<any> {
        // Idempotent (Does not change state if it was liked beforehand)
        await this.client
            .insert({ user: user.id, album: album.id })
            .table(LIKES_TABLE)
            .thenReturn()
            .catch(() => null);
    }

    public async unlike(user: User, album: Album): Promise<any> {
        await this.client
            .delete()
            .table(LIKES_TABLE)
            .where({ user: user.id, album: album.id })
            .thenReturn();
    }
}

export default AlbumSqlRepo;
