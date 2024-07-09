import { MessageEmbed, Permissions } from "discord.js"
import { getChannelName, hasChannelPermission, hasPermission, permissionError } from "../helpers"
import { ContextLike } from "./context"

export const joinPair = (label: any, text: any): string =>
  (label ? "**" + label + "**" : "") + ((label && text) ? ": " : "") +
  (text ? (text.includes("\n") ? "\n" : "") + text : "")

export const sendMessage = (context: ContextLike, msg: MessageEmbed|string, options: { text?: string, private?: boolean } = {}) => {
  options ||= {}
  if (!hasChannelPermission(context, Permissions.FLAGS.SEND_MESSAGES)) {
    permissionError(context, "send messages", !hasPermission(context, Permissions.FLAGS.SEND_MESSAGES))
    return
  }
  const channel = options.private ? context.message.member?.user : context.message.channel
  if (!channel) {
    console.error("Error sending message to user")
    return
  }
  if (msg instanceof MessageEmbed) {
    if (!hasPermission(context, Permissions.FLAGS.EMBED_LINKS)) {
      console.error("Bot has no permission to send embedded links.")
    } else if (!hasChannelPermission(context, Permissions.FLAGS.EMBED_LINKS)) {
      console.error("Bot has no permission to send embedded links in channel: " + getChannelName(context))
    } else {
      return channel.send({ embed: msg })
    }
  }
  let text
  if (typeof options.text === "string") {
    text = options.text
  } else if (typeof msg === "string") {
    text = msg
  } else {
    text = joinPair(msg.title, msg.description)
    text += (text ? "\n\n" : "") + msg.fields?.map(f => joinPair(f.name, f.value)).join("\n\n")
  }
  if (text)
    return channel.send(text)
}
