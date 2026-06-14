import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";

import { fetchAPI } from "../../../lib/api";
import Mermaid from "../../../components/Mermaid";
import LabWorkspace from "../../../components/LabWorkspace";

async function getLabData(uuid) {
  try {
    // Try regular labs first
    let response = await fetchAPI('/api/labs', {
      filters: { 
        $or: [
          { uuid: { $eq: uuid } },
          { documentId: { $eq: uuid } }
        ]
      },
      populate: '*'
    }, { next: { revalidate: 60 } });
    
    if (response?.data?.length > 0) {
      const lab = response.data[0];
      return lab.attributes || lab;
    }

    // Try advanced labs (sandboxes)
    response = await fetchAPI('/api/sandboxes', {
      filters: { documentId: { $eq: uuid } },
      populate: '*'
    }, { next: { revalidate: 60 } });

    if (response?.data?.length > 0) {
      const lab = response.data[0];
      const attrs = lab.attributes || lab;
      // Map sandbox fields to expected lab fields
      return {
        title: attrs.title,
        level: 'PhD',
        codeSnippet: attrs.code_content,
        terminalOutput: attrs.terminalOutput,
        visualization: attrs.visualization
      };
    }

  } catch (e) {
    console.error("Failed to fetch lab from Strapi", e);
  }
  
  const fallbackAdvancedLabs = {
    'mit-quantum': { title: 'Quantum Computing Dynamics', level: 'Post-Doctoral', codeSnippet: '# Simulate quantum entanglement using numpy\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport io\nimport base64\n\n# Basis states\nzero = np.array([1, 0])\nstate = np.kron(zero, zero)\n\n# Hadamard gate on qubit 0\nH = 1/np.sqrt(2) * np.array([[1, 1], [1, -1]])\nI = np.eye(2)\nH_0 = np.kron(H, I)\nstate = np.dot(H_0, state)\n\n# CNOT gate\nCNOT = np.array([\n    [1, 0, 0, 0],\n    [0, 1, 0, 0],\n    [0, 0, 0, 1],\n    [0, 0, 1, 0]\n])\nstate = np.dot(CNOT, state)\n\n# Calculate probabilities\nprobs = np.abs(state)**2\nstates = ["|00>", "|01>", "|10>", "|11>"]\n\n# Plotting the Bell State Probabilities\nplt.style.use("dark_background")\nfig, ax = plt.subplots(figsize=(6, 4))\nax.bar(states, probs, color="#a855f7", alpha=0.8)\nax.set_title("Bell State Measurement Probabilities")\nax.set_ylim(0, 1)\nax.set_ylabel("Probability")\n\n# Render plot to browser UI!\nbuf = io.BytesIO()\nplt.savefig(buf, format="png", bbox_inches="tight", transparent=True)\nbuf.seek(0)\nimg_str = base64.b64encode(buf.read()).decode("utf-8")\nrender_image(img_str)\n\nprint("Quantum Simulation Complete. Plot rendered.")' },
    'mit-neuro': { title: 'Neural Network Architectures', level: 'PhD', codeSnippet: '# Train large-scale brain-like network\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport io\nimport base64\n\nclass SpikingNN:\n    def __init__(self, size):\n        self.weights = np.random.randn(size, size)\n        self.membrane_potential = np.zeros(size)\n\n    def forward(self, spikes):\n        self.membrane_potential += np.dot(self.weights, spikes)\n        out_spikes = self.membrane_potential > 1.0\n        self.membrane_potential[out_spikes] = 0.0\n        return out_spikes\n\nprint("Initializing Spiking Neural Network...")\nsnn = SpikingNN(100)\n\nspike_history = []\nfor _ in range(50):\n    input_spikes = np.random.rand(100) > 0.9\n    output = snn.forward(input_spikes)\n    spike_history.append(np.sum(output))\n\nplt.style.use("dark_background")\nplt.figure(figsize=(6, 3))\nplt.plot(spike_history, color="#10b981")\nplt.title("SNN Spike Activity Over Time")\nplt.xlabel("Time Step")\nplt.ylabel("Active Neurons")\n\nbuf = io.BytesIO()\nplt.savefig(buf, format="png", bbox_inches="tight", transparent=True)\nbuf.seek(0)\nrender_image(base64.b64encode(buf.read()).decode("utf-8"))\n\nprint("SNN Simulation Complete.")' },
    'mit-fusion': { title: 'Plasma Fusion Reactors', level: 'Post-Doctoral', codeSnippet: '# Magnetic confinement simulation\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport io\nimport base64\n\n# Simulate plasma temperature and density profiles\nr = np.linspace(0, 1, 100) # normalized minor radius\n# Parabolic profiles typical of L-mode confinement\ntemperature = 5.0 * (1 - r**2)**2 # keV\ndensity = 1.0 * (1 - r**2) # x10^20 m^-3\n\nplt.style.use("dark_background")\nfig, ax1 = plt.subplots(figsize=(6, 4))\n\ncolor = "#ef4444" # Red for temperature\nax1.set_xlabel("Normalized Minor Radius (r/a)")\nax1.set_ylabel("Temperature (keV)", color=color)\nax1.plot(r, temperature, color=color, linewidth=2)\nax1.tick_params(axis="y", labelcolor=color)\n\nax2 = ax1.twinx()  \ncolor = "#3b82f6" # Blue for density\nax2.set_ylabel("Density (10^20 m^-3)", color=color)  \nax2.plot(r, density, color=color, linewidth=2, linestyle="--")\nax2.tick_params(axis="y", labelcolor=color)\n\nplt.title("Tokamak Plasma Radial Profiles")\nfig.tight_layout()\n\nbuf = io.BytesIO()\nplt.savefig(buf, format="png", bbox_inches="tight", transparent=True)\nbuf.seek(0)\nrender_image(base64.b64encode(buf.read()).decode("utf-8"))\n\nprint("Tokamak Magnetic Confinement Simulation Complete.")' },
    'mit-synthetic': { title: 'Synthetic Biology & Genomics', level: 'PhD', codeSnippet: '# CRISPR-Cas9 genome editing\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport io\nimport base64\n\n# Simulate CRISPR-Cas9 cleavage efficiency across a gene\npositions = np.arange(0, 500, 10)\nbase_efficiency = np.random.uniform(20, 50, len(positions))\npeak = 95 * np.exp(-((positions - 250)**2) / (2 * 20**2))\nefficiency = np.clip(base_efficiency + peak, 0, 100)\n\nplt.style.use("dark_background")\nfig, ax = plt.subplots(figsize=(6, 4))\nax.plot(positions, efficiency, color="#10b981", marker="o", linestyle="-", markersize=4)\n\n# Highlight optimal site\noptimal_idx = np.argmax(efficiency)\nax.axvline(x=positions[optimal_idx], color="#f59e0b", linestyle="--", alpha=0.7, label="Optimal sgRNA Target")\n\nax.set_title("CRISPR-Cas9 sgRNA Cleavage Efficiency")\nax.set_xlabel("Gene Position (bp)")\nax.set_ylabel("Predicted Efficiency (%)")\nax.legend()\nax.grid(True, alpha=0.2)\n\nbuf = io.BytesIO()\nplt.savefig(buf, format="png", bbox_inches="tight", transparent=True)\nbuf.seek(0)\nrender_image(base64.b64encode(buf.read()).decode("utf-8"))\n\nprint(f"Analysis Complete. Optimal target found at bp {positions[optimal_idx]} with {efficiency[optimal_idx]:.1f}% predicted efficiency.")' },
    'mit-fluid': { title: 'Computational Fluid Dynamics', level: 'Post-Doctoral', codeSnippet: '# Massive 3D Turbulence Simulation\nimport time\nimport asyncio\n\nprint("Allocating memory on HPC cluster...")\nawait asyncio.sleep(1)\nprint("Solving Navier-Stokes equations for 1M particle grid...")\nawait asyncio.sleep(2)\n\n# Render locally hosted simulation (Zero branding, no CORS!)\nvideo_url = "/fluid_sim.mp4"\nrender_video(video_url)\n\nprint("Turbulence simulation complete. Video stream initialized.")'}
  };

  if (fallbackAdvancedLabs[uuid]) {
    return fallbackAdvancedLabs[uuid];
  }

  if (uuid === "vbox-cluster-1") {
    return { title: "Virtual Box Cluster #1", level: "PhD" };
  }
  return null;
}

export default async function LabEnvironment({ params }) {
  const resolvedParams = await params;
  const lab = await getLabData(resolvedParams.id);

  if (!lab) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role || "Guest";

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Lab Header */}
      <header className="bg-[#111] border-b border-[#333] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[var(--secondary)] animate-pulse shadow-[0_0_10px_var(--secondary)]"></div>
          <h1 className="font-mono text-xl text-gray-200">Virtual Lab: {lab.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-[var(--secondary)] px-2 py-1 bg-[rgba(16,185,129,0.1)] rounded">Authenticated as {userRole}</div>
          <div className="font-mono text-sm text-gray-500 bg-[#222] px-3 py-1 rounded">
            UUID: {resolvedParams.id}
          </div>
        </div>
      </header>

      {/* Main Lab Area */}
      <div className="flex-grow flex p-4 gap-4 overflow-hidden">
        {/* IDE Sidebar */}
        <div className="w-64 glass-panel border-[#333] hidden md:block">
          <div className="p-4 border-b border-[#333] text-xs font-mono text-gray-400">EXPLORER</div>
          <div className="p-2 font-mono text-sm space-y-2">
            <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer px-2 py-1 hover:bg-[#333] rounded">
              <span>📄</span> main.py
            </div>
            <div className="flex items-center gap-2 text-[var(--secondary)] bg-[rgba(16,185,129,0.1)] cursor-pointer px-2 py-1 rounded">
              <span>📄</span> model_arch.py
            </div>
            <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer px-2 py-1 hover:bg-[#333] rounded">
              <span>📁</span> datasets
            </div>
          </div>
        </div>

        {/* Lab Workspace (Editor & Terminal) */}
        <LabWorkspace 
          initialCodeSnippet={lab.codeSnippet} 
          initialTerminalOutput={lab.terminalOutput} 
          visualization={lab.visualization} 
        />
      </div>
    </div>
  );
}
