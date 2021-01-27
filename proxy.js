const http = require("http");
const httpProxy = require("http-proxy");
const API_HOST = "api.twitter.com";

require("dotenv").config({path: ".env.development"})

if(!process.env.API_HOST) {
    throw new Error("No environment variable has been provided for API_HOST");
}

if(!process.env.BEARER_TOKEN) {
    throw new Error("No environment variable has been provided for BEARER_TOKEN");
}

const PROXY_PORT = process.env.REACT_APP_PROXY_PORT || 4000;

const myLocalProxy  = httpProxy.createProxyServer({});

const myServer = http.createServer((req, res) => {
    req.headers.origin = `https://${API_HOST}`;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);

    if(req.method === "OPTIONS") {
        res.statusCode = 200;
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization");
        res.end();
    }

    myLocalProxy.web(req, res, {
        target: `https://${API_HOST}`,
        changeOrigin: true,
        secure: false,
        xfwd: false,
        followRedirects: true,
        headers: {
            Host: API_HOST,
            "accept": "*/*",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en,en-GB;q=0.9",
            authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            referrer: `https://${API_HOST}`,

        }
    }, (err) => { console.log(err)})

});

myServer.listen(PROXY_PORT)

console.log(`listening on http://localhost:${PROXY_PORT}`);