import axios from 'axios'
import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js'
import { checkChannel } from './_checkup.js'
import { error_embed } from './_embeds.js'
import { loading, long_loading } from './_searching.js'

export const data = new SlashCommandBuilder()
    .setName('cpf')
    .setDescription('Busca por um cpf especifico')
    .addNumberOption(option =>
        option.setName('cpf').setDescription("Por favor insira um cpf para realizar a busca.").setRequired(true)
    )

export const run = async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true })
    await loading(interaction)

    const checked = await checkChannel(interaction)
    if (!checked) return interaction.editReply({ content: "Oops, este comando não pode ser executado aqui."})

    let completed = false
    const config = await import('../../../config.json', { assert: { type: 'json' } })
    const token_cpf = config.default.token_cpf
    const cpf = interaction.options.getNumber('cpf')

    const apiBase = `https://api.k3nny-mcc0rm1ck.com/v1/?token=${token_cpf}&consulta=BASICA&tipo=cpfBasica&cpf=${cpf}`

    setTimeout(async () => {
        if (!completed) await long_loading(interaction)
    }, 3500)

    await axios.get(apiBase)
        .then(async r => {
            completed = true
            const data = r.data.dadosCadastrais

            const formattedData = []

            for(const key in data){
                formattedData.push(`${key}: ${data[key]}`)
            }

            formattedData.push("Consulta feita na Tipster Store:  https://discord.gg/tipster")

            const attachment = new AttachmentBuilder()
                .setName(`${cpf}.txt`)
                .setDescription("Search results")
                .setFile(Buffer.from(formattedData.join('\n'), 'latin1'))

            await interaction.editReply({
                content: `Tudo certo, foi encontrado o cpf \`${cpf}\`, faça o download do arquivo abaixo para salvar os resultados.`,
                files: [attachment]
            })

        })
        .catch(async r => {
            completed = true
            await interaction.editReply({
                embeds: [
                    error_embed(r.response.data.consulta.msg + `\nCPF: \`${cpf}\``)
                ],
                content:''
            })

        })
}
