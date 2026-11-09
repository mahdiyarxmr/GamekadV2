import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class GamesService {
  constructor(private readonly db: DatabaseService) {}

  getCategories() {
    return this.db.categories.map((cat) => {
      const scenariosCount = this.db.scenarios.filter((s) => s.categoryId === cat.id).length;
      const electronicCount = this.db.electronicGames.filter((e) => e.categoryId === cat.id).length;
      return {
        ...cat,
        scenariosCount,
        electronicCount,
      };
    });
  }

  getScenarios() {
    return this.db.scenarios.map((sc) => {
      const category = this.db.categories.find((c) => c.id === sc.categoryId);
      const roles = this.db.roles.filter((r) => r.scenarioId === sc.id);
      return {
        ...sc,
        category,
        rolesCount: roles.length,
      };
    });
  }

  getScenarioBySlug(slug: string) {
    const sc = this.db.scenarios.find(
      (s) =>
        s.slug === slug ||
        (slug === 'bazpors' && (s.slug === 'investigator' || s.id === 'sc-investigator')) ||
        (slug === 'investigator' && (s.slug === 'bazpors' || s.id === 'sc-investigator')) ||
        (slug === 'namayandeh' && (s.slug === 'representative' || s.id === 'sc-representative')) ||
        (slug === 'representative' && (s.slug === 'namayandeh' || s.id === 'sc-representative')),
    );
    if (!sc) throw new NotFoundException('سناریوی مورد نظر یافت نشد.');

    const category = this.db.categories.find((c) => c.id === sc.categoryId);
    const roles = this.db.roles.filter((r) => r.scenarioId === sc.id);

    return {
      ...sc,
      category,
      roles,
    };
  }

  getRoles(scenarioId?: string) {
    if (scenarioId) {
      return this.db.roles.filter((r) => r.scenarioId === scenarioId);
    }
    return this.db.roles;
  }

  getElectronicGames() {
    return this.db.electronicGames.map((eg) => {
      const category = this.db.categories.find((c) => c.id === eg.categoryId);
      return { ...eg, category };
    });
  }

  // Admin mutations
  createScenario(data: any) {
    const newSc = {
      id: `sc-${Date.now()}`,
      categoryId: data.categoryId,
      title: data.title,
      slug: data.slug || `scenario-${Date.now()}`,
      minPlayers: Number(data.minPlayers) || 8,
      maxPlayers: Number(data.maxPlayers) || 16,
      description: data.description,
      rules: data.rules,
      victoryCitizen: data.victoryCitizen,
      victoryMafia: data.victoryMafia,
      dayPhaseRules: data.dayPhaseRules,
      nightPhaseRules: data.nightPhaseRules,
      createdAt: new Date().toISOString(),
    };
    this.db.scenarios.push(newSc);
    this.db.save();
    return newSc;
  }

  createRole(data: any) {
    const newRole = {
      id: `rl-${Date.now()}`,
      scenarioId: data.scenarioId,
      name: data.name,
      side: data.side || 'CITIZEN',
      description: data.description,
      abilities: data.abilities,
      nightOrder: data.nightOrder ? Number(data.nightOrder) : null,
      tips: data.tips || '',
      icon: data.icon || 'Shield',
      createdAt: new Date().toISOString(),
    };
    this.db.roles.push(newRole);
    this.db.save();
    return newRole;
  }

  createElectronicGame(data: any) {
    const newGame = {
      id: `eg-${Date.now()}`,
      categoryId: data.categoryId,
      title: data.title,
      platform: data.platform || 'PlayStation 5',
      mode: data.mode || '1v1',
      description: data.description || '',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString(),
    };
    this.db.electronicGames.push(newGame);
    this.db.save();
    return newGame;
  }
}
