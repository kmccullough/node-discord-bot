import { Middleware } from "@enitoni/gears-discordjs"
import { MessageEmbed } from "discord.js"
import { ERROR_COLOR } from "../../../constants"
import { PermissionError, UsageError } from "../classes"
import { sendMessage } from "../helpers"

export const handleError: Middleware = async (context, next) => {
  try {
    await next()
  } catch (error: any) {
    const embed = new MessageEmbed({
      color: ERROR_COLOR,
      title: "Oops, an unknown error occurred",
      description: error.message || error,
    })

    if (error instanceof PermissionError) {
      embed.setTitle("Permission error")
      embed.setDescription(error.reason)
    }

    if (error instanceof UsageError) {
      embed.setTitle("Usage error")
      embed.setDescription(error.reason)
    }

    return sendMessage(context, embed);
  }
}
