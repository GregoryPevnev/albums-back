DROP MATERIALIZED VIEW AlbumSearch;

DROP FUNCTION SearchAlbums;

DROP TRIGGER UpdateSearchDetails ON albums; -- IMPORTANT: Only update once

DROP TRIGGER UpdateSearchRating ON reviews; -- IMPORTANT: Only update once

DROP FUNCTION UpdateSearch;