# Scheduling Setup — Cal.com (inline embed) for the Portfolio

The site embeds the **full Cal.com booking page** (`cal.com/niraj-ag` — all event
types) inline on a dedicated **`/contact` page** (`src/pages/ContactPage.tsx`,
scheduler in `src/components/CalEmbed.tsx`) using the official
`@calcom/embed-react` package. Visitors pick an event type and book without
ever leaving the site.

All "Book a Call" CTAs (nav, hero, work bridge, homepage contact section) go
to `/contact`. The homepage's own contact section is a clean closing CTA link
into that page — no embed pasted onto the homepage.

The embed calls `calLink="niraj-ag"`, which means:

- Your Cal.com **username must be `niraj-ag`** → the embed iframe loads
  `app.cal.com/niraj-ag/embed` and shows every public event type.
- Event type slugs (`15min` / `30min` / `45min`) no longer need to match a
  hardcoded embed URL — the profile page lists whatever you publish.
- If you later want a *specific* event embedded anywhere, change `CAL_LINK` in
  `CalEmbed.tsx` to `niraj-ag/15min` (etc.) and update the namespace to match.

Goal: a recruiter or client lands on the booking UI and immediately feels it's
run by someone who cares — clear types, short invitations, zero friction, and
**zero phone-number exposure**.

---

## 1. The principle: less is more

- **2–3 event types max.** Every extra type adds decision fatigue: "which of
  these 6 calls am I supposed to book?" Each one should have an obvious loser
  (the one the visitor is NOT).
- **Fewer questions = more bookings.** Every form field adds ~10–20% drop-off.
- **Never ask for or show a phone number.** Locations are video calls; reminders
  are email-only. If you can't do a meeting without a number, you don't want
  that meeting.

---

## 2. Recommended event types (3)

| # | Event type | Duration | Who it's for | Notes |
|---|---|---|---|---|
| 1 | **Quick Intro Call** (slug `15min`) | **15 min** | Recruiters, first contacts | The embedded default — lowest friction, looks easy to reach |
| 2 | **Technical Conversation** (slug `30min`) | **30 min** | Recruiters who read your resume, peers | Walk through RDV AI / Xsight architecture |
| 3 | **Project Discovery** (slug `45min`) | **45 min** | Potential clients / collaborations | Enough to map goals + a first milestone |

Why these durations:

- **15 min** — recruiters love a quick screen; it signals you're reachable and
  respects their time. If it goes well they rebook.
- **30 min** — the sweet spot for technical talk. Long enough for real depth,
  short enough to never feel like a burden.
- **45 min** — client discovery only. Freelance/serious conversations need room
  to explain constraints. **Do not** make a public 60-min slot — too heavy,
  gets ignored or abused. If a second round is needed later, you create a
  private 60-min link then.

---

## 3. Scheduling settings (exact recommended values)

Configure **per event type** in Cal.com → Event types → Edit → Scheduling.

| Setting | Value | Why |
|---|---|---|
| Buffer time | 5 min | Small gap to breathe/context-switch |
| Min. notice (lead time) | 2 hours | Flexible but leaves you time to prep |
| Forward booking window | 4 weeks | Recruiters book within days; less meeting fatigue |
| Max per day (intro) | 3 | Quality > quantity; no back-to-back burnout |
| Max per day (30 min) | 2 | — |
| Max per day (45 min) | 1–2 | Client calls are energy-heavy |
| Time zone | IST (Kolkata, UTC+5:30) | Set explicitly — invitees in US/UK/other see correct slots |
| Days | Weekdays only | Weekend bookings get cancelled anyway |

Weekly availability (an example pattern — adjust to your real life):

```
Mon–Fri   10:00 → 13:00
          15:00 → 18:00
```

Block lunch, meetings, and personal time. A half-empty week looks intentional;
a 24/7 calendar looks either fake or desperate.

---

## 4. Booking form questions (keep to 2–3)

Cal.com collects **name + email automatically** — don't re-ask those.

Required / recommended:

1. **"What would you like to talk about?"** — dropdown:
   - Job opportunity
   - Technical / project discussion
   - Product collaboration
   - Something else
2. **"Briefly, what's the context? (1 line is fine)"** — short text. Lets you
   prep so the call starts already warm.

Optional (recruiter-specific, so casual bookers aren't scared off):

3. **"Role description or job link, if you have one"** — URL/text field. Their
   JD → you prep → nobody wastes anyone's time.
4. Optional referral field: **"How did you find me?"** — LinkedIn / Portfolio /
   Referral / Other. Useful later, but it's the first thing to cut if drop-off
   becomes visible.

Do **not** add a phone-number question. Do **not** require company size,
budget, or location.

---

## 5. Event description & confirmation copy (copy-paste)

### Quick Intro Call — 15 min
```text
Title: Quick Intro Call

Thanks for setting up time with me.

This 15-minute call is a casual intro — we'll cover who I am, what I'm
building, and whether we're a good fit to talk further.

Please add anything you'd like to discuss in the "context" question when
booking — it helps me come prepared.

Talk soon — Niraj
```

### Technical Conversation — 30 min
```text
Title: Technical Conversation

Let's go deeper than a resume.

In 30 minutes we can walk through the architecture and decisions behind
projects like RDV AI (an LLM pipeline that turns requirements into UX
deliverables) or Xsight (automated WCAG/Nielsen audits with Playwright).

Come with questions, or bring a problem you'd like me to think through.
A video link is sent automatically when you book.
```

### Project Discovery — 45 min
```text
Title: Project Discovery

You have an idea — or a problem — and want to know if I'm a fit to build it.

In 45 minutes we'll map your goals, the constraints, and what a realistic
first milestone looks like. Bring any docs, screenshots, or links you have.
A video link is sent automatically when you book.
```

Confirmation/reminders: keep the default automatic email confirmations;
add a 24h-before reminder (default) and skip the 10-minute one (annoying).

---

## 6. Location & notifications — the phone-leak rules

- **Location type: Google Meet (auto-generated)** or Zoom. Your invitee gets a
  generated link; you get the same. Nothing private to clean up.
- **Never** use "Phone call" / "By phone" as a location — Cal.com asks for
  your number and shows it to invitees.
- **Notifications: email only.** Turn **off SMS** — SMS binds your phone number
  to the scheduling account and is another leak vector.
- Double-check no phone number appears anywhere on the booking page, event
  confirmation, or reminders before sharing publicly (test-book yourself).

---

## 7. Branding — so the embed matches the portfolio

The embed is themed in code (`CalEmbed.tsx`, `cal("ui", …)`):

- `theme: "dark"` — matches the site's dark surface.
- `cssVarsPerTheme` sets `--cal-brand: #5B8CFF` (the site's `--accent`) with
  dark text on brand buttons, so the scheduler looks like part of the site.

Per-account settings to match:

- **Profile photo** — same one as LinkedIn so people recognize you.
- **Bio line** under your name:
  `Software Engineer building AI-powered products · React, TypeScript, Spring Boot · Capgemini`
- **Accent color: `#5B8CFF`** — matches the site's `--accent` exactly.
- **Username: `niraj-ag`** → booking page lives at `cal.com/niraj-ag`.
- Include a short "About" in the profile page: 2–3 lines max, mirroring your
  Hero tagline ("Turning ideas into reliable digital products").

---

## 8. Placement & the full funnel

1. **Site (done in code):** `/contact` is a real page. Every "Book a Call" CTA
   and the nav's "Contact" item routes there. The scheduler iframe mounts as
   soon as the page is near it (IntersectionObserver), so the booking UI is
   ready without slowing the initial load.
2. **Hosting note:** the site uses client-side routing (`/contact`). The host
   must rewrite all paths to `index.html` — Vercel/Netlify do this by default;
   GitHub Pages needs a `404.html` copy of `index.html` (or hash routing).
3. **LinkedIn (featured section):** link straight to the intro event,
   `https://cal.com/niraj-ag/15min` — recruiters click from there more than
   from portfolios.
4. **Email signature:** `cal.com/niraj-ag/15min` next to the mailto.
5. Keep Email / LinkedIn / GitHub as the secondary contact row under the
   scheduler. Recruiters who just want the resume will email — don't force a
   booking on them.

---

## 9. Cal.com terminology (you're on Cal.com)

| Cal.com | What it is |
|---|---|
| Event types | The 3 booking types above |
| Event type → Booking form tab | Custom questions (dropdown, 1-line text, JD link) |
| Event type → Limit booking | Daily caps (3/2/1–2) |
| Schedules | Weekly availability (bind to your calendar) |
| Event type → Appearance | Per-type description; global brand color lives in the embed |
| Event type → Location | Google Meet / Zoom — video, never "phone" |
| Email-only notifications | Keep SMS off |

---

## 10. Launch checklist

- [ ] Account username is exactly `niraj-ag`
- [ ] 3 event types with slugs `15min` / `30min` / `45min`
- [ ] 5-min buffer, 2h min. notice, 4-week window, daily caps (3/2/1–2)
- [ ] 2–3 questions max (dropdown + one line + optional JD link)
- [ ] Google Meet location, email-only notifications, **no phone anywhere**
- [ ] Profile: photo, bio, `#5B8CFF` accent, About line
- [ ] Embed verified: open `/contact` on the live site → scheduler renders
      (dark theme, blue brand, all event types visible)
- [ ] Add `cal.com/niraj-ag/15min` to LinkedIn + email signature
- [ ] Test: book the 15-min call with a secondary email → open confirmations →
      verify zero phone-number exposure end to end