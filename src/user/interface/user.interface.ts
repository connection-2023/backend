interface RegisterConsents {
  termsOfService: boolean;
  talk: boolean;
  email: boolean;
  marketing: {
    marketingChannelTalk: boolean;
    marketingEmail: boolean;
  };
}

export { RegisterConsents };
