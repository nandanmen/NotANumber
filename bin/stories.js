const glob = require("glob");
const fs = require("fs");

const getStories = () => {
  return new Promise((resolve, reject) => {
    glob("**/*.stories.tsx", (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
};

const parseStoryPath = (storyPath) => {
  const parts = storyPath.split("/");
  const name = parts[parts.length - 1].replace(".stories.tsx", "");

  let postName;
  const isContentComponent = parts[0] === "content";
  if (isContentComponent) {
    parts[0] = "_dist-content";
    postName = parts[1];
  }
  parts[parts.length - 1] = `${name}.stories`;
  const path = parts.join("/");

  return {
    name,
    isContentComponent,
    path,
    postName,
    asImport: `import * as ${name} from '../${path}'`,
  };
};

const template = `
import { StoriesPage } from '../layouts/StoriesPage';

export default function Stories() {
  return <StoriesPage stories={stories} />;
}
`;

const main = async () => {
  const files = (await getStories()).map(parseStoryPath);
  const imports = files.map(({ asImport }) => asImport).join(`\n`);
  const storiesProp = files
    .map(
      (story) =>
        `{ name: '${story.name}', variants: ${story.name}, postName: '${story.postName}' }`
    )
    .join(`,\n`);

  console.log(files);
  console.log(imports);
  console.log(storiesProp);

  const header = `${imports}\nconst stories = [\n${storiesProp}\n];`;
  fs.writeFileSync("./pages/stories.tsx", header + template);
};

main();
