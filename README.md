# Code snippet to generate the JSON Web Token for the Google Play Developer API

Codeible.com - [View on Codeible](https://codeible.com/view/videotutorial/EUVd83616z4AppnnKk4Y;title=Generating%20the%20JWT%20and%20Retrieving%20the%20OAuth%202.0%20Token)

[View on YouTube](https://youtu.be/91PlQyrebbk)

[Follow on Twitter](https://twitter.com/KingWaiMark)

##### Header
```
const header = {
    alg: "RS256",
    typ: "JWT"
}
```

##### Claim Set
```
const claimSet = {
    iss: "<REPLACE WITH YOUR ACC>",
    iat: now,
    exp: expireTime,
    scope: "<SCOPE FROM GOOGLE PLAY DEVELOPER API> (E.g: https://www.googleapis.com/auth/androidpublisher)",
    aud: "https://oauth2.googleapis.com/token"
}
```

##### Signature
```
const crypto = require("crypto");
const signer = crypto.createSign("RSA-SHA256");

signer.write(encodedHeader + "." + encodedClaimSet);
signer.end();

const privateKey = "<REPLACE WITH YOUR PRIVATE KEY>";
const signature = signer.sign(privateKey, "base64");
const encodedSignature = signature.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
```

##### Encode Base64URL
```
function toBase64URL(json) {
    const jsonString = JSON.stringify(json);
    const btyeArray = Buffer.from(jsonString);
    return btyeArray.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
```

##### Encode Header and Claim Set
```
const encodedHeader = toBase64URL(header);
const encodedClaimSet = toBase64URL(claimSet);
```

##### Request API
```
const https = require("https");

function getOAuthToken(jwt) {
    return new Promise(
        (resolve, reject) => {
            // request option
            var option = {
                hostname: "oauth2.googleapis.com",
                path: `/token?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
                method: 'POST',
                port: 443,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            var req = https.request(option, (res) => {
                var result = '';
                res.on('data', function (chunk) {
                    result += chunk;
                });
                res.on('end', () => {
                    resolve(result);
                });
            });

            req.on('error', function (err) {
                reject(err);
            });

            req.end();
            
        }
    );
}

```