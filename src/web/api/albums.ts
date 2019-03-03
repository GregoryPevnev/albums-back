import { Router } from "express";
import Bundle from "../bundle";
import { isAppError } from "../../application/common/errors";
import { generateAlbum, updateAlbum } from "../../application/albums/album";
import { generateSongs } from "../../application/albums/song";
import { formatAlbum, formatTracks } from "../formatting";
import { AlbumLoaderFactory } from "../middleware/albumLoad";
import { SortBy } from "../../application/albums/albumQueries";

const createAlbumsApi = (
    { validators, albumRepo, albumsQueries, tracksQuery, resolveURL, findAlbum }: Bundle,
    reviewApi: Router,
    getAlbumLoader: AlbumLoaderFactory
) => {
    const albumsApi = Router();

    albumsApi
        .route("/")
        .get(async (req, res) => {
            const { mode, ...params } = req.query;

            let result;

            if (mode === "search") result = await albumsQueries.search({ term: params.term || "" });
            else if (mode === "my") result = await albumsQueries.my({ user: res.locals.user });
            else
                result = await albumsQueries.list({
                    sort: params.sort || SortBy.Recent,
                    page: Number(params.page || 0)
                });

            // Better to put defaults here
            return res.status(200).json({
                result: {
                    ...result,
                    albums: result.albums.map(album => formatAlbum(album, resolveURL))
                }
            });
        })
        .post(async (req, res) => {
            try {
                const albumData = validators.validateAlbum(req.body);

                const album = generateAlbum(albumData);
                const songs = generateSongs(albumData.songs);
                await albumRepo.save(res.locals.user, album, songs);

                return res.status(201).send({ album: formatAlbum(album, resolveURL) });
            } catch (e) {
                console.log("Cannot Create Album:", e);
                if (!isAppError(e)) return res.status(500).json({ error: { type: "server" } });
                return res.status(400).json({ error: e });
            }
        });

    albumsApi
        .route("/:albumId")
        .get(async (req, res) => {
            const album = await findAlbum(req.params.albumId);
            if (album === null) return res.status(404).json({ error: { type: "not-found" } });
            return res.status(200).json({ album: formatAlbum(album, resolveURL) });
        })
        .delete(getAlbumLoader(true), async (req, res) => {
            await albumRepo.delete(res.locals.album);
            return res.status(204).send();
        })
        .put(getAlbumLoader(true), async (req, res) => {
            try {
                const albumData = validators.validateDetails(req.body);
                const updated = updateAlbum(res.locals.album, albumData);

                await albumRepo.save(res.locals.user, updated, null);

                return res.status(200).send({ album: formatAlbum(updated, resolveURL) });
            } catch (e) {
                console.log("Cannot Update Album:", e);
                if (!isAppError(e)) return res.status(500).json({ error: { type: "server" } });
                return res.status(400).json({ error: e });
            }
        });

    albumsApi.route("/:albumId/songs").get(getAlbumLoader(), async (req, res) => {
        const tracks = await tracksQuery(res.locals.album);

        return res.status(200).send({ songs: formatTracks(tracks, resolveURL) });
    });

    albumsApi
        .route("/:albumId/like")
        .delete(getAlbumLoader(), async (req, res) => {
            await albumRepo.unlike(res.locals.user, res.locals.album);
            return res.status(204).send();
        })
        .put(getAlbumLoader(), async (req, res) => {
            await albumRepo.like(res.locals.user, res.locals.album);
            return res.status(200).send();
        });

    albumsApi.use("/:albumId/reviews", getAlbumLoader(), reviewApi);

    return albumsApi;
};

export default createAlbumsApi;
