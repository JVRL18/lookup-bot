import { Guild } from "../../models/guild.js";

export async function checkChannel(interaction) {
    const guildData = await Guild.findOne({ id: interaction.guild.id }) || new Guild({ id: interaction.guild.id })

    if(interaction.channel.id !== guildData.allowed) return false
    return true
}