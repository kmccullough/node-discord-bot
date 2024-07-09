import { Bot, Context } from "@enitoni/gears-discordjs"
import { core } from "@enitoni/gears"
import ServiceManager = core.ServiceManager
import { Message } from "discord.js"

export interface ServiceContext {
  bot: Bot,
  content: string,
  manager: ServiceManager<any, any>
  message: Message,
}

export type ContextLike = Context | ServiceContext;

export const createServiceContext = (bot: Bot, manager: ServiceManager<any, any>, message: Message): ServiceContext => ({
  bot,
  content: message.content,
  manager,
  message,
})
