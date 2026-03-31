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
This file provides guidance for AI assistants (Claude Code and others) working in this repository.

## Repository Overview

**solid-waddle** is a newly initialized repository with minimal content. As of the last update, the repo contains only a `README.md`. This file will be updated as the project evolves.

## Current State

- Single branch history (`main`) with one initial commit
- No source code, build system, tests, or dependencies yet
- `README.md` contains only a placeholder description

## Git Workflow

- Default branch: `main`
- Feature branches should follow the pattern: `<type>/<short-description>` (e.g., `feat/add-auth`, `fix/login-bug`)
- Commit messages should be concise and in the imperative mood (e.g., "Add user authentication", not "Added user authentication")
- Never force-push to `main`
- Always develop on feature branches and merge via pull request

## Development Conventions (to be updated as the project grows)

Since the project is in its earliest stage, the following are baseline conventions to adopt when adding code:

### Code Style
- Adopt a single linter/formatter appropriate to the language chosen (e.g., ESLint + Prettier for JS/TS, Black + Ruff for Python)
- Formatting configuration should live in a config file at the root (`.eslintrc`, `pyproject.toml`, etc.)
- Consistent indentation: 2 spaces for JS/TS/JSON/YAML, 4 spaces for Python

### File Structure
- Source code should go in `src/` or a language-appropriate equivalent
- Tests should live alongside source files or in a top-level `tests/` directory
- Configuration files belong at the root

### Testing
- Write tests for all non-trivial logic
- Tests must pass before merging any PR
- Use the testing framework standard for the language (e.g., Jest, pytest, Go test)

### Environment Variables
- Never commit secrets or credentials
- Use a `.env.example` file to document required environment variables
- Add `.env` to `.gitignore`

## Working with This Repo

When the project gains more structure (language, framework, dependencies), update this file with:

1. Build commands (how to install dependencies, build, run)
2. Test commands (how to run the test suite)
3. Linting/formatting commands
4. Any environment setup requirements
5. Architecture overview and key module descriptions
6. Deployment or CI/CD notes

## Notes for AI Assistants

- Read this file at the start of any session to orient yourself
- Do not create files speculatively — only add what is needed for the current task
- Do not add comments, docstrings, or type annotations to code you didn't change
- Prefer editing existing files over creating new ones
- Keep changes minimal and focused on the stated task
- When in doubt about project direction, ask before proceeding
