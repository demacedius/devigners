export default class DescriptionService {
    private static description: { [key: string]: string } = {
        'devign': 'Devign est une plateform qui permet aux developpeur mobil et aux designer de s\'améliorer et d\'ajouter des projet réelle a leur portfolio.',
        'untitled': 'Ce projet était un challenge de ma formation pour devenir développeur',

    };

    public static getDescription(projectName: string): string {
        return this.description[projectName.toLowerCase()] || 'N\'a pas de description';
    }
}