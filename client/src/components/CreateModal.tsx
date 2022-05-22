import React from 'react'
import { Button, Input, Grid, Modal } from 'semantic-ui-react'

function CreateModal({onNFTCreate, onChange} : {onNFTCreate:any, onChange:any}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      size='tiny'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button floated="right" color='teal'>Create</Button>}
    >
      <Modal.Header>Create New NFT</Modal.Header>
      <Modal.Content>
         <Grid.Row>
         <Grid.Column width={14}>
           <Input label='Name' fluid placeholder="Enter name" onChange={onChange} style={{ padding: '2em' }}/>
         </Grid.Column>
        <Grid.Column width={16}>
        </Grid.Column>
      </Grid.Row>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Create"
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            onNFTCreate()
            setOpen(false)
          }}
          color='teal'
        />
      </Modal.Actions>
    </Modal>
  )
}

export default CreateModal