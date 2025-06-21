// Utility functions to test the Role Switcher functionality

/**
 * Sets up a mock user with both buyer and seller roles for testing
 */
export const setupDualRoleUser = () => {
  // Set up authenticated user
  const mockUser = {
    isAuthenticated: true,
    username: 'TestUser',
    userType: 'buyer',
    email: 'test@gametrust.com'
  };
  
  localStorage.setItem('mockUser', JSON.stringify(mockUser));
  
  // Set up onboarding completion
  localStorage.setItem('onboardingComplete', 'true');
  
  const onboardingData = {
    roles: ['buyer', 'seller'],
    games: ['Call of Duty Mobile', 'PUBG Mobile'],
    completedAt: new Date().toISOString()
  };
  
  localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
  
  // Set up user roles for RoleSwitcher
  localStorage.setItem('userRoles', JSON.stringify(['buyer', 'seller']));
  localStorage.setItem('userRole', 'buyer'); // Default to buyer
  
  console.log('✅ Dual role user setup complete!');
  console.log('🔄 Refresh the page to see the Role Switcher');
};

/**
 * Sets up a mock user with only buyer role
 */
export const setupBuyerOnlyUser = () => {
  const mockUser = {
    isAuthenticated: true,
    username: 'BuyerUser',
    userType: 'buyer',
    email: 'buyer@gametrust.com'
  };
  
  localStorage.setItem('mockUser', JSON.stringify(mockUser));
  localStorage.setItem('onboardingComplete', 'true');
  
  const onboardingData = {
    roles: ['buyer'],
    games: ['Call of Duty Mobile'],
    completedAt: new Date().toISOString()
  };
  
  localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
  localStorage.setItem('userRoles', JSON.stringify(['buyer']));
  localStorage.setItem('userRole', 'buyer');
  
  console.log('✅ Buyer-only user setup complete!');
  console.log('🔄 Refresh the page - Role Switcher should NOT appear');
};

/**
 * Sets up a mock user with only seller role
 */
export const setupSellerOnlyUser = () => {
  const mockUser = {
    isAuthenticated: true,
    username: 'SellerUser',
    userType: 'seller',
    email: 'seller@gametrust.com'
  };
  
  localStorage.setItem('mockUser', JSON.stringify(mockUser));
  localStorage.setItem('onboardingComplete', 'true');
  
  const onboardingData = {
    roles: ['seller'],
    games: ['PUBG Mobile'],
    completedAt: new Date().toISOString()
  };
  
  localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
  localStorage.setItem('userRoles', JSON.stringify(['seller']));
  localStorage.setItem('userRole', 'seller');
  
  console.log('✅ Seller-only user setup complete!');
  console.log('🔄 Refresh the page - Role Switcher should NOT appear');
};

/**
 * Clears all user data and logs out
 */
export const clearUserData = () => {
  localStorage.removeItem('mockUser');
  localStorage.removeItem('onboardingComplete');
  localStorage.removeItem('onboardingData');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userRoles');
  
  console.log('🧹 User data cleared!');
  console.log('🔄 Refresh the page to return to logged out state');
};

/**
 * Logs current user state for debugging
 */
export const debugUserState = () => {
  console.log('🔍 Current User State:');
  console.log('mockUser:', localStorage.getItem('mockUser'));
  console.log('userRoles:', localStorage.getItem('userRoles'));
  console.log('userRole:', localStorage.getItem('userRole'));
  console.log('onboardingComplete:', localStorage.getItem('onboardingComplete'));
};

// Make functions available globally for easy testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testRoleSwitcher = {
    setupDualRoleUser,
    setupBuyerOnlyUser,
    setupSellerOnlyUser,
    clearUserData,
    debugUserState
  };
  
  console.log('🧪 Role Switcher Test Utils loaded!');
  console.log('📝 Available commands:');
  console.log('  - testRoleSwitcher.setupDualRoleUser()');
  console.log('  - testRoleSwitcher.setupBuyerOnlyUser()');
  console.log('  - testRoleSwitcher.setupSellerOnlyUser()');
  console.log('  - testRoleSwitcher.clearUserData()');
  console.log('  - testRoleSwitcher.debugUserState()');
}