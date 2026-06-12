const { createStrapi } = require('@strapi/strapi');
require('dotenv').config();

async function seedPages() {
  console.log('Starting Strapi to seed Pages...');
  const app = await createStrapi({ distDir: './dist' }).load();

  const pages = [
    {
      title: 'Documentation',
      slug: 'documentation',
      content: `
## Getting Started

Welcome to the NeuronLabs Documentation. Here you will find everything you need to know about setting up your sandbox environments, navigating the PhD-level curriculum, and utilizing distributed training clusters.

To begin, create an account using the Sign Up portal, and spin up your first Virtual Box instance from the "Sandboxes" tab.

## Virtual Boxes

Our Virtual Box environments are pre-configured Linux instances designed for high-performance computing. They come fully loaded with:
- CUDA 12.x Toolkit
- PyTorch & TensorFlow (GPU accelerated)
- Docker & Docker Compose
- Root access for complete environment control

## Course Progress

Your progression in the "Courses" tab is automatically tracked. Any code you write within the embedded browser IDE is saved to your account session. Ensure you are signed in before starting a module.
      `
    },
    {
      title: 'API Reference',
      slug: 'api-reference',
      content: `
Programmatically control your sandboxes, access course materials, and trigger remote training runs via the NeuronLabs REST API.

### \`GET /api/courses\`
Retrieves a paginated list of all available PhD-level courses and labs.
\`\`\`bash
curl -X GET "https://api.neuronlabs.edu/v1/courses" \\
  -H "Authorization: Bearer YOUR_API_TOKEN"
\`\`\`

### \`POST /api/sandboxes/provision\`
Provisions a new isolated Virtual Box cluster with the requested GPU configuration.
\`\`\`bash
curl -X POST "https://api.neuronlabs.edu/v1/sandboxes/provision" \\
  -H "Content-Type: application/json" \\
  -d '{"gpu_type": "A100", "count": 2, "image": "pytorch:latest"}'
\`\`\`
      `
    },
    {
      title: 'Support',
      slug: 'support',
      content: `
Whether you're dealing with a hanging training loop or a cluster provisioning error, our dedicated support team for PhD researchers is available 24/7.

### Technical Support
Issues with your Virtual Box, GPU allocation, or code execution environments.
**Email:** support@neuronlabs.edu

### Academic Advising
Questions regarding course curriculum, PhD research tracks, and module certifications.
**Email:** academic@neuronlabs.edu
      `
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy',
      content: `
Last updated: June 2026

## 1. Data Collection
We collect information you provide directly to us, such as your username, email address, and institutional affiliation when you register for an account. We also automatically collect telemetry data from your sandbox environments, including hardware utilization metrics (GPU/CPU usage) to optimize cluster performance.

## 2. Code and Intellectual Property
Any code you write, execute, or store within the NeuronLabs Virtual Boxes remains your intellectual property. We do not use your proprietary research or training scripts to train our own base models. However, code executed within shared Sandboxes may be temporarily cached on our distributed nodes.

## 3. Data Security
We implement strict security measures to protect your data. All communication with our APIs is encrypted via TLS. Virtual Box environments are completely isolated via hardware-level virtualization, preventing cross-tenant data leakage.
      `
    },
    {
      title: 'Terms of Service',
      slug: 'terms',
      content: `
Last updated: June 2026

## 1. Acceptance of Terms
By accessing and using the NeuronLabs platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

## 2. Acceptable Use
You agree to use our Virtual Box environments solely for educational and research purposes. The following activities are strictly prohibited:
- Cryptocurrency mining
- Hosting malicious content or launching network attacks
- Bypassing resource quotas or virtualization boundaries
- Sharing account credentials with unauthorized users

## 3. Termination
We reserve the right to suspend or terminate your access to the platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
      `
    }
  ];

  try {
    for (const page of pages) {
      // Check if page already exists
      const existing = await app.db.query('api::page.page').findOne({
        where: { slug: page.slug }
      });

      if (!existing) {
        await app.db.query('api::page.page').create({
          data: page
        });
        console.log(`Created page: ${page.title}`);
      } else {
        await app.db.query('api::page.page').update({
          where: { id: existing.id },
          data: page
        });
        console.log(`Updated page: ${page.title}`);
      }
    }
    
    // Allow public access to pages
    const roleService = app.service('plugin::users-permissions.role');
    const publicRole = await app.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    
    if (publicRole) {
      await app.db.query('plugin::users-permissions.permission').createMany({
        data: [
          { action: 'api::page.page.find', role: publicRole.id },
          { action: 'api::page.page.findOne', role: publicRole.id }
        ]
      });
      console.log('Granted public permissions to Page API');
    }

    console.log('Finished seeding Pages.');
  } catch (error) {
    console.error('Error seeding pages:', error);
  }

  process.exit(0);
}

seedPages();
