interface RegisterConsents {
  termsOfService: boolean;
  talk: boolean;
  email: boolean;
  marketing: {
    marketingChannelTalk: boolean;
    marketingEmail: boolean;
  };
}

interface RegisterConsentAgreeList {
  name: string;
}

interface RegisterConsentInputData {
  userId: number;
  registerConsentId: number;
}

export { RegisterConsents, RegisterConsentAgreeList, RegisterConsentInputData };
