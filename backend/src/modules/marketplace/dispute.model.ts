import { PrismaClient } from '@prisma/client';
import { Dispute, DisputeStatus, DisputePriority } from '../../types';

const prisma = new PrismaClient();

export class DisputeModel {
  static async createDispute(disputeData: {
    purchaseId: string;
    initiatorId: string;
    respondentId: string;
    reason: string;
    description: string;
    priority?: DisputePriority;
    evidence?: string[];
  }): Promise<Dispute> {
    return await prisma.dispute.create({
      data: {
        ...disputeData,
        status: DisputeStatus.OPEN,
        priority: disputeData.priority || DisputePriority.MEDIUM,
        createdAt: new Date()
      },
      include: {
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            },
            escrow: true
          }
        },
        initiator: {
          include: {
            profile: true
          }
        },
        respondent: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async findById(id: string): Promise<Dispute | null> {
    return await prisma.dispute.findUnique({
      where: { id },
      include: {
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            },
            escrow: true
          }
        },
        initiator: {
          include: {
            profile: true
          }
        },
        respondent: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async findByPurchaseId(purchaseId: string): Promise<Dispute | null> {
    return await prisma.dispute.findFirst({
      where: { purchaseId },
      include: {
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            },
            escrow: true
          }
        },
        initiator: {
          include: {
            profile: true
          }
        },
        respondent: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async updateDisputeStatus(id: string, status: DisputeStatus, resolution?: string, adminId?: string): Promise<Dispute> {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (resolution) {
      updateData.resolution = resolution;
    }

    if (adminId) {
      updateData.adminId = adminId;
    }

    if (status === DisputeStatus.IN_REVIEW) {
      updateData.reviewedAt = new Date();
    } else if (status === DisputeStatus.RESOLVED) {
      updateData.resolvedAt = new Date();
    } else if (status === DisputeStatus.CLOSED) {
      updateData.closedAt = new Date();
    }

    return await prisma.dispute.update({
      where: { id },
      data: updateData,
      include: {
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            },
            escrow: true
          }
        },
        initiator: {
          include: {
            profile: true
          }
        },
        respondent: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async assignToAdmin(id: string, adminId: string): Promise<Dispute> {
    return await prisma.dispute.update({
      where: { id },
      data: {
        adminId,
        status: DisputeStatus.IN_REVIEW,
        reviewedAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            },
            escrow: true
          }
        },
        initiator: {
          include: {
            profile: true
          }
        },
        respondent: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async resolveDispute(id: string, resolution: string, adminId: string, favoredParty: 'initiator' | 'respondent' | 'neutral'): Promise<Dispute> {
    return await prisma.dispute.update({
      where: { id },
      data: {
        status: DisputeStatus.RESOLVED,
        resolution,
        adminId,
        favoredParty,
        resolvedAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            },
            escrow: true
          }
        },
        initiator: {
          include: {
            profile: true
          }
        },
        respondent: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async closeDispute(id: string, adminId?: string): Promise<Dispute> {
    return await this.updateDisputeStatus(id, DisputeStatus.CLOSED, undefined, adminId);
  }

  static async addEvidence(id: string, evidence: string[]): Promise<Dispute> {
    const dispute = await prisma.dispute.findUnique({
      where: { id }
    });

    if (!dispute) {
      throw new Error('Dispute not found');
    }

    const updatedEvidence = [...(dispute.evidence || []), ...evidence];

    return await prisma.dispute.update({
      where: { id },
      data: {
        evidence: updatedEvidence,
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            },
            escrow: true
          }
        },
        initiator: {
          include: {
            profile: true
          }
        },
        respondent: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async getUserDisputes(userId: string, options: {
    page?: number;
    limit?: number;
    status?: DisputeStatus;
    asInitiator?: boolean;
    asRespondent?: boolean;
  } = {}): Promise<{ disputes: Dispute[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status, asInitiator, asRespondent } = options;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (asInitiator && !asRespondent) {
      where.initiatorId = userId;
    } else if (asRespondent && !asInitiator) {
      where.respondentId = userId;
    } else {
      // Default: get disputes where user is either initiator or respondent
      where = {
        OR: [
          { initiatorId: userId },
          { respondentId: userId }
        ]
      };
    }

    if (status) {
      where.status = status;
    }

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          purchase: {
            include: {
              listing: {
                include: {
                  game: true
                }
              },
              escrow: true
            }
          },
          initiator: {
            include: {
              profile: true
            }
          },
          respondent: {
            include: {
              profile: true
            }
          }
        }
      }),
      prisma.dispute.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      disputes,
      total,
      totalPages
    };
  }

  static async getAdminDisputes(adminId?: string, options: {
    page?: number;
    limit?: number;
    status?: DisputeStatus;
    priority?: DisputePriority;
    unassigned?: boolean;
  } = {}): Promise<{ disputes: Dispute[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status, priority, unassigned } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (adminId && !unassigned) {
      where.adminId = adminId;
    } else if (unassigned) {
      where.adminId = null;
      where.status = DisputeStatus.OPEN;
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ],
        include: {
          purchase: {
            include: {
              listing: {
                include: {
                  game: true
                }
              },
              escrow: true
            }
          },
          initiator: {
            include: {
              profile: true
            }
          },
          respondent: {
            include: {
              profile: true
            }
          }
        }
      }),
      prisma.dispute.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      disputes,
      total,
      totalPages
    };
  }

  static async getDisputeStats(adminId?: string): Promise<{
    totalDisputes: number;
    openDisputes: number;
    inReviewDisputes: number;
    resolvedDisputes: number;
    closedDisputes: number;
    averageResolutionTime: number;
    disputesByPriority: {
      high: number;
      medium: number;
      low: number;
    };
  }> {
    const where = adminId ? { adminId } : {};

    const [totalDisputes, openDisputes, inReviewDisputes, resolvedDisputes, closedDisputes, priorityStats, resolutionTimeStats] = await Promise.all([
      prisma.dispute.count({ where }),
      prisma.dispute.count({ where: { ...where, status: DisputeStatus.OPEN } }),
      prisma.dispute.count({ where: { ...where, status: DisputeStatus.IN_REVIEW } }),
      prisma.dispute.count({ where: { ...where, status: DisputeStatus.RESOLVED } }),
      prisma.dispute.count({ where: { ...where, status: DisputeStatus.CLOSED } }),
      Promise.all([
        prisma.dispute.count({ where: { ...where, priority: DisputePriority.HIGH } }),
        prisma.dispute.count({ where: { ...where, priority: DisputePriority.MEDIUM } }),
        prisma.dispute.count({ where: { ...where, priority: DisputePriority.LOW } })
      ]),
      prisma.dispute.findMany({
        where: {
          ...where,
          status: DisputeStatus.RESOLVED,
          resolvedAt: { not: null }
        },
        select: {
          createdAt: true,
          resolvedAt: true
        }
      })
    ]);

    // Calculate average resolution time in hours
    const resolutionTimes = resolutionTimeStats
      .filter(dispute => dispute.resolvedAt)
      .map(dispute => {
        const created = new Date(dispute.createdAt).getTime();
        const resolved = new Date(dispute.resolvedAt!).getTime();
        return (resolved - created) / (1000 * 60 * 60); // Convert to hours
      });

    const averageResolutionTime = resolutionTimes.length > 0 
      ? resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length 
      : 0;

    return {
      totalDisputes,
      openDisputes,
      inReviewDisputes,
      resolvedDisputes,
      closedDisputes,
      averageResolutionTime,
      disputesByPriority: {
        high: priorityStats[0],
        medium: priorityStats[1],
        low: priorityStats[2]
      }
    };
  }

  static async getOverdueDisputes(options: {
    limit?: number;
    hoursOverdue?: number;
  } = {}): Promise<Dispute[]> {
    const { limit = 20, hoursOverdue = 48 } = options;
    const overdueDate = new Date(Date.now() - hoursOverdue * 60 * 60 * 1000);

    return await prisma.dispute.findMany({
      where: {
        status: { in: [DisputeStatus.OPEN, DisputeStatus.IN_REVIEW] },
        createdAt: {
          lt: overdueDate
        }
      },
      take: limit,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ],
      include: {
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            },
            escrow: true
          }
        },
        initiator: {
          include: {
            profile: true
          }
        },
        respondent: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async escalateDispute(id: string, newPriority: DisputePriority): Promise<Dispute> {
    return await prisma.dispute.update({
      where: { id },
      data: {
        priority: newPriority,
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            listing: {
              include: {
                game: true
              }
            },
            escrow: true
          }
        },
        initiator: {
          include: {
            profile: true
          }
        },
        respondent: {
          include: {
            profile: true
          }
        }
      }
    });
  }
}