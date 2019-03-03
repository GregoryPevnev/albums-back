import Album from "./album";
import Song from "./song";
import Id from "../common/id";
import User from "../users/user";

abstract class AlbumRepo {
    public abstract find(id: Id, user?: User): Promise<Album | null>;
    public abstract delete(album: Album): Promise<any>;

    public abstract save(user: User, album: Album, songs: Song[]): Promise<any>;

    public abstract like(user: User, album: Album): Promise<any>;
    public abstract unlike(user: User, album: Album): Promise<any>;
}

export default AlbumRepo;
