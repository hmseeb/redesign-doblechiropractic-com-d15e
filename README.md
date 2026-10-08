# Doble Chiropractic & Upper Cervical Care — Website

A redesigned, responsive marketing site for **Doble Chiropractic & Upper Cervical Care**
in Sebastopol, California — the practice of Dr. Richard Doble, D.C., "The Neck Doctor."

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no environment
variables. Open `index.html` or serve the directory statically.

```bash
python3 -m http.server 8080
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Single-page site: hero, approach, services, conditions, special offer, doctor bio, mission, hours, contact |
| `404.html` | Not-found page |
| `styles.css` | Full design system (tokens, components, responsive breakpoints) |
| `script.js` | Mobile nav, sticky header, scroll reveal, form validation + submission |
| `favicon.svg` | Favicon |
| `<slug>/index.html` | Inner pages (patient education, conditions, articles, policies) rebuilt verbatim from the previous WordPress site, 2026-10 |
| `images/legacy/`, `files/` | Images and the intake PDF those pages use |
| `vercel.json` | `/admin` redirect, plus 301s from every pre-redesign URL to its new page |

## Forms

The appointment request form POSTs to LeadrVision:

```
https://vision.leadrai.com/api/forms/6836675363c8a1cc4fbb14dc2a805402
```

- The `action` attribute is set on the form, so it works with JavaScript disabled.
- With JavaScript, `script.js` POSTs the same URL as JSON via `fetch()` and shows an
  inline confirmation on `{"ok": true}`.
- Hidden fields: `_form` (form name), `_page` (set to `window.location.href` on load and
  included in the JSON body), and a `_gotcha` honeypot.
- A plain submission returns to the page with `?submitted=1`, which triggers the same
  "Thanks, your message was sent" confirmation.

## Practice details

- **Address:** 130 S Main St Suite 213, Sebastopol, CA 95472
- **Phone:** (707) 321-1586
- **Office hours:** Mon–Fri 8:00am–6:30pm · Sat 8:00am–12:00pm · Sun closed
- **Walk-in hours:** Wed & Fri 9:00am–12:00pm (no appointment necessary)
- **Adjusting hours:** Mon 8:00am–11:00pm · Wed & Fri 8:00am–1:00pm, 3:00pm–5:00pm · Sat 9:00am–12:00pm
- **Languages:** English and French
