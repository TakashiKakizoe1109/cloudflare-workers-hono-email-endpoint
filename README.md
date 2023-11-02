cloudflare-workers-hono-email-endpoint
===

Use Cloudflare Workers' MailChannels API to deliver emails for your own domain.

If you manage your domain with Cloudflare, you can make Workers your email delivery API endpoint.  
You will be able to deliver emails freely.

## Usage

### local

```bash
npm install
npm run dev
```

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer XXXXXXXXXXXXXXXX" -d '{"personalizations": [{"to": [{"email": "sample@example.com"}]}],"from": {"email": "noreply@example.com"},"subject": "Hello, World!","content": [{"type": "text/plain", "value": "Hey!"}]}' http://0.0.0.0:8787/api/mail/send
```

### workers production

```bash
wrangler deploy
```

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer XXXXXXXXXXXXXXXX" -d '{"personalizations": [{"to": [{"email": "sample@example.com"}]}],"from": {"email": "noreply@example.com"},"subject": "Hello, World!","content": [{"type": "text/plain", "value": "Hey!!"}]}' https://send-workers-email.xxxxxxxxxx.workers.dev/api/mail/send
```

## vars

[wrangler.toml.dist](wrangler.toml.dist) is a template for `wrangler.toml` that you can use to configure your own domain.

| var                        | value                                                |
|----------------------------|------------------------------------------------------|
| API_TOKEN                  | This workers bearer                                  |
| API_END_POINT_MAILCHANNELS | Fixed value: https://api.mailchannels.net/tx/v1/send |
| MC_FROM_EMAIL              | Set the From email address                           |
| MC_FROM_NAME               | Set the From name                                    |
| MC_DKIM_DOMAIN             | Domain to be used (DKIM-authenticated domain)        |
| MC_DKIM_SELECTOR           | DKIM Authentication Record Selector                  |

## setting DKIM

### generate DKIM key

```shell
openssl genrsa -out dkim_private.pem 2048
```

```shell
openssl genrsa 2048 | tee priv_key.pem | openssl rsa -outform der | openssl base64 -A | wrangler secret put DKIM_PRIVATE_KEY
```

```shell
echo -n "v=DKIM1;p=" > record.txt && openssl rsa -in priv_key.pem -pubout -outform der | openssl base64 -A >> record.txt
```

### set Cloudflare DNS

| Type | Name                   | Content                                                                     | note                                                     |
|------|------------------------|-----------------------------------------------------------------------------|----------------------------------------------------------|
| TXT  | @                      | `v=spf1 include:_spf.mx.cloudflare.net include:relay.mailchannels.net -all` | SPF Record                                               |
| TXT  | _mailchannels          | `v=mc1 cfid=xxxxxxxxxx.workers.dev cfid=yourdomain.com`                     | Used to determine if mailchannels is a sendable domain.  |
| TXT  | mailchannels._domainke | record.txt value                                                            | Record for DKIM Authentication                           |
| TXT  | _dmarc                 | `v=DMARC1; p=reject; pct=100; rua=mailto:notify mail address`               | Declare the action you want performed on the failed mail |
