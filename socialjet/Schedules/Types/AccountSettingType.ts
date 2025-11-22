import {AccountType} from "../../Types/AccountType.ts";

export default interface AccountSettingType{
    account: AccountType,
    settings: Record<string, unknown>
}