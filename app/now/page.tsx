import type { Metadata } from "next";
import NowTitle from "@/components/NowTitle";
import Page from "@/components/Page";
import PencilSpecimen from "@/components/PencilSpecimen";
import { now } from "@/data/now";
import "./now.css";

export const metadata: Metadata = { title: "Now" };

// The specimen comes first in the source so it leads on narrow screens; on wide ones the
// three sentences sit to its left
export default function NowPage() {
  return (
    <Page className="page wrap now">
      <header className="now-head">
        <NowTitle bestBefore={now.bestBefore.month} />
        <p className="now-stamp">
          Written <time dateTime={now.written.month}>{now.written.label}</time>. Best before{" "}
          <time dateTime={now.bestBefore.month}>{now.bestBefore.label}</time>.
        </p>
      </header>

      <div className="now-body">
        <PencilSpecimen receipt={now.receipt} />
        <div className="now-lines">
          <p>{now.building}</p>
          <p>{now.learning}</p>
          <p>{now.lookingFor}</p>
        </div>
      </div>
    </Page>
  );
}
