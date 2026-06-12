module.exports = [
  {
    title: 'Data Analyst Bootcamp',
    uuid: 'data-analyst-bootcamp',
    level: 'B.Tech',
    description: 'Master SQL, Python, Excel, and Tableau. Learn to extract actionable insights from raw data and build compelling interactive dashboards.',
    modules: [
      {
        title: 'SQL Fundamentals',
        explanation: `
## Introduction to SQL
Structured Query Language (SQL) is a standardized programming language that is used to manage relational databases and perform various operations on the data in them. Created in the 1970s, SQL is highly popular not only among database administrators but also among developers writing data integration scripts and data analysts looking to set up and run analytical queries.

If you are completely new to programming, SQL is a great place to start. For further reading on Python integration, please refer to our [Python for Data Analysis](/courses/data-analyst-bootcamp/1) module.

## Core Concepts
### 1. DDL (Data Definition Language)
DDL changes the structure of the table like creating a table, deleting a table, altering a table, etc. All the commands of DDL are auto-committed, which means it permanently saves all the changes in the database.
* **CREATE**: It is used to create a new table in the database.
* **ALTER**: It is used to alter the structure of the database. This change could be either modifying the characteristics of an existing attribute or adding a new attribute.
* **DROP**: It is used to delete both the structure and record stored in the table.

### 2. DML (Data Manipulation Language)
DML commands are used to modify the database. It is responsible for all form of changes in the database.
* **INSERT**: It is used to insert data into the row of a table.
* **UPDATE**: It is used to update or modify the value of a column in the table.
* **DELETE**: It is used to remove one or more rows from a table.

### Example: Creating and Inserting Data
Let us look at a comprehensive example. Suppose we want to create a database for managing students.

\`\`\`sql
-- Creating the Table
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    EnrollmentDate DATE
);

-- Inserting Records
INSERT INTO Students (StudentID, FirstName, LastName, EnrollmentDate)
VALUES 
(1, 'John', 'Doe', '2023-08-01'),
(2, 'Jane', 'Smith', '2023-08-02'),
(3, 'Alice', 'Johnson', '2023-08-03');
\`\`\`

### Aggregation and Grouping
One of the most powerful features of SQL is its ability to aggregate data using functions like \`SUM()\`, \`COUNT()\`, \`AVG()\`, \`MAX()\`, and \`MIN()\`.

\`\`\`sql
-- Finding the total number of enrolled students per year
SELECT EXTRACT(YEAR FROM EnrollmentDate) AS Year, COUNT(StudentID) AS TotalStudents
FROM Students
GROUP BY EXTRACT(YEAR FROM EnrollmentDate)
ORDER BY Year DESC;
\`\`\`

## Complexity Analysis of SQL Queries
When writing SQL queries, understanding execution plans is critical. A Full Table Scan (O(N)) evaluates every row, whereas an Index Seek (O(log N)) uses B-Tree structures to jump directly to the relevant records. As a data analyst, you must always ensure your \`WHERE\` clauses target indexed columns when dealing with millions of rows.

> **Tip:** Always use \`EXPLAIN\` or \`EXPLAIN ANALYZE\` before running complex \`JOIN\` operations on production databases.
        `
      },
      {
        title: 'Python for Data Analysis',
        explanation: `
## Introduction to Data Analysis with Python
Python has emerged as the premier language for data analysis, largely due to its incredible ecosystem of data-centric libraries such as Pandas, NumPy, and Matplotlib. 

To see how this connects to visualization, check out our [Tableau Visualization Module](/courses/data-analyst-bootcamp/2).

## Working with Pandas
Pandas provides high-performance, easy-to-use data structures. The two primary data structures are \`Series\` (1-dimensional) and \`DataFrame\` (2-dimensional).

### Loading Data
The most common operation is loading a CSV file into a DataFrame.

\`\`\`python
import pandas as pd
import numpy as np

# Load data into a DataFrame
df = pd.read_csv('sales_data.csv')

# Display the first 5 rows
print(df.head())
\`\`\`

### Data Cleaning and Preprocessing
Real-world data is messy. You will frequently encounter missing values (NaN) or incorrect data types.

\`\`\`python
# Check for missing values
print(df.isnull().sum())

# Drop rows with missing values
df_cleaned = df.dropna()

# Alternatively, fill missing values with the mean (for numerical columns)
df['revenue'].fillna(df['revenue'].mean(), inplace=True)
\`\`\`

## Advanced Grouping (Split-Apply-Combine)
The \`groupby\` method in Pandas is incredibly powerful, allowing you to slice your data, apply a statistical function, and combine the results.

\`\`\`python
# Group by region and calculate total revenue and average margin
summary = df.groupby('Region').agg({
    'Revenue': 'sum',
    'Margin': 'mean',
    'Order_Count': 'count'
}).reset_index()

# Sort the summary by Revenue in descending order
summary = summary.sort_values(by='Revenue', ascending=False)
print(summary)
\`\`\`

## Time Complexity in Pandas
Unlike native Python lists, Pandas uses optimized C arrays (via NumPy) under the hood. Iterating over a DataFrame using \`iterrows()\` is highly discouraged (O(N) with massive overhead). Instead, you should always use **vectorized operations** which execute at near C-speed.
        `
      },
      {
        title: 'Data Visualization with Tableau',
        explanation: `
## The Art of Data Visualization
Data Visualization is the graphical representation of information and data. By using visual elements like charts, graphs, and maps, data visualization tools provide an accessible way to see and understand trends, outliers, and patterns in data.

## Why Tableau?
Tableau is an industry-leading Business Intelligence (BI) tool. It allows analysts to build highly interactive and performant dashboards via a drag-and-drop interface, connecting seamlessly to massive data warehouses.

### Key Tableau Concepts
1. **Dimensions vs. Measures**: Dimensions are qualitative data (like Names, Dates, or Geographical Data). Measures are quantitative numerical data (like Sales, Profit, or Temperature).
2. **Blue vs. Green Pills**: Blue indicates discrete data (distinct, separate categories). Green indicates continuous data (an unbroken range).
3. **Calculated Fields**: You can write custom formulas in Tableau similar to SQL or Excel.

\`\`\`text
// Example of a Tableau Calculated Field for Profit Ratio
SUM([Profit]) / SUM([Sales])
\`\`\`

### Building Your First Dashboard
A great dashboard follows the "10-second rule"—a stakeholder should understand the main takeaway within 10 seconds.
- **Top Left**: Place your most critical KPIs here, as western readers read left-to-right, top-to-bottom.
- **Center**: Use a time-series line chart or a map to show macro trends.
- **Bottom/Right**: Provide granular bar charts or cross-tabs for deeper drill-downs.

Remember to link this knowledge back to your [SQL Fundamentals](/courses/data-analyst-bootcamp/0) so you can write Custom SQL queries directly inside Tableau's data source tab!
        `
      }
    ]
  },
  {
    title: 'Data Engineering Mastery',
    uuid: 'data-engineering-mastery',
    level: 'M.Tech',
    description: 'Build robust scalable data pipelines. Learn Hadoop, Spark, Kafka, Airflow, and Cloud Data Warehousing on AWS, Azure, & GCP.',
    modules: [
      {
        title: 'Distributed Systems & Hadoop',
        explanation: `
## Introduction to Distributed Systems
A distributed system is a computing environment in which various components are spread across multiple computers (or nodes) on a network. These devices split up the work, coordinating their efforts to complete the job more efficiently than if a single device had been responsible for the task.

For how we orchestrate these jobs, see [Data Pipelines with Airflow](/courses/data-engineering-mastery/1).

## The Hadoop Ecosystem
Apache Hadoop is an open-source framework that allows for the distributed processing of large data sets across clusters of computers using simple programming models.

### HDFS (Hadoop Distributed File System)
HDFS is designed to store very large files across machines in a large cluster. It stores data reliably even in the presence of hardware failure.
- **NameNode**: The master node that manages the file system namespace and regulates access to files by clients.
- **DataNode**: The worker nodes that store and retrieve blocks when they are told to (by clients or the NameNode).

### MapReduce Algorithm
MapReduce is a processing technique and a program model for distributed computing.

1. **Map Phase**: Takes a set of data and converts it into another set of data, where individual elements are broken down into tuples (key/value pairs).
2. **Reduce Phase**: Takes the output from a map as an input and combines those data tuples into a smaller set of tuples.

\`\`\`java
// A simple Word Count Mapper in Java
public class TokenizerMapper extends Mapper<Object, Text, Text, IntWritable>{
    private final static IntWritable one = new IntWritable(1);
    private Text word = new Text();

    public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
        StringTokenizer itr = new StringTokenizer(value.toString());
        while (itr.hasMoreTokens()) {
            word.set(itr.nextToken());
            context.write(word, one);
        }
    }
}
\`\`\`

## Fault Tolerance
The defining characteristic of Hadoop is its fault tolerance. By default, HDFS replicates every block of data 3 times across different DataNodes (and ideally, different server racks). If a node goes down, the NameNode simply redirects client read requests to a replica node, ensuring zero downtime.
        `
      },
      {
        title: 'Data Pipelines with Airflow',
        explanation: `
## Orchestrating Data with Apache Airflow
Apache Airflow is an open-source platform created by the community to programmatically author, schedule and monitor workflows.

It is heavily used in conjunction with [Kafka](/courses/data-engineering-mastery/2) for modern event-driven architectures.

## What is a DAG?
In Airflow, a workflow is defined as a Directed Acyclic Graph (DAG). A DAG is a collection of all the tasks you want to run, organized in a way that reflects their relationships and dependencies.
- **Directed**: Dependencies have a specific direction (Task A must run before Task B).
- **Acyclic**: The graph cannot have loops (Task A cannot depend on Task B if Task B depends on Task A).

### Writing Your First DAG
Airflow DAGs are written in standard Python.

\`\`\`python
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator

default_args = {
    'owner': 'data_engineering_team',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Define the DAG
with DAG(
    'daily_etl_pipeline',
    default_args=default_args,
    description='A simple daily ETL DAG',
    schedule_interval=timedelta(days=1),
    start_date=datetime(2023, 1, 1),
    catchup=False,
) as dag:

    # Define tasks
    extract_task = BashOperator(
        task_id='extract_data',
        bash_command='python /scripts/extract.py',
    )

    transform_task = BashOperator(
        task_id='transform_data',
        bash_command='python /scripts/transform.py',
    )

    load_task = BashOperator(
        task_id='load_data',
        bash_command='python /scripts/load.py',
    )

    # Define dependencies (Bitshift operators)
    extract_task >> transform_task >> load_task
\`\`\`

## Advanced Concepts: XComs
XComs (short for "cross-communication") are a mechanism that let tasks talk to each other. By default, tasks are completely isolated and may run on entirely different machines. XComs allow a task to push a small amount of metadata (like a processed file path) to the Airflow metadata database, which downstream tasks can then pull.
        `
      }
    ]
  },
  {
    title: 'Machine Learning Engineer Track',
    uuid: 'machine-learning-engineer-track',
    level: 'M.Tech',
    description: 'Deploy machine learning models at scale. Master MLOps, Docker, Kubernetes, model serving infrastructure, and monitoring in production.',
    modules: [
      {
        title: 'ML Algorithms & Scikit-Learn',
        explanation: `
## Introduction to Machine Learning
Machine Learning (ML) is a subset of Artificial Intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.

## Scikit-Learn Ecosystem
Scikit-Learn is the gold standard for traditional machine learning in Python. It features various classification, regression, and clustering algorithms including support vector machines, random forests, gradient boosting, k-means and DBSCAN.

### Key Concepts
1. **Estimators**: The core object. It implements a \`fit\` method to learn from data.
2. **Predictors**: Implements a \`predict\` method to infer labels on new data.
3. **Transformers**: Implements a \`transform\` method to filter or modify the data (e.g., StandardScaler).

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Assuming X is features and y is target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Initialize the Estimator
clf = RandomForestClassifier(n_estimators=100, max_depth=5)

# Fit the model
clf.fit(X_train, y_train)

# Predict
predictions = clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, predictions))
\`\`\`

## Overfitting and Underfitting
- **Overfitting** occurs when a model learns the detail and noise in the training data to the extent that it negatively impacts the performance of the model on new data.
- **Underfitting** occurs when a model cannot capture the underlying trend of the data.

> **Tip:** Always use Cross-Validation (\`GridSearchCV\` or \`RandomizedSearchCV\`) to find the optimal hyperparameters that balance bias and variance.
        `
      },
      {
        title: 'Model Deployment & REST APIs',
        explanation: `
## The MLOps Lifecycle
Building a model is only 10% of the work. The remaining 90% is deploying, serving, monitoring, and maintaining that model in production.

## Serving Models with FastAPI
FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.

### Building a Prediction API
First, you must serialize (save) your trained model using a library like \`joblib\` or \`pickle\`.

\`\`\`python
import joblib

# Save the model
joblib.dump(clf, 'model.joblib')
\`\`\`

Then, load the model inside a FastAPI application to serve predictions over HTTP.

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Load the model globally so it's loaded only once on startup
model = joblib.load('model.joblib')

class PredictionRequest(BaseModel):
    features: list[float]

@app.post("/predict")
def predict(request: PredictionRequest):
    # Convert input to 2D numpy array
    input_data = np.array(request.features).reshape(1, -1)
    
    # Generate prediction
    prediction = model.predict(input_data)
    
    return {"prediction": int(prediction[0])}
\`\`\`

To test this API, you can send a \`POST\` request with a JSON payload containing the features. This is how the frontend will communicate with your machine learning model!
        `
      }
    ]
  },
  {
    title: 'Advanced Data Science & AI',
    uuid: 'advanced-data-science-and-ai',
    level: 'PhD',
    description: 'Deep dive into neural networks, NLP, Computer Vision, and Generative AI. Design state-of-the-art AI architectures and conduct original research.',
    modules: [
      {
        title: 'Deep Learning & PyTorch',
        explanation: `
## Introduction to Neural Networks
Deep learning is a subset of machine learning based on artificial neural networks with representation learning. The adjective "deep" in deep learning refers to the use of multiple layers in the network.

## Why PyTorch?
PyTorch is an open source machine learning framework that accelerates the path from research prototyping to production deployment. Unlike TensorFlow's static computation graphs (historically), PyTorch uses **Dynamic Computation Graphs** (Define-by-Run), making debugging significantly easier.

### Tensors
The core data structure in PyTorch is the \`Tensor\`. It is similar to a NumPy array but has added superpowers: it can run on GPUs to accelerate computing.

\`\`\`python
import torch
import torch.nn as nn

# Create a random tensor
x = torch.rand(5, 3)
print(x)

# Move tensor to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
x = x.to(device)
\`\`\`

### Building a Neural Network
In PyTorch, you define neural networks by subclassing \`nn.Module\`.

\`\`\`python
class SimpleNN(nn.Module):
    def __init__(self):
        super(SimpleNN, self).__init__()
        # Input layer to hidden layer (e.g., 784 inputs -> 128 hidden)
        self.fc1 = nn.Linear(784, 128)
        # Activation function
        self.relu = nn.ReLU()
        # Hidden layer to output layer (e.g., 10 classes)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        return out

model = SimpleNN().to(device)
print(model)
\`\`\`

## Backpropagation & Optimization
To train this network, PyTorch provides \`Autograd\`, an automatic differentiation engine that calculates gradients for all neural network parameters.

\`\`\`python
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Inside the training loop:
optimizer.zero_grad()   # 1. Clear previous gradients
outputs = model(inputs) # 2. Forward pass
loss = criterion(outputs, labels) # 3. Compute loss
loss.backward()         # 4. Backward pass (calculate gradients)
optimizer.step()        # 5. Update weights
\`\`\`

Deep learning forms the foundation of modern [Natural Language Processing](/courses/advanced-data-science-and-ai/1) and Generative AI.
        `
      },
      {
        title: 'Natural Language Processing',
        explanation: `
## Introduction to NLP
Natural Language Processing (NLP) is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language, in particular how to program computers to process and analyze large amounts of natural language data.

## Text Preprocessing
Before feeding text into a neural network, it must be converted into numbers. This involves several steps:
1. **Tokenization**: Splitting text into words or subwords.
2. **Stop-word Removal**: Removing extremely common words (e.g., "the", "a") that carry little semantic meaning.
3. **Stemming/Lemmatization**: Reducing words to their root form (e.g., "running" -> "run").

### Word Embeddings
Historically, words were represented as one-hot vectors, resulting in massive, sparse matrices. Today, we use dense Word Embeddings (like Word2Vec or GloVe) which map words to a continuous vector space where semantically similar words are placed close to each other.

\`\`\`python
from gensim.models import Word2Vec

# Train a simple Word2Vec model
sentences = [["machine", "learning", "is", "fascinating"], ["natural", "language", "processing"]]
model = Word2Vec(sentences, vector_size=100, window=5, min_count=1, workers=4)

# Get the vector for a word
vector = model.wv['machine']
\`\`\`

## The Transformer Architecture
Introduced in the paper "Attention Is All You Need" (2017), the Transformer architecture completely revolutionized NLP, replacing Recurrent Neural Networks (RNNs) and LSTMs.

### Self-Attention
The core mechanism of the Transformer is Self-Attention. It allows the model to weigh the importance of different words in a sentence relative to a specific word, regardless of their positional distance. This solved the vanishing gradient problem in long sequences and allowed for massive parallelization during training.

Transformers form the backbone of all modern Large Language Models (LLMs) like GPT-4, BERT, and LLaMA!
        `
      }
    ]
  }
];
