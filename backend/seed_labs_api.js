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
  "Gaussian Processes"
];

const codeSnippets = [
`import math

def calculate_attention(query, key, value):
    d_k = len(query)
    scores = [q * k for q, k in zip(query, key)]
    attention_weights = [math.exp(s) for s in scores]
    sum_weights = sum(attention_weights)
    attention_weights = [w / sum_weights for w in attention_weights]
    
    result = [w * v for w, v in zip(attention_weights, value)]
    return result

q = [1.0, 0.0, 1.0]
k = [0.5, 0.5, 0.5]
v = [10, 20, 30]

print("Attention Output:", calculate_attention(q, k, v))`,
`def simple_gradient_descent(x_start, learning_rate, epochs):
    x = x_start
    for i in range(epochs):
        # f(x) = x^2, f'(x) = 2x
        gradient = 2 * x
        x = x - learning_rate * gradient
        print(f"Epoch {i+1}: x = {x:.4f}")
    return x

final_x = simple_gradient_descent(5.0, 0.1, 10)
print(f"Converged to: {final_x:.4f}")`
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

async function seedLabs() {
  for (let i = 1; i <= 6; i++) {
    const topic = getRandom(topics);
    const labData = {
      data: {
        name: 'lab-' + i,
        uuid: 'phd-lab-' + i,
        environment: 'vbox',
        title: topic + ' - Lab ' + i,
        description: 'In this highly advanced PhD lab, you will explore the depths of ' + topic + '.',
        codeSnippet: getRandom(codeSnippets),
        terminalOutput: 'root@phd-lab:~# waiting for execution...\n',
        visualization: getRandom(visualizations),
        publishedAt: new Date().toISOString()
      }
    };

    try {
      const response = await fetch("http://127.0.0.1:1337/api/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(labData)
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(`Failed to add lab ${i}:`, data.error);
      } else {
        console.log(`Successfully added lab ${i}`);
      }
    } catch (e) {
      console.error(`Error adding lab ${i}:`, e.message);
    }
  }
}

seedLabs();
