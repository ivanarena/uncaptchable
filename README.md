# UnCAPTCHAble 

UnCATPCHAble is a brand new CAPTCHA that makes life really hard for AIs while still being easy to solve for humans.

# Requirements
- Node.js

# Run

```
git clone git@github.com:ivanarena/uncaptchable.git
cd uncaptchable
node .
```

test

curl -X POST http://localhost:9999/captcha/6497505d0cfa81b6f2ff4723/validate -H "Content-Type: application/json" -d '{"answers": ["airplane", "banana"]}'

