const advancedTemplates = [
  {
    topic: "Multi-Layer Perceptron (From Scratch)",
    description: "Implement a complete forward and backward pass for a Multi-Layer Perceptron using only standard math libraries. Understand the vanishing gradient problem and optimal weight initialization techniques.",
    codeSnippet: `import math
import random

# A simple 1-hidden layer MLP from scratch
def sigmoid(x):
    return 1 / (1 + math.exp(-max(min(x, 100), -100))) # clip to avoid overflow

def sigmoid_derivative(x):
    return x * (1 - x)

random.seed(42)
weights_i_h = [[random.uniform(-1, 1) for _ in range(3)] for _ in range(2)]
weights_h_o = [[random.uniform(-1, 1) for _ in range(1)] for _ in range(3)]

print("Initialized MLP weights for 2->3->1 architecture.")
print("Hidden layer weights:")
for w in weights_i_h: print([round(v, 4) for v in w])
print("Output layer weights:")
for w in weights_h_o: print([round(v, 4) for v in w])
`,
    terminalOutput: "root@phd-lab:~# Waiting for execution...",
    visualization: `graph TD
    I1((Input 1)) --> H1((Hidden 1))
    I1 --> H2((Hidden 2))
    I1 --> H3((Hidden 3))
    I2((Input 2)) --> H1
    I2 --> H2
    I2 --> H3
    H1 --> O1((Output))
    H2 --> O1
    H3 --> O1
    style O1 fill:#f9f,stroke:#333,stroke-width:4px`
  },
  {
    topic: "K-Means Clustering Optimization",
    description: "Build an optimized K-Means clustering algorithm using Lloyd's heuristic. Explore cluster centroid convergence and Voronoi tessellation properties.",
    codeSnippet: `import math
import random

def euclidean_distance(p1, p2):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(p1, p2)))

data = [(random.uniform(0, 100), random.uniform(0, 100)) for _ in range(100)]
k = 3
centroids = random.sample(data, k)

print(f"Initial {k} centroids:")
for i, c in enumerate(centroids):
    print(f"Cluster {i+1}: ({c[0]:.2f}, {c[1]:.2f})")

# One iteration of assignment
clusters = [[] for _ in range(k)]
for point in data:
    distances = [euclidean_distance(point, c) for c in centroids]
    closest_index = distances.index(min(distances))
    clusters[closest_index].append(point)

print("\\nAfter 1 iteration:")
for i, cl in enumerate(clusters):
    print(f"Cluster {i+1} size: {len(cl)}")
`,
    terminalOutput: "root@phd-lab:~# Waiting for execution...",
    visualization: `graph LR
    subgraph Data Space
        D1[Data Point] --> C1((Centroid A))
        D2[Data Point] --> C2((Centroid B))
        D3[Data Point] --> C1
    end
    C1 --> O[Recalculate Means]
    C2 --> O
    O -.->|Iterate| D1`
  },
  {
    topic: "Decentralized Consensus Simulation",
    description: "Simulate a generic Paxos/Raft leader election phase. This lab explores heartbeat mechanisms, term increments, and split votes in distributed systems.",
    codeSnippet: `import random
import time

nodes = [{"id": 1, "status": "follower", "term": 0},
         {"id": 2, "status": "follower", "term": 0},
         {"id": 3, "status": "follower", "term": 0}]

print("Initializing 3-node cluster...")

# Simulate election timeout
timeout_node = random.choice(nodes)
print(f"Node {timeout_node['id']} election timeout reached!")

timeout_node['status'] = "candidate"
timeout_node['term'] += 1
print(f"Node {timeout_node['id']} became candidate for term {timeout_node['term']}.")

# Voting phase
votes = 1 # votes for self
for n in nodes:
    if n['id'] != timeout_node['id']:
        print(f"Node {n['id']} votes for Node {timeout_node['id']}.")
        votes += 1

if votes > len(nodes) / 2:
    timeout_node['status'] = "leader"
    print(f"\\n--- Node {timeout_node['id']} is elected LEADER! ---")
`,
    terminalOutput: "root@phd-lab:~# Waiting for execution...",
    visualization: `sequenceDiagram
    participant Follower 1
    participant Candidate (Node 2)
    participant Follower 3
    Candidate (Node 2)->>Candidate (Node 2): Election Timeout
    Candidate (Node 2)->>Follower 1: RequestVote
    Candidate (Node 2)->>Follower 3: RequestVote
    Follower 1-->>Candidate (Node 2): Vote Granted
    Follower 3-->>Candidate (Node 2): Vote Granted
    Note over Candidate (Node 2): Becomes Leader`
  },
  {
    topic: "Genetic Algorithm: Function Optimization",
    description: "Implement a Genetic Algorithm to find the global maximum of a complex mathematical function. Topics include crossover, mutation rates, and elitism.",
    codeSnippet: `import random

def fitness_function(x):
    # Optimize a simple quadratic function: f(x) = -x^2 + 10x
    return -x**2 + 10*x

population = [random.uniform(-10, 20) for _ in range(10)]
print(f"Initial generation best fitness: {max(fitness_function(x) for x in population):.2f}")

for generation in range(1, 11):
    # Selection
    population.sort(key=fitness_function, reverse=True)
    parents = population[:4] # Top 4
    
    # Crossover & Mutation
    next_gen = parents[:] # Elitism
    while len(next_gen) < 10:
        parent1, parent2 = random.sample(parents, 2)
        child = (parent1 + parent2) / 2 + random.uniform(-0.5, 0.5)
        next_gen.append(child)
        
    population = next_gen
    best_x = population[0]
    print(f"Gen {generation} | Best X: {best_x:.2f} | Fitness: {fitness_function(best_x):.2f}")
`,
    terminalOutput: "root@phd-lab:~# Waiting for execution...",
    visualization: `graph TD
    P[Initial Population] --> E[Evaluate Fitness]
    E --> S{Selection}
    S --> C[Crossover]
    C --> M[Mutation]
    M --> E2[New Generation]
    E2 --> E
    style S fill:#ff9,stroke:#333`
  },
  {
    topic: "Simulated Annealing on Graphs",
    description: "Apply Simulated Annealing to approximate the Traveling Salesperson Problem on a small graph. Understand cooling schedules and thermal equilibrium.",
    codeSnippet: `import math
import random

cities = [(0,0), (1,5), (5,2), (6,6), (8,1)]
def total_distance(route):
    dist = 0
    for i in range(len(route)):
        x1, y1 = cities[route[i]]
        x2, y2 = cities[route[(i+1)%len(route)]]
        dist += math.sqrt((x1-x2)**2 + (y1-y2)**2)
    return dist

current_route = list(range(len(cities)))
random.shuffle(current_route)
current_dist = total_distance(current_route)

temp = 100.0
cooling_rate = 0.95

print(f"Initial Route Distance: {current_dist:.2f}")

for step in range(50):
    i, j = random.sample(range(len(cities)), 2)
    new_route = current_route[:]
    new_route[i], new_route[j] = new_route[j], new_route[i]
    
    new_dist = total_distance(new_route)
    
    # Acceptance probability
    if new_dist < current_dist or random.random() < math.exp((current_dist - new_dist) / temp):
        current_route = new_route
        current_dist = new_dist
        
    temp *= cooling_rate

print(f"Optimized Route Distance after 50 steps: {current_dist:.2f}")
`,
    terminalOutput: "root@phd-lab:~# Waiting for execution...",
    visualization: `graph TD
    A[Current State] --> B{Generate Neighbor}
    B --> C[Calculate Delta E]
    C --> D{Delta E < 0?}
    D -- Yes --> E[Accept State]
    D -- No --> F{random() < exp(-dE/T)?}
    F -- Yes --> E
    F -- No --> A
    E --> G[Decrease Temp]
    G --> A`
  }
];

module.exports = async function generateLabs(strapi) {
  console.log("Wiping existing labs to prepare for massive seeding...");
  
  // Safely delete all existing labs using Document Service
  const existingLabs = await strapi.documents('api::lab.lab').findMany({ limit: 1000 });
  for (const lab of existingLabs) {
    try {
      await strapi.documents('api::lab.lab').delete({ documentId: lab.documentId });
    } catch (e) {
      // ignore
    }
  }

  console.log("Seeding 150 highly advanced PhD coding labs...");
  
  let inserted = 0;
  for (let i = 1; i <= 150; i++) {
    const template = advancedTemplates[i % advancedTemplates.length];
    
    const labData = {
      name: `lab-${i}`,
      uuid: `vbox-cluster-${i}`,
      environment: 'vbox',
      title: `${template.topic} - Part ${Math.floor(i / advancedTemplates.length) + 1}`,
      description: `[Lab Node #${i}] ${template.description} Highly classified environment access granted.`,
      codeSnippet: template.codeSnippet,
      terminalOutput: template.terminalOutput,
      visualization: template.visualization
    };

    try {
      await strapi.documents('api::lab.lab').create({
        data: labData,
        status: 'published'
      });
      inserted++;
      if (inserted % 25 === 0) {
        console.log(`Successfully seeded ${inserted} / 150 labs...`);
      }
    } catch (error) {
      console.error(`Failed to seed lab ${i}: `, error);
    }
  }
  
  console.log(`Seeding complete. Inserted ${inserted} advanced labs.`);
};
