import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateNFT as updateNFT } from '../../businessLogic/NFTs'
import { UpdateNFTRequest } from '../../requests/UpdateNFTRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const NFTId = event.pathParameters.NFTId
    const updatedNFT: UpdateNFTRequest = JSON.parse(event.body)
    await updateNFT(updatedNFT, getUserId(event), NFTId)

    return {
      statusCode: 200,
      body: ''
    }

})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      origin: '*',
      credentials: true
    })
  )
