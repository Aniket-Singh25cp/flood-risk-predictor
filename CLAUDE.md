@AGENTS.md

## Claude Code specifics
- Project subagents live in `.claude/agents/` (ml-engineer, backend-engineer, frontend-engineer, qa-reviewer).
  Use the one that matches the folder you are working in.
- Project slash commands live in `.claude/commands/`: `/new-feature`, `/review-pr`, `/write-tests`.
- Prefer plan mode for anything touching more than two files.
