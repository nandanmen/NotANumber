import clsx from "clsx";
import * as fs from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import { BackgroundStripes } from "~/components/stripe-pattern";
import { Mdx } from "./mdx";
import styles from "./page.module.css";

export default async function BuildADatabasePage() {
  const source = await fs.readFile(
    `${process.cwd()}/app/build-a-database/index.mdx`,
    "utf8"
  );
  const content = await serialize(source, { parseFrontmatter: true });
  return (
    <>
      <div className="fixed inset-0">
        <BackgroundStripes />
      </div>
      <div className="grid grid-cols-[200px_max-content] mx-auto w-fit relative bg-gray4 border-x border-gray8">
        <aside className="h-screen sticky top-0 flex flex-col text-gray11 p-10 border-r border-gray7">
          <h2 className="font-serif text-2xl">NaN</h2>
          <ol className="text-sm mt-auto space-y-1">
            <li>Introduction</li>
            <li>The Humble File</li>
            <li>Your First Index</li>
            <li>Sorted String Tables</li>
            <li>How Hard Drives Work</li>
            <li>Persisting Trees on Disk</li>
          </ol>
        </aside>
        <article className={clsx(styles.article, "p-10")}>
          <header>
            <h1 className="text-[56px] font-serif leading-[1.2]">
              {content.frontmatter.title}
            </h1>
          </header>
          <Mdx source={content} />
        </article>
      </div>
    </>
  );
}
