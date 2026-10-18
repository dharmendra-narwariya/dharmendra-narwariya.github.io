# Dharmendra Narwariya: portfolio website

A static site (plain HTML, CSS and JavaScript, no build step) for consulting, freelance delivery, training, mentoring and coaching in data engineering.

## Structure

```
index.html        Single-page site
404.html          Not-found page
css/styles.css    Design tokens, light and dark themes, layout
js/main.js        Theme, menu, filters, copy buttons, enquiry composer
images/           Portrait, employer logos, project diagrams, favicon, social card
robots.txt, sitemap.xml, .nojekyll
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Publish on GitHub Pages

1. Push this folder to the repository `dharmendra-narwariya.github.io` (branch `main`).
2. In the repository, open Settings, then Pages, and choose "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site appears at https://dharmendra-narwariya.github.io/.

## Edit the content

- Text and links: `index.html`.
- Colours and fonts: the variables at the top of `css/styles.css`.
- Contact email: `EMAIL` at the top of `js/main.js`, plus the mailto links in `index.html`.
- The enquiry form never sends anything. It prepares a message to copy or open in the visitor's mail app.
