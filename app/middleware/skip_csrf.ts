import type { HttpContext } from "@adonisjs/core/http";
import { NextFn } from "@adonisjs/core/types/http";
import logger from '@adonisjs/core/services/logger'

export default class SkipCsrf {
    public async handle(ctx: HttpContext, next: NextFn) {
        logger.info('SkipCsrf middleware appelé pour ' + ctx.request.url())
        // @ts-ignore
        ctx.request.csrfToken = () => ''
        logger.info('CSRF token désactivé pour cette requête')
        await next()
    }
}