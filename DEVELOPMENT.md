# Development Guide — bmad-presentation-suite

How to add new workflows, test locally, and publish new versions.

---

## Planned Workflows (from Product Brief & PRD)

These were defined during the product brief and are ready to be built:

| Command | Workflow ID | Description | Target Version |
|---------|-------------|-------------|----------------|
| `[EX]` | `gv-explainer` | YouTube/video explainer layout with visual script and engagement hooks | v1.1 |
| `[CT]` | `gv-conference-talk` | Conference talk or workshop presentation with speaker notes | v1.1 |
| `[PD]` | `gv-pitch-deck` | Investor pitch with data visualization and narrative arc | v2.0 |
| `[IN]` | `gv-infographic` | Creative information visualization / single-page visual summary | v2.0 |
| `[VM]` | `gv-visual-metaphor` | Conceptual illustrations (journey maps, process diagrams, Rube Goldberg machines) | v2.x |
| `[CV]` | `gv-concept-visual` | Single expressive image that explains an idea creatively | v2.x |
| `[DC]` | `gv-delivery-coach` | Presentation delivery coaching — pacing, filler words, slide transitions | v1.1 |

These are already stubbed as `workflow="todo"` in Caravaggio's menu (`dist/agents/presentation-master.md`). Each one just needs a workflow built and the menu item updated to point to it.

---

## Starting a New Release Branch

### 1. Make sure your local repo is up to date

```bash
cd "E:\Documents\OneDrive\AIProjects\bmad-presentation-suite"
git checkout main
git pull
```

### 2. Create a new branch for the release

Use the version number you're targeting:

```bash
git checkout -b release/v1.1
```

All development for that release happens on this branch. When it's ready, merge back to `main` and tag.

---

## Adding a New Workflow

### Step 1 — Create the workflow folder in `dist/workflows/`

```
dist/workflows/{gv-workflow-name}/
├── workflow.yaml
└── instructions.md
```

Use `dist/workflows/gv-brand-profile/` as a reference — it's the simplest existing workflow.

**workflow.yaml minimum structure:**
```yaml
name: "gv-workflow-name"
description: "What this workflow does."
author: "Gerardo"
config_source: "{project-root}/_bmad/cis/config.yaml"
output_folder: "{config_source}:output_folder"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
date: system-generated
installed_path: "{project-root}/_bmad/cis/workflows/gv-workflow-name"
instructions: "{installed_path}/instructions.md"
sidecar_path: "{project-root}/_bmad/_memory/caravaggio-sidecar/brand-profile.md"
default_output_dir: "{output_folder}/presentations"
standalone: true
web_bundle: true
```

**instructions.md minimum structure:**
```
# GV Workflow Name Instructions

<critical>Load workflow.xml from: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>Load config: {project-root}/_bmad/cis/workflows/gv-workflow-name/workflow.yaml</critical>
<critical>You are Caravaggio — stay in character.</critical>

<workflow>
<step n="1" goal="..."> ... </step>
<step n="2" goal="..."> ... </step>
</workflow>
```

### Step 2 — Update Caravaggio's menu in `dist/agents/presentation-master.md`

Find the relevant `workflow="todo"` menu item and replace it with the real path:

```xml
<!-- Before -->
<item cmd="EX or fuzzy match on youtube-explainer" workflow="todo">[EX] ...</item>

<!-- After -->
<item cmd="EX or fuzzy match on youtube-explainer" workflow="_bmad/cis/workflows/gv-explainer/workflow.yaml">[EX] ...</item>
```

### Step 3 — Register in the installer

Open `dist/_module-installer/installer.js` and add the new workflow to the `MANIFEST_ENTRIES` array:

```javascript
const MANIFEST_ENTRIES = [
  '"gv-brand-profile","..."',
  '"gv-roast-my-deck","..."',
  '"gv-explainer","Description here.","cis","_bmad/cis/workflows/gv-explainer/workflow.yaml"', // ← add
];
```

---

## Testing Locally Before Publishing

Copy your new workflow directly into your local BMAD installation to test:

```bash
# Copy new workflow
cp -r dist/workflows/gv-explainer/ "E:/Documents/OneDrive/AIProjects/_bmad/cis/workflows/gv-explainer/"

# Copy updated Caravaggio agent
cp dist/agents/presentation-master.md "E:/Documents/OneDrive/AIProjects/_bmad/cis/agents/presentation-master.md"
```

Then invoke Caravaggio in any BMAD project and test the new command. Once satisfied, proceed to publish.

---

## Publishing a New Version

### 1. Bump the version in `dist/package.json`

Follow semantic versioning:

| Change | Example bump |
|--------|-------------|
| New workflow (backwards compatible) | `1.0.0` → `1.1.0` |
| Breaking change to existing workflow | `1.0.0` → `2.0.0` |
| Bug fix only | `1.0.0` → `1.0.1` |

```json
{
  "version": "1.1.0"
}
```

### 2. Commit, merge to main, and tag

```bash
git add -A
git commit -m "feat: add gv-explainer workflow (v1.1.0)"
git checkout main
git merge release/v1.1
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main
git push origin v1.1.0
```

### 3. Create a GitHub release

```bash
gh release create v1.1.0 --title "v1.1.0" --notes "Added gv-explainer workflow."
```

### 4. Publish to npm

Generate a new granular access token on npmjs.com (Read and write, Bypass 2FA), then:

```bash
cd dist/
npm config set //registry.npmjs.org/:_authToken=<your-token>
npm publish --access public
npm config delete //registry.npmjs.org/:_authToken
```

Revoke the token on npmjs.com immediately after.

---

## Project Structure Reference

```
bmad-presentation-suite/
├── DEVELOPMENT.md          ← this file
├── .gitattributes
└── dist/                   ← npm distributable (everything published to npm)
    ├── package.json
    ├── module.yaml
    ├── README.md
    ├── .npmignore
    ├── agents/
    │   └── presentation-master.md    ← Caravaggio (update when adding menu items)
    ├── workflows/
    │   ├── gv-brand-profile/         ← v1.0
    │   ├── gv-roast-my-deck/         ← v1.0
    │   └── {gv-new-workflow}/        ← add new ones here
    └── _module-installer/
        └── installer.js              ← update MANIFEST_ENTRIES for new workflows
```
