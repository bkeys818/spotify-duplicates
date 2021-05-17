export type Names =
    | 'Get Multiple Albums'
    | 'Get an Album'
    | "Get an Album's Tracks"

export type RequestInfo<R extends Names> =
    R extends 'Get Multiple Albums' ? {
        type: 'GET',
        urlPath: `albums`,
    }
    : R extends 'Get an Album' ? {
        type: 'GET',
        urlPath: `albums/${string}`,
    }
    : R extends "Get an Album's Tracks" ? {
        type: 'GET',
        urlPath: `albums/${string}/tracks`
    }
    : never

export const requestInfo: { [key in Names]: RequestInfo<key> }= {
    'Get Multiple Albums': {
        type: 'GET',
        urlPath: 'albums',
    },
    'Get an Album': {
        type: 'GET',
        urlPath: 'albums/{id}',
    },
    "Get an Album's Tracks": {
        type: 'GET',
        urlPath: 'albums/{id}/tracks',
    },
}

export type RequestParams<R extends Names> = 
      R extends 'Get Multiple Albums' ? GetMultipleAlbums
    : R extends 'Get an Album' ? GetAlbum
    : R extends "Get an Album's Tracks" ? GetAlbumTracks
    : {};

/** Get Spotify catalog information for multiple albums identified by their Spotify IDs. */
interface GetMultipleAlbums {
    queryParameter: {
        /**
         * A comma-separated list of[Spotify IDs](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for albums. Maximum: 20 IDs.
         * @example "4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M"
         */
        ids: string
        /** An [ISO 3166-1 alpha-2 country code](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) orstring `from_token`. Provide this parameter if you want to apply [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/). */
        market?: string
    }
}

/** Get Spotify catalog information for a single album. */
interface GetAlbum {
    pathParameter: {
        /** Spotify ID of the album. */
        '{id}': string
    }
    queryParameter?: {
        /** An [ISO 3166-1 alpha-2 country code](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) orstring `from_token`. Provide this parameter if you want to apply [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/). */
        market?: string
    }
}

/** Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned. */
interface GetAlbumTracks {
    pathParameter: {
        /** Spotify ID of the album. */
        '{id}': string
    }
    queryParameter?: {
        /** An [ISO 3166-1 alpha-2 country code](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) orstring `from_token`. Provide this parameter if you want to apply [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/). */
        market?: string
        /** The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50. */
        limit?: number
        /** The index offirst object to return. Default: 0 (i.e.,first object). Use with limit to get the next set of objects. */
        offset?: number
    }
}

export type Response<R extends Names> = 
      R extends 'Get Multiple Albums' ? GetMultipleAlbumsResponse
    : R extends 'Get an Album' ? GetAlbumResponse
    : R extends "Get an Album's Tracks" ? GetAlbumsTracksResponse
    : {};

/**
 * An object whose key is `"albums"` and whose value is an array of [album objects](https://developer.spotify.com/documentation/web-api/reference/#object-albumobject) in JSON format.
 *
 * Objects are returned in the order requested. If an object is not found, a `null` value is returned in the appropriate position. Duplicate `ids` in the query will result in duplicate objects in the response.
 */
type GetMultipleAlbumsResponse = { albums: (AlbumObject | null)[] }

/** An [album object](https://developer.spotify.com/documentation/web-api/reference/#object-albumobject) in JSON format */
type GetAlbumResponse = AlbumObject

/** An [album object](https://developer.spotify.com/documentation/web-api/reference/#object-albumobject) in JSON format */
type GetAlbumsTracksResponse = PagingObject<AlbumObject>
