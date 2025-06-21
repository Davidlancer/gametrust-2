export type DashboardPage = 'overview' | 'listings' | 'create' | 'orders' | 'wallet' | 'disputes' | 'reviews' | 'settings' | 'saved' | 'referral';

export type BuyerDashboardPage = 'overview' | 'orders' | 'wallet' | 'referral' | 'disputes' | 'saved' | 'settings';

export interface NavigationItem {
  id: DashboardPage;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  route: string;
}