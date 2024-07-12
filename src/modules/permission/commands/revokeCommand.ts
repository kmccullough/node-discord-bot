import { Command } from "@enitoni/gears-discordjs"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { UsageError } from "../../core/classes"
import { sendMessage } from "../../core/helpers"
import { matchCommandsOrFallback } from "../../../gears"
import { PermissionService } from "../services"
import { requirePermission } from "../middleware"

const whitespace = /\s+/

export const revokeCommand = new Command()
  .match(matchCommandsOrFallback("revoke"))
  .use(requirePermission("revoke", "permission-all"))
  .use(async (context) => {
    const service = context.manager.getService(PermissionService)
    const [ role, ...permissions ] = context.content.trim().split(whitespace)
    if (!role)
      throw new UsageError("Specify role and permissions to revoke")
    const rolePermissions = service.getRolePermissions(role).join(", ")
    if (!rolePermissions)
      throw new UsageError("No permissions for role: " + role)
    if (!permissions.length)
      throw new UsageError("Specify permissions to revoke", [{
        name: "Permissions for role: " + role,
        value: rolePermissions || "No Permissions",
      }])
    await service.revokeRolePermissions(role, ...permissions)
    return sendMessage(context, new MessageEmbed({
      color: PRIMARY_COLOR,
      title: "Permission revoked",
    }))
  })
