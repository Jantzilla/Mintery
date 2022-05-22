import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateNFTRequest } from '../../requests/CreateNFTRequest'
import { getUserId } from '../utils';
import { createNFT as createNFT } from '../../helpers/NFTs'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newNFT: CreateNFTRequest = JSON.parse(event.body)

    const item = await createNFT(newNFT, getUserId(event))

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: item
      })
    }
})

handler.use(
  cors({
    origin: '*',
    credentials: true
  })
)
