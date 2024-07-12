import { Command } from "@enitoni/gears-discordjs"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { UsageError } from "../../core/classes"
import { sendMessage } from "../../core/helpers"
import { matchCommandsOrFallback } from "../../../gears"
import { PermissionService } from "../services"
import { requirePermission } from "../middleware"

const whitespace = /\s+/

export const grantCommand = new Command()
  .match(matchCommandsOrFallback("grant"))
  .use(requirePermission("grant", "permission-all"))
  .use(async (context) => {
    const service = context.manager.getService(PermissionService)
    const [ role, ...permissions ] = context.content.trim().split(whitespace)
    if (!role)
      throw new UsageError("Specify role and permissions to grant")
    if (!permissions.length)
      throw new UsageError("Specify permissions to grant")
    await service.grantRolePermissions(role, ...permissions)
    return sendMessage(context, new MessageEmbed({
      color: PRIMARY_COLOR,
      title: "Permission granted",
    }))
  })
