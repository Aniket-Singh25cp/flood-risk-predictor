# Flood Risk Predictor: Team Setup and AI Guide

For Team 71: **Aniket Kumar Singh** (Team Leader, ML), **Kshitij Tiwari** (Backend, Deployment), **Aviral Bajpai** (Frontend), **Anmol Jaiswal** (Data, QA, Docs).
Build starts **17 Nov 2026** (BW1 day 1). Tell the mentor your real final deadline and cut the backlog to fit (see Part G).

How to use this guide:
- **Aniket:** do Part A once (about 40 minutes), then Part B like everyone else.
- **Everyone:** do Part B (about 45 minutes), read Parts C and E, then open your own playbook in Part F.

---

## Part A. GitHub setup (Aniket, once)

### A1. Accounts
1. All four members need a GitHub account with two-factor authentication on (Settings, Password and authentication). Share your usernames in the team chat.
2. Optional but worth doing today: apply for **GitHub Education** as a verified student (https://education.github.com/students). It can unlock free Copilot and other benefits; approval can take days, so apply now.

### A2. Prepare and publish the starter kit
1. Unzip `flood-risk-predictor-starter.zip` to a folder, for example `C:\Projects\flood-risk-predictor`.
2. Open `.github/CODEOWNERS` and replace the four `*-GITHUB-USERNAME` placeholders with real usernames (keep the `@`).
3. Do Part B steps B1 to B5 on your PC first, then in the folder run the setup script. It installs everything, **auto-formats the code** and runs the tests. Fix anything it reports. (The starter kit was written without internet access, so this first run is the real test.)
4. Create the repository and push. Easiest with GitHub CLI:
   ```
   git init -b main
   git add .
   git commit -m "chore: starter kit"
   gh repo create flood-risk-predictor --private --source=. --push
   ```
   Or on github.com: New repository, name `flood-risk-predictor`, no README/licence/gitignore, then
   ```
   git remote add origin https://github.com/<your-username>/flood-risk-predictor.git
   git push -u origin main
   ```
5. **Private or public?** Branch protection (A4) on a *private* repo needs a paid GitHub plan on personal accounts, and public repos get it free. If Settings, Branches shows an upgrade banner, either use GitHub Education benefits (if they include a plan that supports it) or make the repo public. Public is safe here only because the repo never contains keys, datasets or the model file. Ask your mentor about the university's rules on public project repos and plagiarism checks.

### A3. Invite the team
Settings, Collaborators, Add people: add Kshitij, Aviral and Anmol with the **Write** role. Each person accepts the email invitation. (A free GitHub Organization such as `flood-risk-team` also works and is tidier if you plan more projects.)

### A4. Protect `main`
Settings, Branches (or Rules, Rulesets), add a rule for `main`:
- Require a pull request before merging, **1 approval**
- Require status checks to pass: select `Python (lint + tests)`, `Frontend (lint + build)` and `No obvious secrets committed` (they appear in the list after the first CI run on a PR or push)
- Block force pushes and deletion
- Optional: require review from Code Owners

Settings, General, Pull Requests: allow **squash merging** only, and turn on **Automatically delete head branches**.
Settings, Actions: make sure workflows are allowed to run.

### A5. Issues, milestones and board
After everyone accepted the invite:
```
gh auth login
# edit the four usernames at the top of scripts/create_issues.sh, then
bash scripts/create_issues.sh
```
This creates labels, milestones BW1 to BW6 and 26 issues, each assigned to its owner with acceptance criteria. The same list is in `docs/backlog.md`.
Then Projects, New project, Board; add all issues; use the columns Todo, In progress, In review, Done.

### A6. Secrets policy (tell everyone)
Keys live in each person's local `.env` and in the hosting dashboards (Render/Railway, Vercel), **never** in git, chat, screenshots or AI prompts. If a key leaks: revoke it at the provider, create a new one, and tell the team. CI also scans for key-like strings.

---

## Part B. Set up every member's PC (each of you)

**Windows (commands use PowerShell):**

| Step | What | How |
|---|---|---|
| B1 | Git | `winget install Git.Git` (or https://git-scm.com/download/win) |
| B2 | VS Code | `winget install Microsoft.VisualStudioCode` |
| B3 | Python 3.12 | `winget install Python.Python.3.12` (3.11 or 3.12 recommended; some ML packages lag on the very newest Python) |
| B4 | Node.js LTS | `winget install OpenJS.NodeJS.LTS` (Node 22 or newer) |
| B5 | GitHub CLI | `winget install GitHub.cli`, then `gh auth login` (choose GitHub.com, HTTPS, login with browser) |

Close and reopen the terminal after installing, then check: `git --version`, `py --version`, `node --version`, `npm --version`, `gh --version`.
If `winget` is missing, install the same tools from their websites.

**macOS:** install Homebrew, then `brew install git python@3.12 node gh` and `brew install --cask visual-studio-code`.

### B6. Tell Git who you are (once)
```
git config --global user.name "Your Name"
git config --global user.email "the-email-on-your-github-account"
git config --global init.defaultBranch main
git config --global pull.rebase true
```

### B7. Clone and run the setup script
```
cd C:\Projects          # any folder you like
git clone https://github.com/<owner>/flood-risk-predictor.git
cd flood-risk-predictor
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1     # macOS/Linux/Git Bash: bash scripts/setup.sh
```
The script creates the virtual environment `.venv`, installs backend and ML packages, copies `.env.example` to `.env`, installs the frontend if it exists, and runs the tests.

### B8. VS Code
`code .`, accept "install recommended extensions", then Ctrl+Shift+P, "Python: Select Interpreter", choose `.venv`.
Open a terminal in VS Code and activate the environment each session: `.\.venv\Scripts\Activate.ps1` (macOS/Linux: `source .venv/bin/activate`).

### B9. Check it works
```
uvicorn backend.app.main:app --reload
```
Open http://localhost:8000/docs, expand `POST /predict`, click "Try it out" with the example, and see a probability and level. Stop with Ctrl+C.
Aviral: when the frontend exists, `cd frontend; npm run dev` and open http://localhost:5173.

### Common problems
| Symptom | Fix |
|---|---|
| `running scripts is disabled` | Run PowerShell commands with `-ExecutionPolicy Bypass` as shown, or `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once |
| `py` or `python` not found | Reopen the terminal; reinstall Python and tick "Add to PATH" |
| `pip` SSL or timeout errors on college Wi-Fi | Use a phone hotspot for the first install |
| `xgboost` or a package fails to install | Use Python 3.12, not the newest release |
| `port 8000 is in use` | `uvicorn ... --port 8001` and set `VITE_API_URL` to match |
| `fatal: Authentication failed` | `gh auth login` again; make sure you accepted the repo invitation |
| `ruff format` changes files you did not touch | Pull the latest `main`; run `ruff format .` once and commit |

---

## Part C. Daily workflow (everyone)

```
git switch main
git pull
git switch -c feature/backend-districts-endpoint     # one issue = one branch
# ...work, then test...
pytest ; ruff check . ; ruff format .
git add -p                                           # review what you are staging
git commit -m "feat(backend): add GET /districts"
git push -u origin HEAD
gh pr create --fill                                  # or click the link git prints
```
1. Fill in the PR template honestly, including the **AI use** line, and link the issue with `Closes #12`.
2. A teammate reviews within 24 hours: read **Files changed**, run it if the change is risky (`gh pr checkout 12`), then Approve or Request changes.
3. When CI is green and one person approved: **Squash and merge**, delete the branch.
4. Everybody: `git switch main && git pull` before starting the next task.

**Conflicts:** `git fetch origin && git rebase origin/main`, fix the marked files in VS Code, `git add <file>`, `git rebase --continue`, then `git push --force-with-lease` (only ever on your own branch).
**Undo:** `git restore <file>` (discard edits), `git revert <commit>` (undo a merged change). Never `git push --force` to `main`.
**Commit messages:** `type(area): summary` with type in feat, fix, docs, test, refactor, chore.
**Reviews:** be specific, kind and quick; the goal is shared understanding, not blocking.

---

## Part D. Working in parallel without stepping on each other

1. **Contract first.** `docs/api-contract.md` is the agreement between backend and frontend. Today `/predict` and `/risk-map` already work with mock data, so Aviral can build the form and the map while Kshitij builds the real database and Aniket trains models.
2. **Folder ownership.** Stay in your folder (`CODEOWNERS` asks the owner to review changes there). Need something from another area? Open or comment on that person's issue.
3. **Plug-in order.** Dataset and EDA (Anmol) feed features and models (Aniket); the saved model artifact (`ml/models/model.joblib`, shared by link, not committed) is loaded by the backend (Kshitij); the frontend (Aviral) only ever talks to the API.
4. **Demos.** Demo A at the end of BW3 (form and map working on mock plus baseline model), demo B at the end of BW5 (feature complete, deployed). Mentor sees both.
5. **Merge order when several PRs are open:** contract changes, backend, frontend, ML artifact updates.

---

## Part E. Using AI tools well (whole team)

### E1. What you can use
The repo is built to work with **any** assistant: `AGENTS.md` holds the project rules, and thin files point each tool to it.

| Tool | Cost and access | Good for | Repo file it reads |
|---|---|---|---|
| **Claude (claude.ai, chat)** | Free plan works for chat. The free plan does **not** include Claude Code. | Explaining, planning, reviewing pasted code, drafting docs | none; paste `AGENTS.md` at the start of a chat |
| **GitHub Copilot in VS Code** | Free for verified students via GitHub Education (apply in A1); a limited free tier also exists, check current limits | Inline completion, chat, agent mode that edits files in your workspace | `.github/copilot-instructions.md` (and `AGENTS.md`) |
| **Gemini CLI** | Free with a personal Google account; at the time of writing 1,000 requests per day and 60 per minute, check current limits and the data-use terms | Terminal agent that reads and edits the repo | `GEMINI.md` |
| **Claude Code** | Needs a paid Claude plan (Pro, Max, Team, Enterprise) or a Console account | Terminal/VS Code agent with project subagents and commands (included in `.claude/`) | `CLAUDE.md`, `.claude/agents`, `.claude/commands` |

You do not all need the same tool. One working setup per person is enough.

**Quick setup**
- Copilot: install the GitHub Copilot and Copilot Chat extensions (already recommended in `.vscode/extensions.json`), sign in with GitHub, open Chat, switch to **Agent** mode.
- Gemini CLI: `npm install -g @google/gemini-cli`, run `gemini` in the repo folder, choose "Login with Google". Type `Read AGENTS.md` to start.
- Claude Code (if you have a paid plan): Windows PowerShell `irm https://claude.ai/install.ps1 | iex`; macOS/Linux `curl -fsSL https://claude.ai/install.sh | bash`; then `claude` in the repo folder and log in in the browser. Check with `claude doctor`. Use `/agents` to see the four subagents and `/new-feature 12` to start an issue.

### E2. The loop for every task (works with any tool)
1. **Pick one issue** and a fresh branch.
2. **Give context, then the task.** "Read AGENTS.md, docs/api-contract.md and `backend/app/main.py`. Task: ... Acceptance criteria: ... Constraints: stay in `backend/`, no new dependencies."
3. **Ask for a plan first**, correct it, then let it implement in small steps.
4. **Tests are the guardrail.** Ask for tests first or alongside; run them yourself.
5. **Read the diff** (`git diff`) before staging. If you cannot explain a line, ask the AI to explain it or delete it.
6. **Commit often** so any bad step can be undone. Never let an agent push to `main`.
7. **Use a second, fresh session as reviewer.** Paste only the diff and the checklist from `.github/pull_request_template.md`, so the reviewer is not grading its own work. A human still approves the PR.
8. Say in the PR what AI did.

### E3. Guardrails
- **Never paste secrets, `.env` contents, tokens, or licensed datasets** into an AI tool.
- **AI does not supply facts.** Metrics, dataset statistics, citations and links must come from code you ran or pages you opened. "The model reaches 95% recall" is only valid if your run says so.
- **Check your university and mentor rules on AI use** and follow them (disclosure, allowed tasks). Everyone must be able to explain every line they submit; viva questions are normal.
- Keep prompts focused and small; long vague prompts produce long vague code.
- Do not let AI weaken tests, silence lint errors or add dependencies without asking the team.
- The product must always say it is decision support, not an official warning.

### E4. Prompt shape that works
**Context** (files to read) + **Task** (one thing) + **Acceptance criteria** (GIVEN/WHEN/THEN) + **Constraints** (folder, libraries, no secrets) + **Output** (plan first, then diff, then how you tested it).

---

## Part F. Your role and your AI playbook

Open your file in `docs/ai/` for the prompt cards and checklists.

| Member | Owns | Playbook | First AI task (BW1) |
|---|---|---|---|
| Aniket | `ml/`, thresholds, integration, final report, team coordination | `docs/ai/aniket-ml-lead.md` | Leakage audit of `ml/src/train.py`, then the baseline on real data |
| Kshitij | `backend/`, database, weather client, alerts, deployment | `docs/ai/kshitij-backend.md` | Database models for District, WeatherObs, Prediction, test first |
| Aviral | `frontend/`, map, charts, accessibility, Vercel | `docs/ai/aviral-frontend.md` | Scaffold the Vite app and call `/health`, then the prediction form |
| Anmol | `data/`, EDA, tests, QA gate, user guide, report support | `docs/ai/anmol-data-qa-docs.md` | Dataset notes and the EDA notebook on the Kaggle data |

Everyone: do the "Verify before you trust" list in your playbook before opening a PR.

---

## Part G. Rhythm, definition of done, and cutting scope

**Rhythm.** Stand-up Monday and Thursday (15 minutes, Aniket runs it). Friday: Anmol re-runs the full tests on `main` and posts the result; Aniket updates the board and sends the mentor a short status. Demo A end of BW3, demo B end of BW5.

**Definition of done for an issue.** Acceptance criteria met; tests added and passing; CI green; contract updated if the API changed; no secrets or data files; one approval; merged by squash; issue closed.

**If the deadline is shorter than six weeks.** Keep all **Must** issues in `docs/backlog.md` and drop **Should** items in this order: trend and history overlay, alert simulation and admin view, weather forecast client. A working form, map, trained model with honest metrics, and a deployed API and site beat a long feature list.

**Where things live.** Rules for AI and people: `AGENTS.md`. API shapes: `docs/api-contract.md`. Work items: `docs/backlog.md` and the GitHub board. Data sources: `data/README.md`. Questions: the team chat first, then an issue.
