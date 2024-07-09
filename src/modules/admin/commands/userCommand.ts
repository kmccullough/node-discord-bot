import { matchAlways } from "@enitoni/gears"
import { Command } from "@enitoni/gears-discordjs"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { AdminService } from "../services"
import { getUserTagsById, sendMessage } from "../../core/helpers"

export const userCommands = ["add", "remove"]

export const userCommand = new Command()
  .match(matchAlways())
  .use(async (context) => {
    const service = context.manager.getService(AdminService)
    const users = getUserTagsById(context, service.users).join(", ") || "No admin users"
    const embed = new MessageEmbed({
      color: PRIMARY_COLOR,
      title: "Manage admin users",
      fields: [
        {
          name: "Commands",
          value: userCommands.join(", "),
        },
        {
          name: "Admin users",
          value: users,
        },
      ],
    })
    return sendMessage(context, embed)
  })
