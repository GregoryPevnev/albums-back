import Id from "../common/id";
import User from "../users/user";
import Album from "./album";

export interface AlbumView {
    id: Id;
    title: string;
    artist: string;
    rating: number;
    by: Id;
}

export interface QueryResult {
    albums: AlbumView[];
    count: number;
    next: boolean;
    page: number;
}

export enum QueryType {
    Search = "search",
    Listing = "list",
    My = "my"
}

export enum SortBy {
    Recent = "recent",
    Top = "top"
}

export interface Search {
    (params: { term?: string }): Promise<QueryResult>;
}

export interface Pagination {
    (params: { page?: number; sort?: SortBy }): Promise<QueryResult>;
}

export interface My {
    (params: { user?: User }): Promise<QueryResult>;
}

export interface FindAlbum {
    (id: Id): Promise<Album>;
}

interface Queries {
    search: Search;
    list: Pagination;
    my: My;
}

export default Queries;
