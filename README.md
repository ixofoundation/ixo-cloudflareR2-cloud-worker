# ixo-r2-cloud-worker

Store and Deliver images with Cloudflare R2 backend Cloudflare Workers with IPFS CID integration.

## How to Run the worker

1. Deploy r2-image-worker to Cloudflare
1. Make a base64 string from the image file such as `.png`, `jpg`, or `gif`.
2. `PUT` the base64 strings to **ixo-r2-image-worker**.
3. Image binary will be stored in Cloudflare R2 storage.
4. **r2-image-worker** will respond the key of the stored image. `abcdef.png`
5. **r2-image-worker** serve the images on `https://ixo-r2-image-worker.username.workers.dev/abcdef.png`
6. Images will be cached in Cloudflare CDN.
7. Images can also be uploaded to IPFS Storage via the ipfsupload endpoint

```
User => Image => base64 => r2-image-worker => R2
User <= Image <= r2-image-worker <= CDN Cache <= R2
User <= Image <= r2-image-worker <= CID <= IPFS
```

## Prerequisites

* Cloudflare Account
* Cloudflare R2 access
* Web3Storage Account
* Wrangler CLI (v2)
* Custom domain (* Cache API is not available in `*.workers.dev` domain)

## Set up
Create R2 bucket:

```
wrangler r2 bucket create cdn-images
```
TODO RE ADD EXAMPLE TOML
========================
Copy `wrangler.example.toml` to `wrangler.toml`:

```
cp wrangler.example.toml wrangler.toml
```

Edit `wrangler.toml`.


## Variables

### Secret variables

Secret variables are:

- `AUTHKEY` - Auth Token for basic security


## Usage

Develop

```
yarn dev
```

Test

```
yarn test
```

Deploy

```
yarn deploy
```

Prebuild

```
yarn build
```

Add your Web3storage Secret key housed in the secret manager tool of cloudflare.

```
wrangler secret put IPFS_WORKER_TOKEN
```

## Endpoints

### `/upload`

Header:

To pass the Basic Auth, add the AUTHKEY to your Bearer Auth section of `Authorization` header.

```
Authorization: Bearer ...
```

Body: Base64 string of image binary.

```json
{
  "body": "Base64 Text..."
}
```
### Test
1. Grab any common image with common extension type.
2. Upload to u endpoint.
```
echo '{"body" : "'"$( cat /tmp/1.jpg | base64)"'"}' | curl -XPUT -H "Content-Type: application/json" -d @-  https://ixo:ixo@https://ixo-r2-cloud-worker.ixo-api.workers.dev/upload -vvv
```
3. Visit the image
```
https://change_user_here:change_pass_here@change_url_here/image_returned_in_step2
```

## Author

Andrew Margetts <https://github.com/demondayza>

## License

MIT
