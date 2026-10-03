# Implementation plan

## Phase 1: foundation
- Scaffold a lightweight app shell.
- Choose a minimal UI layout with a video preview area and request input.
- Add sample assets and realistic placeholder data for demo reliability.

## Phase 2: structured AI workflow
- Accept a natural-language request.
- Convert it into a list of structured operations.
- Validate every operation against an allowed operation set.
- Reject invalid operations cleanly.

## Phase 3: preview and control
- Render the proposed edit timeline.
- Allow user to preview the result.
- Support `keep`, `discard`, or `refine` actions.
- Add one-step revert of the entire AI action.

## Phase 4: polish
- Improve error messages.
- Make the demo narrative easy to explain.
- Test with 2-3 example requests.
- Ensure fallback examples work if AI output is unstable.

## Recommended stack
- React + Vite for the UI
- TypeScript for safety
- simple local timeline state and structured edit model
- optional Gemini API integration later if needed
