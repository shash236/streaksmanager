# Deployment Guide for StreaksManager

 This guide explains how to deploy the StreaksManager backend to an AWS EC2 instance using Docker and GHCR.

 ## Prerequisites

 1.  **AWS EC2 Instance**: You should have an EC2 instance running (Amazon Linux 2023 or Ubuntu).
 2.  **Supabase Database**: You should have your Connection string, Username, and Password ready.
 3.  **GitHub Personal Access Token (PAT)**: You need a PAT to authenticate with GHCR on the EC2 instance.

 ## Step 1: Generate a GitHub Personal Access Token (PAT)

 1.  Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic).
 2.  Generate a new token.
 3.  Select the `read:packages` scope.
 4.  Copy the token.

 ## Step 2: Configure EC2 Instance

 Connect to your EC2 instance via SSH.

 ### Install Docker

 **For Amazon Linux 2023:**
 ```bash
 sudo yum update -y
 sudo yum install -y docker
 sudo service docker start
 sudo usermod -a -G docker ec2-user
 ```
 *Log out and log back in for the group change to take effect.*

 **For Ubuntu:**
 ```bash
 sudo apt-get update
 sudo apt-get install -y docker.io
 sudo usermod -aG docker $USER
 ```
 *Log out and log back in.*

 ### Install Docker Compose (if not included)
 Docker Compose is often included as `docker compose` plugin now. Check with `docker compose version`.
 If not found:
 ```bash
 mkdir -p ~/.docker/cli-plugins/
 curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
 chmod +x ~/.docker/cli-plugins/docker-compose
 ```

 ## Step 3: Deploy the Application

 1.  **Log in to GHCR**:
     ```bash
     echo <YOUR_PAT> | docker login ghcr.io -u <YOUR_GITHUB_USERNAME> --password-stdin
     ```

 2.  **Create a directory for the app**:
     ```bash
     mkdir streaksmanager
     cd streaksmanager
     ```

 3.  **Copy the `docker-compose.yml`**:
     You can create the file on the server and paste the content from `deploy/docker-compose.yml` in this repository.
     ```bash
     nano docker-compose.yml
     # Paste content here
     ```
     *Note: Ensure the image name in `docker-compose.yml` matches your repository.*

 4.  **Create a `.env` file**:
     ```bash
     nano .env
     ```
     Add the following content (replace with your actual values):
     ```env
     GITHUB_REPOSITORY_OWNER=shash236
     DB_URL=jdbc:postgresql://<SUPABASE_HOST>:5432/postgres?sslmode=require
     DB_USERNAME=postgres
     DB_PASSWORD=<YOUR_DB_PASSWORD>
     CORS_ALLOWED_ORIGINS=*
     ```
     *Note: Supabase usually requires `sslmode=require`. The default database name is often `postgres`.*

 5.  **Start the application**:
     ```bash
     docker compose up -d
     ```

 6.  **Verify**:
     ```bash
     docker compose logs -f
     ```

 ## Updates

 To deploy a new version (after pushing code to main):
 1.  SSH into EC2.
 2.  Go to the directory.
 3.  Run:
     ```bash
     docker compose pull
     docker compose up -d
     ```
