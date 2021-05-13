import Playlist from '../src/utils/playlist'
import { Unique } from '../src/utils/playlist/track-object'
import { compareTracks, findDuplicates } from '../src/utils/playlist/read-data'

describe('Functions in "track-object.ts" work as intended', () => {
    test('Tracks Class catches duplicates', () => {
        interface TestData {
            duplicates: { track: { name: string; id: string } }[]
            track: {
                name: string
                id: string
            }
        }
        const tracks = (() => {
            const R =
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'
            const result = new Unique(...([] as TestData[]))
            const values = Array.from({
                *[Symbol.iterator]() {
                    for (let i = 0; i < 3; i++) {
                        var id = ''
                        for (let i = 0; i < 8; i++)
                            id += R[Math.floor(Math.random() * R.length)]

                        yield {
                            duplicates: [],
                            track: {
                                name: ['one', 'two', 'three'][i],
                                id: id,
                            },
                        }
                    }
                },
            })
            result.push(...values)
            return result
        })()
        tracks.push({
            duplicates: [],
            track: {
                name: 'duplicate',
                id: tracks[1].track.id,
            },
        })

        expect(tracks.length).toBe(3)
        expect(tracks[1].duplicates.length).toBe(1)
        expect(tracks[1].duplicates[0].track.name).toBe('duplicate')
    })
})

describe('Read Data functions work as intended', () => {
    type tracksKeys = 'main' | 'similar' | 'different'
    const tracks: {
        [key in tracksKeys]: Parameters<typeof compareTracks>[0]
    } = {
        main: {
            name: 'Track Name (ft. An Artist)',
            album: {
                name: 'Album Name',
            },
            artists: [
                {
                    id: 'main-artist',
                },
                {
                    id: 'some-artist',
                },
            ],
        },
        similar: {
            name: 'Track Name (ft. Some Artist)',
            album: {
                name: 'Album Name (Delux)',
            },
            artists: [
                {
                    id: 'main-artist',
                },
            ],
        },
        different: {
            name: 'Some other Track Name (ft. Some Artist)',
            album: {
                name: 'A different Album Name (Also Delux)',
            },
            artists: [
                {
                    id: 'random-artist',
                },
            ],
        },
    }

    test(`${compareTracks.name} function returns 0 for tracks that aren't similar.`, () => {
        const similarity = compareTracks(tracks.main, tracks.different)
        expect(similarity).toBe(0)
    })

    test(`${compareTracks.name} function returns 1 for tracks with only similar titles.`, () => {
        const similarity = compareTracks(
            {
                name: tracks.main.name,
                album: tracks.main.album,
                artists: tracks.main.artists,
            },
            {
                name: tracks.similar.name,
                album: tracks.different.album,
                artists: tracks.different.artists,
            }
        )
        expect(similarity).toBe(1)
    })

    test(`${compareTracks.name} function returns 2 for tracks with only similar titles and albums.`, () => {
        const similarity = compareTracks(
            {
                name: tracks.main.name,
                album: tracks.main.album,
                artists: tracks.main.artists,
            },
            {
                name: tracks.similar.name,
                album: tracks.similar.album,
                artists: tracks.different.artists,
            }
        )
        expect(similarity).toBe(2)
    })

    test(`${compareTracks.name} function returns 3 for tracks with only similar titles, albums, and one of the smae artist.`, () => {
        const similarity = compareTracks(tracks.main, tracks.similar)
        expect(similarity).toBe(3)
    })

    test(`${findDuplicates.name} function works as expected`, () => {
        const playlistTracks: Parameters<
            typeof findDuplicates
        >[0] = Object.values(tracks).map(track => ({
            track: {
                type: 'track',
                ...track,
            },
            duplicates: [],
        }))

        const result = JSON.parse(JSON.stringify(playlistTracks));
        result[0].duplicates.push(...result.splice(1,1))
        expect(findDuplicates(playlistTracks)).toStrictEqual(result)
    })
})
