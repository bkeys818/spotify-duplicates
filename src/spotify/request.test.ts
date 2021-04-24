import { spotifyRequest } from "./index"
import request from "request"
import fetch from "node-fetch"

function authorize() {
    try {
        const response = new Promise(function (resolve, reject) {
            request.post(
                {
                    url: "https://accounts.spotify.com/api/token",
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                        ).toString("base64")}`,
                    },
                    form: {
                        grant_type: "client_credentials",
                    },
                    json: true,
                },
                (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        resolve(body)
                    } else {
                        // console.log(response.statusCode)
                        reject(
                            body
                                ? body
                                : response.statusMessage &&
                                  response.statusMessage != ""
                                ? response.statusMessage
                                : error
                        )
                    }
                }
            )
        })
        return response
    } catch (error) {
        return error
    }
}

describe("Valid Authentication", () => {
    test("All environments have client credentials", () => {
        ;["development", "production", "test"].forEach(env => {
            require("dotenv").config({
                path: `.env.${env}`,
            })
            expect(process.env.CLIENT_ID).toEqual(expect.any(String))
        })
        expect(process.env.CLIENT_SECRET).toEqual(expect.any(String))
    })

    let token: {
        access_token: string
        token_type: "Bearer"
        expires_in: number
    }

    test("Test environment's client credentials are valid", async () => {
        token = await authorize()
        expect(token).toEqual(
            expect.objectContaining({
                access_token: expect.any(String),
                token_type: "Bearer",
                expires_in: expect.any(Number),
            })
        )
    })
    test("Working spotify request", async () => {
        expect(
            await spotifyRequest("Get an Album", {
                token: "Bearer "+token.access_token,
                pathParameter: {
                    "{id}": "6a8GwYiEMrXgMvZBvuBXrt",
                },
            })
        ).toHaveProperty("artists")
    })
})
