// Runs after `vite build`. Writes one real HTML file per route (dist/<route>/index.html)
// with that page's title, description, canonical URL and a plain-HTML copy of the
// content, then regenerates sitemap.xml. Search engines and link previews get the
// right text with a 200 response instead of a 404 redirect, and visitors whose JS
// fails to load still see something instead of a blank page.
import { build } from "esbuild";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const tmp = join(root, "node_modules", ".prerender-data.mjs");

await build({
  stdin: {
    contents: `
      export * from "./src/data/seo";
      export { profile, services, impact, yearsOfExperience } from "./src/data/profile";
      export { projects } from "./src/data/projects";
      export { experiences } from "./src/data/experience";
      export { certifications } from "./src/data/certifications";
      export { skillGroups } from "./src/data/skills";`,
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: tmp,
  logLevel: "error",
});
const d = await import(pathToFileURL(tmp).href);
rmSync(tmp);

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const site = d.profile.site;
const years = d.yearsOfExperience();
const buildId = process.env.GITHUB_SHA || `local-${Date.now()}`;

const intro = `<p><strong>${esc(d.profile.name)}</strong> (also ${esc(d.profile.altName)}) is a ${esc(d.profile.role)} based in ${esc(d.profile.location)} with ${years}+ years of experience. ${esc(d.profile.summary)}</p>`;
const nav = `<p><a href="/">Home</a> · <a href="/experience">Experience</a> · <a href="/projects">Projects</a> · <a href="/services">Services</a> · <a href="/contact">Contact</a> · <a href="/resume.pdf">Resume (PDF)</a></p>`;
const expHtml = d.experiences
  .map(
    (e) =>
      `<h2>${esc(e.title)}, ${esc(e.company)}</h2><p>${esc(e.period)} · ${esc(e.location)}</p><ul>${e.description
        .map((x) => `<li>${esc(x)}</li>`)
        .join("")}</ul>`
  )
  .join("");
const projHtml = `<ul>${d.projects
  .map(
    (p) =>
      `<li><a href="${esc(p.demo ?? p.github)}">${esc(p.title)}</a>: ${esc(p.description)}</li>`
  )
  .join("")}</ul>`;
const skillsHtml = `<ul>${d.skillGroups
  .map((g) => `<li>${esc(g.label)}: ${esc([...g.daily, ...g.also].join(", "))}</li>`)
  .join("")}</ul>`;
const certHtml = `<ul>${d.certifications.map((c) => `<li>${esc(c.title)} (${esc(c.organization)}, ${c.date})</li>`).join("")}</ul>`;
const servHtml = `<ul>${d.services.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.who)}</li>`).join("")}</ul>`;
const contactHtml = `<p>Email: <a href="mailto:${esc(d.profile.email)}">${esc(d.profile.email)}</a> · <a href="${esc(d.profile.linkedin)}">LinkedIn</a> · <a href="${esc(d.profile.github)}">GitHub</a></p>`;

const bodies = {
  "/": `<h1>${esc(d.profile.name)}: Senior DevOps Engineer in Dubai, UAE</h1>${intro}<h2>Experience</h2><ul>${d.experiences
    .map((e) => `<li>${esc(e.title)}, ${esc(e.company)} (${esc(e.period)})</li>`)
    .join("")}</ul><h2>Skills</h2>${skillsHtml}<h2>Open-source projects</h2>${projHtml}<h2>Certifications</h2>${certHtml}${contactHtml}`,
  "/experience": `<h1>Experience: ${esc(d.profile.name)}</h1>${intro}${expHtml}<h2>Certifications</h2>${certHtml}`,
  "/projects": `<h1>Open-source projects by ${esc(d.profile.name)}</h1>${projHtml}`,
  "/services": `<h1>DevOps career guidance and reviews</h1><p>Offered by ${esc(d.profile.name)}, Senior DevOps Engineer in Dubai.</p>${servHtml}`,
  "/contact": `<h1>Contact ${esc(d.profile.name)}</h1>${intro}${contactHtml}`,
  "/play": `<h1>On-call games</h1><p>Small browser games about life in DevOps.</p>`,
};

const template = readFileSync(join(dist, "index.html"), "utf8");
const setAttr = (html, re, value) => html.replace(re, (m, a, b) => `${a}${esc(value)}${b}`);

for (const m of d.routeMeta()) {
  const url = `${site}${m.path === "/" ? "/" : m.path + "/"}`;
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`);
  html = setAttr(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, m.description);
  html = setAttr(html, /(<link rel="canonical" href=")[^"]*(")/, url);
  html = setAttr(html, /(<meta property="og:title" content=")[^"]*(")/, m.title);
  html = setAttr(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, m.description);
  html = setAttr(html, /(<meta property="og:url" content=")[^"]*(")/, url);
  html = setAttr(html, /(<meta name="twitter:title" content=")[^"]*(")/, m.title);
  html = setAttr(html, /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, m.description);
  html = html.replace("</head>", `    <meta name="build-id" content="${esc(buildId)}" />\n  </head>`);
  html = html.replace("<!--prerender-->", `<div class="prerender">${nav}${bodies[m.path] ?? ""}</div>`);
  const out = m.path === "/" ? join(dist, "index.html") : join(dist, m.path.slice(1), "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

// sitemap: site pages + project pages hosted under the same domain
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ...d.routeMeta().filter((m) => m.path !== "/play").map((m) => ({ loc: `${site}${m.path === "/" ? "/" : m.path + "/"}`, priority: m.priority })),
  ...d.projects
    .filter((p) => p.demo && p.demo.startsWith(site))
    .map((p) => ({ loc: p.demo, priority: 0.6 })),
];
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${today}</lastmod><priority>${u.priority.toFixed(1)}</priority></url>`)
    .join("\n")}\n</urlset>\n`
);

console.log(`prerendered ${d.routeMeta().length} routes, sitemap with ${urls.length} urls, build ${buildId}`);
