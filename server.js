const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const KEY = (process.env.GROQ_KEY || '').trim();
const PORT = process.env.PORT || 10000;

console.log('Groq Key loaded:', KEY ? 'YES' : 'NO');

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.end(); return; }

  if (req.method === 'GET') {
    const file = req.url === '/' ? '/index.html' : req.url;
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
      try {
        const { contents, system } = JSON.parse(body);
        
        const messages = [];
        if (system) messages.push({ role: 'system', content: system });
        contents.forEach(c => {
          messages.push({
            role: c.role === 'model' ? 'assistant' : 'user',
            content: c.parts[0].text
          });
        });

        const payload = JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: messages,
          max_tokens: 1024
        });

        const options = {
          hostname: 'api.groq.com',
          path: '/openai/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KEY}`,
            'Content-Length': Buffer.byteLength(payload)
          }
        };

        const apiReq = https.request(options, apiRes => {
          let data = '';
          apiRes.on('data', d => data += d);
          apiRes.on('end', () => {
            try {
              const groqData = JSON.parse(data);
              const text = groqData.choices[0].message.content;
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end(JSON.stringify({
                candidates: [{ content: { parts: [{ text }], role: 'model' } }]
              }));
            } catch(e) {
              res.writeHead(500);
              res.end(JSON.stringify({ error: data }));
            }
          });
        });

        apiReq.on('error', e => {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        });

        apiReq.write(payload);
        apiReq.end();
      } catch(e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  }
}).listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
