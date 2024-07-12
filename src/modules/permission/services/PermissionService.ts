import { Service } from "@enitoni/gears-discordjs"
import { JSONStorage } from "../../../common/storage/classes"
import { GuildMember } from "discord.js"

export interface AdminStoragePermission {
  role: string,
  grant: string[],
}

export interface AdminStorage {
  [permissionName: string]: AdminStoragePermission,
}

const defaultPermissions: AdminStorage = {
  "everyone": {
    role: "everyone",
    grant: ["about", "response"],
  }
};
for (const role of ["owner", "Admin", "Moderator", "MVP"]) {
  defaultPermissions[role] = {
    role,
    grant: ["all"],
  }
}
const storage = new JSONStorage<AdminStorage>("permission.json", defaultPermissions)

const distinctMerge = (...arrays: (undefined|any[])[]): any[] =>
  Array.from(new Set(arrays.flatMap(a => a || [])))

const filterOut = (array: any[], filterOut: any): any[] =>
  array.filter(f => f !== filterOut)

const filterOutArray = (array: any[], filterOut: any[]): any[] =>
  array.filter(v => filterOut.every(f => f !== v))

export class PermissionService extends Service {
  public async serviceDidInitialize() {
    await storage.restore()
  }

  public get permissions() {
    return storage.data || {}
  }

  public async grantRolePermissions(role: string, ...permissions: string[]) {
    const permission = this.permissions[role] ??= { role, grant: [] }
    permission.grant = distinctMerge(permission.grant, permissions)
    await storage.save({ ...storage.data, [role]: permission })
  }

  public async revokeRolePermissions(role: string, ...permissions: string[]) {
    const permission = this.permissions[role] ??= { role, grant: [] }
    permission.grant = filterOutArray(permission.grant, permissions)
    await storage.save({ ...storage.data, [role]: permission })
  }

  public async grantPermissionRoles(permission: string, ...roles: string[]) {
    const newStorage = { ...storage.data };
    for (const role of roles) {
      const p = this.permissions[role] ??= { role, grant: [] }
      p.grant = distinctMerge(p.grant, [permission])
      newStorage[role] = p
    }
    await storage.save(newStorage)
  }

  public async revokePermissionRoles(permission: string, ...roles: string[]) {
    let newStorage = { ...storage.data }
    for (const role of roles) {
      const p = this.permissions[role]
      if (!p)
        continue
      p.grant = filterOut(p.grant, permission)
      if (p.grant.length)
        newStorage[role] = p
      else
        delete newStorage[role]
    }
    await storage.save(newStorage)
  }

  public getRolePermissions(role: string) {
    return this.permissions[role.startsWith('@') ? role.slice(1) : role]?.grant || []
  }

  public isOwner(member: GuildMember) {
    return member.id === member.guild.ownerID
  }

  protected addOwnerImplicitPermissions(permissions: string[]) {
    let hasAll = false
    let hasNoAll = false
    let hasPermAll = false
    let hasNoPermAll = false
    let hasPerm = false
    let hasNoPerm = false
    let hasGrant = false
    for (let i = permissions.length - 1; i >= 0; --i) {
      switch (permissions[i]) {
        case "-grant":
          permissions.splice(i, 1)
          break
        case "grant":
          hasGrant = true
          break
        case "-permission-all":
          hasNoPermAll = true
          break
        case "permission-all":
          hasPermAll = true
          break
        case "-permission":
          hasNoPerm = true
          break
        case "permission":
          hasPerm = true
          break
        case "all":
          hasAll = true
          break
        case "-all":
          hasNoAll = true
      }
    }
    if ((!hasAll || hasNoAll) && (!hasPermAll || hasNoPermAll)) {
      if (!hasGrant)
        permissions.push("grant")
      if (!hasPerm)
        permissions.push("permission")
    }
    return permissions
  }

  public getMemberPermissions(member: GuildMember) {
    let permissions: string[] = [];
    const roles = member.roles.cache.map(r => r.name);
    const isOwner = this.isOwner(member);
    if (isOwner)
      roles.push("owner")
    for (const role of roles) {
      permissions.push(...this.getRolePermissions(role))
    }
    return isOwner ? this.addOwnerImplicitPermissions(permissions) : permissions
  }

  public getEffectivePermissions(member: GuildMember) {
    const allPermissions = this.getMemberPermissions(member);
    const blacklist = [];
    for (const grant of allPermissions) {
      if (grant.startsWith('-'))
        blacklist.push(grant.slice(1))
    }
    return filterOutArray(allPermissions, blacklist)
  }

  public hasPermission(member: GuildMember, ...anyPermission: string[]) {
    const permissions = this.getEffectivePermissions(member);
    const hasAll = permissions.includes("all")
    for (const permission of anyPermission) {
      if (permission.startsWith("-"))
        continue
      if (!permissions.includes("-" + permission) && (
        hasAll || permissions.includes(permission)
      )) {
        return true
      }
    }
    return false
  }
}
