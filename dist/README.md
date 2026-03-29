# bmad-presentation-suite

**BMAD Presentation Suite** — message-first deck building and expert presentation critique, powered by Caravaggio.

An extension of the [CIS (Creative Intelligence Suite)](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite) module for the [BMAD Platform](https://github.com/bmad-code-org/bmad).

---

## What This Module Does

Closes the gap between what you mean and what your audience receives. Two core capabilities:

**Build** — Create professional, message-first presentations across 12 deck types. Caravaggio guides you from blank page to slide-by-slide blueprint with visual direction, speaker notes, and multi-format output (PPTX, Markdown, Marp, HTML).

**Critique** — Submit an existing deck and receive honest, structured expert critique: what's working, what's working against you, and why. Then get a rebuilt version restructured around a clear message spine.

Plus a persistent **Brand Studio** — store your brand profile once, apply it automatically to every deck.

---

## Prerequisites

- BMAD platform installed
- **CIS module** (bmad-creative-intelligence-suite) installed as a peer dependency

---

## Installation

> **Note:** This package is currently distributed via GitHub only. npm publishing is planned for a future release.

### Step 1 — Download the package

**Option A — Clone the repository:**
```bash
git clone https://github.com/peelkperg/bmad-presentation-suite.git
```

**Option B — Download the zip:**
Go to https://github.com/peelkperg/bmad-presentation-suite, click **Code → Download ZIP**, and extract it.

The installable files are inside the `dist/` folder.

---

### Step 2 — Copy the workflow and agent files

From the `dist/` folder, copy into your BMAD project:

| Source (`dist/`) | Destination (your project) |
|---|---|
| `agents/presentation-master.md` | `_bmad/cis/agents/presentation-master.md` |
| `workflows/gv-brand-profile/` | `_bmad/cis/workflows/gv-brand-profile/` |
| `workflows/gv-roast-my-deck/` | `_bmad/cis/workflows/gv-roast-my-deck/` |

> The `agents/presentation-master.md` copy **overwrites** the existing CIS file — this is intentional. It adds the `[BP]` and `[RD]` menu commands to Caravaggio.

---

### Step 3 — Create the brand studio sidecar

Create the directory `_bmad/_memory/caravaggio-sidecar/` in your project and add an empty file named `brand-profile.md` inside it with this content:

```markdown
# Caravaggio's Studio — Brand Profile

*This file is empty. Run the [BP] Brand Profile workflow from Caravaggio's menu to set up your studio.*
```

---

### Step 4 — Add the presentation hook flag to CIS config

Open `_bmad/cis/config.yaml` and append:

```yaml
# Presentation Suite — post-workflow offer hook
enable_presentation_hook: true
```

Set to `false` if you do not want the post-workflow presentation offer.

---

### Step 5 — Add the hook behavior to bmad-master

Open `_bmad/_config/agents/core-bmad-master.customize.yaml` and update the `memories` field:

```yaml
memories:
  - |
    PRESENTATION HOOK (post-workflow offer):
    After completing any document-producing workflow — specifically: create-prd, edit-prd,
    create-product-brief, create-architecture, create-epics-and-stories, market-research,
    domain-research, technical-research, brainstorming, design-thinking, innovation-strategy,
    problem-solving, storytelling, retrospective, quick-spec, or generate-project-context —
    silently check {project-root}/_bmad/cis/config.yaml for the field `enable_presentation_hook`.
    If the field is present and set to `true`, append a single non-intrusive offer on a new line
    after the workflow completion summary:
    "🎨 Turn this into a presentation? → Type **[CP]** to launch Caravaggio."
    If the user types CP (or "caravaggio" or "presentation"): activate the presentation-master
    agent by reading {project-root}/_bmad/cis/agents/presentation-master.md.
    Do NOT show this offer for implementation workflows: dev-story, code-review, create-story,
    sprint-planning, sprint-status, correct-course, qa-automate, validate-*, or party-mode.
```

> If `memories` already has entries, append this block after the last existing entry.

---

### Step 6 — Register the workflows in the manifest

Open `_bmad/_config/workflow-manifest.csv` and append these two lines:

```
"gv-brand-profile","Set up or update Caravaggio's brand memory (the studio) for automatic brand consistency across all presentations. Gathers colors, typography, tone, and visual constraints in a short conversational session.","cis","_bmad/cis/workflows/gv-brand-profile/workflow.yaml"
"gv-roast-my-deck","Critique and rebuild an existing presentation around a clear message spine. Caravaggio identifies structural problems, message clarity failures, and visual logic issues — then rebuilds the deck for maximum impact.","cis","_bmad/cis/workflows/gv-roast-my-deck/workflow.yaml"
```

---

### Installation complete

Launch Caravaggio by invoking the `presentation-master` agent. You should see `[BP]` and `[RD]` in the menu.

---

## Agent

### Caravaggio — Visual Communication & Presentation Master 🎨

Named after the Italian Baroque master — known for dramatic use of light, shadow, and emotional intensity. Caravaggio illuminates what matters and lets everything else fall into shadow.

**Menu commands:**

| Command | Description |
|---------|-------------|
| `[SD]` | Create Slide Deck — build a new presentation from scratch or from existing content |
| `[BP]` | Brand Profile — set up or update your studio brand memory |
| `[RD]` | Roast My Deck — critique and rebuild an existing presentation |

---

## Workflows

### `gv-slide-deck` (included in base CIS)
Build professional presentations across 12 types. Multi-format output: PPTX, Markdown, Marp, HTML. Full session persistence — resume where you left off.

### `gv-brand-profile` (this package)
Set up or update Caravaggio's brand memory (the studio). Gathers colors, typography, tone, and visual constraints in a short conversational session. Stored in `_bmad/_memory/caravaggio-sidecar/brand-profile.md` and applied automatically to all future presentations.

### `gv-roast-my-deck` (this package)
Critique and rebuild an existing presentation. Two intake paths: file (PDF/PPTX via MCP) or manual paste. Delivers a structured expert roast with 🔴/🟡/🟢 severity findings, then rebuilds the deck around a clear message spine with per-slide change notes.

---

## Quick Start

### 1. Set up your brand studio (recommended first step)

Invoke Caravaggio and run `[BP] Brand Profile`. 5–7 questions about your brand — done in minutes. Applied automatically to every deck from that point on.

### 2. Build a presentation from a BMAD artifact

After finishing any BMAD workflow (PRD, architecture, research, etc.), type `[CP]` when prompted to launch Caravaggio with your artifact pre-loaded. *(Requires presentation hook enabled during installation.)*

### 3. Roast an existing deck

Invoke Caravaggio, run `[RD] Roast My Deck`, and provide your deck by file path or paste. Receive structured critique + a rebuilt version.

---

## Post-Workflow Presentation Hook

When `enable_presentation_hook: true`, bmad-master appends a single-line offer after any document-producing workflow completes:

```
🎨 Turn this into a presentation? → Type [CP] to launch Caravaggio.
```

Type `[CP]` to activate Caravaggio immediately with the context of what was just built.

To disable: set `enable_presentation_hook: false` in `_bmad/cis/config.yaml`.

---

## Module Structure

```
_bmad/cis/
├── agents/
│   └── presentation-master.md        ← Caravaggio (updated by this package)
├── workflows/
│   ├── gv-slide-deck/                 ← Base CIS
│   ├── gv-brand-profile/              ← This package
│   └── gv-roast-my-deck/              ← This package
└── config.yaml                        ← enable_presentation_hook added here

_bmad/_memory/
└── caravaggio-sidecar/
    └── brand-profile.md               ← Your persistent brand studio
```

---

## Future Roadmap

- `gv-delivery-coach` — presentation delivery coaching
- `gv-pitch-deck` — dedicated investor/pitch deck workflow
- `gv-explainer` — explainer/educational presentation workflow
- `gv-infographic` — visual summary / single-page infographic

---

## License

MIT
