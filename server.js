const fs = require('fs');
const os = require('os');
const http = require('http');
const https = require('https');
const path = require('path');

let API_KEY = '';
try {
  const envFile = fs.readFileSync(os.homedir() + '/.env_jarvis', 'utf8');
  const match = envFile.match(/GEMINI_KEY=(.+)/);
  if (match) API_KEY = match[1].trim();
} catch(e) {}
if (!API_KEY) API_KEY = process.env.GEMINI_KEY || '';
console.log('Key loaded:', API_KEY ? 'YES' : 'NO');

const PORT = process.env.PORT || 3002;

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
      const type = ext === '.html' ? 'text/html' : 'text/plain';
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
      
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      if (history && history.length > 0) {
        history.forEach(h => {
          messages.push({
            role: h.role === 'model' ? 'assistant' : 'user',
            content: h.parts[0].text
          });
        });
      } else {
        messages.push({ role: 'user', content: prompt });
      }

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
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const apiReq = https.request(options, apiRes => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
          console.log('Groq response:', data.substring(0, 200));
          try {
            const groqData = JSON.parse(data);
            const text = groqData.choices[0].message.content;
            const geminiFormat = {
              candidates: [{
                content: {
                  parts: [{ text: text }],
                  role: 'model'
                }
              }]
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(geminiFormat));
          } catch(e) {
            console.log('Parse error:', e.message);
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
    });
  }
});

server.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
