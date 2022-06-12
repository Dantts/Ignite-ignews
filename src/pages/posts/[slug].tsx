import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { createClient } from "../../services/prismic";
import styles from "./post.module.scss";

type postsPropsFromPrismic = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostProps {
  postData: postsPropsFromPrismic;
}

const Post = ({ postData }: PostProps) => {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: postData.content }}
          />
        </article>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}: any) => {
  const { slug } = params;
  const session = await getSession({ req });

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    };
  }

  const prismic = createClient({ req });

  const response = await prismic.getByUID("ignews-publication", slug);

  const postData = {
    slug: response.uid,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
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
  };
};

export default Post;
