import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { stripe } from "../../services/stripe";
import { createClient } from "../../services/prismic";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const posts = {
  slug: "my-new-post",
  title: "new post",
  content: "<p>post except</p>",
  updatedAt: "2021-04-05T10:00:00.000Z",
};
jest.mock("../../services/prismic");
jest.mock("next/router");
jest.mock("next-auth/react");

describe("Post preview Page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false] as any);

    render(<PostPreview postData={posts} />);

    expect(screen.getByText("new post")).toBeInTheDocument();
    expect(screen.getByText("post except")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        session: {
          user: {
            name: "John Doe",
            email: "john@doe.com",
          },
        },
        activeSubscription: "fake-subscription",
        expires: "fake-expires",
      },
      status: "authenticated",
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<PostPreview postData={posts} />);

    expect(pushMocked).toHaveBeenCalledWith(`/posts/${posts.slug}`);
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

    const response = await getStaticProps({
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
