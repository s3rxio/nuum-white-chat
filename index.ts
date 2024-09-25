export type NuumUser = {
    user_id: number;
    user_login: string;
    user_profile: {
        created_at: string;
        deleted_at: null;
        updated_at: string;
        user_id: number;
        user_login: string;
        profile_description: string;
        profile_image: {
            large: string;
            medium: string;
            small: string;
        };
        profile_background: {
            large: string;
            medium: string;
            small: string;
        };
        channel_id: number;
        profile_is_live: boolean;
    };
    user_avatar: {};
    new_user_agreement: boolean;
    user_agreement: boolean;
    user_role: string;
    enabled_2fa: boolean;
    accept_2fa: boolean;
    user_email: string;
    user_phone: null;
    user_features: [string];
}

export type MessageListenerCallback = (author: string, message: string, div: HTMLDivElement) => {}

export type MessageListener = (callback: MessageListenerCallback) => {}