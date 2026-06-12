const axios = require('axios');

const API_URL = 'http://127.0.0.1:1337/api';

const generateLinkedInUrl = (title, company) => {
  const query = `${title} ${company}`;
  return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`;
};

const jobs = [
  {
    title: 'Senior Data Scientist',
    company: 'OpenAI',
    salary: '$200k - $300k',
    type: 'Hybrid',
    location: 'San Francisco, CA',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=openai',
    tags: JSON.stringify(['Python', 'PyTorch', 'LLMs', 'Research']),
    applyUrl: generateLinkedInUrl('Senior Data Scientist', 'OpenAI')
  },
  {
    title: 'Machine Learning Engineer',
    company: 'Anthropic',
    salary: '$180k - $280k',
    type: 'On-site',
    location: 'San Francisco, CA',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=anthropic',
    tags: JSON.stringify(['C++', 'CUDA', 'Distributed Systems']),
    applyUrl: generateLinkedInUrl('Machine Learning Engineer', 'Anthropic')
  },
  {
    title: 'Data Engineer',
    company: 'Snowflake',
    salary: '$150k - $220k',
    type: 'Remote',
    location: 'Remote, US',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=snowflake',
    tags: JSON.stringify(['SQL', 'Spark', 'Airflow', 'ETL']),
    applyUrl: generateLinkedInUrl('Data Engineer', 'Snowflake')
  },
  {
    title: 'AI Research Scientist',
    company: 'DeepMind',
    salary: '£120k - £180k',
    type: 'Hybrid',
    location: 'London, UK',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=deepmind',
    tags: JSON.stringify(['Reinforcement Learning', 'JAX', 'Math']),
    applyUrl: generateLinkedInUrl('AI Research Scientist', 'DeepMind')
  },
  {
    title: 'Data Analyst',
    company: 'Stripe',
    salary: '$120k - $160k',
    type: 'Remote',
    location: 'Remote, Global',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=stripe',
    tags: JSON.stringify(['SQL', 'Tableau', 'A/B Testing']),
    applyUrl: generateLinkedInUrl('Data Analyst', 'Stripe')
  },
  {
    title: 'Lead MLOps Engineer',
    company: 'Hugging Face',
    salary: '$170k - $240k',
    type: 'Remote',
    location: 'Remote, Paris/NY',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=huggingface',
    tags: JSON.stringify(['Kubernetes', 'Docker', 'GCP', 'Transformers']),
    applyUrl: generateLinkedInUrl('Lead MLOps Engineer', 'Hugging Face')
  },
  {
    title: 'Computer Vision Engineer',
    company: 'Tesla',
    salary: '$160k - $230k',
    type: 'On-site',
    location: 'Palo Alto, CA',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=tesla',
    tags: JSON.stringify(['C++', 'OpenCV', 'Deep Learning', 'Autopilot']),
    applyUrl: generateLinkedInUrl('Computer Vision Engineer', 'Tesla')
  },
  {
    title: 'Analytics Engineer',
    company: 'dbt Labs',
    salary: '$130k - $180k',
    type: 'Remote',
    location: 'Remote, US',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=dbt',
    tags: JSON.stringify(['dbt', 'Snowflake', 'Looker', 'Python']),
    applyUrl: generateLinkedInUrl('Analytics Engineer', 'dbt Labs')
  }
];

async function seedData(endpoint, dataArray) {
  for (const item of dataArray) {
    try {
      await axios.post(`${API_URL}/${endpoint}`, { data: item });
      console.log(`Successfully seeded ${item.title} to ${endpoint}`);
    } catch (error) {
      console.error(`Error seeding ${item.title} to ${endpoint}`);
      console.error(error.response?.data || error.message);
    }
  }
}

async function run() {
  console.log('Clearing old jobs might be needed, but for now we just add new ones.');
  console.log('Seeding data jobs...');
  await seedData('jobs', jobs);
  console.log('Job seeding done.');
}

run();
