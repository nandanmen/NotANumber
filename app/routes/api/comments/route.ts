import { neon } from "@neondatabase/serverless";
import type { Route } from "./+types/route";

type Comment = {
  id: string;
  location: string;
  author: string;
  content: string;
  created_at: string;
};

type Author = {
  username: string;
  picture: string;
};

const GITHUB_HEADERS = {
  "X-GitHub-Api-Version": "2022-11-28",
  Accept: "application/vnd.github+json",
  // The GitHub API rejects requests without a User-Agent.
  "User-Agent": "nan.fyi",
};

async function getAvatar(username: string): Promise<string> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: GITHUB_HEADERS,
    // Cache avatars at the edge for a day.
    cf: { cacheTtl: 60 * 60 * 24, cacheEverything: true },
  });
  const data = (await response.json()) as { avatar_url: string };
  return data.avatar_url;
}

const getAuthors = (rows: Comment[]): string[] => {
  const authors = new Set<string>();
  for (const row of rows) authors.add(row.author);
  return Array.from(authors);
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const location = new URL(request.url).searchParams.get("location");
  if (!location) {
    return Response.json({ error: "Missing location" }, { status: 400 });
  }

  const sql = neon(context.cloudflare.env.POSTGRES_URL);
  const rows = (await sql`select * from comments where location = ${location} order by created_at`) as Comment[];
  const authors: Author[] = await Promise.all(
    getAuthors(rows).map(async (username) => ({
      username,
      picture: await getAvatar(username),
    })),
  );

  return Response.json(
    rows.map(({ author, ...row }) => {
      const authorData = authors.find((a) => a.username === author);
      return { ...row, author: authorData };
    }),
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const { location, content } = (await request.json()) as {
    location?: string;
    content?: string;
  };

  const authorization = request.headers.get("authorization");
  const userResponse = authorization
    ? await fetch("https://api.github.com/user", {
        headers: { ...GITHUB_HEADERS, Authorization: authorization },
      })
    : null;
  const user = userResponse?.ok
    ? ((await userResponse.json()) as { login?: string })
    : null;

  if (!user?.login) {
    return Response.json({ error: "Not authorized" }, { status: 401 });
  }

  if (!location || !content) {
    return Response.json(
      { error: "Missing location or content" },
      { status: 400 },
    );
  }

  const sql = neon(context.cloudflare.env.POSTGRES_URL);
  await sql`
    insert into comments (location, author, content)
    values (${location}, ${user.login}, ${content})
    returning *
  `;

  const newComments =
    await sql`select * from comments where location = ${location} order by created_at`;

  return Response.json(newComments, { status: 201 });
}
