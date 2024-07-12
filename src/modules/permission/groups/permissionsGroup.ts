import { CommandGroup } from "@enitoni/gears-discordjs"
import { matchAlways } from "@enitoni/gears"
import { permissionCommand, grantCommand, revokeCommand } from "../commands"

export const permissionsGroup = new CommandGroup()
  .match(matchAlways())
  .setCommands(permissionCommand, grantCommand, revokeCommand)
