export default class DescriptionService {
    // Ajouter les niveaux et tags pour chaque projet
    private static description: { [key: string]: { description: string,  free: boolean } } = {
        'devign': {
            description: 'Devign est une plateform qui permet aux developpeur mobil et aux designer de s\'améliorer et d\'ajouter des projet réelle a leur portfolio.',
            free: true  // Gratuit
        },
        'untitled': {
            description: 'Ce projet était un challenge de ma formation pour devenir développeur',
            free: false // Payant
        },
        // Ajouter d'autres projets ici
    };

    // Méthode pour obtenir la description du projet
    public static getDescription(projectName: string): string {
        return this.description[projectName.toLowerCase()]?.description || 'N\'a pas de description';
    }

    private static levelMap: { [key: string]: number } = {
        'devign': 3,
        'untitled': 2,
    }
    // Méthode pour obtenir le niveau du projet
    public static getLevel(projectName: string): number {
        return this.levelMap[projectName.toLowerCase()] || 1;
    }

    // Méthode pour savoir si le projet est gratuit ou payant
    public static isFree(projectName: string): boolean {
        return this.description[projectName.toLowerCase()]?.free ?? false;

    }
}
