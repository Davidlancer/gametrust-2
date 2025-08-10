import { PrismaClient } from '@prisma/client';
import { Report, ReportStatus } from '../../types';

const prisma = new PrismaClient();

export class ReportModel {
  static async createReport(reportData: {
    reporterId: string;
    reportedUserId?: string;
    reportedListingId?: string;
    reason: string;
    description: string;
    evidence?: string[];
  }): Promise<Report> {
    return await prisma.report.create({
      data: {
        ...reportData,
        status: ReportStatus.PENDING,
        createdAt: new Date()
      },
      include: {
        reporter: {
          include: {
            profile: true
          }
        },
        reportedUser: {
          include: {
            profile: true
          }
        },
        reportedListing: {
          include: {
            game: true,
            seller: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });
  }

  static async findById(id: string): Promise<Report | null> {
    return await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          include: {
            profile: true
          }
        },
        reportedUser: {
          include: {
            profile: true
          }
        },
        reportedListing: {
          include: {
            game: true,
            seller: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });
  }

  static async updateReportStatus(id: string, status: ReportStatus, adminId?: string, resolution?: string): Promise<Report> {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (adminId) {
      updateData.adminId = adminId;
    }

    if (resolution) {
      updateData.resolution = resolution;
    }

    if (status === ReportStatus.UNDER_REVIEW) {
      updateData.reviewedAt = new Date();
    } else if (status === ReportStatus.RESOLVED) {
      updateData.resolvedAt = new Date();
    } else if (status === ReportStatus.DISMISSED) {
      updateData.dismissedAt = new Date();
    }

    return await prisma.report.update({
      where: { id },
      data: updateData,
      include: {
        reporter: {
          include: {
            profile: true
          }
        },
        reportedUser: {
          include: {
            profile: true
          }
        },
        reportedListing: {
          include: {
            game: true,
            seller: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });
  }

  static async assignToAdmin(id: string, adminId: string): Promise<Report> {
    return await this.updateReportStatus(id, ReportStatus.UNDER_REVIEW, adminId);
  }

  static async resolveReport(id: string, adminId: string, resolution: string, actionTaken?: string): Promise<Report> {
    const updateData: any = {
      status: ReportStatus.RESOLVED,
      adminId,
      resolution,
      resolvedAt: new Date(),
      updatedAt: new Date()
    };

    if (actionTaken) {
      updateData.actionTaken = actionTaken;
    }

    return await prisma.report.update({
      where: { id },
      data: updateData,
      include: {
        reporter: {
          include: {
            profile: true
          }
        },
        reportedUser: {
          include: {
            profile: true
          }
        },
        reportedListing: {
          include: {
            game: true,
            seller: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });
  }

  static async dismissReport(id: string, adminId: string, reason: string): Promise<Report> {
    return await prisma.report.update({
      where: { id },
      data: {
        status: ReportStatus.DISMISSED,
        adminId,
        resolution: reason,
        dismissedAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        reporter: {
          include: {
            profile: true
          }
        },
        reportedUser: {
          include: {
            profile: true
          }
        },
        reportedListing: {
          include: {
            game: true,
            seller: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });
  }

  static async addEvidence(id: string, evidence: string[]): Promise<Report> {
    const report = await prisma.report.findUnique({
      where: { id }
    });

    if (!report) {
      throw new Error('Report not found');
    }

    const updatedEvidence = [...(report.evidence || []), ...evidence];

    return await prisma.report.update({
      where: { id },
      data: {
        evidence: updatedEvidence,
        updatedAt: new Date()
      },
      include: {
        reporter: {
          include: {
            profile: true
          }
        },
        reportedUser: {
          include: {
            profile: true
          }
        },
        reportedListing: {
          include: {
            game: true,
            seller: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });
  }

  static async getUserReports(userId: string, options: {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    asReporter?: boolean;
    asReported?: boolean;
  } = {}): Promise<{ reports: Report[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status, asReporter, asReported } = options;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (asReporter && !asReported) {
      where.reporterId = userId;
    } else if (asReported && !asReporter) {
      where.reportedUserId = userId;
    } else {
      // Default: get reports where user is either reporter or reported
      where = {
        OR: [
          { reporterId: userId },
          { reportedUserId: userId }
        ]
      };
    }

    if (status) {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          reporter: {
            include: {
              profile: true
            }
          },
          reportedUser: {
            include: {
              profile: true
            }
          },
          reportedListing: {
            include: {
              game: true,
              seller: {
                include: {
                  profile: true
                }
              }
            }
          }
        }
      }),
      prisma.report.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      reports,
      total,
      totalPages
    };
  }

  static async getAdminReports(adminId?: string, options: {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    unassigned?: boolean;
    reportType?: 'user' | 'listing';
  } = {}): Promise<{ reports: Report[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status, unassigned, reportType } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (adminId && !unassigned) {
      where.adminId = adminId;
    } else if (unassigned) {
      where.adminId = null;
      where.status = ReportStatus.PENDING;
    }

    if (status) {
      where.status = status;
    }

    if (reportType === 'user') {
      where.reportedUserId = { not: null };
    } else if (reportType === 'listing') {
      where.reportedListingId = { not: null };
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          reporter: {
            include: {
              profile: true
            }
          },
          reportedUser: {
            include: {
              profile: true
            }
          },
          reportedListing: {
            include: {
              game: true,
              seller: {
                include: {
                  profile: true
                }
              }
            }
          }
        }
      }),
      prisma.report.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      reports,
      total,
      totalPages
    };
  }

  static async getReportStats(adminId?: string): Promise<{
    totalReports: number;
    pendingReports: number;
    underReviewReports: number;
    resolvedReports: number;
    dismissedReports: number;
    userReports: number;
    listingReports: number;
    averageResolutionTime: number;
    reportsByReason: Record<string, number>;
  }> {
    const where = adminId ? { adminId } : {};

    const [totalReports, pendingReports, underReviewReports, resolvedReports, dismissedReports, userReports, listingReports, resolutionTimeStats, reasonStats] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.count({ where: { ...where, status: ReportStatus.PENDING } }),
      prisma.report.count({ where: { ...where, status: ReportStatus.UNDER_REVIEW } }),
      prisma.report.count({ where: { ...where, status: ReportStatus.RESOLVED } }),
      prisma.report.count({ where: { ...where, status: ReportStatus.DISMISSED } }),
      prisma.report.count({ where: { ...where, reportedUserId: { not: null } } }),
      prisma.report.count({ where: { ...where, reportedListingId: { not: null } } }),
      prisma.report.findMany({
        where: {
          ...where,
          status: { in: [ReportStatus.RESOLVED, ReportStatus.DISMISSED] },
          resolvedAt: { not: null }
        },
        select: {
          createdAt: true,
          resolvedAt: true,
          dismissedAt: true
        }
      }),
      prisma.report.groupBy({
        by: ['reason'],
        where,
        _count: { id: true }
      })
    ]);

    // Calculate average resolution time in hours
    const resolutionTimes = resolutionTimeStats
      .map(report => {
        const created = new Date(report.createdAt).getTime();
        const resolved = report.resolvedAt ? new Date(report.resolvedAt).getTime() : 
                        report.dismissedAt ? new Date(report.dismissedAt).getTime() : null;
        return resolved ? (resolved - created) / (1000 * 60 * 60) : null; // Convert to hours
      })
      .filter(time => time !== null) as number[];

    const averageResolutionTime = resolutionTimes.length > 0 
      ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length 
      : 0;

    const reportsByReason = reasonStats.reduce((acc, stat) => {
      acc[stat.reason] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalReports,
      pendingReports,
      underReviewReports,
      resolvedReports,
      dismissedReports,
      userReports,
      listingReports,
      averageResolutionTime,
      reportsByReason
    };
  }

  static async getFrequentlyReportedUsers(options: {
    limit?: number;
    timeframe?: 'day' | 'week' | 'month';
  } = {}): Promise<Array<{
    userId: string;
    username: string;
    reportCount: number;
    reasons: string[];
  }>> {
    const { limit = 10, timeframe = 'month' } = options;
    
    let dateFilter: Date;
    const now = new Date();
    
    switch (timeframe) {
      case 'day':
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const results = await prisma.report.groupBy({
      by: ['reportedUserId'],
      where: {
        reportedUserId: { not: null },
        createdAt: {
          gte: dateFilter
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: limit
    });

    // Get user details and reasons for each reported user
    const userStats = await Promise.all(
      results.map(async (result) => {
        if (!result.reportedUserId) return null;
        
        const [user, reasons] = await Promise.all([
          prisma.user.findUnique({
            where: { id: result.reportedUserId },
            include: { profile: true }
          }),
          prisma.report.findMany({
            where: {
              reportedUserId: result.reportedUserId,
              createdAt: { gte: dateFilter }
            },
            select: { reason: true },
            distinct: ['reason']
          })
        ]);
        
        return {
          userId: result.reportedUserId,
          username: user?.profile?.username || user?.name || 'Unknown User',
          reportCount: result._count.id,
          reasons: reasons.map(r => r.reason)
        };
      })
    );

    return userStats.filter(stat => stat !== null) as Array<{
      userId: string;
      username: string;
      reportCount: number;
      reasons: string[];
    }>;
  }

  static async getFrequentlyReportedListings(options: {
    limit?: number;
    timeframe?: 'day' | 'week' | 'month';
  } = {}): Promise<Array<{
    listingId: string;
    gameTitle: string;
    reportCount: number;
    reasons: string[];
  }>> {
    const { limit = 10, timeframe = 'month' } = options;
    
    let dateFilter: Date;
    const now = new Date();
    
    switch (timeframe) {
      case 'day':
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const results = await prisma.report.groupBy({
      by: ['reportedListingId'],
      where: {
        reportedListingId: { not: null },
        createdAt: {
          gte: dateFilter
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: limit
    });

    // Get listing details and reasons for each reported listing
    const listingStats = await Promise.all(
      results.map(async (result) => {
        if (!result.reportedListingId) return null;
        
        const [listing, reasons] = await Promise.all([
          prisma.listing.findUnique({
            where: { id: result.reportedListingId },
            include: { game: true }
          }),
          prisma.report.findMany({
            where: {
              reportedListingId: result.reportedListingId,
              createdAt: { gte: dateFilter }
            },
            select: { reason: true },
            distinct: ['reason']
          })
        ]);
        
        return {
          listingId: result.reportedListingId,
          gameTitle: listing?.game.name || 'Unknown Game',
          reportCount: result._count.id,
          reasons: reasons.map(r => r.reason)
        };
      })
    );

    return listingStats.filter(stat => stat !== null) as Array<{
      listingId: string;
      gameTitle: string;
      reportCount: number;
      reasons: string[];
    }>;
  }
}