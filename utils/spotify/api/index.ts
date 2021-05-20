import * as Albums from './albums'
// import * as Episodes from './episodes'
// import * as Library from './library'
import * as Playlists from './playlists'
// import * as Shows from './shows'
import * as Tracks from './tracks'

export const endpoints = {
    ...Albums.endpoints,
    ...Playlists.endpoints,
    ...Tracks.endpoints,
}

export type Names = keyof typeof endpoints
export type EndpointsInfo = typeof endpoints[keyof typeof endpoints]

export type RequestParams<R extends Names | EndpointsInfo> =
      R extends (Albums.Names | Albums.EndpointsInfo) ? Albums.RequestParams<R>
    : R extends (Playlists.Names | Playlists.EndpointsInfo) ? Playlists.RequestParams<R>
    : R extends (Tracks.Names | Tracks.EndpointsInfo) ? Tracks.RequestParams<R>
    : {};

export type Response<R extends Names | EndpointsInfo> =
      R extends (Albums.Names | Albums.EndpointsInfo) ? Albums.Response<R>
    : R extends (Playlists.Names | Playlists.EndpointsInfo) ? Playlists.Response<R>
    : R extends (Tracks.Names | Tracks.EndpointsInfo) ? Tracks.Response<R>
    : never;
