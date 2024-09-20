import type { HttpContext } from '@adonisjs/core/http'
import Solution from '#models/solution'

export default class SolutionsController {

    public async index({ view }: HttpContext) {
    const solutions = await Solution.query().preload('user');
    return view.render('pages/solutions', { solutions });
  }
    public async store({ request, auth, response }: HttpContext) {
        try {
            const userId = auth.user?.id ?? 0;
            const { challenge_id, image_url,  repository_url, figma_url, description } = request.only(['challenge_id', 'image_url', 'repository_url', 'figma_url', 'description']);

            // Crée une nouvelle solution
            await Solution.create({
                userId: userId,
                challenge_id,
                image_url,
                repository_url,
                figma_url,
                description
            });

            return response.redirect().toRoute('challenges.solutions.show', { id: challenge_id });
        } catch (error) {
            console.error('Error saving solution:', error.message);
            return response.status(500).json({ message: 'Unable to save solution', error: error.message });
        }
    }

    public async show({ params, view }: HttpContext) {
        const { id } = params;
        
        try {
            const solution = await Solution.query()
                .where('id', id)
                .preload('user')
                .firstOrFail();


            let solutionWithEmail;
            if (solution.user) {
                solutionWithEmail = {
                    ...solution.toJSON(),
                    email: solution.user.email
                };
            } else {
                solutionWithEmail = {
                    ...solution.toJSON(),
                    email: 'Non disponible'
                };
            }


            return view.render('pages/solutions', { solution: solutionWithEmail });
        } catch (error) {
            return view.render('pages/solutions', { solution: null });
        }
    }
}