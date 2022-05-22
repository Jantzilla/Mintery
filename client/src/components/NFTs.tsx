import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Checkbox,
  Divider,
  Grid,
  Header,
  Image,
  Loader,
  Dropdown
} from 'semantic-ui-react'

import { createNFT, deleteNFT, getNFTs, patchNFT } from '../api/nfts-api'
import Auth from '../auth/Auth'
import { NFT } from '../types/NFT'
import AddModal from './CreateModal'

interface NFTsProps {
  auth: Auth
  history: History
}

interface NFTsState {
  NFTs: NFT[]
  newNFTName: string
  loadingNFTs: boolean
}

export class NFTs extends React.PureComponent<NFTsProps, NFTsState> {
  state: NFTsState = {
    NFTs: [],
    newNFTName: '',
    loadingNFTs: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newNFTName: event.target.value })
  }

  onEditButtonClick = (NFTId: string) => {
    this.props.history.push(`/nfts/${NFTId}/edit`)
  }

  onNFTCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newNFT = await createNFT(this.props.auth.getIdToken(), {
        name: this.state.newNFTName,
        mintedDate: dueDate
      })
      this.setState({
        NFTs: [...this.state.NFTs, newNFT],
        newNFTName: ''
      })
    } catch {
      alert('NFT creation failed')
    }
  }

  onNFTDelete = async (NFTId: string) => {
    try {
      await deleteNFT(this.props.auth.getIdToken(), NFTId)
      this.setState({
        NFTs: this.state.NFTs.filter(NFT => NFT.NFTId !== NFTId)
      })
    } catch {
      alert('NFT deletion failed')
    }
  }

  onNFTCheck = async (pos: number) => {
    try {
      const NFT = this.state.NFTs[pos]
      await patchNFT(this.props.auth.getIdToken(), NFT.NFTId, {
        name: NFT.name,
        mintedDate: NFT.mintedDate,
        minted: !NFT.minted
      })
      this.setState({
        NFTs: update(this.state.NFTs, {
          [pos]: { minted: { $set: !NFT.minted } }
        })
      })
    } catch {
      alert('NFT deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const NFTs = await getNFTs(this.props.auth.getIdToken())
      this.setState({
        NFTs: NFTs,
        loadingNFTs: false
      })
    } catch {
      alert(`Failed to fetch NFTs:`)
    }
  }

  render() {
    return (
      <div>
        <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={14}>
              <Header style={{padding: '0em 0em 0em 5em'}} textAlign='center' as="h1">NFTs</Header>
              </Grid.Column>
              <Grid.Column width={2}>
              <AddModal onNFTCreate={this.onNFTCreate} onChange={this.handleNameChange}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>

        <Divider />

        {this.renderNFTs()}

      </div>
    )
  }

  renderNFTs() {
    if (this.state.loadingNFTs) {
      return this.renderLoading()
    }

    return this.renderNFTsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading NFTs
        </Loader>
      </Grid.Row>
    )
  }

  renderNFTsList() {
    return (
      <Grid columns={5}>
        {this.state.NFTs?.map((NFT, pos) => {
          return (
            <Grid.Column key={NFT?.NFTId}>
              <Header as='h3' textAlign='center'>{NFT?.name}</Header>
                <Dropdown style={{
                    position: 'absolute',
                    right: 25,
                    top: 15,
                }}>
                <Dropdown.Menu>
                  <Dropdown.Item icon='pencil' text='Edit' onClick={() => this.onEditButtonClick(NFT?.NFTId)} />
                  <Dropdown.Item icon='trash' text='Delete' onClick={() => this.onNFTDelete(NFT?.NFTId)} />
                </Dropdown.Menu>
              </Dropdown>
              {NFT?.attachmentUrl && (
                <Image src={NFT?.attachmentUrl} size="medium" fluid style={{width: '200px', height: '200px'}}/>
              )}
              <p style={{padding: '1em 0em', textAlign: "center"}}>{NFT?.mintedDate}</p>
              <Checkbox onChange={() => this.onNFTCheck(pos)} checked={NFT?.minted} style={{
              position: 'absolute',
              right: 25,
              top: 60,
              }}/>
            </Grid.Column>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
