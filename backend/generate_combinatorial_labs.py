import json
import random

topics = [
    # Machine Learning
    "Perceptron", "Linear Regression", "Logistic Regression", "K-Nearest Neighbors", "Naive Bayes", "Decision Tree", "Random Forest", "Gradient Boosting", "AdaBoost", "XGBoost", "K-Means Clustering", "DBSCAN", "Hierarchical Clustering", "PCA", "t-SNE", "Autoencoder", "Restricted Boltzmann Machine", "Deep Belief Network", "CNN Architecture", "RNN Forward Pass", "LSTM Cell", "GRU Cell", "Transformer Attention", "BERT Embeddings", "GPT Architecture", "Q-Learning", "Deep Q-Network", "Policy Gradients", "Actor-Critic", "Generative Adversarial Network",
    # Cryptography
    "Caesar Cipher", "Vigenere Cipher", "Playfair Cipher", "Enigma Machine Simulation", "DES Encryption", "AES-128 Encryption", "AES-256 Encryption", "RSA Algorithm", "Diffie-Hellman Key Exchange", "Elliptic Curve Cryptography", "SHA-1 Hashing", "SHA-256 Hashing", "SHA-512 Hashing", "MD5 Hashing", "HMAC", "Digital Signature Standard", "Zero-Knowledge Proof", "Homomorphic Encryption", "Quantum Key Distribution", "Lattice-Based Cryptography", "Ring Signatures", "Merkle Trees", "Blockchain Proof of Work", "Proof of Stake", "Shamir Secret Sharing", "ElGamal Encryption", "ChaCha20", "Salsa20", "Bcrypt", "Argon2",
    # Distributed
    "Client-Server Architecture", "Peer-to-Peer Network", "Chord DHT", "Kademlia DHT", "Gossip Protocol", "Vector Clocks", "Lamport Timestamps", "Paxos Consensus", "Raft Consensus", "Byzantine Fault Tolerance", "Two-Phase Commit", "Three-Phase Commit", "MapReduce Framework", "Apache Spark RDDs", "Bully Algorithm", "Ring Election", "Consistent Hashing", "CAP Theorem Simulation", "Brewer Conjecture", "Apache Kafka Log", "RabbitMQ Routing", "gRPC Communication", "WebRTC Signaling", "BitTorrent Protocol", "Network Address Translation", "TCP 3-Way Handshake", "UDP Checksum", "BGP Routing", "OSPF Routing", "SDN OpenFlow",
    # Data Structures
    "Linked List", "Doubly Linked List", "Circular Queue", "Priority Queue", "Min Heap", "Max Heap", "Binary Search Tree", "AVL Tree", "Red-Black Tree", "B-Tree", "B+ Tree", "Splay Tree", "Treap", "Trie Prefix Tree", "Suffix Tree", "Suffix Array", "Segment Tree", "Fenwick Tree", "Disjoint Set", "Bloom Filter", "Cuckoo Filter", "Skip List", "Hash Map Chaining", "Hash Map Open Addressing", "Graph Adjacency Matrix", "Graph Adjacency List", "Hypergraph", "Fibonacci Heap", "Patricia Trie", "K-D Tree",
    # Math/Algos
    "Dijkstra Algorithm", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm", "A* Search", "Kruskal MST", "Prim MST", "Topological Sort", "Tarjan SCC", "Kosaraju SCC", "Edmonds-Karp Max Flow", "Ford-Fulkerson Method", "Dinic Algorithm", "Hopcroft-Karp Bipartite", "Knapsack DP", "Longest Common Subsequence", "Matrix Chain Multiplication", "Fast Fourier Transform", "Number Theoretic Transform", "Sieve of Eratosthenes", "Euclidean Algorithm", "Extended Euclidean", "Fermat Little Theorem", "Miller-Rabin Primality", "Pollard rho algorithm", "Monte Carlo Pi Estimation", "Simulated Annealing", "Genetic Algorithm", "Ant Colony Optimization", "Particle Swarm Optimization", "PageRank Algorithm"
]

mermaid_templates = [
    "graph TD\n    A[Start] --> B[Initialize {T}]\n    B --> C{{Condition}}\n    C -->|Yes| D[Process Data]\n    C -->|No| E[Terminate]\n    D --> F[Update State]\n    F --> C",
    "sequenceDiagram\n    participant Client\n    participant {T}_Server\n    Client->>{T}_Server: Request Execution\n    {T}_Server-->>Client: Acknowledge\n    {T}_Server->>{T}_Server: Compute\n    {T}_Server-->>Client: Return Result",
    "classDiagram\n    class {T} {{\n        +data: list\n        +execute()\n        -optimize()\n    }}\n    class Node {{\n        +val: int\n        +next: Node\n    }}\n    {T} --> Node: utilizes",
    "stateDiagram-v2\n    [*] --> Idle\n    Idle --> Running_{T}: trigger()\n    Running_{T} --> Optimizing: gradient_step()\n    Optimizing --> Running_{T}\n    Running_{T} --> [*]: converge()",
    "graph LR\n    In((Input)) --> P1[{T} Layer 1]\n    P1 --> P2[{T} Layer 2]\n    P2 --> Out((Output))\n    style P1 fill:#bbf,stroke:#333\n    style P2 fill:#f96,stroke:#333",
    "pie title {T} Resource Allocation\n    \"Compute\" : 45\n    \"Memory\" : 25\n    \"I/O\" : 20\n    \"Overhead\" : 10",
    "graph TB\n    subgraph {T} Process\n    A[Raw Data] --> B[Transform]\n    B --> C[Analyze]\n    C --> D[Store]\n    end",
    "graph TD\n    A1[{T} Node 1] <--> A2[{T} Node 2]\n    A2 <--> A3[{T} Node 3]\n    A3 <--> A1",
    "sequenceDiagram\n    Actor User\n    participant API\n    participant {T}Core\n    User->>API: POST /run\n    API->>{T}Core: Validate\n    {T}Core->>API: 200 OK\n    API->>User: Success",
    "stateDiagram-v2\n    state {T} {\n      [*] --> Init\n      Init --> Active\n      Active --> [*]\n    }"
]

code_templates = [
    "class {T}:\n    def __init__(self, data):\n        self.data = data\n    def process(self):\n        print(f'Starting {T} processing on {len(self.data)} items.')\n        return [x * 2 for x in self.data]\n\nif __name__ == '__main__':\n    instance = {T}([1, 2, 3, 4, 5])\n    res = instance.process()\n    print('Result:', res)",
    "import random\n\ndef execute_{T_safe}():\n    steps = random.randint(5, 15)\n    print(f'Initializing {T} with {steps} steps.')\n    for i in range(steps):\n        val = math.sin(i) if 'math' in globals() else i * 1.5\n        print(f'Step {i}: {val:.2f}')\n    print('{T} execution completed.')\n\nif __name__ == '__main__':\n    import math\n    execute_{T_safe}()",
    "def {T_safe}_algorithm(input_str):\n    # Core logic for {T}\n    state = bytearray(input_str, 'utf-8')\n    for i in range(len(state)):\n        state[i] ^= 0x5A\n    return state.hex()\n\nprint('{T} Checksum:', {T_safe}_algorithm('Secure Data Initialization'))",
    "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef run_{T_safe}():\n    root = Node('{T} Root')\n    root.left = Node('L')\n    root.right = Node('R')\n    print('Tree built for {T} algorithm.')\n\nrun_{T_safe}()",
    "import time\n\ndef simulate_{T_safe}():\n    print('Connecting to {T} network...')\n    time.sleep(0.1)\n    print('Connection established.')\n    print('Exchanging packets...')\n    for p in range(3):\n        print(f'Packet {p} OK')\n\nsimulate_{T_safe}()",
    "def optimize_{T_safe}(learning_rate=0.01):\n    weight = 1.0\n    for epoch in range(1, 6):\n        gradient = weight * 0.5\n        weight -= learning_rate * gradient\n        print(f'{T} | Epoch {epoch} | Weight: {weight:.4f}')\n\noptimize_{T_safe}()",
    "def {T_safe}_hash(key):\n    h = 0\n    for char in key:\n        h = (h * 31 + ord(char)) % 10**9 + 7\n    return h\n\nprint('{T} Hash for \"admin\":', {T_safe}_hash('admin'))",
    "def {T_safe}_search(arr, target):\n    for i, v in enumerate(arr):\n        if v == target:\n            return i\n    return -1\n\nprint('{T} found at index:', {T_safe}_search([10, 20, 30, 40], 30))",
    "class {T}Manager:\n    def __init__(self):\n        self.registry = {{}}\n    def register(self, name):\n        self.registry[name] = True\n        print(f'Registered {name} in {T} Manager')\n\nmgr = {T}Manager()\nmgr.register('Module_A')",
    "def generate_{T_safe}_matrix(n):\n    return [[i+j for j in range(n)] for i in range(n)]\n\nmat = generate_{T_safe}_matrix(3)\nfor row in mat:\n    print(row)"
]

labs = []
counter = 1

for t in topics:
    safe = t.replace(\" \", \"_\").replace(\"-\", \"_\").replace(\"*\", \"star\")
    
    # Pick a random template and assign it
    mt = random.choice(mermaid_templates).replace(\"{T}\", t)
    ct = random.choice(code_templates).replace(\"{T}\", t).replace(\"{T_safe}\", safe)
    
    # Mutate the code slightly to make it even more unique
    mutator = random.randint(1, 4)
    if mutator == 1:
        ct += f\"\\n# Metric: {random.randint(80, 99)}% efficiency achieved.\"
    elif mutator == 2:
        ct = f\"# Initialization vector for {t}\\n\" + ct
    elif mutator == 3:
        ct = ct.replace(\"print\", f\"# {t} log\\n    print\")
    
    labs.append({
        \"name\": f\"lab-{counter}\",
        \"uuid\": f\"vbox-cluster-{counter}\",
        \"environment\": \"vbox\",
        \"title\": t,
        \"description\": f\"[Lab Node #{counter}] Detailed exploration of {t}. We dive deep into the specific algorithmic architecture and mathematically robust implementation strategies.\",
        \"codeSnippet\": ct,
        \"terminalOutput\": f\"root@phd-lab:~# Preparing {t} environment...\",
        \"visualization\": mt
    })
    counter += 1

with open(\"data/labs_content.json\", \"w\") as f:
    json.dump(labs, f, indent=2)

print(\"labs_content.json generated successfully.\")
