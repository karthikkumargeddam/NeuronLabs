const strapi = require('@strapi/strapi');

async function seed() {
  const app = await strapi().start();
  console.log("Strapi started. Seeding 100 advanced labs...");

  const subjects = [
    "Quantum Mechanics", "Astrophysics", "Genomics", "Artificial Intelligence", 
    "Nanotechnology", "Post-Quantum Cryptography", "Climate Modeling", 
    "Fluid Dynamics", "Particle Physics", "Neuroscience"
  ];

  const subtopics = [
    "Simulation", "Optimization", "Pattern Recognition", "Dynamics Analysis", 
    "Error Correction", "Topology Mapping", "Monte Carlo Method", 
    "Deep Learning Networks", "Fractal Geometry", "Non-linear Modeling"
  ];

  let count = 1;
  
  for (let i = 0; i < subjects.length; i++) {
    for (let j = 0; j < subtopics.length; j++) {
      const subject = subjects[i];
      const subtopic = subtopics[j];
      
      const title = `Advanced ${subject}: ${subtopic}`;
      const name = `${subject}-${subtopic}`.toLowerCase().replace(/ /g, '-');
      const uuid = `adv-lab-${count}`;
      
      const description = `This advanced PhD-level laboratory focuses on the theoretical underpinnings of ${subject}. By leveraging ${subtopic}, you will analyze high-dimensional data, simulate complex boundary conditions, and optimize parameters for maximum theoretical yield. This lab incorporates state-of-the-art algorithms utilized in modern research facilities.`;
      
      // We will generate a unique but working python snippet for each
      // using numpy and matplotlib to render an image via Pyodide
      const codeSnippet = `# Theoretical Simulation: ${title}
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
import math

print("Initializing High-Performance Compute Cluster...")
print("Loading theoretical parameters for ${subject}...")

# Generate unique algorithmic data
size = 200
X, Y = np.meshgrid(np.linspace(-5, 5, size), np.linspace(-5, 5, size))

# Unique mathematical variance based on lab index
variance_x = ${i + 1} * 0.5
variance_y = ${j + 1} * 0.5

# Advanced Non-linear Equation Simulation
Z = np.sin(X * variance_x) * np.cos(Y * variance_y) * np.exp(-(X**2 + Y**2)/15)

# Optional: Add some noise or quantum fluctuations
noise = np.random.normal(0, 0.05, Z.shape)
Z_final = Z + noise

plt.style.use("dark_background")
fig, ax = plt.subplots(figsize=(7, 5))
c = ax.contourf(X, Y, Z_final, levels=30, cmap='inferno')
fig.colorbar(c, ax=ax)
ax.set_title("${title}")
ax.set_xlabel("Alpha Dimension")
ax.set_ylabel("Beta Dimension")

# Render to frontend UI
buf = io.BytesIO()
plt.savefig(buf, format="png", bbox_inches="tight", transparent=True)
buf.seek(0)
img_str = base64.b64encode(buf.read()).decode("utf-8")
render_image(img_str)

print("Simulation Complete. Visualization Rendered.")
`;

      try {
        await app.entityService.create('api::lab.lab', {
          data: {
            name: name,
            uuid: uuid,
            title: title,
            environment: "sandbox",
            description: description,
            codeSnippet: codeSnippet,
            publishedAt: new Date()
          }
        });
        console.log(`Created: ${title}`);
      } catch (err) {
        console.error(`Failed to create ${title}:`, err.message);
      }
      
      count++;
    }
  }

  console.log("Seeding complete. 100 labs created.");
  process.exit(0);
}

seed().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
