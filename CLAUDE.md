# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Project Overview

**solid-waddle** is a newly initialized repository with no project code yet. The purpose and tech stack have not been defined. This file will need to be updated as the project takes shape.

## Current Repository State

- Single tracked file: `README.md` (placeholder)
- No source code, dependencies, tests, or configuration
- No build system, CI/CD, or linting setup

## Development Branch

Active development should happen on the `claude/add-claude-documentation-v8uqF` branch or as directed per task. Never push directly to `master`/`main` without explicit permission.

## Git Workflow

```bash
# Create and switch to a feature branch
git checkout -b <branch-name>

# Stage specific files (avoid git add -A or git add . to prevent accidental inclusion of secrets)
git add <file>

# Commit with a descriptive message
git commit -m "Description of what and why"

# Push and set upstream
git push -u origin <branch-name>
```

## Conventions to Follow (Once Project is Defined)

Until the project stack is established, follow these general defaults:

- **Commits**: Use short imperative subject lines (under 72 chars). Explain *why* in the body if non-obvious.
- **Files**: Do not create files unless necessary. Prefer editing existing files.
- **Comments**: Only add comments where logic is non-obvious.
- **Security**: Never commit secrets, credentials, or `.env` files with real values.
- **Scope**: Do not add features, refactor, or improve code beyond what was explicitly requested.

## Updating This File

When the project stack and structure are established, update this file to include:

- Language and framework versions
- How to install dependencies
- How to build the project
- How to run tests (`npm test`, `pytest`, `cargo test`, etc.)
- How to run the linter/formatter
- Key architectural decisions and patterns
- Directory structure explanation
