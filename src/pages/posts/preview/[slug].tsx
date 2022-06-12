import { GetStaticPaths, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { createClient } from "../../../services/prismic";
import styles from "../post.module.scss";

type postsPropsFromPrismic = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostPreviewProps {
  postData: postsPropsFromPrismic;
}

const PostPreview = ({ postData }: PostPreviewProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${postData.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{postData.title} | IgNews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{postData.title}</h1>
          <time>{postData.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: postData.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export const getStaticPaths = () => {
  return {
    paths: [] as any,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const { slug } = params;

  const prismic = createClient();

  const response = await prismic.getByUID("ignews-publication", slug);

  const postData = {
    slug: response.uid,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-br",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      postData,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};

export default PostPreview;
