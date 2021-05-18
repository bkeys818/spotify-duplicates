import * as Albums from './albums'
// import * as Episodes from './episodes'
// import * as Library from './library'
import * as Playlists from './playlists'
// import * as Shows from './shows'
import * as Tracks from './tracks'

export type EndpointInfo<key extends 'name' | 'url' | 'type'> = 
    | Albums.EndpointInfo<key>
    | Playlists.EndpointInfo<key>
    | Tracks.EndpointInfo<key>

export const endpointInfo: {
    [key in EndpointInfo<'name'>['name']]: EndpointInfo<'url' | 'type'>
} = {
    ...Albums.endpointInfo,
    ...Playlists.requestInfo,
    ...Tracks.requestInfo,
}

export type RequestParams<
    R extends
        | EndpointInfo<'name'>['name']
        | EndpointInfo<'url' | 'type'>
> =
      R extends Albums.EndpointInfo<'name'>['name'] ? Albums.RequestParams<R>
    : R extends Albums.EndpointInfo<'url' | 'type'> ? Albums.RequestParams<R>
    : R extends Playlists.EndpointInfo<'name'>['name'] ? Playlists.RequestParams<R>
    : R extends Playlists.EndpointInfo<'url' | 'type'> ? Playlists.RequestParams<R>
    : R extends Tracks.EndpointInfo<'name'>['name'] ? Tracks.RequestParams<R>
    : R extends Tracks.EndpointInfo<'url' | 'type'> ? Tracks.RequestParams<R>
    : {};

export type Response<
R extends
    | EndpointInfo<'name'>['name']
    | EndpointInfo<'url' | 'type'>
> =
      R extends Albums.EndpointInfo<'name'>['name'] ? Albums.Response<R>
    : R extends Albums.EndpointInfo<'url' | 'type'> ? Albums.Response<R>
    : R extends Playlists.EndpointInfo<'name'>['name'] ? Playlists.Response<R>
    : R extends Playlists.EndpointInfo<'url' | 'type'> ? Playlists.Response<R>
    : R extends Tracks.EndpointInfo<'name'>['name'] ? Tracks.Response<R>
    : R extends Tracks.EndpointInfo<'url' | 'type'> ? Tracks.Response<R>
    : never;
