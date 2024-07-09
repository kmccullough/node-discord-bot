import { Command } from "@enitoni/gears-discordjs"
import { MessageEmbed, User } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { UsageError } from "../../core/classes"
import { getUserMatches, getUserTagsById, sendMessage } from "../../core/helpers"
import { matchCommandsOrFallback } from "../../../gears"
import { AdminService } from "../services"

export const userAddCommand = new Command()
  .match(matchCommandsOrFallback("add"))
  .use(async (context) => {
    const service = context.manager.getService(AdminService)
    const users = getUserTagsById(context, service.users).join(", ") || "No admin users"
    const user = context.content.trim()
    if (!user)
      throw new UsageError("Specify user to add as admin")
    const { id, exact, match} = getUserMatches(context, user)
    if (!id)
      throw new UsageError("Specified user not found", !(exact.length || match.length) ? [] : [{
        name: "User matches",
        value: [...exact.map(u => u.tag), ...match].join(", "),
      }])
    if (service.users.includes(id))
      throw new UsageError("Specified user is already admin", [{
        name: "Admin users",
        value: users,
      }])
    await service.addUser(id)
    const embed = new MessageEmbed({
      color: PRIMARY_COLOR,
      title: "Admin user added",
      description: user,
    })
    return sendMessage(context, embed)
  })
