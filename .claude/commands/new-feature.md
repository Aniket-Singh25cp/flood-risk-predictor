---
description: Plan and implement one backlog issue on its own branch
argument-hint: <issue number or short description>
---
Task: $ARGUMENTS

1. Read AGENTS.md and docs/api-contract.md. If an issue number was given, read it with `gh issue view`.
2. Restate the goal and acceptance criteria in three lines. List the files you expect to change and which folder owner is affected.
3. Propose a short plan and wait for my approval before editing.
4. After approval: create branch `feature/<area>-<short-name>`, implement in small steps, add or update tests.
5. Run the checks (`pytest`, `ruff check .`, `ruff format --check .`, and frontend lint/build if relevant).
6. Summarise what changed, what you verified, and what you did not. Do not push or open the PR; I will do it.
