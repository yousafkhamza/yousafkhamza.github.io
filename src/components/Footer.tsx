import { Link } from "react-router-dom";
import { profile } from "@/data/profile";

const Footer = () => (
  <footer className="mt-8 bg-strip text-strip-dim">
    <div className="wrap py-10 grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr] text-[15px]">
      <div>
        <div className="font-display text-[22px] font-bold uppercase text-white">
          {profile.name} <span className="font-normal normal-case text-[16px] text-strip-dim">({profile.altName})</span>
        </div>
        <p className="mt-1 max-w-[42ch]">
          {profile.role}. Based in {profile.location}.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <span className="label mb-1 text-strip-fg">Elsewhere</span>
        <a className="hover:text-strip-fg" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className="hover:text-strip-fg" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="hover:text-strip-fg" href={profile.medium} target="_blank" rel="noopener noreferrer">Medium</a>
        <a className="hover:text-strip-fg" href={`mailto:${profile.email}`} title={profile.email}>Email</a>
      </div>
      <div className="flex flex-col gap-2">
        <span className="label mb-1 text-strip-fg">On this site</span>
        <Link className="hover:text-strip-fg" to="/projects">Projects</Link>
        <Link className="hover:text-strip-fg" to="/services">Career guidance</Link>
        <Link className="hover:text-strip-fg" to="/play">On-call games <span className="font-code text-[14px] opacity-70">sudo play</span></Link>
      </div>
    </div>
    <div className="wrap pb-8 font-mono text-[14px] uppercase tracking-[0.05em] flex flex-wrap justify-between gap-2">
      <span>© 2027 {profile.name}</span>
      <span>static site · built with GitHub Actions · served by GitHub Pages</span>
    </div>
  </footer>
);

export default Footer;
