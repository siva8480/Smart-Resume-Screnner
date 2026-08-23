export const SKILL_TAXONOMY = {
  "Frontend Development": [
    "React", "React.js", "Next.js", "Vue.js", "Vue", "Angular", "Svelte", "TypeScript",
    "JavaScript", "HTML5", "CSS3", "Sass", "SCSS", "Tailwind CSS", "Bootstrap",
    "Redux", "Redux Toolkit", "Zustand", "MobX", "Webpack", "Vite", "Turbopack",
    "WebSockets", "PWA", "Responsive Web Design", "UI/UX", "Figma", "Storybook",
    "GraphQL Client", "Apollo Client", "React Query", "TanStack Query", "RxJS",
    "Material UI", "Chakra UI", "Shadcn UI", "WebAudio", "Three.js", "D3.js", "Canvas API"
  ],
  "Backend Development": [
    "Node.js", "Express.js", "NestJS", "Python", "Django", "FastAPI", "Flask",
    "Java", "Spring Boot", "Spring Cloud", "Go", "Golang", "C#", ".NET Core", "ASP.NET",
    "Ruby", "Ruby on Rails", "PHP", "Laravel", "Rust", "C++", "C", "Scala", "Kotlin",
    "RESTful APIs", "REST API", "GraphQL", "gRPC", "Microservices", "Event-Driven Architecture",
    "Serverless", "Kafka", "RabbitMQ", "Celery", "BullMQ", "Nginx", "Apache",
    "Authentication", "OAuth2", "JWT", "SAML", "Session Management", "Webhooks"
  ],
  "Cloud & DevOps": [
    "AWS", "Amazon Web Services", "EC2", "S3", "Lambda", "ECS", "EKS", "CloudFront", "RDS",
    "Google Cloud Platform", "GCP", "BigQuery", "Cloud Run", "Cloud Functions",
    "Microsoft Azure", "Azure DevOps", "Docker", "Kubernetes", "K8s", "Helm",
    "Terraform", "Ansible", "CloudFormation", "Pulumi", "CI/CD", "GitHub Actions",
    "GitLab CI", "Jenkins", "CircleCI", "ArgoCD", "Prometheus", "Grafana", "Datadog",
    "ELK Stack", "Elasticsearch", "Logstash", "Kibana", "Splunk", "OpenTelemetry", "Linux", "Bash", "Shell Scripting"
  ],
  "Databases & Storage": [
    "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Oracle DB", "Microsoft SQL Server", "T-SQL",
    "MongoDB", "Cassandra", "Couchbase", "DynamoDB", "Firebase", "Firestore", "Supabase",
    "Redis", "Memcached", "Neo4j", "Pinecone", "Milvus", "Weaviate", "Qdrant", "ChromaDB",
    "Snowflake", "Amazon Redshift", "Database Optimization", "Indexing", "Query Tuning", "Prisma", "TypeORM", "Sequelize", "SQLAlchemy"
  ],
  "AI, ML & Data Science": [
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "AI", "NLP", "Natural Language Processing",
    "Computer Vision", "LLMs", "Large Language Models", "Generative AI", "GenAI", "RAG", "Retrieval-Augmented Generation",
    "Prompt Engineering", "Fine-Tuning", "Transformers", "LangChain", "LlamaIndex",
    "PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "Hugging Face", "OpenCV",
    "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn", "Jupyter", "Spark", "Apache Spark",
    "Hadoop", "Airflow", "MLflow", "Data Modeling", "Feature Engineering", "A/B Testing", "Statistical Analysis"
  ],
  "Mobile & Cross-Platform": [
    "React Native", "Flutter", "Dart", "Swift", "iOS Development", "SwiftUI", "Objective-C",
    "Android Development", "Kotlin Multiplatform", "Jetpack Compose", "Expo", "Capacitor", "Ionic"
  ],
  "Testing & Quality Assurance": [
    "Unit Testing", "Integration Testing", "End-to-End Testing", "E2E", "Jest", "Vitest",
    "Mocha", "Chai", "Cypress", "Playwright", "Selenium", "Puppeteer", "Postman",
    "JMeter", "Test Automation", "TDD", "BDD", "SonarQube", "Code Coverage"
  ],
  "Architecture & Methodologies": [
    "Agile", "Scrum", "Kanban", "Sprint Planning", "Jira", "Confluence", "Git", "GitHub", "GitLab",
    "System Design", "Object-Oriented Programming", "OOP", "Functional Programming",
    "Domain-Driven Design", "DDD", "Clean Architecture", "Design Patterns", "SOLID Principles",
    "High Availability", "Scalability", "Fault Tolerance", "Load Balancing", "Performance Optimization"
  ],
  "Cybersecurity": [
    "Cybersecurity", "Network Security", "Penetration Testing", "Ethical Hacking", "OWASP",
    "Vulnerability Assessment", "SIEM", "SOC", "Firewalls", "Cryptography", "TLS/SSL",
    "Zero Trust", "IAM", "Identity & Access Management", "Incident Response", "Compliance", "GDPR", "HIPAA", "SOC2"
  ],
  "Soft Skills & Leadership": [
    "Leadership", "Team Leadership", "Mentorship", "Cross-Functional Collaboration",
    "Stakeholder Management", "Project Management", "Product Management", "Strategic Planning",
    "Problem Solving", "Critical Thinking", "Analytical Skills", "Communication Skills",
    "Written Communication", "Verbal Communication", "Presentation Skills", "Client Facing",
    "Adaptability", "Time Management", "Conflict Resolution", "Decision Making", "Ownership"
  ]
};

// Flattened dictionary for quick matching
export const ALL_SKILLS_MAP = (() => {
  const map = new Map();
  for (const [category, skills] of Object.entries(SKILL_TAXONOMY)) {
    for (const skill of skills) {
      map.set(skill.toLowerCase(), { standardName: skill, category });
      const noSpecial = skill.toLowerCase().replace(/[\.\-\_\/]/g, "");
      if (noSpecial !== skill.toLowerCase()) {
        map.set(noSpecial, { standardName: skill, category });
      }
    }
  }
  return map;
})();

export const POWER_ACTION_VERBS = new Set([
  "achieved", "acquired", "administered", "advanced", "advised", "aligned", "allocated",
  "analyzed", "architected", "assembled", "authored", "automated", "boosted", "budgeted",
  "built", "calculated", "centralized", "championed", "coached", "collaborated", "commissioned",
  "compiled", "composed", "conceived", "configured", "consolidated", "constructed", "consulted",
  "coordinated", "crafted", "created", "customized", "debugged", "decreased", "defined",
  "delivered", "deployed", "designed", "developed", "devised", "diagnosed", "directed",
  "discovered", "dispatched", "diversified", "documented", "doubled", "drafted", "drove",
  "eliminated", "enabled", "enacted", "engineered", "enhanced", "established", "evaluated",
  "exceeded", "executed", "expanded", "expedited", "fabricated", "facilitated", "finalized",
  "forecasted", "formulated", "founded", "generated", "guided", "halted", "headed",
  "identified", "implemented", "improved", "improvised", "increased", "initiated", "innovated",
  "inspected", "installed", "instituted", "instructed", "integrated", "intensified", "interpreted",
  "interviewed", "introduced", "invented", "investigated", "launched", "lead", "led",
  "leveraged", "maintained", "managed", "mapped", "marshaled", "maximized", "measured",
  "mediated", "mentored", "migrated", "minimized", "modeled", "modernized", "monitored",
  "motivated", "negotiated", "orchestrated", "organized", "originated", "overhauled", "oversaw",
  "partnered", "performed", "pioneered", "planned", "positioned", "prepared", "presented",
  "produced", "programmed", "promoted", "proposed", "published", "quantified", "rationalized",
  "rearchitected", "rebuilt", "recruited", "redesigned", "reduced", "refactored", "refined",
  "reformed", "regulated", "remodeled", "reorganized", "repaired", "replaced", "resolved",
  "restructured", "revamped", "reviewed", "revitalized", "revolutionized", "routed", "saved",
  "scaled", "scheduled", "screened", "scrutinized", "secured", "simplified", "slashed",
  "solicited", "solved", "spearheaded", "standardized", "steered", "streamlined", "structured",
  "supervised", "surpassed", "synthesized", "systematized", "tabulated", "targeted", "tested",
  "tracked", "trained", "transformed", "transitioned", "translated", "tripled", "troubleshot",
  "unified", "unveiled", "upgraded", "utilized", "validated", "verified", "visualized", "yielded"
]);

export const WEAK_PHRASES = [
  "worked on", "responsible for", "helped with", "assisted with", "participated in",
  "involved in", "duties included", "familiar with", "knowledge of", "handled tasks",
  "contributed to", "part of team that", "supported team", "dealt with", "did"
];
