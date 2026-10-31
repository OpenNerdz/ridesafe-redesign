# Matching the bookcbtnow booking page to the new website

The CBT booking page is run by bookcbtnow. Ridesafe can't change its layout or fonts. Four things are in the school's own bookcbtnow settings, and these values make the page match the new site. `booking-before-after.jpg` shows the result.

## 1. Colours and text size

Each setting below is identified by its current value. Find the box holding that value and replace it.

| Setting (current value) | Where it shows | New value |
|---|---|---|
| Main colour `#009328` | Headings, Next button, selected options, basket | `#15803d` |
| Text colour `#000000` | All text | `#0f1411` |
| Grey `#BBBBBB` | Step bar and unselected boxes | `#6b7770` |
| Border colour `#C7C7C7` | Input boxes and table lines | `#8a958e` |
| Background `#FFFFFF` | Page background | `#FFFFFF` (no change) |
| Font size `10pt` | Base text size | `12pt` |

These changes also make the page easier to read:

- White text on the new green has a contrast of 5.0:1. On the old green it is 4.0:1, which fails the accessibility minimum.
- The step names ("2. Course", "3. Options" and so on) are currently light grey on white, at 1.9:1. With the new grey they are readable, at 4.7:1.
- 12pt is 16px, the comfortable size for reading on phones.

The green of the available dates in the calendar (`#008000`) is fixed by bookcbtnow. Schools can't change it.

## 2. Logo

Replace the old logo (the one with the two bikes) with `ridesafe-logo-for-white.png`. It is the new logo, with the "Motorcycle School Bradford" lettering made dark so it shows up on the white page.

## 3. Welcome text

Replace the welcome text with this. Use bold where shown, and the list button in the editor for the three points.

> **Book your CBT**
>
> Pick a date on the next screen, then confirm with a six-digit code sent to your email. It takes about two minutes.
>
> - **£174.99** for a standard day (a temporary price while fuel costs are high). Bank holidays cost more.
> - Use the email address of **the person doing the training**.
> - The rider must speak and understand English well and know the Highway Code. It makes a real difference on the day.
>
> Questions? Call **01274 686886** or WhatsApp **07760 624531**.

If the editor has a source code (`<>`) view, this HTML can be pasted there instead:

```html
<p style="font-size:1.35em;font-weight:bold">Book your CBT</p>
<p>Pick a date on the next screen, then confirm with a six-digit code sent to your email. It takes about two minutes.</p>
<ul style="text-align:left;display:inline-block;max-width:34em;padding-left:1.2em">
<li><strong>£174.99</strong> for a standard day (a temporary price while fuel costs are high). Bank holidays cost more.</li>
<li>Use the email address of <strong>the person doing the training</strong>.</li>
<li>The rider must speak and understand English well and know the Highway Code. It makes a real difference on the day.</li>
</ul>
<p>Questions? Call <strong>01274 686886</strong> or WhatsApp <strong>07760 624531</strong>.</p>
```

## 4. Ask bookcbtnow about custom CSS

If bookcbtnow lets schools add their own CSS, the page could also get the website's font, rounded buttons and a dark header. It is worth asking their support.
