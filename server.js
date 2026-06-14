require("dotenv").config({ path: require('os').homedir() + '/.env_jarvis' });
const http = require('http');
const https = require('https');

const API_KEY = process.env.GEMINI_KEY;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.end(); return; }

  if (req.method === 'POST' && req.url === '/ask') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { prompt, history } = JSON.parse(body);

      const contents = history && history.length > 0 ? history : [{ role: "user", parts: [{ text: prompt }] }];

      const payload = JSON.stringify({
        system_instruction: {
          parts: [{ text: "You are Jarvis, AI assistant for Ritik. Be smart, helpful and formal like Jarvis from Iron Man. Address user as Sir. Keep responses under 3 sentences." }]
        },
        contents: contents
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };

      const apiReq = https.request(options, apiRes => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
        });
      });

      apiReq.on('error', e => {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      });

      apiReq.write(payload);
      apiReq.end();
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3001, () => console.log('Jarvis server running on port 3001'));
