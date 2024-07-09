import { Service } from "@enitoni/gears-discordjs"
import { getJobHelpEmbed } from "../helpers"
import { ContextLike, createServiceContext } from "../../core/helpers"
import { sendMessage } from "../../core/helpers"
import { getBanNotifyEmbed } from "../../autoban/helpers"

const regex = "\\[(HIRING|FOR HIRE)\\]"
const channelId = "426384543818448896"

export class JobAutomodService extends Service {
  public async serviceDidInitialize() {
    this.bot.client.on("message", (m) => this.handleMessage(createServiceContext(this.bot, this.manager, m)))
  }

  private async handleMessage(context: ContextLike) {
    const { message } = context
    const { content, channel } = message

    if (channel.id !== channelId) return
    if (!RegExp(regex).test(content.toUpperCase())) {
      await message.delete()
      await sendMessage(context, getJobHelpEmbed(content),  { private: true })
      // await sendMessage(context, getJobHelpEmbed(content), { private: true });
    }
  }
}
