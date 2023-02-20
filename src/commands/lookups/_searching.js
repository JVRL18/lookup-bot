const loader = '<a:loading:1048135949328056372>'

export async function loading(int) {
    await int.editReply({
        content: `${loader} Pesquisando.... ${loader}`
    })
}

export async function long_loading(int) {
    await int.editReply({
        content: `${loader} Quase lá..... ${loader}`
    })
}