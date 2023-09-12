interface SMSData {
  type: string;
  contentType: string;
  countryCode: string;
  from: string;
  content: string;
  messages: [
    {
      to: string;
    },
  ];
}
export { SMSData };
