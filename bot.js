// bot.js
import { Telegraf, Markup } from "telegraf";

/*
  ================ CONFIGURATION - EDIT THESE ================
*/
const BOT_TOKEN = "7196730171:AAGTkk4qCjqKYXT8eg3-_bwajSMnEaAkl0w";
const CHANNEL_USERNAME = "XRROOT"; // without @

// Default site link (shown also in parts if you want)
const DEFAULT_SITE_LINK = "https://earnlinks.in/4AP0v";

// Contact username shown in Contact button / URL
const CONTACT_USERNAME = "XRROOTYT"; // will open t.me/XRROOTYT

// Demo disclaimer text (you can change)
const DISCLAIMER_TEXT = `📜 *Disclaimer (Demo)*

This is a demo disclaimer for @${CHANNEL_USERNAME}.
Make sure you follow channel rules and do not share credentials.
For help contact @${CONTACT_USERNAME}.`;

/*
  PART arrays - Edit these 10 items as needed.
  IMPORTANT: All arrays MUST have exactly 10 items (index 0 = Part 1).
*/
const PART_NAMES = [
  "Part 1 - Starter",
  "Part 2 - Basic",
  "Part 3 - Advanced",
  "Part 4 - Pro",
  "Part 5 - VIP",
  "Part 6 - Elite",
  "Part 7 - Master",
  "Part 8 - Ultra",
  "Part 9 - Ultimate",
  "Part 10 - Supreme"
];

const PART_USERIDS = [
  "IronLockX_2025_P1","IronLockX_2025_P2","IronLockX_2025_P3","IronLockX_2025_P4","IronLockX_2025_P5",
  "IronLockX_2025_P6","IronLockX_2025_P7","IronLockX_2025_P8","IronLockX_2025_P9","IronLockX_2025_P10"
];

const PART_PASSWORDS = [
  "K3y_St0rm@P1","K3y_St0rm@P2","K3y_St0rm@P3","K3y_St0rm@P4","K3y_St0rm@P5",
  "K3y_St0rm@P6","K3y_St0rm@P7","K3y_St0rm@P8","K3y_St0rm@P9","K3y_St0rm@P10"
];

const PART_LINKS = [
  "https://earnlinks.in/4AP0v/part1","https://earnlinks.in/4AP0v/part2","https://earnlinks.in/4AP0v/part3",
  "https://earnlinks.in/4AP0v/part4","https://earnlinks.in/4AP0v/part5","https://earnlinks.in/4AP0v/part6",
  "https://earnlinks.in/4AP0v/part7","https://earnlinks.in/4AP0v/part8","https://earnlinks.in/4AP0v/part9",
  "https://earnlinks.in/4AP0v/part10"
];

const PART_IMAGES = [
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg", // part1
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg", // part2
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg", // change per part
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg",
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg",
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg",
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg",
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg",
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg",
  "https://winzomodapk.xyz/wp-content/uploads/2025/08/20250830_134924-scaled.jpg"
];
/* ========================================================== */

if (
  PART_NAMES.length !== 10 ||
  PART_USERIDS.length !== 10 ||
  PART_PASSWORDS.length !== 10 ||
  PART_LINKS.length !== 10 ||
  PART_IMAGES.length !== 10
) {
  console.error("ERROR: All PART_ arrays must have exactly 10 items.");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Helper: check membership
async function isUserInChannel(ctx, userId) {
  try {
    const chatId = `@${CHANNEL_USERNAME}`;
    const member = await ctx.telegram.getChatMember(chatId, userId);
    const status = member?.status || "";
    return ["member", "administrator", "creator"].includes(status);
  } catch (err) {
    console.error("getChatMember error:", err?.response?.description || err.message || err);
    return false;
  }
}

// /start -> show join button + check + contact + disclaimer (contact/disclaimer as inline)
bot.start((ctx) => {
  const joinBtn = Markup.button.url(`Join @${CHANNEL_USERNAME}`, `https://t.me/${CHANNEL_USERNAME}`);
  const checkBtn = Markup.button.callback("✅ I've Joined / Check", "check_join");
  const contactBtn = Markup.button.url("📞 Contact", `https://t.me/${CONTACT_USERNAME}`);
  const disclaimerBtn = Markup.button.callback("📜 Disclaimer", "open_disclaimer");

  return ctx.reply(
    `Welcome ${ctx.from.first_name}!\n\nPlease join our channel @${CHANNEL_USERNAME} first — then press "I've Joined / Check".`,
    Markup.inlineKeyboard([[joinBtn], [checkBtn, contactBtn, disclaimerBtn]])
  );
});

// check_join -> verify membership then show parts
bot.action("check_join", async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const joined = await isUserInChannel(ctx, userId);

  if (!joined) {
    return ctx.reply(`🚨 You are not a member of @${CHANNEL_USERNAME}. Please join: https://t.me/${CHANNEL_USERNAME}`);
  }

  // Build 10 part buttons (2 rows x 5)
  const buttons = [];
  for (let i = 0; i < 10; i++) {
    buttons.push(Markup.button.callback(PART_NAMES[i], `part_${i}`));
  }
  const keyboard = [];
  keyboard.push(buttons.slice(0,5));
  keyboard.push(buttons.slice(5,10));

  // Also add Contact + Disclaimer below parts
  const contactBtn = Markup.button.url("📞 Contact", `https://t.me/${CONTACT_USERNAME}`);
  const disclaimerBtn = Markup.button.callback("📜 Disclaimer", "open_disclaimer");

  await ctx.reply("✅ Verified. Choose a Part (1–10):", Markup.inlineKeyboard([...keyboard, [contactBtn, disclaimerBtn]]));
});

// callback for parts
bot.action(/part_\d+/, async (ctx) => {
  await ctx.answerCbQuery();
  const data = ctx.callbackQuery?.data || "";
  const idx = parseInt(data.split("_")[1], 10);
  if (isNaN(idx) || idx < 0 || idx > 9) {
    return ctx.reply("Invalid selection.");
  }

  // re-verify membership to be safe
  const userId = ctx.from.id;
  const joined = await isUserInChannel(ctx, userId);
  if (!joined) {
    return ctx.reply(`You are not a member of @${CHANNEL_USERNAME}. Please join and check again.`);
  }

  // build caption
  const caption =
    `🔓 *${PART_NAMES[idx]}* — Access Details\n\n` +
    `🔗 Download Link: ${PART_LINKS[idx]}\n` +
    `🆔 User ID: \`${PART_USERIDS[idx]}\`\n` +
    `🔑 Password: \`${PART_PASSWORDS[idx]}\`\n\n` +
    `Part: ${idx + 1} / 10\n\n` +
    `Contact: @${CONTACT_USERNAME}`;

  // send image (from URL) with caption and a row of buttons (Open Link, Contact, Disclaimer)
  const openLinkBtn = Markup.button.url("🔗 Open Download", PART_LINKS[idx]);
  const contactBtn = Markup.button.url("📞 Contact", `https://t.me/${CONTACT_USERNAME}`);
  const disclaimerBtn = Markup.button.callback("📜 Disclaimer", "open_disclaimer");

  try {
    await ctx.replyWithPhoto(PART_IMAGES[idx], {
      caption,
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([[openLinkBtn], [contactBtn, disclaimerBtn]])
    });
  } catch (err) {
    console.error("Failed to send image:", err);
    // fallback to text only
    await ctx.reply(caption, { parse_mode: "Markdown", ...Markup.inlineKeyboard([[openLinkBtn], [contactBtn, disclaimerBtn]]) });
  }
});

// Open disclaimer -> show a message with Close button
bot.action("open_disclaimer", async (ctx) => {
  await ctx.answerCbQuery();
  const closeBtn = Markup.button.callback("Close ❌", "close_disclaimer");
  // Send ephemeral message (normal reply) with close button
  await ctx.reply(DISCLAIMER_TEXT, { parse_mode: "Markdown", ...Markup.inlineKeyboard([[closeBtn]]) });
});

// Close disclaimer -> delete the last disclaimer message if possible (best-effort)
bot.action("close_disclaimer", async (ctx) => {
  await ctx.answerCbQuery();
  // Try to delete the message that had the disclaimer (callback message)
  try {
    // callbackQuery.message is the message where button was pressed (not always the disclaimer message)
    // We'll attempt to delete the message where callback came from.
    const msg = ctx.callbackQuery.message;
    if (msg) {
      await ctx.deleteMessage(msg.message_id);
      return;
    }
  } catch (err) {
    console.error("deleteMessage failed:", err);
  }
  // fallback: send a short "closed" confirmation
  await ctx.reply("Disclaimer closed.");
});

// simple /myid
bot.command("myid", (ctx) => ctx.reply(`Your Telegram ID: ${ctx.from.id}`));

// launch
bot.launch()
  .then(() => console.log("🚀 Bot started"))
  .catch((e) => console.error("Launch failed:", e));

// graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
