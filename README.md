## Test Coverage

### Overview

We use comprehensive test coverage to ensure code quality and reliability. Our current test suite provides robust validation across different metrics.

### Coverage Targets

While test coverage can vary by project, we aim for high-quality test coverage:

- **Statements**: 80% or higher
- **Branches**: 80% or higher
- **Functions**: 90% or higher
- **Lines**: 80% or higher

### Current Coverage Results

| Metric     | Coverage | Status            |
| ---------- | -------- | ----------------- |
| Statements | 90.44%   | ✅ Exceeds Target |
| Branches   | 81.25%   | ✅ Meets Target   |
| Functions  | 92.59%   | ✅ Exceeds Target |
| Lines      | 89.75%   | ✅ Meets Target   |

### Ongoing Improvement

While overall coverage is strong, we've identified an opportunity for enhancement in the Blackjack.tsx component:

| Metric     | Coverage |
| ---------- | -------- |
| Statements | 85.08%   |
| Branches   | 70.96%   |
| Functions  | 86.66%   |
| Lines      | 84.68%   |

### Recommended Test Additions:

Implement tests for game state transitions (lines 128, 137-140)
Add scenarios for dealer play mechanics (lines 149, 151, 155)
Extend test coverage for end game states (lines 218-225)

### Future Goals

We are committed to maintaining and improving our test coverage to ensure code quality, reduce bugs, and enhance overall software reliability.

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
