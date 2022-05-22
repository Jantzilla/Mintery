import { apiEndpoint } from '../config'
import { NFT } from '../types/NFT';
import { CreateNFTRequest } from '../types/CreateNFTRequest';
import Axios from 'axios'
import { UpdateNFTRequest } from '../types/UpdateNFTRequest';

export async function getNFTs(idToken: string): Promise<NFT[]> {
  console.log('Fetching NFTs')

  const response = await Axios.get(`${apiEndpoint}/nfts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('NFTs:', response.data)
  return response.data.items
}

export async function createNFT(
  idToken: string,
  newNFT: CreateNFTRequest
): Promise<NFT> {
  const response = await Axios.post(`${apiEndpoint}/nfts`,  JSON.stringify(newNFT), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchNFT(
  idToken: string,
  NFTId: string,
  updatedNFT: UpdateNFTRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/nfts/${NFTId}`, JSON.stringify(updatedNFT), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteNFT(
  idToken: string,
  NFTId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/nfts/${NFTId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  NFTId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/nfts/${NFTId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
