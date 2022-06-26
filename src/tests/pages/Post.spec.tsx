import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { stripe } from "../../services/stripe";
import { createClient } from "../../services/prismic";
import { getSession } from "next-auth/react";

const posts = {
  slug: "my-new-post",
  title: "new post",
  content: "<p>post except</p>",
  updatedAt: "2021-04-05T10:00:00.000Z",
};
jest.mock("../../services/prismic");
jest.mock("next-auth/react");

describe("Post Page", () => {
  it("renders correctly", () => {
    render(<Post postData={posts} />);

    expect(screen.getByText("new post")).toBeInTheDocument();
    expect(screen.getByText("post except")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any);

    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: {
        slug: "my-new-post",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: `/posts/preview/${"my-new-post"}`,
          permanent: false,
        },
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    const prismicClientMocked = mocked(createClient);

    prismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
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
      }),
    } as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: "my-new-post",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          postData: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>post content</p>",
            updatedAt: "01 de abril de 2021",
          },
        },
      })
    );
  });
});
