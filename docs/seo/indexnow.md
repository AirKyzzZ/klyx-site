# IndexNow

IndexNow tells Bing, Yandex, Seznam and Naver that URLs changed, so they recrawl them without waiting. Google does not use it.

The key is `public/dae9b21583f7737e94c6a198337b6cfe.txt`, served at `https://klyx.fr/dae9b21583f7737e94c6a198337b6cfe.txt`. It is public by design: it only proves we own the host. To rotate it, replace the file with a new 32-hex name holding the same value.

After a deploy that adds or changes pages:

```sh
node scripts/indexnow.mjs --dry-run   # prints the URLs from the live sitemap, sends nothing
node scripts/indexnow.mjs             # submits them to api.indexnow.org
```

The script reads the live `https://klyx.fr/sitemap.xml`, so run it after the deploy is live, not before. A 200 or 202 is a success (202 means the key is still being checked). A 403 means the key file is not reachable yet. Don't resubmit unchanged URLs on every deploy, engines throttle hosts that spam.

Bing Webmaster Tools shows the submissions under IndexNow once the site is verified there.
