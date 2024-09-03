import type { HttpContext } from '@adonisjs/core/http';
import FigmaService from '#services/figma_service';
import DescriptionService from '#services/description_service';

export default class ChallengesController {
  public async index({ view }: HttpContext) {
    const teamId = '981568760226607988'; 
    const projects = await FigmaService.getProjects(teamId);

    const allChallenges = [];

    for (const project of projects) {
      const files = await FigmaService.getFiles(project.id);
      for (const file of files) {
        console.log('file Name:', file.name)
        const description = DescriptionService.getDescription(file.name);
        console.log('description:', description)
        allChallenges.push({
          id: file.key,
          name: file.name,
          description:description, // Utilisez le nom du projet comme description
          cover_image: file.thumbnail_url,
          figma_link: `https://www.figma.com/file/${file.key}`,
          completed: 0,
          free: 1,
          level: 3
        });
      }
    }

    return view.render('pages/challenges/chalenge', { challenges: allChallenges });
  }

  public async show({ params, response, view }: HttpContext) {
    try {
      const { id } = params;  // Récupère l'ID du fichier (clé du projet)
      
      // Appel à la méthode pour récupérer les métadonnées du fichier depuis l'API de Figma
      const fileData = await FigmaService.getFile(id);


      const description = DescriptionService.getDescription(fileData.name);
      

      // Vérification si les données existent
      if (!fileData) {
        return response.status(404).json({ message: 'File not found.' });
      }

      // Rendu de la vue 'challenge.show' en passant les données du fichier Figma
      return view.render('pages/challenges/challenge', { challenge: fileData, description: description });

    } catch (error) {
      console.error('Error fetching challenge:', error.message);
      return response.status(500).json({ message: 'Unable to fetch challenge', error: error.message });
    }
  }
}
