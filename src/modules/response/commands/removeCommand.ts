import { Command } from "@enitoni/gears-discordjs"
import { matchPrefixes } from "@enitoni/gears"
import { ResponseService } from "../services"
import { UsageError } from "../../core/classes"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { sendMessage } from "../../core/helpers"
import { requirePermission } from "../../permission/middleware"

export const removeCommand = new Command()
  .match(matchPrefixes("remove"))
  .use(requirePermission("response-remove", "response-all"))
  .use(async (context) => {
    const { message, manager, content } = context
    const service = manager.getService(ResponseService)

    if (!content) {
      throw new UsageError("Specify the name of the response you want to remove")
    }

    await service.removeResponse(content.trim())

    const embed = new MessageEmbed({
      color: PRIMARY_COLOR,
      title: `Response "${content}" removed`,
    })

    return sendMessage(context, embed)
  })
