export function hexToBytes(s) {
    return u8a.fromString(input.toLowerCase(), 'base16')
}

export function genUUID(randomLength){
    return Number(Math.random().toString().substring(2,randomLength) + Date.now()).toString(36)
}