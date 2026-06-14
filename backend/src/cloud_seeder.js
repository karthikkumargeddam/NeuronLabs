module.exports = async (strapi) => {
    console.log('Starting cloud_seeder...');

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
        description: "Meta's latest highly capable 8B parameter model fine-tuned for instruction following and dialogue.",
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

    const seed = async (uid, dataArray, searchKey = 'title') => {
        for (const item of dataArray) {
            try {
                let queryKey = searchKey;
                if (uid === 'api::model.model') queryKey = 'name';
                if (uid === 'api::profile.profile') queryKey = 'username';
                
                const existing = await strapi.documents(uid).findFirst({
                    filters: { [queryKey]: item[queryKey] }
                });
                if (!existing) {
                    await strapi.documents(uid).create({ data: item, status: 'published' });
                    console.log(`Seeded ${uid}: ${item[queryKey]}`);
                }
            } catch(e) {
                console.error(`Error seeding ${uid}:`, e.message);
            }
        }
    };

    await seed('api::job.job', jobs);
    await seed('api::profile.profile', profiles);
    await seed('api::model.model', models);
    await seed('api::dataset.dataset', datasets);
    await seed('api::showcase.showcase', showcases);
    await seed('api::competition.competition', competitions);

    // Set Public Permissions
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (publicRole) {
        const uids = [
            'api::job.job',
            'api::profile.profile',
            'api::model.model',
            'api::dataset.dataset',
            'api::showcase.showcase',
            'api::competition.competition',
            'api::lab.lab'
        ];
        for (const uid of uids) {
            const actions = [`${uid}.find`, `${uid}.findOne`];
            for (const action of actions) {
                const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
                    where: { action, role: publicRole.id }
                });
                if (!existing) {
                    await strapi.db.query('plugin::users-permissions.permission').create({
                        data: { action, role: publicRole.id }
                    });
                    console.log(`Granted ${action} to public role`);
                }
            }
        }
    }
    console.log('Cloud seeding complete.');
};
