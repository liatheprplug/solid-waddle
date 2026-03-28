# CLAUDE.md

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
