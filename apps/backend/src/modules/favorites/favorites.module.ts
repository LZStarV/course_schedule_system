import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { CourseFavorite } from '../../models/course-favorite.model';

@Module({
  imports: [SequelizeModule.forFeature([CourseFavorite])],
  providers: [FavoritesService, FavoritesController],
})
export class FavoritesModule {}
