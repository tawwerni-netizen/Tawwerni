import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

/**
 * Sends the welcome email once, and only once it actually goes out.
 *
 * `welcomedAt` is stamped on *delivery*, not on attempt. That means an account
 * created while email was misconfigured is still owed a welcome — so this is
 * called on sign-in as well as on sign-up, and the backlog clears itself the
 * moment SMTP starts working. Without the sign-in call, everyone who joined
 * during an outage would silently never be welcomed.
 *
 * Never throws: a mail problem must not be able to fail a login.
 */
export async function maybeSendWelcome(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, welcomedAt: true },
    });

    if (!user || user.welcomedAt) return;

    const tpl = welcomeEmail({ name: user.name });
    const sent = await sendEmail({
      to: user.email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });

    if (sent.ok && sent.delivered) {
      await prisma.user.update({
        where: { id: user.id },
        data: { welcomedAt: new Date() },
      });
    }
  } catch (err) {
    console.error("[welcome:failed]", err instanceof Error ? err.message : err);
  }
}
