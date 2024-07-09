import { Command } from "@enitoni/gears-discordjs"
import { matchAlways } from "@enitoni/gears"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { sendMessage } from "../../core/helpers"

export const adminCommands = ["role", "user"]

export const adminCommand = new Command()
  .match(matchAlways())
  .use(async (context) => {
    const embed = new MessageEmbed({
      color: PRIMARY_COLOR,
      title: "Manage admin users/roles",
      fields: [
        {
          name: "Commands",
          value: adminCommands.join(", "),
        },
      ],
    })
    return sendMessage(context, embed)
  })
