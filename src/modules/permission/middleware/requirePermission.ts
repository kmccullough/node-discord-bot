import { Middleware } from "@enitoni/gears-discordjs"
import { PermissionError } from "../../core/classes"
import { PermissionService } from "../services"

export const requirePermission = (...anyPermission: string[]): Middleware => async (context, next) => {
  const { manager, message } = context
  const { member } = message
  if (!member)
    throw new PermissionError("This is a server only command")
  if (!manager.getService(PermissionService).hasPermission(member, ...anyPermission))
    throw new PermissionError(
      "You need permission to run this command:\n" + anyPermission.join(", ")
    )
  return next()
}
