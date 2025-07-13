// social-press/global.d.ts
import {SocialJetType} from "./Types/SocialJetType.ts";

export {};

declare global {
    interface Window {
        SocialJet: SocialJetType;
        SocialJetRestUrl: string;
        SocialJetNonce: string;
        SocialJetCronUrl: string;
    }
}
