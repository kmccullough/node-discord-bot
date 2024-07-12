import { CommandGroup } from "@enitoni/gears-discordjs"
import { matchPrefixes } from "@enitoni/gears"
import { addCommand, removeCommand } from "../commands"
import { requirePermission } from "../../permission/middleware"

export const autobanGroup = new CommandGroup()
  .match(matchPrefixes("at", "autoban"))
  .use(requirePermission("autoban", "autoban-all"))
  .setCommands(addCommand, removeCommand)
