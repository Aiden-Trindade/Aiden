"use client";

/* eslint-disable @next/next/no-img-element */
import { useId, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";

const COURSE = { code: "BCSE302L", name: "Database Systems" };
const SLOTS = ["F1+TF1", "F2+TF2"];
// The shipped edit opens with no animation; the two copies beside it are what it would
// have felt like at 200 and 600 ms
const SLOWER = [200, 600];

type Receipt = { url: string; date: string; label: string };

// A cut-down, working copy of the pencil edit in FFCS-inator, in the product's own colours.
// One press opens the real edit at once, as shipped, and the same edit at 200 and 600 ms
// beside it, so the speed is something you see rather than read about. The slower copies are
// pictures that follow the draft. Save, Cancel, Escape and a second press are all instant.
export default function PencilSpecimen({ receipt }: { receipt: Receipt }) {
  const [slots, setSlots] = useState([SLOTS[0]]);
  const [draft, setDraft] = useState([SLOTS[0]]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const pencil = useRef<HTMLButtonElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const id = useId();

  function open() {
    // Commit first, so the form is no longer inert or hidden when it takes focus
    flushSync(() => {
      setDraft(slots);
      setError(false);
      setEditing(true);
    });
    form.current?.querySelector<HTMLInputElement>("input:checked")?.focus({ preventScroll: true });
  }

  function close() {
    setEditing(false);
    pencil.current?.focus({ preventScroll: true });
  }

  function save() {
    // FFCS-inator won't save a course with no theory slot either
    if (draft.length === 0) {
      setError(true);
      return;
    }
    setSlots(SLOTS.filter((s) => draft.includes(s)));
    close();
  }

  const chips = (
    <span className="ffcs-chips">
      {SLOTS.map((s) => (
        <b key={s} className="ffcs-chip" data-on={draft.includes(s) || undefined}>
          {s}
        </b>
      ))}
    </span>
  );

  return (
    <figure
      className="pencil"
      aria-labelledby={`${id}-cap`}
      data-editing={editing || undefined}
      onKeyDown={(e) => {
        if (e.key === "Escape" && editing) {
          e.preventDefault();
          close();
        }
      }}
    >
      <div className="pencil-mat">
        <div className="ffcs-card pencil-courses">
          <div className="ffcs-row">
            <span className="ffcs-n">1.</span>
            <span className="ffcs-code">{COURSE.code}</span>
            <span className="ffcs-course">{COURSE.name}</span>
            <span className="ffcs-slot" aria-live="polite">
              {slots.join(", ")}
            </span>
            <button
              ref={pencil}
              type="button"
              className="ffcs-pencil"
              aria-label={`Edit ${COURSE.code}`}
              aria-pressed={editing}
              aria-controls={`${id}-lane`}
              onClick={() => (editing ? close() : open())}
            >
              <span>
                <img src="/now/ffcs-pencil.svg" alt="" width={17} height={17} />
              </span>
            </button>
          </div>
        </div>

        <div className="ffcs-card lane lane-shipped" id={`${id}-lane`} style={{ "--t": "0ms" } as CSSProperties}>
          <p className="lane-ms" aria-hidden="true">
            0 ms
          </p>
          <p className="ffcs-tab" aria-hidden="true">
            Editing {COURSE.code}
          </p>
          <div className="lane-box">
            <div className="lane-idle" inert aria-hidden="true">
              <p className="ffcs-field is-muted ffcs-subject">
                <span>Select or search subject</span>
                <i />
              </p>
              <p className="ffcs-field is-muted">
                <span>Select slots</span>
                <i />
              </p>
              <div className="ffcs-btns" />
            </div>
            <form
              ref={form}
              className="lane-edit"
              aria-label={`Editing ${COURSE.code}`}
              inert={!editing}
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <p className="ffcs-field is-locked ffcs-subject">
                <span>
                  {COURSE.code} - {COURSE.name}
                </span>
                <i />
              </p>
              <fieldset className="ffcs-field ffcs-slots">
                <legend className="sr-only">Slots for {COURSE.code}</legend>
                <span className="ffcs-chips">
                  {SLOTS.map((s) => (
                    <label key={s}>
                      <input
                        type="checkbox"
                        value={s}
                        checked={draft.includes(s)}
                        onChange={(e) => {
                          setError(false);
                          setDraft((d) => (e.target.checked ? [...d, s] : d.filter((x) => x !== s)));
                        }}
                      />
                      <b className="ffcs-chip">{s}</b>
                    </label>
                  ))}
                </span>
                <i />
              </fieldset>
              <p className="ffcs-error" role="status">
                {error ? "Please select a theory slot." : ""}
              </p>
              <div className="ffcs-btns">
                <button type="button" className="ffcs-btn is-cancel" onClick={close}>
                  Cancel
                </button>
                <button type="submit" className="ffcs-btn is-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        {SLOWER.map((ms) => (
          <div
            key={ms}
            className="ffcs-card lane"
            inert
            aria-hidden="true"
            style={{ "--t": `${ms}ms` } as CSSProperties}
          >
            <p className="lane-ms">{ms} ms</p>
            <p className="ffcs-tab">Editing {COURSE.code}</p>
            <div className="lane-box">
              <div className="lane-idle">
                <p className="ffcs-field is-muted">
                  <span>Select slots</span>
                  <i />
                </p>
              </div>
              <div className="lane-edit">
                <p className="ffcs-field">
                  {chips}
                  <i />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <figcaption id={`${id}-cap`} className="pencil-caption">
        Press the pencil. The edit I added to FFCS-inator on{" "}
        <a href={receipt.url}>
          <time dateTime={receipt.date}>{receipt.label}</time>
        </a>{" "}
        opens at once, as shipped; the two below it are the same edit at 200 and 600 ms.
      </figcaption>
    </figure>
  );
}
