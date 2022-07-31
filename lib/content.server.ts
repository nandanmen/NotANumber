import { bundleMDX } from "mdx-bundler";
import * as fs from "fs";
import * as path from "path";
import glob from "glob";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";

const CONTENT_FOLDER = `${process.cwd()}/_dist-content`;
const POST_FILENAME = "index.mdx";

export type Post = {
  code: string;
  frontmatter: Record<string, any>;
};

export type PostMetadata = {
  frontmatter: Record<string, any>;
  slug: string;
};

const theme = JSON.parse(
  fs.readFileSync(`${process.cwd()}/assets/light-colorblind.json`, "utf8")
);

/**
 * Gets the post from `dist/content` and bundles it using MDX bundler
 */
export const getPost = async (slug: string): Promise<Post> => {
  const postFolder = path.join(CONTENT_FOLDER, slug);
  const mdxSource = await fs.promises.readFile(
    path.join(postFolder, POST_FILENAME)
  );
  return bundleMDX({
    source: mdxSource.toString(),
    cwd: postFolder,
    mdxOptions(options, frontmatter) {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypePrettyCode, { theme }],
      ];
      return options;
    },
    esbuildOptions(options) {
      /**
       * Babel saves React files with a .js extension, so we have to explicitly tell
       * esbuild to parse these files assuming it contains JSX
       */
      options.loader = {
        ".js": "jsx",
      };
      options.tsconfig = `${process.cwd()}/tsconfig-esbuild.json`;
      return options;
    },
  });
};

export const getAllPosts = async (): Promise<PostMetadata[]> => {
  const paths = await getAllPostPaths();
  return Promise.all(
    paths.map(async (postPath) => {
      const file = await fs.promises.readFile(
        path.join(process.cwd(), postPath)
      );
      const { data: frontmatter } = matter(file.toString());
      return {
        slug: postPath.replace("content/", "").replace("/index.mdx", ""),
        frontmatter,
      };
    })
  );
};

const getAllPostPaths = () => {
  return new Promise<string[]>((resolve, reject) => {
    glob("content/**/index.mdx", (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
};
