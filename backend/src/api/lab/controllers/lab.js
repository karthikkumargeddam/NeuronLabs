'use strict';

/**
 * lab controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::lab.lab', ({ strapi }) => ({
  async seedLabs(ctx) {
    const prefixes = ["Quantum-Assisted", "Neuromorphic", "Hyper-Dimensional", "Topological", "Federated", "Homomorphic", "Adversarial", "Asynchronous", "Decentralized", "Probabilistic"];
    const cores = ["Tensor Networks", "Spiking Neural Networks", "Graph Representation Learning", "Lattice Cryptography", "Transformer Attention Heads", "Diffusion Models"];
    const suffixes = ["for High-Energy Physics", "in Sub-linear Time", "with Formal Verification", "for Genomics Sequencing", "in Autonomous Drones"];
    
    function generateTitle() {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const c = cores[Math.floor(Math.random() * cores.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      return { title: p + ' ' + c + ' ' + s, p, c, s };
    }

    function generateContent(p, c, s) {
      const pClean = p.replace(/[^a-zA-Z0-9]/g, '');
      const cClean = c.replace(/[^a-zA-Z0-9]/g, '');
      const sClean = s.split(' ').map(w => w.replace(/[^a-zA-Z0-9]/g, '')).join('_').toLowerCase();
      
      const className = `${pClean}${cClean}Model`;
      const methodName = `process_${sClean}`;
      
      let baseCode = "";
      let baseTerm = "";
      let baseVis = "";
      
      if (c.includes("Tensor") || c.includes("Spiking")) {
        baseCode = `import numpy as np\nimport torch\nimport torch.nn as nn\n\n# Dynamic Research Implementation for ${p} ${c}\nclass ${className}(nn.Module):\n    def __init__(self, input_dim=1024, hidden_dim=512):\n        super(${className}, self).__init__()\n        self.core_layer = nn.Linear(input_dim, hidden_dim)\n        self.activation = nn.GELU()\n        self.context_gate = nn.Parameter(torch.randn(hidden_dim))\n        print("Initialized ${className} for ${s}")\n\n    def forward(self, x):\n        """\n        Forward pass adapted for ${p} principles.\n        """\n        projected = self.core_layer(x)\n        activated = self.activation(projected)\n        return activated * torch.sigmoid(self.context_gate)\n\n    def ${methodName}(self, dataset):\n        # Simulated processing routine\n        results = []\n        for batch in dataset:\n            out = self.forward(batch)\n            results.append(out.mean().item())\n        return results`;
        
        baseTerm = `root@phd-lab:~# python run_experiment.py --model ${className} --target "${s}"\n[INFO] Loading highly optimized C++ kernels for ${c}...\n[INFO] Allocating 64GB VRAM for ${p} simulation...\n[METRIC] Epoch 1/50 - Loss: 4.291 - Perf: 120 TFLOPS\n[METRIC] Epoch 50/50 - Loss: 0.002 - Convergence reached.\n[SUCCESS] ${className} successfully completed ${methodName} execution!`;
        
        baseVis = `graph TD\n    A[Input Vector Space] -->|Linear Map| B{${pClean} Gate}\n    B -->|Activation| C[${c} Core Layer]\n    C --> D((Context Parameterization))\n    D -->|Sigmoid Mask| E[Output Distribution ${sClean}]`;
      } else if (c.includes("Cryptography") || c.includes("Diffusion")) {
        baseCode = `import hashlib\nimport os\n\n# Robust Implementation for ${p} ${c}\nclass ${className}_Protocol:\n    def __init__(self, security_level=256):\n        self.security_level = security_level\n        self.entropy_pool = os.urandom(32)\n        self.state_hash = hashlib.sha256(self.entropy_pool).hexdigest()\n        print("Bootstrapping ${c} protocol with ${p} guarantees.")\n\n    def generate_proof(self, data_payload):\n        """\n        Generates cryptographic or stochastic proof over ${s}.\n        """\n        combined = f"{self.state_hash}:{data_payload}".encode('utf-8')\n        proof = hashlib.blake2b(combined, digest_size=self.security_level//8).hexdigest()\n        return proof\n\n    def ${methodName}(self, verification_data):\n        proofs = [self.generate_proof(d) for d in verification_data]\n        return all(len(p) == self.security_level//4 for p in proofs)`;
        
        baseTerm = `root@phd-lab:~# ./run_protocol.sh --protocol ${className}\n[BOOT] Securing memory pages from swapping (mlockall)...\n[INFO] Initializing ${c} with ${p} entropy injection.\n[VERIFY] Validating invariant: ${s}\n[SUCCESS] Protocol verified against 100,000 edge cases.\n[METRIC] Throughput: 45.2k ops/sec`;
        
        baseVis = `sequenceDiagram\n    participant Protocol as ${className}\n    participant Env as Environment\n    Env->>Protocol: Initialize with ${p} Entropy\n    Protocol-->>Env: State Hash Ready\n    Env->>Protocol: Request Proof for ${s}\n    Protocol->>Protocol: Generate Blake2b Proof\n    Protocol-->>Env: Verified Proof Token`;
      } else {
        baseCode = `import asyncio\nimport networkx as nx\n\n# Advanced Research Routine for ${p} ${c}\nclass ${className}Graph:\n    def __init__(self, num_nodes=1000):\n        self.graph = nx.erdos_renyi_graph(num_nodes, 0.05)\n        self.topology = "${p}"\n        print("Constructed ${c} graph structure.")\n\n    async def propagate_signal(self, origin_node):\n        """\n        Asynchronous signal propagation adapted for ${s}.\n        """\n        visited = set([origin_node])\n        queue = [origin_node]\n        \n        while queue:\n            current = queue.pop(0)\n            for neighbor in self.graph.neighbors(current):\n                if neighbor not in visited:\n                    visited.add(neighbor)\n                    queue.append(neighbor)\n            await asyncio.sleep(0.001) # Simulating propagation delay\n        return len(visited)\n\n    def ${methodName}(self):\n        return asyncio.run(self.propagate_signal(0))`;
        
        baseTerm = `root@phd-lab:~# mpirun -np 64 python distributed_graph.py --type ${className}\n[NODE 00] Allocating Distributed Graph with 1,000 Vertices...\n[NODE 32] Applying ${p} topology constraints...\n[INFO] Starting signal propagation ${s}...\n[SUCCESS] 100% of nodes reached within theoretical bounds.\n[METRIC] Propagation Latency: 12.4ms`;
        
        baseVis = `graph LR\n    G_ROOT((Root Node)) -->|Propagate| N1[${pClean} Subnet A]\n    G_ROOT -->|Propagate| N2[${pClean} Subnet B]\n    N1 -.->|${c}| N3{Aggregator}\n    N2 -.->|${c}| N3\n    N3 ==> O((Output ${sClean}))`;
      }
      
      return { codeSnippet: baseCode, terminalOutput: baseTerm, visualization: baseVis };
    }

    let count = 0;
    let errors = [];
    for (let i = 1; i <= 10; i++) {
      const { title, p, c, s } = generateTitle();
      const content = generateContent(p, c, s);
      try {
        await strapi.documents('api::lab.lab').create({
          data: {
            name: 'adv-phd-lab-' + Date.now() + '-' + i,
            uuid: 'phd-lab-' + Date.now() + '-' + i,
            environment: 'vbox',
            title: title,
            description: 'Advanced PhD research laboratory specializing in ' + title + '. The environment provides low-level isolated runtime access, kernel-space tracing, and robust mathematical libraries.',
            codeSnippet: content.codeSnippet,
            terminalOutput: content.terminalOutput,
            visualization: content.visualization
          },
          status: 'published'
        });
        
        count++;
      } catch (e) {
        errors.push(e.message);
      }
    }
    
    ctx.send({ message: "Seeded " + count + " contextual labs!", errors: errors.slice(0, 5) });
  }
}));
