import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { NFTItem } from '../models/NFTItem'
import { NFTUpdate } from '../models/NFTUpdate';

const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('NFTsAccess')

export class NFTsAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly NFTsTable = process.env.NFTS_TABLE,
    private readonly createdAtIndex = process.env.NFTS_CREATED_AT_INDEX) {
  }

  async getAllNFTs(): Promise<NFTItem[]> {
    logger.info('Getting all NFTs')

    const result = await this.docClient.scan({
      TableName: this.NFTsTable
    }).promise()

    const items = result.Items
    return items as NFTItem[]
  }

  async getNFTsForUser(userId: string): Promise<NFTItem[]> {
    logger.info('Getting NFTs for user', userId)

    const result = await this.docClient.query({
      TableName: this.NFTsTable,
      IndexName: this.createdAtIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId 
      }
    }).promise()

    const items = result.Items
    return items as NFTItem[]
  }

  async createNFT(NFT: NFTItem): Promise<NFTItem> {
    logger.info('Creating new NFT')

    await this.docClient.put({
      TableName: this.NFTsTable,
      Item: NFT
    }).promise()

    return NFT
  }

  async updateNFT(userId: string, NFTId: string, NFT: NFTUpdate): Promise<NFTUpdate> {
    logger.info('Updating NFT', NFTId)

    await this.docClient.update({
      TableName: this.NFTsTable,
      Key: {
        userId: userId,
        NFTId: NFTId
      },
      ExpressionAttributeNames: {'#name' : 'name'},
      UpdateExpression: 'SET #name = :name, mintedDate = :mintedDate, minted = :minted',
      ExpressionAttributeValues: {
        ':name' : NFT.name,
        ':mintedDate' : NFT.mintedDate,
        ':minted' : NFT.minted,
      }
    }).promise()

    return NFT
  }

  async deleteNFT(userId: string, NFTId: string) {
    logger.info('Deleting NFT', NFTId)

    await this.docClient.delete({
      TableName: this.NFTsTable,
      Key: {
        userId: userId,
        NFTId: NFTId
      }
    }).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}