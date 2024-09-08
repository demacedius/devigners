import type { HttpContext } from '@adonisjs/core/http';
import FigmaService from '#services/figma_service';
import DescriptionService from '#services/description_service';
import UserChallenges from '#models/user_challenges';
import Challenge from '#models/chalenge'; 

export default class ChallengesController {

  public async syncFigmaChallenges(teamId: string) {
    // Récupérer les projets Figma depuis l'API
    const projects = await FigmaService.getProjects(teamId);

    // Boucle sur les projets pour récupérer les fichiers associés
    for (const project of projects) {
      const files = await FigmaService.getFiles(project.id);

      // Boucle sur les fichiers pour les synchroniser avec la base de données
      for (const file of files) {
        // Vérifier si le challenge existe déjà dans la base de données
        let challenge = await Challenge.findBy('figma_id', file.key);
        
        if (!challenge) {
          // Si le challenge n'existe pas, créer un nouveau record
          challenge = new Challenge();
          challenge.figma_id = file.key;
          challenge.name = file.name;
          challenge.description = DescriptionService.getDescription(file.name); // Custom description logic
          challenge.thumbnail_url = file.thumbnail_url;
          challenge.figma_link = `https://www.figma.com/file/${file.key}`;
          challenge.level = DescriptionService.getLevel(file.name) || 1;  
          challenge.free = DescriptionService.isFree(file.name) ? true : false;  
          
          // Sauvegarder dans la base de données
          await challenge.save();
        }
      }
    }
  }
  // Récupère et affiche tous les challenges
  public async index({ auth, view }: HttpContext) {
    const userId = auth.user?.id ?? 0;
    const teamId = '981568760226607988'; // L'ID de ton équipe Figma
    await this.syncFigmaChallenges(teamId);
    // Récupérer les challenges complétés par l'utilisateur
    const completedChallenges = await UserChallenges
      .query()
      .where('user_id', userId)
      .select('challenge_id');

    const completedChallengeIds = completedChallenges.map(challenge => challenge.challenge_id);

    const allChallenges = await Challenge.query();
    // Enrichir les challenges avec les données de Figma
    for (const challenge of allChallenges) {
  
      
      challenge.completed = completedChallengeIds.includes(challenge.figma_id);
    }

    return view.render('pages/challenges/chalenge', { challenges: allChallenges });
  }

  // Marque un challenge comme terminé
  public async complete({ params, auth, response }: HttpContext) {
    try {
      const userId = auth.user?.id ?? 0;
      const { id } = params;

      const existingRecord = await UserChallenges.query()
        .where('user_id', userId)
        .andWhere('challenge_id', id)
        .first();

      if (!existingRecord) {
        await UserChallenges.create({
          user_id: userId,
          challenge_id: id,
          completed_at: new Date(),
        });
      } else {
        console.log('Challenge déjà complété.');
      }

      return response.redirect().toRoute('challenges.challenges.index');
    } catch (error) {
      console.error('Error completing challenge:', error.message);
      return response.status(500).json({ message: 'Unable to complete challenge', error: error.message });
    }
  }

  // Affiche un challenge spécifique
  public async show({ params, auth, view, response }: HttpContext) {
    try {
      const userId = auth.user?.id ?? 0; // Récupérer l'utilisateur connecté
      const { id } = params;  // Récupérer l'ID du challenge

      // Récupérer les détails du challenge depuis la base de données
      const challenge = await Challenge.find(id);
      if (!challenge) {
        return response.status(404).json({ message: 'Challenge not found' });
      }

      // Vérifier si l'utilisateur a complété ce challenge
      const userChallenge = await UserChallenges.query()
        .where('user_id', userId)
        .andWhere('challenge_id', id)
        .first();

      // Si le challenge est complété, on passe `completed` à true
      challenge.completed = !!userChallenge;

      // Passer les données du challenge à la vue
      return view.render('pages/challenges/challenge', {
        challenge,
        description: challenge.description, // description spécifique au challenge
      });
    } catch (error) {
      console.error('Error fetching challenge:', error.message);
      return response.status(500).json({ message: 'Unable to fetch challenge', error: error.message });
    }
  }
}
