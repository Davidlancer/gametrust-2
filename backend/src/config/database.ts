import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

class Database {
  private static instance: Database;
  public prisma: PrismaClient;
  private isConnected: boolean = false;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Database already connected');
      return;
    }

    try {
      // Test the connection
      await this.prisma.$connect();
      
      // Verify connection with a simple query
      await this.prisma.$queryRaw`SELECT 1`;
      
      this.isConnected = true;
      logger.info('✅ Connected to PostgreSQL via Prisma successfully');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      this.isConnected = false;
      process.exit(1)
      // throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.prisma.$disconnect();
      this.isConnected = false;
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getPrismaClient(): PrismaClient {
    return this.prisma;
  }

  // Health check method
  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }
}

export default Database.getInstance();
const prisma = Database.getInstance().prisma
export { PrismaClient, prisma  };