const axios = require('axios');

const API_URL = 'http://127.0.0.1:1337/api';

const jobs = [
  {
    title: 'Senior AI Engineer',
    company: 'Neural Dynamics',
    salary: '$180k - $250k',
    type: 'Remote',
    location: 'San Francisco, CA',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=neural',
    tags: JSON.stringify(['PyTorch', 'LLMs', 'C++'])
  },
  {
    title: 'Machine Learning Researcher',
    company: 'Quantum Insights',
    salary: '$160k - $220k',
    type: 'Hybrid',
    location: 'London, UK',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=quantum',
    tags: JSON.stringify(['Computer Vision', 'JAX', 'Research'])
  },
  {
    title: 'Data Scientist, NLP',
    company: 'Lexical AI',
    salary: '$140k - $190k',
    type: 'Remote',
    location: 'Global',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=lexical',
    tags: JSON.stringify(['NLP', 'Transformers', 'Python'])
  }
];

const profiles = [
  {
    username: 'AlexTheAI',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    rank: 1,
    score: '99.1%',
    badge: 'Legend',
    completedCourses: 14,
    color: 'from-amber-400 to-orange-500'
  },
  {
    username: 'NeuralNinja',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja',
    rank: 2,
    score: '98.4%',
    badge: 'Grandmaster',
    completedCourses: 12,
    color: 'from-slate-300 to-slate-500'
  },
  {
    username: 'DataQueen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Queen',
    rank: 3,
    score: '97.8%',
    badge: 'Master',
    completedCourses: 18,
    color: 'from-orange-400 to-red-500'
  },
  {
    username: 'TensorFlowPro',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tensor',
    rank: 4,
    score: '95.2%',
    badge: 'Expert',
    completedCourses: 8,
    color: 'from-cyan-400 to-blue-500'
  }
];

const models = [
  {
    name: 'Llama-3-8B-Instruct',
    description: 'Meta\'s latest highly capable 8B parameter model fine-tuned for instruction following and dialogue.',
    architecture: 'Transformer',
    task: 'Text Generation',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Stable-Diffusion-XL',
    description: 'High-resolution image generation model capable of photorealistic output.',
    architecture: 'Diffusion',
    task: 'Text-to-Image',
    color: 'from-rose-500 to-pink-600'
  },
  {
    name: 'Whisper-Large-v3',
    description: 'Robust multilingual speech recognition and translation model by OpenAI.',
    architecture: 'Transformer',
    task: 'Speech Recognition',
    color: 'from-emerald-500 to-teal-600'
  }
];

async function seedData(endpoint, dataArray) {
  for (const item of dataArray) {
    try {
      await axios.post(`${API_URL}/${endpoint}`, { data: item });
      console.log(`Successfully seeded to ${endpoint}`);
    } catch (error) {
      console.error(`Error seeding ${endpoint}`);
      console.error(error.response?.data || error.message);
    }
  }
}

async function run() {
  // Give Strapi a moment to fully initialize the new endpoints if nodemon just restarted it
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('Seeding jobs...');
  await seedData('jobs', jobs);
  
  console.log('Seeding profiles...');
  await seedData('profiles', profiles);
  
  console.log('Seeding models...');
  await seedData('models', models);
  
  console.log('Expansion seeding done.');
}

run();
