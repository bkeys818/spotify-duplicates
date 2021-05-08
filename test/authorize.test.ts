import * as Spotify from "../src/utils/spotify"

const environments = ["development", "production"]

test("Client credentials are valid and working", async () => {
    environments.forEach(env => {
        require("dotenv").config({
            path: `.env.${env}`,
        })
        expect(process.env.CLIENT_ID).toEqual(expect.any(String))
    })

    expect(process.env.CLIENT_SECRET).toEqual(expect.any(String))

    const token = await Spotify.authorize()
    expect(token).toEqual(
        expect.objectContaining({
            access_token: expect.any(String),
            token_type: "Bearer",
            expires_in: expect.any(Number),
        })
    )

    expect(
        await Spotify.request("Get an Album", {
            token: "Bearer " + token.access_token,
            pathParameter: {
                "{id}": "6a8GwYiEMrXgMvZBvuBXrt",
            },
        })
    ).toHaveProperty("artists")
})
