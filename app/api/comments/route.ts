import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";
import { sql } from "@vercel/postgres";

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

export const revalidate = 0;

async function getAvatar(username: string): Promise<string> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github+json",
    },
    next: {
      revalidate: 60 * 60 * 24, // 1 day
    },
  });
  const data = await response.json();
  return data.avatar_url;
}

export async function GET(request: NextRequest) {
  const location = new URL(request.url).searchParams.get("location");
  if (!location) {
    return NextResponse.json({ error: "Missing location" }, { status: 400 });
  }

  const { rows } =
    await sql<Comment>`select * from comments where location = ${location} order by created_at`;
  const authors: Author[] = await Promise.all(
    getAuthors(rows).map(async (username) => {
      return {
        username,
        picture: await getAvatar(username),
      };
    })
  );

  return NextResponse.json(
    rows.map(({ author, ...row }) => {
      const authorData = authors.find((a) => a.username === author);
      return { ...row, author: authorData };
    })
  );
}

const getAuthors = (rows: Comment[]): string[] => {
  const authors = new Set<string>();
  rows.forEach((row) => authors.add(row.author));
  return Array.from(authors);
};

export async function POST(request: NextRequest) {
  const { location, content } = await request.json();

  const octokit = new Octokit({
    auth: request.headers.get("authorization"),
  });
  const user = await octokit.request("GET /user");

  if (user.status !== 200 || !user.data.login) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  if (!location || !content) {
    return NextResponse.json(
      { error: "Missing location or content" },
      { status: 400 }
    );
  }

  await sql<Comment>`
    insert into comments (location, author, content)
    values (${location}, ${user.data.login}, ${content})
    returning *
  `;

  const newComments =
    await sql<Comment>`select * from comments where location = ${location} order by created_at`;

  return NextResponse.json(newComments.rows, { status: 201 });
}
