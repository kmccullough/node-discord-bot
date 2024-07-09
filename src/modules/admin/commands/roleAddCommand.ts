import { Command } from "@enitoni/gears-discordjs"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { UsageError } from "../../core/classes"
import { sendMessage } from "../../core/helpers"
import { matchCommandsOrFallback } from "../../../gears"
import { AdminService } from "../services"

export const roleAddCommand = new Command()
  .match(matchCommandsOrFallback("add"))
  .use(async (context) => {
    const service = context.manager.getService(AdminService)
    const role = context.content.trim()
    if (!role)
      throw new UsageError("Specify role to add as admin", [{
        name: "Admin roles",
        value: service.roles.join(", "),
      }])
    await service.addRole(role)
    if (service.roles.includes(role))
      throw new UsageError("Specified role is already admin", [{
        name: "Admin roles",
        value: service.roles.join(", "),
      }])
    const embed = new MessageEmbed({
      color: PRIMARY_COLOR,
      title: "Admin role added",
      description: role,
    })
    return sendMessage(context, embed)
  })
