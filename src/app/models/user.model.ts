export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  subscriptionType?: string;
  subscriptionStatus?: string;
  creditsRemaining?: number;
  roles: string[];
}
