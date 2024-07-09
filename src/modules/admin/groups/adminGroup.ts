import { CommandGroup } from "@enitoni/gears-discordjs"
import { matchAlways } from "@enitoni/gears"
import { adminCommand, roleCommand, roleAddCommand, roleRemoveCommand, userCommand, userAddCommand, userRemoveCommand } from "../commands"
import { matchCommands, matchCommandsOrFallback } from "../../../gears"
import { requireAdmin } from "../middleware"

const roleCommandsGroup = new CommandGroup()
  .match(matchCommands("role"))
  .setCommands(roleAddCommand, roleRemoveCommand)

const roleFallbackGroup = new CommandGroup()
  .match(matchCommandsOrFallback("role", "roles"))
  .setCommands(roleCommand)

const roleGroup = new CommandGroup()
  .match(matchAlways())
  .setCommands(roleCommandsGroup, roleFallbackGroup)

const userCommandsGroup = new CommandGroup()
  .match(matchCommands("user"))
  .setCommands(userAddCommand, userRemoveCommand)

const userFallbackGroup = new CommandGroup()
  .match(matchCommandsOrFallback("user", "users"))
  .setCommands(userCommand)

const userGroup = new CommandGroup()
  .match(matchAlways())
  .setCommands(userCommandsGroup, userFallbackGroup)

export const adminCommandsGroup = new CommandGroup()
  .match(matchCommands("admin"))
  .setCommands(roleGroup, userGroup)

export const adminFallbackGroup = new CommandGroup()
  .match(matchCommandsOrFallback("admin"))
  .setCommands(adminCommand)

export const adminGroup = new CommandGroup()
  .match(matchAlways())
  .use(requireAdmin())
  .setCommands(adminCommandsGroup, adminFallbackGroup)
