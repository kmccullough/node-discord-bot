import { Command } from "@enitoni/gears-discordjs"
import { matchPrefixes } from "@enitoni/gears"
import { MessageEmbed } from "discord.js"
import { PRIMARY_COLOR } from "../../../constants"
import { sendMessage } from "../helpers"

const embed = new MessageEmbed({
  color: PRIMARY_COLOR,
  title: "Node Discord Bot",
  description: "Tools to assist with moderation and assistance in Node discord",
  fields: [
    {
      name: "Author",
      value:
        "Made by Enitoni (<@185820463220391937>) with the [gears](https://gears.enitoni.dev) library",
    },
    {
      name: "Contributors",
      value:
        "Expanded by Kerry McCullough (<@196799749200936961>)",
    },
    {
      name: "Repository",
      value: "https://gitlab.com/kmccullough/node-discord-bot",
    },
  ],
})

export const aboutCommand = new Command()
  .match(matchPrefixes("about"))
  .use((context) => sendMessage(context, embed))
