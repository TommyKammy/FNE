import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

const runtimeMock = vi.hoisted(() => {
  const destroy = vi.fn();
  const mountRuntime = vi.fn(() => ({ destroy }));

  return { destroy, mountRuntime };
});

vi.mock("@fne/runtime", () => ({
  mountRuntime: runtimeMock.mountRuntime
}));

describe("App", () => {
  afterEach(() => {
    runtimeMock.destroy.mockClear();
    runtimeMock.mountRuntime.mockClear();
  });

  it("mounts and unmounts the Phaser runtime inside the React shell", () => {
    const { unmount } = render(<App />);

    expect(
      screen.getByRole("heading", { name: "Friday Night English" })
    ).toBeVisible();

    const host = screen.getByTestId("phaser-host");

    expect(host).toBeVisible();
    expect(runtimeMock.mountRuntime).toHaveBeenCalledWith(host);

    unmount();

    expect(runtimeMock.destroy).toHaveBeenCalledTimes(1);
  });
});
