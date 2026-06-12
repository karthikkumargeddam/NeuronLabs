const prefixes = [
  "Quantum-Assisted", "Neuromorphic", "Hyper-Dimensional", "Topological", "Federated",
  "Homomorphic", "Adversarial", "Asynchronous", "Decentralized", "Probabilistic",
  "Zero-Knowledge", "Stochastic", "Non-Euclidean", "Bayesian", "Synergistic",
  "Isomorphic", "Self-Supervised", "Autonomous", "Multi-Agent", "Bio-Inspired"
];

const cores = [
  "Tensor Networks", "Spiking Neural Networks", "Graph Representation Learning",
  "Lattice Cryptography", "Transformer Attention Heads", "Diffusion Models",
  "Reinforcement Learning Policies", "Generative Adversarial Networks",
  "Swarm Intelligence Algorithms", "Markov Decision Processes",
  "Dirichlet Process Mixtures", "Manifold Optimization",
  "Differential Privacy Protocols", "Secure Multi-Party Computation",
  "Elliptic Curve pairings", "Recurrent Attractor Networks"
];

const suffixes = [
  "for High-Energy Physics", "in Sub-linear Time", "with Formal Verification",
  "for Genomics Sequencing", "in Autonomous Drones", "with Extreme Edge Computing",
  "via Homological Algebra", "for Brain-Computer Interfaces", "in Exascale Systems",
  "with Provable Security Bounds", "for Combinatorial Optimization"
];

function generateTitle() {
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const c = cores[Math.floor(Math.random() * cores.length)];
  const s = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${p} ${c} ${s}`;
}

const advancedCodes = [
`// Advanced Tensor Decomposition
import torch
from tensorly.decomposition import parafac

def quantum_inspired_decomposition(tensor, rank=10):
    # ALS algorithm for CP-decomposition
    weights, factors = parafac(tensor, rank=rank, init='random', tol=1e-8)
    reconstructed = torch.einsum('r,ir,jr,kr->ijk', weights, *factors)
    return reconstructed`,

`// Zero-Knowledge Proof Verifier Circuit
pragma solidity ^0.8.0;
import "./Verifier.sol";

contract ZkRollup {
    Verifier public verifier;
    bytes32 public stateRoot;
    
    function verifyProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[1] memory input) public {
        require(verifier.verifyTx(a, b, c, input), "Invalid SNARK proof");
        stateRoot = bytes32(input[0]);
    }
}`,

`// Spike-Timing-Dependent Plasticity (STDP) Rule
import numpy as np

def stdp_update(pre_spikes, post_spikes, weights, A_plus=0.01, A_minus=0.012, tau=20.0):
    delta_t = post_spikes - pre_spikes
    weight_update = np.where(
        delta_t > 0, 
        A_plus * np.exp(-delta_t / tau),
        -A_minus * np.exp(delta_t / tau)
    )
    return np.clip(weights + weight_update, 0.0, 1.0)`,

`# Distributed Paxos Consensus Node
import asyncio

class PaxosNode:
    async def prepare(self, proposal_id):
        if proposal_id > self.promised_id:
            self.promised_id = proposal_id
            return ('PROMISE', self.accepted_id, self.accepted_value)
        return ('REJECT',)
        
    async def accept(self, proposal_id, value):
        if proposal_id >= self.promised_id:
            self.promised_id = proposal_id
            self.accepted_id = proposal_id
            self.accepted_value = value
            return ('ACCEPTED',)
        return ('REJECT',)`
];

const visualizations = [
`graph TD
    A[Input State] --> B{Qubit Entanglement}
    B -->|Bell State| C[Quantum Fourier Transform]
    B -->|GHZ State| D[Phase Estimation]
    C --> E[Measurement Operator]
    D --> E
    E --> F[Classical Post-Processing]`,

`sequenceDiagram
    participant Prover
    participant Verifier
    Prover->>Verifier: Commit(State)
    Verifier-->>Prover: Challenge(Random Coin)
    Prover->>Verifier: Response(ZKP)
    Verifier->>Verifier: Verify(Bilinear Pairing)
    Verifier-->>Prover: Accept / Reject`,

`graph LR
    P1((Pre-Synaptic Node)) -->|Spike Train| S1{Synapse}
    S1 -->|Current Injection| P2((Post-Synaptic Node))
    P2 -->|Feedback| S1
    style S1 fill:#f96,stroke:#333`
];

const terminalOutputs = [
`root@phd-sandbox:~# mpiax run -np 1024 ./quantum_sim
[Rank 000] Initializing Hilbert Space of dimension 2^40...
[Rank 256] Entanglement entropy threshold reached.
[Rank 512] Optimizing matrix product states (MPS)...
[Rank 000] Simulation converged in 4.2e3 iterations. Energy: -14.23891 eV`,

`root@phd-sandbox:~# snarkjs groth16 verify verification_key.json public.json proof.json
[INFO]  snarkJS: OK!
[SUCCESS] Proof Verified Cryptographically.
[METRIC] Verification time: 42.1 ms`,

`root@phd-sandbox:~# gcc -O3 -fopenmp lattice_crypto.c -o crypto_bench
root@phd-sandbox:~# ./crypto_bench
Generating Ring-LWE public keys...
Security bits: 256
Lattice dimension: 1024
Time to encrypt: 12.4 us
Time to decrypt: 4.8 us`
];

async function generateLabs() {
  console.log("Generating 260 highly advanced PhD labs via API...");
  const TOTAL_LABS = 260;
  
  for (let i = 1; i <= TOTAL_LABS; i++) {
    const title = generateTitle();
    
    const labData = {
      data: {
        name: 'adv-phd-lab-' + i,
        uuid: 'phd-lab-' + (Date.now() + i), // ensuring unique uuid
        environment: 'vbox',
        title: title,
        description: 'This advanced PhD research lab focuses on ' + title + '. It provides isolated runtime access for evaluating robust algorithms, cryptographic protocols, or quantum simulations.',
        codeSnippet: advancedCodes[Math.floor(Math.random() * advancedCodes.length)],
        terminalOutput: terminalOutputs[Math.floor(Math.random() * terminalOutputs.length)],
        visualization: visualizations[Math.floor(Math.random() * visualizations.length)]
      }
    };

    try {
      const response = await fetch("http://localhost:1337/api/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(labData)
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(`Failed to add lab ${i}:`, data.error);
      } else {
        if (i % 25 === 0) {
          console.log(`Successfully added ${i} labs...`);
        }
      }
    } catch (e) {
      console.error(`Error adding lab ${i}:`, e.message);
    }
  }
  
  console.log(`Finished appending ${TOTAL_LABS} advanced PhD labs.`);
}

generateLabs();
