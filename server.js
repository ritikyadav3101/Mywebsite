const fs = require('fs');
const os = require('os');
const http = require('http');
const https = require('https');
const path = require('path');
const crypto = require('crypto');

const API_KEY = (process.env.GEMINI_KEY || '').replace(/[^\x20-\x7E]/g, '').trim();
console.log('Key loaded:', API_KEY ? 'YES' : 'NO');

const PORT = process.env.PORT || 3000;
let users = {};
let tokens = {};

function generateToken() { return crypto.randomBytes(32).toString('hex'); }

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.end(); return; }

  if (req.method === 'GET') {
    let file = req.url === '/' ? '/index.html' : req.url;
    if (file.includes('?')) file = file.split('?')[0];
    const filePath = path.join(__dirname, 'public', file);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      const ext = path.extname(file);
      const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json'};
      res.writeHead(200, {'Content-Type': types[ext] || 'text/plain'});
      res.end(data);
    });
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');

      // REGISTER
      if (req.url === '/api/register') {
        const { name, email, password } = data;
        if (!name || !email || !password) { res.writeHead(400); res.end(JSON.stringify({error:'All fields required'})); return; }
        if (users[email]) { res.writeHead(400); res.end(JSON.stringify({error:'Email already exists'})); return; }
        users[email] = { name, email, password, plan: 'free' };
        const token = generateToken();
        tokens[token] = email;
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({token, user:{name, email, plan:'free'}}));
        return;
      }

      // LOGIN
      if (req.url === '/api/login') {
        const { email, password } = data;
        const user = users[email];
        if (!user || user.password !== password) { res.writeHead(401); res.end(JSON.stringify({error:'Invalid credentials'})); return; }
        const token = generateToken();
        tokens[token] = email;
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({token, user:{name:user.name, email, plan:user.plan}}));
        return;
      }

      // UPGRADE
      if (req.url === '/api/upgrade') {
        const token = (req.headers['authorization'] || '').replace('Bearer ','').trim();
        const email = tokens[token];
        if (!email || !users[email]) { res.writeHead(401); res.end(JSON.stringify({error:'Unauthorized'})); return; }
        users[email].plan = data.plan;
        const newToken = generateToken();
        tokens[newToken] = email;
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({token:newToken, user:{name:users[email].name, email, plan:data.plan}}));
        return;
      }

      // ASK - works for BOTH history.html (no auth) and index.html (with auth)
      if (req.url === '/ask' || req.url === '/api/ask') {
        const { prompt, history, system, messages } = data;

        let groqMessages = [];
        if (system) groqMessages.push({role:'system', content:system});

        if (messages && messages.length > 0) {
          messages.forEach(m => groqMessages.push({role:m.role, content:m.content}));
        } else if (history && history.length > 0) {
          history.forEach(h => groqMessages.push({role: h.role === 'model' ? 'assistant' : 'user', content: h.parts[0].text}));
        } else {
          groqMessages.push({role:'user', content: prompt || 'Hello'});
        }

        const payload = JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: groqMessages,
          max_tokens: 1024
        });

        const options = {
          hostname: 'api.groq.com',
          path: '/openai/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY,
            'Content-Length': Buffer.byteLength(payload)
          }
        };

        const apiReq = https.request(options, apiRes => {
          let resData = '';
          apiRes.on('data', chunk => resData += chunk);
          apiRes.on('end', () => {
            try {
              const groqData = JSON.parse(resData);
              const reply = groqData.choices[0].message.content;
              res.writeHead(200, {'Content-Type':'application/json'});
              // Support both response formats
              res.end(JSON.stringify({
                reply,
                candidates:[{content:{parts:[{text:reply}],role:'model'}}]
              }));
            } catch(e) {
              res.writeHead(500);
              res.end(JSON.stringify({error:'AI error'}));
            }
          });
        });

        apiReq.on('error', e => { res.writeHead(500); res.end(JSON.stringify({error:e.message})); });
        apiReq.write(payload);
        apiReq.end();
        return;
      }

      res.writeHead(404); res.end(JSON.stringify({error:'Not found'}));
    } catch(e) {
      res.writeHead(400); res.end(JSON.stringify({error:'Bad request'}));
    }
  });
});

server.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
