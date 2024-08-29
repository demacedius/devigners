import vine from '@vinejs/vine'



export const challengeValidator = vine.compile(
    vine.object({
        name: vine.string(),
        description: vine.string(),
        cover_image: vine.string(),
        figma_link: vine.string(),
        completed: vine.boolean(),
        free: vine.boolean(),
        level: vine.string(),
    })
)
