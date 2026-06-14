const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const KEY = (process.env.GEMINI_KEY || '').trim();
const PORT = process.env.PORT || 10000;

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.end(); return; }

  if (req.method === 'GET') {
    const file = req.url === '/' ? '/history.html' : req.url;
    fs.readFile(path.join(__dirname, 'public', file), (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, {'Content-Type': file.endsWith('.html') ? 'text/html' : 'text/plain'});
      res.end(data);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/ask') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      const { contents, system } = JSON.parse(body);
      const payload = JSON.stringify({
        system_instruction: { parts: [{ text: system || 'You are a helpful assistant.' }] },
        contents
      });

      const apiReq = https.request({
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, apiRes => {
        let data = '';
        apiRes.on('data', d => data += d);
        apiRes.on('end', () => {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(data);
        });
      });

      apiReq.on('error', e => {
        res.writeHead(500);
        res.end(JSON.stringify({error: e.message}));
      });

      apiReq.write(payload);
      apiReq.end();
    });
  }
}).listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
