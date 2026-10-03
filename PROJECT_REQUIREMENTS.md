# Project requirements

## Challenge mapping

This project is for the Elah challenge: "Build on elah".

### Mandatory requirements from the brief

- Use natural language as the starting point for an editing request.
- Represent the AI plan as structured editing data; the model should not directly manipulate pixels or the DOM.
- Validate the plan and apply only valid operations to the video timeline.
- Let the user preview the proposed changes before choosing what to keep.
- Support the request -> AI plan -> preview -> keep/discard/refine workflow.
- Make the complete AI action reversible in one step.
- Keep the scope focused enough to deliver a working experience in two hours.

## Recommended product idea

### Highlight Cut workflow

A user uploads or selects a longer talking-head video and requests a shortened highlight clip.

Example request:

- "Trim the intro, keep the key answer, and add a title card at the start."

The app should:

1. parse the request,
2. generate a structured edit plan,
3. validate it,
4. present a preview,
5. allow accept, reject, or refine,
6. allow one-click revert.

## Allowed implementation focus

Keep the app simple and demo-safe:

- one input video
- one target workflow
- a few safe operations such as:
  - trim start/end
  - remove section
  - reorder clip blocks
  - add caption/title overlay
- a preview timeline
- a single undo action for the whole AI edit

## Out of scope for the 2-hour build

- complex multi-track timeline editing
- advanced visual effects
- full export pipeline
- large data ingestion or many media sources
- broad unsupported editing operations

## Success criteria

The project is considered successful if:

- the request flow is easy to understand,
- the AI output is clearly structured,
- invalid edits are rejected gracefully,
- the preview makes the change obvious,
- the user can undo the AI action in one step,
- the demo can be shown in under 2 minutes.
