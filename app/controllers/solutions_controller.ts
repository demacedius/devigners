import type { HttpContext } from '@adonisjs/core/http'
import Solution from '#models/solution'

export default class SolutionsController {
    // Enregistre une nouvelle solution
    public async store({ request, auth, response }: HttpContext) {
        try {
            const userId = auth.user?.id ?? 0;
            const { challenge_id, image_url,  repository_url, figma_url, description } = request.only(['challenge_id', 'image_url', 'repository_url', 'figma_url', 'description']);

            // Crée une nouvelle solution
            await Solution.create({
                user_id: userId,
                challenge_id,
                image_url,
                repository_url,
                figma_url,
                description
            });

            return response.redirect().toRoute('challenges.challenges.show', { id: challenge_id });
        } catch (error) {
            console.error('Error saving solution:', error.message);
            return response.status(500).json({ message: 'Unable to save solution', error: error.message });
        }
    }

    // Affiche les solutions d'un challenge
    public async show({ params, view }: HttpContext) {
        const { id } = params;

        // Récupère les solutions pour le challenge spécifié
        const solutions = await Solution.query().where('challenge_id', id);

        return view.render('pages/solutions/index', { solutions });
    }
}