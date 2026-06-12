const courses = [
  {
    data: {
      title: "Python for Data Science",
      uuid: "python-ds",
      level: "B.Tech",
      description: "The essential prerequisite for any AI journey. Master Python programming, focusing on data manipulation, numerical computing, and powerful visualization libraries.",
      modules: ["Advanced Python Concepts", "NumPy & Numerical Computing", "Pandas & Data Wrangling", "Data Visualization", "Scikit-Learn Basics"]
    }
  },
  {
    data: {
      title: "Machine Learning Mastery",
      uuid: "ml-mastery",
      level: "B.Tech",
      description: "Master the core algorithms that power modern AI. From linear regression to support vector machines and ensemble methods, build intuitive and practical understanding of predictive modeling.",
      modules: ["Supervised vs Unsupervised Learning", "Regression Techniques", "Decision Trees & Random Forests", "Support Vector Machines", "Clustering & PCA"]
    }
  },
  {
    data: {
      title: "Neural Networks & Architectures",
      uuid: "neural-networks",
      level: "M.Tech",
      description: "Unravel the biological inspiration behind artificial intelligence. Dive deep into perceptrons, activation functions, and the mathematics of backpropagation to build your own networks.",
      modules: ["Biological vs Artificial Neurons", "Activation Functions & Loss", "Gradient Descent & Optimizers", "Backpropagation Calculus", "Regularization Strategies"]
    }
  },
  {
    data: {
      title: "Applied Deep Learning",
      uuid: "deep-learning",
      level: "M.Tech",
      description: "Scale up your neural networks. Learn to build and train massive architectures using PyTorch and TensorFlow for solving complex computer vision and sequence modeling tasks.",
      modules: ["Convolutional Neural Networks (CNNs)", "Recurrent Neural Networks (RNNs)", "LSTMs & Time Series", "Transfer Learning", "Model Deployment"]
    }
  },
  {
    data: {
      title: "Generative AI & LLMs",
      uuid: "gen-ai",
      level: "PhD",
      description: "Push the boundaries of artificial creativity. Explore the cutting-edge of Generative AI, focusing on Transformers, Large Language Models (LLMs), Diffusion models, and RAG architectures.",
      modules: ["Transformers & Attention Mechanism", "Large Language Models (LLMs)", "Retrieval-Augmented Generation (RAG)", "Diffusion Models", "Parameter-Efficient Fine-Tuning (PEFT)"]
    }
  }
];

async function seed() {
  for (const course of courses) {
    try {
      const response = await fetch("http://127.0.0.1:1337/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course)
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(`Failed to add ${course.data.title}:`, data.error);
      } else {
        console.log(`Successfully added ${course.data.title}`);
      }
    } catch (e) {
      console.error(`Error adding ${course.data.title}:`, e.message);
    }
  }
}

seed();
