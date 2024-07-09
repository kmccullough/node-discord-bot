import { Command } from "@enitoni/gears-discordjs"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { UsageError } from "../../core/classes"
import { getUserMatches, getUsersById, getUserTagsById, sendMessage } from "../../core/helpers"
import { matchCommandsOrFallback } from "../../../gears"
import { AdminService } from "../services"

export const userRemoveCommand = new Command()
  .match(matchCommandsOrFallback("remove"))
  .use(async (context) => {
    const service = context.manager.getService(AdminService)
    const users = getUserTagsById(context, service.users).join(", ") || "No admin users"
    const user = context.content.trim()
    if (!user)
      throw new UsageError("Specify user to remove as admin", [{
        name: "Admin users",
        value: users,
      }])
    const { id } = getUserMatches(context, user)
    if (!id)
      throw new UsageError("Specified user not found", [{
        name: "Admin users",
        value: users,
      }])
    if (!service.users.includes(id))
      throw new UsageError("Specified user is not admin", [{
        name: "Admin users",
        value: users,
      }])
    await service.removeUser(id)
    const embed = new MessageEmbed({
      color: PRIMARY_COLOR,
      title: "Admin user removed",
      description: user,
    })
    return sendMessage(context, embed)
  })
