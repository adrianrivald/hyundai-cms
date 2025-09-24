export type AttendQRType = {
  code: string;
};

export type Participant = {
  data: {
    id: number;
    name: string;
    dob: string;
    sex: string;
    email: string;
    phone_number: string;
    is_leader: number;
    is_special_need: number;
    verification_code: string;
    verified_at: string;
    attended_at: string;
    tour: {
      name: string;
    };
  };
};
