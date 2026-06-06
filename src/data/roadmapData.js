// ─────────────────────────────────────────────────────────────
//  COMPLETE CLOUD & DEVOPS ROADMAP DATA
// ─────────────────────────────────────────────────────────────

export const ROADMAP_PHASES = [
  {
    id: "phase1",
    title: "Phase 1: Foundations",
    icon: "🏗️",
    color: "#6366f1",
    description: "Build the base knowledge required before diving into cloud & DevOps.",
    estimatedWeeks: 4,
    topics: [
      {
        id: "linux",
        title: "Linux & Shell Scripting",
        keywords: ["linux", "bash", "shell", "unix", "cli", "command line", "scripting"],
        difficulty: "beginner",
        estimatedHours: 20,
        description: "Master Linux fundamentals: file system, permissions, processes, networking commands, and writing Bash scripts.",
        subtopics: [
          "File system navigation (ls, cd, cp, mv, rm, find)",
          "File permissions & ownership (chmod, chown)",
          "Process management (ps, kill, top, htop)",
          "Package managers (apt, yum, dnf)",
          "Bash scripting: variables, loops, conditionals, functions",
          "Cron jobs & task scheduling",
          "Networking commands (curl, wget, netstat, ss, dig)",
          "SSH & key-based authentication",
          "Text processing (grep, awk, sed, cut)",
          "System logs & journalctl"
        ],
        resources: [
          { title: "The Linux Command Line (Free Book)", url: "https://linuxcommand.org/tlcl.php", type: "book" },
          { title: "Linux Journey", url: "https://linuxjourney.com", type: "interactive" },
          { title: "OverTheWire: Bandit (CTF-style Linux learning)", url: "https://overthewire.org/wargames/bandit/", type: "practice" },
          { title: "Ryan's Tutorials - Linux", url: "https://ryanstutorials.net/linuxtutorial/", type: "tutorial" }
        ],
        teachingMethod: {
          visual: "Draw a Linux directory tree map; use color-coded permission tables.",
          handson: "Complete 30 daily terminal challenges using OverTheWire Bandit.",
          reading: "Read 'The Linux Command Line' book chapter by chapter with notes.",
          video: "Follow 'Linux for Beginners' on YouTube (NetworkChuck / TechWorld with Nana)."
        },
        projects: [
          "Write a Bash script to automate system backups",
          "Create a user management script with add/delete/list features",
          "Build a log analyzer script that summarizes error patterns"
        ]
      },
      {
        id: "networking",
        title: "Networking Fundamentals",
        keywords: ["networking", "tcp", "ip", "dns", "http", "https", "network", "protocol", "firewall", "load balancer", "vpn", "subnet"],
        difficulty: "beginner",
        estimatedHours: 15,
        description: "Understand networking concepts critical for cloud infrastructure: OSI model, TCP/IP, DNS, HTTP, firewalls, and load balancing.",
        subtopics: [
          "OSI Model & TCP/IP stack",
          "IP addressing & CIDR notation",
          "Subnetting & VPC concepts",
          "DNS resolution & record types (A, CNAME, MX, TXT)",
          "HTTP/HTTPS & TLS/SSL certificates",
          "Load balancers (Layer 4 vs Layer 7)",
          "Firewalls & Security Groups",
          "VPN & private networking",
          "CDN (Content Delivery Networks)",
          "Network troubleshooting tools"
        ],
        resources: [
          { title: "Computer Networking: A Top-Down Approach", url: "https://gaia.cs.umass.edu/kurose_ross/", type: "book" },
          { title: "Networking Fundamentals - Cisco NetAcad", url: "https://www.netacad.com/", type: "course" },
          { title: "Julia Evans: Networking Zines", url: "https://jvns.ca/", type: "visual" }
        ],
        teachingMethod: {
          visual: "Draw packet flow diagrams for every protocol; use Wireshark to visualize traffic.",
          handson: "Set up a local network with VMs and test DNS, HTTP routing, firewall rules.",
          reading: "Read 'Computer Networking: A Top-Down Approach' chapters 1-4.",
          video: "Watch 'Networking Fundamentals' by PowerCert Animated Videos on YouTube."
        },
        projects: [
          "Set up a local DNS server using BIND or dnsmasq",
          "Configure an Nginx reverse proxy with SSL termination",
          "Simulate a 3-tier network in a VM environment"
        ]
      },
      {
        id: "git",
        title: "Git & Version Control",
        keywords: ["git", "github", "gitlab", "bitbucket", "version control", "branching", "merge", "pull request", "repository"],
        difficulty: "beginner",
        estimatedHours: 10,
        description: "Master Git workflows used in real DevOps teams: branching strategies, merge conflicts, tagging, and GitHub collaboration.",
        subtopics: [
          "Git basics (init, clone, add, commit, push, pull)",
          "Branching & merging strategies (GitFlow, trunk-based)",
          "Resolving merge conflicts",
          "Git rebase & cherry-pick",
          "Tags & releases",
          "GitHub/GitLab workflows (PRs, code reviews)",
          ".gitignore & .gitattributes",
          "Git hooks (pre-commit, pre-push)",
          "Monorepos vs multi-repos",
          "Signing commits with GPG"
        ],
        resources: [
          { title: "Pro Git Book (Free)", url: "https://git-scm.com/book/en/v2", type: "book" },
          { title: "Learn Git Branching (Interactive)", url: "https://learngitbranching.js.org/", type: "interactive" },
          { title: "GitHub Skills", url: "https://skills.github.com/", type: "interactive" }
        ],
        teachingMethod: {
          visual: "Use 'Learn Git Branching' animated visualizer to understand every git operation.",
          handson: "Create a personal project and practice GitFlow with feature branches and PRs.",
          reading: "Read Pro Git Book chapters 1-5 for deep understanding.",
          video: "Watch 'Git and GitHub for Beginners' by freeCodeCamp on YouTube."
        },
        projects: [
          "Set up a GitFlow workflow on a sample project",
          "Create GitHub Actions for automated linting on PRs",
          "Build a git hook that runs tests before every commit"
        ]
      },
      {
        id: "programming",
        title: "Programming & Scripting",
        keywords: ["python", "golang", "go", "javascript", "node", "programming", "coding", "developer", "software", "scripting", "automation"],
        difficulty: "beginner",
        estimatedHours: 25,
        description: "Learn Python (primary DevOps language) for automation, scripting, and tooling. Go is a bonus for writing high-performance DevOps tools.",
        subtopics: [
          "Python basics: data types, functions, modules, OOP",
          "File I/O and JSON/YAML manipulation",
          "REST API calls with requests library",
          "Python for automation (Fabric, Invoke)",
          "boto3 for AWS automation",
          "Writing CLI tools with argparse / Click",
          "Error handling & logging best practices",
          "Unit testing with pytest",
          "Go basics (optional but recommended)",
          "Environment variables & secrets management in code"
        ],
        resources: [
          { title: "Automate the Boring Stuff with Python (Free)", url: "https://automatetheboringstuff.com/", type: "book" },
          { title: "Python for DevOps (O'Reilly)", url: "https://www.oreilly.com/library/view/python-for-devops/9781492057680/", type: "book" },
          { title: "Real Python Tutorials", url: "https://realpython.com/", type: "tutorial" }
        ],
        teachingMethod: {
          visual: "Build flowcharts of automation scripts before coding them.",
          handson: "Write 1 automation script per day for 30 days (disk cleanup, report generation, API calls).",
          reading: "Read 'Automate the Boring Stuff with Python' fully before moving on.",
          video: "Follow 'Python for DevOps' tutorials by TechWorld with Nana."
        },
        projects: [
          "Build an AWS resource inventory tool using boto3",
          "Create a Python script that parses logs and sends Slack alerts",
          "Write a CLI tool to manage Docker containers"
        ]
      }
    ]
  },
  {
    id: "phase2",
    title: "Phase 2: Containers & Orchestration",
    icon: "🐳",
    color: "#0ea5e9",
    description: "Learn to containerize applications with Docker and orchestrate them with Kubernetes.",
    estimatedWeeks: 5,
    topics: [
      {
        id: "docker",
        title: "Docker & Containerization",
        keywords: ["docker", "container", "dockerfile", "docker-compose", "image", "registry", "containerization", "podman"],
        difficulty: "intermediate",
        estimatedHours: 25,
        description: "Master Docker from basics to advanced: building images, networking, volumes, Docker Compose, and container security.",
        subtopics: [
          "Container vs VM concepts",
          "Docker architecture (daemon, client, registry)",
          "Writing Dockerfiles (multi-stage builds)",
          "Docker images: build, tag, push, pull",
          "Docker networking (bridge, host, overlay)",
          "Docker volumes & persistent storage",
          "Docker Compose for multi-container apps",
          "Docker Hub & private registries (ECR, GCR, ACR)",
          "Container security best practices",
          "Docker layer caching & optimization",
          "Podman as a Docker alternative",
          "Docker Swarm (basics)"
        ],
        resources: [
          { title: "Docker Official Docs", url: "https://docs.docker.com/", type: "docs" },
          { title: "Play with Docker (Browser Lab)", url: "https://labs.play-with-docker.com/", type: "interactive" },
          { title: "Docker Deep Dive (Nigel Poulton)", url: "https://www.nigelpoulton.com/books/", type: "book" }
        ],
        teachingMethod: {
          visual: "Draw container lifecycle diagrams; annotate every Dockerfile line.",
          handson: "Containerize 3 different apps (Node, Python Flask, Java Spring Boot) from scratch.",
          reading: "Read 'Docker Deep Dive' by Nigel Poulton end-to-end.",
          video: "Follow TechWorld with Nana's complete Docker tutorial series."
        },
        projects: [
          "Containerize a full-stack app (React + Node + Postgres) with Docker Compose",
          "Build a multi-stage Dockerfile that reduces image size by 80%",
          "Set up a private Docker registry with authentication"
        ]
      },
      {
        id: "kubernetes",
        title: "Kubernetes (K8s)",
        keywords: ["kubernetes", "k8s", "kubectl", "helm", "pod", "deployment", "service", "ingress", "eks", "gke", "aks", "openshift", "cluster", "orchestration"],
        difficulty: "advanced",
        estimatedHours: 40,
        description: "Deep dive into Kubernetes: from core concepts to production-grade cluster management, Helm charts, RBAC, and multi-cluster strategies.",
        subtopics: [
          "Kubernetes architecture (control plane, nodes, etcd)",
          "Pods, ReplicaSets, Deployments, StatefulSets, DaemonSets",
          "Services (ClusterIP, NodePort, LoadBalancer, ExternalName)",
          "Ingress controllers & TLS",
          "ConfigMaps & Secrets",
          "Persistent Volumes & Storage Classes",
          "Namespaces & RBAC (Role-Based Access Control)",
          "Horizontal Pod Autoscaler (HPA) & Vertical Pod Autoscaler (VPA)",
          "Helm package manager",
          "Network policies",
          "K8s monitoring (metrics-server, Prometheus stack)",
          "Kubernetes operators & CRDs",
          "Multi-cluster management (Argo CD, Fleet)",
          "Managed K8s: EKS, GKE, AKS"
        ],
        resources: [
          { title: "Kubernetes Official Docs", url: "https://kubernetes.io/docs/", type: "docs" },
          { title: "Killer.sh K8s Practice Exams", url: "https://killer.sh/", type: "practice" },
          { title: "Kubernetes Up & Running (O'Reilly)", url: "https://www.oreilly.com/library/view/kubernetes-up-and/9781492046523/", type: "book" },
          { title: "Play with Kubernetes", url: "https://labs.play-with-k8s.com/", type: "interactive" }
        ],
        teachingMethod: {
          visual: "Draw K8s cluster architecture diagrams for every concept; use k9s TUI tool.",
          handson: "Deploy 5 progressively complex apps on minikube/kind, then on a real cloud cluster.",
          reading: "Read 'Kubernetes Up & Running' alongside the official docs.",
          video: "Follow TechWorld with Nana's complete Kubernetes course + CKA prep content."
        },
        projects: [
          "Deploy a microservices app with 5+ services on K8s with Ingress & TLS",
          "Write a Helm chart from scratch for a Node.js app",
          "Set up cluster autoscaling and test under load with k6",
          "Implement RBAC with multiple service accounts and namespace isolation"
        ]
      }
    ]
  },
  {
    id: "phase3",
    title: "Phase 3: CI/CD Pipelines",
    icon: "🔄",
    color: "#10b981",
    description: "Build automated pipelines that test, build, and deploy code continuously.",
    estimatedWeeks: 4,
    topics: [
      {
        id: "cicd",
        title: "CI/CD Fundamentals",
        keywords: ["ci", "cd", "cicd", "pipeline", "jenkins", "github actions", "gitlab ci", "circleci", "travis", "argocd", "argo", "tekton", "spinnaker", "continuous integration", "continuous deployment", "continuous delivery", "build"],
        difficulty: "intermediate",
        estimatedHours: 30,
        description: "Design and implement CI/CD pipelines that automate testing, security scanning, building, and multi-environment deployment.",
        subtopics: [
          "CI/CD concepts & principles (shift-left, fail fast)",
          "GitHub Actions (workflows, actions, secrets, environments)",
          "GitLab CI/CD (pipelines, runners, artifacts)",
          "Jenkins (Jenkinsfile, plugins, shared libraries)",
          "Pipeline stages: lint → test → build → scan → deploy",
          "Artifact management (Nexus, JFrog Artifactory)",
          "Container image scanning (Trivy, Snyk, Grype)",
          "SAST & DAST integration in pipelines",
          "Blue/Green & Canary deployments",
          "Argo CD for GitOps-based deployment",
          "Environment promotion strategies (dev → staging → prod)",
          "Secrets management in CI/CD (Vault, GitHub Secrets)",
          "Pipeline as Code best practices",
          "Rollback strategies"
        ],
        resources: [
          { title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", type: "docs" },
          { title: "Argo CD Docs", url: "https://argo-cd.readthedocs.io/", type: "docs" },
          { title: "Jenkins Handbook", url: "https://www.jenkins.io/doc/book/", type: "docs" },
          { title: "CI/CD with Docker & Kubernetes (Udemy)", url: "https://www.udemy.com/", type: "course" }
        ],
        teachingMethod: {
          visual: "Draw end-to-end pipeline flow diagrams including all stages and failure handling.",
          handson: "Build 3 complete pipelines: one GitHub Actions, one GitLab CI, one with Argo CD.",
          reading: "Study GitHub Actions and Argo CD documentation thoroughly.",
          video: "Follow TechWorld with Nana's complete CI/CD pipeline course."
        },
        projects: [
          "Build a full GitHub Actions pipeline: test → build Docker image → push to ECR → deploy to K8s",
          "Set up GitOps with Argo CD for automatic K8s deployments on git push",
          "Implement blue/green deployment with automatic rollback on health check failure"
        ]
      }
    ]
  },
  {
    id: "phase4",
    title: "Phase 4: Infrastructure as Code",
    icon: "📜",
    color: "#f59e0b",
    description: "Provision and manage infrastructure programmatically using Terraform, Ansible, and more.",
    estimatedWeeks: 4,
    topics: [
      {
        id: "terraform",
        title: "Terraform & IaC",
        keywords: ["terraform", "iac", "infrastructure as code", "pulumi", "cloudformation", "cdk", "aws cdk", "ansible", "chef", "puppet", "salt", "provision", "infra"],
        difficulty: "intermediate",
        estimatedHours: 30,
        description: "Provision cloud infrastructure using Terraform. Understand state management, modules, workspaces, and best practices for multi-cloud IaC.",
        subtopics: [
          "IaC concepts: declarative vs imperative",
          "Terraform HCL syntax (providers, resources, variables, outputs)",
          "Terraform state: local vs remote (S3, Terraform Cloud)",
          "Terraform modules (writing & using)",
          "Workspaces for multi-environment management",
          "Terraform import & drift detection",
          "Terraform Cloud & Terraform Enterprise",
          "Pulumi as an alternative (TypeScript/Python)",
          "AWS CloudFormation & CDK",
          "Terratest for testing Terraform code",
          "Cost estimation with Infracost",
          "Security scanning with tfsec / checkov",
          "Atlantis for PR-based Terraform workflows"
        ],
        resources: [
          { title: "Terraform Official Docs", url: "https://developer.hashicorp.com/terraform/docs", type: "docs" },
          { title: "Terraform: Up & Running (Book)", url: "https://www.terraformupandrunning.com/", type: "book" },
          { title: "KodeKloud Terraform Course", url: "https://kodekloud.com/", type: "course" }
        ],
        teachingMethod: {
          visual: "Draw Terraform graph outputs (terraform graph | dot) to visualize resource dependencies.",
          handson: "Provision a full 3-tier AWS architecture (VPC, EC2, RDS, ALB) with Terraform.",
          reading: "Read 'Terraform: Up & Running' by Yevgeniy Brikman completely.",
          video: "Follow HashiCorp's official Terraform tutorials and TechWorld with Nana's Terraform crash course."
        },
        projects: [
          "Build a reusable Terraform module library for VPC, EKS, RDS",
          "Create a multi-environment setup (dev/staging/prod) with Terraform workspaces",
          "Integrate tfsec + checkov in CI pipeline for IaC security scanning"
        ]
      },
      {
        id: "ansible",
        title: "Ansible & Configuration Management",
        keywords: ["ansible", "configuration management", "puppet", "chef", "saltstack", "playbook", "automation", "idempotent"],
        difficulty: "intermediate",
        estimatedHours: 20,
        description: "Automate server configuration and application deployment with Ansible playbooks, roles, and Ansible Galaxy.",
        subtopics: [
          "Ansible architecture (control node, managed nodes, inventory)",
          "Ad-hoc commands vs playbooks",
          "YAML playbook syntax: tasks, handlers, variables",
          "Ansible roles & Ansible Galaxy",
          "Jinja2 templating in Ansible",
          "Ansible Vault for secrets",
          "Dynamic inventory (AWS, GCP, Azure plugins)",
          "Idempotency & best practices",
          "Ansible Tower / AWX",
          "Testing with Molecule + Testinfra"
        ],
        resources: [
          { title: "Ansible Official Docs", url: "https://docs.ansible.com/", type: "docs" },
          { title: "Jeff Geerling - Ansible for DevOps", url: "https://www.ansiblefordevops.com/", type: "book" },
          { title: "Ansible 101 (YouTube by Jeff Geerling)", url: "https://www.youtube.com/playlist?list=PL2_OBreMn7FqZkvMYt6ATmgC0KAGGJNAN", type: "video" }
        ],
        teachingMethod: {
          visual: "Draw Ansible workflow diagrams from inventory to task execution.",
          handson: "Write Ansible playbooks to configure 10 VMs: install apps, configure nginx, manage users.",
          reading: "Read 'Ansible for DevOps' by Jeff Geerling.",
          video: "Follow Jeff Geerling's Ansible 101 YouTube series."
        },
        projects: [
          "Write an Ansible role for complete LAMP stack setup",
          "Build a dynamic inventory script for AWS EC2 instances",
          "Use Ansible to configure a K8s worker node from scratch"
        ]
      }
    ]
  },
  {
    id: "phase5",
    title: "Phase 5: Cloud Platforms",
    icon: "☁️",
    color: "#8b5cf6",
    description: "Deep dive into major cloud providers: AWS, GCP, and Azure.",
    estimatedWeeks: 8,
    topics: [
      {
        id: "aws",
        title: "Amazon Web Services (AWS)",
        keywords: ["aws", "amazon", "ec2", "s3", "lambda", "rds", "eks", "ecs", "cloudwatch", "iam", "vpc", "route53", "cloudfront", "sqs", "sns", "dynamodb", "aurora", "elasticache", "cloud"],
        difficulty: "intermediate",
        estimatedHours: 50,
        description: "Master AWS services across compute, storage, networking, databases, security, and serverless. AWS is the most in-demand cloud platform.",
        subtopics: [
          "IAM: users, groups, roles, policies, SCP",
          "VPC: subnets, route tables, NAT gateway, VPC peering",
          "EC2: instance types, AMIs, user data, auto scaling groups",
          "S3: buckets, policies, versioning, lifecycle, replication",
          "RDS & Aurora: multi-AZ, read replicas, parameter groups",
          "ECS & EKS: container orchestration on AWS",
          "Lambda & API Gateway (serverless)",
          "CloudFront CDN & Route 53 DNS",
          "CloudWatch: metrics, logs, alarms, dashboards",
          "CloudTrail & Config for auditing",
          "SQS, SNS, EventBridge (messaging)",
          "Secrets Manager & Parameter Store",
          "AWS Well-Architected Framework",
          "Cost optimization (Reserved Instances, Savings Plans, Cost Explorer)",
          "AWS Security Hub, GuardDuty, WAF"
        ],
        resources: [
          { title: "AWS Official Documentation", url: "https://docs.aws.amazon.com/", type: "docs" },
          { title: "AWS Skill Builder (Free)", url: "https://skillbuilder.aws/", type: "course" },
          { title: "Adrian Cantrill AWS Courses", url: "https://learn.cantrill.io/", type: "course" },
          { title: "AWS Free Tier", url: "https://aws.amazon.com/free/", type: "practice" }
        ],
        teachingMethod: {
          visual: "Draw AWS architecture diagrams using AWS Architecture Icons on draw.io.",
          handson: "Build 10 real AWS projects using the free tier; get AWS Solutions Architect Associate cert.",
          reading: "Read AWS whitepapers: Well-Architected Framework, Security Pillar.",
          video: "Follow Adrian Cantrill's AWS SAA course — the best available."
        },
        projects: [
          "Deploy a 3-tier web app on AWS (ALB → EC2 ASG → RDS Multi-AZ)",
          "Build a serverless API with Lambda + API Gateway + DynamoDB + Cognito",
          "Set up a complete AWS landing zone with Organizations, SCPs, and CloudTrail"
        ]
      },
      {
        id: "gcp",
        title: "Google Cloud Platform (GCP)",
        keywords: ["gcp", "google cloud", "gke", "bigquery", "cloud run", "compute engine", "cloud storage", "pub/sub", "cloud functions", "firebase"],
        difficulty: "intermediate",
        estimatedHours: 30,
        description: "Learn GCP's core services with focus on GKE (best managed K8s), BigQuery, Cloud Run, and Anthos for multi-cloud.",
        subtopics: [
          "GCP IAM & Resource Hierarchy (org, folders, projects)",
          "Compute Engine & Managed Instance Groups",
          "GKE: Autopilot vs Standard clusters",
          "Cloud Run for serverless containers",
          "Cloud Storage & Cloud SQL",
          "BigQuery for data analytics",
          "Pub/Sub messaging",
          "Cloud Build & Artifact Registry",
          "VPC & Cloud Interconnect",
          "Cloud Monitoring & Logging",
          "Anthos for multi-cloud / hybrid"
        ],
        resources: [
          { title: "Google Cloud Documentation", url: "https://cloud.google.com/docs", type: "docs" },
          { title: "Google Cloud Skills Boost (Qwiklabs)", url: "https://cloudskillsboost.google/", type: "interactive" },
          { title: "GCP Associate Cloud Engineer Study Guide", url: "https://www.wiley.com/en-us/", type: "book" }
        ],
        teachingMethod: {
          visual: "Use GCP's interactive console labs on Qwiklabs for visual hands-on learning.",
          handson: "Complete 20 Qwiklabs labs and build a GKE + Cloud Run project.",
          reading: "Study GCP documentation for services relevant to your role.",
          video: "Follow Google Cloud's YouTube channel and Coursera GCP courses."
        },
        projects: [
          "Deploy a containerized app on GKE with Cloud SQL backend",
          "Build a data pipeline: Pub/Sub → Dataflow → BigQuery → Looker Studio"
        ]
      },
      {
        id: "azure",
        title: "Microsoft Azure",
        keywords: ["azure", "microsoft azure", "aks", "azure devops", "azure functions", "cosmos db", "blob storage", "active directory", "entra"],
        difficulty: "intermediate",
        estimatedHours: 30,
        description: "Learn Azure services with focus on AKS, Azure DevOps pipelines, Azure AD/Entra ID, and enterprise hybrid cloud scenarios.",
        subtopics: [
          "Azure AD (Entra ID): tenants, users, groups, RBAC",
          "Azure subscriptions & management groups",
          "Virtual Machines & VM Scale Sets",
          "AKS (Azure Kubernetes Service)",
          "Azure DevOps: Repos, Pipelines, Boards, Artifacts",
          "Azure Functions & Logic Apps",
          "Blob Storage, Azure SQL, Cosmos DB",
          "Azure Monitor & Application Insights",
          "Virtual Networks & ExpressRoute",
          "Azure Key Vault",
          "Azure Policy & Blueprints"
        ],
        resources: [
          { title: "Microsoft Learn (Free)", url: "https://learn.microsoft.com/en-us/azure/", type: "docs" },
          { title: "AZ-900 Study Guide", url: "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/", type: "course" },
          { title: "Azure Charts", url: "https://azurecharts.com/", type: "reference" }
        ],
        teachingMethod: {
          visual: "Use Azure Architecture Center diagrams as templates for your own designs.",
          handson: "Complete Microsoft Learn paths and build an AKS + Azure DevOps project.",
          reading: "Study for AZ-104 (Azure Administrator) exam to force structured learning.",
          video: "Follow John Savill's Azure Master Class on YouTube — extremely detailed."
        },
        projects: [
          "Set up Azure DevOps pipelines deploying to AKS with Helm",
          "Configure Azure AD SSO for an application with conditional access policies"
        ]
      }
    ]
  },
  {
    id: "phase6",
    title: "Phase 6: Monitoring & Observability",
    icon: "📊",
    color: "#ef4444",
    description: "Implement full-stack observability: metrics, logs, traces, and alerting.",
    estimatedWeeks: 3,
    topics: [
      {
        id: "monitoring",
        title: "Monitoring, Logging & Tracing",
        keywords: ["monitoring", "observability", "prometheus", "grafana", "elk", "elasticsearch", "kibana", "logstash", "datadog", "splunk", "jaeger", "opentelemetry", "alerting", "sre", "slo", "sla", "metrics", "logging", "tracing", "loki", "fluentd"],
        difficulty: "intermediate",
        estimatedHours: 25,
        description: "Implement the three pillars of observability: metrics (Prometheus/Grafana), logs (ELK/Loki), and traces (Jaeger/OpenTelemetry).",
        subtopics: [
          "Observability vs Monitoring concepts",
          "Prometheus: metrics scraping, PromQL, exporters",
          "Grafana: dashboards, alerting, data sources",
          "Prometheus Alertmanager: routes, receivers, silence",
          "ELK Stack (Elasticsearch, Logstash, Kibana)",
          "Loki & Promtail for log aggregation",
          "Fluentd / Fluent Bit for log forwarding",
          "Distributed tracing with Jaeger",
          "OpenTelemetry instrumentation",
          "SLIs, SLOs, SLAs, Error Budgets",
          "Uptime monitoring (Blackbox exporter, UptimeRobot)",
          "APM tools (Datadog, New Relic, Dynatrace)",
          "On-call rotation & incident management (PagerDuty, OpsGenie)",
          "Chaos engineering basics (Chaos Monkey, Litmus)"
        ],
        resources: [
          { title: "Prometheus Official Docs", url: "https://prometheus.io/docs/", type: "docs" },
          { title: "Grafana Official Docs", url: "https://grafana.com/docs/", type: "docs" },
          { title: "Google SRE Book (Free)", url: "https://sre.google/sre-book/table-of-contents/", type: "book" }
        ],
        teachingMethod: {
          visual: "Build Grafana dashboards for every metric; visualize RED (Rate, Errors, Duration) method.",
          handson: "Set up a complete observability stack on K8s: Prometheus + Grafana + Loki + Jaeger.",
          reading: "Read Google's SRE Book chapters on monitoring and alerting.",
          video: "Follow TechWorld with Nana's Prometheus and Grafana tutorials."
        },
        projects: [
          "Deploy the kube-prometheus-stack on K8s and create custom dashboards",
          "Set up centralized logging with Loki and create log-based alerts",
          "Instrument a Python app with OpenTelemetry and visualize traces in Jaeger"
        ]
      }
    ]
  },
  {
    id: "phase7",
    title: "Phase 7: Security & Compliance (DevSecOps)",
    icon: "🔐",
    color: "#ec4899",
    description: "Embed security into every stage of the DevOps lifecycle.",
    estimatedWeeks: 3,
    topics: [
      {
        id: "devsecops",
        title: "DevSecOps & Cloud Security",
        keywords: ["security", "devsecops", "sonarqube", "trivy", "snyk", "vault", "secrets", "sast", "dast", "owasp", "iam", "zero trust", "compliance", "cis", "nist", "soc2", "gdpr", "pen testing", "penetration", "vulnerability", "waf", "siem"],
        difficulty: "advanced",
        estimatedHours: 25,
        description: "Integrate security throughout the pipeline: code scanning, container security, secrets management, network policies, and compliance automation.",
        subtopics: [
          "Shift-left security mindset",
          "SAST (SonarQube, CodeQL, Semgrep)",
          "DAST (OWASP ZAP, Burp Suite)",
          "Container image scanning (Trivy, Grype, Snyk)",
          "HashiCorp Vault for secrets management",
          "Kubernetes network policies & Pod Security Standards",
          "OPA/Gatekeeper for policy enforcement",
          "IAM least privilege & permission boundaries",
          "Zero Trust networking",
          "Cloud security posture management (CSPM): AWS Security Hub, Prisma Cloud",
          "Compliance as Code (InSpec, Chef Compliance)",
          "CIS Benchmarks & NIST frameworks",
          "Supply chain security (SLSA, Sigstore, cosign)",
          "Falco for runtime threat detection",
          "Incident response playbooks"
        ],
        resources: [
          { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", type: "reference" },
          { title: "HashiCorp Vault Docs", url: "https://developer.hashicorp.com/vault/docs", type: "docs" },
          { title: "Cloud Security Alliance", url: "https://cloudsecurityalliance.org/", type: "reference" }
        ],
        teachingMethod: {
          visual: "Map out a threat model for your architecture using STRIDE methodology.",
          handson: "Integrate Trivy, Semgrep, and OPA into a complete CI/CD pipeline.",
          reading: "Read OWASP Top 10 and AWS Security Best Practices whitepapers.",
          video: "Follow DevSecOps courses on KodeKloud and DevSecOps Guru on YouTube."
        },
        projects: [
          "Build a DevSecOps pipeline with SAST + DAST + container scanning + policy gates",
          "Set up HashiCorp Vault with K8s integration for dynamic secrets",
          "Implement OPA/Gatekeeper policies to enforce security in a K8s cluster"
        ]
      }
    ]
  },
  {
    id: "phase8",
    title: "Phase 8: Advanced Topics & SRE",
    icon: "🚀",
    color: "#14b8a6",
    description: "Elevate to senior-level skills: SRE practices, platform engineering, and multi-cloud strategies.",
    estimatedWeeks: 4,
    topics: [
      {
        id: "sre",
        title: "Site Reliability Engineering (SRE)",
        keywords: ["sre", "site reliability", "chaos engineering", "toil", "error budget", "platform engineering", "internal developer platform", "backstage", "service mesh", "istio", "linkerd", "ebpf"],
        difficulty: "advanced",
        estimatedHours: 30,
        description: "Apply SRE principles: eliminate toil, define SLOs, practice chaos engineering, and build internal developer platforms.",
        subtopics: [
          "SRE vs DevOps: philosophy and practices",
          "Toil measurement and elimination",
          "Error budgets and SLO-based decision making",
          "Post-mortems (blameless culture)",
          "Capacity planning",
          "Service meshes (Istio, Linkerd): traffic management, mTLS, observability",
          "eBPF for advanced networking and observability",
          "Platform engineering & Internal Developer Platforms (Backstage)",
          "GitOps at scale (Flux CD, Argo CD ApplicationSets)",
          "Multi-cluster and multi-cloud strategies",
          "Chaos engineering (Chaos Mesh, Litmus, Chaos Monkey)",
          "Cost engineering (FinOps)"
        ],
        resources: [
          { title: "Google SRE Book (Free)", url: "https://sre.google/sre-book/table-of-contents/", type: "book" },
          { title: "Google SRE Workbook (Free)", url: "https://sre.google/workbook/table-of-contents/", type: "book" },
          { title: "Istio Documentation", url: "https://istio.io/latest/docs/", type: "docs" }
        ],
        teachingMethod: {
          visual: "Design SLO dashboards and error budget burn rate charts in Grafana.",
          handson: "Set up Istio service mesh and run chaos experiments on a staging cluster.",
          reading: "Read the complete Google SRE Book and SRE Workbook.",
          video: "Follow 'Implementing SRE' courses and conference talks from SREcon."
        },
        projects: [
          "Define SLOs for a microservices app and build an error budget dashboard",
          "Set up Istio with mTLS and canary traffic splitting",
          "Build an Internal Developer Platform using Backstage with custom plugins"
        ]
      },
      {
        id: "certifications",
        title: "Certifications Roadmap",
        keywords: ["certification", "cka", "ckad", "cks", "aws certified", "gcp certified", "azure certified", "terraform associate", "hashicorp", "devops certification", "exam"],
        difficulty: "intermediate",
        estimatedHours: 60,
        description: "Earn industry-recognized certifications that validate your cloud and DevOps skills.",
        subtopics: [
          "CKA (Certified Kubernetes Administrator)",
          "CKAD (Certified Kubernetes Application Developer)",
          "CKS (Certified Kubernetes Security Specialist)",
          "AWS Solutions Architect Associate (SAA-C03)",
          "AWS DevOps Engineer Professional (DOP-C02)",
          "AWS SysOps Administrator",
          "GCP Professional Cloud DevOps Engineer",
          "GCP Professional Cloud Architect",
          "Azure Administrator (AZ-104)",
          "Azure DevOps Engineer Expert (AZ-400)",
          "HashiCorp Terraform Associate",
          "HashiCorp Vault Associate",
          "Linux Foundation LFCS",
          "Docker Certified Associate (DCA)"
        ],
        resources: [
          { title: "Killer.sh (K8s Exam Simulator)", url: "https://killer.sh/", type: "practice" },
          { title: "KodeKloud (Best DevOps courses)", url: "https://kodekloud.com/", type: "course" },
          { title: "Adrian Cantrill (AWS)", url: "https://learn.cantrill.io/", type: "course" },
          { title: "A Cloud Guru / Pluralsight", url: "https://acloudguru.com/", type: "course" }
        ],
        teachingMethod: {
          visual: "Create a certification roadmap timeline on a visual board.",
          handson: "Use killer.sh and KodeKloud labs to practice exam scenarios hands-on.",
          reading: "Study exam guides and whitepapers for each certification.",
          video: "Follow structured certification courses on KodeKloud or Adrian Cantrill's site."
        },
        projects: [
          "Pass CKA — the gold standard for Kubernetes",
          "Pass AWS SAA — most recognized cloud cert",
          "Pass HashiCorp Terraform Associate — validates IaC skills"
        ]
      }
    ]
  }
];

// ─── Skill keyword map for resume parsing ───────────────────
export const ALL_KEYWORDS = ROADMAP_PHASES.flatMap(phase =>
  phase.topics.flatMap(topic =>
    topic.keywords.map(kw => ({ keyword: kw, topicId: topic.id, phaseId: phase.id }))
  )
);

// ─── Experience level detection keywords ────────────────────
export const EXPERIENCE_KEYWORDS = {
  junior: ["intern", "internship", "trainee", "fresher", "entry level", "junior", "associate", "graduate", "0-1 year", "1 year"],
  mid: ["mid level", "2 years", "3 years", "4 years", "senior associate", "engineer ii", "engineer 2"],
  senior: ["senior", "lead", "staff", "principal", "architect", "manager", "5 years", "6 years", "7 years", "8 years", "10 years"]
};

// ─── Learning style keywords ─────────────────────────────────
export const LEARNING_STYLE_KEYWORDS = {
  visual: ["designed", "created diagrams", "ui", "frontend", "figma", "visual"],
  handson: ["built", "developed", "deployed", "implemented", "hands-on", "lab", "project"],
  reading: ["research", "documentation", "authored", "wrote", "academic", "published"],
  video: ["youtube", "udemy", "coursera", "online course", "e-learning", "mooc"]
};
