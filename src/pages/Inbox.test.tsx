import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Inbox from "@/pages/Inbox";
import { seedFeedback } from "@/data/feedback";

function renderInbox() {
  render(
    <TooltipProvider>
      <Inbox />
      <Toaster />
    </TooltipProvider>,
  );
}

const detailHeading = () => screen.getByRole("heading", { level: 2 });

describe("Delete feedback", () => {
  it("keeps the item when the deletion is cancelled", async () => {
    const user = userEvent.setup();
    renderInbox();
    const first = seedFeedback[0]!;
    expect(detailHeading()).toHaveTextContent(first.summary);

    await user.click(screen.getByRole("button", { name: "Delete feedback" }));
    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByText("Delete this feedback?")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(detailHeading()).toHaveTextContent(first.summary);
    expect(screen.getAllByText(first.summary).length).toBeGreaterThan(1);
    expect(screen.queryByText("Feedback deleted")).not.toBeInTheDocument();
  });

  it("removes the item and selects another after confirming", async () => {
    const user = userEvent.setup();
    renderInbox();
    const first = seedFeedback[0]!;
    const second = seedFeedback[1]!;

    await user.click(screen.getByRole("button", { name: "Delete feedback" }));
    await user.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Delete" }),
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.queryByText(first.summary)).not.toBeInTheDocument();
    expect(detailHeading()).toHaveTextContent(second.summary);
    expect(await screen.findByText("Feedback deleted")).toBeInTheDocument();
  });
});
