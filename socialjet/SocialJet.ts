/**
 * Host entry (`socialjet.js`): installs the one registry on `window.SocialJet`.
 * Everything else — built-in and third-party add-ons — registers through `@socialjet/sdk`.
 */
import {installRegistry} from "@socialjet/sdk";
import type {SocialJetType} from "@socialjet/sdk";

export {settingKey} from "@socialjet/sdk";
export const sj: SocialJetType = installRegistry();
