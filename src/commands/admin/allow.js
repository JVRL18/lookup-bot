import { SlashCommandBuilder } from 'discord.js'
import { Guild } from '../../models/guild.js'

export const data = new SlashCommandBuilder()
    .setName('liberar')
    .setDescription('permite que os comandos de cep e cpf sejam executados no canal atual.')

export const run = async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true })

    const config = await import('../../../config.json', { assert: { type: 'json' } })
    const list = config.default.superAdmin
    if (!list.includes(interaction.user.id)) return

    const channel = interaction.channel.id
    const guild = await Guild.findOne({ id: interaction.guild.id }) || new Guild({ id: interaction.guild.id })

    guild.allowed = channel

    await guild.save()

    await interaction.editReply({ content: `${interaction.channel} **pode ser usado para checar cpfs e ceps agora.**`})

}
