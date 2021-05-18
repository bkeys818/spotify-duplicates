type EndpointInfoByIndex<i extends number> = [
    {
        url: `https://api.spotify.com/v1/tracks`
        type: 'GET'
    },
    {
        url: `https://api.spotify.com/v1/tracks/${string}`
        type: 'GET'
    },
    {
        url: `https://api.spotify.com/v1/audio-features`
        type: 'GET'
    },
    {
        url: `https://api.spotify.com/v1/audio-features/${string}`
        type: 'GET'
    },
    {
        url: `https://api.spotify.com/v1/audio-analysis/${string}`
        type: 'GET'
    }
][i]

export type EndpointInfo<key extends 'name' | 'url' | 'type'> =
    | Pick<{
        name: 'Get Several Tracks'
        url: EndpointInfoByIndex<0>['url']
        type: EndpointInfoByIndex<0>['type']
      }, key>
    | Pick<{
        name: 'Get a Track'
        url: EndpointInfoByIndex<1>['url']
        type: EndpointInfoByIndex<1>['type']
      }, key>
    | Pick<{
        name: 'Get Audio Features for Several Tracks'
        url: EndpointInfoByIndex<2>['url']
        type: EndpointInfoByIndex<2>['type']
      }, key>
    | Pick<{
        name: 'Get Audio Features for a Track'
        url: EndpointInfoByIndex<3>['url']
        type: EndpointInfoByIndex<3>['type']
      }, key>
    | Pick<{
        name: 'Get Audio Analysis for a Track'
        url: EndpointInfoByIndex<4>['url']
        type: EndpointInfoByIndex<4>['type']
      }, key>


export const requestInfo: {
    [key in EndpointInfo<'name'>['name']]: EndpointInfo<'url' | 'type'>
} = {
    'Get Several Tracks': {
        type: 'GET',
        url: 'https://api.spotify.com/v1/tracks',
    },
    'Get a Track': {
        type: 'GET',
        url: 'https://api.spotify.com/v1/tracks/{id}',
    },
    "Get Audio Features for Several Tracks": {
        type: 'GET',
        url: 'https://api.spotify.com/v1/audio-features'
    },
    'Get Audio Features for a Track': {
        type: 'GET',
        url: 'https://api.spotify.com/v1/audio-features/{id}',
    },
    'Get Audio Analysis for a Track': {
        type: 'GET',
        url: 'https://api.spotify.com/v1/audio-analysis/{id}',
    }
}

export type RequestParams<
R extends
    | EndpointInfo<'name'>['name']
    | EndpointInfo<'url' | 'type'>
> =
      R extends 'Get Several Tracks' ? GetSeveralTracks
    : R extends EndpointInfoByIndex<0> ? GetSeveralTracks
    : R extends 'Get a Track' ? GetTrack
    : R extends EndpointInfoByIndex<1> ? GetTrack
    : R extends "Get Audio Features for Several Tracks" ? GetAudioFeaturesForSeveralTracks
    : R extends EndpointInfoByIndex<2> ? GetAudioFeaturesForSeveralTracks
    : R extends 'Get Audio Features for a Track' ? GetAudioFeaturesForTrack
    : R extends EndpointInfoByIndex<3> ? GetAudioFeaturesForTrack
    : R extends 'Get Audio Analysis for a Track' ? GetAudioAnalysisForTrack
    : R extends EndpointInfoByIndex<4> ? GetAudioAnalysisForTrack
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






export type Response<
R extends
    | EndpointInfo<'name'>['name']
    | EndpointInfo<'url' | 'type'>
> =
      R extends 'Get Several Tracks' ? GetSeveralTracksResponse
    : R extends EndpointInfoByIndex<0> ? GetSeveralTracksResponse
    : R extends 'Get a Track' ? GetTrackResponse
    : R extends EndpointInfoByIndex<1> ? GetTrackResponse
    : R extends "Get Audio Features for Several Tracks" ? GetAudioFeaturesForSeveralTracksResponse
    : R extends EndpointInfoByIndex<2> ? GetAudioFeaturesForSeveralTracksResponse
    : R extends 'Get Audio Features for a Track' ? GetAudioFeaturesForTrackResponse
    : R extends EndpointInfoByIndex<3> ? GetAudioFeaturesForTrackResponse
    : R extends 'Get Audio Analysis for a Track' ? GetAudioAnalysisForTrackResponse
    : R extends EndpointInfoByIndex<4> ? GetAudioAnalysisForTrackResponse
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