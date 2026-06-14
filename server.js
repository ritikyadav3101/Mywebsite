const process_env_key = "AQ.Ab8RN6LYpdMxWXh5EaxLdUroF2cEM7gONOKyi51qmHn1WXR-RA";
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process_env_key;
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.end(); return; }

  if (req.method === 'GET') {
    let file = req.url === '/' ? '/history.html' : req.url;
    const filePath = path.join(__dirname, 'public', file);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      const ext = path.extname(file);
      const type = ext === '.html' ? 'text/html' : ext === '.svg' ? 'image/svg+xml' : 'text/plain';
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/ask') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { prompt, history, system } = JSON.parse(body);
      const contents = history && history.length > 0 ? history : [{ role: "user", parts: [{ text: prompt }] }];
      const systemText = system || "You are a helpful assistant.";
      const payload = JSON.stringify({
        system_instruction: { parts: [{ text: systemText }] },
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
  }
});

server.listen(PORT, "0.0.0.0", () => console.log('Server running on port ' + PORT));
