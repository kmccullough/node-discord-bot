import { EmbedFieldData } from "discord.js"

export class UsageError extends Error {
  constructor(public reason: string, public fields: EmbedFieldData[] = []) {
    super(reason)
  }
}
