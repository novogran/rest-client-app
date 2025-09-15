import { describe, it, expect } from 'vitest';
import { developerData } from '@/data/developer-data';

describe('Developer data', () => {
  it('should be an array', () => {
    expect(Array.isArray(developerData)).toBe(true);
  });
  it('should contain objects with id, name, description, image, github', () => {
    developerData.forEach((developer) => {
      expect(developer).toHaveProperty('id');
      expect(developer).toHaveProperty('name');
      expect(developer).toHaveProperty('description');
      expect(developer).toHaveProperty('image');
      expect(developer).toHaveProperty('github');
    });
  });

  it('should not be empty', () => {
    expect(developerData.length).toBeGreaterThan(0);
  });
});
