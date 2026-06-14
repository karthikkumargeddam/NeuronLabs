const fs = require('fs');

const topics = [
    'Transformers with Relative Positional Encoding', 'Sparse Attention Mechanisms', 'Reformer Architecture', 'Perceiver IO', 'Neural Turing Machines',
    'Differentiable Neural Computer', 'Capsule Networks', 'Spiking Neural Networks', 'Liquid Time-Constant Networks', 'Neural ODEs',
    'Continuous Normalizing Flows', 'Hamiltonian Neural Networks', 'Graph Attention Networks (GAT)', 'Graph Isomorphism Networks (GIN)', 'Equivariant Neural Networks',
    'SE(3)-Transformers', 'Spherical CNNs', 'Implicit Neural Representations (SIREN)', 'HyperNetworks', 'Meta-Learning with MAML',
    'Reptile Meta-Learning', 'Zero-Shot Learning with CLIP', 'Few-Shot Prototypical Networks', 'Self-Supervised Contrastive Learning (SimCLR)', 'Bootstrap Your Own Latent (BYOL)',
    'Masked Autoencoders (MAE)', 'Energy-Based Models', 'Generative Flow Networks (GFlowNets)', 'Diffusion Models (DDPM)', 'Latent Diffusion Models',
    'Score-Based Generative Modeling', 'Wasserstein GAN with Gradient Penalty', 'StyleGAN Architecture', 'BigGAN', 'VQ-VAE-2',
    'Vision Transformers (ViT)', 'Swin Transformer', 'Mask R-CNN', 'YOLOv8 Object Detection', 'DETR (DEtection TRansformer)',
    'Deformable DETR', 'Panoptic Feature Pyramid Networks', 'DeepLabV3+ Semantic Segmentation', 'U-Net with Attention', '3D U-Net for Medical Imaging',
    'NeRF (Neural Radiance Fields)', 'Mip-NeRF 360', 'Instant NGP', 'Gaussian Splatting', 'Monocular Depth Estimation (MiDaS)',
    'Optical Flow with RAFT', 'Deep Stereo Matching', 'Super-Resolution GAN (SRGAN)', 'ESRGAN', 'Image Inpainting with Partial Convolutions'
];

let items = topics.map((t, i) => {
  return `    {
      id: 'adv-lab-${i}',
      title: '${t.replace(/'/g, "\\'")}',
      level: 'PhD / Post-Doc',
      description: 'Advanced PhD Research Lab: A deep dive into ${t.replace(/'/g, "\\'")}. This sandbox provides a GPU-accelerated environment to explore state-of-the-art algorithms and execute high-performance training loops.',
      status: 'Online',
    }`;
});

const fileContent = `import Link from 'next/link';
import { fetchAPI } from '../../../lib/api';

export default async function AdvancedLabsPage() {
  const response = await fetchAPI('/api/sandboxes', { populate: '*', pagination: { limit: 200 } }, { next: { revalidate: 60 } });
  const backendLabs = response?.data || [];
  
  const advancedLabsFromBackend = backendLabs.filter(lab => {
    const attrs = lab.attributes || lab;
    return attrs.title && attrs.description && attrs.description.includes('PhD Research');
  });

  const fallbackTopics = [
${items.join(',\n')}
  ];

  const labsToDisplay = advancedLabsFromBackend.length > 0 ? advancedLabsFromBackend.map(lab => {
    const attrs = lab.attributes || lab;
    return {
      id: attrs.uuid || lab.id,
      title: attrs.title,
      level: 'PhD / Post-Doc',
      description: attrs.description,
      status: 'Online',
    };
  }) : fallbackTopics;

  return (
    <div className="min-h-screen p-8 md:p-16 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-12 text-center">
        <div className="inline-block border border-[var(--accent)] bg-[rgba(244,63,94,0.1)] text-[var(--accent)] text-sm font-mono px-4 py-2 rounded-full mb-6">
          PhD Level
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Highly Advanced Labs</h1>
        <p className="text-xl text-gray-400">Explore 50+ cutting-edge research environments and architectures.</p>
      </div>

      <div className="mb-8 flex justify-center">
        <Link href="/labs" className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-400 transition-all">
          &larr; Back to All Labs
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {labsToDisplay.map((lab) => (
          <Link href={\`/labs/\${lab.id}\`} key={lab.id}>
            <div className="glass-panel p-6 h-full hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600 mix-blend-overlay filter blur-[64px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="inline-block border border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-mono px-2 py-1 rounded-full mb-4 self-start uppercase tracking-wider">
                {lab.level}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-fuchsia-400 transition-colors">{lab.title}</h3>
              <p className="text-gray-400 text-sm flex-grow line-clamp-3">{lab.description}</p>
              
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {lab.status}
                </div>
                <div className="text-xs font-bold text-fuchsia-500 group-hover:text-fuchsia-400 transition-colors">
                  ENTER LAB &rarr;
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('c:\\Neuron\\frontend\\src\\app\\labs\\advanced\\page.jsx', fileContent);
console.log('Done replacing page.jsx');
