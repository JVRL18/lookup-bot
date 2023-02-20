import axios from 'axios'
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js'
import { checkChannel } from './_checkup.js'
import { error_embed } from './_embeds.js'
import { loading, long_loading } from './_searching.js'

export const data = new SlashCommandBuilder()
    .setName('cep')
    .setDescription('Busca por um cep especifico')
    .addNumberOption(option =>
        option.setName('cep').setDescription("Por favor insira um cep para realizar a busca.").setRequired(true)
    )

export const run = async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true })
    await loading(interaction)

    const checked = await checkChannel(interaction)
    if (!checked) return interaction.editReply({ content: "Oops, este comando não pode ser executado aqui." })

    let completed = false
    const cep = interaction.options.getNumber('cep')
    const apiBase = `https://viacep.com.br/ws/${cep}/json/`

    setTimeout(async () => {
        if (!completed) await long_loading(interaction)
    }, 3500)

    await axios.get(apiBase)
        .then(async r => {
            completed = true
            const data = r.data

            const formattedData = []

            for(const key in data){
                formattedData.push(`${key}: ${data[key]}`)
            }

            formattedData.push("Consulta feita na Tipster Store:  https://discord.gg/tipster")

            const attachment = new AttachmentBuilder()
                .setName(`${cep}.txt`)
                .setDescription("Search results")
                .setFile(Buffer.from(formattedData.join('\n'), 'latin1'))

            await interaction.editReply({
                files: [attachment],
                content: `Tudo certo, foi encontrado o cep \`${cep}\`, faça o download do arquivo abaixo para salvar os resultados.`
            })

        })
        .catch(async r => {
            completed = true
            await interaction.editReply({
                embeds: [
                    error_embed(`Não foi possivel contrar nada neste CEP: \`${cep}\``)
                ],
                content: ''
            })

        })
}
