import CopyEmail from "@/components/CopyEmail";
import { links } from "@/data/content";
import "./site-footer.css";

export default function SiteFooter() {
  return (
    <footer className="footer wrap">
      <p className="footer-ask">Hiring an intern, or building something for students? Write to me.</p>
      <div className="footer-mail">
        <a className="footer-email" href={`mailto:${links.email}`}>
          {links.email}
        </a>
        <CopyEmail email={links.email} />
      </div>
      <p className="link-row">
        <a href={links.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          Resume
        </a>
      </p>
      <p className="footer-fine">
        Built with Next.js and plain CSS. Chess pieces by Colin M. L. Burnett (CC BY-SA 3.0).
      </p>
    </footer>
  );
}
