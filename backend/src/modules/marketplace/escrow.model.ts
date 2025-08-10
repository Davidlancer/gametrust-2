import { PrismaClient } from '@prisma/client';
import { Escrow, EscrowStatus, PurchaseRequest } from '../../types';

const prisma = new PrismaClient();

export class EscrowModel {
  static async createEscrow(escrowData: {
    purchaseId: string;
    listingId: string;
    buyerId: string;
    sellerId: string;
    amount: number;
    currency: string;
  }): Promise<Escrow> {
    return await prisma.escrow.create({
      data: {
        ...escrowData,
        status: EscrowStatus.PENDING,
        createdAt: new Date()
      },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async findById(id: string): Promise<Escrow | null> {
    return await prisma.escrow.findUnique({
      where: { id },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async findByPurchaseId(purchaseId: string): Promise<Escrow | null> {
    return await prisma.escrow.findUnique({
      where: { purchaseId },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async fundEscrow(id: string, paymentProof?: any): Promise<Escrow> {
    return await prisma.escrow.update({
      where: { id },
      data: {
        status: EscrowStatus.FUNDED,
        fundsHeldAt: new Date(),
        deliveryProof: paymentProof,
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async markAsDelivered(id: string, deliveryProof: any, sellerNotes?: string): Promise<Escrow> {
    return await prisma.escrow.update({
      where: { id },
      data: {
        status: EscrowStatus.DELIVERED,
        accountDeliveredAt: new Date(),
        deliveryProof,
        sellerNotes,
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async confirmDelivery(id: string, buyerNotes?: string): Promise<Escrow> {
    return await prisma.escrow.update({
      where: { id },
      data: {
        status: EscrowStatus.CONFIRMED,
        buyerConfirmedAt: new Date(),
        buyerNotes,
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async releaseFunds(id: string): Promise<Escrow> {
    return await prisma.escrow.update({
      where: { id },
      data: {
        status: EscrowStatus.RELEASED,
        releasedAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async initiateDispute(id: string, reason: string, initiatedBy: 'buyer' | 'seller'): Promise<Escrow> {
    return await prisma.escrow.update({
      where: { id },
      data: {
        status: EscrowStatus.DISPUTED,
        disputeStartedAt: new Date(),
        buyerNotes: initiatedBy === 'buyer' ? reason : undefined,
        sellerNotes: initiatedBy === 'seller' ? reason : undefined,
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async resolveDispute(id: string, resolution: 'release' | 'refund', adminNotes?: string): Promise<Escrow> {
    const status = resolution === 'release' ? EscrowStatus.RELEASED : EscrowStatus.REFUNDED;
    
    return await prisma.escrow.update({
      where: { id },
      data: {
        status,
        resolvedAt: new Date(),
        sellerNotes: adminNotes,
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async cancelEscrow(id: string, reason?: string): Promise<Escrow> {
    return await prisma.escrow.update({
      where: { id },
      data: {
        status: EscrowStatus.CANCELLED,
        buyerNotes: reason,
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async refundEscrow(id: string): Promise<Escrow> {
    return await prisma.escrow.update({
      where: { id },
      data: {
        status: EscrowStatus.REFUNDED,
        resolvedAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        purchase: {
          include: {
            buyer: {
              include: {
                profile: true
              }
            },
            listing: {
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
        }
      }
    });
  }

  static async getEscrowsByUser(userId: string, role: 'buyer' | 'seller', options: {
    page?: number;
    limit?: number;
    status?: EscrowStatus;
  } = {}): Promise<{ escrows: Escrow[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20, status } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (role === 'buyer') {
      where.buyerId = userId;
    } else {
      where.sellerId = userId;
    }

    if (status) {
      where.status = status;
    }

    const [escrows, total] = await Promise.all([
      prisma.escrow.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          purchase: {
            include: {
              buyer: {
                include: {
                  profile: true
                }
              },
              listing: {
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
          }
        }
      }),
      prisma.escrow.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      escrows,
      total,
      totalPages
    };
  }

  static async getDisputedEscrows(options: {
    page?: number;
    limit?: number;
  } = {}): Promise<{ escrows: Escrow[]; total: number; totalPages: number }> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where = {
      status: EscrowStatus.DISPUTED
    };

    const [escrows, total] = await Promise.all([
      prisma.escrow.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          disputeStartedAt: 'asc'
        },
        include: {
          purchase: {
            include: {
              buyer: {
                include: {
                  profile: true
                }
              },
              listing: {
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
          }
        }
      }),
      prisma.escrow.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      escrows,
      total,
      totalPages
    };
  }

  static async autoReleaseEscrows(): Promise<void> {
    // Auto-release escrows that have been confirmed for more than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    await prisma.escrow.updateMany({
      where: {
        status: EscrowStatus.CONFIRMED,
        buyerConfirmedAt: {
          lt: twentyFourHoursAgo
        }
      },
      data: {
        status: EscrowStatus.RELEASED,
        releasedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }
}