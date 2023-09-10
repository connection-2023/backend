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

interface SelectedDailyUsage {
  id: number;
  dailySentCount: number;
}

interface AxiosPostResult {
  status: boolean;
  error?: object;
}

export { SMSData, SelectedDailyUsage, AxiosPostResult };
