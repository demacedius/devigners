import type { HttpContext } from '@adonisjs/core/http';
import axios from 'axios';

export default class ChallengesController {
  private static figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN || '';
  private static figmaApiBaseUrl = 'https://api.figma.com/v1';

  public static getFigmaAccessToken(): string {
    return ChallengesController.figmaAccessToken;
  }

  private static async getProjects(teamId: string): Promise<any[]> {
  try {
    // Effectuer la requête GET à l'API Figma
    const response = await axios.get(`${ChallengesController.figmaApiBaseUrl}/teams/${teamId}/projects`, {
      headers: {
        'X-Figma-Token': ChallengesController.getFigmaAccessToken(),
      },
    });

    // Log des données reçues pour débogage
    console.log('Figma API Response for Projects:', response.data);

    // Validation du format de la réponse
    if (response.data && response.data.projects) {
      return response.data.projects;
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Invalid data format received from Figma API');
    }
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    throw new Error('Unable to fetch projects');
  }
}

  private static async getFiles(projectId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${ChallengesController.figmaApiBaseUrl}/projects/${projectId}/files`, {
        headers: {
          'X-Figma-Token': ChallengesController.getFigmaAccessToken(),
        },
      });
      console.log('Files Response:', response.data);
      return response.data.files;
    } catch (error) {
      console.error('Error fetching files:', error.response?.data || error.message);
      throw new Error('Unable to fetch files');
    }
  }

  public async index({ view }: HttpContext) {
    const teamId = '981568760226607988'; // ID d'équipe Figma
    const projects = await ChallengesController.getProjects(teamId);

    const allChallenges = [];

    for (const project of projects) {
      const files = await ChallengesController.getFiles(project.id);
      for (const file of files) {
        allChallenges.push({
          id: file.key,
          name: file.name,
          description: project.name, // Utilisez le nom du projet comme description
          cover_image: file.thumbnail_url,
          figma_link: `https://www.figma.com/file/${file.key}`,
          completed: 0,
          free: 1,
          level: 'Niveau 1'
        });
      }
    }

    return view.render('pages/challenges/chalenge.edge', { challenges: allChallenges });
  }

  public async show({ params, request, response }: HttpContext) {
    try {
      const { teamId } = request.qs();
      const projects = await ChallengesController.getProjects(teamId);
      if (projects.length === 0) {
        return response.status(404).json({ message: 'No projects found for this team.' });
      }

      const project = projects.find(p => p.id === params.id);
      if (!project) {
        return response.status(404).json({ message: 'Project not found.' });
      }

      const files = await ChallengesController.getFiles(project.id);
      if (files.length === 0) {
        return response.status(404).json({ message: 'No files found for this project.' });
      }

      return files[0]; // Retourne le premier fichier trouvé
    } catch (error) {
      console.error('Error fetching challenge:', error.message);
      return response.status(500).json({ message: 'Unable to fetch challenge', error: error.message });
    }
  }
}
