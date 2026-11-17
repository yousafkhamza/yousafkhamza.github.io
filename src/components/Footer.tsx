import { Link } from "react-router-dom";
import { profile } from "@/data/profile";

const Footer = () => (
  <footer className="rule-t mt-8">
    <div className="wrap py-10 grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr] text-[14px]">
      <div>
        <div className="font-semibold text-[16px]">{profile.name}</div>
        <p className="text-muted-foreground mt-1 max-w-[42ch]">
          {profile.role}. Based in {profile.location}.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <span className="label mb-1">Elsewhere</span>
        <a className="hover:text-yousaf" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className="hover:text-yousaf" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="hover:text-yousaf" href={`mailto:${profile.email}`}>{profile.email}</a>
      </div>
      <div className="flex flex-col gap-2">
        <span className="label mb-1">On this site</span>
        <Link className="hover:text-yousaf" to="/projects">Projects</Link>
        <Link className="hover:text-yousaf" to="/services">Career guidance</Link>
        <Link className="hover:text-yousaf" to="/play">On-call game <span className="font-mono text-[12px] text-muted-foreground">sudo play</span></Link>
      </div>
    </div>
    <div className="wrap pb-8 font-mono text-[11.5px] text-muted-foreground flex flex-wrap justify-between gap-2">
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <span>static site · built with GitHub Actions · served by GitHub Pages</span>
    </div>
  </footer>
);

export default Footer;
