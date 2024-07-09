import { Context } from "@enitoni/gears-discordjs"
import { matchAny, matchPrefixes } from "@enitoni/gears"

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const matchEqual = (...keywords: string[]) => (context: Context) => {
  const escaped = keywords.map(escapeRegExp)
  const regex = new RegExp(`^(${escaped.join("|")})$`, "i")
  if (!context.content.match(regex))
    return
  const newContent = context.content.replace(regex, "").trim()
  return Object.assign(Object.assign({}, context), { content: newContent })
}

export const matchCommands = (...keywords: string[]) => matchPrefixes(...keywords.map(k => k + " "))

export const matchCommandsOrFallback = (...keywords: string[]) =>
  matchAny(matchEqual(...keywords), matchCommands(...keywords))
