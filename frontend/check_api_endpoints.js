process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const http = require('http');

const endpoints = [
  '/api/forum-posts',
  '/api/community-posts',
  '/api/questions',
  '/api/achievements',
  '/api/bounties',
  '/api/blog-posts',
  '/api/articles',
  '/api/mentors',
  '/api/hackathons',
  '/api/research-papers',
  '/api/showcases'
];

async function check() {
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`https://wise-action-3f2ccfecaa.strapiapp.com${endpoint}`);
      if (res.ok) {
        console.log(`✅ FOUND: ${endpoint}`);
      } else {
        console.log(`❌ NOT FOUND: ${endpoint} (${res.status})`);
      }
    } catch (e) {
      console.log(`⚠️ ERROR: ${endpoint} - ${e.message}`);
    }
  }
}

check();
