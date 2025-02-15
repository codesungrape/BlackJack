## CI/CD Workflows

This project uses GitHub Actions for automation. Here are our workflow configurations:

### CI Pipeline (`ci.yml`)

- Runs on all PRs and pushes to main
- Performs:
  - Linting
  - Type checking
  - Unit tests with coverage reports
  - Build verification

### Deployment (`deploy.yml`)

- Automatically deploys to Vercel
- Triggers on merges to main branch
- Requires successful CI checks before deployment

### Docker (`docker.yml`)

- Handles Docker image builds
- Includes containerization pipeline
- Manages container registry updates

### View Workflow Status

You can view workflow runs in the [Actions tab](../../actions) of this repository.

## Docker

### Prerequisites

- Docker installed on your machine
- Docker Compose (if using docker-compose)

### Running with Docker

1. Build the Docker image:

```bash
docker build -t blackjack .
```
