import Playlist from './playlist'
import { filterImages, imageMin } from './playlist/constructor'
import TrackList from './playlist/list'
import ListItem, { Item } from './playlist/list-item'

import { authorize, request } from './spotify'

describe('Playlist Utility', () => {
    let token: string,
        playlistData: SimplifiedPlaylistObject,
        playlist: Playlist

    beforeAll(() => {
        return authorize().then(
            res => (token = `${res.token_type} ${res.access_token}`)
        ).then(() => {
            const findTestPlaylist = (url: string): Promise<void> => {
                return request("Get a List of a User's Playlists", {
                    token: token,
                    pathParameter: {
                        '{user_id}': 'bkeys818',
                    },
                }).then(res => {
                    const value = res.items.find(
                        item => item.id === '6innvmsboMZC5rdrmY292j'
                    )
                    if (value) playlistData = value
                    else {
                        if (res.next) return findTestPlaylist(res.next)
                        else throw new Error("Couldn't find test playlist")
                    }
                })
            }
            return findTestPlaylist(
                'https://api.spotify.com/v1/users/bkeys818/playlists'
            ).then(() => {
                playlist = new Playlist(playlistData)
                return playlist.loadTracks(token)
            })
        })
    })

    describe(`${Playlist.name} constructor`, () => {

        describe(`Cover image value (${filterImages.name} function)`, () => {
            test.concurrent(`Returns null when all images are smaller than ${imageMin}px.`, async () => {
                expect(
                    filterImages([
                        {
                            url: 'height too small',
                            height: imageMin - 1,
                            width: imageMin + 1,
                        },
                        {
                            url: 'width too small',
                            height: imageMin + 1,
                            width: imageMin - 1,
                        },
                    ])
                ).toBe(null)
            })

            test.concurrent(`Returns smallest Image above ${imageMin}px.`, async () => {
                expect(
                    filterImages([
                        {
                            url: 'Correct Image',
                            height: imageMin + 1,
                            width: imageMin + 1,
                        },
                        {
                            url: 'Larger Image',
                            height: imageMin + 100,
                            width: imageMin + 100,
                        },
                    ])
                ).toBe('Correct Image')
            })

            test.concurrent('If no size is defined for img, return it.', async () => {
                expect(
                    filterImages([
                        {
                            url: 'Correct Image',
                        },
                    ])
                ).toBe('Correct Image')
            })
        })

        describe(`Tracks array (given only url)`, () => {
            let trackList: TrackList
            beforeAll(() => {
                trackList = new TrackList(playlistData.tracks)
            })
    
            test(`${TrackList.prototype.load.name} method.`, () => {
                expect(trackList).toHaveProperty('load')
    
                return trackList.load(token)
            })
    
            test('Data is formatted correctly.', () => {
                expect(trackList).toHaveLength(playlistData.tracks.total)
    
                trackList.forEach(track => {
                    expect(track).toBeDefined()
                })
    
                const randomIndex = Math.floor(Math.random() * (playlist.items.length-1));
                expect(trackList[randomIndex]).toBeInstanceOf(ListItem)
            })
    
            test('Methods and properties from loading are gone.', () => {
                expect(trackList).not.toHaveProperty('loadIndex')
                expect(trackList).not.toHaveProperty('tracksURL')
            })
        })
    
        describe(`Tracks array (given url and some tracks)`, () => {
            let trackList: TrackList
            beforeAll(() => {
                return request("Get a Playlist", {
                    pathParameter: {
                        "{playlist_id}": playlistData.id
                    },
                    token: token
                }).then(res => { trackList = new TrackList(res.tracks) })
            })
    
            test(`${TrackList.prototype.load.name} method.`, () => {
                return trackList.load(token)
            })
    
            test('Data is formatted correctly.', () => {
                expect(trackList).toHaveLength(playlistData.tracks.total)
    
                trackList.forEach(track => {
                    expect(track).toBeDefined()
                })
    
                const randomIndex = Math.floor(Math.random() * (playlist.items.length-1));
                expect(trackList[randomIndex]).toBeInstanceOf(ListItem)
            })
    
            test('Methods and properties from loading are gone.', () => {
                expect(trackList).not.toHaveProperty('loadIndex')
                expect(trackList).not.toHaveProperty('tracksURL')
            })
        })

    })

    describe(`${ListItem.name} class’s ${ListItem.prototype.compare.name} method`, () => {
        const testData = new ListItem({
            id: 'main',
            name: 'Some Song Title',
            album: { name: "Cool Lookin’" },
            artists: [
                { id: 'main artist 1' },
                { id: 'main artist 2' },
            ],
            type: 'track'
        })

        test.concurrent('Ignores tracks without similarities or just same track name.', async () => {
            const compareTo = new ListItem({
                id: 'different',
                name: 'Different Song Title',
                album: { name: "Something random" },
                artists: [
                    { id: 'big man 1' },
                    { id: 'little dude' },
                ],
                type: 'track'
            })
            expect(testData.compare(compareTo)).toBeUndefined()
        })

        test.concurrent('Ignores tracks wiht only same track name.', async () => {
            const compareTo = new ListItem({
                id: 'sameTrackName',
                name: 'Some Song Title',
                album: { name: "Random album" },
                artists: [
                    { id: 'a big artist' },
                    { id: 'a smaller artist' },
                ],
                type: 'track'
            })
            expect(testData.compare(compareTo)).toBeUndefined()
        })

        test.concurrent('Finds tracks with same ID.', async () => {
            const compareTo = new ListItem({
                id: 'main',
                name: 'Has same ID',
                album: { name: "Different album" },
                artists: [
                    { id: 'another artist 1' },
                    { id: 'another artist 2' },
                ],
                type: 'track'
            })
            expect(testData.compare(compareTo)).toStrictEqual(['identical'])
        })

        test.concurrent('Finds tracks with same track name and artist', async () => {
            const compareTo =  new ListItem({
                id: 'sameTrackNameAndArtists',
                name: 'Some Song Title',
                album: { name: "Random" },
                artists: [
                    { id: 'main artist 1' },
                    { id: 'another artist 2' },
                ],
                type: 'track'
            })
            expect(testData.compare(compareTo)).toStrictEqual(['track', 'artists'])
        })

        test.concurrent('Finds tracks with same track name, artist, and album.', async () => {
            const compareTo = new ListItem({
                id: 'sameTrackNameAndArtistsAndAlbum',
                name: 'Some Song Title',
                album: { name: "Cool Lookin’" },
                artists: [
                    { id: 'main artist 1' },
                    { id: 'another artist 2' },
                ],
                type: 'track'
            })
            expect(testData.compare(compareTo)).toStrictEqual(['track', 'artists', 'album'])
            compareTo.track.album.name += ' (Delux)'
            expect(testData.compare(compareTo)).toStrictEqual(['track', 'artists', 'album'])
        })
    })

    describe(`${Playlist.prototype.findDuplicates.name} method`, () => {
        const songIds = {
            'Riri': '1BSUrMIGvz53oIJLwxklS6',
            'the.climb.back': '0FlfN5cbUUpIHCRH8X1M44'
        }

        test("Doesn't throw errors.", () => {
            return playlist.findDuplicates()
        })

        test('Songs with no duplicates', () => {
            expect(playlist.items.length).toEqual(9)
        })

        test('Songs with one duplicate', () => {
            const song = playlist.items.find(item => {
                if (item.track.id === songIds['the.climb.back']) return item
            })
            expect(song?.duplicates).toHaveLength(1)
            song?.duplicates.forEach(duplicate => {
                expect(duplicate.similarities).not.toBeUndefined()
                expect(duplicate.duplicates).toHaveLength(0)
            })
        })

        test('Songs with multiple duplicates', () => {
            const song = playlist.items.find(item => {
                if (item.track.id === songIds['Riri']) return item
            })
            expect(song?.duplicates).toHaveLength(2)
            song?.duplicates.forEach(duplicate => {
                expect(duplicate.similarities).not.toBeUndefined()
                expect(duplicate.duplicates).toHaveLength(0)
            })
        })
    })
})