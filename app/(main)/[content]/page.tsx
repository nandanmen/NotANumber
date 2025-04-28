import { getPost } from "~/lib/content.server"
import { PostPage } from "./post";

export default async function ContentPage({ params }: { params: { content: string } }) {
    const post = await getPost(params.content);
    return <PostPage content={post} />
}