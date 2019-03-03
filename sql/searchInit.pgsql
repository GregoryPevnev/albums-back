-- Search View
CREATE MATERIALIZED VIEW AlbumSearch AS SELECT 
	albums.id, 
	COALESCE(ratings.rating, 0) AS rating, 
	albums.title, 
	albums.image,
	albums.artist,
	albums.added,
	(
		setweight(to_tsvector('simple', albums.title), 'A') ||
		setweight(to_tsvector('simple', albums.artist), 'B')
	) AS searcher,
	users.id as by
FROM albums
LEFT JOIN (
    SELECT reviews.album, ROUND(AVG(reviews.rating),1) AS rating FROM reviews
    GROUP BY reviews.album
) AS ratings ON ratings.album = albums.id
JOIN users ON users.id = albums.user
FETCH FIRST 20 ROWS ONLY -- Limiting for performance
WITH DATA;

-- Search-Helper
CREATE OR REPLACE FUNCTION SearchAlbums(term TEXT)
RETURNS TABLE (id VARCHAR(255), title VARCHAR(255), artist VARCHAR(255), rating NUMERIC, by VARCHAR(255), added TIMESTAMPTZ, image VARCHAR(255))
AS $$
	DECLARE
		QUERY CONSTANT TSQUERY := plainto_tsquery('simple', term);
	BEGIN
		RETURN QUERY SELECT 
			AlbumSearch.id, AlbumSearch.title, AlbumSearch.artist, 
			AlbumSearch.rating, AlbumSearch.by, AlbumSearch.added, AlbumSearch.image
		FROM AlbumSearch
		WHERE AlbumSearch.searcher @@ QUERY
		ORDER BY ts_rank(AlbumSearch.searcher, QUERY) DESC;
	END;
$$
LANGUAGE plpgsql;


-- Updates
CREATE OR REPLACE FUNCTION UpdateSearch()
RETURNS TRIGGER
AS $$
	BEGIN
		REFRESH MATERIALIZED VIEW AlbumSearch;
		RETURN NEW;
	END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER UpdateSearchDetails
AFTER UPDATE OR DELETE OR INSERT
ON albums
FOR EACH STATEMENT EXECUTE PROCEDURE UpdateSearch(); -- IMPORTANT: Only update once

CREATE TRIGGER UpdateSearchRating
AFTER UPDATE OR DELETE OR INSERT
ON reviews
FOR EACH STATEMENT EXECUTE PROCEDURE UpdateSearch(); -- IMPORTANT: Only update once

-- Indexes and Optimization
CREATE UNIQUE INDEX SearchId ON AlbumSearch USING btree (id);

CREATE INDEX SearchText ON AlbumSearch USING gin (searcher);