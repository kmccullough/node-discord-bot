import { Command } from "@enitoni/gears-discordjs"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { UsageError } from "../../core/classes"
import { sendMessage } from "../../core/helpers"
import { matchCommandsOrFallback } from "../../../gears"
import { AdminService } from "../services"

export const roleRemoveCommand = new Command()
  .match(matchCommandsOrFallback("remove"))
  .use(async (context) => {
    const service = context.manager.getService(AdminService)
    const role = context.content.trim()
    if (!role)
      throw new UsageError("Specify role to remove as admin", [{
        name: "Admin roles",
        value: service.roles.join(", "),
      }])
    if (!service.roles.includes(role))
      throw new UsageError("Specified role is not admin", [{
        name: "Admin roles",
        value: service.roles.join(", "),
      }])
    await service.removeRole(role)
    const embed = new MessageEmbed({
      color: PRIMARY_COLOR,
      title: `Admin role removed`,
      description: role,
    })
    return sendMessage(context, embed)
  })
