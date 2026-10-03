# Cline working guide

## Objective

Use this repo as the project working directory for a focused Elah build within a short hack-day window.

## Constraints

- Keep scope tight.
- Build one valuable workflow.
- Prioritize demo reliability.
- Do not over-engineer.

## Recommended execution order

1. Confirm the project direction.
2. Pick one narrow editing workflow.
3. Scaffold the app quickly.
4. Implement a simple AI request -> structured plan pipeline.
5. Add validation and preview UI.
6. Add one-step reversal.
7. Test with a few sample prompts.
8. Prepare the demo narrative.

## Good first prompts for Cline

- "Set up a lightweight React app for an Elah-style AI video editing demo."
- "Create a highlight-cut workflow with a natural-language request, structured plan, preview, and undo."
- "Add validation checks so unsupported edits are rejected cleanly."
- "Keep the design simple and demo-ready for a 2-hour hackathon build."

## Safe design heuristics

- Use a minimal timeline model.
- Represent edits as JSON-like structured objects.
- Validate all plan items before applying them.
- Keep UI state explicit and easy to reason about.
- Prefer one strong demo over many partial ideas.

## Final output expectation

The repo should end with:

- a working mini app,
- clear project docs,
- a short demo script,
- a commit history suitable for later GitHub publishing.
