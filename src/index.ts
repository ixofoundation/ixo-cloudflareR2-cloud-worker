import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { sha256 } from 'hono/utils/crypto'

import { detectType,GenerateCID } from './utils'
import { bearerAuth } from 'hono/bearer-auth'

import { web3StoreFile } from './web3storage.helper'
export interface Bindings {
  BUCKET: R2Bucket
}

interface Data {
  body: string
}

const maxAge = 60 * 60 * 24 * 30;
const app = new Hono()

const token = "INSERTHERE";

app.use('/upload/*', bearerAuth({ token }))



app.put('/ipfsupload', async (c) => {
  const data = await c.req.json<{base64,mimetype}>();

  const base64 = data.base64;
  const mimetype = data.mimetype;


  const body = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))

  const key = await sha256(body);

  const file = new File([body], key, {type: mimetype});

 const cid = await web3StoreFile( c.env.IPFS_WORKER_TOKEN,file );
 
  
  return c.json({ meta: key, cid:cid })  

})

app.put('/upload', async (c) => {
  const data = await c.req.json<Data>()
  const base64 = data.body

  if (!base64) return c.notFound()

  const type = detectType(base64)
  if (!type) return c.notFound()

  let cid = await GenerateCID(base64);
  const body = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))

  const key = (await sha256(body)) + '.' + type?.suffix
  await c.env.BUCKET.put(key, body, { httpMetadata: { contentType: type.mimeType } })
  
  return c.json({ image: key, cid:cid })  

})

app.get(
  '*',
  cache({
    cacheName: 'ixo-r2-image-worker',
  })
)

app.get('/:key', async (c) => {
  const key = c.req.param('key')

  const object = await c.env.BUCKET.get(key)
  if (!object) return c.notFound()
  const data = await object.arrayBuffer()
  const contentType = object.httpMetadata.contentType || ''

  return c.body(data, 200, {
    'Cache-Control': `public, max-age=${maxAge}`,
    'Content-Type': contentType,
  })
})

export default app
