const { createStrapi } = require('@strapi/strapi');
require('dotenv').config();

const LABS_COUNT = 150;

const topics = [
  "Advanced Transformer Architectures",
  "Distributed Data Parallel (DDP)",
  "Custom CUDA Kernels for Attention",
  "Latent Diffusion Models",
  "Generative Adversarial Networks (GANs)",
  "Variational Autoencoders (VAEs)",
  "Graph Neural Networks (GNNs)",
  "Reinforcement Learning with PPO",
  "Support Vector Machines Kernel Tricks",
  "Gaussian Processes",
  "Distributed Hash Tables (DHT)",
  "Paxos Consensus Algorithm",
  "Raft Leader Election",
  "Advanced A* Search with Heuristics",
  "Concurrent B-Trees"
];

const codeSnippets = [
`import torch
import torch.nn as nn
class AdvancedModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.TransformerEncoderLayer(d_model=1024, nhead=16)
    def forward(self, x):
        return self.encoder(x)`,
`import torch.distributed as dist
import os
def init_cluster():
    dist.init_process_group(backend='nccl')
    local_rank = int(os.environ['LOCAL_RANK'])
    torch.cuda.set_device(local_rank)
    print(f"Node ready on GPU {local_rank}")`,
`import numpy as np
def compute_kernel(x, y):
    # Advanced RBF Kernel Trick
    gamma = 0.5
    return np.exp(-gamma * np.linalg.norm(x - y)**2)`,
`class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.color = 'RED' # Red-Black Tree
# Concurrent access controlled via fine-grained locks
def insert(root, key):
    pass`
];

const terminalOutputs = [
`root@phd-lab:~# python run.py
Initializing Distributed Environment...
[GPU:0] Rank 0 starting...
[GPU:1] Rank 1 starting...
Epoch 1/100 - Loss: 0.4521 - Accuracy: 92.4%`,
`root@phd-lab:~# make compile_cuda
nvcc -c attention_kernel.cu -o attention.o
g++ -shared -o libattention.so attention.o
root@phd-lab:~# python bench.py
CUDA Kernel Speedup: 4.5x over PyTorch native.`,
`root@phd-lab:~# ./run_raft
Node 1 starting election...
Node 1 became LEADER in Term 4.
Node 2 appending entries from Node 1.
Consensus reached.`
];

const visualizations = [
`graph TD
    A[Input Data] --> B[Embedding Layer]
    B --> C{Multi-Head Attention}
    C -->|Query| D[Self-Attention]
    C -->|Key| D
    C -->|Value| D
    D --> E[Feed Forward]
    E --> F[Output]`,
`graph LR
    A((Node 1)) <--> B((Node 2))
    B <--> C((Node 3))
    C <--> A
    A -->|Heartbeat| B
    A -->|Heartbeat| C
    style A fill:#f9f,stroke:#333,stroke-width:4px`,
`pie title Model Parameter Distribution
    "Attention Weights" : 45
    "Feed Forward" : 40
    "Embeddings" : 10
    "Layer Norm" : 5`,
`sequenceDiagram
    participant Client
    participant Leader
    participant Follower
    Client->>Leader: AppendEntry(data)
    Leader->>Follower: Replicate(data)
    Follower-->>Leader: Ack
    Leader-->>Client: Success`
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function run() {
  console.log("Loading Strapi...");
  const app = await createStrapi({ distDir: './dist' }).load();
  console.log("Strapi loaded. Starting to seed 150 PhD Virtual Labs...");
  
  for (let i = 1; i <= LABS_COUNT; i++) {
    const topic = getRandom(topics);
    await app.db.query('api::lab.lab').create({
      data: {
        name: 'lab-' + i,
        uuid: 'phd-lab-' + i,
        environment: "vbox",
        title: topic + ' - Lab ' + i,
        description: 'In this highly advanced PhD lab, you will explore the depths of ' + topic + '. This environment provides raw root access to isolated containers and pre-configured dependencies.',
        codeSnippet: getRandom(codeSnippets),
        terminalOutput: getRandom(terminalOutputs),
        visualization: getRandom(visualizations),
        publishedAt: new Date()
      }
    });
    if (i % 10 === 0) console.log('Seeded ' + i + ' labs');
  }
  
  console.log("Finished seeding labs.");
  process.exit(0);
}

run();
