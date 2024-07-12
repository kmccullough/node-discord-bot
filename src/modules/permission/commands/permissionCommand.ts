import { Command } from "@enitoni/gears-discordjs"
import { sendMessage } from "../../core/helpers"
import { matchCommandsOrFallback } from "../../../gears"
import { requirePermission } from "../middleware"
import { PermissionService } from "../services"
import { UsageError } from "../../core/classes"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"

export const permissionCommand = new Command()
  .match(matchCommandsOrFallback("permission", "permissions"))
  .use(requirePermission("permission", "permission-all"))
  .use(async (context) => {
    const { member } = context.message
    if (!member) return
    const service = context.manager.getService(PermissionService)
    const role = context.content.trim()
    if (!role)
      throw new UsageError("Specify role to list permissions", [{
        name: "Roles",
        value: Object.keys(service.permissions).join(", "),
      }])
    return sendMessage(context, new MessageEmbed({
      color: PRIMARY_COLOR,
      title: "Permissions for role: " + role,
      description: service.getRolePermissions(role).join(", ") ||
        (service.isOwner(member) ? "grant, permission" : "No Permissions"),
    }))
  })
