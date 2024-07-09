import { PermissionResolvable, TextChannel } from "discord.js"
import { getChannelName } from "./channel"
import { ContextLike } from "./context"

export const hasChannelPermission = (context: ContextLike, permission: PermissionResolvable, checkAdmin?: boolean): boolean =>
  context.message.channel instanceof TextChannel
    ? (context.message.guild?.me?.permissionsIn(context.message.channel)?.has(permission, checkAdmin) || false)
    : true

export const hasPermission = (context: ContextLike, permission: PermissionResolvable, checkAdmin?: boolean): boolean =>
  context.message.guild?.me?.hasPermission(permission, { checkAdmin }) || false

export const permissionError = (context: ContextLike, action: string, forChannel = false): void => {
  if (forChannel) {
    console.error(`Bot has no permission to ${action} in channel: ` + getChannelName(context))
  } else {
    console.error(`Bot has no permission to ${action}.`)
  }
}
