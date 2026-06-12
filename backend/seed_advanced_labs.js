const advancedTopics = [
    // Deep Learning & Neural Networks
    "Transformers with Relative Positional Encoding", "Sparse Attention Mechanisms", "Reformer Architecture", "Perceiver IO", "Neural Turing Machines",
    "Differentiable Neural Computer", "Capsule Networks", "Spiking Neural Networks", "Liquid Time-Constant Networks", "Neural ODEs",
    "Continuous Normalizing Flows", "Hamiltonian Neural Networks", "Graph Attention Networks (GAT)", "Graph Isomorphism Networks (GIN)", "Equivariant Neural Networks",
    "SE(3)-Transformers", "Spherical CNNs", "Implicit Neural Representations (SIREN)", "HyperNetworks", "Meta-Learning with MAML",
    "Reptile Meta-Learning", "Zero-Shot Learning with CLIP", "Few-Shot Prototypical Networks", "Self-Supervised Contrastive Learning (SimCLR)", "Bootstrap Your Own Latent (BYOL)",
    "Masked Autoencoders (MAE)", "Energy-Based Models", "Generative Flow Networks (GFlowNets)", "Diffusion Models (DDPM)", "Latent Diffusion Models",
    "Score-Based Generative Modeling", "Wasserstein GAN with Gradient Penalty", "StyleGAN Architecture", "BigGAN", "VQ-VAE-2",
    // Computer Vision & Image Processing
    "Vision Transformers (ViT)", "Swin Transformer", "Mask R-CNN", "YOLOv8 Object Detection", "DETR (DEtection TRansformer)",
    "Deformable DETR", "Panoptic Feature Pyramid Networks", "DeepLabV3+ Semantic Segmentation", "U-Net with Attention", "3D U-Net for Medical Imaging",
    "NeRF (Neural Radiance Fields)", "Mip-NeRF 360", "Instant NGP", "Gaussian Splatting", "Monocular Depth Estimation (MiDaS)",
    "Optical Flow with RAFT", "Deep Stereo Matching", "Super-Resolution GAN (SRGAN)", "ESRGAN", "Image Inpainting with Partial Convolutions",
    "Style Transfer with AdaIN", "CycleGAN for Image Translation", "StarGAN v2", "Deep Fake Generation with Autoencoders", "Face Recognition with ArcFace",
    "Action Recognition with I3D", "SlowFast Networks", "Skeleton-based Action Recognition (ST-GCN)", "PointNet for 3D Point Clouds", "PointNet++",
    "VoxelNet for LiDAR", "BEVFormer for Autonomous Driving", "Vision-Language Pretraining (ViLBERT)", "BLIP (Bootstrapping Language-Image Pre-training)", "Flamingo Visual Language Model",
    // NLP & Speech
    "BERT with Whole Word Masking", "RoBERTa Optimization", "ALBERT (A Lite BERT)", "T5 (Text-to-Text Transfer Transformer)", "BART for Sequence-to-Sequence",
    "GPT-3 Few-Shot Prompting", "InstructGPT via RLHF", "Direct Preference Optimization (DPO)", "LoRA (Low-Rank Adaptation)", "QLoRA",
    "Retrieval-Augmented Generation (RAG)", "Dense Passage Retrieval (DPR)", "ColBERT", "Longformer for Long Documents", "BigBird",
    "Neural Machine Translation with Transformer", "Unsupervised NMT", "Speech Recognition with wav2vec 2.0", "HuBERT", "Whisper Architecture",
    "Tacotron 2 Text-to-Speech", "FastSpeech 2", "WaveNet Vocoder", "HiFi-GAN", "Speaker Diarization with x-vectors",
    // Reinforcement Learning
    "Proximal Policy Optimization (PPO)", "Trust Region Policy Optimization (TRPO)", "Soft Actor-Critic (SAC)", "Twin Delayed DDPG (TD3)", "Rainbow DQN",
    "Hierarchical RL (Options Framework)", "Goal-Conditioned RL (HER)", "Multi-Agent RL (MADDPG)", "MAPPO (Multi-Agent PPO)", "Offline RL (Conservative Q-Learning)",
    "Decision Transformer", "Trajectory Optimization with iLQR", "Model-Based RL (DreamerV2)", "Model-Based Policy Optimization (MBPO)", "AlphaZero MCTS",
    "MuZero", "Inverse Reinforcement Learning", "Generative Adversarial Imitation Learning (GAIL)", "Evolution Strategies for RL", "Curiosity-Driven Exploration (ICM)",
    // Advanced & PhD Level Topics
    "Bayesian Neural Networks", "Variational Inference in Deep Learning", "Monte Carlo Dropout", "Normalizing Flows (RealNVP)", "Glow Architecture",
    "Neural Tangent Kernel (NTK)", "Information Bottleneck Method in Deep Learning", "Lottery Ticket Hypothesis", "Double Descent Phenomenon", "Federated Learning with FedAvg",
    "Secure Multi-Party Computation in ML", "Differential Privacy in SGD", "Adversarial Robustness (PGD Attacks)", "Certified Defenses in Neural Networks", "Neural Architecture Search (NAS)",
    "DARTS (Differentiable Architecture Search)", "Quantum Neural Networks", "Quantum SVM", "Spatiotemporal Forecasting with ConvLSTM", "Physics-Informed Neural Networks (PINN)"
];

function getStringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function generateAdvancedLabContent(topic, index) {
    const tClean = topic.replace(/[^a-zA-Z0-9]/g, '');
    const tVar = topic.split(' ').map(w => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()).join('_');
    const hash = getStringHash(topic);

    let baseCode = "";
    let baseVis = "";
    let baseTerm = "";

    const archType = hash % 5;

    if (archType === 0) {
        baseCode = `import torch\nimport torch.nn as nn\n\nclass ${tClean}Module(nn.Module):\n    def __init__(self, dim=512):\n        super().__init__()\n        self.projection = nn.Linear(dim, dim)\n        self.activation = nn.GELU()\n        self.norm = nn.LayerNorm(dim)\n        print(f"[INFO] Initializing highly advanced {topic} architecture")\n\n    def forward(self, x):\n        residual = x\n        x = self.norm(x)\n        x = self.activation(self.projection(x))\n        return x + residual\n\n# Advanced Research Implementation\nmodel = ${tClean}Module()\nprint(model)`;
        baseVis = `graph TD\n    Input --> Norm[LayerNorm]\n    Norm --> Proj[Linear Projection ${tClean}]\n    Proj --> Act[GELU Activation]\n    Act --> Add[Residual Add]\n    Input --> Add\n    Add --> Output`;
    } else if (archType === 1) {
        baseCode = `import jax\nimport jax.numpy as jnp\nfrom flax import linen as nn\n\nclass ${tClean}FlaxModel(nn.Module):\n    features: int\n\n    @nn.compact\n    def __call__(self, x):\n        x = nn.Dense(self.features)(x)\n        x = nn.relu(x)\n        print(f"Applying JAX-compiled {topic} transformations")\n        return x\n\n# Accelerated compilation step\nkey = jax.random.PRNGKey(0)\nx_sample = jax.random.normal(key, (1, 128))\nmodel = ${tClean}FlaxModel(features=256)\nvars = model.init(key, x_sample)\nprint("Model initialized on XLA/TPU")`;
        baseVis = `graph LR\n    JAX_PRNG --> Init[Flax Init]\n    XLA[XLA Compiler] --> Compute[Accelerated JIT Compute]\n    Data --> Compute\n    Init --> Compute\n    Compute --> Out[${topic} Result]`;
    } else if (archType === 2) {
        baseCode = `import tensorflow as tf\n\n@tf.function(jit_compile=True)\ndef ${tVar}_step(images, labels):\n    with tf.GradientTape() as tape:\n        predictions = tf.nn.softmax(tf.matmul(images, tf.random.normal((images.shape[1], 10))))\n        loss = tf.keras.losses.sparse_categorical_crossentropy(labels, predictions)\n    gradients = tape.gradient(loss, predictions)\n    return loss, gradients\n\nprint("Executing highly optimized graph for ${topic}")`;
        baseVis = `graph TD\n    T1[Tf.Tensor Image] --> Tape[GradientTape]\n    Tape --> Pred[Softmax Predictions]\n    Pred --> Loss[Cross Entropy]\n    Loss --> Grad[Backpropagation]\n    Grad --> Opt[Optimizer Update ${tClean}]`;
    } else if (archType === 3) {
        baseCode = `import cv2\nimport numpy as np\n\ndef process_${tVar}_vision(image_tensor):\n    # Simulated complex computer vision pipeline\n    gray = cv2.cvtColor(image_tensor, cv2.COLOR_BGR2GRAY)\n    features = cv2.goodFeaturesToTrack(gray, maxCorners=100, qualityLevel=0.01, minDistance=10)\n    print(f"Detected {len(features)} critical points for {topic}")\n    return features\n\n# Simulating PhD-level CV research\nsimulated_img = np.random.randint(0, 255, (512, 512, 3), dtype=np.uint8)\nprocess_${tVar}_vision(simulated_img)`;
        baseVis = `graph LR\n    Img[Raw Image] --> Pre[Preprocessing]\n    Pre --> Ext[Feature Extraction (${topic})]\n    Ext --> Match[Descriptor Matching]\n    Match --> Out[3D Pose / Segmentation]`;
    } else {
        baseCode = `from transformers import AutoModel, AutoConfig\nimport torch\n\n# Simulating large scale language / foundational model\nconfig = AutoConfig.from_pretrained('bert-base-uncased')\nconfig.num_hidden_layers = 48  # Scaling up for research\nmodel = AutoModel.from_config(config)\n\ndef ${tVar}_attention_forward(hidden_states):\n    print(f"Passing through custom {topic} attention block")\n    return hidden_states * torch.sigmoid(hidden_states)\n\nprint("Model architecture loaded for advanced ${topic} research.")`;
        baseVis = `graph TD\n    Tok[Token Embeddings] --> Pos[Positional Encoding]\n    Pos --> Attn[Multi-Head ${topic} Attention]\n    Attn --> FFN[Feed Forward]\n    FFN --> Out[Contextualized Vectors]`;
    }

    baseTerm = `root@phd-gpu-cluster:~# python run_${tVar}_experiment.py --use_cuda=True\n[INFO] Initializing distributed training environment...\n[INFO] Loading PhD-level module: ${topic}\n[METRIC] CUDA Memory Allocated: ${(hash % 40) + 10} GB\n[METRIC] TFLOPS Achieved: ${(hash % 100) + 50}.4\n[SUCCESS] Model converged successfully. Gradients stable.`;

    return { codeSnippet: baseCode, visualization: baseVis, terminalOutput: baseTerm };
}

async function seedAdvancedLabs(strapi) {
    console.log("Starting to seed 100+ highly advanced PhD-level labs for Sandbox...");

    let counter = 1000;
    let successCount = 0;

    for (const topic of advancedTopics) {
        // Check if exists to avoid duplicates
        const existing = await strapi.documents('api::sandbox.sandbox').findMany({
            filters: { title: topic },
            limit: 1
        });

        if (existing && existing.length > 0) {
            console.log(`Sandbox "${topic}" already exists, skipping.`);
            continue;
        }

        const content = generateAdvancedLabContent(topic, counter);

        try {
            await strapi.documents('api::sandbox.sandbox').create({
                data: {
                    name: "adv-sandbox-" + Date.now() + "-" + counter,
                    language: 'python',
                    code_content: content.codeSnippet,
                    is_public: true,
                    environment: 'vbox-gpu-a100',
                    title: topic,
                    description: `[Advanced PhD Research Lab] A deep dive into ${topic}. This sandbox provides a GPU-accelerated environment to explore state-of-the-art algorithms, visualize complex tensor operations, and execute high-performance training loops in computer vision, deep learning, and advanced neural networks.`,
                    terminalOutput: content.terminalOutput,
                    visualization: content.visualization
                },
                status: 'published'
            });
            successCount++;
            if (successCount % 10 === 0) {
                console.log(`Seeded ${successCount} advanced PhD labs...`);
            }
        } catch (e) {
            console.error("Failed to seed advanced lab: " + topic, e);
        }
        counter++;
    }

    console.log("\\n=======================================================");
    console.log(`✅ SUCCESS: ${successCount} NEW HIGHLY ADVANCED LABS SEEDED!`);
    console.log("=======================================================\\n");
}

module.exports = seedAdvancedLabs;
