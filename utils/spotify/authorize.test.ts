import * as Spotify from "."

const environments = ["development", "production"]

describe("Spotify.authorize", () => {

    test.concurrent('access client id', async () => {
        expect(process.env.CLIENT_ID).toEqual(expect.any(String))
    })

    test.concurrent('access client secret', async () => {
        expect(process.env.CLIENT_SECRET).toEqual(expect.any(String))
    })

    test.concurrent('authirization request', async () => {
        expect(Spotify.authorize()).resolves.toEqual(
            expect.objectContaining({
                access_token: expect.any(String),
                token_type: "Bearer",
                expires_in: expect.any(Number),
            })
        )
    })
    
})