import { matchAlways } from "@enitoni/gears"
import { Command } from "@enitoni/gears-discordjs"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { AdminService } from "../services"
import { sendMessage } from "../../core/helpers"

export const roleCommands = ["add", "remove"]

export const roleCommand = new Command()
  .match(matchAlways())
  .use(async (context) => {
    const service = context.manager.getService(AdminService)
    const embed = new MessageEmbed({
      color: PRIMARY_COLOR,
      title: "Manage admin roles",
      fields: [
        {
          name: "Commands",
          value: roleCommands.join(", "),
        },
        {
          name: "Admin roles",
          value: service.roles.length ? `${service.roles.join(", ")}` : "No admin roles",
        },
      ],
    })
    return sendMessage(context, embed)
  })
