import { authorize, testToken, Token, request, requestWithURL } from './spotify'
import { SpotifyError } from './spotify/request'

describe('Spotify Utility', () => {
    let token: Token
    
    beforeAll(() => {
        return testToken.then(res => { token = res })
    })

    describe(`${authorize.name} function`, () => {

        test.concurrent('access client id', async () => {
            expect(process.env.CLIENT_ID).toEqual(expect.any(String))
        })
    
        test.concurrent('access client secret', async () => {
            expect(process.env.CLIENT_SECRET).toEqual(expect.any(String))
        })
    
        test.concurrent('authirization request', async () => {
            expect(authorize()).resolves.toEqual(
                expect.objectContaining({
                    access_token: expect.any(String),
                    token_type: "Bearer",
                    expires_in: expect.any(Number),
                })
            )
        })

    })

    const albumID = '7gsWAHLeT0w7es6FofOXk1'

    describe(`${request.name} function`, () => {
        let album: AlbumObject

        test("Doesn't throw error", async () => {
            return await request('Get an Album', {
                token: token,
                pathParameter: {
                    "{id}": albumID
                }
            }).then(res => { album = res })
        })

        test("Response is AlbumObject", () => {
            expect(album).toHaveProperty('album_type', 'album')
        })

        describe('Throws Errors', () => {

            test.concurrent('Invalid token throws Unauthorized error', async () => {
                const func = async () => {
                    await request('Get an Album', {
                        token: 'fdnjksanjkfsajfjs',
                        pathParameter: {
                            "{id}": albumID
                        }
                    })
                }
                expect(func).rejects.toThrowError(SpotifyError)
                expect(func).rejects.toThrowError(/Unauthorized: .+/)
            })
        
            test('Inavalid ID throws Bad Request', async () => {
                const func = async () => {
                    await request('Get an Album', {
                        token: token,
                        pathParameter: {
                            "{id}": 'jkfre3345'
                        }
                    })
                }
                expect(func).rejects.toThrowError(SpotifyError)
                expect(func).rejects.toThrowError(/Bad Request: .+/)
            })

        })
    })

    describe(`${requestWithURL.name} function`, () => {
        let album: AlbumObject

        test("Doesn't throw error", async () => {
            return await requestWithURL({
                url: `https://api.spotify.com/v1/albums/${albumID}`,
                method: 'GET',
                token: token
            }).then(res => { album = res })
        })

        test("Response is AlbumObject", () => {
            expect(album).toHaveProperty('album_type', 'album')
        })

    })

})
