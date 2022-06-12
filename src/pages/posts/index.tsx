import { GetStaticProps } from "next";
import Head from "next/head";
import { createClient } from "../../services/prismic";
import styles from "./styles.module.scss";
import { RichText } from "prismic-dom";
import Link from "next/link";

type postsPropsFromPrismic = {
  slug: string;
  title: string;
  except: string;
  updatedAt: string;
};

interface PostsProps {
  posts: postsPropsFromPrismic[];
}

const Posts = ({ posts }: PostsProps) => {
  return (
    <>
      <Head>
        <title>Posts | IgNews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <div>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.except}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Posts;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = createClient();

  const response = await prismic.getAllByType("ignews-publication");

  const posts = response.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      except:
        post.data.content
          .find((content: any) => content.type === "paragraph")
          ?.text.split(".")[0] + "." ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-br",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
