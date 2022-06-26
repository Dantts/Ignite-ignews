import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps } from "../../pages/posts";
import { stripe } from "../../services/stripe";
import { createClient } from "../../services/prismic";

type postsPropsFromPrismic = {
  slug: string;
  title: string;
  except: string;
  updatedAt: string;
};

const posts: postsPropsFromPrismic[] = [
  {
    slug: "my-new-post",
    title: "new post",
    except: "post except",
    updatedAt: "2021-04-05T10:00:00.000Z",
  },
];

jest.mock("../../services/prismic");

describe("Posts Page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("new post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const prismicClientMocked = mocked(createClient);

    prismicClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([
        {
          uid: "my-new-post",
          data: {
            title: [
              {
                type: "heading",
                text: "My new post",
              },
            ],
            content: [
              {
                type: "paragraph",
                text: "post content",
              },
            ],
          },
          last_publication_date: "04-01-2021",
        },
      ]),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "my-new-post",
              title: "My new post",
              except: "post content.",
              updatedAt: "01 de abril de 2021",
            },
          ],
        },
      })
    );
  });
});
