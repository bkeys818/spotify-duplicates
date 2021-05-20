import authorize from './authorize'
import { request } from './request'


const albumID = '7gsWAHLeT0w7es6FofOXk1'

describe(`Spoitfy.${request.name} is functional`, () => {
    let token: string
    beforeAll(() => {
        return authorize().then(res => {
            token = res.token_type + ' ' + res.access_token
            return
        })
    })
    
    test('Basic request', async () => {
        const response = await request('Get an Album', {
            token: token,
            pathParameter: {
                "{id}": albumID
            }
        })

        expect(response).toHaveProperty('album_type', 'album')
    })
})

describe(`Spoitfy.${request.name} throws the appropriate errors`, () => {
    let token: string
    beforeAll(() => {
        return authorize().then(res => {
            token = res.token_type + ' ' + res.access_token
            return
        })
    })

    const errorMessage = (regExp: RegExp) => new RegExp('^SpotifyError - .+! '+regExp.source)

    test.concurrent('Unauthorized error', async () => {
        async function unauthorizedRequest() {
            await request('Get an Album', {
                token: 'fdnjksanjkfsajfjs',
                pathParameter: {
                    "{id}": albumID
                }
            })
        }
        expect(unauthorizedRequest).rejects.toThrowError(errorMessage(/Unauthorized: .+/))
    })

    test('Request with invalid id', async () => {
        async function requestWithInvalidID() {
            await request('Get an Album', {
                token: token,
                pathParameter: {
                    "{id}": 'jkfre3345'
                }
            })
        }
        expect(requestWithInvalidID).rejects.toThrowError(errorMessage(/Bad Request: .+/))
    })
})