import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAITRepository } from './prisma/repositories/prisma-ait.repository';

@Module({
  providers: [PrismaService, PrismaAITRepository],
  exports: [PrismaService, PrismaAITRepository],
})
export class DatabaseModule {}
