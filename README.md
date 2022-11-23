# ixo-r2-cloud-worker

Store and Deliver images with Cloudflare R2 backend Cloudflare Workers.

## How to Run the worker

1. Deploy r2-image-worker to Cloudflare
1. Make a base64 string from the image file such as `.png`, `jpg`, or `gif`.
2. `PUT` the base64 strings to **r2-image-worker**.
3. Image binary will be stored in Cloudflare R2 storage.
4. **r2-image-worker** will respond the key of the stored image. `abcdef.png`
5. **r2-image-worker** serve the images on `https://r2-image-worker.username.workers.dev/abcdef.png`
6. Images will be cached in Cloudflare CDN.

```
User => Image => base64 => r2-image-worker => R2
User <= Image <= r2-image-worker <= CDN Cache <= R2
```

## Prerequisites

* Cloudflare Account
* Cloudflare R2 beta access
* Wrangler CLI (v2)
* Custom domain (* Cache API is not available in `*.workers.dev` domain)

## Set up
Create R2 bucket:

```
wrangler r2 bucket create cdn-images
```

Copy `wrangler.example.toml` to `wrangler.toml`:

```
cp wrangler.example.toml wrangler.toml
```

Edit `wrangler.toml`.


## Variables

### Secret variables

Secret variables are:

- `USER` - User name of basic auth
- `PASS` - User password of basic auth

To set these, use `wrangler secret put` command:

```bash
wrangler secret put USER
wrangler secret put PASS
```

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

## Endpoints

### `/upload`

Header:

To pass the Basic Auth, add the Base64 string of "user:pass" to `Authorization` header.

```
Authorization: Basic ...
```

Body: Base64 string of image binary.

```json
{
  "body": "Base64 Text..."
}
```
### Test
1. Download a simple image
```
wget  https://www.bing.com/th?id=OHR.Unesco50_ZH-CN3652927413_UHD.jpg -O /tmp/1.jpg
```
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
