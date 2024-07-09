import { TextChannel } from "discord.js"
import { ContextLike } from "./context"

export const getChannelName = (context: ContextLike): string =>
  context.message.channel instanceof TextChannel ? context.message.channel.name : ""
