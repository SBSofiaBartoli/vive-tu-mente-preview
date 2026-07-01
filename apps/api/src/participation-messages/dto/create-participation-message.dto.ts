export type CreateParticipationMessageDto = {
  full_name: string;
  email: string;
  phone?: string;
  interest_area?: string;
  message: string;
};
