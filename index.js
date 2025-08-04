
const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const app = express();
const port = 3000;

// Required to parse JSON bodies (if needed)
app.use(express.json());

// ✅ 1. Define Elasticsearch client FIRST
const esClient = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: '123456', // Replace with your real password
  },
});

// ✅ 2. Add test route (optional)
app.get('/', (req, res) => {
  res.send('✅ Elasticsearch Search API is running!');
});




app.post('/search', async (req, res) => {
  const keyword = req.body.keyword || '';

  try {
    const result = await client.search({
      index: 'students', // your index name
      body: {
        size: 10000,
        query: {
          query_string: {
            query: keyword,
            fields: ["id","full_name", "email", "address", "gender", "age", "gpa", "enrollment_year"],
            lenient: true
          }
        }
      }
    });

    res.json(result.body.hits.hits); // return matching documents
  } catch (err) {
    console.error(err.meta.body.error);
    res.status(500).json({ error: 'Search failed' });
  }
});


// ✅ 4. Start the server
app.listen(port, () => {
  console.log(`🚀 Search API running at http://localhost:${port}`);
});
