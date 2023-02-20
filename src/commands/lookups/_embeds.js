import { EmbedBuilder } from 'discord.js'

export function error_embed(text) {
    return new EmbedBuilder()
        .setColor('Red')
        .setTitle('Oops....')
        .setDescription(`***${text}***`)
}