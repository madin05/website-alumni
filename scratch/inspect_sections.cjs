const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const list = JSON.parse(d);
    const target = list.find(t => t.url.includes('localhost:5173'));
    if (!target) { console.log('no target'); return; }
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: `JSON.stringify(['#section-features-grid', '#tentang', '#laporan', '#dasar-hukum', '#berita', '#layanan', '#kontak'].map(s => {
            const el = document.querySelector(s);
            if (!el) return { s, notFound: true };
            const r = el.getBoundingClientRect();
            return { s, top: Math.round(r.top + window.scrollY), height: Math.round(r.height), clientTop: Math.round(r.top) };
          }))`,
          returnByValue: true
        }
      }));
    };
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      console.log('Results:', JSON.parse(data.result.result.value));
      process.exit(0);
    };
  });
}).on('error', (e) => console.error(e));
