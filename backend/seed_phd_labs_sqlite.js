const Database = require('better-sqlite3');
const db = new Database('./.tmp/data.db');

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
    print(f"Node ready on GPU {local_rank}")`
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
CUDA Kernel Speedup: 4.5x over PyTorch native.`
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
    style A fill:#f9f,stroke:#333,stroke-width:4px`
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

console.log("Seeding labs via sqlite3 directly...");

// Try to add columns if they don't exist
try { db.prepare('ALTER TABLE labs ADD COLUMN title TEXT').run(); } catch(e){}
try { db.prepare('ALTER TABLE labs ADD COLUMN description TEXT').run(); } catch(e){}
try { db.prepare('ALTER TABLE labs ADD COLUMN code_snippet TEXT').run(); } catch(e){}
try { db.prepare('ALTER TABLE labs ADD COLUMN terminal_output TEXT').run(); } catch(e){}
try { db.prepare('ALTER TABLE labs ADD COLUMN visualization TEXT').run(); } catch(e){}

const stmt = db.prepare(`
  INSERT INTO labs (name, uuid, environment, title, description, code_snippet, terminal_output, visualization, created_at, updated_at, published_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))
`);

// Delete existing to avoid duplicates if rerun
db.prepare('DELETE FROM labs').run();

db.transaction(() => {
  for (let i = 1; i <= LABS_COUNT; i++) {
    const topic = getRandom(topics);
    stmt.run(
      'lab-' + i,
      'phd-lab-' + i,
      'vbox',
      topic + ' - Lab ' + i,
      'In this highly advanced PhD lab, you will explore the depths of ' + topic + '. This environment provides raw root access to isolated containers and pre-configured dependencies.',
      getRandom(codeSnippets),
      getRandom(terminalOutputs),
      getRandom(visualizations)
    );
  }
})();

console.log("Successfully inserted 150 labs.");
