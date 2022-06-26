import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { mocked } from "jest-mock";

jest.mock("next-auth/react");

jest.mock("next-auth/react");

jest.mock("next/router");

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false] as any);
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirect user to signin when not authenticated", () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false] as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already subscribed", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
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

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMocked).toHaveBeenCalledWith("/posts");
  });
});
