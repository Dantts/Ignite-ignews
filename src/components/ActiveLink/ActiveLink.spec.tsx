import { render } from "@testing-library/react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("ActiveLink componenet", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <ActiveLink href={"/"} activeClassname="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(getByText("Home")).toBeInTheDocument();
  });

  it("adds active class if the link as correctly active", () => {
    const { getByText } = render(
      <ActiveLink href={"/"} activeClassname="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(getByText("Home")).toHaveClass("active");
  });
});
