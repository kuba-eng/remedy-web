// Generic API Response Wrapper
export interface ClubspireResponse<T> {
    message: {
        httpStatus: number;
        type: string;
        code: string | null;
        clientMessage: string | null;
        verboseMessage: string | null;
        docUri: string | null;
    };
    data: T;
}

export interface ClubspireMetaInfo {
    href: string;
    mediaType: string;
}

export interface ClubspireIcon {
    metaInfo: ClubspireMetaInfo;
    id: string;
    nameBlack: string;
    nameGrey: string;
    nameWhite: string;
}

export interface ClubspireActivity {
    metaInfo?: ClubspireMetaInfo;
    id: string; // e.g. "980ad5ea..."
    name: string; // e.g. "Kompenzační a nápravové cvičení"
    description: string; // HTML allowed
    icon: ClubspireIcon;
    timeLineType?: string;
    tabIndex?: number;
    // Helper fields for UI (mapped from description or hardcoded if needed)
    price?: number;
    durationMinutes?: number;
}

export interface ClubspireInstructor {
    metaInfo?: ClubspireMetaInfo;
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneCode?: string;
    phoneNumber?: string;
    info: string; // HTML bio
    colorRgbHex?: string;
    photoHref?: string | null;
}

export interface ClubspireSlot {
    // This is provisional until we see real slot data.
    // Based on standard timeline structures:
    id?: string;
    start: string; // ISO
    end: string;
    activityId: string;
    instructorId?: string;
    capacity?: number;
    freeCapacity?: number;
}

export interface ReservationRequest {
    activityId: string;
    slotId?: string; // If slot-based
    start?: string; // If time-based
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        note?: string;
    }
}
