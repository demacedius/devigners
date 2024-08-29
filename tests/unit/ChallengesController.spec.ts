import { test } from '@japa/runner';
import ChallengesController from '#controllers/challenges_controller';


test.group('ChallengesController - Real API Calls', () => {
  const teamId = '981568760226607988'; // Remplacez par un ID d'équipe valide
  

 test('index - it should fetch and return all challenges (files)', async ({ assert }) => {
    // Mock du contexte de rendu de la vue
    const mockView = {
      render: (viewName: string, data: any) => data.challenges,
    };

    const ctx = {
      view: mockView,
    };

    const result = await new ChallengesController().index(ctx as any);

    // Vérifiez que result est un tableau
    assert.isArray(result);

    if (Array.isArray(result)) {
      // Assertions si result est un tableau
      assert.isNotEmpty(result);
      assert.property(result[0], 'id'); // Assurez-vous que 'id' est la propriété correcte
      assert.property(result[0], 'cover_image'); // Assurez-vous que 'cover_image' est la propriété correcte
    } else {
      assert.fail('Expected result to be an array, but it was not.');
    }
  });
  test('show - it should fetch and return a specific challenge (file)', async ({ assert }) => {
    const projectId = '31886360'; // Remplacez par un ID de projet valide

    const ctx = {
      params: { id: projectId },
      request: {
        qs: () => ({ teamId }),
      },
      response: {
        json: (data: any) => data,
      },
    };

    const result = await new ChallengesController().show(ctx as any);

    // Assertions
    assert.isObject(result);
    assert.property(result, 'key');
    assert.property(result, 'thumbnail_url');
  });
});