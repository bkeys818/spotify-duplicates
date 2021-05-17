export type Names =
    | 'Get Several Tracks'
    | 'Get a Track'
    | 'Get Audio Features for Several Tracks'
    | 'Get Audio Features for a Track'
    | 'Get Audio Analysis for a Track'

export type RequestInfo<R extends Names> =
    R extends 'Get Several Tracks' ? {
        type: 'GET',
        urlPath: `tracks`,
    }
    : R extends 'Get a Track' ? {
        type: 'GET',
        urlPath: `tracks/${string}`,
    }
    : R extends "Get Audio Features for Several Tracks" ? {
        type: 'GET',
        urlPath: `audio-features`
    }
    : R extends 'Get Audio Features for a Track' ? {
        type: 'GET',
        urlPath: `audio-features/${string}`,
    }
    : R extends 'Get Audio Analysis for a Track' ? {
        type: 'GET',
        urlPath: `audio-analysis/${string}`,
    }
    : never

export const requestInfo: { [key in Names]: RequestInfo<key> }= {
    'Get Several Tracks': {
        type: 'GET',
        urlPath: `tracks`,
    },
    'Get a Track': {
        type: 'GET',
        urlPath: `tracks/{id}`,
    },
    "Get Audio Features for Several Tracks": {
        type: 'GET',
        urlPath: `audio-features`
    },
    'Get Audio Features for a Track': {
        type: 'GET',
        urlPath: `audio-features/{id}`,
    },
    'Get Audio Analysis for a Track': {
        type: 'GET',
        urlPath: `audio-analysis/{id}`,
    }
}

export type RequestParams<R extends Names> = 
      R extends 'Get Several Tracks' ? GetSeveralTracks
    : R extends 'Get a Track' ? GetTrack
    : R extends "Get Audio Features for Several Tracks" ? GetAudioFeaturesForSeveralTracks
    : R extends 'Get Audio Features for a Track' ? GetAudioFeaturesForTrack
    : R extends 'Get Audio Analysis for a Track' ? GetAudioAnalysisForTrack
    : {}

/** Get Spotify catalog information for multiple tracks based on their Spotify IDs. */
interface GetSeveralTracks {
    queryParameter: {
        /**
         * A comma-separated list of[Spotify IDs](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for tracks. Maximum: 20 IDs.
         * @example "4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M"
         */
        ids: string
        /** An [ISO 3166-1 alpha-2 country code](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) orstring `from_token`. Provide this parameter if you want to apply [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/). */
        market?: string
    }
}

/** Get Spotify catalog information for a single track identified by its unique Spotify ID. */
interface GetTrack {
    pathParameter: {
        /** Spotify ID of the track. */
        '{id}': string
    }
    queryParameter?: {
        /** An [ISO 3166-1 alpha-2 country code](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) orstring `from_token`. Provide this parameter if you want to apply [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/). */
        market?: string
    }
}

/** Get audio features for multiple tracks based on their Spotify IDs. */
interface GetAudioFeaturesForSeveralTracks {
    queryParameter: {
        /** A comma-separated list of the [Spotify IDs](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the tracks. Maximum: 100 IDs. */
        ids: string
    }
}

/** Get audio feature information for a single track identified by its unique Spotify ID. */
interface GetAudioFeaturesForTrack {
    pathParameter: {
        /** The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track. */
        '{id}': string
    }
}

/** Get a detailed audio analysis for a single track identified by its unique Spotify ID. */
interface GetAudioAnalysisForTrack {
    pathParameter: {
        /** The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the track. */
        '{id}': string
    }
}






export type Response<R extends Names> = 
      R extends 'Get Several Tracks' ? GetSeveralTracksResponse
    : R extends 'Get a Track' ? GetTrackResponse
    : R extends "Get Audio Features for Several Tracks" ? GetAudioFeaturesForSeveralTracksResponse
    : R extends 'Get Audio Features for a Track' ? GetAudioFeaturesForTrackResponse
    : R extends 'Get Audio Analysis for a Track' ? GetAudioAnalysisForTrackResponse
    : {}

/**
 * An object whose key is `"tracks"` and whose value is an array of [track objects](https://developer.spotify.com/documentation/web-api/reference/#object-trackobject) in JSON format.
 *
 * Objects are returned in the order requested. If an object is not found, a `null` value is returned in the appropriate position. Duplicate `ids` in the query will result in duplicate objects in the response.
 */
type GetSeveralTracksResponse = {
    tracks: TrackObject[]
}

/** An [track object](https://developer.spotify.com/documentation/web-api/reference/#object-trackobject) in JSON format. */
type GetTrackResponse = TrackObject

/**
 * An object whose key is `"audio_features"` and whose value is an array of [audio features objects](https://developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject) in JSON format.
 * 
 * Objects are returned in the order requested. If an object is not found, a `null` value is returned in the appropriate position.
 * 
 * Duplicate `ids` in the query will result in duplicate objects in the response.
 */
type GetAudioFeaturesForSeveralTracksResponse = {
    audio_features: AudioFeaturesObject
}

/** An [audio features object](https://developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject) in JSON format. */
type GetAudioFeaturesForTrackResponse = AudioFeaturesObject

/** An audio analysis object in JSON format. */
type GetAudioAnalysisForTrackResponse = AudioAnalysisObject