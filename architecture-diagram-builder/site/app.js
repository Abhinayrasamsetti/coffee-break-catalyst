(() => {
"use strict";

/* ---------- library ---------- */
const CATALOG = [
  // Core architecture
  ["cloud","cloud","Cloud","Core Architecture"],["region","region","Cloud Region","Core Architecture"],["az","region","Availability Zone","Core Architecture"],["zone","zone","Availability Zone","Core Architecture"],
  ["environment","environment","Environment","Core Architecture"],["datacenter","datacenter","Data Center","Core Architecture"],["server","server","Server","Core Architecture"],
  ["vm","vm","Virtual Machine","Core Architecture"],["baremetal","server","Bare Metal Server","Core Architecture"],["cluster","cluster","Compute Cluster","Core Architecture"],
  ["application","application","Application","Core Architecture"],["app","application","Application","Core Architecture"],["microservice","microservice","Microservice","Core Architecture"],["desktop","client","Desktop Application","Core Architecture"],["service","service","Service","Core Architecture"],
  ["container","container","Container","Core Architecture"],["aks","kubernetes","AKS Cluster","Containers & DevOps"],["storage","storage","Object Storage","Core Architecture"],["storageacct","storage","Storage Account","Core Architecture"],["database","database","Database","Core Architecture"],
  ["sql","database","SQL Database","Core Architecture"],["nosql","database","NoSQL Database","Core Architecture"],["cache","cache","Cache","Core Architecture"],
  ["queue","queue","Message Queue","Core Architecture"],["eventbus","eventbus","Event Bus","Core Architecture"],["stream","stream","Event Stream","Core Architecture"],
  ["api","api","API Gateway","Core Architecture"],["gateway","gateway","Gateway","Core Architecture"],["identity","identity","Identity Provider","Core Architecture"],

  // Network & Internet
  ["internet","internet","Internet","Network & Internet"],["user","user","User","Network & Internet"],["client","client","Client","Network & Internet"],
  ["browser","browser","Web Browser","Network & Internet"],["mobile","mobile","Mobile Client","Network & Internet"],["dns","dns","DNS","Network & Internet"],
  ["router","router","Router","Network & Internet"],["switch","switch","Network Switch","Network & Internet"],["core-switch","switch","Core Switch","Network & Internet"],
  ["gateway-router","gateway","Gateway Router","Network & Internet"],["proxy","proxy","Proxy","Network & Internet"],["reverse-proxy","proxy","Reverse Proxy","Network & Internet"],
  ["loadbalancer","loadbalancer","Load Balancer","Network & Internet"],["alb","loadbalancer","Application Load Balancer","Network & Internet"],["nlb","loadbalancer","Network Load Balancer","Network & Internet"],
  ["cdn","cdn","CDN","Network & Internet"],["vpn","vpn","VPN Gateway","Network & Internet"],["site-vpn","vpn","Site-to-Site VPN","Network & Internet"],
  ["private-link","network","Private Link","Network & Internet"],["subnet","subnet","Subnet","Network & Internet"],["vlan","network","VLAN","Network & Internet"],
  ["nat","gateway","NAT Gateway","Network & Internet"],["dhcp","network","DHCP","Network & Internet"],["ipam","network","IPAM","Network & Internet"],
  ["network-firewall","firewall","Network Firewall","Network & Internet"],["waf","waf","Web Application Firewall","Network & Internet"],["dns-zone","dns","DNS Zone","Network & Internet"],
  ["endpoint","network","Network Endpoint","Network & Internet"],["service-endpoint","network","Service Endpoint","Network & Internet"],["network-zone","zone","Network Zone","Network & Internet"],
  ["ethernet","network","Ethernet","Network & Internet"],["wifi","network","Wi-Fi","Network & Internet"],["bgp","network","BGP Router","Network & Internet"],

  // Security & Identity
  ["firewall","firewall","Firewall","Security & Identity"],["ids","security","IDS","Security & Identity"],["ips","security","IPS","Security & Identity"],
  ["siem","siem","SIEM","Security & Identity"],["soar","security","SOAR","Security & Identity"],["edr","security","EDR","Security & Identity"],
  ["casb","security","CASB","Security & Identity"],["ddos","security","DDoS Protection","Security & Identity"],["security-zone","zone","Security Zone","Security & Identity"],
  ["iam","identity","IAM","Security & Identity"],["sso","identity","SSO","Security & Identity"],["directory","identity","Directory Service","Security & Identity"],
  ["managed-identity","identity","Managed Identity","Security & Identity"],["keyvault","key","Secrets / Key Vault","Security & Identity"],["kms","key","Key Management Service","Security & Identity"],
  ["secrets","key","Secrets Manager","Security & Identity"],["certificate","certificate","Certificate Authority","Security & Identity"],["policy","policy","Policy Engine","Security & Identity"],
  ["zero-trust","security","Zero Trust","Security & Identity"],["bastion","security","Bastion Host","Security & Identity"],["security-group","security","Security Group","Security & Identity"],
  ["compliance","security","Compliance","Security & Identity"],["vulnerability","security","Vulnerability Scanner","Security & Identity"],

  // AWS
  ["aws","aws","AWS","AWS"],["aws-vpc","vpc","Amazon VPC","AWS"],["aws-subnet","subnet","VPC Subnet","AWS"],["aws-ec2","vm","Amazon EC2","AWS"],
  ["aws-ecs","container","Amazon ECS","AWS"],["aws-eks","kubernetes","Amazon EKS","AWS"],["aws-fargate","container","AWS Fargate","AWS"],
  ["aws-lambda","function","AWS Lambda","AWS"],["aws-elb","loadbalancer","Elastic Load Balancing","AWS"],["aws-alb","loadbalancer","Application Load Balancer","AWS"],
  ["aws-nlb","loadbalancer","Network Load Balancer","AWS"],["aws-apigw","api","Amazon API Gateway","AWS"],["aws-cloudfront","cdn","Amazon CloudFront","AWS"],
  ["aws-route53","dns","Amazon Route 53","AWS"],["aws-waf","waf","AWS WAF","AWS"],["aws-shield","security","AWS Shield","AWS"],
  ["aws-iam","identity","AWS IAM","AWS"],["aws-cognito","identity","Amazon Cognito","AWS"],["aws-s3","storage","Amazon S3","AWS"],
  ["aws-ebs","storage","Amazon EBS","AWS"],["aws-efs","storage","Amazon EFS","AWS"],["aws-rds","database","Amazon RDS","AWS"],
  ["aws-aurora","database","Amazon Aurora","AWS"],["aws-dynamodb","database","Amazon DynamoDB","AWS"],["aws-elasticache","cache","Amazon ElastiCache","AWS"],
  ["aws-sqs","queue","Amazon SQS","AWS"],["aws-sns","eventbus","Amazon SNS","AWS"],["aws-eventbridge","eventbus","Amazon EventBridge","AWS"],
  ["aws-kinesis","stream","Amazon Kinesis","AWS"],["aws-msk","stream","Amazon MSK","AWS"],["aws-ecr","container","Amazon ECR","AWS"],
  ["aws-cloudwatch","monitor","Amazon CloudWatch","AWS"],["aws-cloudtrail","audit","AWS CloudTrail","AWS"],["aws-secrets","key","AWS Secrets Manager","AWS"],
  ["aws-kms","key","AWS KMS","AWS"],["aws-bedrock","ai","Amazon Bedrock","AWS"],["aws-opensearch","search","Amazon OpenSearch","AWS"],

  // Azure
  ["azure","azure","Microsoft Azure","Azure"],["azure-vnet","vpc","Azure Virtual Network","Azure"],["azure-subnet","subnet","Azure Subnet","Azure"],
  ["azure-vm","vm","Azure Virtual Machine","Azure"],["azure-vmss","cluster","Virtual Machine Scale Set","Azure"],["azure-aks","kubernetes","Azure Kubernetes Service","Azure"],
  ["azure-functions","function","Azure Functions","Azure"],["azure-appservice","application","Azure App Service","Azure"],["azure-containerapps","container","Azure Container Apps","Azure"],
  ["azure-acr","container","Azure Container Registry","Azure"],["azure-lb","loadbalancer","Azure Load Balancer","Azure"],["azure-appgw","loadbalancer","Azure Application Gateway","Azure"],
  ["azure-frontdoor","cdn","Azure Front Door","Azure"],["azure-cdn","cdn","Azure CDN","Azure"],["azure-apim","api","Azure API Management","Azure"],
  ["azure-dns","dns","Azure DNS","Azure"],["azure-firewall","firewall","Azure Firewall","Azure"],["azure-waf","waf","Azure WAF","Azure"],
  ["azure-vpngw","vpn","Azure VPN Gateway","Azure"],["azure-expressroute","network","Azure ExpressRoute","Azure"],["azure-entra","identity","Microsoft Entra ID","Azure"],
  ["azure-managed-id","identity","Azure Managed Identity","Azure"],["azure-keyvault","key","Azure Key Vault","Azure"],["azure-storage","storage","Azure Storage Account","Azure"],
  ["azure-blob","storage","Azure Blob Storage","Azure"],["azure-files","storage","Azure Files","Azure"],["azure-sql","database","Azure SQL Database","Azure"],
  ["azure-cosmos","database","Azure Cosmos DB","Azure"],["azure-redis","cache","Azure Cache for Redis","Azure"],["azure-servicebus","queue","Azure Service Bus","Azure"],
  ["azure-eventgrid","eventbus","Azure Event Grid","Azure"],["azure-eventhubs","stream","Azure Event Hubs","Azure"],["azure-monitor","monitor","Azure Monitor","Azure"],
  ["azure-loganalytics","logs","Log Analytics Workspace","Azure"],["azure-sentinel","siem","Microsoft Sentinel","Azure"],["azure-openai","ai","Azure OpenAI","Azure"],
  ["azure-aisearch","search","Azure AI Search","Azure"],

  // Google Cloud
  ["gcp","gcp","Google Cloud","Google Cloud"],["gcp-vpc","vpc","Google VPC","Google Cloud"],["gcp-subnet","subnet","VPC Subnet","Google Cloud"],
  ["gcp-compute","vm","Compute Engine","Google Cloud"],["gcp-gke","kubernetes","Google Kubernetes Engine","Google Cloud"],["gcp-cloudrun","container","Cloud Run","Google Cloud"],
  ["gcp-functions","function","Cloud Functions","Google Cloud"],["gcp-lb","loadbalancer","Cloud Load Balancing","Google Cloud"],["gcp-apigw","api","API Gateway","Google Cloud"],
  ["gcp-cdn","cdn","Cloud CDN","Google Cloud"],["gcp-dns","dns","Cloud DNS","Google Cloud"],["gcp-armor","waf","Cloud Armor","Google Cloud"],
  ["gcp-vpn","vpn","Cloud VPN","Google Cloud"],["gcp-interconnect","network","Cloud Interconnect","Google Cloud"],["gcp-iam","identity","Cloud IAM","Google Cloud"],
  ["gcp-secrets","key","Secret Manager","Google Cloud"],["gcp-kms","key","Cloud KMS","Google Cloud"],["gcp-storage","storage","Cloud Storage","Google Cloud"],
  ["gcp-persistentdisk","storage","Persistent Disk","Google Cloud"],["gcp-cloudsql","database","Cloud SQL","Google Cloud"],["gcp-alloydb","database","AlloyDB","Google Cloud"],
  ["gcp-spanner","database","Cloud Spanner","Google Cloud"],["gcp-firestore","database","Firestore","Google Cloud"],["gcp-bigtable","database","Bigtable","Google Cloud"],
  ["gcp-memorystore","cache","Memorystore","Google Cloud"],["gcp-pubsub","queue","Pub/Sub","Google Cloud"],["gcp-dataflow","stream","Dataflow","Google Cloud"],
  ["gcp-dataproc","cluster","Dataproc","Google Cloud"],["gcp-vertex","ai","Vertex AI","Google Cloud"],["gcp-logging","logs","Cloud Logging","Google Cloud"],
  ["gcp-monitoring","monitor","Cloud Monitoring","Google Cloud"],

  // Containers & DevOps
  ["kubernetes","kubernetes","Kubernetes","Containers & DevOps"],["k8s-node","server","Kubernetes Node","Containers & DevOps"],["k8s-pod","container","Kubernetes Pod","Containers & DevOps"],
  ["k8s-deployment","cluster","Kubernetes Deployment","Containers & DevOps"],["k8s-service","service","Kubernetes Service","Containers & DevOps"],["k8s-ingress","gateway","Kubernetes Ingress","Containers & DevOps"],
  ["k8s-configmap","policy","ConfigMap","Containers & DevOps"],["k8s-secret","key","Kubernetes Secret","Containers & DevOps"],["docker","container","Docker","Containers & DevOps"],
  ["container-registry","container","Container Registry","Containers & DevOps"],["jenkins","pipeline","Jenkins","Containers & DevOps"],["github-actions","pipeline","GitHub Actions","Containers & DevOps"],
  ["gitlab-ci","pipeline","GitLab CI/CD","Containers & DevOps"],["terraform","terraform","Terraform","Containers & DevOps"],["ansible","automation","Ansible","Containers & DevOps"],
  ["argocd","pipeline","Argo CD","Containers & DevOps"],["helm","package","Helm","Containers & DevOps"],["api-dev","api","Developer Portal","Containers & DevOps"],

  // Data, Integration & AI
  ["database","database","Database","Data & AI"],["sql","database","SQL Database","Data & AI"],["nosql","database","NoSQL Database","Data & AI"],
  ["warehouse","database","Data Warehouse","Data & AI"],["datalake","storage","Data Lake","Data & AI"],["lakehouse","storage","Data Lakehouse","Data & AI"],
  ["etl","pipeline","ETL / Data Pipeline","Data & AI"],["kafka","stream","Apache Kafka","Data & AI"],["eventstream","stream","Event Stream","Data & AI"],
  ["messagebroker","queue","Message Broker","Data & AI"],["vector","vector","Vector Database","Data & AI"],["search","search","Search Engine","Data & AI"],
  ["llm","ai","LLM / AI Model","Data & AI"],["ai-agent","ai","AI Agent","Data & AI"],
  ["embedding","ai","Embedding Service","Data & AI"],["featurestore","database","Feature Store","Data & AI"],["mlflow","ai","ML Lifecycle","Data & AI"],

  // Observability & Enterprise
  ["monitoring","monitor","Monitoring","Observability & Enterprise"],["logs","logs","Log Analytics","Observability & Enterprise"],["tracing","monitor","Distributed Tracing","Observability & Enterprise"],
  ["metrics","monitor","Metrics","Observability & Enterprise"],["alerting","monitor","Alerting","Observability & Enterprise"],["servicenow","service","ServiceNow","Observability & Enterprise"],
  ["itsm","service","ITSM","Observability & Enterprise"],["confluence","document","Knowledge Base","Observability & Enterprise"],["ticket","service","Incident / Ticket","Observability & Enterprise"],
  ["backup","storage","Backup","Observability & Enterprise"],["dr","storage","Disaster Recovery","Observability & Enterprise"],["rubrik","storage","Rubrik","Observability & Enterprise"],
  ["qualys","security","Qualys","Observability & Enterprise"],["zabbix","monitor","Zabbix","Observability & Enterprise"],["splunk","siem","Splunk","Observability & Enterprise"],
  ["newrelic","monitor","New Relic","Observability & Enterprise"],["solarwinds","monitor","SolarWinds","Observability & Enterprise"]
];
const $ = id => document.getElementById(id);
const canvas=$("canvas"), inner=$("canvasInner"), nodesEl=$("nodes"), edgesEl=$("edges");
const uid=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
const esc=s=>String(s??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const libEntry=t=>CATALOG.find(x=>x[0]===t)||[t,"application",t,"Core Architecture"];
const libName=t=>libEntry(t)[2];
const libIcon=t=>iconSvg(libEntry(t)[1], libEntry(t)[0]);
const libCategory=t=>libEntry(t)[3];


/* ---------- local professional SVG icon system ---------- */
const ICON_PATHS={
 cloud:`<path d="M7 18h10.5a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.5 7.7 4.2 4.2 0 0 0 7 18Z"/>`,
 azure:`<path d="M13.5 3 7 16h5.2l2.2-4.2 2.4 4.2h3.7L13.5 3Z"/><path d="M4 17h8.2l-2.1-3.8L4 17Z"/>`,
 aws:`<path d="M5 15c3 2.1 7 2.7 11 1.4"/><path d="M16 14.5 18 17l-3 .4"/><path d="M6 12.5V7.8l4-2.3 4 2.3v4.7l-4 2.3-4-2.3Z"/>`,
 gcp:`<path d="M6 16.5 4.7 14A5 5 0 0 1 9 6.2l2.1 3.6A2.1 2.1 0 0 0 8.9 13L10 15H6Z"/><path d="M11 6.2 13.3 6a5 5 0 0 1 4.1 8l-2.1-1.2a2.2 2.2 0 0 0-1.9-3.2H11V6.2Z"/><path d="M7 16h9"/>`,
 internet:`<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.2 2.3 3.2 5 3.2 8s-1 5.7-3.2 8c-2.2-2.3-3.2-5-3.2-8S9.8 6.3 12 4Z"/>`,
 user:`<circle cx="12" cy="8" r="3"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0"/>`,
 client:`<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M9 20h6M12 16v4"/>`,
 browser:`<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 8h16M8 6h.01M11 6h.01M14 6h.01"/>`,
 mobile:`<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 18h4"/>`,
 server:`<rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/><path d="M7 7h.01M7 17h.01"/>`,
 vm:`<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8v6H8zM12 3v2M12 19v2"/>`,
 cluster:`<circle cx="12" cy="6" r="2.5"/><circle cx="6" cy="16" r="2.5"/><circle cx="18" cy="16" r="2.5"/><path d="m10.2 8-3 5.7M13.8 8l3 5.7M8.5 16h7"/>`,
 application:`<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h8M8 12h5M8 16h3"/>`,
 microservice:`<circle cx="7" cy="12" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="17" cy="17" r="3"/><path d="m9.6 10.7 4.8-2.5M9.6 13.3l4.8 2.5"/>`,
 service:`<path d="M7 5h10l2 3v8l-2 3H7l-2-3V8l2-3Z"/><path d="M8 9h8M8 13h5"/>`,
 container:`<path d="m5 8 7-4 7 4v8l-7 4-7-4V8Z"/><path d="M5 8l7 4 7-4M12 12v8"/>`,
 storage:`<path d="M5 6h14v12H5z"/><path d="M8 9h8M8 12h8M8 15h5"/>`,
 database:`<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>`,
 cache:`<path d="M5 7c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3Z"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>`,
 queue:`<path d="M4 7h13M4 12h13M4 17h13"/><path d="m15 5 3 2-3 2M15 10l3 2-3 2M15 15l3 2-3 2"/>`,
 eventbus:`<circle cx="6" cy="12" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="18" cy="17" r="2"/><path d="M8 11l8-3M8 13l8 3"/>`,
 stream:`<path d="M4 8c3-3 5-3 8 0s5 3 8 0M4 12c3-3 5-3 8 0s5 3 8 0M4 16c3-3 5-3 8 0s5 3 8 0"/>`,
 api:`<path d="M5 12h14M15 7l5 5-5 5M9 17l-5-5 5-5"/>`,
 gateway:`<path d="M4 12h16M7 7l-3 5 3 5M17 7l3 5-3 5"/>`,
 loadbalancer:`<path d="M12 4v16M5 8h14M5 16h14"/><circle cx="5" cy="8" r="2"/><circle cx="19" cy="8" r="2"/><circle cx="5" cy="16" r="2"/><circle cx="19" cy="16" r="2"/>`,
 firewall:`<path d="M5 4h14v16H5z"/><path d="M5 8h14M5 12h14M5 16h14M10 4v4M15 8v4M10 12v4M15 16v4"/>`,
 waf:`<path d="M6 4h12l2 4-2 12H6L4 8l2-4Z"/><path d="M8 9h8M8 13h6M8 17h4"/>`,
 vpn:`<path d="M6 10V8a6 6 0 0 1 12 0v2"/><rect x="5" y="10" width="14" height="10" rx="2"/><circle cx="12" cy="15" r="1"/>`,
 dns:`<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2 2.2 3 4.8 3 8s-1 5.8-3 8"/>`,
 cdn:`<circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="m7 7 3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"/>`,
 network:`<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="7" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="M8.3 10.8 15.7 8.2M8.3 13.2l7.4 2.6"/>`,
 subnet:`<rect x="4" y="4" width="16" height="16" rx="2" stroke-dasharray="3 2"/><path d="M8 12h8M12 8v8"/>`,
 router:`<rect x="4" y="8" width="16" height="8" rx="2"/><path d="M7 12h10M8 10h.01M16 10h.01"/>`,
 switch:`<rect x="4" y="8" width="16" height="8" rx="2"/><path d="m7 12 3-2M7 12l3 2M17 12l-3-2M17 12l-3 2"/>`,
 proxy:`<path d="M5 7h14v10H5z"/><path d="M8 10h8M8 14h5"/>`,
 vpc:`<path d="M5 4h14v16H5z"/><path d="M9 8h6v8H9zM5 12h4M15 12h4"/>`,
 key:`<circle cx="8" cy="10" r="3"/><path d="m10 12 7 7M14 16l2-2M12 14l2-2"/>`,
 identity:`<circle cx="12" cy="8" r="3"/><path d="M6 19a6 6 0 0 1 12 0"/><path d="M17 5h3v4"/>`,
 security:`<path d="M12 3 19 6v5c0 4.5-2.8 7.5-7 10-4.2-2.5-7-5.5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-4"/>`,
 siem:`<path d="M5 5h14v14H5z"/><path d="M8 15v-3M12 15V8M16 15v-5"/>`,
 certificate:`<path d="M6 4h10l3 3v13H6z"/><path d="M16 4v4h3M9 12h6M9 16h4"/>`,
 policy:`<path d="M5 5h14v14H5z"/><path d="M8 9h8M8 13h5M8 17h3"/>`,
 monitor:`<rect x="4" y="5" width="16" height="12" rx="2"/><path d="M7 13l3-3 2 2 4-5M9 20h6"/>`,
 logs:`<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>`,
 audit:`<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h3"/>`,
 function:`<path d="M8 5c-2 2-2 10 0 12M16 5c2 2 2 10 0 12M6 12h12"/>`,
 ai:`<path d="M8 5h8l3 3v8l-3 3H8l-3-3V8l3-3Z"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/><path d="M9 15h6M12 2v3"/>`,
 vector:`<path d="m5 16 5-5 4 4 5-7"/><path d="M5 19h14"/>`,
 search:`<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>`,
 pipeline:`<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="7" cy="7" r="2"/><circle cx="13" cy="12" r="2"/><circle cx="18" cy="17" r="2"/>`,
 terraform:`<path d="m5 5 7 4v7l-7-4V5ZM12 9l7-4v7l-7 4V9ZM12 16l7-4v7l-7 4v-7Z"/>`,
 automation:`<path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.5 3.5M14.9 14.9l3.5 3.5M18.4 5.6l-3.5 3.5M9.1 14.9l-3.5 3.5"/><circle cx="12" cy="12" r="4"/>`,
 package:`<path d="m5 7 7-4 7 4-7 4-7-4ZM5 7v10l7 4 7-4V7M12 11v10"/>`,
 document:`<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h3M9 11h6M9 15h6"/>`,
 region:`<path d="M4 7h16v10H4z"/><path d="M7 7v10M17 7v10M4 12h16"/>`,
 zone:`<path d="M5 5h14v14H5z"/><path d="M8 8h8v8H8z"/>`,
 environment:`<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h5M8 16h8"/>`,
 datacenter:`<path d="M5 4h14v16H5z"/><path d="M8 8h8v3H8zM8 13h8v3H8z"/><path d="M10 9.5h.01M10 14.5h.01"/>`,
 kubernetes:`<path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z"/><circle cx="12" cy="12" r="2.5"/><path d="M12 5.5v4M12 14.5v4M5.8 8.5l3.5 2M14.7 13.5l3.5 2M18.2 8.5l-3.5 2M9.3 13.5l-3.5 2"/>`,
 function:`<path d="M8 5c-2 2-2 10 0 12M16 5c2 2 2 10 0 12M6 12h12"/>`,
 monitor:`<rect x="4" y="5" width="16" height="12" rx="2"/><path d="M7 13l3-3 2 2 4-5M9 20h6"/>`,
 logs:`<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>`,
 audit:`<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h3"/>`,
 vpc:`<path d="M5 4h14v16H5z"/><path d="M9 8h6v8H9zM5 12h4M15 12h4"/>`,
 data:`<path d="M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3v12c0 1.7-3.1 3-7 3s-7-1.3-7-3V6Z"/><path d="M5 6c0 1.7 3.1 3 7 3s7-1.3 7-3M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>`,
};

const CATEGORY_ACCENT={
 "Core Architecture":"#52627a","Network & Internet":"#0f75b5","Security & Identity":"#9a4d19",
 "AWS":"#c56a00","Azure":"#2764f0","Google Cloud":"#3b65d1","Containers & DevOps":"#5a4db2",
 "Data & AI":"#7b4fb3","Observability & Enterprise":"#237a63"
};
function iconSvg(kind,id=""){
  const safeKind = ICON_PATHS[kind] ? kind : (ICON_PATHS[id] ? id : "application");
  const body = ICON_PATHS[safeKind] || ICON_PATHS.application;
  const accent = libEntrySafe(id)?.[3] || "Core Architecture";
  const color = CATEGORY_ACCENT[accent] || "#52627a";
  const vendor = ["aws","azure","gcp"].includes(safeKind) ? " vendor-mark" : "";
  return `<svg class="catalog-svg${vendor}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="--icon-color:${color}">${body}</svg>`;
}
function libEntrySafe(t){ return CATALOG.find(x=>x[0]===t)||null; }

let model={version:4,name:"Untitled architecture",items:[],edges:[]};
let selected=new Set(), selectedEdge=null, tool="select", connector="straight", lineStyle="solid";
let drawing=null, drag=null, edgeDrag=null, zoom=1, impact=false, undoStack=[], redoStack=[];

/* ---------- history ---------- */
function snap(){return JSON.stringify(model)}
function commit(){undoStack.push(snap());if(undoStack.length>80)undoStack.shift();redoStack=[]}
function undo(){if(!undoStack.length)return;redoStack.push(snap());model=JSON.parse(undoStack.pop());selected.clear();selectedEdge=null;render();status("Undo")}
function redo(){if(!redoStack.length)return;undoStack.push(snap());model=JSON.parse(redoStack.pop());selected.clear();selectedEdge=null;render();status("Redo")}
function status(s){$("status").textContent=s}
function getItem(id){return model.items.find(n=>n.id===id)}
function getEdge(id){return model.edges.find(e=>e.id===id)}
function centerOf(n){return[n.x+n.width/2,n.y+n.height/2]}

/* ---------- coordinates ---------- */
function canvasPoint(clientX,clientY){
 const r=canvas.getBoundingClientRect();
 return [(clientX-r.left+canvas.scrollLeft)/zoom,(clientY-r.top+canvas.scrollTop)/zoom];
}
function portPoint(n,p){
 const [cx,cy]=centerOf(n);
 return p==="top"?[cx,n.y]:p==="right"?[n.x+n.width,cy]:p==="bottom"?[cx,n.y+n.height]:[n.x,cy];
}
function nearestPort(n,x,y){
 let best="right",d=Infinity;
 ["top","right","bottom","left"].forEach(p=>{
   const q=portPoint(n,p),dd=(q[0]-x)**2+(q[1]-y)**2;
   if(dd<d){d=dd;best=p}
 });
 return best;
}
function objectAt(clientX,clientY){
 const el=document.elementFromPoint(clientX,clientY)?.closest(".node");
 return el?getItem(el.dataset.id):null;
}

/* ---------- items ---------- */
function addItem(kind,x,y,o={}){
 const n={
   id:uid(),kind,x,y,width:o.width||150,height:o.height||76,z:o.z||10,
   label:o.label||"Item",type:o.type||"app",environment:o.environment||"Production",
   owner:o.owner||"",description:o.description||"",rotation:o.rotation||0,
   fill:o.fill||"#ffffff",stroke:o.stroke||"#64748b",text:o.text||"",src:o.src||"",
   shape:o.shape||null
 };
 if(kind==="node") n.label=o.label||libName(n.type);
 if(kind==="shape"){n.width=o.width||170;n.height=o.height||100;n.shape=o.shape||"rectangle";n.label=o.label||n.shape[0].toUpperCase()+n.shape.slice(1)}
 if(kind==="image"){n.width=o.width||240;n.height=o.height||170}
 if(kind==="sticky"){n.width=180;n.height=150;n.text=o.text||"Double-click to edit"}
 if(kind==="comment"){n.width=220;n.height=90;n.text=o.text||"Comment"}
 if(kind==="pin"){n.width=28;n.height=28;n.label="📌"}
 if(kind==="text"){n.width=240;n.height=45;n.text=o.text||"Double-click to edit"}
 model.items.push(n);selected.clear();selected.add(n.id);selectedEdge=null;render();return n;
}

/* ---------- rendering ---------- */
function markerDefs(){
 return `<defs>
 <marker id="m-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker>
 <marker id="m-circle" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6"><circle cx="5" cy="5" r="3" fill="context-stroke"/></marker>
 <marker id="m-diamond" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7"><path d="M5 0L10 5L5 10L0 5z" fill="context-stroke"/></marker>
 </defs>`;
}
function markerAttr(e,which){
 const v=e[which+"Marker"]||"none";
 return v==="none"?"":` marker-${which}="url(#m-${v})"`;
}
function smoothPath(points){
  if(!points || points.length < 2) return "";
  if(points.length === 2){
    return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`;
  }

  // Catmull-Rom -> cubic Bézier conversion.
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for(let i=0;i<points.length-1;i++){
    const p0 = points[i-1] || points[i];
    const p1 = points[i];
    const p2 = points[i+1];
    const p3 = points[i+2] || p2;

    const c1x = p1[0] + (p2[0]-p0[0]) / 6;
    const c1y = p1[1] + (p2[1]-p0[1]) / 6;
    const c2x = p2[0] - (p3[0]-p1[0]) / 6;
    const c2y = p2[1] - (p3[1]-p1[1]) / 6;

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function normalizeFreeformPoints(points){
  if(!points || !points.length) return [];
  const out=[points[0]];
  for(let i=1;i<points.length;i++){
    const a=out[out.length-1], b=points[i];
    if(Math.hypot(b[0]-a[0],b[1]-a[1]) >= 3) out.push(b);
  }
  return out;
}

function edgePath(e){
  const a=getItem(e.from), b=getItem(e.to);

  // Standalone free-form/draw paths do not require attached nodes.
  if(e.type==="freeform" && e.points?.length){
    return smoothPath(normalizeFreeformPoints(e.points));
  }

  if(!a || !b) return "";

  const [x1,y1]=portPoint(a,e.fromPort||"right");
  const [x2,y2]=portPoint(b,e.toPort||"left");

  if(e.type==="curved"){
    const c=e.controls?.length===2
      ? e.controls
      : [[x1+(x2-x1)*.35,y1],[x1+(x2-x1)*.65,y2]];
    return `M ${x1} ${y1} C ${c[0][0]} ${c[0][1]}, ${c[1][0]} ${c[1][1]}, ${x2} ${y2}`;
  }

  if(e.type==="wavy"){
    const steps=Math.max(18,Math.min(80,Math.round(Math.hypot(x2-x1,y2-y1)/18)));
    const dx=(x2-x1)/steps, dy=(y2-y1)/steps;
    const len=Math.hypot(x2-x1,y2-y1)||1;
    const nx=-dy/len*12, ny=dx/len*12;
    let d=`M ${x1} ${y1}`;
    for(let i=1;i<=steps;i++){
      const t=i/steps;
      const s=Math.sin(t*Math.PI*(e.waves||3)*2)*(i===steps?0:1);
      d+=` L ${x1+dx*i+nx*s} ${y1+dy*i+ny*s}`;
    }
    return d;
  }

  if(e.type==="elbow"){
    const mx=e.midX??(x1+x2)/2;
    return `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`;
  }

  return `M ${x1} ${y1} L ${x2} ${y2}`;
}
function edgeLabelPos(e){
 const a=getItem(e.from),b=getItem(e.to);if(!a||!b)return[0,0];
 const [x1,y1]=portPoint(a,e.fromPort||"right"),[x2,y2]=portPoint(b,e.toPort||"left");
 return[(x1+x2)/2,(y1+y2)/2-8];
}
function renderEdges(){
 edgesEl.innerHTML=markerDefs();
 const impacted=impact&&selected.size?new Set(downstream([...selected][0])):new Set();
 model.edges.forEach(e=>{
   const d=edgePath(e),sel=selectedEdge===e.id||selected.has(e.from)&&selected.has(e.to);
   const cls=`edge ${sel?"selected ":""}${impacted.has(e.to)?"impact ":""}`;
   const dash=e.style==="dashed"?"stroke-dasharray:8 5;":e.style==="dotted"?"stroke-dasharray:2 5;":"";
   const common=`data-edge-id="${e.id}" d="${d}" stroke="${e.color||"#52627a"}" stroke-width="${e.width||2}" style="${dash}"${markerAttr(e,"start")}${markerAttr(e,"end")}`;
   edgesEl.insertAdjacentHTML("beforeend",`<path class="edge-hit" data-edge-id="${e.id}" d="${d}" fill="none" stroke="transparent" stroke-width="14" pointer-events="stroke"></path><path class="${cls}" ${common}></path>`);
   if(e.label){const [x,y]=edgeLabelPos(e);edgesEl.insertAdjacentHTML("beforeend",`<text class="edge-label" x="${x}" y="${y}">${esc(e.label)}</text>`)}
   if(selectedEdge===e.id){
     if(e.type==="curved"&&e.controls?.length===2)e.controls.forEach((p,i)=>edgesEl.insertAdjacentHTML("beforeend",`<circle class="edge-control" data-edge-control="${e.id}" data-index="${i}" cx="${p[0]}" cy="${p[1]}" r="5"></circle>`));
     if(e.type==="freeform"&&e.points?.length){
       // Free-form paths are rendered as real strokes, not dotted control-point
       // rings. Keep the path clean while selected; the user can still move the
       // entire connector using the normal selection/drag behavior.
     }
     if(e.type==="elbow"){const a=getItem(e.from),b=getItem(e.to);if(a&&b)edgesEl.insertAdjacentHTML("beforeend",`<circle class="edge-control" data-edge-mid="${e.id}" cx="${e.midX??((portPoint(a,e.fromPort||"right")[0]+portPoint(b,e.toPort||"left")[0])/2)}" cy="${((portPoint(a,e.fromPort||"right")[1]+portPoint(b,e.toPort||"left")[1])/2)}" r="5"></circle>`)}
   }
 });
 if(drawing?.points?.length){
   const s=drawing.source;
   let previewPoints=normalizeFreeformPoints(drawing.points);
   if(s){
     const start=portPoint(s,drawing.sourcePort);
     previewPoints=[start,...previewPoints];
   }
   const d=smoothPath(previewPoints);
   edgesEl.insertAdjacentHTML("beforeend",
     `<path class="edge selected" d="${d}" stroke="${lineColor()}" stroke-width="${lineWidth()}" fill="none" marker-end="url(#m-arrow)"></path>`);
 }
}
function renderItem(n){
 const el=document.createElement("div");
 const selectedNow=selected.has(n.id);
 el.dataset.id=n.id;el.style.left=n.x+"px";el.style.top=n.y+"px";el.style.width=n.width+"px";el.style.height=n.height+"px";el.style.zIndex=n.z;
 el.style.transform=`rotate(${n.rotation||0}deg)`;
 el.style.background=n.fill||"#fff";el.style.borderColor=n.stroke||"#64748b";
 if(n.kind==="shape"){
   el.className=`node shape-node shape-${n.shape} ${selectedNow?"selected":""}`;
   el.innerHTML=`<span class="shape-label">${esc(n.label)}</span>`;
 }else if(n.kind==="image"){
   el.className=`node image-node ${selectedNow?"selected":""}`;
   el.innerHTML=`<img src="${esc(n.src)}" alt="${esc(n.label)}"><span class="shape-label image-caption">${esc(n.label)}</span>`;
 }else if(n.kind==="sticky"){
   el.className=`sticky-note ${selectedNow?"selected":""}`;
   el.innerHTML=`<textarea>${esc(n.text)}</textarea>`;
 }else if(n.kind==="comment"){
   el.className=`comment-node ${selectedNow?"selected":""}`;
   el.innerHTML=`<strong>Comment</strong><div>${esc(n.text)}</div>`;
 }else if(n.kind==="pin"){
   el.className=`pin-node ${selectedNow?"selected":""}`;el.textContent="📌";
 }else if(n.kind==="text"){
   el.className=`node text-node ${selectedNow?"selected":""}`;el.innerHTML=`<div>${esc(n.text)}</div>`;
 }else{
   el.className=`node ${selectedNow?"selected":""}`;
   el.innerHTML=`<div class="node-content"><span class="node-icon">${libIcon(n.type)}</span><span class="node-type">${esc(libName(n.type))}</span><span class="node-title">${esc(n.label)}</span><span class="node-meta">${esc(n.environment)}${n.owner?" · "+esc(n.owner):""}</span></div>`;
 }
 if(["node","shape","image","text"].includes(n.kind)){
   ["top","right","bottom","left"].forEach(p=>{
     const q=document.createElement("span");q.className=`connection-port ${p}`;q.dataset.port=p;el.appendChild(q)
   });
 }
 ["nw","ne","sw","se"].forEach(p=>{const h=document.createElement("span");h.className=`resize-handle ${p}`;h.dataset.resize=p;el.appendChild(h)});
 el.addEventListener("pointerdown",onItemPointerDown);
 el.addEventListener("dblclick",()=>editItem(n));
 if(n.kind==="sticky")el.querySelector("textarea").addEventListener("input",ev=>n.text=ev.target.value);
 nodesEl.appendChild(el);
}
function renderInspector(){
 const n=selected.size===1?getItem([...selected][0]):null;
 $("inspectorEmpty").hidden=!!n||!!selectedEdge;
 $("inspector").hidden=!n;
 $("edgeInspector").hidden=!selectedEdge;
 if(n){
   $("nodeLabel").value=n.label||n.text||"";
   $("nodeType").value=n.kind==="node"?libName(n.type):n.kind==="shape"?`Shape: ${n.shape}`:n.kind;
   $("nodeEnvironment").value=n.environment||"Production";$("nodeOwner").value=n.owner||"";
   $("nodeDescription").value=n.description||"";$("nodeWidth").value=Math.round(n.width);$("nodeHeight").value=Math.round(n.height);
   $("nodeRotation").value=n.rotation||0;$("nodeFill").value=n.fill?.startsWith("#")?n.fill:"#ffffff";$("nodeStroke").value=n.stroke?.startsWith("#")?n.stroke:"#64748b";
 }
 if(selectedEdge){
   const e=getEdge(selectedEdge);
   if(e){$("edgeLabelInspector").value=e.label||"";$("edgeStyleInspector").value=e.style||"solid";$("edgeWidthInspector").value=e.width||2;$("edgeColorInspector").value=e.color||"#52627a";
      $("lineStyle").value=e.style||"solid";$("lineWidth").value=e.width||2;$("lineColor").value=e.color||"#52627a";$("edgeLabel").value=e.label||"";}
 }
}
function render(){
 $("diagramName").value=model.name;
 nodesEl.innerHTML="";
 model.items.slice().sort((a,b)=>(a.z||10)-(b.z||10)).forEach(renderItem);
 renderEdges();renderInspector();
 $("canvasEmpty").style.display=model.items.length?"none":"block";
 renderImpact();updateZoom();
}

/* ---------- selection / manipulation ---------- */
function clearSelection(){selected.clear();selectedEdge=null}
function selectItem(id,multi=false){if(!multi)selected.clear();selected.add(id);selectedEdge=null;render()}
function onItemPointerDown(ev){
 if(ev.button!==0)return;
 ev.stopPropagation();
 const n=getItem(ev.currentTarget.dataset.id);
 if(ev.target.dataset.resize){startResize(ev,n,ev.target.dataset.resize);return}
 if(ev.target.dataset.port && tool==="connector"){beginConnector(ev,n,ev.target.dataset.port);return}
 if(tool==="connector"){
   beginConnector(ev,n,nearestPort(n,...canvasPoint(ev.clientX,ev.clientY)));
   return;
 }
 if(tool==="pan")return;
 selectItem(n.id,ev.shiftKey||ev.ctrlKey||ev.metaKey);
 commit();
 drag={ids:[...selected],startX:ev.clientX,startY:ev.clientY,orig:new Map([...selected].map(id=>{const q=getItem(id);return[id,[q.x,q.y]]}))};
 ev.currentTarget.setPointerCapture?.(ev.pointerId);
}
function startResize(ev,n,corner){
 ev.stopPropagation();commit();
 drag={resize:true,id:n.id,corner,startX:ev.clientX,startY:ev.clientY,orig:[n.x,n.y,n.width,n.height]}
}
function moveDrag(ev){
 if(!drag)return;
 const dx=(ev.clientX-drag.startX)/zoom,dy=(ev.clientY-drag.startY)/zoom;
 if(drag.resize){
   const n=getItem(drag.id),[x,y,w,h]=drag.orig;
   if(drag.corner.includes("e"))n.width=Math.max(25,w+dx);
   if(drag.corner.includes("s"))n.height=Math.max(25,h+dy);
   if(drag.corner.includes("w")){n.x=x+dx;n.width=Math.max(25,w-dx)}
   if(drag.corner.includes("n")){n.y=y+dy;n.height=Math.max(25,h-dy)}
 }else drag.ids.forEach(id=>{const n=getItem(id),o=drag.orig.get(id);n.x=Math.max(0,o[0]+dx);n.y=Math.max(0,o[1]+dy)});
 render()
}
function editItem(n){
 const value=prompt("Edit label / text:",n.kind==="sticky"||n.kind==="text"?n.text:n.label);
 if(value===null)return;commit();
 if(n.kind==="sticky"||n.kind==="text")n.text=value;else n.label=value;
 render();status("Item updated.")
}

/* ---------- connectors ---------- */
function beginConnector(ev,n,port){
 tool="connector";
 setTool("connector");
 const p=portPoint(n,port);
 drawing={
   mode:"connector",
   source:n,
   sourcePort:port,
   points:[p],
   pointerId:ev.pointerId
 };
 selected.clear();
 selected.add(n.id);
 selectedEdge=null;
 ev.currentTarget?.setPointerCapture?.(ev.pointerId);
 status(`Connecting from ${n.label||n.kind}. Drag to another object and release.`);
}

function beginFreeDraw(ev, mode="draw"){
 const p=canvasPoint(ev.clientX,ev.clientY);
 drawing={
   mode,
   source:null,
   sourcePort:null,
   points:[p],
   pointerId:ev.pointerId
 };
 canvas.setPointerCapture?.(ev.pointerId);
 status(mode==="draw"
   ? "Draw: drag across the canvas, then release."
   : "Free-form connector: drag the path, then release.");
}
function finishDrawing(ev){
  if(!drawing) return;

  const currentPoint=canvasPoint(ev.clientX,ev.clientY);
  if(drawing.points.length===0 ||
     Math.hypot(
       currentPoint[0]-drawing.points[drawing.points.length-1][0],
       currentPoint[1]-drawing.points[drawing.points.length-1][1]
     ) > 1){
    drawing.points.push(currentPoint);
  }

  const pts=normalizeFreeformPoints(drawing.points);
  const hit=objectAt(ev.clientX,ev.clientY);

  // Connector mode: if it started on a node and ended over another node,
  // create a real edge and snap its final point to the target port.
  if(drawing.mode==="connector" && drawing.source && hit && hit.id!==drawing.source.id){
    commit();

    const p=currentPoint;
    const toPort=nearestPort(hit,p[0],p[1]);
    const targetPoint=portPoint(hit,toPort);

    let pathPoints=pts.slice();
    if(pathPoints.length<2){
      pathPoints=[portPoint(drawing.source,drawing.sourcePort),targetPoint];
    }else{
      pathPoints[0]=portPoint(drawing.source,drawing.sourcePort);
      pathPoints[pathPoints.length-1]=targetPoint;
    }

    const e={
      id:uid(),
      from:drawing.source.id,
      to:hit.id,
      fromPort:drawing.sourcePort,
      toPort,
      type:connector,
      style:lineStyle,
      width:lineWidth(),
      color:lineColor(),
      startMarker:startMarker(),
      endMarker:endMarker(),
      label:$("edgeLabel").value.trim(),
      waves:3
    };

    if(e.type==="curved"){
      const a=pathPoints[0], b=pathPoints[pathPoints.length-1];
      e.controls=[
        [a[0]+(b[0]-a[0])*.35,a[1]],
        [a[0]+(b[0]-a[0])*.65,b[1]]
      ];
    }

    if(e.type==="elbow"){
      const a=pathPoints[0], b=pathPoints[pathPoints.length-1];
      e.midX=(a[0]+b[0])/2;
    }

    if(e.type==="freeform"){
      e.points=pathPoints;
    }

    model.edges.push(e);
    selected.clear();
    selectedEdge=e.id;
    drawing=null;
    try{canvas.releasePointerCapture?.(ev.pointerId)}catch{}
    render();
    status("Connector created. Select it to edit style and shape.");
    return;
  }

  // Draw/free-form mode: create a standalone smooth path.
  if(drawing.mode==="draw" && pts.length>=2){
    commit();

    const e={
      id:uid(),
      from:null,
      to:null,
      fromPort:null,
      toPort:null,
      type:"freeform",
      style:lineStyle,
      width:lineWidth(),
      color:lineColor(),
      startMarker:startMarker(),
      endMarker:endMarker(),
      label:"",
      points:pts
    };

    model.edges.push(e);
    selectedEdge=e.id;
    drawing=null;
    try{canvas.releasePointerCapture?.(ev.pointerId)}catch{}
    render();
    status("Free-form drawing created. Select it to edit.");
    return;
  }

  drawing=null;
  try{canvas.releasePointerCapture?.(ev.pointerId)}catch{}
  renderEdges();
}
function lineWidth(){return Math.max(1,Math.min(12,+$("lineWidth").value||2))}
function lineColor(){return $("lineColor").value||"#52627a"}
function startMarker(){return $("startMarker").value||"none"}
function endMarker(){return $("endMarker").value||"arrow"}
function onEdgePointerDown(ev){
 ev.stopPropagation();
 const id=ev.target.dataset.edgeId;
 if(!id)return;
 selectedEdge=id;selected.clear();render();status("Arrow selected. Drag visible control points to reshape it.")
}
function onEdgeControlDown(ev){
 ev.stopPropagation();
 const id=ev.target.dataset.edgeControl||ev.target.dataset.edgeMid;
 const e=getEdge(id);if(!e)return;
 commit();
 if(ev.target.dataset.edgeControl)edgeDrag={id,index:+ev.target.dataset.index};
 else edgeDrag={id,mid:true};
}
function moveEdgeControl(ev){
 if(!edgeDrag)return;
 const e=getEdge(edgeDrag.id);if(!e)return;
 const p=canvasPoint(ev.clientX,ev.clientY);
 if(edgeDrag.mid)e.midX=p[0];
 else if(e.type==="curved")e.controls[edgeDrag.index]=p;
 else if(e.type==="freeform")e.points[edgeDrag.index]=p;
 render()
}
edgesEl.addEventListener("pointerdown",ev=>{
 if(ev.target.classList.contains("edge-control")){onEdgeControlDown(ev);return}
 if(ev.target.classList.contains("edge")||ev.target.classList.contains("edge-hit"))onEdgePointerDown(ev)
});
document.addEventListener("pointermove",ev=>{
 if(drawing){
   if(drawing.pointerId!=null && ev.pointerId!==drawing.pointerId) return;
   const p=canvasPoint(ev.clientX,ev.clientY);
   const last=drawing.points[drawing.points.length-1];
   if(!last || Math.hypot(p[0]-last[0],p[1]-last[1])>2.5){
     drawing.points.push(p);
     renderEdges();
   }
   return;
 }
 if(edgeDrag){moveEdgeControl(ev);return}
 if(drag)moveDrag(ev)
});
document.addEventListener("pointerup",ev=>{
 if(drawing){finishDrawing(ev);return}
 drag=null;edgeDrag=null
});

/* ---------- canvas tools ---------- */
canvas.addEventListener("pointerdown",ev=>{
 if(ev.button!==0)return;
 if(ev.target.closest(".node")||ev.target.closest(".edge"))return;
 if(tool==="connector"){
   status("Connect: start on a component or its port, then drag to another component.");
   return;
 }
 if(tool==="draw"){beginFreeDraw(ev,"draw");return}
 const p=canvasPoint(ev.clientX,ev.clientY);
 if(tool==="text"){commit();addItem("text",p[0],p[1]);setTool("select");return}
 if(tool==="sticky"){commit();addItem("sticky",p[0],p[1]);setTool("select");return}
 if(tool==="comment"){commit();addItem("comment",p[0],p[1]);setTool("select");return}
 if(tool==="pin"){commit();addItem("pin",p[0],p[1]);setTool("select");return}
 if(tool==="pan"){
   const sx=ev.clientX,sy=ev.clientY,sl=canvas.scrollLeft,st=canvas.scrollTop;
   const move=e=>{canvas.scrollLeft=sl-(e.clientX-sx);canvas.scrollTop=st-(e.clientY-sy)};
   const up=()=>{document.removeEventListener("pointermove",move);document.removeEventListener("pointerup",up)};
   document.addEventListener("pointermove",move);document.addEventListener("pointerup",up);return
 }
 clearSelection();render()
});

/* ---------- library ---------- */
function renderPalette(filter=""){
 const q=filter.trim().toLowerCase();
 const filtered=CATALOG.filter(x=>!q||x[2].toLowerCase().includes(q)||x[0].toLowerCase().includes(q)||x[3].toLowerCase().includes(q));
 const groups=[...new Set(filtered.map(x=>x[3]))];
 $("palette").innerHTML=groups.map(category=>{
   const items=filtered.filter(x=>x[3]===category);
   return `<div class="library-category" data-category="${esc(category)}">
     <button class="library-category-title" type="button" data-category-toggle="${esc(category)}">
       <span>${esc(category)}</span><span class="category-count">${items.length}</span><span class="category-chevron">⌄</span>
     </button>
     <div class="palette palette-category-grid">
       ${items.map(([t,i,n])=>`<button class="palette-item" draggable="true" data-type="${t}" title="${esc(n)}">
         <span class="palette-icon">${iconSvg(i,t)}</span><span class="palette-label">${esc(n)}</span>
       </button>`).join("")}
     </div>
   </div>`;
 }).join("");

 document.querySelectorAll("[data-category-toggle]").forEach(btn=>{
   btn.addEventListener("click",()=>{
     const box=btn.closest(".library-category");
     box.classList.toggle("collapsed");
   });
 });

 document.querySelectorAll(".palette-item").forEach(b=>{
   b.addEventListener("click",()=>{
     const r=canvas.getBoundingClientRect(),p=canvasPoint(r.left+canvas.clientWidth/2,r.top+canvas.clientHeight/2);
     commit();addItem("node",p[0]-75,p[1]-38,{type:b.dataset.type,label:libName(b.dataset.type)});
     status(`${libName(b.dataset.type)} added.`);
   });
   b.addEventListener("dragstart",e=>{
     e.dataTransfer.effectAllowed="copy";
     e.dataTransfer.setData("application/x-architecture-type",b.dataset.type);
     e.dataTransfer.setData("text/plain",b.dataset.type);
   });
 });
}
$("componentSearch").addEventListener("input",e=>renderPalette(e.target.value));
canvas.addEventListener("dragover",e=>{e.preventDefault();canvas.classList.add("drop-target")});
canvas.addEventListener("dragleave",()=>canvas.classList.remove("drop-target"));
canvas.addEventListener("drop",e=>{
 e.preventDefault();canvas.classList.remove("drop-target");
 const type=e.dataTransfer.getData("application/x-architecture-type")||e.dataTransfer.getData("text/plain");
 if(!type)return;
 const p=canvasPoint(e.clientX,e.clientY);commit();addItem("node",p[0]-75,p[1]-38,{type,label:libName(type)});status(`${libName(type)} added.`)
});

/* ---------- shapes / images ---------- */
document.querySelectorAll("[data-shape]").forEach(b=>b.addEventListener("click",()=>{
 const r=canvas.getBoundingClientRect(),p=canvasPoint(r.left+canvas.clientWidth/2,r.top+canvas.clientHeight/2);
 commit();addItem("shape",p[0]-85,p[1]-50,{shape:b.dataset.shape,label:b.textContent});status(`${b.textContent} shape added.`)
}));
$("imageInput").addEventListener("change",ev=>{
 const f=ev.target.files?.[0];if(!f)return;
 const reader=new FileReader();reader.onload=()=>{
   const p=canvasPoint(canvas.getBoundingClientRect().left+canvas.clientWidth/2,canvas.getBoundingClientRect().top+canvas.clientHeight/2);
   commit();addItem("image",p[0]-120,p[1]-85,{label:f.name,src:reader.result});status("Image inserted as a connectable node.")
 };reader.readAsDataURL(f);ev.target.value=""
});
canvas.addEventListener("paste",ev=>{
 const files=[...(ev.clipboardData?.files||[])].filter(f=>f.type.startsWith("image/"));
 if(files.length){files.forEach(f=>{const r=new FileReader();r.onload=()=>{
   const p=canvasPoint(canvas.getBoundingClientRect().left+100,canvas.getBoundingClientRect().top+100);
   commit();addItem("image",p[0],p[1],{label:f.name||"Pasted image",src:r.result})
 };r.readAsDataURL(f)});ev.preventDefault();return}
});

/* ---------- toolbar ---------- */
function setTool(t){
 tool=t;
 document.querySelectorAll("[data-tool]").forEach(b=>b.classList.toggle("active",b.dataset.tool===t));
 status(t==="connector"?"Connect: drag from a port and release on another object.":t==="draw"?"Draw: free-form line on the canvas.":`${t[0].toUpperCase()+t.slice(1)} tool selected.`)
}
document.querySelectorAll("[data-tool]").forEach(b=>b.addEventListener("click",()=>{
 if(b.dataset.tool==="image"){$("imageInput").click();return}
 setTool(b.dataset.tool)
}));
document.querySelectorAll("[data-connector]").forEach(b=>b.addEventListener("click",()=>{
 connector=b.dataset.connector;
 document.querySelectorAll("[data-connector]").forEach(x=>x.classList.toggle("active",x.dataset.connector===connector));
 setTool("connector");
 status(`${connector} arrow selected. Drag from a port to another component.`)
}));
$("connectMode").onclick=()=>setTool("connector");
$("lineStyle").addEventListener("change",()=>{if(selectedEdge)applyEdgeStyle()});
$("lineWidth").addEventListener("change",()=>{if(selectedEdge)applyEdgeStyle()});
$("lineColor").addEventListener("change",()=>{if(selectedEdge)applyEdgeStyle()});
$("edgeLabel").addEventListener("change",()=>{if(selectedEdge)applyEdgeStyle()});
$("applyEdgeStyle").onclick=applyEdgeStyle;
function applyEdgeStyle(){
 if(!selectedEdge){status("Select an arrow first.");return}
 const e=getEdge(selectedEdge);if(!e)return;commit();
 e.style=$("lineStyle").value;e.width=lineWidth();e.color=lineColor();e.startMarker=startMarker();e.endMarker=endMarker();e.label=$("edgeLabel").value.trim();
 render();status("Arrow style applied.")
}
$("edgeStyleInspector").addEventListener("change",()=>{if(!selectedEdge)return;$("lineStyle").value=$("edgeStyleInspector").value;applyEdgeStyle()});
$("edgeWidthInspector").addEventListener("change",()=>{if(!selectedEdge)return;$("lineWidth").value=$("edgeWidthInspector").value;applyEdgeStyle()});
$("edgeColorInspector").addEventListener("change",()=>{if(!selectedEdge)return;$("lineColor").value=$("edgeColorInspector").value;applyEdgeStyle()});
$("edgeLabelInspector").addEventListener("change",()=>{if(!selectedEdge)return;$("edgeLabel").value=$("edgeLabelInspector").value;applyEdgeStyle()});

/* ---------- impact ---------- */
function downstream(start){
 const out=[],seen=new Set(),q=[start];
 while(q.length){const id=q.shift();model.edges.filter(e=>e.from===id).forEach(e=>{if(e.to&&!seen.has(e.to)){seen.add(e.to);out.push(e.to);q.push(e.to)}})}
 return out
}
function renderImpact(){
 if(!impact||selected.size!==1){$("impactResults").innerHTML='<p class="hint">Turn Impact on and select one component.</p>';return}
 const ids=downstream([...selected][0]);
 $("impactResults").innerHTML=ids.length?ids.map(id=>{const n=getItem(id);return`<div class="finding">${esc(n?.label||n?.kind)} is downstream.</div>`}).join(""):'<div class="finding ok">No downstream dependencies.</div>';
}
$("impactMode").onclick=()=>{impact=!impact;$("impactMode").classList.toggle("active",impact);render();status(impact?"Impact mode enabled. Select a source component.":"Impact mode disabled.")};

/* ---------- validation / layout ---------- */
$("validateDiagram").onclick=()=>{
 const findings=[];
 model.items.filter(n=>["node","shape","image"].includes(n.kind)).forEach(n=>{
   const connected=model.edges.some(e=>e.from===n.id||e.to===n.id);
   if(!connected)findings.push(`${n.label||n.kind}: no connections mapped.`);
 });
 const invalid=model.edges.filter(e=>e.from&&!getItem(e.from)||e.to&&!getItem(e.to));
 invalid.forEach(()=>findings.push("One connector references a missing object."));
 $("validationResults").innerHTML=findings.length?findings.map(x=>`<div class="finding warning">${esc(x)}</div>`).join(""):'<div class="finding ok">No basic architecture gaps found.</div>';
 status(findings.length?`${findings.length} validation finding(s).`:"Validation passed.")
};
$("autoLayout").onclick=()=>{
 const arr=model.items.filter(n=>["node","shape","image"].includes(n.kind));if(!arr.length)return;
 commit();arr.forEach((n,i)=>{n.x=60+(i%5)*220;n.y=70+Math.floor(i/5)*150});render();status("Components arranged.")
};

/* ---------- inspector ---------- */
["nodeLabel","nodeEnvironment","nodeOwner","nodeDescription","nodeWidth","nodeHeight","nodeRotation","nodeFill","nodeStroke"].forEach(id=>{
 $(id).addEventListener("change",()=>{
   if(selected.size!==1)return;const n=getItem([...selected][0]);if(!n)return;commit();
   if(id==="nodeLabel")n.label=$(id).value;
   else if(id==="nodeEnvironment")n.environment=$(id).value;
   else if(id==="nodeOwner")n.owner=$(id).value;
   else if(id==="nodeDescription")n.description=$(id).value;
   else if(id==="nodeWidth")n.width=Math.max(20,+$(id).value||20);
   else if(id==="nodeHeight")n.height=Math.max(20,+$(id).value||20);
   else if(id==="nodeRotation")n.rotation=+$("nodeRotation").value||0;
   else if(id==="nodeFill")n.fill=$(id).value;
   else if(id==="nodeStroke")n.stroke=$(id).value;
   render()
 })
});
$("editTextButton").onclick=()=>{if(selected.size===1)editItem(getItem([...selected][0]))};

/* ---------- delete / duplicate / keyboard ---------- */
function deleteSelected(){
 if(selectedEdge){commit();model.edges=model.edges.filter(e=>e.id!==selectedEdge);selectedEdge=null;render();status("Arrow deleted.");return}
 if(!selected.size)return;commit();const ids=new Set(selected);model.items=model.items.filter(n=>!ids.has(n.id));model.edges=model.edges.filter(e=>!ids.has(e.from)&&!ids.has(e.to));clearSelection();render();status("Selected items deleted.")
}
function duplicateSelected(){
 if(!selected.size)return;commit();const ids=[...selected],map=new Map(),copies=[];
 ids.forEach(id=>{const n=getItem(id),c=JSON.parse(JSON.stringify(n));c.id=uid();c.x+=30;c.y+=30;map.set(id,c.id);model.items.push(c);copies.push(c)});
 model.edges.filter(e=>e.from&&e.to&&ids.includes(e.from)&&ids.includes(e.to)).forEach(e=>model.edges.push({...JSON.parse(JSON.stringify(e)),id:uid(),from:map.get(e.from),to:map.get(e.to)}));
 selected.clear();copies.forEach(n=>selected.add(n.id));selectedEdge=null;render();status("Duplicated.")
}
$("deleteSelected").onclick=deleteSelected;$("duplicateSelected").onclick=duplicateSelected;
$("undoBtn").onclick=undo;$("redoBtn").onclick=redo;
document.addEventListener("keydown",ev=>{
 if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==="z"){ev.preventDefault();undo()}
 else if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==="y"){ev.preventDefault();redo()}
 else if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==="d"){ev.preventDefault();duplicateSelected()}
 else if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==="a"){ev.preventDefault();selected.clear();selectedEdge=null;model.items.forEach(n=>selected.add(n.id));render()}
 else if(ev.key==="Delete"||ev.key==="Backspace"){if(document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="TEXTAREA")return;ev.preventDefault();deleteSelected()}
});

/* ---------- templates ---------- */
function loadTemplate(type){
 commit();model={version:4,name:type==="aiops"?"AIOps Control Center":type==="aks"?"AKS Application Platform":"Azure Landing Zone",items:[],edges:[]};
 const add=(t,x,y,label)=>addItem("node",x,y,{type:t,label});
 const a=[];
 if(type==="aiops")a.push(add("monitoring",40,180,"Monitoring Sources"),add("monitoring",260,70,"Azure Monitor"),add("servicenow",260,300,"ServiceNow"),add("agent",510,180,"AIOps Control Center"),add("database",780,70,"Incident Store"),add("aks",780,300,"AKS Agents"));
 if(type==="aks")a.push(add("user",40,190,"Users"),add("gateway",250,190,"Application Gateway"),add("aks",470,190,"AKS Cluster"),add("app",720,80,"Orders API"),add("sql",720,320,"PostgreSQL"),add("monitoring",470,430,"Azure Monitor"));
 if(type==="landing")a.push(add("identity",50,120,"Entra ID"),add("firewall",280,120,"Azure Firewall"),add("app",520,120,"Shared Services"),add("storage",780,120,"Storage Account"),add("logs",520,350,"Log Analytics"));
 for(let i=0;i<a.length-1;i++)model.edges.push({id:uid(),from:a[i].id,to:a[i+1].id,fromPort:"right",toPort:"left",type:"straight",style:"solid",width:2,color:"#52627a",startMarker:"none",endMarker:"arrow",label:""});
 clearSelection();render();status("Template loaded.")
}
document.querySelectorAll("[data-template]").forEach(b=>b.addEventListener("click",()=>loadTemplate(b.dataset.template)));

/* ---------- zoom ---------- */
function updateZoom(){inner.style.transform=`scale(${zoom})`;$("zoomLevel").textContent=Math.round(zoom*100)+"%"}
function setZoom(v){zoom=Math.max(.25,Math.min(2.5,v));updateZoom()}
$("zoomIn").onclick=()=>setZoom(zoom+.1);$("zoomOut").onclick=()=>setZoom(zoom-.1);$("zoomReset").onclick=()=>setZoom(1);
$("fitView").onclick=()=>{
 const vis=model.items.filter(n=>["node","shape","image","sticky","comment","text","pin"].includes(n.kind));if(!vis.length)return;
 const minX=Math.min(...vis.map(n=>n.x)),minY=Math.min(...vis.map(n=>n.y)),maxX=Math.max(...vis.map(n=>n.x+n.width)),maxY=Math.max(...vis.map(n=>n.y+n.height));
 const sx=(canvas.clientWidth-80)/(maxX-minX+80),sy=(canvas.clientHeight-80)/(maxY-minY+80);setZoom(Math.max(.25,Math.min(1.5,Math.min(sx,sy))));canvas.scrollLeft=Math.max(0,minX*zoom-30);canvas.scrollTop=Math.max(0,minY*zoom-30)
};

/* ---------- persistence / exports ---------- */
function download(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$("diagramName").addEventListener("input",e=>model.name=e.target.value);
$("newDiagram").onclick=()=>{if(confirm("Start a new blank diagram?")){commit();model={version:4,name:"Untitled architecture",items:[],edges:[]};clearSelection();render();status("New diagram created.")}};
$("saveDiagram").onclick=()=>download(new Blob([JSON.stringify(model,null,2)],{type:"application/json"}),`${(model.name||"architecture").replace(/[^\w-]+/g,"-")}.arch`);
$("loadDiagram").onclick=()=>{
 const i=document.createElement("input");i.type="file";i.accept=".arch,.json,application/json";i.onchange=async()=>{
   const f=i.files?.[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!x.items||!x.edges)throw Error("Invalid architecture file");commit();model=x;clearSelection();render();status("Architecture loaded.")}catch(err){status("Load failed: "+err.message)}
 };i.click()
};
$("exportJson").onclick=()=>download(new Blob([JSON.stringify(model,null,2)],{type:"application/json"}),"architecture.json");
$("importJson").addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!x.items||!x.edges)throw Error("Invalid JSON");commit();model=x;clearSelection();render();status("JSON imported.")}catch(err){status("Import failed: "+err.message)}e.target.value=""});

function exportSvgString(){
 const parts=[`<svg xmlns="http://www.w3.org/2000/svg" width="3200" height="2200" viewBox="0 0 3200 2200">`,`<rect width="100%" height="100%" fill="#eef3fa"/>`];
 model.edges.forEach(e=>{const d=edgePath(e);if(!d)return;parts.push(`<path d="${d}" fill="none" stroke="${e.color||"#52627a"}" stroke-width="${e.width||2}" ${e.style==="dashed"?'stroke-dasharray="8 5"':e.style==="dotted"?'stroke-dasharray="2 5"':""}/>`);});
 model.items.forEach(n=>{
   if(n.kind==="image")parts.push(`<rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="8" fill="#fff" stroke="${n.stroke||"#64748b"}"/>`);
   else if(n.kind==="shape")parts.push(`<rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="${n.shape==="ellipse"?n.height/2:10}" fill="${n.fill||"#fff"}" stroke="${n.stroke||"#64748b"}"/>`);
   else if(n.kind==="node")parts.push(`<rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="8" fill="${n.fill||"#fff"}" stroke="${n.stroke||"#64748b"}"/><text x="${n.x+10}" y="${n.y+35}" font-family="Arial" font-size="16" font-weight="700">${esc(n.label)}</text>`);
   else if(n.kind==="text")parts.push(`<text x="${n.x}" y="${n.y+24}" font-family="Arial" font-size="16">${esc(n.text)}</text>`);
 });
 return parts.join("")+"</svg>"
}
$("exportSvg").onclick=()=>download(new Blob([exportSvgString()],{type:"image/svg+xml"}),"architecture.svg");
$("exportPng").onclick=()=>{
 const svg=exportSvgString(),img=new Image();
 img.onload=()=>{const c=document.createElement("canvas");c.width=3200;c.height=2200;const ctx=c.getContext("2d");ctx.drawImage(img,0,0);c.toBlob(b=>download(b,"architecture.png"),"image/png")};
 img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)
};

/* ---------- init ---------- */
renderPalette();
render();
status("Ready. Drag or click components. Use Connect for real node-to-node arrows.");
})();
