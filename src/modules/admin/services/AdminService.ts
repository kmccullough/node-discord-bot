import { Service } from "@enitoni/gears-discordjs"
import { JSONStorage } from "../../../common/storage/classes"
import { GuildMember } from "discord.js"

export interface AdminStorage {
  roles?: string[],
  users?: string[],
}

const storage = new JSONStorage<AdminStorage>("admin.json", {
  roles: ["Admin", "Moderator", "MVP"],
})

export class AdminService extends Service {
  public async serviceDidInitialize() {
    await storage.restore()
  }

  public async addRole(role: string) {
    const { roles = [] } = storage.data
    if (!roles.includes(role))
      await storage.save({ ...storage.data, roles: [...roles, role] })
  }

  public async removeRole(role: string) {
    const { roles = [] } = storage.data
    if (roles.includes(role))
      await storage.save({ ...storage.data, roles: roles.filter(v => v !== role) })
  }

  public async addUser(user: string) {
    const { users = [] } = storage.data
    if (!users.includes(user))
      await storage.save({ ...storage.data, users: [...users, user] })
  }

  public async removeUser(user: string) {
    if (this.users.includes(user)) {
      await storage.save({ ...storage.data, users: this.users.filter(v => v !== user) })
    }
  }

  public get roles() {
    return storage.data.roles || []
  }

  public get users() {
    return storage.data.users || []
  }

  public isAdmin(member: GuildMember) {
    return member.id === member.guild.ownerID || this.users.includes(member.id) ||
      member.roles.cache.some((role) => this.roles.includes(role.name))
  }
}
