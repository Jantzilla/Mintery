import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/NFTs'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const NFTId = event.pathParameters.NFTId
    const uploadUrl = await createAttachmentPresignedUrl(NFTId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      origin: '*',
      credentials: true
    })
  )
