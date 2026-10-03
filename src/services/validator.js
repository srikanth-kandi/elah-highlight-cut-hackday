/**
 * Validator service for Elah Highlight Cut Studio
 * Ensures AI plans strictly conform to safe, supported video editing parameters.
 */

export const ALLOWED_ACTIONS = [
  "trimStart",
  "trimEnd",
  "keepRange",
  "removeSection",
  "addTitleCard",
  "addCaption"
];

/**
 * Validates plan operations against total video duration.
 * Returns plan with annotated validation items & calculated compiled timeline.
 */
export function validateEditPlan(rawPlan, totalDuration = 60) {
  const operations = rawPlan.operations || [];
  let validCount = 0;
  let invalidCount = 0;
  let warningCount = 0;

  const validatedOperations = operations.map((op, idx) => {
    const action = op.action;
    const params = op.params || {};
    const id = idx + 1;

    // 1. Check if action is supported
    if (!ALLOWED_ACTIONS.includes(action)) {
      invalidCount++;
      return {
        ...op,
        id,
        status: "invalid",
        error: `Unsupported action "${action}". Only structural cuts, trims, and overlays are supported in Elah.`
      };
    }

    // 2. Validate trimStart
    if (action === "trimStart") {
      const seconds = Number(params.seconds);
      if (isNaN(seconds) || seconds <= 0) {
        invalidCount++;
        return {
          ...op,
          id,
          status: "invalid",
          error: "trimStart requires a positive number of seconds."
        };
      }
      if (seconds >= totalDuration) {
        invalidCount++;
        return {
          ...op,
          id,
          status: "invalid",
          error: `Trim seconds (${seconds}s) exceeds total video duration (${totalDuration}s).`
        };
      }
      validCount++;
      return { ...op, id, status: "valid" };
    }

    // 3. Validate trimEnd
    if (action === "trimEnd") {
      const seconds = Number(params.seconds);
      if (isNaN(seconds) || seconds <= 0) {
        invalidCount++;
        return {
          ...op,
          id,
          status: "invalid",
          error: "trimEnd requires a positive number of seconds."
        };
      }
      if (seconds >= totalDuration) {
        invalidCount++;
        return {
          ...op,
          id,
          status: "invalid",
          error: `Trim end seconds (${seconds}s) exceeds total video duration (${totalDuration}s).`
        };
      }
      validCount++;
      return { ...op, id, status: "valid" };
    }

    // 4. Validate keepRange
    if (action === "keepRange") {
      const start = Number(params.start ?? 0);
      const end = Number(params.end ?? totalDuration);
      if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
        invalidCount++;
        return {
          ...op,
          id,
          status: "invalid",
          error: `Invalid range [${start}s, ${end}s]. Start must be >= 0 and end > start.`
        };
      }
      if (end > totalDuration) {
        warningCount++;
        return {
          ...op,
          id,
          status: "warning",
          warning: `Range end (${end}s) capped to max duration (${totalDuration}s).`
        };
      }
      validCount++;
      return { ...op, id, status: "valid" };
    }

    // 5. Validate removeSection
    if (action === "removeSection") {
      const start = Number(params.start);
      const end = Number(params.end);
      if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
        invalidCount++;
        return {
          ...op,
          id,
          status: "invalid",
          error: `Invalid remove range [${start}s, ${end}s].`
        };
      }
      validCount++;
      return { ...op, id, status: "valid" };
    }

    // 6. Validate addTitleCard
    if (action === "addTitleCard") {
      if (!params.text || typeof params.text !== "string") {
        invalidCount++;
        return {
          ...op,
          id,
          status: "invalid",
          error: "addTitleCard requires non-empty text string."
        };
      }
      validCount++;
      return { ...op, id, status: "valid" };
    }

    // 7. Validate addCaption
    if (action === "addCaption") {
      if (!params.text) {
        invalidCount++;
        return {
          ...op,
          id,
          status: "invalid",
          error: "addCaption requires text."
        };
      }
      validCount++;
      return { ...op, id, status: "valid" };
    }

    validCount++;
    return { ...op, id, status: "valid" };
  });

  // Calculate compiled timeline active intervals
  const compiledTimeline = compileTimeline(validatedOperations, totalDuration);

  return {
    ...rawPlan,
    operations: validatedOperations,
    stats: {
      total: operations.length,
      valid: validCount,
      invalid: invalidCount,
      warning: warningCount
    },
    isValid: invalidCount === 0,
    compiledTimeline
  };
}

/**
 * Compiles validated operations into active playable video segments and text overlays.
 */
function compileTimeline(operations, totalDuration) {
  let activeIntervals = [{ start: 0, end: totalDuration, label: "Original Video" }];
  const titleCards = [];
  const captions = [];

  for (const op of operations) {
    if (op.status === "invalid") continue;

    if (op.action === "trimStart") {
      const trimSec = Number(op.params.seconds || 0);
      activeIntervals = activeIntervals
        .map(inv => ({ start: Math.max(inv.start, trimSec), end: inv.end, label: inv.label }))
        .filter(inv => inv.end > inv.start);
    } else if (op.action === "trimEnd") {
      const trimSec = Number(op.params.seconds || 0);
      const maxEnd = totalDuration - trimSec;
      activeIntervals = activeIntervals
        .map(inv => ({ start: inv.start, end: Math.min(inv.end, maxEnd), label: inv.label }))
        .filter(inv => inv.end > inv.start);
    } else if (op.action === "keepRange") {
      const kStart = Number(op.params.start || 0);
      const kEnd = Number(op.params.end || totalDuration);
      activeIntervals = activeIntervals
        .map(inv => ({
          start: Math.max(inv.start, kStart),
          end: Math.min(inv.end, kEnd),
          label: op.params.label || "Kept Segment"
        }))
        .filter(inv => inv.end > inv.start);
    } else if (op.action === "removeSection") {
      const rStart = Number(op.params.start);
      const rEnd = Number(op.params.end);
      const newIntervals = [];
      for (const inv of activeIntervals) {
        if (rEnd <= inv.start || rStart >= inv.end) {
          newIntervals.push(inv);
        } else {
          if (rStart > inv.start) {
            newIntervals.push({ start: inv.start, end: rStart, label: inv.label });
          }
          if (rEnd < inv.end) {
            newIntervals.push({ start: rEnd, end: inv.end, label: inv.label });
          }
        }
      }
      activeIntervals = newIntervals;
    } else if (op.action === "addTitleCard") {
      titleCards.push({
        text: op.params.text,
        duration: Number(op.params.duration || 3)
      });
    } else if (op.action === "addCaption") {
      captions.push({
        text: op.params.text,
        start: Number(op.params.start || 0),
        end: Number(op.params.end || 10)
      });
    }
  }

  // Calculate net edited duration
  const activeDuration = activeIntervals.reduce((acc, curr) => acc + (curr.end - curr.start), 0);

  return {
    activeIntervals,
    activeDuration: Math.max(0, activeDuration),
    originalDuration: totalDuration,
    titleCards,
    captions
  };
}
