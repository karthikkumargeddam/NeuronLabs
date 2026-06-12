const axios = require('axios');

const API_URL = 'http://127.0.0.1:1337/api';

const datasets = [
  {
    title: 'AlphaFold Protein Structures',
    description: '3D coordinates and confidence scores for over 200M proteins.',
    size: '23 TB',
    downloads: '1.2M',
    tags: JSON.stringify(['Biology', 'Proteomics', 'DeepMind']),
    color: 'from-blue-500 to-cyan-400'
  },
  {
    title: 'Global Climate Data 1880-2024',
    description: 'Comprehensive temperature anomalies, sea level rise, and emission data.',
    size: '850 GB',
    downloads: '840K',
    tags: JSON.stringify(['Climate', 'Time Series', 'NASA']),
    color: 'from-emerald-400 to-teal-500'
  },
  {
    title: 'Financial Markets Tick Data',
    description: 'High-frequency trading data for top 500 stocks over the last decade.',
    size: '4.2 TB',
    downloads: '320K',
    tags: JSON.stringify(['Finance', 'Quantitative', 'Stocks']),
    color: 'from-purple-500 to-indigo-600'
  }
];

const showcases = [
  {
    title: 'AlphaFold 3 Visualizer',
    author: 'Sarah Chen',
    description: 'A WebGL based 3D visualizer for the newest AlphaFold models, featuring real-time bond rendering and prediction confidence heatmaps.',
    tags: JSON.stringify(['React', 'Three.js', 'Biotech']),
    color: 'from-cyan-400 to-blue-600',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    upvotes: 342,
    githubUrl: 'https://github.com'
  },
  {
    title: 'LLM Fine-tuning Pipeline',
    author: 'Marcus Johnson',
    description: 'An automated pipeline to fine-tune Llama-3 8B on custom medical datasets using QLoRA and DeepSpeed.',
    tags: JSON.stringify(['PyTorch', 'LLM', 'Medical']),
    color: 'from-emerald-400 to-teal-600',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    upvotes: 891,
    githubUrl: 'https://github.com'
  },
  {
    title: 'Quantum Circuit Simulator',
    author: 'Dr. Elena Rostova',
    description: 'A high-performance quantum circuit simulator written in Rust with Python bindings, capable of simulating up to 32 qubits.',
    tags: JSON.stringify(['Rust', 'Quantum', 'Physics']),
    color: 'from-purple-400 to-fuchsia-600',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    upvotes: 524,
    githubUrl: 'https://github.com'
  }
];

const competitions = [
  {
    title: 'Neuron LLM Finetuning Challenge',
    prize: '$50,000',
    participants: 1240,
    daysLeft: 14,
    tags: JSON.stringify(['NLP', 'LLM', 'PyTorch']),
    color: 'from-cyan-500 to-blue-600',
    iconStr: 'Terminal'
  },
  {
    title: 'Global Climate Vision Hackathon',
    prize: '$25,000',
    participants: 856,
    daysLeft: 3,
    tags: JSON.stringify(['Computer Vision', 'Climate']),
    color: 'from-emerald-500 to-teal-600',
    iconStr: 'Activity'
  },
  {
    title: 'Protein Folding Predictor',
    prize: '$100,000',
    participants: 3205,
    daysLeft: 45,
    tags: JSON.stringify(['Bioinformatics', 'AlphaFold']),
    color: 'from-purple-500 to-fuchsia-600',
    iconStr: 'Flame'
  }
];

async function seedData(endpoint, dataArray) {
  for (const item of dataArray) {
    try {
      await axios.post(`${API_URL}/${endpoint}`, { data: item });
      console.log(`Successfully seeded to ${endpoint}: ${item.title}`);
    } catch (error) {
      console.error(`Error seeding ${endpoint}: ${item.title}`);
      console.error(error.response?.data || error.message);
    }
  }
}

async function run() {
  console.log('Seeding datasets...');
  await seedData('datasets', datasets);
  
  console.log('Seeding showcases...');
  await seedData('showcases', showcases);
  
  console.log('Seeding competitions...');
  await seedData('competitions', competitions);
  
  console.log('Done.');
}

run();
