// bot.js
import { Telegraf, Markup } from "telegraf";

/*
  ================ CONFIGURATION ================
*/
const BOT_TOKEN = "7196730171:AAGTkk4qCjqKYXT8eg3-_bwajSMnEaAkl0w";
const CHANNEL_USERNAME = "XRROOT"; // without @
const CONTACT_USERNAME = "XRROOTYT"; // will open t.me/XRROOTYT

// Access details
const DOWNLOAD_LINK = "https://earnlinks.in/4AP0v";
const USER_ID = "IronLockX_2025";
const PASSWORD = "K3y_St0rm@2025";

// Image shown with access
const IMAGE_URL = "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg";

// Disclaimer text
const DISCLAIMER_TEXT = `📜 Disclaimer (Demo)

This is a demo disclaimer for @${CHANNEL_USERNAME}.
Make sure you follow channel rules and do not share credentials.
For help contact @${CONTACT_USERNAME}.`;
/* ============================================= */

const bot = new Telegraf(BOT_TOKEN);

// Helper: check membership
async function isUserInChannel(ctx, userId) {
  try {
    const chatId = @${CHANNEL_USERNAME};
    const member = await ctx.telegram.getChatMember(chatId, userId);
    const status = member?.status || "";
    return ["member", "administrator", "creator"].includes(status);
  } catch (err) {
    console.error("getChatMember error:", err?.response?.description || err.message || err);
    return false;
  }
}

// /start -> show join + check + contact + disclaimer
bot.start((ctx) => {
  const joinBtn = Markup.button.url(Join @${CHANNEL_USERNAME}, https://t.me/${CHANNEL_USERNAME});
  const checkBtn = Markup.button.callback("✅ I've Joined / Check", "check_join");
  const contactBtn = Markup.button.url("📞 Contact", https://t.me/${CONTACT_USERNAME});
  const disclaimerBtn = Markup.button.callback("📜 Disclaimer", "open_disclaimer");

  return ctx.reply(
    Welcome ${ctx.from.first_name}!\n\nPlease join our channel @${CHANNEL_USERNAME} first — then press "I've Joined / Check".,
    Markup.inlineKeyboard([[joinBtn], [checkBtn, contactBtn, disclaimerBtn]])
  );
});

// check_join -> verify membership then send single image + details
bot.action("check_join", async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const joined = await isUserInChannel(ctx, userId);

  if (!joined) {
    return ctx.reply(🚨 You are not a member of @${CHANNEL_USERNAME}. Please join: https://t.me/${CHANNEL_USERNAME});
  }

  // caption
  const caption =
    🔓 *Access Details*\n\n +
    🔗 Download Link: ${DOWNLOAD_LINK}\n +
    🆔 User ID: \${USER_ID}\\n +
    🔑 Password: \${PASSWORD}\\n\n +
    Contact: @${CONTACT_USERNAME};

  const openLinkBtn = Markup.button.url("🔗 Open Download", DOWNLOAD_LINK);
  const contactBtn = Markup.button.url("📞 Contact", https://t.me/${CONTACT_USERNAME});
  const disclaimerBtn = Markup.button.callback("📜 Disclaimer", "open_disclaimer");

  try {
    await ctx.replyWithPhoto(IMAGE_URL, {
      caption,
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([[openLinkBtn], [contactBtn, disclaimerBtn]])
    });
  } catch (err) {
    console.error("Failed to send image:", err);
    await ctx.reply(caption, { parse_mode: "Markdown", ...Markup.inlineKeyboard([[openLinkBtn], [contactBtn, disclaimerBtn]]) });
  }
});

// Disclaimer open/close
bot.action("open_disclaimer", async (ctx) => {
  await ctx.answerCbQuery();
  const closeBtn = Markup.button.callback("Close ❌", "close_disclaimer");
  await ctx.reply(DISCLAIMER_TEXT, { parse_mode: "Markdown", ...Markup.inlineKeyboard([[closeBtn]]) });
});

bot.action("close_disclaimer", async (ctx) => {
  await ctx.answerCbQuery();
  try {
    const msg = ctx.callbackQuery.message;
    if (msg) {
      await ctx.deleteMessage(msg.message_id);
      return;
    }
  } catch (err) {
    console.error("deleteMessage failed:", err);
  }
  await ctx.reply("Disclaimer closed.");
});

// simple /myid
bot.command("myid", (ctx) => ctx.reply(Your Telegram ID: ${ctx.from.id}));

// launch
bot.launch()
  .then(() => console.log("🚀 Bot started"))
  .catch((e) => console.error("Launch failed:", e));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
