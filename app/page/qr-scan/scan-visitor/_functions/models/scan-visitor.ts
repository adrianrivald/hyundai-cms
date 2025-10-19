export type AttendQRType = {
  code: string;
};

export type AddVisitor = {
  name: string;
  dob: string;
  sex: string;
  email: string;
  phone_number: string;
  is_special_need: boolean;
  tour_number: string;
};

export type UpdateVisitor = AddVisitor & { id: number };

export type ParticipantsList = {
  data: {
    data: {
      id: number;
      tour_id: number;
      tour: {
        name: string;
      };
      name: string;
      dob: string;
      sex: string;
      email: string;
      phone_number: string;
      is_leader: boolean;
      is_special_need: boolean;
      verification_code: string;
      verified_at: string;
      attended_at: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
    }[];
  };
  message: string;
  date: string;
};

export type CalendarDaily = {
  data: {
    date: string;
    day: string;
    events: {
      id: number;
      holiday_name: string;
      start_date: string;
      end_date: string;
      description: string;
      created_at: string;
      updated_at: string;
    }[];
    slot: any[];
    verdict: boolean;
    total: {
      participants: number;
      verified: number;
      attended: number;
      verified_pct: number;
      attended_pct: number;
    };
  };
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
      province: string;
      group_type: string;
      allow_marketing: number;
      tour_date: string;
      slot: string;
      tour_number: string;
      tour_package: {
        name: string;
      };
    };
  };
};
