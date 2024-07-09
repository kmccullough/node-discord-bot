import { User } from "discord.js"
import { Context } from "@enitoni/gears-discordjs"

const matchId = /^\s*<@([0-9]+)>\s*$/

export const getEmbeddedUserId = (id: string): string => id.match(matchId)?.[1] ?? ""

export const getUserMatches = (context: Context, user: string) => {
  let id = getEmbeddedUserId(user)
  const exact: User[] = []
  const match: string[] = []
  if (!id) {
    context.bot.client.users.cache.some(u => {
      if (u.tag === user) {
        id = u.id
        return true
      }
      const tag = u.tag.slice(0, u.tag.lastIndexOf('#'))
      if (user === tag) {
        exact.push(u)
      } else if (u.tag.startsWith(user)) {
        match.push(u.tag)
      }
      return false
    })
    if (exact.length === 1)
      id = exact[0].id
  }
  return { id, exact, match }
}

export const getUsersById = (context: Context, ids: string[]) => {
  const users: User[] = []
  context.bot.client.users.cache.forEach(u => {
    if (ids.includes(u.id))
      users.push(u)
  })
  return users
}

export const getUserTagsById = (context: Context, ids: string[]) => getUsersById(context, ids).map(u => u.tag)
