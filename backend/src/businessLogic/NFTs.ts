import { NFTsAccess } from '../dataLayer/NFTsAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { NFTItem } from '../models/NFTItem'
import { CreateNFTRequest } from '../requests/CreateNFTRequest'
import { UpdateNFTRequest } from '../requests/UpdateNFTRequest'
import * as uuid from 'uuid'

const bucketName = process.env.ATTACHMENT_S3_BUCKET

const access = new NFTsAccess()
const attachmentUtils = new AttachmentUtils()

export async function getAllNFTs(): Promise<NFTItem[]> {
  return access.getAllNFTs()
}

export async function getNFTsForUser(userId: string): Promise<NFTItem[]> {
  return await access.getNFTsForUser(userId)
}

export async function createNFT(
  createNFTRequest: CreateNFTRequest,
  userId: string
): Promise<NFTItem> {

  const NFTId = uuid.v4()

  return await access.createNFT({
    userId: userId,
    NFTId: NFTId,
    createdAt: new Date().toISOString(),
    name: createNFTRequest.name,
    mintedDate: createNFTRequest.mintedDate,
    minted: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${NFTId}`
  })
}

export async function updateNFT(
    updateNFTRequest: UpdateNFTRequest,
    userId: string,
    NFTId: string
  ) {
  
    await access.updateNFT(userId, NFTId, {
        name: updateNFTRequest.name,
        mintedDate: updateNFTRequest.mintedDate,
        minted: true
    })
}

export async function deleteNFT(userId: string, NFTId: string) {
  
    await access.deleteNFT(userId, NFTId)
}

export async function createAttachmentPresignedUrl(NFTId: string) {

    return attachmentUtils.getAttachmentUrl(NFTId)
}