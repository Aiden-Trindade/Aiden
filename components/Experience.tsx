import LayoutFigure from "@/components/LayoutFigure";
import { experience } from "@/data/content";

// The CodeChef-VIT job carries the before/after drawing of the FFCS-inator v2.0.1 layout change;
// the other job is text only.
export default function Experience() {
  return (
    <div className="xp">
      {experience.map((job) => {
        const figure = job.org === "CodeChef-VIT";
        return (
          <article key={job.org} className={figure ? "xp-job xp-job-figure" : "xp-job"}>
            <header className="xp-head">
              <h3>{job.org}</h3>
              <p>
                {job.role}, {job.place}
                {job.when && `, ${job.when}`}
              </p>
            </header>
            {figure && <LayoutFigure />}
            <div className="xp-body">
              <p>{job.summary}</p>
              <ul>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
