import axios from 'axios';

class FigmaService {
  private static figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN || '';
  private static figmaApiBaseUrl = 'https://api.figma.com/v1';

  private static getFigmaAccessToken(): string {
    return this.figmaAccessToken;
  }

  public static async getProjects(teamId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.figmaApiBaseUrl}/teams/${teamId}/projects`, {
        headers: {
          'X-Figma-Token': this.getFigmaAccessToken(),
        },
      });

      

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

  public static async getFiles(projectId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.figmaApiBaseUrl}/projects/${projectId}/files`, {
        headers: {
          'X-Figma-Token': this.getFigmaAccessToken(),
        },
      });
     
      return response.data.files;
    } catch (error) {
      console.error('Error fetching files:', error.response?.data || error.message);
      throw new Error('Unable to fetch files');
    }
  }

  public static async getFile(fileId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.figmaApiBaseUrl}/files/${fileId}`, {
        headers: {
          'X-Figma-Token': this.getFigmaAccessToken(),
        },
      });

 
      return response.data;
    } catch (error) {
      console.error('Error fetching file:', error.response?.data || error.message);
      throw new Error('Unable to fetch file');
    }
  }

  public static async getComponents(fileId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.figmaApiBaseUrl}/files/${fileId}/components`, {
        headers: {
          'X-Figma-Token': this.getFigmaAccessToken(),
        },
      });
      return response.data;

    } catch (error) {
      console.error('Error fetching components:', error.response?.data || error.message);
      throw new Error('Unable to fetch components');
    }
  }
}

export default FigmaService;
