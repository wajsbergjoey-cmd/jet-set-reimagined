import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(40),
  picks: z.array(z.object({ title: z.string().max(40), value: z.string().max(300) })).max(10),
  suggestion: z.string().max(300),
});

export const sendMoodBoard = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    const name = `${data.firstName} ${data.lastName}`;
    await sendTemplateEmail("mood-board-request", "jetsettravelco1@gmail.com", {
      templateData: { name, email: data.email, phone: data.phone, picks: data.picks, suggestion: data.suggestion },
      replyTo: data.email,
      idempotencyKey: `mood-board-${crypto.randomUUID()}`,
    });
    return { ok: true };
  });
