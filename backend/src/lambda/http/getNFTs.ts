import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getNFTsForUser as getNFTsForUser } from '../../businessLogic/NFTs'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const NFTs = await getNFTsForUser(getUserId(event))

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: NFTs
      })
    }
})

handler.use(
  cors({
    origin: '*',
    credentials: true
  })
)
