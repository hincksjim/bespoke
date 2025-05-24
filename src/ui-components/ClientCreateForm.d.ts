/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { AutocompleteProps, GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ClientCreateFormInputValues = {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    birthdate?: string;
    isactive?: boolean;
    Address1?: string;
    Address2?: string;
    City?: string;
    Postcode?: string;
    Housenumber?: string;
    updatedAt?: string;
    createdAt?: string;
    credits?: number;
    ipAddress?: string;
    Subscribed?: boolean;
    Role?: string;
    clientID?: any[];
    Country?: string;
    Currency?: string;
    IsArtisan?: boolean;
    Paywall?: number;
};
export declare type ClientCreateFormValidationValues = {
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    mobile?: ValidationFunction<string>;
    birthdate?: ValidationFunction<string>;
    isactive?: ValidationFunction<boolean>;
    Address1?: ValidationFunction<string>;
    Address2?: ValidationFunction<string>;
    City?: ValidationFunction<string>;
    Postcode?: ValidationFunction<string>;
    Housenumber?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    credits?: ValidationFunction<number>;
    ipAddress?: ValidationFunction<string>;
    Subscribed?: ValidationFunction<boolean>;
    Role?: ValidationFunction<string>;
    clientID?: ValidationFunction<any>;
    Country?: ValidationFunction<string>;
    Currency?: ValidationFunction<string>;
    IsArtisan?: ValidationFunction<boolean>;
    Paywall?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ClientCreateFormOverridesProps = {
    ClientCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    mobile?: PrimitiveOverrideProps<TextFieldProps>;
    birthdate?: PrimitiveOverrideProps<TextFieldProps>;
    isactive?: PrimitiveOverrideProps<SwitchFieldProps>;
    Address1?: PrimitiveOverrideProps<TextFieldProps>;
    Address2?: PrimitiveOverrideProps<TextFieldProps>;
    City?: PrimitiveOverrideProps<TextFieldProps>;
    Postcode?: PrimitiveOverrideProps<TextFieldProps>;
    Housenumber?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    credits?: PrimitiveOverrideProps<TextFieldProps>;
    ipAddress?: PrimitiveOverrideProps<TextFieldProps>;
    Subscribed?: PrimitiveOverrideProps<SwitchFieldProps>;
    Role?: PrimitiveOverrideProps<TextFieldProps>;
    clientID?: PrimitiveOverrideProps<AutocompleteProps>;
    Country?: PrimitiveOverrideProps<TextFieldProps>;
    Currency?: PrimitiveOverrideProps<TextFieldProps>;
    IsArtisan?: PrimitiveOverrideProps<SwitchFieldProps>;
    Paywall?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ClientCreateFormProps = React.PropsWithChildren<{
    overrides?: ClientCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ClientCreateFormInputValues) => ClientCreateFormInputValues;
    onSuccess?: (fields: ClientCreateFormInputValues) => void;
    onError?: (fields: ClientCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ClientCreateFormInputValues) => ClientCreateFormInputValues;
    onValidate?: ClientCreateFormValidationValues;
} & React.CSSProperties>;
export default function ClientCreateForm(props: ClientCreateFormProps): React.ReactElement;
