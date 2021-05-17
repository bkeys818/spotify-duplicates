import * as Albums from './albums'
// import * as Artists from './artists'
// import * as Browse from './browse'
// import * as Episodes from './episodes'
// import * as Follow from './follow'
// import * as Library from './library'
// import * as Markets from './markets'
// import * as Personalization from './personalization'
// import * as Player from './player'
import * as Playlists from './playlists'
// import * as Serach from './serach'
// import * as Shows from './shows'
import * as Tracks from './tracks'
// import * as UserProfile from './user-profile'

export type Names = 
    | Albums.Names
    | Playlists.Names
    | Tracks.Names

export type RequestInfo<R extends Names> = 
    R extends Albums.Names ? Albums.RequestInfo<R>
    : R extends Playlists.Names ? Playlists.RequestInfo<R>
    : never;

export const requestInfo: {
    [key in Names]: {
        type: "GET" | "POST" | "PUT" | "DELETE",
        urlPath: string
    }
} = {
    ...Albums.requestInfo,
    ...Playlists.requestInfo,
    ...Tracks.requestInfo,
}

export type RequestParams<R extends Names> = 
    R extends Albums.Names ? Albums.RequestParams<R>
    : R extends Playlists.Names ? Playlists.RequestParams<R>
    : R extends Tracks.Names ? Tracks.RequestParams<R>
    : {};

export type Response<R extends Names> = 
    R extends Albums.Names ? Albums.Response<R>
    : R extends Playlists.Names ? Playlists.Response<R>
    : R extends Tracks.Names ? Tracks.Response<R>
    : never;
