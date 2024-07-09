import { Middleware } from "@enitoni/gears-discordjs"
import { PermissionError } from "../../core/classes"
import { AdminService } from "../services"

export const requireAdmin = (): Middleware => async (context, next) => {
  const { manager, message } = context
  const { member } = message
  const service = manager.getService(AdminService)

  if (member) {
    if (!service.isAdmin(member)) {
      throw new PermissionError(
        `You need one of the following roles to run this command:\n${service.roles.join(
          ", "
        )}`
      )
    }

    return next()
  }

  throw new PermissionError("This is a server only command")
}
