import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ArticlesService {
  constructor(private readonly db: DatabaseService) {}

  findAll() {
    return this.db.articles.filter((a) => a.isPublished);
  }

  findBySlug(slug: string) {
    const article = this.db.articles.find((a) => a.slug === slug && a.isPublished);
    if (!article) throw new NotFoundException('مقاله مورد نظر یافت نشد.');
    return article;
  }

  create(data: any) {
    const newArticle = {
      id: `art-${Date.now()}`,
      title: data.title,
      slug: data.slug || `article-${Date.now()}`,
      summary: data.summary,
      content: data.content,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      type: data.type || 'guide',
      isPublished: true,
      authorName: data.authorName || 'تیم آموزش رکاد',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.articles.unshift(newArticle);
    this.db.save();
    return newArticle;
  }
}
