const fs = require("fs/promises");

const componentTemplate = (componentName) =>
  `export const ${componentName} = () => { return null; }`;

const indexTemplate = (componentName) => `export * from './${componentName}'`;

const generate = async (componentName, folder) => {
  const componentFolder = `${folder}/${componentName}`;
  await fs.mkdir(componentFolder);
  await Promise.all([
    fs.writeFile(
      `${componentFolder}/${componentName}.tsx`,
      componentTemplate(componentName)
    ),
    fs.writeFile(`${componentFolder}/index.tsx`, indexTemplate(componentName)),
  ]);
};

generate(process.argv[2], process.argv[3]);
