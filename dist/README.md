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

```bash
bmad install bmad-presentation-suite
```

During installation you'll be asked:

| Prompt | Default | Description |
|--------|---------|-------------|
| Enable presentation hook? | Yes | After any BMAD workflow, Caravaggio offers to turn the output into a presentation |

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
