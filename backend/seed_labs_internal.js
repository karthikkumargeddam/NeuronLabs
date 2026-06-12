const { createStrapi } = require('@strapi/strapi');

async function seed() {
  const strapi = await createStrapi().load();
  
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
    return p + ' ' + c + ' ' + s;
  }
  
  const advancedCodes = [
    "// Advanced Tensor Decomposition\nimport torch\nfrom tensorly.decomposition import parafac\n\ndef quantum_inspired_decomposition(tensor, rank=10):\n    weights, factors = parafac(tensor, rank=rank, init='random', tol=1e-8)\n    return torch.einsum('r,ir,jr,kr->ijk', weights, *factors)",
    "// Zero-Knowledge Proof Verifier Circuit\npragma solidity ^0.8.0;\nimport './Verifier.sol';\n\ncontract ZkRollup {\n    Verifier public verifier;\n    bytes32 public stateRoot;\n    function verifyProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[1] memory input) public {\n        require(verifier.verifyTx(a, b, c, input), 'Invalid SNARK proof');\n        stateRoot = bytes32(input[0]);\n    }\n}"
  ];
  const visualizations = [
    "graph TD\n    A[Input State] --> B{Qubit Entanglement}\n    B -->|Bell State| C[Quantum Fourier Transform]\n    B -->|GHZ State| D[Phase Estimation]\n    C --> E[Measurement Operator]\n    D --> E\n    E --> F[Classical Post-Processing]"
  ];
  const terminalOutputs = [
    "root@phd-sandbox:~# mpiax run -np 1024 ./quantum_sim\n[Rank 000] Initializing Hilbert Space of dimension 2^40...\n[Rank 256] Entanglement entropy threshold reached.\n[Rank 512] Optimizing matrix product states (MPS)...\n[Rank 000] Simulation converged in 4.2e3 iterations. Energy: -14.23891 eV"
  ];

  console.log("Seeding 260 labs using Strapi internal Document Service...");
  
  for (let i = 1; i <= 260; i++) {
    const title = generateTitle();
    try {
      await strapi.documents('api::lab.lab').create({
        data: {
          name: 'adv-phd-lab-' + i,
          uuid: 'phd-lab-' + (Date.now() + i),
          environment: 'vbox',
          title: title,
          description: 'This advanced PhD research lab focuses on ' + title + '. It provides isolated runtime access for evaluating robust algorithms, cryptographic protocols, or quantum simulations.',
          codeSnippet: advancedCodes[Math.floor(Math.random() * advancedCodes.length)],
          terminalOutput: terminalOutputs[Math.floor(Math.random() * terminalOutputs.length)],
          visualization: visualizations[Math.floor(Math.random() * visualizations.length)]
        },
        status: 'published' // Ensure it's published and accessible!
      });
      if (i % 20 === 0) console.log("Seeded " + i + " labs...");
    } catch (e) {
      console.error("Error creating lab", i, e.message);
    }
  }
  
  console.log("Finished seeding!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
