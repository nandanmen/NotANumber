import { GridBackground } from "~/components/Grid";

type Token = {
  type: string;
  value: string;
};

type Group = {
  type: string;
  children: (Group | Token)[];
};

const token = (value: string) => ({ type: "token", value });

const keyword = (value: string) => ({ type: "keyword", value });

const oneOf = (tokens: (Group | Token)[]) => ({
  type: "or",
  children: tokens,
});

const optionalMany = (tokens: (Group | Token)[]) => ({
  type: "optionalMany",
  children: tokens,
});

const rule = (rule: string) => ({
  type: "rule",
  value: rule,
});

const RULES = {
  VariableDeclaration: [
    oneOf([keyword("const"), keyword("let"), keyword("var")]),
    token("="),
    rule("Expression"),
  ],
  Expression: [
    oneOf([
      token("Identifier"),
      rule("MemberExpression"),
      rule("CallExpression"),
    ]),
  ],
  MemberExpression: [
    token("Identifier"),
    optionalMany([token("."), rule("Expression")]),
  ],
  CallExpression: [
    token("Identifier"),
    optionalMany([token("("), optionalMany([token("Identifier")]), token(")")]),
  ],
};

export const TopDownParser = () => {
  return (
    <GridBackground>
      {Object.entries(RULES).map(([name, definition]) => {
        console.log(definition);
        return (
          <div key={name}>
            <p>{name}</p>
          </div>
        );
      })}
    </GridBackground>
  );
};
