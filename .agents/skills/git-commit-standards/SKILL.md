---
name: git-commit-standards
description: Enforce commitlint conventions: <type>(<scope>): <subject>, non-empty scope, 100 char header limit, and conventional commit types. Use when drafting commit messages, creating git commits, or reviewing commit history.
---

# Git & Commit Standards

When generating commit messages or committing changes for this project, strictly adhere to the following `commitlint` conventions:

## 1. Commit Message Format
```text
<type>(<scope>): <subject>
```

## 2. Required Scope
A scope **MUST** always be provided (the `scope-empty` rule is set to `never`).

**Valid Scopes for this Project:**
- **Services / Modules**: `auth`, `core`, `gateway`, `user`, `student`, `faculty`, `admin`, `semester`, `course`
- **Global / Infrastructure**: `deps`, `config`, `scripts`, `monorepo`, `docker`, `ci`

## 3. Header Length Limit
The header (the first line of the commit) **MUST NOT** exceed 100 characters. Keep it concise, lowercase subject, no trailing period.

## 4. Body for Details
If a commit requires more explanation, put it in the commit body (using `-m "header" -m "body"` or a new line) rather than cramming it into the header.

## 5. Types
Use standard conventional commit types:
- `feat`: A new feature or endpoint
- `fix`: A bug fix or error correction
- `chore`: Maintenance tasks, config updates, script additions
- `refactor`: Code refactoring without changing behavior
- `docs`: Documentation updates
- `style`: Code style, formatting, linting
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `build`: Build system or external dependencies
- `ci`: CI/CD workflows and pipelines
- `revert`: Reverting a previous commit
