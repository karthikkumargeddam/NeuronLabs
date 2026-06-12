const { createStrapi } = require('@strapi/strapi');

async function seed() {
  const strapi = await createStrapi().load();

  const companies = [
    { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" },
    { name: "Google DeepMind", logo: "https://upload.wikimedia.org/wikipedia/commons/archive/b/b5/20240325175926%21Google_DeepMind_logo.svg" },
    { name: "Anthropic", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Anthropic_logo.svg" },
    { name: "Meta AI", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "NVIDIA", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
    { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
    { name: "Cohere", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Cohere_logo.svg" },
    { name: "Scale AI", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Scale_AI_logo.svg" },
    { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" }
  ];

  const titles = [
    "Machine Learning Engineer", "Research Scientist", "AI Researcher", 
    "Data Scientist", "NLP Engineer", "Computer Vision Engineer", 
    "Software Engineer - AI", "Deep Learning Engineer", "Robotics Engineer",
    "Generative AI Engineer", "AI Product Manager", "LLM Researcher",
    "Applied Scientist", "AI Safety Researcher", "Prompt Engineer"
  ];

  const locations = [
    "San Francisco, CA", "London, UK", "New York, NY", "Remote", 
    "Seattle, WA", "Palo Alto, CA", "Toronto, ON", "Paris, France",
    "Boston, MA", "Austin, TX"
  ];

  const types = ["Full-time", "Contract", "Part-time"];
  
  const tagsPool = [
    "PyTorch", "TensorFlow", "Python", "C++", "CUDA", "LLMs", "NLP", 
    "Computer Vision", "Reinforcement Learning", "JAX", "Transformers",
    "Distributed Systems", "MLOps", "Generative AI", "Rust"
  ];

  const salaries = [
    "$150k - $250k", "$180k - $300k", "$200k - $350k", "$130k - $180k",
    "$160k - $220k", "$250k - $400k", "Competitive", "Equity + Salary"
  ];

  console.log("Seeding 50 LinkedIn jobs...");

  let successCount = 0;

  for (let i = 1; i <= 50; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const salary = salaries[Math.floor(Math.random() * salaries.length)];
    
    // Pick 2-4 random tags
    const numTags = Math.floor(Math.random() * 3) + 2;
    const shuffledTags = [...tagsPool].sort(() => 0.5 - Math.random());
    const tags = shuffledTags.slice(0, numTags);

    const applyUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(company.name + ' ' + title)}`;

    try {
      await strapi.documents('api::job.job').create({
        data: {
          title,
          company: company.name,
          location,
          type,
          salary,
          logo: company.logo,
          tags,
          applyUrl
        },
        status: 'published'
      });
      successCount++;
      if (i % 10 === 0) console.log(`Seeded ${i} jobs...`);
    } catch (e) {
      console.error(`Error creating job ${i}:`, e.message);
    }
  }

  console.log(`Successfully seeded ${successCount} jobs!`);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
