---
description: Review the current branch against main using the team checklist
---
Use the qa-reviewer subagent to review `git diff main...HEAD`. Follow the checklist in the agent definition and in
.github/pull_request_template.md. Return Blocking / Should fix / Nice to have with file and line, and list the checks you ran.
