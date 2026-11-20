# Aviral: Frontend, AI playbook

You own `frontend/`: the form, map, charts, alert banner, admin view and the Vercel deployment.

## Where AI helps you
| Task | Let AI do | You must do |
|---|---|---|
| Components and styling | Generate React components from a description or sketch | Run it in the browser and look at it |
| Leaflet / Recharts glue | Draft map layers, popups, chart config | Check colours, labels and mobile layout |
| API integration | Write fetch hooks from the contract | Test loading, error and empty states |
| Accessibility | Audit for contrast, labels, keyboard use | Fix and re-test with the keyboard only |
| Deployment | Draft Vercel settings and env checklist | Set `VITE_API_URL` yourself |

## Prompt cards
**1. Scaffold**
> Read `frontend/README.md`, `docs/api-contract.md` and `.env.example`. Create the Vite React app, install leaflet,
> react-leaflet and recharts, and build a page that calls `/health` using `import.meta.env.VITE_API_URL` and shows the result.

**2. Prediction form**
> Build a form for `POST /predict` using the fields in the contract. Validate ranges on the client, mark optional fields
> as optional, show the probability, a colour badge AND the text level, the `inputs_used` list and the disclaimer. Handle
> loading, network error and 422 responses with readable messages.

**3. Risk map**
> Using `/risk-map`, render a Leaflet map centred on India with a circle marker per district coloured by level
> (green/yellow/orange/red), a legend with text labels, and a popup showing name, probability and level. Use a colour-blind-safe
> variant and never rely on colour alone.

**4. Mock first**
> The backend endpoint `/trend` does not exist yet. Create a small mock (a local JSON file and a fetch wrapper that switches on
> `VITE_USE_MOCK=true`) that follows the draft shape in `docs/api-contract.md`, so I can build the chart now.

**5. Accessibility pass**
> Review `frontend/src` for keyboard access, labels for inputs, contrast of the four risk colours on white, and focus
> order. Give me a prioritised fix list with exact files.

## Verify before you trust
- You opened it in the browser at phone width and desktop width. Screenshots go in the PR.
- Disclaimer visible on every result screen. Text label next to every colour.
- No hard-coded API URL or key. `npm run lint` and `npm run build` pass.
- When the API changes, the contract changes first.

## Design help
Ask AI for three layout options as plain HTML/CSS you can compare, pick one, then iterate. Keep a screenshot of each decision in `docs/`.
