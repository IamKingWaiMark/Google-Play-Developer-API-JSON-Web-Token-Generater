/*
    Code by King W Mark
    Generates the JSON Web Token for the Google Play Developer API

    https://codeible.com/view/videotutorial/EUVd83616z4AppnnKk4Y;title=Generating%20the%20JWT%20and%20Retrieving%20the%20OAuth%202.0%20Token
    
    1-30-2022
*/

const header = {
    alg: "RS256",
    typ: "JWT"
}

const now = new Date().getTime() / 1000;
const oneHour = 60 * 60;
const expireTime = now + oneHour;

const claimSet = {
    iss: "<REPLACE WITH YOUR ACC>",
    iat: now,
    exp: expireTime,
    scope: "https://www.googleapis.com/auth/androidpublisher",
    aud: "https://oauth2.googleapis.com/token"
}

function toBase64URL(json) {
    const jsonString = JSON.stringify(json);
    const btyeArray = Buffer.from(jsonString);
    return btyeArray.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

const encodedHeader = toBase64URL(header);
const encodedClaimSet = toBase64URL(claimSet);

const crypto = require("crypto");
const signer = crypto.createSign("RSA-SHA256");

signer.write(encodedHeader + "." + encodedClaimSet);
signer.end();

const privateKey = "<REPLACE WITH YOUR PRIVATE KEY>";
const signature = signer.sign(privateKey, "base64");
const encodedSignature = signature.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

const jwt = `${encodedHeader}.${encodedClaimSet}.${encodedSignature}`;
console.log(jwt);


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

async function test(){
    let result = await getOAuthToken(jwt).catch(err => { console.log(err)});
    let json = JSON.parse(result);
    console.log(json);
}


test();

