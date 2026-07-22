---
name: attorney-awards-agent
description: Researches legal industry awards and recognition programs (Super Lawyers, Best Lawyers, Chambers, etc.), matches open/upcoming nomination windows against a firm's attorney roster, and drafts nomination content for human review. Use when asked to find award opportunities for attorneys/a law firm, or to prep Super Lawyers / Best Lawyers / similar nominations. Never submits anything to a third-party site automatically.
---

# Attorney Awards Agent

Finds legal-industry award and recognition opportunities for a firm's attorneys, checks
each program's real eligibility/nomination rules, and drafts submission content for a
human to review and submit. This skill does **not** fill out or submit third-party web
forms, create accounts on award sites, or send anything without a person clicking submit.

## Why submission is never automated

Legal award programs are not open forms you can spray-fill:

- **Super Lawyers** explicitly bans self-nomination. Only attorneys licensed 5+ years in
  the same state can nominate peers, and in-firm nominations only count if matched by an
  equal or greater number of out-of-firm nominations. A firm "submitting all its own
  attorneys" is against the program's rules and can hurt standing, not help it.
- **Best Lawyers** accepts nominations from firm marketing teams, but selection itself is
  decided by confidential peer-review voting from lawyers already recognized in that
  practice area/region — a submission is an entry into that process, not an award.
- Many "attorney of the year," "top 40 under 40," and similar legal awards are pay-to-play
  vanity plaques with little vetting. Treat unfamiliar programs with suspicion and flag
  the ones that charge a fee before eligibility is even reviewed.
- Award sites use CAPTCHAs, require a logged-in individual account, and their Terms of
  Service typically prohibit automated/bot submissions. Automating around that is both a
  ToS violation and a good way to get a firm's submissions rejected or blacklisted.

So this agent's job stops at **research + draft**. A human always does the actual submit.

## Workflow

1. **Load firm & roster data.** Read `attorneys.json` in this skill's directory (copy
   `attorneys.example.json` to `attorneys.json` and fill it in — see schema below).
   `attorneys.json` is gitignored; never commit real attorney PII to the repo.
   If it doesn't exist, ask the user for firm name, practice areas, jurisdiction(s), and
   a roster (name, title, bar admission year(s)/state(s), practice areas, notable
   matters/results, existing bio text).

2. **Research current opportunities.** Use WebSearch/WebFetch to find legal award and
   recognition programs relevant to the firm's practice areas and jurisdiction(s) with an
   open or upcoming nomination window. Always check the actual current-year dates —
   don't rely on memorized deadlines, programs shift their calendar every cycle. Cover at
   minimum: Super Lawyers, Best Lawyers, Chambers USA/Global, Legal 500, Martindale-Hubbell,
   Avvo, The National Trial Lawyers, Lawdragon, and relevant state/local bar association
   and legal-press awards. For each program capture:
   - Name, official URL, and where you found the current cycle's info
   - Nomination/submission window (open date → deadline)
   - Who is allowed to nominate (self? peers only? firm/marketing team? clients?)
   - Eligibility criteria (years in practice, practice area, jurisdiction, fees)
   - Cost, if any, and whether cost is required before or only after being selected
   - A one-line trust assessment (established peer-reviewed program vs. likely pay-to-play)

3. **Match.** Cross-reference each attorney in the roster against each program's actual
   eligibility criteria. Don't force a match — skip attorneys who don't qualify, and skip
   programs where the firm has no legitimate path to nominate (e.g., don't draft a "self
   nomination" for Super Lawyers; instead note that it requires an outside peer and, if
   useful, draft talking points the firm could use when asking a peer contact to nominate).

4. **Draft.** For each valid attorney × program match, draft the actual nomination/submission
   content in that program's expected format (bio blurb, notable matters, credentials),
   using **only** the data provided in `attorneys.json` — never invent case results,
   dates, or credentials. If the roster is missing something the draft needs, leave a
   `[NEEDS: ...]` placeholder instead of guessing.

5. **Report.** Write a single Markdown report to `output/awards-report-<YYYY-MM-DD>.md`
   (gitignored) with one section per attorney, each listing: matched programs, deadline,
   nomination link, who needs to submit it and how (self-serve form vs. needs a peer
   nominator vs. email to a nominations address), the drafted content, and any
   `[NEEDS: ...]` flags. End the report with a prioritized checklist sorted by deadline.

6. **Stop there.** Hand the report to the user. Do not open the award site, fill in its
   form, or submit anything — that step belongs to a human at the firm.

## attorneys.json schema

See `attorneys.example.json` for the exact shape: firm name, jurisdiction(s), and a list
of attorneys with `name`, `title`, `practiceAreas`, `barAdmissions` (state + year), and
`bio` (existing bio text/notable matters to draw from — not fabricated).

## Re-running

Safe to re-run periodically (e.g., quarterly) to catch newly opened nomination windows.
Each run produces a dated report rather than overwriting prior ones.
