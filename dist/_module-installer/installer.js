const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * Presentation Suite Module Installer
 *
 * Handles post-copy installation tasks that the BMAD file-copy step cannot:
 *   1. Create the Caravaggio sidecar directory + empty brand-profile.md
 *   2. Inject enable_presentation_hook into _bmad/cis/config.yaml
 *   3. Add the presentation hook behavioral memory to bmad-master customize.yaml
 *   4. Register gv-brand-profile and gv-roast-my-deck in workflow-manifest.csv
 *
 * @param {Object}   options
 * @param {string}   options.projectRoot   - Absolute path to the user's project root
 * @param {Object}   options.config        - Resolved module.yaml variables
 * @param {string[]} options.installedIDEs - IDE codes that were installed
 * @param {Object}   options.logger        - Logger with .log / .warn / .error
 * @returns {Promise<boolean>}
 */
async function install(options) {
  const { projectRoot, config, logger } = options;

  try {
    logger.log(chalk.blue('🎨 Installing Presentation Suite...'));

    await createSidecar(projectRoot, logger);
    await updateCisConfig(projectRoot, config, logger);
    await updateBmadMasterCustomize(projectRoot, logger);
    await updateWorkflowManifest(projectRoot, logger);

    logger.log(chalk.green('✓ Presentation Suite installation complete'));
    logger.log(chalk.dim('  → Invoke Caravaggio via the presentation-master agent'));
    logger.log(chalk.dim('  → Run [BP] to set up your brand studio'));
    logger.log(chalk.dim('  → Run [SD] to build your first presentation'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing Presentation Suite: ${error.message}`));
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Caravaggio sidecar
// ─────────────────────────────────────────────────────────────────────────────

async function createSidecar(projectRoot, logger) {
  const sidecarDir = path.join(projectRoot, '_bmad', '_memory', 'caravaggio-sidecar');
  const brandProfilePath = path.join(sidecarDir, 'brand-profile.md');

  if (!(await fs.pathExists(sidecarDir))) {
    await fs.ensureDir(sidecarDir);
    logger.log(chalk.yellow('  Creating caravaggio-sidecar directory'));
  }

  if (!(await fs.pathExists(brandProfilePath))) {
    await fs.writeFile(
      brandProfilePath,
      '# Caravaggio\'s Studio — Brand Profile\n\n' +
      '*This file is empty. Run the [BP] Brand Profile workflow from Caravaggio\'s menu to set up your studio.*\n'
    );
    logger.log(chalk.green('  ✓ Created brand-profile.md sidecar template'));
  } else {
    logger.log(chalk.dim('  brand-profile.md already exists — skipping'));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CIS config — enable_presentation_hook
// ─────────────────────────────────────────────────────────────────────────────

async function updateCisConfig(projectRoot, config, logger) {
  const cisConfigPath = path.join(projectRoot, '_bmad', 'cis', 'config.yaml');

  if (!(await fs.pathExists(cisConfigPath))) {
    logger.warn(chalk.yellow('  Warning: _bmad/cis/config.yaml not found — skipping hook flag injection'));
    return;
  }

  let content = await fs.readFile(cisConfigPath, 'utf8');

  if (content.includes('enable_presentation_hook')) {
    logger.log(chalk.dim('  enable_presentation_hook already set in CIS config — skipping'));
    return;
  }

  const hookValue = config['enable_presentation_hook'] === false ? 'false' : 'true';
  const addition =
    '\n# Presentation Suite — post-workflow offer hook\n' +
    '# When true: after any document-producing workflow, Caravaggio offers to turn it into a presentation.\n' +
    `enable_presentation_hook: ${hookValue}\n`;

  await fs.writeFile(cisConfigPath, content.trimEnd() + addition);
  logger.log(chalk.green(`  ✓ Added enable_presentation_hook: ${hookValue} to CIS config`));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. bmad-master customize.yaml — presentation hook memory
// ─────────────────────────────────────────────────────────────────────────────

const HOOK_MEMORY = `  - |
    PRESENTATION HOOK (post-workflow offer):
    After completing any document-producing workflow — specifically: create-prd, edit-prd,
    create-product-brief, create-architecture, create-epics-and-stories, market-research,
    domain-research, technical-research, brainstorming, design-thinking, innovation-strategy,
    problem-solving, storytelling, retrospective, quick-spec, or generate-project-context —
    silently check {project-root}/_bmad/cis/config.yaml for the field \`enable_presentation_hook\`.
    If the field is present and set to \`true\`, append a single non-intrusive offer on a new line
    after the workflow completion summary:
    "🎨 Turn this into a presentation? → Type **[CP]** to launch Caravaggio."
    If the user types CP (or "caravaggio" or "presentation"): activate the presentation-master
    agent by reading {project-root}/_bmad/cis/agents/presentation-master.md.
    Do NOT show this offer for implementation workflows: dev-story, code-review, create-story,
    sprint-planning, sprint-status, correct-course, qa-automate, validate-*, or party-mode.`;

async function updateBmadMasterCustomize(projectRoot, logger) {
  const customizePath = path.join(
    projectRoot, '_bmad', '_config', 'agents', 'core-bmad-master.customize.yaml'
  );

  if (!(await fs.pathExists(customizePath))) {
    logger.warn(chalk.yellow('  Warning: core-bmad-master.customize.yaml not found — skipping hook injection'));
    return;
  }

  let content = await fs.readFile(customizePath, 'utf8');

  if (content.includes('PRESENTATION HOOK')) {
    logger.log(chalk.dim('  Presentation hook already in bmad-master customize.yaml — skipping'));
    return;
  }

  // Handle both empty array form and existing entries form
  if (content.includes('memories: []')) {
    content = content.replace('memories: []', `memories:\n${HOOK_MEMORY}`);
  } else if (content.match(/^memories:\s*$/m)) {
    content = content.replace(/^memories:\s*$/m, `memories:\n${HOOK_MEMORY}`);
  } else if (content.match(/^memories:/m)) {
    // Already has entries — append after the memories: line's last entry
    // Find the memories block and append to it
    content = content.replace(/^(memories:)/m, `$1\n${HOOK_MEMORY}`);
  } else {
    // No memories key at all — append at end
    content = content.trimEnd() + `\nmemories:\n${HOOK_MEMORY}\n`;
  }

  await fs.writeFile(customizePath, content);
  logger.log(chalk.green('  ✓ Added presentation hook memory to bmad-master customize.yaml'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Workflow manifest — register gv-brand-profile and gv-roast-my-deck
// ─────────────────────────────────────────────────────────────────────────────

const MANIFEST_ENTRIES = [
  '"gv-brand-profile","Set up or update Caravaggio\'s brand memory (the studio) for automatic brand consistency across all presentations. Gathers colors, typography, tone, and visual constraints in a short conversational session.","cis","_bmad/cis/workflows/gv-brand-profile/workflow.yaml"',
  '"gv-roast-my-deck","Critique and rebuild an existing presentation around a clear message spine. Caravaggio identifies structural problems, message clarity failures, and visual logic issues — then rebuilds the deck for maximum impact.","cis","_bmad/cis/workflows/gv-roast-my-deck/workflow.yaml"',
];

async function updateWorkflowManifest(projectRoot, logger) {
  const manifestPath = path.join(projectRoot, '_bmad', '_config', 'workflow-manifest.csv');

  if (!(await fs.pathExists(manifestPath))) {
    logger.warn(chalk.yellow('  Warning: workflow-manifest.csv not found — skipping manifest registration'));
    return;
  }

  let manifest = await fs.readFile(manifestPath, 'utf8');
  let added = 0;

  for (const entry of MANIFEST_ENTRIES) {
    const name = entry.split(',')[0].replace(/"/g, '');
    if (!manifest.includes(`"${name}"`)) {
      manifest = manifest.trimEnd() + '\n' + entry + '\n';
      added++;
    }
  }

  if (added > 0) {
    await fs.writeFile(manifestPath, manifest);
    logger.log(chalk.green(`  ✓ Registered ${added} workflow(s) in workflow-manifest.csv`));
  } else {
    logger.log(chalk.dim('  Workflow manifest entries already present — skipping'));
  }
}

module.exports = { install };
