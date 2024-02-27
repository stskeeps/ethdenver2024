import { NewGravatar, UpdatedGravatar } from '../generated/Gravity/Gravity'
import { Gravatar } from '../generated/schema'

export async function handleNewGravatar(event: NewGravatar) {
  let gravatar = new Gravatar(event.params.id.toHex())
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  await gravatar.save()
}

export async function handleUpdatedGravatar(event: UpdatedGravatar) {
  let id = event.params.id.toHex()
  let gravatar = await Gravatar.load(id)
  console.log(`Gravatar: ${JSON.stringify(gravatar)}`)
  if (gravatar == null) {
    gravatar = new Gravatar(id)
  }
  gravatar.owner = event.params.owner
  gravatar.displayName = event.params.displayName
  gravatar.imageUrl = event.params.imageUrl
  gravatar.save()
}
